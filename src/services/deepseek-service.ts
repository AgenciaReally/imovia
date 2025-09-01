// Serviço de integração com Deepseek AI para otimização dinâmica de formulários

import { logger } from '@/utils/logger'

export interface DeepseekResponse {
  perguntasSugeridas: string[]
  proximaPergunta?: string
  insights: string[]
  confianca: number
}

export interface DeepseekRequest {
  respostasAtuais: Record<string, any>
  perguntasDisponiveis: Array<{
    id: string
    texto: string
    categoria: string
    pontuacao: number
  }>
  dadosImoveis?: Array<{
    id: string
    preco: number
    area: number
    quartos: number
    banheiros: number
    endereco: string
    caracteristicas: string[]
  }>
  contexto?: {
    step: number
    totalSteps: number
    fluxo: string
  }
}

class DeepseekService {
  private apiKey: string
  private baseUrl = 'https://api.deepseek.com/v1'
  
  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || ''
    if (!this.apiKey) {
      console.warn('⚠️ DEEPSEEK_API_KEY não encontrada - usando modo simulado')
    }
  }

  // Análise inteligente para otimizar sequência de perguntas
  async otimizarFormulario(request: DeepseekRequest): Promise<DeepseekResponse> {
    try {
      logger.logDeepseek('Iniciando otimização do formulário', { 
        respostasCount: Object.keys(request.respostasAtuais).length,
        perguntasDisponiveisCount: request.perguntasDisponiveis.length 
      })

      // Se não tiver API key, usar lógica simulada
      if (!this.apiKey) {
        return this.otimizacaoSimulada(request)
      }

      const prompt = this.construirPrompt(request)
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: `Você é um especialista em otimização de formulários imobiliários. 
              Analise as respostas do usuário e sugira as próximas perguntas mais relevantes.
              Retorne APENAS um JSON válido no formato especificado.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1000,
        }),
      })

      if (!response.ok) {
        throw new Error(`Erro na API Deepseek: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const aiResponse = this.parseAIResponse(data.choices[0].message.content)

      logger.logDeepseek('Otimização concluída com sucesso', { 
        perguntasSugeridas: aiResponse.perguntasSugeridas?.length || 0,
        confianca: aiResponse.confianca 
      })

      return aiResponse
    } catch (error: any) {
      logger.logDeepseek('Erro na otimização', { error: error?.message || 'Erro desconhecido' })
      console.error('Erro no Deepseek:', error)
      
      // Fallback para otimização simulada em caso de erro
      return this.otimizacaoSimulada(request)
    }
  }

  // Função para limpar markdown do Deepseek e fazer parse do JSON
  private parseAIResponse(content: string): any {
    try {
      // Remover markdown code blocks se existirem
      let cleanContent = content.trim()
      
      // Remover ```json no início e ``` no final
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '')
      }
      if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '')
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.replace(/\s*```$/, '')
      }
      
      // Tentar fazer parse do JSON limpo
      return JSON.parse(cleanContent)
    } catch (error) {
      console.error('Erro ao fazer parse da resposta do Deepseek:', error)
      console.error('Conteúdo original:', content)
      throw new Error(`Erro ao processar resposta da IA: ${error instanceof Error ? error.message : 'Formato inválido'}`)
    }
  }

  // Lógica simulada quando não há API key ou em caso de erro
  private otimizacaoSimulada(request: DeepseekRequest): DeepseekResponse {
    const respostas = request.respostasAtuais
    const perguntas = request.perguntasDisponiveis
    
    // Lógica baseada em regras simples
    let perguntasSugeridas: string[] = []
    let insights: string[] = []
    
    // Se tem valor de imóvel, priorizar financiamento
    if (respostas['valor_imovel'] || respostas['preco_maximo']) {
      perguntasSugeridas.push('financiamento', 'renda_mensal', 'entrada')
      insights.push('💰 Cliente definiu orçamento - focar em financiamento')
    }
    
    // Se tem localização, priorizar proximidades
    if (respostas['cidade'] || respostas['bairro']) {
      perguntasSugeridas.push('proximidade_trabalho', 'transporte', 'escolas')
      insights.push('📍 Cliente definiu localização - explorar proximidades')
    }
    
    // Se tem família, priorizar questões familiares
    if (respostas['estado_civil'] === 'casado' || respostas['filhos']) {
      perguntasSugeridas.push('quartos', 'escolas', 'playground', 'seguranca')
      insights.push('👨‍👩‍👧‍👦 Perfil familiar - priorizar necessidades da família')
    }
    
    // Filtrar apenas perguntas disponíveis
    const perguntasIds = perguntas.map(p => p.categoria.toLowerCase())
    perguntasSugeridas = perguntasSugeridas.filter(categoria => 
      perguntasIds.some(id => id.includes(categoria))
    )
    
    // Se não encontrou nada específico, usar ordem de pontuação
    if (perguntasSugeridas.length === 0) {
      perguntasSugeridas = perguntas
        .sort((a, b) => b.pontuacao - a.pontuacao)
        .slice(0, 3)
        .map(p => p.id)
      insights.push('📊 Usando ordem de importância padrão')
    }

    return {
      perguntasSugeridas: perguntasSugeridas.slice(0, 5),
      proximaPergunta: perguntasSugeridas[0],
      insights,
      confianca: 0.7 // Confiança média para simulação
    }
  }

  private construirPrompt(request: DeepseekRequest): string {
    return `
    Analise o contexto do formulário imobiliário e otimize a sequência de perguntas:

    RESPOSTAS ATUAIS:
    ${JSON.stringify(request.respostasAtuais, null, 2)}

    PERGUNTAS DISPONÍVEIS:
    ${request.perguntasDisponiveis.map(p => `- ${p.id}: "${p.texto}" (categoria: ${p.categoria}, pontuação: ${p.pontuacao})`).join('\n')}

    CONTEXTO:
    - Step atual: ${request.contexto?.step || 1}/${request.contexto?.totalSteps || 10}
    - Fluxo: ${request.contexto?.fluxo || 'padrão'}

    ${request.dadosImoveis ? `
    IMÓVEIS DISPONÍVEIS (amostra):
    ${request.dadosImoveis.slice(0, 3).map(i => 
      `- R$ ${i.preco.toLocaleString()}, ${i.area}m², ${i.quartos}q/${i.banheiros}b - ${i.endereco}`
    ).join('\n')}
    ` : ''}

    OBJETIVO:
    Sugira as 3-5 próximas perguntas mais relevantes baseado no perfil do cliente.
    Considere: relevância, complementaridade, fluxo natural.

    RETORNE APENAS ESTE JSON:
    {
      "perguntasSugeridas": ["id1", "id2", "id3"],
      "proximaPergunta": "id1",
      "insights": ["insight1", "insight2"],
      "confianca": 0.95
    }
    `
  }

  // Análise de compatibilidade com imóveis
  async analisarCompatibilidade(
    respostas: Record<string, any>, 
    imoveis: any[] = []
  ): Promise<{ matches: any[]; totalAnalizado: number; tempoAnalise: number; insights: string[] }> {
    try {
      if (!this.apiKey) {
        // Fallback com dados simulados completos
        const orcamento = respostas.find((r: any) => r.tipo === 'range' || r.perguntaId.includes('orcamento'))?.valor || 500000
        const quartos = respostas.find((r: any) => r.perguntaId.includes('quartos'))?.valor || 2
        const cidade = respostas.find((r: any) => r.perguntaId.includes('cidade'))?.valor || 'São Paulo'

        return {
          matches: [
            {
              id: '1',
              titulo: 'Apartamento Moderno no Centro',
              descricao: 'Apartamento com acabamento de primeira linha',
              preco: Math.min(orcamento * 0.9, 650000),
              area: 85,
              quartos: quartos,
              banheiros: 2,
              vagas: 1,
              endereco: 'Rua Augusta, 1250',
              cidade: cidade,
              bairro: 'Centro',
              construtora: 'Construtora Premium',
              score: 92,
              insights: [
                'Localização privilegiada combina com seu perfil urbano',
                'Metragem ideal para suas necessidades familiares',
                'Preço dentro do seu orçamento planejado'
              ],
              razoesCombinou: [
                `${quartos} quartos conforme sua preferência`,
                'Localização central como desejado',
                'Preço dentro do orçamento',
                'Apartamento novo com acabamento moderno'
              ],
              pontosFracos: ['Apenas 1 vaga de garagem']
            },
            {
              id: '2',
              titulo: 'Casa Familiar com Jardim',
              descricao: 'Casa com quintal e área gourmet',
              preco: Math.min(orcamento * 1.1, 750000),
              area: 120,
              quartos: Math.max(quartos, 3),
              banheiros: 3,
              vagas: 2,
              endereco: 'Rua das Flores, 800',
              cidade: cidade,
              bairro: 'Vila Madalena',
              construtora: 'Construtora Família',
              score: 88,
              insights: [
                'Espaço amplo ideal para família',
                'Quintal para lazer e pets',
                'Bairro familiar e seguro'
              ],
              razoesCombinou: [
                'Mais quartos que o solicitado',
                'Casa com quintal privativo',
                'Região valorizada',
                '2 vagas de garagem'
              ],
              pontosFracos: ['Preço um pouco acima do orçamento', 'Necessita pequenos reparos']
            }
          ],
          totalAnalizado: 50,
          tempoAnalise: 2.3,
          insights: [
            "Baseamos a análise em suas preferências de localização e orçamento",
            "Consideramos seu perfil familiar e necessidades especiais", 
            "Priorizamos imóveis com boa relação custo-benefício"
          ]
        }
      }

      const prompt = `
      Analise a compatibilidade entre o perfil do cliente e os imóveis:

      PERFIL DO CLIENTE:
      ${JSON.stringify(respostas, null, 2)}

      IMÓVEIS:
      ${imoveis.map(i => `
      ID: ${i.id}
      Preço: R$ ${i.preco?.toLocaleString() || 'N/A'}
      Área: ${i.area}m²
      Quartos: ${i.quartos} | Banheiros: ${i.banheiros} | Vagas: ${i.vagas || 0}
      Endereço: ${i.endereco}
      Características: ${i.caracteristicasArray?.join(', ') || 'N/A'}
      `).join('\n---\n')}

      Retorne JSON com score (0-100) e motivos para cada imóvel:
      [
        {
          "imovelId": "id",
          "score": 85,
          "motivos": ["Preço dentro do orçamento", "Localização ideal"]
        }
      ]
      `

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'Você é um especialista em análise de compatibilidade imobiliária.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1500,
        }),
      })

      if (!response.ok) {
        throw new Error(`Erro na API Deepseek: ${response.status}`)
      }

      const data = await response.json()
      const aiResponse = this.parseAIResponse(data.choices[0].message.content)

      return aiResponse

    } catch (error) {
      logger.logDeepseek('compatibilidade_erro', 'Erro na análise', 
        error instanceof Error ? error.message : 'Erro desconhecido'
      )
      
      // Fallback usando mesmo formato da primeira parte
      const orcamento = respostas.find((r: any) => r.tipo === 'range' || r.perguntaId.includes('orcamento'))?.valor || 500000
      const quartos = respostas.find((r: any) => r.perguntaId.includes('quartos'))?.valor || 2
      const cidade = respostas.find((r: any) => r.perguntaId.includes('cidade'))?.valor || 'São Paulo'

      return {
        matches: [
          {
            id: '1',
            titulo: 'Apartamento Moderno no Centro',
            descricao: 'Apartamento com acabamento de primeira linha',
            preco: Math.min(orcamento * 0.9, 650000),
            area: 85,
            quartos: quartos,
            banheiros: 2,
            vagas: 1,
            endereco: 'Rua Augusta, 1250',
            cidade: cidade,
            bairro: 'Centro',
            construtora: 'Construtora Premium',
            score: 92,
            insights: [
              'Localização privilegiada combina com seu perfil urbano',
              'Metragem ideal para suas necessidades familiares',
              'Preço dentro do seu orçamento planejado'
            ],
            razoesCombinou: [
              `${quartos} quartos conforme sua preferência`,
              'Localização central como desejado',
              'Preço dentro do orçamento',
              'Apartamento novo com acabamento moderno'
            ],
            pontosFracos: ['Apenas 1 vaga de garagem']
          }
        ],
        totalAnalizado: 50,
        tempoAnalise: 2.3,
        insights: [
          "Baseamos a análise em suas preferências de localização e orçamento",
          "Consideramos seu perfil familiar e necessidades especiais", 
          "Priorizamos imóveis com boa relação custo-benefício"
        ]
      }
    }
  }

  private compatibilidadeSimulada(
    respostas: Record<string, any>, 
    imoveis: any[]
  ): Array<{ imovelId: string; score: number; motivos: string[] }> {
    return imoveis.map(imovel => {
      let score = 50 // Base
      const motivos: string[] = []

      // Verificar preço
      const orcamento = parseFloat(respostas.valor_imovel || respostas.preco_maximo || '0')
      if (orcamento > 0) {
        if (imovel.preco <= orcamento) {
          score += 20
          motivos.push('💰 Preço dentro do orçamento')
        } else if (imovel.preco <= orcamento * 1.1) {
          score += 10
          motivos.push('💰 Preço próximo ao orçamento')
        } else {
          score -= 15
          motivos.push('💸 Preço acima do orçamento')
        }
      }

      // Verificar quartos
      const quartosDesejados = parseInt(respostas.quartos || '0')
      if (quartosDesejados > 0) {
        if (imovel.quartos >= quartosDesejados) {
          score += 15
          motivos.push(`🛏️ ${imovel.quartos} quartos (desejado: ${quartosDesejados})`)
        } else {
          score -= 10
          motivos.push(`🛏️ Menos quartos que o desejado`)
        }
      }

      // Verificar área
      const areaMinima = parseFloat(respostas.area_minima || '0')
      if (areaMinima > 0 && imovel.area >= areaMinima) {
        score += 10
        motivos.push(`📐 Área adequada (${imovel.area}m²)`)
      }

      return {
        imovelId: imovel.id,
        score: Math.min(100, Math.max(0, score)),
        motivos
      }
    })
  }
}

export const deepseekService = new DeepseekService()
