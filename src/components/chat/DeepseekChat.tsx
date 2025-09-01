"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Bot, 
  User, 
  Database, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Loader2,
  Code,
  Eye,
  Play,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from '@/components/ui/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface ChatMessage {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  sql?: string
  action?: string
  data?: any
  status?: 'success' | 'error' | 'pending' | 'confirmation_required'
}

interface ConfirmationDialog {
  open: boolean
  message: string
  sql: string
  action: string
}

export default function DeepseekChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      content: 'Olá! Sou seu assistente IA para gerenciar dados do iMovia. Posso ajudar você a:\n\n• **Consultar** dados (perguntas, respostas, clientes, construtoras)\n• **Criar** novos registros\n• **Atualizar** informações existentes\n• **Deletar** dados (com confirmação)\n\nExemplos:\n- "Mostre todas as perguntas ativas"\n- "Crie uma nova pergunta sobre localização"\n- "Atualize o email do cliente João"\n- "Quantos clientes temos cadastrados?"',
      timestamp: new Date(),
      status: 'success'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [confirmation, setConfirmation] = useState<ConfirmationDialog>({
    open: false,
    message: '',
    sql: '',
    action: ''
  })
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (message: string, actionType: string = 'query') => {
    if (!message.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/deepseek-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer temp-token'
        },
        body: JSON.stringify({
          message,
          action_type: actionType
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro na comunicação')
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.message || 'Operação processada',
        timestamp: new Date(),
        sql: data.sql,
        action: data.action,
        data: data.data,
        status: data.type === 'success' ? 'success' : 
               data.type === 'error' ? 'error' : 
               data.type === 'confirmation_required' ? 'confirmation_required' : 'pending'
      }

      setMessages(prev => [...prev, assistantMessage])

      // Se precisar de confirmação, abrir dialog
      if (data.type === 'confirmation_required') {
        setConfirmation({
          open: true,
          message: data.message,
          sql: data.sql,
          action: data.action
        })
      }

      // Se for sucesso, mostrar toast
      if (data.type === 'success') {
        toast({
          title: "Operação realizada",
          description: data.message,
        })
      }

    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        timestamp: new Date(),
        status: 'error'
      }
      setMessages(prev => [...prev, errorMessage])
      
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const confirmOperation = async (confirmed: boolean) => {
    if (!confirmed) {
      setConfirmation({ open: false, message: '', sql: '', action: '' })
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/deepseek-chat', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer temp-token'
        },
        body: JSON.stringify({
          sql: confirmation.sql,
          action: confirmation.action,
          confirmed: true
        })
      })

      const data = await response.json()

      const resultMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'assistant',
        content: data.message || 'Operação executada',
        timestamp: new Date(),
        sql: confirmation.sql,
        action: confirmation.action,
        data: data.data,
        status: response.ok ? 'success' : 'error'
      }

      setMessages(prev => [...prev, resultMessage])

      if (response.ok) {
        toast({
          title: "Operação confirmada",
          description: data.message,
        })
      }

    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao executar operação confirmada",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
      setConfirmation({ open: false, message: '', sql: '', action: '' })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputMessage)
  }

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.type === 'user'
    const isSystem = message.type === 'system'

    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Avatar */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser ? 'bg-orange-500' : isSystem ? 'bg-blue-500' : 'bg-gray-600'
          }`}>
            {isUser ? (
              <User className="w-4 h-4 text-white" />
            ) : isSystem ? (
              <Database className="w-4 h-4 text-white" />
            ) : (
              <Bot className="w-4 h-4 text-white" />
            )}
          </div>

          {/* Message Content */}
          <div className={`rounded-2xl px-4 py-3 ${
            isUser 
              ? 'bg-orange-500 text-white' 
              : isSystem
              ? 'bg-blue-50 border border-blue-200'
              : 'bg-gray-50 border border-gray-200'
          }`}>
            {/* Status Badge */}
            {message.status && !isUser && (
              <div className="flex items-center gap-2 mb-2">
                {message.status === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                {message.status === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
                {message.status === 'confirmation_required' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                <Badge variant={
                  message.status === 'success' ? 'default' :
                  message.status === 'error' ? 'destructive' :
                  message.status === 'confirmation_required' ? 'secondary' : 'outline'
                } className="text-xs">
                  {message.status === 'success' ? 'Sucesso' :
                   message.status === 'error' ? 'Erro' :
                   message.status === 'confirmation_required' ? 'Confirmação' : 'Processando'}
                </Badge>
              </div>
            )}

            {/* Message Text */}
            <div className="whitespace-pre-wrap text-sm">
              {message.content}
            </div>

            {/* SQL Code */}
            {message.sql && (
              <div className="mt-3 p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-400 uppercase">SQL</span>
                </div>
                <code className="text-xs text-green-400 font-mono">
                  {message.sql}
                </code>
              </div>
            )}

            {/* Data Results */}
            {message.data && Array.isArray(message.data) && message.data.length > 0 && (
              <div className="mt-3 p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-gray-600" />
                  <span className="text-xs text-gray-600 uppercase">Resultados ({message.data.length})</span>
                </div>
                <div className="max-h-40 overflow-auto">
                  <pre className="text-xs text-gray-700">
                    {JSON.stringify(message.data.slice(0, 5), null, 2)}
                    {message.data.length > 5 && '\n... e mais ' + (message.data.length - 5) + ' registros'}
                  </pre>
                </div>
              </div>
            )}

            {/* Timestamp */}
            <div className={`text-xs mt-2 ${isUser ? 'text-orange-100' : 'text-gray-500'}`}>
              {message.timestamp.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

 
}
