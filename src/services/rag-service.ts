import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'

// Configuração do OpenAI para embeddings
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

interface VectorDocument {
  id: string
  content: string
  metadata: {
    table: string
    type: 'schema' | 'data' | 'relationship'
    fields?: string[]
    examples?: any[]
  }
  embedding?: number[]
}

interface RAGContext {
  relevantSchemas: VectorDocument[]
  relevantData: VectorDocument[]
  relationships: VectorDocument[]
  examples: VectorDocument[]
}

export class RAGService {
  private static vectorStore: VectorDocument[] = []
  private static isInitialized = false

  // Inicializar o vector store com schema e dados
  static async initialize() {
    if (this.isInitialized) return

    console.log('🚀 Inicializando RAG Service...')

    try {
      // 1. Indexar schemas das tabelas
      await this.indexTableSchemas()
      
      // 2. Indexar dados de exemplo
      await this.indexSampleData()
      
      // 3. Indexar relacionamentos
      await this.indexRelationships()
      
      // 4. Indexar exemplos de comandos
      await this.indexCommandExamples()

      this.isInitialized = true
      console.log(`✅ RAG Service inicializado com ${this.vectorStore.length} documentos`)
    } catch (error) {
      console.error('❌ Erro ao inicializar RAG Service:', error)
    }
  }

  // Indexar schemas das tabelas
  private static async indexTableSchemas() {
    const schemas = [
      {
        table: 'Pergunta',
        content: `Tabela Pergunta: Armazena perguntas do formulário dinâmico.
        Campos: id (String), texto (String), descricao (String?), tipo (String), opcoes (Json?), 
        ordem (Int), step (Int), obrigatoria (Boolean), condicional (Json?), geradaPorIA (Boolean),
        ativa (Boolean), categoria (String), fluxo (String), pontuacao (Int), mascaraValor (Boolean),
        sliderTipo (String?), sliderMin (Float?), sliderMax (Float?), insightIA (Boolean),
        mascaraCidade (Boolean), mascaraBairro (Boolean), configuracaoId (String?)
        
        Tipos válidos: text, select, radio, checkbox, range, textarea, email, phone, cpf, cnpj
        Categorias: avaliacao de credito, preferencias, localizacao, financeiro, pessoal
        Fluxos: principal, secundario, condicional`,
        fields: ['texto', 'tipo', 'categoria', 'fluxo', 'ordem', 'step', 'mascaraValor', 'insightIA']
      },
      {
        table: 'User',
        content: `Tabela User: Armazena usuários do sistema (clientes e admins).
        Campos: id (String), name (String), email (String), password (String), role (Role),
        telefone (String?), construtoraId (String?)
        
        Roles: ADMIN, CLIENTE, CONSTRUTORA
        Relacionamentos: belongsTo Construtora, hasMany Resposta, hasMany Relatorio`,
        fields: ['name', 'email', 'role', 'telefone']
      },
      {
        table: 'Construtora',
        content: `Tabela Construtora: Armazena empresas construtoras.
        Campos: id (String), nome (String), cnpj (String?), telefone (String?), 
        email (String?), endereco (String?), ativa (Boolean)
        
        Relacionamentos: hasMany User, hasMany Imovel`,
        fields: ['nome', 'cnpj', 'telefone', 'email', 'ativa']
      },
      {
        table: 'Imovel',
        content: `Tabela Imovel: Armazena imóveis disponíveis.
        Campos: id (String), titulo (String), descricao (String?), preco (Float), 
        area (Float?), quartos (Int?), banheiros (Int?), vagas (Int?), 
        latitude (Float?), longitude (Float?), endereco (String), 
        construtoraId (String), ativo (Boolean), status (String?)
        
        Relacionamentos: belongsTo Construtora, hasMany Match`,
        fields: ['titulo', 'preco', 'quartos', 'banheiros', 'endereco', 'ativo']
      },
      {
        table: 'Resposta',
        content: `Tabela Resposta: Armazena respostas dos usuários às perguntas.
        Campos: id (String), valor (String), perguntaId (String), userId (String)
        
        Relacionamentos: belongsTo Pergunta, belongsTo User`,
        fields: ['valor', 'perguntaId', 'userId']
      }
    ]

    for (const schema of schemas) {
      const doc: VectorDocument = {
        id: `schema_${schema.table}`,
        content: schema.content,
        metadata: {
          table: schema.table,
          type: 'schema',
          fields: schema.fields
        }
      }
      
      // Gerar embedding
      doc.embedding = await this.generateEmbedding(schema.content)
      this.vectorStore.push(doc)
    }
  }

  // Indexar dados de exemplo
  private static async indexSampleData() {
    try {
      // Buscar algumas perguntas de exemplo
      const perguntas = await prisma.pergunta.findMany({
        take: 10,
        orderBy: { ordem: 'asc' }
      })

      if (perguntas.length > 0) {
        const perguntasContent = `Exemplos de perguntas existentes:
        ${perguntas.map(p => `- ${p.texto} (tipo: ${p.tipo}, categoria: ${p.categoria})`).join('\n')}
        
        Total de perguntas ativas: ${perguntas.length}`

        const doc: VectorDocument = {
          id: 'data_perguntas_sample',
          content: perguntasContent,
          metadata: {
            table: 'Pergunta',
            type: 'data',
            examples: perguntas.map(p => ({
              texto: p.texto,
              tipo: p.tipo,
              categoria: p.categoria,
              ordem: p.ordem
            }))
          }
        }
        
        doc.embedding = await this.generateEmbedding(perguntasContent)
        this.vectorStore.push(doc)
      }

      // Buscar construtoras de exemplo
      const construtoras = await prisma.construtora.findMany({
        take: 5,
        where: { ativa: true }
      })

      if (construtoras.length > 0) {
        const construtorasContent = `Exemplos de construtoras ativas:
        ${construtoras.map(c => `- ${c.nome} (${c.email || 'sem email'})`).join('\n')}
        
        Total de construtoras ativas: ${construtoras.length}`

        const doc: VectorDocument = {
          id: 'data_construtoras_sample',
          content: construtorasContent,
          metadata: {
            table: 'Construtora',
            type: 'data',
            examples: construtoras.map(c => ({
              nome: c.nome,
              email: c.email,
              ativa: c.ativa
            }))
          }
        }
        
        doc.embedding = await this.generateEmbedding(construtorasContent)
        this.vectorStore.push(doc)
      }
    } catch (error) {
      console.error('Erro ao indexar dados de exemplo:', error)
    }
  }

  // Indexar relacionamentos entre tabelas
  private static async indexRelationships() {
    const relationships = [
      {
        content: `Relacionamentos principais:
        - User pertence a Construtora (construtoraId)
        - User tem muitas Respostas (userId)
        - Pergunta tem muitas Respostas (perguntaId)
        - Construtora tem muitos Imoveis (construtoraId)
        - Construtora tem muitos Users (construtoraId)
        
        Para buscar dados relacionados, use JOINs:
        - Respostas com Perguntas: JOIN Pergunta ON Resposta.perguntaId = Pergunta.id
        - Respostas com Users: JOIN User ON Resposta.userId = User.id
        - Imoveis com Construtoras: JOIN Construtora ON Imovel.construtoraId = Construtora.id`
      }
    ]

    for (const rel of relationships) {
      const doc: VectorDocument = {
        id: 'relationships_main',
        content: rel.content,
        metadata: {
          table: 'all',
          type: 'relationship'
        }
      }
      
      doc.embedding = await this.generateEmbedding(rel.content)
      this.vectorStore.push(doc)
    }
  }

  // Indexar exemplos de comandos
  private static async indexCommandExamples() {
    const examples = [
      {
        content: `Exemplos de comandos CREATE:
        "Crie uma pergunta sobre renda" → INSERT INTO Pergunta (texto, tipo, categoria, fluxo, ordem, step) VALUES ('Qual sua renda mensal?', 'text', 'financeiro', 'principal', 1, 1)
        "Adicione construtora ABC" → INSERT INTO Construtora (nome, ativa) VALUES ('ABC Construções', true)
        "Nova pergunta de telefone" → INSERT INTO Pergunta (texto, tipo, categoria, fluxo, ordem, step) VALUES ('Qual seu telefone?', 'phone', 'pessoal', 'principal', 1, 1)`
      },
      {
        content: `Exemplos de comandos READ:
        "Quantas perguntas ativas" → SELECT COUNT(*) FROM Pergunta WHERE ativa = true
        "Liste construtoras" → SELECT nome, email FROM Construtora WHERE ativa = true
        "Mostre respostas do usuário X" → SELECT r.valor, p.texto FROM Resposta r JOIN Pergunta p ON r.perguntaId = p.id WHERE r.userId = 'X'`
      },
      {
        content: `Exemplos de comandos UPDATE:
        "Atualize pergunta ID 123" → UPDATE Pergunta SET texto = 'Novo texto' WHERE id = '123'
        "Desative construtora ABC" → UPDATE Construtora SET ativa = false WHERE nome = 'ABC'
        "Mude categoria da pergunta" → UPDATE Pergunta SET categoria = 'nova_categoria' WHERE id = 'X'`
      },
      {
        content: `Exemplos de comandos DELETE:
        "Delete pergunta ID 123" → DELETE FROM Pergunta WHERE id = '123' (PRECISA CONFIRMAÇÃO)
        "Remova construtora inativa" → DELETE FROM Construtora WHERE ativa = false AND id = 'X' (PRECISA CONFIRMAÇÃO)
        "Apague resposta" → DELETE FROM Resposta WHERE id = 'X' (PRECISA CONFIRMAÇÃO)`
      }
    ]

    for (let i = 0; i < examples.length; i++) {
      const doc: VectorDocument = {
        id: `examples_${i}`,
        content: examples[i].content,
        metadata: {
          table: 'all',
          type: 'schema'
        }
      }
      
      doc.embedding = await this.generateEmbedding(examples[i].content)
      this.vectorStore.push(doc)
    }
  }

  // Gerar embedding usando OpenAI
  private static async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text
      })
      
      return response.data[0].embedding
    } catch (error) {
      console.error('Erro ao gerar embedding:', error)
      return []
    }
  }

  // Busca semântica por similaridade
  private static cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0
    
    let dotProduct = 0
    let normA = 0
    let normB = 0
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }

  // Buscar contexto relevante para uma query
  static async getRelevantContext(query: string): Promise<RAGContext> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    // Gerar embedding da query
    const queryEmbedding = await this.generateEmbedding(query)
    
    // Calcular similaridades
    const similarities = this.vectorStore.map(doc => ({
      doc,
      similarity: doc.embedding ? this.cosineSimilarity(queryEmbedding, doc.embedding) : 0
    }))
    
    // Ordenar por similaridade
    similarities.sort((a, b) => b.similarity - a.similarity)
    
    // Pegar os mais relevantes
    const topDocs = similarities.slice(0, 8).map(s => s.doc)
    
    // Separar por tipo
    const context: RAGContext = {
      relevantSchemas: topDocs.filter(d => d.metadata.type === 'schema'),
      relevantData: topDocs.filter(d => d.metadata.type === 'data'),
      relationships: topDocs.filter(d => d.metadata.type === 'relationship'),
      examples: topDocs.filter(d => d.metadata.type === 'schema' && d.id.startsWith('examples_'))
    }
    
    return context
  }

  // Gerar prompt enriquecido com contexto RAG
  static async generateEnrichedPrompt(userQuery: string): Promise<string> {
    const context = await this.getRelevantContext(userQuery)
    
    let prompt = `Você é um assistente especializado em gerenciar banco de dados do sistema iMovia usando RAG (Retrieval-Augmented Generation).

CONTEXTO RELEVANTE RECUPERADO:

`

    // Adicionar schemas relevantes
    if (context.relevantSchemas.length > 0) {
      prompt += `SCHEMAS RELEVANTES:\n`
      context.relevantSchemas.forEach(doc => {
        prompt += `${doc.content}\n\n`
      })
    }

    // Adicionar dados relevantes
    if (context.relevantData.length > 0) {
      prompt += `DADOS EXISTENTES:\n`
      context.relevantData.forEach(doc => {
        prompt += `${doc.content}\n\n`
      })
    }

    // Adicionar relacionamentos
    if (context.relationships.length > 0) {
      prompt += `RELACIONAMENTOS:\n`
      context.relationships.forEach(doc => {
        prompt += `${doc.content}\n\n`
      })
    }

    // Adicionar exemplos
    if (context.examples.length > 0) {
      prompt += `EXEMPLOS SIMILARES:\n`
      context.examples.forEach(doc => {
        prompt += `${doc.content}\n\n`
      })
    }

    prompt += `
INSTRUÇÕES:
1. Use o contexto acima para entender melhor a solicitação
2. Gere SQL preciso baseado no schema real
3. Considere os dados existentes para evitar duplicatas
4. Use relacionamentos apropriados quando necessário
5. Siga os exemplos similares para padrões corretos

FORMATO DE RESPOSTA (JSON):
{
  "action": "create|read|update|delete|info",
  "sql": "comando SQL seguro",
  "explanation": "explicação clara da operação",
  "needsConfirmation": boolean,
  "confidence": number (0-1),
  "contextUsed": ["lista de contextos utilizados"]
}

SOLICITAÇÃO DO USUÁRIO: ${userQuery}
`

    return prompt
  }

  // Atualizar vector store com novos dados
  static async updateVectorStore() {
    console.log('🔄 Atualizando vector store...')
    this.vectorStore = []
    this.isInitialized = false
    await this.initialize()
  }
}
