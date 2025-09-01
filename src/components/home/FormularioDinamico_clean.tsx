"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Loader2, Zap } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { buscarPerguntas, Pergunta } from '@/services/pergunta-service'
import { DynamicQuestionRenderer } from './DynamicQuestionRenderer'
import { useDeepseek } from '@/hooks/useDeepseek'
import { AIInsights } from '@/components/ui/ai-insights'
import { MatchesModal } from '@/components/ui/matches-modal'
import { useMatches } from '@/hooks/useMatches'

interface FormularioDinamicoProps {
  onComplete: (respostas: Record<string, any>) => void
  userId?: string
  sessionId?: string
}

export function FormularioDinamico({ onComplete, userId, sessionId }: FormularioDinamicoProps) {
  const { toast } = useToast()
  
  // Estados
  const [perguntas, setPerguntas] = useState<Pergunta[]>([])
  const [perguntasPorStep, setPerguntasPorStep] = useState<Record<number, Pergunta[]>>({})
  const [stepsDisponiveis, setStepsDisponiveis] = useState<number[]>([])
  const [stepAtual, setStepAtual] = useState(0)
  const [respostas, setRespostas] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [salvandoResposta, setSalvandoResposta] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [showMatches, setShowMatches] = useState(false)
  
  // Hooks AI
  const deepseek = useDeepseek()
  const matches = useMatches()

  // Carregar perguntas
  useEffect(() => {
    const carregarPerguntas = async () => {
      setLoading(true)
      try {
        const perguntasCarregadas = await buscarPerguntas()
        
        if (!Array.isArray(perguntasCarregadas) || perguntasCarregadas.length === 0) {
          throw new Error('Nenhuma pergunta encontrada')
        }

        const perguntasAtivas = perguntasCarregadas.filter(p => p.ativa)
        setPerguntas(perguntasAtivas)

        // Agrupar por step
        const perguntasPorStepObj: Record<number, Pergunta[]> = {}
        perguntasAtivas.forEach(pergunta => {
          const step = pergunta.step || 1
          if (!perguntasPorStepObj[step]) {
            perguntasPorStepObj[step] = []
          }
          perguntasPorStepObj[step].push(pergunta)
        })

        setPerguntasPorStep(perguntasPorStepObj)
        
        const steps = Object.keys(perguntasPorStepObj).map(s => parseInt(s)).sort((a, b) => a - b)
        setStepsDisponiveis(steps)
        setStepAtual(0)
        
      } catch (error: any) {
        console.error('❌ Erro ao carregar perguntas:', error)
        setErro(error.message)
        
        toast({
          title: "Erro ao carregar perguntas",
          description: error?.message || "Tente recarregar a página",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    carregarPerguntas()
  }, [toast])

  // Salvar resposta no backend
  const salvarResposta = async (perguntaId: string, valor: any) => {
    if (!userId && !sessionId) return

    try {
      setSalvandoResposta(true)
      
      const valorProcessado = typeof valor === 'object' ? JSON.stringify(valor) : String(valor)
      
      const response = await fetch('/api/respostas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          perguntaId,
          valor: valorProcessado,
          userId: userId || sessionId,
        })
      })

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }
      
    } catch (error) {
      console.error(`Erro ao salvar resposta:`, error)
      toast({
        title: "Erro ao salvar resposta",
        description: "Tente novamente",
        variant: "destructive",
      })
    } finally {
      setSalvandoResposta(false)
    }
  }

  // Atualizar resposta
  const atualizarResposta = async (perguntaId: string, valor: any) => {
    const novaResposta = {
      perguntaId,
      valor,
      texto: perguntas.find(p => p.id === perguntaId)?.texto || '',
      tipo: perguntas.find(p => p.id === perguntaId)?.tipo || 'text'
    }
    
    setRespostas(prev => ({ ...prev, [perguntaId]: novaResposta }))
    await salvarResposta(perguntaId, valor)
  }

  // Preenchimento automático (teste)
  const preencherAutomatico = async () => {
    setSalvando(true)
    
    const novasRespostas: Record<string, any> = {}
    
    for (const pergunta of perguntas) {
      let valorTeste = 'Resposta automática'
      
      switch (pergunta.tipo) {
        case 'email':
          valorTeste = 'teste@email.com'
          break
        case 'number':
          valorTeste = String(Math.floor(Math.random() * 100) + 1)
          break
        case 'select':
        case 'radio':
          try {
            const opcoes = typeof pergunta.opcoes === 'string' ? JSON.parse(pergunta.opcoes) : pergunta.opcoes
            if (Array.isArray(opcoes) && opcoes.length > 0) {
              valorTeste = opcoes[0].value || opcoes[0].label || 'opcao_1'
            }
          } catch {
            valorTeste = 'opcao_1'
          }
          break
        case 'date':
          valorTeste = new Date().toISOString().split('T')[0]
          break
        case 'phone':
          valorTeste = '(41) 99999-9999'
          break
      }
      
      const novaResposta = {
        perguntaId: pergunta.id,
        valor: valorTeste,
        texto: pergunta.texto,
        tipo: pergunta.tipo
      }
      
      novasRespostas[pergunta.id] = novaResposta
      await salvarResposta(pergunta.id, valorTeste)
    }

    setRespostas(prev => ({ ...prev, ...novasRespostas }))
    setSalvando(false)

    toast({
      title: "✅ Preenchimento completo!",
      description: `${Object.keys(novasRespostas).length} respostas preenchidas`,
    })
  }

  // Navegar steps
  const proximoStep = () => {
    if (stepAtual < stepsDisponiveis.length - 1) {
      setStepAtual(prev => prev + 1)
    } else {
      const respostasForAnalise = Object.entries(respostas).map(([perguntaId, resposta]) => ({
        perguntaId,
        valor: resposta.valor,
        tipo: resposta.tipo || 'text'
      }))

      matches.analisarCompatibilidade({
        respostasUsuario: respostasForAnalise
      }).then(() => {
        onComplete(respostas)
      })
    }
  }

  const stepAnterior = () => {
    if (stepAtual > 0) {
      setStepAtual(prev => prev - 1)
    }
  }

  const podeAvancar = () => {
    const currentStepNumber = stepsDisponiveis[stepAtual]
    if (!currentStepNumber) return false

    const questionsInStep = perguntasPorStep[currentStepNumber] || []
    
    for (const pergunta of questionsInStep) {
      if (pergunta.obrigatoria) {
        const resposta = respostas[pergunta.id]
        if (!resposta?.valor) {
          return false
        }
      }
    }
    return true
  }

  const progresso = stepsDisponiveis.length > 0 ? ((stepAtual + 1) / stepsDisponiveis.length) * 100 : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600">Carregando formulário...</p>
        </div>
      </div>
    )
  }

  if (erro) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">⚠️</div>
          <h3 className="text-lg font-semibold mb-2">Erro ao carregar</h3>
          <p className="text-gray-600 mb-4">{erro}</p>
          <Button onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  if (stepsDisponiveis.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600">Nenhuma pergunta disponível.</p>
        </div>
      </div>
    )
  }

  const stepReal = stepsDisponiveis[stepAtual]
  const perguntasDoStep = perguntasPorStep[stepReal] || []

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header com progresso */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            Etapa {stepAtual + 1} de {stepsDisponiveis.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progresso)}% completo
          </span>
        </div>
        <Progress value={progresso} className="h-2" />
      </div>

      {/* AI Insights */}
      {deepseek.insights.length > 0 && (
        <AIInsights
          insights={deepseek.insights}
          confianca={deepseek.confianca}
          loading={deepseek.loading}
          className="mb-6"
        />
      )}

      {/* Step atual */}
      <div className="mb-8 space-y-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Etapa {stepAtual + 1}
          </h2>
          <p className="text-base text-gray-600">
            {perguntasDoStep.length} pergunta{perguntasDoStep.length > 1 ? 's' : ''} nesta etapa
          </p>
        </div>

        {/* Perguntas */}
        {perguntasDoStep.map((pergunta: any, index: number) => (
          <div key={pergunta.id} className="border border-gray-200 rounded-lg p-6 bg-white">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {index + 1}. {pergunta.texto}
              </h3>
              {pergunta.descricao && (
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  {pergunta.descricao}
                </p>
              )}
              {pergunta.obrigatoria && (
                <p className="text-xs text-gray-500">* Campo obrigatório</p>
              )}
            </div>

            <DynamicQuestionRenderer
              pergunta={pergunta}
              valor={respostas[pergunta.id]?.valor}
              onChange={(valor: any) => atualizarResposta(pergunta.id, valor)}
            />
          </div>
        ))}
      </div>

      {/* Navegação */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={stepAnterior}
          disabled={stepAtual === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Etapa Anterior
        </Button>

        <div className="flex items-center gap-2">
          {salvandoResposta && (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          )}
          
          {/* Botão Teste */}
          {process.env.NODE_ENV === 'development' && (
            <Button
              variant="outline"
              onClick={preencherAutomatico}
              disabled={salvando}
              className="flex items-center gap-2 text-purple-600 border-purple-300 hover:bg-purple-50"
            >
              <Zap className="h-4 w-4" />
              Teste Rápido
            </Button>
          )}
          
          <Button
            onClick={proximoStep}
            disabled={!podeAvancar() || salvandoResposta}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
          >
            {stepAtual === stepsDisponiveis.length - 1 ? 'Finalizar' : 'Próxima Etapa'}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Modal */}
      <MatchesModal
        isOpen={showMatches}
        onClose={() => {
          setShowMatches(false)
          onComplete(respostas)
        }}
        matches={matches.matches}
        loading={matches.loading}
        totalAnalizado={matches.totalAnalizado}
      />
    </div>
  )
}
