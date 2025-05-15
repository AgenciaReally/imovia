"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { HelpCircle, MessageCircle, CheckCircle, Clock, Building, Send } from "lucide-react"

interface Duvida {
  id: string
  clienteId: string
  cliente: {
    nome: string
    email: string
  }
  imovelId: string
  imovel: {
    nome: string
    endereco: string
  }
  mensagem: string
  status: "pendente" | "respondida" | "resolvida"
  dataCriacao: string
  dataResposta?: string
  resposta?: string
}

export default function DuvidasPage() {
  const { toast } = useToast()
  const [duvidas, setDuvidas] = useState<Duvida[]>([])
  const [duvidasFiltradas, setDuvidasFiltradas] = useState<Duvida[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("todas")
  const [respostaTexto, setRespostaTexto] = useState<Record<string, string>>({})
  const [enviandoResposta, setEnviandoResposta] = useState<Record<string, boolean>>({})

  // Buscar dúvidas da API
  useEffect(() => {
    const fetchDuvidas = async () => {
      try {
        setLoading(true)
        // Simular chamada à API com dados fictícios
        setTimeout(() => {
          const dadosFicticios: Duvida[] = [
            {
              id: "1",
              clienteId: "c1",
              cliente: {
                nome: "João Silva",
                email: "joao.silva@example.com"
              },
              imovelId: "i1",
              imovel: {
                nome: "Studio Itaim Bibi 4",
                endereco: "Rua Augusta, 123 - Itaim Bibi"
              },
              mensagem: "Olá, gostaria de saber se este imóvel possui vaga de garagem e se aceita pets.",
              status: "pendente",
              dataCriacao: "2025-04-26T14:30:00Z"
            },
            {
              id: "2",
              clienteId: "c2",
              cliente: {
                nome: "Maria Oliveira",
                email: "maria.oliveira@example.com"
              },
              imovelId: "i1",
              imovel: {
                nome: "Studio Itaim Bibi 4",
                endereco: "Rua Augusta, 123 - Itaim Bibi"
              },
              mensagem: "Qual é a metragem exata da unidade? O anúncio mostra 45m², mas gostaria de confirmar.",
              status: "respondida",
              dataCriacao: "2025-04-25T10:15:00Z",
              dataResposta: "2025-04-25T11:45:00Z",
              resposta: "Olá Maria, a metragem exata da unidade é de 47,5m² de área privativa. Ficamos à disposição para mostrar a planta detalhada durante uma visita."
            },
            {
              id: "3",
              clienteId: "c3",
              cliente: {
                nome: "Carlos Neves",
                email: "carlos.neves@example.com"
              },
              imovelId: "i2",
              imovel: {
                nome: "Apartamento Moema",
                endereco: "Alameda dos Jurupis, 456 - Moema"
              },
              mensagem: "Qual é o valor do condomínio e IPTU deste imóvel?",
              status: "resolvida",
              dataCriacao: "2025-04-20T16:45:00Z",
              dataResposta: "2025-04-20T17:30:00Z",
              resposta: "Olá Carlos, o valor do condomínio é R$ 750,00 e o IPTU anual é de R$ 2.400,00, podendo ser parcelado em até 10x. Qualquer outra dúvida estamos à disposição."
            }
          ]
          
          setDuvidas(dadosFicticios)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Erro ao carregar dúvidas:", error)
        toast({
          variant: "destructive",
          title: "Erro ao carregar dúvidas",
          description: "Não foi possível obter a lista de dúvidas. Tente novamente."
        })
        setLoading(false)
      }
    }
    
    fetchDuvidas()
  }, [toast])

  // Filtrar dúvidas com base na tab ativa
  useEffect(() => {
    if (activeTab === "todas") {
      setDuvidasFiltradas(duvidas)
    } else {
      setDuvidasFiltradas(duvidas.filter(duvida => duvida.status === activeTab))
    }
  }, [activeTab, duvidas])

  // Responder a uma dúvida
  const responderDuvida = async (duvidaId: string) => {
    try {
      if (!respostaTexto[duvidaId] || respostaTexto[duvidaId].trim() === "") {
        toast({
          variant: "destructive",
          title: "Erro ao responder",
          description: "A resposta não pode estar vazia."
        })
        return
      }
      
      setEnviandoResposta({...enviandoResposta, [duvidaId]: true})
      
      // Simulando chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const duvidaAtualizada = duvidas.map(d => {
        if (d.id === duvidaId) {
          return {
            ...d,
            status: "respondida" as const,
            resposta: respostaTexto[duvidaId],
            dataResposta: new Date().toISOString()
          }
        }
        return d
      })
      
      setDuvidas(duvidaAtualizada)
      setRespostaTexto({...respostaTexto, [duvidaId]: ""})
      
      toast({
        title: "Resposta enviada com sucesso",
        description: "O cliente será notificado sobre sua resposta."
      })
    } catch (error) {
      console.error("Erro ao responder dúvida:", error)
      toast({
        variant: "destructive",
        title: "Erro ao enviar resposta",
        description: "Não foi possível enviar sua resposta. Tente novamente."
      })
    } finally {
      setEnviandoResposta({...enviandoResposta, [duvidaId]: false})
    }
  }
  
  // Marcar dúvida como resolvida
  const marcarComoResolvida = async (duvidaId: string) => {
    try {
      // Simulando chamada à API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const duvidaAtualizada = duvidas.map(d => {
        if (d.id === duvidaId) {
          return {
            ...d,
            status: "resolvida" as const
          }
        }
        return d
      })
      
      setDuvidas(duvidaAtualizada)
      
      toast({
        title: "Dúvida marcada como resolvida",
        description: "Esta dúvida foi arquivada como resolvida."
      })
    } catch (error) {
      console.error("Erro ao marcar dúvida como resolvida:", error)
      toast({
        variant: "destructive",
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da dúvida. Tente novamente."
      })
    }
  }

  // Componente para mostrar status da dúvida
  const StatusBadge = ({ status }: { status: Duvida['status'] }) => {
    const statusMap = {
      pendente: { label: "Pendente", variant: "outline", icon: Clock },
      respondida: { label: "Respondida", variant: "secondary", icon: MessageCircle },
      resolvida: { label: "Resolvida", variant: "success", icon: CheckCircle }
    }
    
    const { label, variant, icon: Icon } = statusMap[status]
    
    return (
      <Badge variant={variant as any} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    )
  }

  // Estado vazio
  const EmptyState = () => (
    <Card className="text-center p-8">
      <div className="flex flex-col items-center justify-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <HelpCircle className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg mb-2">Nenhuma dúvida para exibir</h3>
        <p className="text-muted-foreground max-w-md mb-6">
          Quando clientes tiverem dúvidas sobre seus imóveis, elas aparecerão aqui para que você possa respondê-las.
        </p>
      </div>
    </Card>
  )

  // Cartão de dúvida
  const DuvidaCard = ({ duvida }: { duvida: Duvida }) => (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`/avatars/user-${parseInt(duvida.clienteId) % 10}.png`} />
              <AvatarFallback>
                {duvida.cliente.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{duvida.cliente.nome}</CardTitle>
              <CardDescription className="text-sm">
                {new Date(duvida.dataCriacao).toLocaleDateString()} às {new Date(duvida.dataCriacao).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </CardDescription>
            </div>
          </div>
          <StatusBadge status={duvida.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Building className="h-4 w-4 mr-2" />
          <span>{duvida.imovel.nome}</span>
        </div>
        
        <div className="p-3 bg-muted/30 rounded-md">
          <p className="text-sm">{duvida.mensagem}</p>
        </div>
        
        {duvida.resposta && (
          <div className="p-3 bg-primary/5 rounded-md border-l-2 border-primary ml-4">
            <div className="flex items-center mb-2">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarFallback className="text-xs">VC</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                Você respondeu em {new Date(duvida.dataResposta!).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm">{duvida.resposta}</p>
          </div>
        )}
        
        {duvida.status === "pendente" && (
          <div className="pt-2">
            <Textarea
              placeholder="Digite sua resposta..."
              className="mb-2"
              value={respostaTexto[duvida.id] || ""}
              onChange={(e) => setRespostaTexto({...respostaTexto, [duvida.id]: e.target.value})}
            />
            <div className="flex justify-end gap-2">
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => responderDuvida(duvida.id)}
                disabled={enviandoResposta[duvida.id]}
              >
                <Send className="h-4 w-4 mr-2" />
                {enviandoResposta[duvida.id] ? "Enviando..." : "Responder"}
              </Button>
            </div>
          </div>
        )}
        
        {duvida.status === "respondida" && (
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => marcarComoResolvida(duvida.id)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Marcar como resolvida
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <DashboardLayout userRole="construtora">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Dúvidas</h1>
        <p className="text-muted-foreground">Responda às dúvidas dos clientes sobre seus imóveis</p>
      </div>
      <Tabs defaultValue="todas" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="todas">
              Todas
            </TabsTrigger>
            <TabsTrigger value="pendente">
              Pendentes
            </TabsTrigger>
            <TabsTrigger value="respondida">
              Respondidas
            </TabsTrigger>
            <TabsTrigger value="resolvida">
              Resolvidas
            </TabsTrigger>
          </TabsList>
          
          <div className="text-sm text-muted-foreground">
            Mostrando {duvidasFiltradas.length} de {duvidas.length} dúvidas
          </div>
        </div>
        
        <TabsContent value="todas" className="space-y-4 mt-0">
          {loading ? (
            <>
              <Skeleton className="h-[200px] w-full mb-4" />
              <Skeleton className="h-[200px] w-full mb-4" />
            </>
          ) : duvidasFiltradas.length === 0 ? (
            <EmptyState />
          ) : (
            duvidasFiltradas.map(duvida => (
              <DuvidaCard key={duvida.id} duvida={duvida} />
            ))
          )}
        </TabsContent>
        
        {/* As outras tabs seguem o mesmo padrão */}
        {["pendente", "respondida", "resolvida"].map(tab => (
          <TabsContent key={tab} value={tab} className="space-y-4 mt-0">
            {loading ? (
              <>
                <Skeleton className="h-[200px] w-full mb-4" />
                <Skeleton className="h-[200px] w-full mb-4" />
              </>
            ) : duvidasFiltradas.length === 0 ? (
              <EmptyState />
            ) : (
              duvidasFiltradas.map(duvida => (
                <DuvidaCard key={duvida.id} duvida={duvida} />
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </DashboardLayout>
  )
}
