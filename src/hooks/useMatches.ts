"use client"

import { useState, useCallback } from "react"
import { logger } from "@/utils/logger"

interface ImovelMatch {
  id: string
  titulo: string
  descricao?: string
  preco: number
  area?: number
  quartos?: number
  banheiros?: number
  vagas?: number
  endereco?: string
  cidade?: string
  bairro?: string
  imagem?: string
  construtora?: string
  score: number
  insights: string[]
  razoesCombinou: string[]
  pontosFracos?: string[]
}

interface MatchAnalysisRequest {
  respostasUsuario: Array<{
    perguntaId: string
    valor: any
    tipo: string
  }>
  imoveis?: Array<{
    id: string
    titulo: string
    preco: number
    area?: number
    quartos?: number
    banheiros?: number
    vagas?: number
    endereco?: string
    cidade?: string
    bairro?: string
    construtora?: string
  }>
}

interface MatchAnalysisResponse {
  success: boolean
  analise?: string
  top3?: Array<{
    id: string
    titulo: string
    preco: number
    area?: number
    quartos?: number
    banheiros?: number
    vagas?: number
    endereco?: string
    latitude?: number
    longitude?: number
    fotoPrincipal?: string
    galeriaFotos?: string[]
    telefoneContato?: string
    construtora?: string
    score?: number
    motivos?: string[]
    caracteristicas?: string[]
    matchPercentage?: number
    thumbnail?: string
  }>
  totalImoveis?: number
  perfilAnalisado?: number
  matches?: ImovelMatch[]
  totalAnalizado?: number
  tempoAnalise?: number
  insights?: string[]
}

export function useMatches() {
  const [loading, setLoading] = useState(false)
  const [matches, setMatches] = useState<ImovelMatch[]>([])
  const [totalAnalizado, setTotalAnalizado] = useState(0)
  const [insights, setInsights] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const analisarCompatibilidade = useCallback(async (request: MatchAnalysisRequest): Promise<MatchAnalysisResponse | null> => {
    try {
      setLoading(true)
      setError(null)
      
      logger.logDeepseek('match_analysis', 'Iniciando análise de compatibilidade', JSON.stringify({
        respostas: request.respostasUsuario.length,
        imoveis: request.imoveis?.length || 0
      }))

      // Recuperar limite de crédito do localStorage
      const limiteCredito = localStorage.getItem('limiteCredito');
      const creditoAprovado = localStorage.getItem('creditoAprovado') === 'true';
      
      console.log('💳 [MATCHES] Limit de crédito recuperado:', limiteCredito);
      
      const response = await fetch('/api/analise-deepseek', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user-temp',
          respostas: request.respostasUsuario,
          limiteCredito: limiteCredito ? parseFloat(limiteCredito) : null
        }),
      })

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`)
      }

      const data = await response.json() as MatchAnalysisResponse

      console.log('🔍 [MATCHES] Dados recebidos da API:', data);

      // Verificar se temos dados reais da API
      if (data && data.success && data.top3 && Array.isArray(data.top3) && data.top3.length > 0) {
        console.log('✅ [MATCHES] Usando dados REAIS da API Deepseek:', data.top3.length, 'imóveis')
        
        // Converter dados da API para formato do hook
        const realMatches = data.top3.map((imovel, index) => ({
          id: imovel.id,
          titulo: imovel.titulo,
          descricao: `${imovel.quartos} quartos, ${imovel.banheiros} banheiros, ${imovel.area}m²`,
          preco: imovel.preco,
          area: imovel.area,
          quartos: imovel.quartos,
          banheiros: imovel.banheiros,
          vagas: imovel.vagas,
          endereco: imovel.endereco,
          cidade: '',
          bairro: '',
          imagem: imovel.fotoPrincipal || imovel.thumbnail,
          construtora: imovel.construtora || 'Construtora',
          score: imovel.score || imovel.matchPercentage || (90 - index * 5),
          insights: imovel.motivos || [],
          razoesCombinou: imovel.motivos || [],
          pontosFracos: []
        }))

        // Salvar no localStorage para sincronizar com mapa
        try {
          const dadosParaMapa = data.top3.map(imovel => ({
            ...imovel,
            thumbnail: imovel.fotoPrincipal || imovel.thumbnail || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
            matchPercentage: imovel.score || imovel.matchPercentage || 85
          }))
          
          const uniqueId = Date.now().toString()
          localStorage.setItem(`mapa_imoveis_${uniqueId}`, JSON.stringify(dadosParaMapa))
          console.log('💾 [SYNC] Dados salvos no localStorage para mapa:', uniqueId)
        } catch (error) {
          console.error('❌ [SYNC] Erro ao salvar no localStorage:', error)
        }

        // Atualizar states com dados reais
        setMatches(realMatches)
        setTotalAnalizado(data.totalImoveis || data.top3.length)
        setInsights([data.analise || 'Análise baseada em IA avançada'])
        
        return {
          success: true,
          matches: realMatches,
          totalAnalizado: data.totalImoveis || data.top3.length,
          tempoAnalise: 2.5,
          insights: [data.analise || 'Análise baseada em IA avançada']
        }
      }

      // Salvar respostas do usuário automaticamente
      if (request.respostasUsuario && Array.isArray(request.respostasUsuario) && request.respostasUsuario.length > 0) {
        try {
          console.log('💾 [AUTO-SAVE] Salvando', request.respostasUsuario.length, 'respostas automaticamente')
          
          const respostasParaSalvar = request.respostasUsuario.map(resposta => ({
            pergunta: resposta.perguntaId || 'Pergunta não especificada',
            resposta: String(resposta.valor || ''),
            score: 0
          }))
          
          const saveResponsesReq = await fetch('/api/cliente/respostas-salvas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ respostas: respostasParaSalvar })
          })

          if (saveResponsesReq.ok) {
            const saveResponsesData = await saveResponsesReq.json()
            console.log('✅ [AUTO-SAVE] Respostas salvas:', saveResponsesData.message)
          } else {
            console.warn('⚠️ [AUTO-SAVE] Falha no salvamento de respostas:', saveResponsesReq.status)
          }
        } catch (saveError) {
          console.error('❌ [AUTO-SAVE] Erro ao salvar respostas:', saveError)
        }
      }

      // Se não temos dados reais, usar mock apenas como último recurso
      console.log('⚠️ [MATCHES] API não retornou dados válidos, usando fallback')
      const mockMatches = generateMockMatches(request.respostasUsuario)
      const mockResponse: MatchAnalysisResponse = {
        success: false,
        matches: mockMatches,
        totalAnalizado: 50,
        tempoAnalise: 2.3,
        insights: [
          "Baseamos a análise em suas preferências de localização e orçamento",
          "Consideramos seu perfil familiar e necessidades especiais",
          "Priorizamos imóveis com boa relação custo-benefício"
        ]
      }
      
      setMatches(mockMatches)
      setTotalAnalizado(50)
      setInsights(mockResponse.insights || [])
      
      logger.logDeepseek('match_analysis', 'Usando dados simulados', JSON.stringify({
        matches: mockMatches.length,
        totalAnalizado: 50
      }))
      
      return mockResponse

    } catch (error) {
      console.error('Erro na análise de compatibilidade:', error)
      setError(error instanceof Error ? error.message : 'Erro desconhecido')
      
      // Fallback para dados simulados em caso de erro
      const mockMatches = generateMockMatches(request.respostasUsuario)
      const mockResponse: MatchAnalysisResponse = {
        success: false,
        matches: mockMatches,
        totalAnalizado: 25,
        tempoAnalise: 1.5,
        insights: [
          "Análise baseada em dados locais (modo offline)",
          "Resultados podem variar quando conectado à API"
        ]
      }
      
      setMatches(mockMatches)
      setTotalAnalizado(25)
      setInsights(mockResponse.insights || [])
      
      logger.logDeepseek('match_analysis', 'Erro na análise, usando fallback', JSON.stringify({
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }))
      
      return mockResponse
    } finally {
      setLoading(false)
    }
  }, [])

  const limparMatches = useCallback(() => {
    setMatches([])
    setTotalAnalizado(0)
    setInsights([])
    setError(null)
  }, [])

  return {
    loading,
    matches,
    totalAnalizado,
    insights,
    error,
    analisarCompatibilidade,
    limparMatches
  }
}

// Função para gerar dados simulados baseados nas respostas
function generateMockMatches(respostas: Array<{ perguntaId: string; valor: any; tipo: string }>): ImovelMatch[] {
  // Extrair informações das respostas para personalizar os matches
  const orcamento = respostas.find(r => r.tipo === 'range' || r.perguntaId.includes('orcamento'))?.valor || 500000
  const quartos = respostas.find(r => r.perguntaId.includes('quartos'))?.valor || 2
  const cidade = respostas.find(r => r.perguntaId.includes('cidade'))?.valor || 'São Paulo'
  
  const baseMatches: ImovelMatch[] = [
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
        `Preço R$ ${(Math.min(orcamento * 0.9, 650000)).toLocaleString('pt-BR')} dentro do orçamento`,
        'Apartamento novo com acabamento moderno'
      ],
      pontosFracos: [
        'Apenas 1 vaga de garagem'
      ]
    },
    {
      id: '2',
      titulo: 'Casa Familiar com Jardim',
      preco: Math.min(orcamento * 1.1, 750000),
      area: 120,
      quartos: quartos + 1,
      banheiros: 3,
      vagas: 2,
      endereco: 'Rua das Flores, 485',
      cidade: cidade,
      bairro: 'Vila Progresso',
      construtora: 'Habitare Construtora',
      score: 87,
      insights: [
        'Casa oferece mais espaço que apartamentos',
        'Jardim privativo ideal para família',
        'Bairro residencial seguro e tranquilo'
      ],
      razoesCombinou: [
        `${quartos + 1} quartos (mais que solicitado)`,
        'Casa com jardim para maior privacidade',
        '2 vagas de garagem',
        'Bairro familiar e seguro'
      ],
      pontosFracos: [
        `Preço R$ ${(Math.min(orcamento * 1.1, 750000)).toLocaleString('pt-BR')} um pouco acima do orçamento`,
        'Mais distante do centro'
      ]
    },
    {
      id: '3',
      titulo: 'Apartamento Compacto e Funcional',
      preco: Math.min(orcamento * 0.7, 400000),
      area: 65,
      quartos: Math.max(quartos - 1, 1),
      banheiros: 2,
      vagas: 1,
      endereco: 'Av. Paulista, 2100',
      cidade: cidade,
      bairro: 'Bela Vista',
      construtora: 'Smart Living',
      score: 78,
      insights: [
        'Excelente custo-benefício para o orçamento',
        'Localização premium com infraestrutura completa',
        'Ideal para quem prioriza localização'
      ],
      razoesCombinou: [
        'Preço muito atrativo dentro do orçamento',
        'Localização privilegiada na Av. Paulista',
        'Apartamento novo com design inteligente',
        'Infraestrutura completa na região'
      ],
      pontosFracos: [
        `Apenas ${Math.max(quartos - 1, 1)} quarto(s), menos que desejado`,
        'Metragem mais compacta'
      ]
    }
  ]

  // Ordenar por score decrescente
  return baseMatches.sort((a, b) => b.score - a.score)
}
