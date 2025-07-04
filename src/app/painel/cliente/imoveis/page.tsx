"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Building, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  RefreshCcw,
  Heart,
  HeartOff,
  Eye,
  MapPin
} from "lucide-react"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

// Interface para os imóveis
interface Imovel {
  id: string
  titulo: string
  descricao: string
  preco: number
  area: number
  quartos: number
  banheiros: number
  vagas: number
  endereco: string
  bairro?: string
  cidade?: string
  estado?: string
  fotoPrincipal?: string
  galeriaFotos?: string[]
  construtora?: {
    id: string
    nome: string
    telefone: string
  }
  tipoImovel?: string
  matchPercentage?: number
  favorito?: boolean
}

// Componente para exibir quando não há imóveis
function EmptyStateImoveis({ onResetFiltros }: { onResetFiltros: () => void }) {
  return (
    <div className="text-center py-16 bg-muted/30 rounded-xl">
      <Info className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
      <h3 className="text-xl font-medium">Nenhum imóvel encontrado</h3>
      <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">
        Não encontramos imóveis salvos na sua conta. Faça uma simulação para encontrar imóveis ideais para você.
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

// Card de imóvel
function ImovelCard({ imovel, onToggleFavorito }: { imovel: Imovel, onToggleFavorito: (id: string) => void }) {
  const router = useRouter()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden h-full flex flex-col border-0 shadow-md hover:shadow-lg transition-all duration-200">
        {/* Imagem do imóvel com overlay de preço */}
        <div className="relative h-48 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ 
              backgroundImage: `url(${imovel.fotoPrincipal || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop'})` 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Badge de match */}
          {imovel.matchPercentage && (
            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm py-1 px-2 rounded-full shadow-sm">
              <p className="text-primary text-xs font-semibold">
                {imovel.matchPercentage}% match
              </p>
            </div>
          )}
          
          {/* Preço */}
          <div className="absolute bottom-2 left-2">
            <p className="text-white font-bold">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(imovel.preco)}
            </p>
          </div>
          
          {/* Botão de favorito */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white text-primary hover:text-primary h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorito(imovel.id)
            }}
          >
            {imovel.favorito ? (
              <Heart className="h-4 w-4 fill-primary" />
            ) : (
              <HeartOff className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg line-clamp-1">{imovel.titulo}</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span className="line-clamp-1">{imovel.endereco}</span>
          </div>
        </CardHeader>
        
        <CardContent className="px-4 py-2 flex-grow">
          {/* Características */}
          <div className="grid grid-cols-4 gap-2 text-sm mb-3">
            <div className="flex flex-col items-center p-2 bg-muted/30 rounded-md">
              <span className="text-xs text-muted-foreground">Quartos</span>
              <span className="font-medium">{imovel.quartos}</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-muted/30 rounded-md">
              <span className="text-xs text-muted-foreground">Banheiros</span>
              <span className="font-medium">{imovel.banheiros}</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-muted/30 rounded-md">
              <span className="text-xs text-muted-foreground">Área</span>
              <span className="font-medium">{imovel.area}m²</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-muted/30 rounded-md">
              <span className="text-xs text-muted-foreground">Vagas</span>
              <span className="font-medium">{imovel.vagas}</span>
            </div>
          </div>
          
          {/* Construtora */}
          {imovel.construtora && (
            <div className="mt-2">
              <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
                <Building className="h-3 w-3" />
                {imovel.construtora.nome}
              </Badge>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-4 pt-2 flex gap-2">
          <Button 
            variant="default" 
            className="w-full"
            onClick={() => router.push(`/imovel/${imovel.id}`)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver detalhes
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default function ImoveisClientePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [imoveis, setImoveis] = useState<Imovel[]>([])
  const [imoveisRecomendados, setImoveisRecomendados] = useState<Imovel[]>([])
  const [busca, setBusca] = useState("")
  const [pagina, setPagina] = useState(1)
  const [activeTab, setActiveTab] = useState("recomendados")
  const itensPorPagina = 8
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [imoveisPaginados, setImoveisPaginados] = useState<Imovel[]>([])
  const [imoveisFiltrados, setImoveisFiltrados] = useState<Imovel[]>([])
  
  // Dados do usuário - em produção viria da sessão ou contexto de autenticação
  const [nomeUsuario, setNomeUsuario] = useState("Usuário")  
  
  // Recuperar nome do usuário do localStorage (simulando autenticação)
  useEffect(() => {
    try {
      const dadosUsuario = localStorage.getItem('imovia-usuario')
      if (dadosUsuario) {
        const usuario = JSON.parse(dadosUsuario)
        if (usuario?.nome) {
          setNomeUsuario(usuario.nome)
        }
      }
    } catch (e) {
      console.error('Erro ao recuperar dados do usuário:', e)
    }
  }, [])
  
  // Carregar dados dos imóveis
  useEffect(() => {
    carregarImoveis()
  }, [])

  // Filtrar imóveis quando a busca mudar
  useEffect(() => {
    if (busca.trim() === "") {
      setImoveisFiltrados(imoveis)
    } else {
      const termoBusca = busca.toLowerCase().trim()
      const filtrados = imoveis.filter((imovel: Imovel) => 
        imovel.titulo.toLowerCase().includes(termoBusca) || 
        imovel.endereco.toLowerCase().includes(termoBusca) ||
        (imovel.bairro?.toLowerCase().includes(termoBusca) ?? false) ||
        (imovel.cidade?.toLowerCase().includes(termoBusca) ?? false)
      )
      setImoveisFiltrados(filtrados)
    }
    setPagina(1)
  }, [busca, imoveis])
  
  // Atualizar imóveis paginados quando a página ou filtros mudarem
  useEffect(() => {
    const inicio = (pagina - 1) * itensPorPagina
    const fim = inicio + itensPorPagina
    setImoveisPaginados(imoveisFiltrados.slice(inicio, fim))
    setTotalPaginas(Math.ceil(imoveisFiltrados.length / itensPorPagina))
  }, [pagina, imoveisFiltrados, itensPorPagina])
  
  const carregarImoveis = async () => {
    setLoading(true)
    try {
      // Carregar imóveis recomendados do localStorage
      let imoveisRecomendadosLocalStorage: Imovel[] = [];
      try {
        const savedImoveis = localStorage.getItem('imovia-imoveis-recomendados');
        if (savedImoveis) {
          const parsedImoveis = JSON.parse(savedImoveis);
          if (Array.isArray(parsedImoveis) && parsedImoveis.length > 0) {
            imoveisRecomendadosLocalStorage = parsedImoveis.map(imovel => ({
              ...imovel,
              matchPercentage: 90 + (Math.floor(Math.random() * 10)), // Mostrar match alto para recomendados
              favorito: false
            }));
            console.log('✅ Imóveis recomendados carregados do localStorage:', imoveisRecomendadosLocalStorage.length);
          }
        }
      } catch (storageError) {
        console.error('Erro ao carregar imóveis recomendados do localStorage:', storageError);
      }
      
      // Salvar imóveis recomendados no state
      setImoveisRecomendados(imoveisRecomendadosLocalStorage);
      
      // TODO: Integrar com a API real
      // Simulando dados mockados para desenvolvimento
      const mockImoveis = [...Array(12)].map((_, i) => ({
          id: `imovel-${i}`,
          titulo: `Apartamento ${i + 1} - Luxo e Conforto`,
          descricao: `Lindo apartamento com ${3 + (i % 2)} quartos em localização privilegiada.`,
          preco: 350000 + (i * 50000),
          area: 80 + (i * 10),
          quartos: 3 + (i % 2),
          banheiros: 2 + (i % 2),
          vagas: 1 + (i % 2),
          endereco: `Rua das Flores, ${100 + i}`,
          bairro: i % 2 === 0 ? "Centro" : "Jardim Europa",
          cidade: "São Paulo",
          estado: "SP",
          tipoImovel: i % 3 === 0 ? "Apartamento" : "Casa",
          matchPercentage: 70 + (i % 30),
          favorito: i % 5 === 0
        }))
        
        setImoveis(mockImoveis)
        setImoveisFiltrados(mockImoveis)
      } catch (error) {
        console.error("Erro ao carregar imóveis:", error)
        toast({
          title: "Erro ao carregar",
          description: "Não foi possível carregar os imóveis.",
          variant: "destructive"
        })
        setImoveis([])
        setImoveisFiltrados([])
      } finally {
        setLoading(false)
      }
    }
    
  // Filtrar imóveis quando a busca mudar
  useEffect(() => {
    if (busca.trim() === "") {
      setImoveisFiltrados(imoveis)
    } else {
      const termoBusca = busca.toLowerCase().trim()
      const filtrados = imoveis.filter(imovel => 
        imovel.titulo.toLowerCase().includes(termoBusca) || 
        imovel.endereco.toLowerCase().includes(termoBusca) ||
        (imovel.bairro?.toLowerCase().includes(termoBusca) ?? false) ||
        (imovel.cidade?.toLowerCase().includes(termoBusca) ?? false)
      )
      setImoveisFiltrados(filtrados)
    }
    setPagina(1)
  }, [busca, imoveis])
  
  // Atualizar imóveis paginados quando a página ou filtros mudarem
  useEffect(() => {
    const inicio = (pagina - 1) * itensPorPagina
    const fim = inicio + itensPorPagina
    setImoveisPaginados(imoveisFiltrados.slice(inicio, fim))
    setTotalPaginas(Math.ceil(imoveisFiltrados.length / itensPorPagina))
  }, [pagina, imoveisFiltrados, itensPorPagina])
  
  // Função para alternar favorito
  const handleToggleFavorito = async (id: string) => {
    try {
      // Atualizar UI imediatamente para feedback rápido
      setImoveis(imoveis.map(imovel => 
        imovel.id === id ? { ...imovel, favorito: !imovel.favorito } : imovel
      ))
      
      // Chamar API para persistir a mudança
      const response = await fetch(`/api/cliente/imoveis/${id}/favorito`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ favorito: !imoveis.find(i => i.id === id)?.favorito })
      })
      
      if (!response.ok) {
        throw new Error('Erro ao atualizar favorito')
      }
      
      toast({
        title: "Favorito atualizado",
        description: "Seu imóvel foi atualizado com sucesso.",
        variant: "default"
      })
    } catch (error) {
      console.error('Erro ao alternar favorito:', error)
      
      // Reverter mudança em caso de erro
      setImoveis(imoveis.map(imovel => 
        imovel.id === id ? { ...imovel, favorito: !imovel.favorito } : imovel
      ))
      
      toast({
        title: "Erro ao atualizar favorito",
        description: "Não foi possível atualizar o status de favorito. Tente novamente.",
        variant: "destructive"
      })
    }
  }
  
  // Resetar filtros
  const resetFiltros = () => {
    setBusca("")
  }
  
  return (
    <DashboardLayout userRole="cliente" userName={nomeUsuario}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meus Imóveis</h1>
            <p className="text-muted-foreground">
              Visualize e gerencie os imóveis que combinam com seu perfil
            </p>
          </div>
          
          <Button 
            onClick={() => router.push('/')}
            className="gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Nova simulação
          </Button>
        </div>
        
        {/* Filtros e busca */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título, endereço ou construtora..."
              className="pl-9"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>
        
        {/* Tabs para tipos de imóveis */}
        <Tabs 
          defaultValue={imoveisRecomendados.length > 0 ? "recomendados" : "todos"} 
          className="space-y-4"
          onValueChange={(value) => {
            setActiveTab(value);
            setPagina(1); // Reset para a primeira página ao trocar de aba
          }}
        >
          <TabsList>
            {imoveisRecomendados.length > 0 && (
              <TabsTrigger value="recomendados" className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                Recomendados ({imoveisRecomendados.length})
              </TabsTrigger>
            )}
            <TabsTrigger value="todos" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Todos os Imóveis
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="recomendados">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-[350px] rounded-xl" />
                ))}
              </div>
            ) : imoveisRecomendados.length === 0 ? (
              <div className="text-center py-16 bg-muted/30 rounded-xl">
                <Info className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-xl font-medium">Nenhum imóvel recomendado</h3>
                <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">
                  Você ainda não tem imóveis recomendados. Faça uma simulação no mapa interativo para receber recomendações personalizadas.
                </p>
                <Button 
                  variant="default" 
                  size="lg"
                  onClick={() => router.push('/')}
                  className="gap-2"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Nova simulação
                </Button>
              </div>
            ) : (
              <>
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: { staggerChildren: 0.05 }
                    },
                    hidden: {}
                  }}
                >
                  {imoveisRecomendados.map(imovel => (
                    <ImovelCard 
                      key={imovel.id} 
                      imovel={imovel}
                      onToggleFavorito={handleToggleFavorito}
                    />
                  ))}
                </motion.div>
                
                <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Recomendação personalizada
                  </h3>
                  <p className="mt-1 text-muted-foreground">
                    Estes imóveis foram recomendados com base na sua última simulação no mapa interativo.
                    Para atualizar estas recomendações, faça uma nova simulação.
                  </p>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="todos">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-[350px] rounded-xl" />
                ))}
              </div>
            ) : imoveis.length === 0 ? (
              <EmptyStateImoveis onResetFiltros={resetFiltros} />
            ) : (
              <>
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
                  {imoveisPaginados.map(imovel => (
                    <ImovelCard 
                      key={imovel.id} 
                      imovel={imovel}
                      onToggleFavorito={handleToggleFavorito}
                    />
                  ))}
                </motion.div>
                
                {/* Controles de paginação */}
                <div className="mt-8 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {Math.min((pagina - 1) * itensPorPagina + 1, imoveisFiltrados.length)} a {Math.min(pagina * itensPorPagina, imoveisFiltrados.length)} de {imoveisFiltrados.length} imóveis
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagina(old => Math.max(old - 1, 1))}
                      disabled={pagina === 1}
                      className="h-8 w-8 p-0"
                    >
                      <span className="sr-only">Página anterior</span>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-sm">
                      Página <span className="font-medium">{pagina}</span> de <span className="font-medium">{totalPaginas}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagina(old => Math.min(old + 1, totalPaginas))}
                      disabled={pagina === totalPaginas}
                      className="h-8 w-8 p-0"
                    >
                      <span className="sr-only">Próxima página</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
