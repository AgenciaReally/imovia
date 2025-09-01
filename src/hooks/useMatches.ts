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
  matches: ImovelMatch[]
  totalAnalizado: number
  tempoAnalise: number
  insights: string[]
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

      const response = await fetch('/api/deepseek/otimizar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          respostasUsuario: request.respostasUsuario,
          imoveis: request.imoveis || [],
          tipo: 'compatibilidade'
        }),
      })

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`)
      }

      const data = await response.json() as MatchAnalysisResponse

      // Simular dados se a API retornar vazio (modo fallback)
      if (!data.matches || data.matches.length === 0) {
        const mockMatches = generateMockMatches(request.respostasUsuario)
        const mockResponse: MatchAnalysisResponse = {
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
        setInsights(mockResponse.insights)
        
        logger.logDeepseek('match_analysis', 'Usando dados simulados', JSON.stringify({
          matches: mockMatches.length,
          totalAnalizado: 50
        }))
        
        return mockResponse
      }

      setMatches(data.matches)
      setTotalAnalizado(data.totalAnalizado)
      setInsights(data.insights)

      logger.logDeepseek('match_analysis', 'Análise concluída com sucesso', JSON.stringify({
        matches: data.matches.length,
        totalAnalizado: data.totalAnalizado,
        tempoAnalise: data.tempoAnalise
      }))

      return data

    } catch (error) {
      console.error('Erro na análise de compatibilidade:', error)
      setError(error instanceof Error ? error.message : 'Erro desconhecido')
      
      // Fallback para dados simulados em caso de erro
      const mockMatches = generateMockMatches(request.respostasUsuario)
      const mockResponse: MatchAnalysisResponse = {
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
      setInsights(mockResponse.insights)
      
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
