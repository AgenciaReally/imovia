"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  MessageSquare, 
  Search, 
  Filter, 
  RefreshCcw, 
  Info,
  CheckCircle2,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp
} from "lucide-react"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { toast } from "@/components/ui/use-toast"

// Interface para as respostas
interface Resposta {
  id: string
  perguntaId: string
  pergunta: {
    id: string
    texto: string
    tipo: string
    categoria: string
    fluxo: string
  }
  resposta: string
  dataResposta: string
  categoria?: string
}

// Componente para exibir quando não há respostas
function EmptyStateRespostas({ onResetFiltros }: { onResetFiltros: () => void }) {
  return (
    <div className="text-center py-16 bg-muted/30 rounded-xl">
      <Info className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
      <h3 className="text-xl font-medium">Nenhuma resposta encontrada</h3>
      <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">
        Não encontramos respostas salvas na sua conta. Faça uma simulação para registrar suas preferências.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <Button 
          variant="outline" 
          size="lg"
          onClick={onResetFiltros}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Limpar filtros
        </Button>
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
    </div>
  )
}

// Componente para agrupar respostas por categoria
function RespostasPorCategoria({ 
  categoria, 
  respostas,
  expanded,
  onToggleExpand
}: { 
  categoria: string
  respostas: Resposta[]
  expanded: boolean
  onToggleExpand: () => void
}) {
  // Função para formatar a categoria
  const formatarCategoria = (categoria: string) => {
    const categorias: Record<string, string> = {
      'CADASTRO': 'Informações Pessoais',
      'AVALIACAO_CREDITO': 'Avaliação de Crédito',
      'INFORMACOES_COMPLEMENTARES': 'Informações Complementares',
      'PREFERENCIAS': 'Preferências',
      'IMOVEL_IDEAL': 'Imóvel Ideal',
      'EMPREENDIMENTO': 'Empreendimento',
      'PROXIMIDADES': 'Proximidades'
    }
    
    return categorias[categoria] || categoria
  }
  
  // Função para formatar a data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(data)
  }
  
  // Ícone para cada categoria
  const iconeCategoria = (categoria: string) => {
    const icones: Record<string, JSX.Element> = {
      'CADASTRO': <MessageSquare className="h-5 w-5" />,
      'AVALIACAO_CREDITO': <CheckCircle2 className="h-5 w-5" />,
      'INFORMACOES_COMPLEMENTARES': <Info className="h-5 w-5" />,
      'PREFERENCIAS': <CheckCircle2 className="h-5 w-5" />,
      'IMOVEL_IDEAL': <CheckCircle2 className="h-5 w-5" />,
      'EMPREENDIMENTO': <CheckCircle2 className="h-5 w-5" />,
      'PROXIMIDADES': <CheckCircle2 className="h-5 w-5" />
    }
    
    return icones[categoria] || <MessageSquare className="h-5 w-5" />
  }
  
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2 cursor-pointer" onClick={onToggleExpand}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              {iconeCategoria(categoria)}
            </div>
            <CardTitle className="text-lg">
              {formatarCategoria(categoria)}
            </CardTitle>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      
      {expanded && (
        <CardContent className="pt-4">
          <div className="space-y-4">
            {respostas.map((resposta) => (
              <div 
                key={resposta.id} 
                className="p-4 rounded-lg bg-muted/30 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm">{resposta.pergunta.texto}</h4>
                  <Badge variant="outline" className="text-xs">
                    {resposta.pergunta.tipo}
                  </Badge>
                </div>
                
                <div className="bg-background p-3 rounded-md">
                  <p className="text-sm">{resposta.resposta}</p>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{formatarData(resposta.dataResposta)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export default function RespostasClientePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [respostas, setRespostas] = useState<Resposta[]>([])
  const [respostasFiltradas, setRespostasFiltradas] = useState<Resposta[]>([])
  const [busca, setBusca] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todas")
  const [categorias, setCategorias] = useState<string[]>([])
  const [categoriasExpandidas, setCategoriasExpandidas] = useState<Record<string, boolean>>({})
  
  // Carregar dados das respostas
  useEffect(() => {
    const carregarRespostas = async () => {
      setLoading(true)
      try {
        // Buscar respostas do cliente na API
        const response = await fetch('/api/cliente/respostas')
        
        if (!response.ok) {
          throw new Error('Erro ao buscar respostas')
        }
        
        const data = await response.json()
        
        // Adicionar categoria às respostas para facilitar o agrupamento
        const respostasComCategoria = data.map((resposta: Resposta) => ({
          ...resposta,
          categoria: resposta.pergunta.categoria
        }))
        
        setRespostas(respostasComCategoria)
        setRespostasFiltradas(respostasComCategoria)
        
        // Extrair categorias únicas
        const categoriasUnicas = Array.from(
          new Set(respostasComCategoria.map((r: Resposta) => r.categoria))
        ) as string[]
        
        setCategorias(categoriasUnicas)
        
        // Inicializar todas as categorias como expandidas
        const estadoInicial = categoriasUnicas.reduce((acc, categoria) => {
          acc[categoria] = true
          return acc
        }, {} as Record<string, boolean>)
        
        setCategoriasExpandidas(estadoInicial)
      } catch (error) {
        console.error('Erro ao carregar respostas:', error)
        toast({
          title: "Erro ao carregar respostas",
          description: "Não foi possível carregar suas respostas. Tente novamente mais tarde.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    
    carregarRespostas()
  }, [])
  
  // Filtrar respostas quando a busca ou categoria mudar
  useEffect(() => {
    let filtradas = [...respostas]
    
    // Filtrar por categoria
    if (filtroCategoria !== "todas") {
      filtradas = filtradas.filter(resposta => resposta.categoria === filtroCategoria)
    }
    
    // Filtrar por termo de busca
    if (busca.trim() !== "") {
      const termoBusca = busca.toLowerCase()
      filtradas = filtradas.filter(resposta => 
        resposta.pergunta.texto.toLowerCase().includes(termoBusca) || 
        resposta.resposta.toLowerCase().includes(termoBusca)
      )
    }
    
    setRespostasFiltradas(filtradas)
  }, [busca, filtroCategoria, respostas])
  
  // Agrupar respostas por categoria
  const respostasPorCategoria = categorias.reduce((acc, categoria) => {
    const respostasDaCategoria = respostasFiltradas.filter(r => r.categoria === categoria)
    if (respostasDaCategoria.length > 0) {
      acc[categoria] = respostasDaCategoria
    }
    return acc
  }, {} as Record<string, Resposta[]>)
  
  // Alternar expansão de categoria
  const toggleCategoria = (categoria: string) => {
    setCategoriasExpandidas(prev => ({
      ...prev,
      [categoria]: !prev[categoria]
    }))
  }
  
  // Expandir todas as categorias
  const expandirTodas = () => {
    const todasExpandidas = Object.keys(categoriasExpandidas).reduce((acc, cat) => {
      acc[cat] = true
      return acc
    }, {} as Record<string, boolean>)
    
    setCategoriasExpandidas(todasExpandidas)
  }
  
  // Recolher todas as categorias
  const recolherTodas = () => {
    const todasRecolhidas = Object.keys(categoriasExpandidas).reduce((acc, cat) => {
      acc[cat] = false
      return acc
    }, {} as Record<string, boolean>)
    
    setCategoriasExpandidas(todasRecolhidas)
  }
  
  // Resetar filtros
  const resetFiltros = () => {
    setBusca("")
    setFiltroCategoria("todas")
  }
  
  return (
    <DashboardLayout userRole="cliente" userName="Cliente">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Minhas Respostas</h1>
            <p className="text-muted-foreground">
              Visualize todas as respostas que você já deu no fluxo de simulação
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={expandirTodas}
            >
              Expandir todas
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={recolherTodas}
            >
              Recolher todas
            </Button>
          </div>
        </div>
        
        {/* Filtros e busca */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar em perguntas e respostas..."
              className="pl-9"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          
          <Select 
            value={filtroCategoria} 
            onValueChange={setFiltroCategoria}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as categorias</SelectItem>
              {categorias.map(categoria => (
                <SelectItem key={categoria} value={categoria}>
                  {categoria.replace('_', ' ').toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Lista de respostas */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[200px] rounded-xl" />
            ))}
          </div>
        ) : respostasFiltradas.length === 0 ? (
          <EmptyStateRespostas onResetFiltros={resetFiltros} />
        ) : (
          <motion.div 
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.05 }
              },
              hidden: {}
            }}
          >
            {Object.entries(respostasPorCategoria).map(([categoria, respostas]) => (
              <RespostasPorCategoria 
                key={categoria}
                categoria={categoria}
                respostas={respostas}
                expanded={categoriasExpandidas[categoria] || false}
                onToggleExpand={() => toggleCategoria(categoria)}
              />
            ))}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}
