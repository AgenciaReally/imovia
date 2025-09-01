// Sistema de logs para rastrear salvamento de respostas
export interface LogEntry {
  timestamp: string
  level: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
  category: 'RESPONSE_SAVE' | 'DEEPSEEK' | 'FORM_FLOW' | 'FILE_UPLOAD' | 'SYSTEM'
  action: string
  details: any
  userId?: string
  sessionId?: string
}

class Logger {
  private logs: LogEntry[] = []
  private maxLogs = 1000 // Manter apenas os últimos 1000 logs

  private createLog(
    level: LogEntry['level'], 
    category: LogEntry['category'], 
    action: string, 
    details: any, 
    userId?: string, 
    sessionId?: string
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      category,
      action,
      details,
      userId,
      sessionId
    }
  }

  // Logs para salvamento de respostas
  responseAttempt(perguntaId: string, valor: any, userId?: string, sessionId?: string) {
    const log = this.createLog('INFO', 'RESPONSE_SAVE', 'ATTEMPT', {
      perguntaId,
      valor,
      hasUser: !!userId,
      hasSession: !!sessionId
    }, userId, sessionId)
    
    this.addLog(log)
    console.log(`🔄 [TENTATIVA SALVAMENTO] Pergunta: ${perguntaId}`, log.details)
  }

  responseSuccess(perguntaId: string, respostaId: string, userId?: string, sessionId?: string) {
    const log = this.createLog('SUCCESS', 'RESPONSE_SAVE', 'SUCCESS', {
      perguntaId,
      respostaId,
      saved: true
    }, userId, sessionId)
    
    this.addLog(log)
    console.log(`✅ [SALVAMENTO OK] Resposta salva ID: ${respostaId}`, log.details)
  }

  responseError(perguntaId: string, error: any, userId?: string, sessionId?: string) {
    const log = this.createLog('ERROR', 'RESPONSE_SAVE', 'ERROR', {
      perguntaId,
      error: error.message || error,
      stack: error.stack
    }, userId, sessionId)
    
    this.addLog(log)
    console.error(`❌ [ERRO SALVAMENTO] Pergunta: ${perguntaId}`, log.details)
  }

  // Logs para Deepseek
  deepseekOptimization(action: string, details: any, userId?: string) {
    const log = this.createLog('INFO', 'DEEPSEEK', action, details, userId)
    this.addLog(log)
    console.log(`🧠 [DEEPSEEK ${action}]`, details)
  }

  // Logs para fluxo do formulário
  formProgress(step: number, totalSteps: number, userId?: string, sessionId?: string) {
    const log = this.createLog('INFO', 'FORM_FLOW', 'PROGRESS', {
      step,
      totalSteps,
      percentage: Math.round((step / totalSteps) * 100)
    }, userId, sessionId)
    
    this.addLog(log)
    console.log(`📊 [PROGRESSO FORMULÁRIO] ${step}/${totalSteps} (${Math.round((step / totalSteps) * 100)}%)`)
  }

  // Logs específicos para Deepseek AI
  logDeepseek(action: string, details?: any, userId?: string, sessionId?: string) {
    const log = this.createLog('INFO', 'DEEPSEEK', action, details, userId, sessionId)
    this.addLog(log)
    console.log(`🧠 [DEEPSEEK] ${action}`, details || '')
  }

  formComplete(totalRespostas: number, userId?: string, sessionId?: string) {
    const log = this.createLog('SUCCESS', 'FORM_FLOW', 'COMPLETED', {
      totalRespostas,
      completedAt: new Date().toISOString()
    }, userId, sessionId)
    
    this.addLog(log)
    console.log(`🎉 [FORMULÁRIO COMPLETO] ${totalRespostas} respostas salvas`, log.details)
  }

  // Logs para upload de arquivos
  fileUploadSuccess(filename: string, url: string, size: number) {
    const log = this.createLog('SUCCESS', 'FILE_UPLOAD', 'UPLOAD_SUCCESS', {
      filename,
      url,
      size,
      sizeFormatted: this.formatFileSize(size)
    })
    
    this.addLog(log)
    console.log(`📁 [UPLOAD OK] ${filename} - ${this.formatFileSize(size)}`, log.details)
  }

  fileUploadError(filename: string, error: any) {
    const log = this.createLog('ERROR', 'FILE_UPLOAD', 'UPLOAD_ERROR', {
      filename,
      error: error.message || error
    })
    
    this.addLog(log)
    console.error(`❌ [UPLOAD ERRO] ${filename}:`, error)
  }

  // Utilitários
  private addLog(log: LogEntry) {
    this.logs.unshift(log) // Adiciona no início
    
    // Manter apenas os logs mais recentes
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs)
    }

    // Salvar no localStorage para debug
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('imovia_logs', JSON.stringify(this.logs.slice(0, 100))) // Apenas os 100 mais recentes
      } catch (e) {
        // Ignorar erros de localStorage
      }
    }
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Métodos para consultar logs
  getLogs(category?: LogEntry['category'], level?: LogEntry['level']): LogEntry[] {
    let filtered = [...this.logs]
    
    if (category) {
      filtered = filtered.filter(log => log.category === category)
    }
    
    if (level) {
      filtered = filtered.filter(log => log.level === level)
    }
    
    return filtered
  }

  getResponseLogs(userId?: string): LogEntry[] {
    let logs = this.getLogs('RESPONSE_SAVE')
    
    if (userId) {
      logs = logs.filter(log => log.userId === userId)
    }
    
    return logs
  }

  getErrorLogs(): LogEntry[] {
    return this.getLogs(undefined, 'ERROR')
  }

  // Relatório resumido
  getSummary() {
    const total = this.logs.length
    const errors = this.logs.filter(l => l.level === 'ERROR').length
    const successes = this.logs.filter(l => l.level === 'SUCCESS').length
    const responseSaves = this.logs.filter(l => l.category === 'RESPONSE_SAVE').length
    
    return {
      totalLogs: total,
      errors,
      successes,
      responseSaves,
      errorRate: total > 0 ? (errors / total * 100).toFixed(1) : '0%',
      successRate: total > 0 ? (successes / total * 100).toFixed(1) : '0%'
    }
  }

  // Limpar logs
  clear() {
    this.logs = []
    if (typeof window !== 'undefined') {
      localStorage.removeItem('imovia_logs')
    }
    console.log('🗑️ [LOGS] Logs limpos')
  }
}

// Instância singleton
export const logger = new Logger()

// Console personalizado para desenvolvimento
export const devConsole = {
  response: (message: string, data?: any) => console.log(`🔄 [RESPOSTA]`, message, data),
  success: (message: string, data?: any) => console.log(`✅ [SUCESSO]`, message, data),
  error: (message: string, data?: any) => console.error(`❌ [ERRO]`, message, data),
  deepseek: (message: string, data?: any) => console.log(`🧠 [DEEPSEEK]`, message, data),
  form: (message: string, data?: any) => console.log(`📋 [FORM]`, message, data),
  upload: (message: string, data?: any) => console.log(`📁 [UPLOAD]`, message, data)
}
