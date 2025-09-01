// Hook para integração com Deepseek AI

import { useState, useCallback, useRef } from 'react'
import { DeepseekRequest, DeepseekResponse } from '@/services/deepseek-service'

// Cache para evitar requisições duplicadas
const cache = new Map<string, { data: DeepseekResponse, timestamp: number }>()
const CACHE_DURATION = 30000 // 30 segundos

export interface UseDeepseekReturn {
  otimizarFormulario: (request: DeepseekRequest) => Promise<DeepseekResponse | null>
  analisarCompatibilidade: (respostas: Record<string, any>, imoveis: any[]) => Promise<any[] | null>
  loading: boolean
  sugestoes: string[]
  insights: string[]
  confianca: number
}

export function useDeepseek(): UseDeepseekReturn {
  const [loading, setLoading] = useState(false)
  const [sugestoes, setSugestoes] = useState<string[]>([])
  const [insights, setInsights] = useState<string[]>([])
  const [confianca, setConfianca] = useState(0)
  const pendingRequests = useRef(new Map<string, Promise<DeepseekResponse | null>>())

  const otimizarFormulario = useCallback(async (request: DeepseekRequest): Promise<DeepseekResponse | null> => {
    try {
      // Criar chave de cache baseada nas respostas
      const cacheKey = JSON.stringify({
        respostas: Object.keys(request.respostasAtuais).length,
        perguntas: request.perguntasDisponiveis.length,
        contexto: request.contexto
      })

      // Verificar cache primeiro
      const cached = cache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('🧠 [DEEPSEEK] Usando cache para evitar requisição duplicada')
        setSugestoes(cached.data.perguntasSugeridas || [])
        setInsights(cached.data.insights || [])
        setConfianca(cached.data.confianca || 0)
        return cached.data
      }

      // Verificar se já existe uma requisição pendente para a mesma chave
      if (pendingRequests.current.has(cacheKey)) {
        console.log('🧠 [DEEPSEEK] Aguardando requisição pendente...')
        return pendingRequests.current.get(cacheKey)!
      }

      setLoading(true)
      
      // Criar promise da requisição
      const requestPromise = (async (): Promise<DeepseekResponse | null> => {
        try {
          const response = await fetch('/api/deepseek/otimizar', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
          })

          if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`)
          }

          const resultado: DeepseekResponse = await response.json()
          
          // Salvar no cache
          cache.set(cacheKey, { data: resultado, timestamp: Date.now() })
          
          // Atualizar estado local
          setSugestoes(resultado.perguntasSugeridas || [])
          setInsights(resultado.insights || [])
          setConfianca(resultado.confianca || 0)

          return resultado
        } catch (error) {
          console.error('Erro na otimização do formulário:', error)
          return null
        } finally {
          // Remover da lista de requisições pendentes
          pendingRequests.current.delete(cacheKey)
          setLoading(false)
        }
      })()

      // Adicionar à lista de requisições pendentes
      pendingRequests.current.set(cacheKey, requestPromise)
      
      return requestPromise
    } catch (error) {
      console.error('Erro na otimização do formulário:', error)
      setLoading(false)
      return null
    }
  }, [])

  const analisarCompatibilidade = useCallback(async (
    respostas: Record<string, any>, 
    imoveis: any[]
  ): Promise<any[] | null> => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/deepseek/otimizar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ respostas, imoveis }),
      })

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Erro na análise de compatibilidade:', error)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    otimizarFormulario,
    analisarCompatibilidade,
    loading,
    sugestoes,
    insights,
    confianca
  }
}
