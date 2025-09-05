import { useCallback, useEffect, useRef } from 'react'

interface AnalyticsEvent {
  evento: string
  pagina: string
  elemento?: string
  propriedades?: Record<string, any>
  userId?: string
}

// Gerar ID único para sessão
const generateSessionId = () => {
  // Verificar se está no lado do cliente (browser)
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
    // Durante SSR/prerendering, retornar um ID temporário
    return `ssr_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  const existing = sessionStorage.getItem('analytics-session-id')
  if (existing) return existing
  
  const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  sessionStorage.setItem('analytics-session-id', newId)
  return newId
}

export const useAnalytics = () => {
  const sessaoId = useRef<string>(generateSessionId())

  const track = useCallback(async (event: AnalyticsEvent) => {
    try {
      // Verificar se está no lado do cliente
      if (typeof window === 'undefined') {
        return // Não fazer tracking durante SSR
      }

      // Obter userId se disponível
      let userId: string | undefined
      try {
        const userSession = localStorage.getItem('user-session')
        if (userSession) {
          const userData = JSON.parse(userSession)
          userId = userData.id
        }
      } catch (e) {
        // Ignorar erro de parsing
      }

      const payload = {
        ...event,
        sessaoId: sessaoId.current,
        userId: userId || event.userId
      }

      // Enviar de forma assíncrona sem bloquear UI
      fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      }).catch(error => {
        console.warn('Erro ao enviar analytics:', error)
      })

    } catch (error) {
      console.warn('Erro no tracking:', error)
    }
  }, [])

  // Tracking automático de acesso à página
  const trackPageView = useCallback((pagina: string, propriedades?: Record<string, any>) => {
    track({
      evento: 'ACESSO_PAGINA',
      pagina,
      propriedades: {
        timestamp: new Date().toISOString(),
        ...propriedades
      }
    })
  }, [track])

  // Tracking de cliques em elementos
  const trackClick = useCallback((elemento: string, pagina: string, propriedades?: Record<string, any>) => {
    track({
      evento: 'CLIQUE_ELEMENTO',
      pagina,
      elemento,
      propriedades
    })
  }, [track])

  // Tracking de formulário iniciado
  const trackFormStart = useCallback((pagina: string, formulario: string, propriedades?: Record<string, any>) => {
    track({
      evento: 'FORMULARIO_INICIADO',
      pagina,
      elemento: formulario,
      propriedades
    })
  }, [track])

  // Tracking de formulário concluído
  const trackFormComplete = useCallback((pagina: string, formulario: string, propriedades?: Record<string, any>) => {
    track({
      evento: 'FORMULARIO_CONCLUIDO',
      pagina,
      elemento: formulario,
      propriedades
    })
  }, [track])

  // Tracking de relatório solicitado
  const trackReportRequest = useCallback((pagina: string, propriedades?: Record<string, any>) => {
    track({
      evento: 'RELATORIO_SOLICITADO',
      pagina,
      propriedades
    })
  }, [track])

  return {
    track,
    trackPageView,
    trackClick,
    trackFormStart,
    trackFormComplete,
    trackReportRequest
  }
}
