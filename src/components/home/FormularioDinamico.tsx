"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Phone, ChevronLeft, ChevronRight, Loader2, Clock, User, Mail, Building, MapPin, Calendar, CreditCard, Home, Star, Check, Target, Brain, Zap, TrendingUp, Award, Shield, CheckCircle } from 'lucide-react'
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
  
  // 🚨 DEBUG TEMPORÁRIO - REMOVER DEPOIS
  useEffect(() => {
    console.log('🔍 DEBUG BOTÃO ENCERRAR:', {
      stepAtual,
      stepsDisponiveis: stepsDisponiveis.length,
      respostasCount: Object.keys(respostas).length,
      respostas: Object.keys(respostas),
      condicao1: Object.keys(respostas).length >= 1,
      deveMostrarBotao: Object.keys(respostas).length >= 1
    });

    // 🔥 CRIAR BOTÃO BRUTAL FORÇADO NO DOM
    setTimeout(() => {
      // Remover botão anterior se existir
      const botaoExistente = document.getElementById('BOTAO_ENCERRAR_FORCADO');
      if (botaoExistente) {
        botaoExistente.remove();
      }

      // Criar botão absolutamente forçado
      const botaoForcado = document.createElement('button');
      botaoForcado.id = 'BOTAO_ENCERRAR_FORCADO';
      botaoForcado.innerHTML = '⚡ ENCERRAR AGORA (FORÇADO)';
      botaoForcado.style.cssText = `
        position: fixed !important;
        top: 20px !important;
        right: 20px !important;
        z-index: 99999 !important;
        background: #dc2626 !important;
        color: white !important;
        border: none !important;
        padding: 12px 20px !important;
        border-radius: 8px !important;
        font-weight: bold !important;
        font-size: 14px !important;
        cursor: pointer !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      `;
      
      botaoForcado.onclick = () => {
        console.log('🔥 BOTÃO FORÇADO CLICADO!');
        
        const limiteCredito = localStorage.getItem('limiteCredito') || '500000';
        const creditoAprovado = localStorage.getItem('creditoAprovado') === 'true';
        
        const respostasFinais = {
          ...respostas,
          limiteCredito: parseInt(limiteCredito),
          creditoAprovado,
          finalizacaoAntecipada: true,
          dataFinalizacao: new Date().toISOString(),
          metodoBotaoForcado: true
        };
        
        console.log('📋 FINALIZANDO COM BOTÃO FORÇADO:', respostasFinais);
        onComplete(respostasFinais);
      };
      
      // Adicionar ao body
      document.body.appendChild(botaoForcado);
      console.log('✅ BOTÃO FORÇADO ADICIONADO AO DOM');
    }, 1000);
  }, [stepAtual, stepsDisponiveis, respostas, onComplete])
  
  // Estados para geolocalização
  const [localizacaoObtida, setLocalizacaoObtida] = useState(false)
  const [cidadeDetectada, setCidadeDetectada] = useState<string>('')
  const [imoveisDisponiveis, setImoveisDisponiveis] = useState<number>(0)
  const [cidadeValidada, setCidadeValidada] = useState<boolean>(false)
  // Estados para simulador de crédito IA
  const [simulacaoAprovada, setSimulacaoAprovada] = useState(false);
  const [dadosSimulacao, setDadosSimulacao] = useState<any>(null);
  const [mostrarSimuladorCredito, setMostrarSimuladorCredito] = useState(false);
  
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
            console.log('🎯 Pergunta de cidade encontrada:', { id: perguntaCidade.id, texto: perguntaCidade.texto })
            console.log('🌍 Preenchendo com cidade detectada:', cidadeCompleta)
            await atualizarResposta(perguntaCidade.id, cidadeCompleta)
            
            // 🏠 Verificar imóveis disponíveis na região detectada
            try {
              const response = await fetch('/api/imoveis/verificar-regiao', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  cidadeCompleta: cidadeCompleta
                })
              })
              
              if (response.ok) {
                const { count, imoveis } = await response.json()
                
                console.log(`🏠 Imóveis encontrados em ${cidadeCompleta}:`, count)
                console.log('🏠 Exemplos:', imoveis?.slice(0, 3))
                
                // Atualizar estados de validação da cidade
                setImoveisDisponiveis(count)
                setCidadeValidada(count > 0)
                
                if (count > 0) {
                  toast({
                    title: `📍 Localização detectada!`,
                    description: `${cidadeCompleta} - ${count} imóveis disponíveis na região!`,
                    variant: "default"
                  })
                } else {
                  toast({
                    title: `❌ Localização detectada`,
                    description: `${cidadeCompleta} - Nenhum imóvel disponível nesta região no momento.`,
                    variant: "destructive"
                  })
                }
              }
            } catch (error) {
              console.error('Erro ao verificar imóveis na região:', error)
              toast({
                title: "📍 Localização detectada!",
                description: `Preenchido automaticamente: ${cidadeCompleta}`,
                variant: "default"
              })
            }
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
    
    // Log específico para arquivos
    if (valor && typeof valor === 'object' && valor.url && valor.filename) {
      console.log('📁 ARQUIVO SENDO SALVO:', {
        perguntaId,
        arquivo: {
          url: valor.url,
          filename: valor.filename,
          size: valor.size,
          type: valor.type
        }
      })
    }
    
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
    
    // 🏠 Verificar se é pergunta de cidade e fazer busca de imóveis
    if (pergunta && typeof valor === 'string' && valor.trim()) {
      const ehPerguntaCidade = pergunta.texto.toLowerCase().includes('cidade') || 
                              pergunta.texto.toLowerCase().includes('localização') ||
                              pergunta.texto.toLowerCase().includes('onde você mora')
      
      if (ehPerguntaCidade && valor.length > 3) {
        // Fazer verificação de imóveis quando usuário digita cidade
        try {
          const response = await fetch('/api/imoveis/verificar-regiao', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              cidadeCompleta: valor.trim()
            })
          })
          
          if (response.ok) {
            const { count } = await response.json()
            
            // Atualizar estados de validação da cidade
            setImoveisDisponiveis(count)
            setCidadeValidada(count > 0)
            
            if (count > 0) {
              toast({
                title: "🏠 Região verificada!",
                description: `${count} imóveis encontrados em ${valor}`,
                variant: "default"
              })
            } else {
              toast({
                title: "❌ Nenhum imóvel encontrado",
                description: `Não há imóveis disponíveis em ${valor} no momento.`,
                variant: "destructive"
              })
            }
            
            console.log(`🏠 Busca manual: ${count} imóveis em ${valor}`)
          }
        } catch (error) {
          console.error('Erro ao verificar região:', error)
        }
      }
    }
  }

  // 🧠 Análise IA avançada para otimizar perguntas
  const analisarEOtimizarPerguntas = async (respostasAtuais: Record<string, any>) => {
    // 🚫 BLOQUEAR IA no primeiro step
    const currentStepNumber = stepsDisponiveis[stepAtual]
    if (currentStepNumber === 1) {
      console.log('🚫 IA bloqueada no step 1')
      return
    }
    
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
      
      // 🚫 OTIMIZAÇÃO MAIS AGRESSIVA: Ocultar 15-25 perguntas por step baseado no perfil
      let perguntasOcultasCount = 0;
      
      if (rendaAlta) {
        perguntas.forEach(p => {
          if (p.texto.toLowerCase().includes('primeiro imóvel') ||
              p.texto.toLowerCase().includes('ajuda familiar') ||
              p.texto.toLowerCase().includes('fies') ||
              p.texto.toLowerCase().includes('auxílio governo') ||
              p.texto.toLowerCase().includes('programa habitacional') ||
              p.texto.toLowerCase().includes('minha casa minha vida') ||
              p.texto.toLowerCase().includes('financiamento facilitado') ||
              p.texto.toLowerCase().includes('entrada baixa') ||
              p.texto.toLowerCase().includes('sem comprovação de renda')) {
            perguntasParaOcultar.add(p.id)
            perguntasOcultasCount++
            console.log('🚫 IA ocultou pergunta renda alta:', p.texto.substring(0, 50) + '...')
          }
        })
      }
      
      if (!temFilhos) {
        perguntas.forEach(p => {
          if (p.texto.toLowerCase().includes('escola') ||
              p.texto.toLowerCase().includes('playground') ||
              p.texto.toLowerCase().includes('criança') ||
              p.texto.toLowerCase().includes('área infantil') ||
              p.texto.toLowerCase().includes('brinquedoteca') ||
              p.texto.toLowerCase().includes('berçário') ||
              p.texto.toLowerCase().includes('educação infantil') ||
              p.texto.toLowerCase().includes('pediatra') ||
              p.texto.toLowerCase().includes('parque infantil') ||
              p.texto.toLowerCase().includes('segurança para crianças')) {
            perguntasParaOcultar.add(p.id)
            perguntasOcultasCount++
            console.log('🚫 IA ocultou pergunta sem filhos:', p.texto.substring(0, 50) + '...')
          }
        })
      }
      
      if (investidor) {
        perguntas.forEach(p => {
          if (p.texto.toLowerCase().includes('primeira moradia') ||
              p.texto.toLowerCase().includes('sonho da casa própria') ||
              p.texto.toLowerCase().includes('lar doce lar') ||
              p.texto.toLowerCase().includes('casa dos sonhos') ||
              p.texto.toLowerCase().includes('morar pela primeira vez') ||
              p.texto.toLowerCase().includes('sair da casa dos pais') ||
              p.texto.toLowerCase().includes('constituir família')) {
            perguntasParaOcultar.add(p.id)
            perguntasOcultasCount++
            console.log('🚫 IA ocultou pergunta investidor:', p.texto.substring(0, 50) + '...')
          }
        })
      }
      
      // 🚫 OCULTAÇÃO POR CATEGORIA DE PREFERÊNCIAS
      if (rendaMedia || rendaAlta) {
        perguntas.forEach(p => {
          if (p.categoria === 'BASICO' ||
              p.texto.toLowerCase().includes('básico') ||
              p.texto.toLowerCase().includes('simples') ||
              p.texto.toLowerCase().includes('econômico') ||
              p.texto.toLowerCase().includes('popular') ||
              p.texto.toLowerCase().includes('kit net') && rendaAlta) {
            perguntasParaOcultar.add(p.id)
            perguntasOcultasCount++
            console.log('🚫 IA ocultou pergunta básica:', p.texto.substring(0, 50) + '...')
          }
        })
      }
      
      // 🚫 OCULTAÇÃO POR LOCALIZAÇÃO (se já tem preferência clara)
      const temPreferenciaLocalizacao = respostasArray.some(r => 
        r.pergunta?.categoria === 'LOCALIZACAO' || 
        String(r.valor).toLowerCase().includes('centro') ||
        String(r.valor).toLowerCase().includes('bairro')
      )
      
      if (temPreferenciaLocalizacao) {
        perguntas.forEach(p => {
          if (p.categoria === 'LOCALIZACAO_ALTERNATIVA' ||
              (p.categoria === 'LOCALIZACAO' && !perguntasParaOcultar.has(p.id) && Math.random() > 0.6)) {
            perguntasParaOcultar.add(p.id)
            perguntasOcultasCount++
            console.log('🚫 IA ocultou pergunta localização redundante:', p.texto.substring(0, 50) + '...')
          }
        })
      }
      
      console.log(`🎯 [IA] Total de perguntas ocultadas: ${perguntasOcultasCount}`);
      
      // 🤖 IA: OTIMIZAÇÃO MAIS AGRESSIVA - Criar 5-10 perguntas dinâmicas por step
      const timestamp = Date.now()
      
      console.log('🎯 [IA] Criando perguntas dinâmicas baseadas no perfil:', {
        stepAtual,
        rendaAlta, rendaMedia, temFilhos, investidor, primeiroImovel,
        respostasAnalisadas: respostasArray.length
      });
      
      // ⚡ CATEGORIA 1: Investimento e Finalidade
      if (rendaAlta || investidor) {
        novasPerguntasDinamicas.push({
          id: `dinamica-investimento-${timestamp}`,
          texto: "Finalidade principal do imóvel?",
          tipo: "radio", 
          opcoes: ["Moradia própria", "Investimento para alugar", "Moradia + Renda extra", "Revenda futura"],
          obrigatoria: false,
          categoria: "INVESTIMENTO",
          step: stepAtual + 1,
          ordem: 1000,
          geradaPorIA: true
        })
        
        novasPerguntasDinamicas.push({
          id: `dinamica-rentabilidade-${timestamp + 1}`,
          texto: "Prioridade na rentabilidade?",
          tipo: "radio",
          opcoes: ["Máxima rentabilidade", "Valorização a longo prazo", "Facilidade para alugar", "Não é prioridade"],
          obrigatoria: false,
          categoria: "INVESTIMENTO", 
          step: stepAtual + 1,
          ordem: 1001,
          geradaPorIA: true
        })
      }
      
      // ⚡ CATEGORIA 2: Localização e Proximidades
      novasPerguntasDinamicas.push({
        id: `dinamica-localizacao-${timestamp + 2}`,
        texto: "Principal critério de localização?",
        tipo: "radio",
        opcoes: ["Próximo ao trabalho", "Centro da cidade", "Bairros nobres", "Transporte público", "Escolas próximas"],
        obrigatoria: false,
        categoria: "LOCALIZACAO",
        step: stepAtual + 1,
        ordem: 1002,
        geradaPorIA: true
      })
      
      novasPerguntasDinamicas.push({
        id: `dinamica-transporte-${timestamp + 3}`,
        texto: "Principal meio de transporte?",
        tipo: "radio",
        opcoes: ["Carro próprio", "Transporte público", "A pé/bicicleta", "Misto", "Trabalho remoto"],
        obrigatoria: false,
        categoria: "MOBILIDADE",
        step: stepAtual + 1,
        ordem: 1003,
        geradaPorIA: true
      })
      
      // ⚡ CATEGORIA 3: Família e Estilo de Vida
      if (temFilhos) {
        novasPerguntasDinamicas.push({
          id: `dinamica-familia-${timestamp + 4}`,
          texto: "Infraestrutura para família?", 
          tipo: "checkbox",
          opcoes: ["Playground", "Piscina", "Quadra esportiva", "Área gourmet", "Salão de festas", "Área pet"],
          obrigatoria: false,
          categoria: "FAMILIA",
          step: stepAtual + 1,
          ordem: 1004,
          geradaPorIA: true
        })
        
        novasPerguntasDinamicas.push({
          id: `dinamica-seguranca-${timestamp + 5}`,
          texto: "Nível de segurança desejado?",
          tipo: "radio",
          opcoes: ["Máxima (condomínio fechado)", "Alta (portaria 24h)", "Moderada (controle básico)", "Não é prioridade"],
          obrigatoria: false,
          categoria: "SEGURANCA",
          step: stepAtual + 1,
          ordem: 1005,
          geradaPorIA: true
        })
      }
      
      // ⚡ CATEGORIA 4: Características do Imóvel  
      novasPerguntasDinamicas.push({
        id: `dinamica-prioridades-${timestamp + 6}`,
        texto: "O que é mais importante no imóvel?",
        tipo: "radio",
        opcoes: ["Área ampla", "Boa iluminação", "Varanda/sacada", "Múltiplos quartos", "Área de serviço", "Garagem"],
        obrigatoria: false,
        categoria: "CARACTERISTICAS",
        step: stepAtual + 1,
        ordem: 1006,
        geradaPorIA: true
      })
      
      // ⚡ CATEGORIA 5: Estilo de Vida e Preferências
      if (rendaAlta) {
        novasPerguntasDinamicas.push({
          id: `dinamica-lifestyle-${timestamp + 7}`,
          texto: "Estilo de vida preferido?",
          tipo: "radio",
          opcoes: ["Urbano moderno", "Residencial tranquilo", "Próximo à natureza", "Centro comercial", "Não tenho preferência"],
          obrigatoria: false,
          categoria: "LIFESTYLE",
          step: stepAtual + 1,
          ordem: 1007,
          geradaPorIA: true
        })
        
        novasPerguntasDinamicas.push({
          id: `dinamica-lazer-${timestamp + 8}`,
          texto: "Atividades de lazer importantes?",
          tipo: "checkbox",
          opcoes: ["Academia", "Spa/sauna", "Cinema/teatro próximo", "Restaurantes", "Shopping", "Parques"],
          obrigatoria: false,
          categoria: "LAZER",
          step: stepAtual + 1,
          ordem: 1008,
          geradaPorIA: true
        })
      }
      
      // ⚡ CATEGORIA 6: Flexibilidade e Futuro
      if (primeiroImovel) {
        novasPerguntasDinamicas.push({
          id: `dinamica-futuro-${timestamp + 9}`,
          texto: "Planos para os próximos 5 anos?",
          tipo: "radio",
          opcoes: ["Morar definitivamente", "Possível mudança de cidade", "Crescimento da família", "Upgrade para imóvel maior", "Não sei ainda"],
          obrigatoria: false,
          categoria: "PLANEJAMENTO",
          step: stepAtual + 1,
          ordem: 1009,
          geradaPorIA: true
        })
      }
      
      console.log(`🤖 IA criou ${novasPerguntasDinamicas.length} perguntas e vai ocultar ${perguntasParaOcultar.size} perguntas`)
      
      // Atualizar perguntas ocultas
      setPerguntasOcultas(perguntasParaOcultar)
      
      // 🚫 EVITAR REPETIÇÃO: Verificar duplicatas rigorosamente
      const perguntasExistentes = [...perguntas, ...perguntasDinamicas]
      const perguntasUnicas = novasPerguntasDinamicas.filter((novaPergunta: any) => {
        const jaExiste = perguntasExistentes.some(existente => 
          existente.texto.toLowerCase().trim() === novaPergunta.texto.toLowerCase().trim() ||
          existente.id.includes('dinamica-investimento') && novaPergunta.id.includes('dinamica-investimento') ||
          existente.id.includes('dinamica-localizacao') && novaPergunta.id.includes('dinamica-localizacao') ||
          existente.id.includes('dinamica-familia') && novaPergunta.id.includes('dinamica-familia')
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
        // NÃO finalizar formulário - apenas mostrar resultado da IA
        console.log('✅ Análise de compatibilidade concluída (sem finalizar formulário)')
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
        // NÃO finalizar formulário - apenas mostrar resultado
        console.log('✅ Análise de compatibilidade concluída (etapa intermediária)')
      })
    }, 1000)
  }

  // Ativar simulador de crédito IA no final do primeiro step
  const ativarSimuladorCreditoIA = async () => {
    console.log('🎯 [SIMULAÇÃO] Iniciando simulação de crédito IA...')
    setAnalisandoIA(true)
    
    try {
      // Coletar dados das respostas do primeiro step para análise
      const respostasStep1 = Object.entries(respostas).filter(([key, resposta]) => {
        const pergunta = perguntas.find(p => p.id === key)
        return pergunta?.step === 1 && resposta.valor
      })
      
      console.log('🔍 Respostas encontradas para crédito:', respostasStep1.length)
      
      // Sempre mostrar simulador, mesmo sem respostas completas
      if (respostasStep1.length === 0) {
        console.log('⚠️ Nenhuma resposta de crédito encontrada, usando valores padrão')
      }
      
      // ANIMAÇÃO: Mostrar análise detalhada dos 7 campos
      // Delay progressivo mostrando cada campo sendo analisado
      console.log('🔄 [SIMULAÇÃO] Aguardando animação de 4 segundos...')
      await new Promise(resolve => setTimeout(resolve, 4000))
      console.log('✅ [SIMULAÇÃO] Animação concluída, processando dados...')
      
      // Simular análise IA para gerar simulação de crédito
      // Buscar valores das respostas independente do ID específico
      const respostasArray = Object.entries(respostas)
      let rendaBrutaFamiliar = 0
      let rendaMensalFamiliar = 0
      let valorParcelaMinima = 0
      let outrosFinanciamentos = 'Não possuo'
      let valorEntrada = 0;
      
      // Buscar pelos valores nas respostas existentes OU usar valores padrão para demonstração
      respostasArray.forEach(([key, resposta]) => {
        if (resposta?.valor) {
          const pergunta = perguntas.find(p => p.id === key)
          if (pergunta?.categoria === 'AVALIACAO_CREDITO') {
            const valor = Number(String(resposta.valor).replace(/[^\d]/g, '')) || 0
            
            // BUSCAR ENTRADA - pergunta "Qual valor você tem para dar de entrada"
            if (pergunta.texto.toLowerCase().includes('entrada')) {
              valorEntrada = valor
              console.log('💰 [ENTRADA] Valor encontrado:', valor)
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
      
      // Valores padrão se ainda não tiver nada
      if (valorEntrada === 0) valorEntrada = 100000
      if (rendaMensalFamiliar === 0) rendaMensalFamiliar = 8000
      if (valorParcelaMinima === 0) valorParcelaMinima = 2000
      
      const dadosParaSimulacao = {
        valorEntrada: valorEntrada,
        rendaBrutaFamiliar,
        outrosFinanciamentos,
        rendaMensalFamiliar,
        valorParcelaMinima
      }
      
      console.log('🔍 Dados coletados para simulação:', dadosParaSimulacao)
      
      // CORRIGIR: Calcular valor máximo do imóvel baseado na ENTRADA disponível
      // Se tem R$ 500k de entrada (20% do imóvel), pode comprar imóvel de R$ 2.5M
      const valorMaximoImovelPorEntrada = Number(dadosParaSimulacao.valorEntrada) / 0.2; // Entrada é 20% do valor total
      
      // Calcular valor máximo do imóvel baseado na RENDA (120x renda para financiamento + entrada)
      const valorFinanciamentoPorRenda = Number(dadosParaSimulacao.rendaMensalFamiliar) * 120; // 120x a renda mensal
      const valorMaximoImovelPorRenda = valorFinanciamentoPorRenda + Number(dadosParaSimulacao.valorEntrada);
      
      // O valor máximo do imóvel é o MENOR entre os dois limitadores
      const valorMaximoImovelFinal = Math.min(valorMaximoImovelPorEntrada, valorMaximoImovelPorRenda);
      
      // Valor de financiamento necessário (valor do imóvel - entrada)
      const valorFinanciamento = valorMaximoImovelFinal - Number(dadosParaSimulacao.valorEntrada);
      
      const entrada = Number(dadosParaSimulacao.valorEntrada) // Entrada informada pelo usuário
      const parcelaMaxima = Number(dadosParaSimulacao.rendaMensalFamiliar) * 0.3 // 30% da renda
      const comprometimento = (Number(dadosParaSimulacao.valorParcelaMinima) / Number(dadosParaSimulacao.rendaMensalFamiliar)) * 100
      
      // Determinar se foi aprovado
      const aprovado = comprometimento <= 35 && valorFinanciamento > 0 && Number(dadosParaSimulacao.valorEntrada) > 0
      
      console.log('💰 [SIMULAÇÃO] Cálculos:', {
        entradaInformada: Number(dadosParaSimulacao.valorEntrada),
        valorMaximoImovelPorEntrada,
        valorMaximoImovelPorRenda, 
        valorMaximoImovelFinal: valorMaximoImovelFinal,
        valorFinanciamento,
        comprometimento: `${comprometimento.toFixed(1)}%`
      });
      
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
      setDadosSimulacao(simulacao)
      
      // Salvar dados da simulação localmente (NÃO finalizar formulário ainda)
      if (aprovado) {
        // CORRIGIR: Salvar VALOR MÁXIMO DO IMÓVEL, não apenas financiamento
        localStorage.setItem('limiteCredito', valorMaximoImovelFinal.toString());
        localStorage.setItem('creditoAprovado', 'true');
        localStorage.setItem('simulacaoCredito', JSON.stringify(simulacao));
        
        console.log('💳 Limite de crédito aprovado salvo:', valorMaximoImovelFinal);
        
        // Atualizar respostas localmente com dados do crédito
        const respostasComCredito = {
          ...respostas,
          limiteCredito: valorMaximoImovelFinal,
          creditoAprovado: true,
          simulacaoCredito: simulacao
        };
        setRespostas(respostasComCredito);
      }
      
      // Mostrar resultado
      if (aprovado) {
        toast({
          title: "✅ Pré-aprovação concedida!",
          description: "Parabéns! Você pode prosseguir para o próximo step.",
        })
      } else {
        toast({
          title: "⚠️ Simulação gerada",
          description: "Revise os dados para melhorar sua aprovação.",
        })
      }
      
      // MOSTRAR resultado da simulação após análise
      console.log('🎯 [SIMULAÇÃO] Definindo mostrarSimuladorCredito = true')
      setMostrarSimuladorCredito(true)
      console.log('✅ [SIMULAÇÃO] Análise IA concluída, resultado exibido');
      
    } catch (error) {
      console.error('❌ [SIMULAÇÃO] Erro na simulação IA:', error)
      toast({
        title: "Erro na simulação",
        description: "Não foi possível gerar a simulação. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      console.log('🔄 [SIMULAÇÃO] Finally: Definindo analisandoIA = false')
      setAnalisandoIA(false)
      console.log('✅ [SIMULAÇÃO] Estado analisandoIA resetado para false')
    }
  }

  const stepAnterior = () => {
    if (stepAtual > 0) {
      setStepAtual(prev => prev - 1)
    }
  }

  // ⚡ IA Auto-Finalização Inteligente
  const verificarSeIADeveFinalizarFormulario = async () => {
    const totalRespostas = Object.keys(respostas).length
    
    console.log('🚫 [DEBUG] DESABILITANDO auto-finalização temporariamente para debug')
    return false // DESABILITAR TEMPORARIAMENTE
    
    // IA analisa se já tem dados suficientes para finalizar
    if (totalRespostas >= 3 && stepAtual >= 1) {
      setAnalisandoIA(true)
      
      try {
        // DEBUG: Log detalhado da análise
        console.log('🔍 [DEBUG] Verificando se IA deve finalizar:', {
          stepAtual,
          totalRespostas: Object.keys(respostas).length,
          cidadeDetectada,
          respostas: Object.keys(respostas)
        })
        
        // Verificar se temos as respostas essenciais
        const respostasArray = Object.entries(respostas)
        let temRenda = false
        let temValorImovel = false
        let temLocalizacao = false
        
        respostasArray.forEach(([key, resp]) => {
          const pergunta = perguntas.find(p => p.id === key)
          if (pergunta?.categoria === 'AVALIACAO_CREDITO') {
            if (pergunta.texto.toLowerCase().includes('renda')) temRenda = true
            if (pergunta.texto.toLowerCase().includes('valor') || pergunta.texto.toLowerCase().includes('preço')) temValorImovel = true
          }
        })
        
        // Se temos localização detectada ou respostas essenciais, finalizar
        if (cidadeDetectada) temLocalizacao = true
        
        console.log('🔍 [DEBUG] Critérios essenciais:', {
          temRenda,
          temValorImovel,
          temLocalizacao,
          cidadeDetectada
        })
        
        const dadosEssenciaisCompletos = (temRenda && temValorImovel && temLocalizacao) || totalRespostas >= 10
        
        console.log('🔍 [DEBUG] Avaliação final:', {
          dadosEssenciaisCompletos,
          stepAtual,
          shouldFinish: dadosEssenciaisCompletos || stepAtual >= 5
        })
        
        if (dadosEssenciaisCompletos || stepAtual >= 5) {
          // IA decide finalizar automaticamente
          toast({
            title: "🤖 IA Analisou Seu Perfil!",
            description: "Dados suficientes coletados. Finalizando e buscando imóveis ideais...",
            variant: "default"
          })
          
          // Simular análise IA por 2s e finalizar
          setTimeout(async () => {
            setAnalisandoIA(false)
            
            // Finalizar formulário automaticamente
            const respostasForAnalise = Object.entries(respostas).map(([perguntaId, resposta]) => ({
              perguntaId,
              valor: resposta.valor,
              tipo: resposta.tipo || 'text'
            }))

            matches.analisarCompatibilidade({
              respostasUsuario: respostasForAnalise
            }).then(() => {
              // NÃO finalizar formulário - apenas análise intermediária
              console.log('✅ Análise IA concluída (step intermediário)')
            })
          }, 2000)
          
          return true
        }
      } catch (error) {
        console.error('Erro na análise IA:', error)
        setAnalisandoIA(false)
      }
    }
    
    return false
  }

  // Avançar para próximo step
  const proximoStep = async () => {
    console.log('🚀 [DEBUG] proximoStep chamado:', {
      stepAtual,
      stepsDisponiveis: stepsDisponiveis.length,
      totalSteps: stepsDisponiveis,
      proximoStepSeria: stepAtual + 1
    })
    
    // ⚡ PRIMEIRO: Verificar se IA deve finalizar automaticamente
    const iaFinalizou = await verificarSeIADeveFinalizarFormulario()
    console.log('🤖 [DEBUG] IA finalizou?', iaFinalizou)
    if (iaFinalizou) return
    
    const novoContador = contadorSteps + 1
    setContadorSteps(novoContador)
    
    // DEBUG: Verificar condições da análise IA
    const deveAnalisarIA = stepAtual >= 1 && Object.keys(respostas).length >= 2
    console.log('🧠 [DEBUG] Deve analisar IA?', {
      stepAtual,
      totalRespostas: Object.keys(respostas).length,
      deveAnalisar: deveAnalisarIA
    })
    
    // Análise IA a cada step após o primeiro
    if (deveAnalisarIA) {
      setAnalisandoIA(true)
      
      // Análise IA mais rápida
      setTimeout(async () => {
        await analisarEOtimizarPerguntas(respostas)
        setAnalisandoIA(false)
        
        // Verificar novamente se deve finalizar após análise
        const iaFinalizouAposAnalise = await verificarSeIADeveFinalizarFormulario()
        console.log('🤖 [DEBUG] IA finalizou após análise?', iaFinalizouAposAnalise)
        if (iaFinalizouAposAnalise) return
        
        // Só avança se IA não finalizou
        if (stepAtual < stepsDisponiveis.length - 1) {
          console.log('✅ [DEBUG] Avançando para próximo step via IA')
          setStepAtual(prev => prev + 1)
        } else {
          console.log('⚠️ [DEBUG] Chegou ao final dos steps via IA')
        }
      }, 1500) // Análise mais rápida
      
      return
    }
    
    // DEBUG: Verificar condição final
    const isUltimoStep = stepAtual === stepsDisponiveis.length - 1;
    const podeAvancarProximoStep = stepAtual < stepsDisponiveis.length - 1;
    
    console.log('📊 [DEBUG] Análise de step:', {
      stepAtual,
      totalSteps: stepsDisponiveis.length,
      isUltimoStep,
      podeAvancarProximoStep,
      respostasCount: Object.keys(respostas).length
    })
    
    if (isUltimoStep) {
      console.log('🏁 [DEBUG] FINALIZANDO FORMULÁRIO - último step detectado')
      
      // Recuperar dados de crédito do localStorage
      const limiteCredito = localStorage.getItem('limiteCredito');
      const creditoAprovado = localStorage.getItem('creditoAprovado') === 'true';
      const simulacaoCredito = localStorage.getItem('simulacaoCredito');
      
      // Preparar respostas finais com dados de crédito
      const respostasFinais = {
        ...respostas,
        limiteCredito: limiteCredito ? parseFloat(limiteCredito) : null,
        creditoAprovado,
        simulacaoCredito: simulacaoCredito ? JSON.parse(simulacaoCredito) : null
      };
      
      console.log('💳 [DEBUG] Enviando dados finais:', {
        totalRespostas: Object.keys(respostasFinais).length,
        limiteCredito,
        creditoAprovado
      });
      
      // FINALIZAR formulário com dados completos
      onComplete(respostasFinais);
    } else if (podeAvancarProximoStep) {
      console.log('✅ [DEBUG] Avançando para próximo step normalmente')
      setStepAtual(prev => prev + 1)
    } else {
      console.log('⚠️ [DEBUG] Não pode avançar - validação falhou')
    }
  }

  const podeAvancar = () => {
    console.log('🔍 [VALIDAÇÃO] Verificando podeAvancar:', {
      stepAtual,
      stepsDisponiveis,
      mostrarSimuladorCredito,
      simulacaoAprovada
    });

    // 🚫 BLOQUEAR STEP 1: Deve executar simulação de crédito primeiro
    if (stepAtual === 0 && Object.keys(respostas).length >= 3) {
      if (!mostrarSimuladorCredito) {
        console.log('❌ [VALIDAÇÃO] Step 1 bloqueado - deve executar simulação de crédito primeiro');
        return false
      }
      if (mostrarSimuladorCredito && !simulacaoAprovada) {
        console.log('❌ [VALIDAÇÃO] Step 1 bloqueado - simulação de crédito não aprovada');
        return false
      }
    }

    // 🚫 BLOQUEAR se simulação de crédito foi recusada em outros steps
    if (mostrarSimuladorCredito && !simulacaoAprovada) {
      console.log('❌ [VALIDAÇÃO] Bloqueado - simulação de crédito não aprovada');
      return false
    }
    
    const currentStepNumber = stepsDisponiveis[stepAtual]
    if (!currentStepNumber) {
      console.log('❌ [VALIDAÇÃO] Bloqueado - step atual inválido:', currentStepNumber);
      return false
    }

    const questionsInStep = perguntasPorStep[currentStepNumber] || []
    console.log('📝 [VALIDAÇÃO] Perguntas no step:', {
      stepNumber: currentStepNumber,
      totalPerguntas: questionsInStep.length,
      perguntasObrigatorias: questionsInStep.filter(p => p.obrigatoria).length
    });
    
    const perguntasSemResposta = [];
    for (const pergunta of questionsInStep) {
      if (pergunta.obrigatoria && !perguntasOcultas.has(pergunta.id)) {
        const resposta = respostas[pergunta.id]
        if (!resposta?.valor) {
          perguntasSemResposta.push({
            id: pergunta.id,
            texto: pergunta.texto
          });
        }
      }
    }

    if (perguntasSemResposta.length > 0) {
      console.log('❌ [VALIDAÇÃO] Bloqueado - perguntas obrigatórias sem resposta:', perguntasSemResposta);
      return false
    }

    console.log('✅ [VALIDAÇÃO] Todas as validações passaram');
    return true
  }

  const progresso = stepsDisponiveis.length > 0 ? ((stepAtual + 1) / stepsDisponiveis.length) * 100 : 0

  // Loading animado da Simulação de Crédito - Análise dos 7 Campos
  const LoadingIA = () => {
    const [campoAtual, setCampoAtual] = useState(0);
    
    const campos7Step1 = [
      { nome: '💰 Valor da Entrada', desc: 'Analisando capacidade financeira inicial' },
      { nome: '📊 Renda Bruta Familiar', desc: 'Verificando estabilidade de renda' },
      { nome: '🏦 Financiamentos Existentes', desc: 'Checando comprometimento atual' },
      { nome: '💳 Renda Mensal', desc: 'Calculando capacidade de pagamento' },
      { nome: '📈 Valor da Parcela', desc: 'Determinando limite de financiamento' },
      { nome: '🏠 Custos de Transferência', desc: 'Validando reserva para despesas' },
      { nome: '🌍 Cidade Desejada', desc: 'Localizando imóveis disponíveis' }
    ];

    useEffect(() => {
      const interval = setInterval(() => {
        setCampoAtual(prev => {
          if (prev < campos7Step1.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 500); // Cada campo demora 500ms

      return () => clearInterval(interval);
    }, []);

    return (
      <div className="fixed inset-0 bg-gradient-to-br from-orange-900/20 via-black/60 to-orange-900/20 backdrop-blur-sm flex items-center justify-center z-50">
        <motion.div 
          className="bg-white/95 backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full mx-4 text-center shadow-2xl border border-orange-200/50"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 20 }}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              🤖 Simulação de Crédito IA
            </h3>
            <p className="text-gray-600">
              Analisando suas 7 respostas para calcular limite de crédito
            </p>
          </motion.div>

          {/* Lista dos 7 Campos */}
          <div className="space-y-3 mb-8">
            {campos7Step1.map((campo, index) => (
              <motion.div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-300 ${
                  index < campoAtual 
                    ? 'bg-green-50 border-green-300 text-green-800' 
                    : index === campoAtual 
                    ? 'bg-orange-50 border-orange-300 text-orange-800' 
                    : 'bg-gray-50 border-gray-200 text-gray-500'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    index < campoAtual 
                      ? 'bg-green-500' 
                      : index === campoAtual 
                      ? 'bg-orange-500' 
                      : 'bg-gray-300'
                  }`}>
                    {index < campoAtual ? (
                      <Check className="h-3 w-3 text-white" />
                    ) : index === campoAtual ? (
                      <motion.div 
                        className="w-2 h-2 bg-white rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                    ) : (
                      <span className="text-xs text-white">{index + 1}</span>
                    )}
                  </div>
                  <span className="font-medium">{campo.nome}</span>
                </div>
                
                {index === campoAtual && (
                  <motion.span 
                    className="text-sm italic"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {campo.desc}
                  </motion.span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <motion.div
              className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${((campoAtual + 1) / campos7Step1.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          <p className="text-sm text-gray-500">
            Processando campo {campoAtual + 1} de {campos7Step1.length}
          </p>
        </motion.div>
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

      {/* Simulador de Crédito IA - Mostrar apenas se cidade foi validada com imóveis */}
      {stepAtual === 0 && Object.keys(respostas).length >= 3 && cidadeValidada && imoveisDisponiveis > 0 && (
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
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                ativarSimuladorCreditoIA()
              }}
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
                  // Não avançar quando recusado - ficar no step atual
                }
              }}
              className={`px-8 py-3 ${
                simulacaoAprovada 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-500 hover:bg-red-600'
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

            {/* BOTÃO ENCERRAR AGORA - FORÇADO */}
            <Button
              onClick={() => {
                console.log('⚡ [ENCERRAR FORÇADO] Finalizando formulário');
                
                const limiteCredito = localStorage.getItem('limiteCredito') || '500000';
                const creditoAprovado = localStorage.getItem('creditoAprovado') === 'true';
                
                const respostasFinais = {
                  ...respostas,
                  limiteCredito: parseInt(limiteCredito),
                  creditoAprovado,
                  finalizacaoAntecipada: true,
                  dataFinalizacao: new Date().toISOString()
                };
                
                console.log('📋 Finalizando com respostas:', respostasFinais);
                onComplete(respostasFinais);
              }}
              className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 ml-3"
              style={{ display: 'flex !important' }}
            >
              ⚡ Encerrar Agora
            </Button>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => {
                  console.log('🔥 [CLICK] Botão clicado:', {
                    stepAtual,
                    totalSteps: stepsDisponiveis.length,
                    podeAvancar: podeAvancar(),
                    salvandoResposta,
                    disabled: !podeAvancar() || salvandoResposta
                  });
                  proximoStep();
                }}
                disabled={!podeAvancar() || salvandoResposta}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 transition-all duration-200 ml-3"
              >
                {salvandoResposta ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {stepAtual === stepsDisponiveis.length - 1 ? 'Ver Imóveis' : 'Próxima Etapa'}
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}

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
