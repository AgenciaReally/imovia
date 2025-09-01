import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { RAGService } from '@/services/rag-service'
import { authenticate } from '@/lib/auth'

// Configuração do Deepseek
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

interface DeepseekMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// Sistema de prompts para diferentes operações
const SYSTEM_PROMPTS = {
  base: `Você é um assistente especializado em gerenciar dados do sistema iMovia através de comandos SQL seguros.

REGRAS IMPORTANTES:
1. NUNCA execute comandos DELETE ou DROP sem confirmação explícita
2. Use SEMPRE transações para operações críticas
3. Valide dados antes de inserir/atualizar
4. Retorne sempre JSON estruturado
5. Para consultas, limite resultados (LIMIT 50)
{
  "action": "create|read|update|delete|info",
  "sql": "comando SQL seguro (apenas para create/update/delete)",
  "explanation": "explicação clara da operação",
  "needsConfirmation": boolean,
  "data": {} // dados relevantes para exibição
}

TABELAS DISPONÍVEIS:
- Pergunta: id, texto, descricao, tipo, opcoes, ordem, step, obrigatoria, condicional, geradaPorIA, ativa, categoria, fluxo, pontuacao, mascaraValor, sliderTipo, sliderMin, sliderMax, insightIA, mascaraCidade, mascaraBairro, configuracaoId
- Resposta: id, perguntaId, userId, valor, createdAt
- User: id, name, email, role, createdAt
- Construtora: id, nome, ativa, createdAt
- Imovel: id, titulo, descricao, preco, quartos, banheiros, construtoraId

CAMPOS OBRIGATÓRIOS PARA PERGUNTA:
- texto (String): Texto da pergunta
- tipo (String): text, select, radio, checkbox, range, textarea, email, phone, cpf, cnpj
- categoria (String): "avaliacao de credito", "preferencias", "localizacao", "financeiro", "pessoal"
- fluxo (String): "principal", "secundario", "condicional"
- ordem (Int): Posição da pergunta
- step (Int): Etapa do formulário (padrão: 1)

CAMPOS OPCIONAIS COM PADRÕES:
- obrigatoria (Boolean): padrão true
- ativa (Boolean): padrão true  
- geradaPorIA (Boolean): padrão false
- pontuacao (Int): padrão 1
- mascaraValor (Boolean): padrão false (ativar com "mascara", "ativar mascara")
- insightIA (Boolean): padrão false (ativar com "insight", "ativar insight")

INTERPRETAÇÃO DE COMANDOS NATURAIS:

CRIAR/ADICIONAR (action: "create"):
- Palavras-chave: "crie", "criar", "adicione", "adicionar", "novo", "nova", "cadastre", "cadastrar", "insere", "inserir"
- Exemplos: "crie uma pergunta", "adiciona nova pergunta", "cadastrar pergunta", "quero criar"
- Para PERGUNTAS: extraia texto, tipo, categoria, step/ordem, mascara, insight
- Tipos válidos: text, select, radio, checkbox, range, textarea, email, phone, cpf, cnpj
- Categorias: "avaliacao de credito", "preferencias", "localizacao", "financeiro", "pessoal"

LER/CONSULTAR (action: "read"):
- Palavras-chave: "mostre", "liste", "veja", "consulte", "quantos", "quantas", "busque", "procure"
- Exemplos: "mostre perguntas", "quantas perguntas", "liste clientes"

ATUALIZAR/EDITAR (action: "update"):
- Palavras-chave: "atualize", "edite", "modifique", "altere", "mude", "corrija"
- Exemplos: "edite a pergunta", "atualize o texto", "mude categoria"

DELETAR/REMOVER (action: "delete"):
- Palavras-chave: "delete", "remova", "exclua", "apague", "tire"
- Sempre needsConfirmation: true

REGRAS DE SEGURANÇA:
- NUNCA execute: DROP, TRUNCATE, ALTER TABLE
- Para DELETE sempre defina needsConfirmation: true
- Use WHERE específico em UPDATE/DELETE
- Valide dados antes de INSERT

EXEMPLOS DE INTERPRETAÇÃO:
"Crie uma nova pergunta sobre renda, tipo text, 'Qual e o valor do bilhao?', step 1, categoria: avaliacao de credito, ativar mascara, ativar insight"
→ SQL: INSERT INTO "Pergunta" (texto, tipo, categoria, fluxo, ordem, step, mascaraValor, insightIA, ativa, obrigatoria, geradaPorIA, pontuacao) VALUES ('Qual é o valor do bilhão?', 'text', 'avaliacao de credito', 'principal', 1, 1, true, true, true, true, false, 1)

"adiciona pergunta de telefone"  
→ SQL: INSERT INTO "Pergunta" (texto, tipo, categoria, fluxo, ordem, step, ativa, obrigatoria, geradaPorIA, pontuacao) VALUES ('Qual é o seu telefone?', 'phone', 'pessoal', 'principal', 1, 1, true, true, false, 1)

"quantas perguntas tem"
→ SQL: SELECT COUNT(*) FROM "Pergunta" WHERE ativa = true

"delete pergunta id 5"
→ SQL: DELETE FROM "Pergunta" WHERE id = '5' (com confirmação)

IMPORTANTE: 
- Use aspas duplas para nomes de tabelas e colunas: "Pergunta", "texto"
- SEMPRE inclua campos obrigatórios: texto, tipo, categoria, fluxo, ordem
- Para ordem, use a próxima disponível ou o valor especificado
- fluxo padrão é "principal"`,
  query: `Foque em consultas SELECT seguras. Use JOINs quando necessário para trazer dados relacionados.`,
  
  insert: `Para inserções, valide todos os campos obrigatórios e use valores padrão apropriados.`,
  
  update: `Para atualizações, sempre use WHERE com condições específicas. Nunca UPDATE sem WHERE.`,
  
  delete: `Para exclusões, SEMPRE peça confirmação e explique o impacto da operação.`
}

// Função para chamar a API do Deepseek
async function callDeepseek(messages: DeepseekMessage[]): Promise<any> {
  try {
    console.log('Enviando para Deepseek:', { message: messages[1].content, systemPrompt: messages[0].content.substring(0, 200) + '...' })
    
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature: 0.1,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error(`Deepseek API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content
  } catch (error) {
    console.error('Erro ao chamar Deepseek:', error)
    throw new Error('Falha na comunicação com a IA')
  }
}

// Função para executar SQL de forma segura
async function executeSafeSQL(sql: string, action: string): Promise<any> {
  try {
    // Validações de segurança
    const upperSQL = sql.toUpperCase().trim()
    
    // Bloquear comandos perigosos
    const dangerousCommands = ['DROP', 'TRUNCATE', 'ALTER TABLE', 'CREATE TABLE']
    for (const cmd of dangerousCommands) {
      if (upperSQL.includes(cmd)) {
        throw new Error(`Comando ${cmd} não permitido por segurança`)
      }
    }

    // Executar baseado no tipo de ação
    switch (action) {
      case 'query':
        return await prisma.$queryRawUnsafe(sql)
      
      case 'insert':
      case 'update':
      case 'delete':
        const result = await prisma.$executeRawUnsafe(sql)
        return { affectedRows: result }
      
      default:
        throw new Error('Tipo de ação não reconhecido')
    }
  } catch (error) {
    console.error('Erro ao executar SQL:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação básica (pode ser melhorada com sessões)
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { message, action_type = 'query' } = await request.json()
    console.log('📝 Mensagem recebida:', message)
    console.log('🔧 Tipo de ação:', action_type)

    if (!message) {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      )
    }

    // Preparar mensagens para o Deepseek
    const messages: DeepseekMessage[] = [
      {
        role: 'system',
        content: `${SYSTEM_PROMPTS.base}\n\n${SYSTEM_PROMPTS[action_type as keyof typeof SYSTEM_PROMPTS] || ''}`
      },
      {
        role: 'user',
        content: `Usuário atual: sistema
        
Solicitação: ${message}

Por favor, gere o comando SQL apropriado e retorne no formato JSON especificado.`
      }
    ]

    // Chamar Deepseek
    const aiResponse = await callDeepseek(messages)
    console.log('🤖 Resposta da IA:', aiResponse)
    
    let parsedResponse
    try {
      // Tentar extrair JSON da resposta
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0])
        console.log('📋 JSON parseado:', parsedResponse)
      } else {
        throw new Error('Resposta não contém JSON válido')
      }
    } catch (error) {
      console.error('❌ Erro ao parsear JSON:', error)
      return NextResponse.json({
        error: 'Erro ao processar resposta da IA',
        aiResponse,
        details: error
      }, { status: 500 })
    }

    // Verificar se precisa de confirmação
    if (parsedResponse.requires_confirmation) {
      return NextResponse.json({
        type: 'confirmation_required',
        message: parsedResponse.explanation,
        sql: parsedResponse.sql,
        action: parsedResponse.action
      })
    }

    // Executar SQL se necessário
    if (parsedResponse.sql && ['create', 'update', 'delete'].includes(parsedResponse.action)) {
      try {
        console.log('💾 Executando SQL:', parsedResponse.sql)
        const result = await executeSafeSQL(parsedResponse.sql, parsedResponse.action)
        console.log('✅ Resultado da execução:', result)
        return NextResponse.json({
          type: 'success',
          message: parsedResponse.explanation,
          sql: parsedResponse.sql,
          result,
          aiResponse: parsedResponse
        })
      } catch (error) {
        console.error('❌ Erro ao executar SQL:', error)
        return NextResponse.json({
          type: 'error',
          message: `Erro ao executar operação: ${error}`,
          sql: parsedResponse.sql,
          aiResponse: parsedResponse
        }, { status: 500 })
      }
    }

    return NextResponse.json({
      type: 'info',
      message: parsedResponse.explanation || 'Operação processada',
      aiResponse: parsedResponse
    })

  } catch (error) {
    console.error('Erro na API deepseek-chat:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

// Endpoint para confirmar operações que precisam de confirmação
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { sql, action, confirmed } = await request.json()

    if (!confirmed) {
      return NextResponse.json(
        { error: 'Operação cancelada pelo usuário' },
        { status: 400 }
      )
    }

    if (!sql || !action) {
      return NextResponse.json(
        { error: 'SQL e action são obrigatórios' },
        { status: 400 }
      )
    }

    // Executar SQL confirmado
    const result = await executeSafeSQL(sql, action)
    
    return NextResponse.json({
      type: 'success',
      message: 'Operação executada com sucesso',
      sql,
      action,
      data: result
    })

  } catch (error) {
    console.error('Erro ao confirmar operação:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao executar operação confirmada',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
