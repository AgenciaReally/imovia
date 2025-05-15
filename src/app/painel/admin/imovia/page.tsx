"use client"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BrainCircuit, MessageSquare, History as HistoryIcon, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { toast } from "sonner"

// Componente de Chat
const Chat = () => {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [requestTimeout, setRequestTimeout] = useState<NodeJS.Timeout | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant' | 'system', content: string, timestamp: Date, status?: 'loading' | 'success' | 'error' }[]>([
    { role: 'assistant', content: 'Olá! Sou a Imovi I.A. Como posso ajudar você hoje?', timestamp: new Date() }
  ])

  // Carregar conversa existente caso tenha sessionId no localStorage
  useEffect(() => {
    const storedSessionId = localStorage.getItem('ai_session_id')
    
    if (storedSessionId) {
      setSessionId(storedSessionId)
      fetchConversation(storedSessionId)
    }
  }, [])
  
  // Função para buscar conversa existente
  const fetchConversation = async (sid: string) => {
    try {
      const response = await fetch(`/api/ai?sessionId=${sid}`)
      
      if (response.ok) {
        const data = await response.json()
        
        if (data.messages && data.messages.length > 0) {
          // Converter as strings de timestamp para objetos Date
          const formattedMessages = data.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
          
          setChatHistory(formattedMessages)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar conversa:', error)
    }
  }

  // Efeito para rolar para o final da conversa quando nova mensagem é adicionada
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatHistory])

  // Detectar se a mensagem parece ser um comando de criação de imóvel
  const isCreationCommand = (msg: string) => {
    const lowerMsg = msg.toLowerCase()
    return lowerMsg.match(/^(criar?|adicionar?|cadastrar?|inserir?|novo) im[oó]vel/i) ||
           lowerMsg.match(/cadastr[eo] (um|uma) im[oó]vel/i) ||
           lowerMsg.match(/inserir? (um|uma) im[oó]vel/i)
  }

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return

    // Detectar se é provável um comando de criação de imóvel
    const isCreation = isCreationCommand(message)
    if (isCreation) {
      setIsCreating(true)
    }

    // Adiciona mensagem do usuário ao histórico local
    const userMessage = { role: 'user' as const, content: message, timestamp: new Date() }
    setChatHistory(prev => [...prev, userMessage])
    
    // Adiciona mensagem temporária do assistente com status de loading
    const loadingMessage = { 
      role: 'assistant' as const, 
      content: isCreation ? 'Processando criação do imóvel...' : 'Pensando...', 
      timestamp: new Date(),
      status: 'loading' as const
    }
    setChatHistory(prev => [...prev, loadingMessage])
    
    // Limpa o input e marca como carregando
    setMessage("")
    setIsLoading(true)
    
    // Configurar timeout para avisar se demorar muito
    const timeout = setTimeout(() => {
      // Substituir a mensagem de loading por uma mensagem de timeout
      setChatHistory(prev => {
        const newHistory = [...prev]
        const lastIndex = newHistory.length - 1
        if (newHistory[lastIndex].status === 'loading') {
          newHistory[lastIndex] = {
            role: 'assistant',
            content: 'A operação está demorando mais do que o esperado. Continuando a processar...',
            timestamp: new Date(),
            status: 'loading'
          }
        }
        return newHistory
      })
      
      // Mostrar toast de aviso
      toast.warning('A operação está demorando mais que o normal', {
        description: 'Isso pode indicar um problema ou alta demanda no servidor.'
      })
    }, 15000) // 15 segundos
    
    setRequestTimeout(timeout)
    
    try {
      // Preparar mensagens para enviar à API (sem timestamps)
      const messagesToSend = chatHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
      
      // Adicionar a mensagem do usuário
      messagesToSend.push({
        role: 'user',
        content: userMessage.content
      })
      
      // Chamar a API
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: messagesToSend,
          sessionId
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        
        // Salvar o sessionId no localStorage se for novo
        if (!sessionId && data.sessionId) {
          setSessionId(data.sessionId)
          localStorage.setItem('ai_session_id', data.sessionId)
        }
        
        // Remover a mensagem de loading e adicionar a resposta real
        setChatHistory(prev => {
          const newHistory = [...prev]
          // Remover última mensagem se for de loading
          if (newHistory.length > 0 && newHistory[newHistory.length - 1].status === 'loading') {
            newHistory.pop()
          }
          
          // Verificar se é resposta de criação ou atualização bem-sucedida
          const isSuccess = data.response.includes('✅') || 
                           data.response.includes('sucesso') || 
                           data.response.toLowerCase().includes('cadastrado com sucesso')
          
          // Adicionar resposta com status apropriado
          const aiResponse = { 
            role: 'assistant' as const, 
            content: data.response, 
            timestamp: new Date(),
            status: isSuccess ? 'success' as const : undefined
          }
          
          return [...newHistory, aiResponse]
        })
        
        // Mostrar toast de sucesso se houver criação/atualização bem-sucedida
        if (isCreating && data.response.includes('✅')) {
          toast.success('Imóvel criado com sucesso!', {
            description: 'O imóvel foi adicionado ao banco de dados.'
          })
        }
      } else {
        throw new Error('Erro na resposta da API')
      }
    } catch (error) {
      console.error("Erro na comunicação com a IA:", error)
      
      // Remover a mensagem de loading e substituir por mensagem de erro
      setChatHistory(prev => {
        const newHistory = [...prev]
        // Remover última mensagem se for de loading
        if (newHistory.length > 0 && newHistory[newHistory.length - 1].status === 'loading') {
          newHistory.pop()
        }
        // Adicionar mensagem de erro
        return [...newHistory, { 
          role: 'assistant', 
          content: 'Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.', 
          timestamp: new Date(),
          status: 'error'
        }]
      })
      
      // Mostrar toast de erro
      toast.error('Falha na comunicação com a IA', {
        description: 'Não foi possível processar sua solicitação. Tente novamente mais tarde.'
      })
    } finally {
      // Limpar timeout se existir
      if (requestTimeout) {
        clearTimeout(requestTimeout)
        setRequestTimeout(null)
      }
      
      setIsLoading(false)
      setIsCreating(false)
    }
  }

  return (
    <Card className="flex flex-col h-[calc(100vh-220px)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Chat com Imovi I.A
        </CardTitle>
        <CardDescription>
          Faça perguntas, gerencie imóveis, construtoras e clientes através de comandos de texto.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollRef}>
          {chatHistory.map((msg, index) => (
            <div key={index} className={`flex gap-3 mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <Avatar>
                  <AvatarImage src="/logo.png" />
                  <AvatarFallback>IA</AvatarFallback>
                </Avatar>
              )}
              <div className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground ml-auto' 
                  : msg.status === 'loading'
                    ? 'bg-muted border border-amber-300 animate-pulse'
                    : msg.status === 'success'
                      ? 'bg-muted border border-green-300'
                      : msg.status === 'error'
                        ? 'bg-muted border border-red-300'
                        : 'bg-muted'
              }`}>
                <div className="flex items-start gap-2">
                  {msg.status === 'loading' && (
                    <Loader2 className="h-4 w-4 animate-spin text-amber-500 mt-1" />
                  )}
                  {msg.status === 'success' && (
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                  )}
                  {msg.status === 'error' && (
                    <AlertCircle className="h-4 w-4 text-red-500 mt-1" />
                  )}
                  <p>{msg.content}</p>
                </div>
                <p className="text-xs opacity-70 mt-1">
                  {msg.timestamp.toLocaleTimeString()}
                </p>
              </div>
              {msg.role === 'user' && (
                <Avatar>
                  <AvatarFallback>EU</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <div className="flex w-full flex-col">
          <div className="flex gap-2 w-full">
            <Input 
              placeholder="Digite sua mensagem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? 'Processando...' : 'Enviar'}
            </Button>
          </div>
          {isCreating && isLoading && (
            <p className="text-xs text-amber-600 mt-2 animate-pulse">
              Criando imóvel no banco de dados. Isso pode levar alguns instantes...
            </p>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

// Componente de Histórico
const HistoryPanel = () => {
  const [historicos, setHistoricos] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    fetchHistory()
  }, [])
  
  const fetchHistory = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/ai?type=history')
      
      if (response.ok) {
        const data = await response.json()
        if (data.history) {
          setHistoricos(data.history)
        }
      }
    } catch (error) {
      console.error('Erro ao buscar histórico:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="flex flex-col h-[calc(100vh-220px)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HistoryIcon className="h-5 w-5" />
          Histórico de Ações
        </CardTitle>
        <CardDescription>
          Registro de todas as ações realizadas pela Imovi I.A
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : historicos.length > 0 ? (
              historicos.map(item => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">{item.entidade}</p>
                    <p className="text-sm text-muted-foreground">
                      Ação: {item.acao} {item.tipo}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={item.status === 'success' ? 'default' : 'destructive'}>
                      {item.status === 'success' ? 'Sucesso' : 'Erro'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum registro de ação encontrado
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// Interface para o componente PageTitle
interface PageTitleProps {
  title: string
  description?: string
  icon?: React.ReactNode
  className?: string
  actions?: React.ReactNode
}

// Componente de título de página
const PageTitle = ({ title, description, icon, className, actions }: PageTitleProps) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-3 ${className || ''}`}>
      <div className="flex items-center gap-3">
        {icon && <div className="text-primary">{icon}</div>}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  )
}

export default function ImoviaIAPage() {
  return (
    <DashboardLayout userRole="admin">
      <div className="container mx-auto">
        <PageTitle 
          title="Imovi I.A"
          icon={<BrainCircuit className="h-6 w-6" />}
          description="Assistente inteligente para gerenciamento do sistema"
        />
        
        <Tabs defaultValue="chat" className="mt-6">
          <TabsList className="mb-4">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <HistoryIcon className="h-4 w-4" />
              Histórico
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat">
            <Chat />
          </TabsContent>
          
          <TabsContent value="history">
            <HistoryPanel />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
