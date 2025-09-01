"use client"

import { useState, useEffect } from 'react'
import { Brain, Lightbulb, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface InsightIAProps {
  pergunta: string
  valor: string
  respostasProximas?: Record<string, any>
}

export function InsightIA({ pergunta, valor, respostasProximas }: InsightIAProps) {
  const [insight, setInsight] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Gerar insight quando valor mudar
  useEffect(() => {
    if (valor && valor.length >= 3) {
      gerarInsight()
    } else {
      setInsight('')
    }
  }, [valor, pergunta])

  const gerarInsight = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/insight-ia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pergunta,
          valor,
          respostasProximas
        })
      })

      const data = await response.json()

      if (data.success) {
        setInsight(data.insight)
      } else {
        setError(data.error || 'Erro ao gerar insight')
      }
    } catch (error) {
      console.error('Erro ao gerar insight:', error)
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  if (!valor || valor.length < 3) {
    return null
  }

  return (
    <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Brain className="h-4 w-4 text-blue-600" />
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          Insight IA
        </Badge>
      </div>
      
      {loading && (
        <div className="flex items-center gap-2 text-blue-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Analisando sua resposta...</span>
        </div>
      )}
      
      {error && (
        <div className="text-sm text-red-600 flex items-center gap-2">
          <span>❌ {error}</span>
        </div>
      )}
      
      {insight && !loading && (
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700 leading-relaxed">
              {insight}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
