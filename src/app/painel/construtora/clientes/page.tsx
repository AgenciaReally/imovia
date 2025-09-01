"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { MessageCircle, Phone, User, Mail, Calendar, Home, Building, Star } from "lucide-react"

// Tipagem para clientes
interface Cliente {
  id: string
  nome: string
  email: string
  telefone: string
  interesse: string
  dataCadastro: string
  dataMatch: string
  imovelDesejado: {
    id: string
    nome: string
    endereco: string
  }
  status: "novo" | "contato_pendente" | "negociacao" | "contrato" | "finalizado"
  observacoes?: string
  ultimaInteracao?: string
}

export default function ClientesPage() {
  const { toast } = useToast()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("todos")
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([])

  // Buscar clientes da construtora
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/construtora/clientes")
        
        if (!response.ok) {
          throw new Error("Erro ao buscar clientes")
        }
        
        const data = await response.json()
        setClientes(data.clientes || [])
      } catch (error) {
        console.error("Erro ao buscar clientes:", error)
        toast({
          variant: "destructive",
          title: "Erro ao carregar clientes",
          description: "Não foi possível obter a lista de clientes. Tente novamente."
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchClientes()
  }, [toast])

  // Filtrar clientes com base na tab ativa
  useEffect(() => {
    if (activeTab === "todos") {
      setClientesFiltrados(clientes)
    } else {
      setClientesFiltrados(clientes.filter(cliente => cliente.status === activeTab))
    }
  }, [activeTab, clientes])

  // Componente de carta de cliente
  const ClienteCard = ({ cliente }: { cliente: Cliente }) => {
    return (
      <Card className="transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`/avatars/user-${parseInt(cliente.id) % 10}.png`} />
                <AvatarFallback>
                  {cliente.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{cliente.nome}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  Match em {new Date(cliente.dataMatch).toLocaleDateString()}
                </CardDescription>
              </div>
            </div>
            <StatusBadge status={cliente.status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <Building className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium">{cliente.imovelDesejado.nome}</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{cliente.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{cliente.telefone}</span>
            </div>
            <div className="flex items-start">
              <Home className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
              <span>{cliente.interesse}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-xs text-muted-foreground">
              {cliente.ultimaInteracao ? 
                `Última interação: ${cliente.ultimaInteracao}` : 
                "Nenhuma interação registrada"}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Ligar
              </Button>
              <Button size="sm" variant="default">
                <MessageCircle className="h-4 w-4 mr-2" />
                Conversar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Badge de status
  const StatusBadge = ({ status }: { status: Cliente['status'] }) => {
    const statusMap = {
      novo: { label: "Novo Lead", variant: "default" },
      contato_pendente: { label: "Contato Pendente", variant: "outline" },
      negociacao: { label: "Em Negociação", variant: "secondary" },
      contrato: { label: "Contrato", variant: "warning" },
      finalizado: { label: "Finalizado", variant: "success" }
    }
    
    const statusInfo = statusMap[status]
    
    return (
      <Badge variant={statusInfo.variant as any}>
        {statusInfo.label}
      </Badge>
    )
  }

  // Estado vazio - sem clientes
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <User className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-lg mb-2">Sem clientes para exibir</h3>
      <p className="text-muted-foreground max-w-md">
        Ainda não há clientes que deram match com seus imóveis. Os clientes aparecem aqui quando 
        eles demonstram interesse pelos imóveis vinculados à sua construtora.
      </p>
    </div>
  )

  return (
    <DashboardLayout userRole="construtora">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
        <p className="text-muted-foreground">Gerencie os clientes que demonstraram interesse nos seus imóveis</p>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Visão Geral</CardTitle>
                <CardDescription>
                  {loading ? "Carregando estatísticas..." : 
                  `Total de ${clientes.length} clientes | ${clientes.filter(c => c.status === "novo").length} novos leads`}
                </CardDescription>
              </div>
              <Button>Exportar Lista</Button>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="todos">
                Todos
              </TabsTrigger>
              <TabsTrigger value="novo">
                Novos
              </TabsTrigger>
              <TabsTrigger value="contato_pendente">
                Pendentes
              </TabsTrigger>
              <TabsTrigger value="negociacao">
                Negociação
              </TabsTrigger>
              <TabsTrigger value="contrato">
                Contrato
              </TabsTrigger>
            </TabsList>
            
            <div className="text-sm text-muted-foreground">
              Mostrando {clientesFiltrados.length} de {clientes.length} clientes
            </div>
          </div>
          
          <TabsContent value="todos" className="m-0">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
              </div>
            ) : clientesFiltrados.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clientesFiltrados.map((cliente) => (
                  <ClienteCard key={cliente.id} cliente={cliente} />
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Outras tabs têm o mesmo padrão */}
          {["novo", "contato_pendente", "negociacao", "contrato", "finalizado"].map((tab) => (
            <TabsContent key={tab} value={tab} className="m-0">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map((_, i) => (
                    <Skeleton key={i} className="h-48 w-full" />
                  ))}
                </div>
              ) : clientesFiltrados.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {clientesFiltrados.map((cliente) => (
                    <ClienteCard key={cliente.id} cliente={cliente} />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
