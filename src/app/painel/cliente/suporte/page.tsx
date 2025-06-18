"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  MessageSquare, 
  Send, 
  User, 
  Bot,
  Clock,
  RefreshCcw,
  Loader2
} from "lucide-react"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

// Interface para mensagens
interface Mensagem {
  id: string
  conteudo: string
  remetente: 'USUARIO' | 'SISTEMA' | 'IA'
  dataCriacao: string
  lida?: boolean
}

// Componente para exibir uma mensagem
function MensagemItem({ mensagem }: { mensagem: Mensagem }) {
  const isUsuario = mensagem.remetente === 'USUARIO'
  
  // Função para formatar a data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(data)
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-3 ${isUsuario ? 'justify-end' : 'justify-start'} mb-4`}
    >
      {!isUsuario && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/images/bot-avatar.png" alt="Assistente" />
          <AvatarFallback className="bg-primary/20 text-primary">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[80%] ${isUsuario ? 'order-1' : 'order-2'}`}>
        <div 
          className={`px-4 py-2 rounded-2xl ${
            isUsuario 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{mensagem.conteudo}</p>
        </div>
        <div className="flex items-center mt-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          <span>{formatarData(mensagem.dataCriacao)}</span>
        </div>
      </div>
      
      {isUsuario && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/images/user-avatar.png" alt="Usuário" />
          <AvatarFallback className="bg-primary/20 text-primary">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  )
}

export default function SuporteClientePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [novaMensagem, setNovaMensagem] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  
  // Carregar histórico de mensagens
  useEffect(() => {
    const carregarMensagens = async () => {
      setLoading(true)
      try {
        // Buscar mensagens do cliente na API
        const response = await fetch('/api/cliente/suporte/mensagens')
        
        if (!response.ok) {
          throw new Error('Erro ao buscar mensagens')
        }
        
        const data = await response.json()
        setMensagens(data)
        
        // Se não houver mensagens, adicionar mensagem de boas-vindas
        if (data.length === 0) {
          const mensagemBoasVindas: Mensagem = {
            id: 'welcome',
            conteudo: 'Olá! Sou o assistente virtual da Imovia. Como posso ajudar você hoje?',
            remetente: 'IA',
            dataCriacao: new Date().toISOString()
          }
          setMensagens([mensagemBoasVindas])
        }
      } catch (error) {
        console.error('Erro ao carregar mensagens:', error)
        toast({
          title: "Erro ao carregar mensagens",
          description: "Não foi possível carregar o histórico de mensagens. Tente novamente mais tarde.",
          variant: "destructive"
        })
        
        // Adicionar mensagem de boas-vindas mesmo em caso de erro
        const mensagemBoasVindas: Mensagem = {
          id: 'welcome',
          conteudo: 'Olá! Sou o assistente virtual da Imovia. Como posso ajudar você hoje?',
          remetente: 'IA',
          dataCriacao: new Date().toISOString()
        }
        setMensagens([mensagemBoasVindas])
      } finally {
        setLoading(false)
      }
    }
    
    carregarMensagens()
  }, [])
  
  // Rolar para o final quando novas mensagens forem adicionadas
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [mensagens])
  
  // Função para enviar mensagem
  const enviarMensagem = async () => {
    if (!novaMensagem.trim()) return
    
    setEnviando(true)
    
    // Adicionar mensagem do usuário imediatamente para feedback
    const mensagemUsuario: Mensagem = {
      id: `temp-${Date.now()}`,
      conteudo: novaMensagem,
      remetente: 'USUARIO',
      dataCriacao: new Date().toISOString()
    }
    
    setMensagens(prev => [...prev, mensagemUsuario])
    setNovaMensagem("")
    
    try {
      // Enviar mensagem para a API
      const response = await fetch('/api/cliente/suporte/mensagens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ conteudo: novaMensagem })
      })
      
      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem')
      }
      
      // Obter resposta da IA
      const data = await response.json()
      
      // Adicionar resposta da IA
      const mensagemIA: Mensagem = {
        id: data.id || `ia-${Date.now()}`,
        conteudo: data.resposta || "Desculpe, estou com dificuldades para processar sua solicitação no momento. Por favor, tente novamente mais tarde.",
        remetente: 'IA',
        dataCriacao: new Date().toISOString()
      }
      
      setMensagens(prev => [...prev, mensagemIA])
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      
      // Adicionar mensagem de erro
      const mensagemErro: Mensagem = {
        id: `erro-${Date.now()}`,
        conteudo: "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente mais tarde.",
        remetente: 'IA',
        dataCriacao: new Date().toISOString()
      }
      
      setMensagens(prev => [...prev, mensagemErro])
      
      toast({
        title: "Erro ao enviar mensagem",
        description: "Não foi possível enviar sua mensagem. Tente novamente mais tarde.",
        variant: "destructive"
      })
    } finally {
      setEnviando(false)
    }
  }
  
  // Lidar com tecla Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      enviarMensagem()
    }
  }
  
  return (
    <DashboardLayout userRole="cliente" userName="Cliente">
      <div className="space-y-6 h-[calc(100vh-180px)] flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Suporte</h1>
            <p className="text-muted-foreground">
              Converse com nosso assistente virtual para tirar suas dúvidas
            </p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Atualizar conversa
          </Button>
        </div>
        
        {/* Chat container */}
        <Card className="flex-grow flex flex-col border-0 shadow-md">
          <CardHeader className="border-b bg-muted/30 py-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/images/bot-avatar.png" alt="Assistente" />
                <AvatarFallback className="bg-primary/20 text-primary">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">Assistente Imovia</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Assistente virtual para suporte
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-grow p-0 relative">
            {loading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className={`flex gap-3 ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    {i % 2 === 0 && (
                      <Skeleton className="h-8 w-8 rounded-full" />
                    )}
                    <div className={`max-w-[80%] ${i % 2 === 0 ? 'order-2' : 'order-1'}`}>
                      <Skeleton className={`h-16 w-[250px] rounded-2xl`} />
                      <div className="mt-1">
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    {i % 2 !== 0 && (
                      <Skeleton className="h-8 w-8 rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-320px)]" ref={scrollAreaRef}>
                <div className="p-6">
                  {mensagens.map((mensagem) => (
                    <MensagemItem key={mensagem.id} mensagem={mensagem} />
                  ))}
                  
                  {enviando && (
                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Assistente está digitando...</span>
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </CardContent>
          
          <CardFooter className="border-t p-3">
            <div className="relative w-full flex items-center">
              <Input
                placeholder="Digite sua mensagem..."
                value={novaMensagem}
                onChange={(e) => setNovaMensagem(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={enviando}
                className="pr-12"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-primary"
                onClick={enviarMensagem}
                disabled={!novaMensagem.trim() || enviando}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}
