"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Building, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Info, 
  RefreshCcw,
  ExternalLink,
  MessageSquare
} from "lucide-react"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"

// Interface para construtoras
interface Construtora {
  id: string
  nome: string
  cnpj: string
  telefone: string
  email: string
  endereco: string
  ativa: boolean
  imoveisCount?: number
  logo?: string
}

// Componente para exibir quando não há construtoras
function EmptyStateConstrutoras() {
  return (
    <div className="text-center py-16 bg-muted/30 rounded-xl">
      <Info className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
      <h3 className="text-xl font-medium">Nenhuma construtora encontrada</h3>
      <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">
        Não encontramos construtoras relacionadas aos seus imóveis. Faça uma simulação para encontrar imóveis e suas respectivas construtoras.
      </p>
      <Button 
        variant="default" 
        size="lg"
        onClick={() => window.location.href = "/"}
        className="gap-2"
      >
        <RefreshCcw className="h-4 w-4" />
        Nova simulação
      </Button>
    </div>
  )
}

// Card de construtora
function ConstrutoraCard({ construtora }: { construtora: Construtora }) {
  const router = useRouter()
  
  // Função para abrir WhatsApp
  const abrirWhatsApp = (telefone: string) => {
    // Remover caracteres não numéricos
    const numeroLimpo = telefone.replace(/\D/g, '')
    // Adicionar código do país se não tiver
    const numeroCompleto = numeroLimpo.startsWith('55') ? numeroLimpo : `55${numeroLimpo}`
    // Abrir WhatsApp
    window.open(`https://wa.me/${numeroCompleto}`, '_blank')
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden h-full flex flex-col border-0 shadow-md hover:shadow-lg transition-all duration-200">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-full">
              <Building className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg line-clamp-1">{construtora.nome}</CardTitle>
              {construtora.imoveisCount && (
                <p className="text-sm text-muted-foreground">
                  {construtora.imoveisCount} {construtora.imoveisCount === 1 ? 'imóvel' : 'imóveis'} disponíveis
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="px-4 py-2 flex-grow space-y-4">
          {/* Informações de contato */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{construtora.telefone}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{construtora.email}</span>
            </div>
            
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <span className="line-clamp-2">{construtora.endereco}</span>
            </div>
          </div>
          
          {/* Status */}
          <div>
            <Badge variant={construtora.ativa ? "default" : "secondary"} className="bg-green-100 text-green-800 hover:bg-green-100">
              {construtora.ativa ? "Ativa" : "Inativa"}
            </Badge>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-2 flex gap-2">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.open(`mailto:${construtora.email}`, '_blank')}
          >
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
          
          <Button 
            variant="default" 
            className="w-full"
            onClick={() => abrirWhatsApp(construtora.telefone)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            WhatsApp
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default function ConstrutorasClientePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [construtoras, setConstrutoras] = useState<Construtora[]>([])
  const [construtorasFiltradas, setConstrutorasFiltradas] = useState<Construtora[]>([])
  const [busca, setBusca] = useState("")
  
  // Carregar dados das construtoras
  useEffect(() => {
    const carregarConstrutoras = async () => {
      setLoading(true)
      try {
        // Buscar construtoras relacionadas aos imóveis do cliente
        const response = await fetch('/api/cliente/construtoras')
        
        if (!response.ok) {
          throw new Error('Erro ao buscar construtoras')
        }
        
        const data = await response.json()
        setConstrutoras(data)
        setConstrutorasFiltradas(data)
      } catch (error) {
        console.error('Erro ao carregar construtoras:', error)
        toast({
          title: "Erro ao carregar construtoras",
          description: "Não foi possível carregar as construtoras. Tente novamente mais tarde.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    
    carregarConstrutoras()
  }, [])
  
  // Filtrar construtoras quando a busca mudar
  useEffect(() => {
    if (busca.trim() === "") {
      setConstrutorasFiltradas(construtoras)
    } else {
      const termoBusca = busca.toLowerCase()
      const filtradas = construtoras.filter(construtora => 
        construtora.nome.toLowerCase().includes(termoBusca) || 
        construtora.email.toLowerCase().includes(termoBusca) ||
        construtora.endereco.toLowerCase().includes(termoBusca)
      )
      setConstrutorasFiltradas(filtradas)
    }
  }, [busca, construtoras])
  
  return (
    <DashboardLayout userRole="cliente" userName="Cliente">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Construtoras</h1>
            <p className="text-muted-foreground">
              Visualize as construtoras responsáveis pelos seus imóveis
            </p>
          </div>
        </div>
        
        {/* Filtros e busca */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou endereço..."
              className="pl-9"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>
        
        {/* Lista de construtoras */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[250px] rounded-xl" />
            ))}
          </div>
        ) : construtorasFiltradas.length === 0 ? (
          <EmptyStateConstrutoras />
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.05 }
              },
              hidden: {}
            }}
          >
            {construtorasFiltradas.map(construtora => (
              <ConstrutoraCard 
                key={construtora.id} 
                construtora={construtora}
              />
            ))}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}
