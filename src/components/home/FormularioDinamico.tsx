"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Loader2, Zap, Phone } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { buscarPerguntas, Pergunta } from '@/services/pergunta-service'
import { DynamicQuestionRenderer } from './DynamicQuestionRenderer'
import { useDeepseek } from '@/hooks/useDeepseek'
import { useMatches } from "@/hooks/useMatches"
import { motion, AnimatePresence } from "framer-motion"
import { AIInsights } from '@/components/ui/ai-insights'
import { MatchesModal } from '@/components/ui/matches-modal'

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
  const [perguntasCarregando, setPerguntasCarregando] = useState(false);
  const [salvandoResposta, setSalvandoResposta] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  // Estados para IA dinâmica
  const [analisandoIA, setAnalisandoIA] = useState(false);
  const [perguntasOcultas, setPerguntasOcultas] = useState<Set<string>>(new Set());
  const [perguntasDinamicas, setPerguntasDinamicas] = useState<any[]>([]);
  const [contadorSteps, setContadorSteps] = useState(0);
  const [erro, setErro] = useState<string | null>(null)
  const [showMatches, setShowMatches] = useState(false)
  
  // Estados para geolocalização
  const [localizacaoObtida, setLocalizacaoObtida] = useState(false)
  const [cidadeDetectada, setCidadeDetectada] = useState<string>('')
  
  // Estados para simulador de crédito IA
  const [mostrarSimuladorCredito, setMostrarSimuladorCredito] = useState(false);
  const [simulacaoAprovada, setSimulacaoAprovada] = useState(false);
  const [dadosSimulacao, setDadosSimulacao] = useState<any>(null);
  
  // Hooks AI
  const deepseek = useDeepseek()
  const matches = useMatches()

  // 🌍 Função para obter geolocalização e detectar cidade
  const obterGeolocalizacao = async () => {
    if (localizacaoObtida || cidadeDetectada) return
    
    try {
      if (!navigator.geolocation) {
        console.log('Geolocalização não suportada')
        return
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: false
        })
      })

      const { latitude, longitude } = position.coords
      console.log(`📍 Localização: ${latitude}, ${longitude}`)

      // API de geocodificação reversa
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`
      )
      
      if (response.ok) {
        const data = await response.json()
        const cidade = data.city || data.locality || ''
        const estado = data.principalSubdivision || ''
        const cidadeCompleta = estado ? `${cidade}, ${estado}` : cidade
        
        if (cidadeCompleta) {
          setCidadeDetectada(cidadeCompleta)
          setLocalizacaoObtida(true)
          console.log(`🏙️ Cidade detectada: ${cidadeCompleta}`)
          
          // Buscar pergunta de cidade e preencher automaticamente
          const perguntaCidade = perguntas.find(p => 
            p.texto.toLowerCase().includes('cidade') || 
            p.texto.toLowerCase().includes('localização') ||
            p.texto.toLowerCase().includes('onde você mora')
          )
          
          if (perguntaCidade) {
            await atualizarResposta(perguntaCidade.id, cidadeCompleta)
            
            toast({
              title: "📍 Localização detectada!",
              description: `Preenchido automaticamente: ${cidadeCompleta}`,
              variant: "default"
            })
          }
        }
      }
    } catch (error) {
      console.log('Não foi possível obter localização:', error)
    }
  }

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
        
        // Iniciar geolocalização após carregar perguntas
        setTimeout(() => {
          obterGeolocalizacao()
        }, 1500)
        
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
      
      // Não converter objetos para string aqui - deixar a API de respostas fazer isso
      // Isso é importante para arquivos que são objetos com {url, filename, size, type}
      
      const response = await fetch('/api/respostas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          perguntaId,
          valor: valor, // Enviar valor original sem conversão
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
    console.log('🔄 Atualizando resposta:', { perguntaId, valor })
    
    // Buscar pergunta em ambas as listas (normal + dinâmicas)
    const pergunta = perguntas.find(p => p.id === perguntaId) || 
                     perguntasDinamicas.find(p => p.id === perguntaId)
    
    const novaResposta = {
      perguntaId,
      valor,
      texto: pergunta?.texto || '',
      tipo: pergunta?.tipo || 'text'
    }
    
    console.log('✅ Nova resposta criada:', novaResposta)
    
    setRespostas(prev => ({ ...prev, [perguntaId]: novaResposta }))
    await salvarResposta(perguntaId, valor)
  }

  // 🧠 Análise IA avançada para otimizar perguntas
  const analisarEOtimizarPerguntas = async (respostasAtuais: Record<string, any>) => {
    setAnalisandoIA(true)
    
    try {
      // Análise do perfil do usuário baseada nas respostas
      const respostasArray = Object.entries(respostasAtuais).map(([id, resp]) => ({
        perguntaId: id,
        valor: resp.valor,
        texto: resp.texto,
        pergunta: perguntas.find(p => p.id === id)
      }))
      
      console.log('🧠 IA analisando', respostasArray.length, 'respostas para otimização avançada')
      
      let perguntasParaOcultar = new Set<string>()
      let novasPerguntasDinamicas: any[] = []
      
      // 🎯 Análise de perfil do usuário
      const rendaValue = respostasArray.find(r => 
        r.pergunta?.categoria === 'AVALIACAO_CREDITO' && 
        r.texto?.toLowerCase().includes('renda')
      )?.valor || 0
      
      const rendaAlta = Number(String(rendaValue).replace(/\D/g, '')) > 8000
      const rendaMedia = Number(String(rendaValue).replace(/\D/g, '')) > 4000
      
      const temFilhos = respostasArray.some(r => 
        r.valor && String(r.valor).toLowerCase().includes('filho')
      )
      
      const investidor = respostasArray.some(r => 
        String(r.valor).toLowerCase().includes('investimento') || 
        String(r.valor).toLowerCase().includes('renda extra')
      )
      
      const primeiroImovel = respostasArray.some(r => 
        String(r.valor).toLowerCase().includes('primeiro') ||
        String(r.valor).toLowerCase().includes('primeira vez')
      )
      
      console.log('🎯 Perfil detectado:', { rendaAlta, rendaMedia, temFilhos, investidor, primeiroImovel })
      
      // 🚫 IA: Ocultar perguntas desnecessárias baseado no perfil
      if (rendaAlta) {
        perguntas.forEach(p => {
          if (p.texto.toLowerCase().includes('primeiro imóvel') ||
              p.texto.toLowerCase().includes('ajuda familiar') ||
              p.texto.toLowerCase().includes('fies') ||
              p.texto.toLowerCase().includes('auxílio governo')) {
            perguntasParaOcultar.add(p.id)
            console.log('🚫 IA ocultou pergunta básica:', p.texto.substring(0, 40) + '...')
          }
        })
      }
      
      if (!temFilhos) {
        perguntas.forEach(p => {
          if (p.texto.toLowerCase().includes('escola') ||
              p.texto.toLowerCase().includes('playground') ||
              p.texto.toLowerCase().includes('criança') ||
              p.texto.toLowerCase().includes('área infantil')) {
            perguntasParaOcultar.add(p.id)
            console.log('🚫 IA ocultou pergunta família:', p.texto.substring(0, 40) + '...')
          }
        })
      }
      
      if (investidor) {
        perguntas.forEach(p => {
          if (p.texto.toLowerCase().includes('primeira moradia') ||
              p.texto.toLowerCase().includes('sonho da casa própria')) {
            perguntasParaOcultar.add(p.id)
            console.log('🚫 IA ocultou pergunta moradia:', p.texto.substring(0, 40) + '...')
          }
        })
      }
      
      // 🤖 IA: Criar apenas 2-3 perguntas dinâmicas ESSENCIAIS (velocidade otimizada)
      const timestamp = Date.now()
      
      // ⚡ FOCO: Apenas perguntas que afetam diretamente a busca de imóveis
      if (rendaAlta || investidor) {
        novasPerguntasDinamicas.push({
          id: `dinamica-investimento-${timestamp}`,
          texto: "Imóvel para investimento ou moradia?",
          tipo: "radio",
          opcoes: ["Investimento", "Moradia", "Ambos"],
          obrigatoria: false,
          categoria: "INVESTIMENTO",
          step: stepAtual + 1,
          ordem: 1000,
          geradaPorIA: true
        })
      }
      
      // Pergunta de localização essencial
      novasPerguntasDinamicas.push({
        id: `dinamica-localizacao-${timestamp + 1}`,
        texto: "Prioridade de localização?",
        tipo: "radio",
        opcoes: ["Centro da cidade", "Bairros residenciais", "Próximo ao trabalho", "Qualquer localização"],
        obrigatoria: false,
        categoria: "LOCALIZACAO",
        step: stepAtual + 1,
        ordem: 1001,
        geradaPorIA: true
      })
      
      // Apenas se tiver filhos
      if (temFilhos) {
        novasPerguntasDinamicas.push({
          id: `dinamica-familia-${timestamp + 2}`,
          texto: "Área de lazer para família?",
          tipo: "radio",
          opcoes: ["Playground + piscina", "Apenas área comum", "Não é importante"],
          obrigatoria: false,
          categoria: "FAMILIA",
          step: stepAtual + 1,
          ordem: 1002,
          geradaPorIA: true
        })
      }
      
      console.log(`🤖 IA criou ${novasPerguntasDinamicas.length} perguntas e vai ocultar ${perguntasParaOcultar.size} perguntas`)
      
      // Atualizar perguntas ocultas
      setPerguntasOcultas(perguntasParaOcultar)
      
      // Verificar duplicatas
      const perguntasExistentes = [...perguntas, ...perguntasDinamicas]
      const perguntasUnicas = novasPerguntasDinamicas.filter((novaPergunta: any) => {
        const jaExiste = perguntasExistentes.some(existente => 
          existente.texto.toLowerCase().trim() === novaPergunta.texto.toLowerCase().trim()
        )
        return !jaExiste
      })

      if (perguntasUnicas.length > 0) {
        // ✅ APENAS adicionar ao estado local (SEM salvar no banco)
        setPerguntasDinamicas(prev => [...prev, ...perguntasUnicas])
        
        toast({
          title: "🤖 IA otimizou seu formulário!",
          description: `Criou ${perguntasUnicas.length} perguntas personalizadas e ocultou ${perguntasParaOcultar.size} desnecessárias.`,
        })
      }
      
    } catch (error) {
      console.error('Erro na análise IA:', error)
      toast({
        title: "⚠️ Simulação IA",
        description: "Análise inteligente aplicada localmente.",
        variant: "default"
      })
    } finally {
      setAnalisandoIA(false)
    }
  }

  // Preenchimento automático (teste) - Agora com demonstração de otimização
  const preencherAutomatico = async () => {
    // Ativar animação IA IMEDIATAMENTE ao clicar
    setAnalisandoIA(true)
    setSalvandoResposta(true)
    
    const novasRespostas: Record<string, any> = {}
    
    // 1. Preencher algumas perguntas iniciais
    const perguntasIniciais = perguntas.slice(0, 8) // Primeiras 8 perguntas
    
    for (const pergunta of perguntasIniciais) {
      let valorTeste: any = 'Resposta automática'
      
      switch (pergunta.tipo) {
        case 'email':
          valorTeste = 'cliente.teste@gmail.com'
          break
        case 'telefone':
          valorTeste = '(41) 99999-9999'
          break
        case 'number':
        case 'range':
          if (pergunta.texto.toLowerCase().includes('renda')) {
            valorTeste = '8000'
          } else if (pergunta.texto.toLowerCase().includes('valor') || pergunta.texto.toLowerCase().includes('preço')) {
            valorTeste = '300000'
          } else if (pergunta.texto.toLowerCase().includes('quarto')) {
            valorTeste = '3'
          } else if (pergunta.texto.toLowerCase().includes('banheiro')) {
            valorTeste = '2'
          } else {
            valorTeste = Math.floor(Math.random() * 10 + 1).toString()
          }
          break
        case 'select':
          if (pergunta.opcoes?.length > 0) {
            valorTeste = pergunta.opcoes[Math.floor(Math.random() * pergunta.opcoes.length)]
          }
          break
        case 'radio':
          if (pergunta.opcoes?.length > 0) {
            valorTeste = pergunta.opcoes[0]
          }
          break
        case 'checkbox':
          valorTeste = 'Sim'
          break
        case 'file':
        case 'arquivo':
        case 'upload':
          // Para perguntas de arquivo, usar URL de imagem de teste
          if (pergunta.texto.toLowerCase().includes('renda') || pergunta.texto.toLowerCase().includes('comprovante')) {
            valorTeste = {
              url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop&crop=center',
              filename: 'comprovante-renda-teste.jpg',
              size: 245760,
              type: 'image/jpeg'
            }
          } else if (pergunta.texto.toLowerCase().includes('endereço') || pergunta.texto.toLowerCase().includes('endereco')) {
            valorTeste = {
              url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop&crop=center',
              filename: 'comprovante-endereco-teste.jpg',
              size: 198432,
              type: 'image/jpeg'
            }
          } else {
            valorTeste = {
              url: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=800&h=600&fit=crop&crop=center',
              filename: 'documento-teste.jpg',
              size: 156789,
              type: 'image/jpeg'
            }
          }
          break
      }
      
      // Salvar respostas no estado
      novasRespostas[pergunta.id] = {
        valor: valorTeste,
        tipo: pergunta.tipo,
        perguntaId: pergunta.id
      }
      
      await salvarResposta(pergunta.id, valorTeste)
    }
    
    setRespostas(prev => ({ ...prev, ...novasRespostas }))
    setSalvandoResposta(false)
    
    // 1. Primeiro criar perguntas dinâmicas IA
    try {
      await analisarEOtimizarPerguntas(novasRespostas)
    } catch (error) {
      console.error('Erro na análise IA:', error)
    }
    
    // Simular ocultação de perguntas específicas
    const perguntasParaOcultar = perguntas
      .filter(p => !perguntasIniciais.includes(p))
      .slice(0, Math.floor(perguntas.length * 0.6)) // Ocultar 60% das restantes
      .map(p => p.id)
    
    setPerguntasOcultas(new Set(perguntasParaOcultar))
    
    toast({
      title: "✨ Formulário otimizado!",
      description: `IA reduziu de ${perguntas.length} para ${perguntas.length - perguntasParaOcultar.length} perguntas + ${perguntasDinamicas.length} novas.`,
    })
    
    setAnalisandoIA(false) // Desativar animação
    
    // 3. Finalizar automaticamente após mostrar otimização
    setTimeout(() => {
      toast({
        title: "🎯 Teste concluído!",
        description: "Analisando matches com base nas suas respostas...",
      })
      
      // Finalizar e acionar análise de matches
      const respostasForAnalise = Object.entries(novasRespostas).map(([perguntaId, resposta]) => ({
        perguntaId,
        valor: resposta.valor,
        tipo: resposta.tipo || 'text'
      }))

      matches.analisarCompatibilidade({
        respostasUsuario: respostasForAnalise
      }).then(() => {
        // Forçar redirecionamento para matches após análise
        setTimeout(() => {
          onComplete({ ...respostas, ...novasRespostas })
        }, 1000)
      })
    }, 1500)
  }

  // Função antiga simplificada para manter compatibilidade
  const preencherAutomaticoOriginal = async () => {
    setSalvandoResposta(true)
    
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
    setSalvandoResposta(false)

    toast({
      title: "✅ Preenchimento completo!",
      description: `${Object.keys(novasRespostas).length} respostas preenchidas. Analisando matches...`,
    })

    // Após preencher tudo, finalizar formulário e acionar análise
    setTimeout(() => {
      const respostasForAnalise = Object.entries(novasRespostas).map(([perguntaId, resposta]) => ({
        perguntaId,
        valor: resposta.valor,
        tipo: resposta.tipo || 'text'
      }))

      matches.analisarCompatibilidade({
        respostasUsuario: respostasForAnalise
      }).then(() => {
        onComplete({ ...respostas, ...novasRespostas })
      })
    }, 1000)
  }

  // Ativar simulador de crédito IA no final do primeiro step
  const ativarSimuladorCreditoIA = async () => {
    setAnalisandoIA(true)
    
    try {
      // Coletar dados das respostas do primeiro step para análise
      const respostasStep1 = Object.entries(respostas).filter(([key, value]) => {
        // Filtrar apenas respostas relevantes para crédito
        const perguntaCredito = perguntas.find(p => p.id === key && p.categoria === 'AVALIACAO_CREDITO')
        return perguntaCredito && value?.valor
      })
      
      console.log('🔍 Respostas encontradas para crédito:', respostasStep1.length)
      
      // Sempre mostrar simulador, mesmo sem respostas completas
      if (respostasStep1.length === 0) {
        console.log('⚠️ Nenhuma resposta de crédito encontrada, usando valores padrão')
      }
      
      // Simular análise IA para gerar simulação de crédito
      // Buscar valores das respostas independente do ID específico
      const respostasArray = Object.entries(respostas)
      let valorMaximoImovel = 0
      let rendaBrutaFamiliar = 0
      let rendaMensalFamiliar = 0
      let valorParcelaMinima = 0
      let outrosFinanciamentos = 'Não possuo'
      
      // Buscar pelos valores nas respostas existentes OU usar valores padrão para demonstração
      respostasArray.forEach(([key, resposta]) => {
        if (resposta?.valor) {
          const pergunta = perguntas.find(p => p.id === key)
          if (pergunta?.categoria === 'AVALIACAO_CREDITO') {
            const valor = Number(String(resposta.valor).replace(/[^\d]/g, '')) || 0
            
            if (pergunta.texto.toLowerCase().includes('valor máximo') || pergunta.texto.toLowerCase().includes('valor do imóvel')) {
              valorMaximoImovel = valor
            } else if (pergunta.texto.toLowerCase().includes('renda bruta')) {
              rendaBrutaFamiliar = valor
            } else if (pergunta.texto.toLowerCase().includes('renda mensal')) {
              rendaMensalFamiliar = valor
            } else if (pergunta.texto.toLowerCase().includes('parcela')) {
              valorParcelaMinima = valor
            } else if (pergunta.texto.toLowerCase().includes('financiamento') || pergunta.texto.toLowerCase().includes('empréstimo')) {
              outrosFinanciamentos = String(resposta.valor)
            }
          }
        }
      })
      
      // Se não encontrou valores, usar dados das respostas preenchidas (mesmo que não sejam de crédito)
      if (valorMaximoImovel === 0 && rendaMensalFamiliar === 0) {
        // Buscar qualquer valor numérico nas respostas para demonstração
        respostasArray.forEach(([key, resposta]) => {
          if (resposta?.valor) {
            const valor = Number(String(resposta.valor).replace(/[^\d]/g, '')) || 0
            if (valor > 0) {
              if (valorMaximoImovel === 0 && valor > 100000) valorMaximoImovel = valor
              if (rendaMensalFamiliar === 0 && valor > 1000 && valor < 100000) rendaMensalFamiliar = valor
              if (valorParcelaMinima === 0 && valor > 500 && valor < 10000) valorParcelaMinima = valor
            }
          }
        })
      }
      
      // Valores padrão se ainda não tiver nada
      if (valorMaximoImovel === 0) valorMaximoImovel = 500000
      if (rendaMensalFamiliar === 0) rendaMensalFamiliar = 8000
      if (valorParcelaMinima === 0) valorParcelaMinima = 2000
      
      const dadosParaSimulacao = {
        valorMaximoImovel,
        rendaBrutaFamiliar,
        outrosFinanciamentos,
        rendaMensalFamiliar,
        valorParcelaMinima
      }
      
      console.log('🔍 Dados coletados para simulação:', dadosParaSimulacao)
      
      // Calcular simulação baseada nos dados
      const valorFinanciamento = Math.min(
        Number(dadosParaSimulacao.valorMaximoImovel) * 0.8, // 80% do valor do imóvel
        Number(dadosParaSimulacao.rendaMensalFamiliar) * 120 // 120x a renda mensal
      )
      
      const entrada = Number(dadosParaSimulacao.valorMaximoImovel) * 0.2 // 20% de entrada
      const parcelaMaxima = Number(dadosParaSimulacao.rendaMensalFamiliar) * 0.3 // 30% da renda
      const comprometimento = (Number(dadosParaSimulacao.valorParcelaMinima) / Number(dadosParaSimulacao.rendaMensalFamiliar)) * 100
      
      // Determinar se foi aprovado
      const aprovado = comprometimento <= 35 && valorFinanciamento > 0
      
      const simulacao = {
        valorFinanciamento,
        entrada,
        parcelaMaxima,
        comprometimento,
        aprovado,
        custos: {
          itbi: valorFinanciamento * 0.03,
          escritura: valorFinanciamento * 0.015,
          avaliacao: 2500,
          seguros: valorFinanciamento * 0.02
        }
      }
      
      setDadosSimulacao(simulacao)
      setSimulacaoAprovada(aprovado)
      setMostrarSimuladorCredito(true)
      
      toast({
        title: aprovado ? "✅ Pré-aprovação concedida!" : "⚠️ Simulação gerada",
        description: aprovado 
          ? "Parabéns! Você pode prosseguir para o próximo step." 
          : "Revise os dados para melhorar sua aprovação.",
      })
      
    } catch (error) {
      console.error('Erro na simulação IA:', error)
      toast({
        title: "Erro na simulação",
        description: "Não foi possível gerar a simulação. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setAnalisandoIA(false)
    }
  }

  const stepAnterior = () => {
    if (stepAtual > 0) {
      setStepAtual(prev => prev - 1)
    }
  }

  // Avançar para próximo step
  const proximoStep = async () => {
    const novoContador = contadorSteps + 1
    setContadorSteps(novoContador)
    
    // A cada 5 steps, fazer análise IA para otimizar
    if (novoContador % 5 === 0 && novoContador > 0) {
      setAnalisandoIA(true)
      
      // Simular análise IA
      setTimeout(async () => {
        await analisarEOtimizarPerguntas(respostas)
        setAnalisandoIA(false)
        
        // Avançar após análise
        if (stepAtual < stepsDisponiveis.length - 1) {
          setStepAtual(prev => prev + 1)
        }
      }, 2500) // 2.5s para análise IA
      
      return
    }
    
    if (stepAtual < stepsDisponiveis.length - 1) {
      setStepAtual(prev => prev + 1)
    } else {
      // Finalizar formulário
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

  const podeAvancar = () => {
    const currentStepNumber = stepsDisponiveis[stepAtual]
    if (!currentStepNumber) return false

    const questionsInStep = perguntasPorStep[currentStepNumber] || []
    
    for (const pergunta of questionsInStep) {
      if (pergunta.obrigatoria && !perguntasOcultas.has(pergunta.id)) {
        const resposta = respostas[pergunta.id]
        if (!resposta?.valor) {
          return false
        }
      }
    }

    return true
  }

  const progresso = stepsDisponiveis.length > 0 ? ((stepAtual + 1) / stepsDisponiveis.length) * 100 : 0

  // Loading animado da IA
  const LoadingIA = () => (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-900/20 via-black/60 to-orange-900/20 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div 
        className="bg-white/95 backdrop-blur-md rounded-2xl p-12 max-w-lg w-full mx-4 text-center shadow-2xl border border-orange-200/50"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
        {/* Neural Network Animation */}
        <div className="relative mb-8 h-24 flex items-center justify-center">
          {/* Central Brain */}
          <motion.div
            className="relative w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-lg"
            animate={{ 
              scale: [1, 1.1, 1],
              boxShadow: [
                "0 0 20px rgba(251, 146, 60, 0.3)",
                "0 0 40px rgba(251, 146, 60, 0.6)",
                "0 0 20px rgba(251, 146, 60, 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="absolute inset-2 bg-white/20 rounded-full flex items-center justify-center">
              <motion.div
                className="text-white text-2xl font-bold"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                🧠
              </motion.div>
            </div>
          </motion.div>

          {/* Neural Connections */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-orange-400 rounded-full"
              style={{
                left: `${50 + 35 * Math.cos((i * Math.PI * 2) / 6)}%`,
                top: `${50 + 35 * Math.sin((i * Math.PI * 2) / 6)}%`,
              }}
              animate={{
                scale: [0.5, 1.2, 0.5],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}

          {/* Connecting Lines */}
          <svg className="absolute inset-0 w-full h-full">
            {[...Array(6)].map((_, i) => (
              <motion.line
                key={i}
                x1="50%"
                y1="50%"
                x2={`${50 + 35 * Math.cos((i * Math.PI * 2) / 6)}%`}
                y2={`${50 + 35 * Math.sin((i * Math.PI * 2) / 6)}%`}
                stroke="rgb(251, 146, 60)"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{
                  duration: 1,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 1,
                }}
              />
            ))}
          </svg>
        </div>
        
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.h3 
            className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-3"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🤖 IA Processando
          </motion.h3>
          <p className="text-gray-700 mb-6 text-lg">
            Analisando suas respostas com inteligência artificial...
          </p>
        </motion.div>
        
        {/* Progress Indicators */}
        <div className="flex justify-center space-x-3 mb-6">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>

        {/* Status Text */}
        <motion.div
          className="text-sm text-orange-600 font-medium"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Otimizando experiência baseada no seu perfil
        </motion.div>
      </motion.div>
    </div>
  )

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

  if (analisandoIA) {
    return <LoadingIA />
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

      {/* Step atual com animação */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={`step-${stepAtual}`}
          className="mb-8 space-y-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Etapa {stepAtual + 1}
            </h2>
            <div className="flex items-center justify-between">
              <p className="text-base text-gray-600">
                {perguntasDoStep.filter((p: any) => !perguntasOcultas.has(p.id)).length} pergunta{perguntasDoStep.filter((p: any) => !perguntasOcultas.has(p.id)).length > 1 ? 's' : ''} nesta etapa
              </p>
              {perguntasOcultas.size > 0 && (
                <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-700 font-medium">
                    IA otimizou {perguntasOcultas.size} perguntas
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Perguntas com animação - Filtrar perguntas ocultas + remover duplicatas */}
          {[...perguntasDoStep, ...perguntasDinamicas.filter(p => p.step === stepsDisponiveis[stepAtual])]
            .filter((pergunta: any) => !perguntasOcultas.has(pergunta.id))
            .filter((pergunta: any, index: number, array: any[]) => {
              // Remover duplicatas baseado no texto da pergunta
              return array.findIndex(p => p.texto.toLowerCase().trim() === pergunta.texto.toLowerCase().trim()) === index
            })
            .map((pergunta: any, index: number) => (
            <motion.div
              key={pergunta.id}
              className="border border-gray-200 rounded-lg p-6 bg-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (index * 0.1), duration: 0.4 }}
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {index + 1}. {pergunta.texto}
                  {pergunta.geradaPorIA && (
                    <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                      🤖 IA
                    </span>
                  )}
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
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Simulador de Crédito IA - Mostrar no primeiro step após preenchimento */}
      {stepAtual === 0 && Object.keys(respostas).length >= 3 && (
        <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              🤖 Simulação de Crédito IA
            </h3>
            <p className="text-gray-600">
              Baseado nas suas respostas, vamos gerar uma simulação personalizada
            </p>
          </div>
          
          <div className="flex justify-center">
            <Button
              onClick={ativarSimuladorCreditoIA}
              disabled={analisandoIA}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 flex items-center gap-2"
            >
              {analisandoIA ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Simular Aprovação de Crédito
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Resultado da Simulação de Crédito */}
      {mostrarSimuladorCredito && dadosSimulacao && (
        <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              🤖 Resultado da Simulação
            </h3>
            <p className="text-gray-600">
              Análise completa baseada nas suas respostas
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-3">Resumo da Simulação</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Valor a Financiar:</span>
                  <span className="font-bold text-green-600">
                    R$ {dadosSimulacao.valorFinanciamento.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Entrada (20%):</span>
                  <span className="font-bold">
                    R$ {dadosSimulacao.entrada.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Parcela Máxima:</span>
                  <span className="font-bold">
                    R$ {dadosSimulacao.parcelaMaxima.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Comprometimento:</span>
                  <span className={`font-bold ${
                    dadosSimulacao.comprometimento <= 35 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {dadosSimulacao.comprometimento.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-3">Custos Adicionais</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>ITBI:</span>
                  <span>R$ {dadosSimulacao.custos.itbi.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Escritura:</span>
                  <span>R$ {dadosSimulacao.custos.escritura.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avaliação:</span>
                  <span>R$ {dadosSimulacao.custos.avaliacao.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Seguros e taxas:</span>
                  <span>R$ {dadosSimulacao.custos.seguros.toLocaleString('pt-BR')}</span>
                </div>
                <hr className="border-amber-300" />
                <div className="flex justify-between font-bold">
                  <span>Total aproximado:</span>
                  <span>R$ {(dadosSimulacao.custos.itbi + dadosSimulacao.custos.escritura + dadosSimulacao.custos.avaliacao + dadosSimulacao.custos.seguros).toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg text-center ${
            simulacaoAprovada 
              ? 'bg-green-100 border border-green-300' 
              : 'bg-red-100 border border-red-300'
          }`}>
            <div className={`text-lg font-bold mb-2 ${
              simulacaoAprovada ? 'text-green-800' : 'text-red-800'
            }`}>
              {simulacaoAprovada ? '✅ Pré-aprovação Concedida!' : '❌ Simulação Precisa de Ajustes'}
            </div>
            <p className={`text-sm ${
              simulacaoAprovada ? 'text-green-700' : 'text-red-700'
            }`}>
              {simulacaoAprovada 
                ? 'Parabéns! Você pode prosseguir para encontrar seu imóvel ideal.'
                : 'Revise os valores para melhorar sua capacidade de financiamento.'
              }
            </p>
          </div>
          
          <div className="flex justify-center mt-6">
            <Button
              onClick={() => {
                if (simulacaoAprovada) {
                  setMostrarSimuladorCredito(false)
                  setStepAtual(prev => prev + 1)
                } else {
                  setMostrarSimuladorCredito(false)
                }
              }}
              className={`px-8 py-3 ${
                simulacaoAprovada 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {simulacaoAprovada ? 'Continuar para Próxima Etapa' : 'Revisar Respostas'}
            </Button>
          </div>
        </div>
      )}

      {/* Navegação com animação */}
      {!mostrarSimuladorCredito && (
        <motion.div
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
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
            <AnimatePresence>
              {salvandoResposta && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  <span className="text-sm text-gray-500">Salvando...</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Botão WhatsApp para simulação instantânea */}
            <Button
              onClick={() => {
                // Coletar dados das respostas para WhatsApp
                const respostasTexto = Object.entries(respostas).map(([key, resp]) => {
                  const pergunta = perguntas.find(p => p.id === key)
                  const texto = pergunta?.texto || 'Pergunta'
                  const valor = typeof resp.valor === 'object' ? 'Arquivo enviado' : resp.valor
                  return `• ${texto}: ${valor}`
                }).join('\n')
                
                const dadosAdicionais = []
                if (cidadeDetectada) dadosAdicionais.push(`📍 Localização: ${cidadeDetectada}`)
                
                const mensagem = [
                  "🏠 *Simulação Imóvel - Imovia*",
                  "",
                  "*Minhas Respostas:*",
                  respostasTexto,
                  "",
                  dadosAdicionais.length > 0 ? "*Dados Detectados:*" : "",
                  ...dadosAdicionais,
                  "",
                  "Gostaria de uma análise personalizada dos imóveis disponíveis!"
                ].filter(Boolean).join('\n')
                
                window.open(`https://wa.me/554192223032?text=${encodeURIComponent(mensagem)}`, '_blank')
              }}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              Orçamento Rápido
            </Button>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={proximoStep}
                disabled={!podeAvancar() || salvandoResposta}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 transition-all duration-200"
              >
                {stepAtual === stepsDisponiveis.length - 1 ? 'Finalizar' : 'Próxima Etapa'}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}

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
