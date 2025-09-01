"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from 'framer-motion'
import { Info, Filter, Table as TableIcon, Grid, ChevronLeft, ChevronRight } from 'lucide-react'

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImovelCard } from "@/components/dashboard/imovel/imovel-card"
import { ImoveisFiltros } from "@/components/dashboard/imovel/imovel-filtros"
import { Skeleton } from "@/components/ui/skeleton"
import { ImovelDisplay } from '@/services/imovel-service'
import { ImovelTable } from '@/components/dashboard/imovel/imovel-table'

// Componente para exibir o banner quando não há imóveis ou quando os filtros não retornam resultados
function EmptyStateImoveis({ onResetFiltros, semImoveis = false }: { onResetFiltros: () => void, semImoveis?: boolean }) {
  if (semImoveis) {
    // Mensagem para quando não há imóveis vinculados à construtora
    return (
      <div className="text-center py-16 bg-muted/30 rounded-xl">
        <Info className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-xl font-medium">Nenhum imóvel vinculado</h3>
        <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">
          Sua construtora ainda não possui imóveis vinculados. O administrador do sistema pode vincular 
          imóveis da API Orulo à sua construtora através do painel administrativo.
        </p>
      </div>
    )
  }
  
  // Mensagem para quando há imóveis mas os filtros não retornam resultados
  return (
    <div className="text-center py-16 bg-muted/30 rounded-xl">
      <Info className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
      <h3 className="text-xl font-medium">Nenhum imóvel encontrado</h3>
      <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">
        Não encontramos imóveis com os filtros aplicados. Tente remover alguns filtros para visualizar mais imóveis.
      </p>
      <Button 
        variant="outline" 
        size="lg"
        onClick={onResetFiltros}
        className="gap-2"
      >
        <Filter className="h-4 w-4" />
        Limpar todos os filtros
      </Button>
    </div>
  )
}

// Componente da página principal
export default function ConstrutorImoveisPage() {
  const [loading, setLoading] = useState(true)
  const [imoveis, setImoveis] = useState<ImovelDisplay[]>([])
  const [imoveisFiltrados, setImoveisFiltrados] = useState<ImovelDisplay[]>([])
  const [caracteristicasDisponiveis, setCaracteristicasDisponiveis] = useState<string[]>([])
  const [precoMaximo, setPrecoMaximo] = useState(5000000)
  const [areaMaxima, setAreaMaxima] = useState(500)
  
  // Paginação
  const [pagina, setPagina] = useState(1)
  const [itensPorPagina, setItensPorPagina] = useState(12) // Menos itens por página que o admin
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [imoveisPaginados, setImoveisPaginados] = useState<ImovelDisplay[]>([])
  
  // Estado para os filtros
  const [filtros, setFiltros] = useState({
    busca: '',
    ordenacao: {
      campo: 'preco' as 'preco' | 'area' | 'quartos' | 'dataAtualizacao',
      direcao: 'asc' as 'asc' | 'desc'
    },
    precoRange: [0, 5000000] as [number, number],
    areaRange: [0, 500] as [number, number],
    quartos: [] as number[],
    banheiros: [] as number[],
    vagas: [] as number[],
    status: [] as string[],
    caracteristicas: [] as string[]
  })
  
  // Resetar filtros
  const resetFiltros = useCallback(() => {
    setFiltros({
      busca: '',
      ordenacao: {
        campo: 'preco',
        direcao: 'asc'
      },
      precoRange: [0, precoMaximo],
      areaRange: [0, areaMaxima],
      quartos: [],
      banheiros: [],
      vagas: [],
      status: [],
      caracteristicas: []
    })
  }, [precoMaximo, areaMaxima])
  
  // Busca de imóveis vinculados à construtora logada
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Buscar imóveis da construtora logada
        const response = await fetch('/api/construtora/imoveis')
        const data = await response.json()
        
        if (data.success && data.imoveis) {
          const imoveisConstrutora = data.imoveis
          
          // Coletando todas as características disponíveis
          const todasCaracteristicas = new Set<string>()
          imoveisConstrutora.forEach((imovel: ImovelDisplay) => {
            if (imovel.caracteristicas && Array.isArray(imovel.caracteristicas)) {
              imovel.caracteristicas.forEach((c: string) => todasCaracteristicas.add(c))
            }
          })
          
          // Encontrando valores máximos para os sliders
          const maxPreco = Math.max(...imoveisConstrutora.map((i: ImovelDisplay) => i.preco), 5000000)
          const maxArea = Math.max(...imoveisConstrutora.map((i: ImovelDisplay) => i.area), 500)
          
          setImoveis(imoveisConstrutora)
          setImoveisFiltrados(imoveisConstrutora)
          setCaracteristicasDisponiveis(Array.from(todasCaracteristicas))
          setPrecoMaximo(maxPreco)
          setAreaMaxima(maxArea)
          setFiltros(prev => ({
            ...prev,
            precoRange: [0, maxPreco],
            areaRange: [0, maxArea]
          }))
        }
      } catch (error) {
        console.error('Erro ao buscar imóveis da construtora:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])
  
  // Aplicando filtros aos imóveis
  useEffect(() => {
    if (!imoveis.length) return
    
    let filtered = [...imoveis]
    
    // Filtro de busca
    if (filtros.busca) {
      const termo = filtros.busca.toLowerCase()
      filtered = filtered.filter(imovel => 
        imovel.titulo.toLowerCase().includes(termo) ||
        imovel.descricao?.toLowerCase().includes(termo) ||
        imovel.endereco.toLowerCase().includes(termo) ||
        imovel.bairro.toLowerCase().includes(termo) ||
        imovel.cidade.toLowerCase().includes(termo)
      )
    }
    
    // Filtro de preço
    filtered = filtered.filter(imovel => 
      imovel.preco >= filtros.precoRange[0] && imovel.preco <= filtros.precoRange[1]
    )
    
    // Filtro de área
    filtered = filtered.filter(imovel => 
      imovel.area >= filtros.areaRange[0] && imovel.area <= filtros.areaRange[1]
    )
    
    // Filtro de quartos
    if (filtros.quartos.length > 0) {
      filtered = filtered.filter(imovel => {
        // Se selecionou "6+", inclui imóveis com 6 ou mais quartos
        if (filtros.quartos.includes(6) && imovel.quartos >= 6) {
          return true
        }
        return filtros.quartos.includes(imovel.quartos)
      })
    }
    
    // Filtro de banheiros
    if (filtros.banheiros.length > 0) {
      filtered = filtered.filter(imovel => {
        // Se selecionou "5+", inclui imóveis com 5 ou mais banheiros
        if (filtros.banheiros.includes(5) && imovel.banheiros >= 5) {
          return true
        }
        return filtros.banheiros.includes(imovel.banheiros)
      })
    }
    
    // Filtro de vagas
    if (filtros.vagas.length > 0) {
      filtered = filtered.filter(imovel => {
        // Se selecionou "4+", inclui imóveis com 4 ou mais vagas
        if (filtros.vagas.includes(4) && imovel.vagas >= 4) {
          return true
        }
        return filtros.vagas.includes(imovel.vagas)
      })
    }
    
    // Filtro de status
    if (filtros.status.length > 0) {
      filtered = filtered.filter(imovel => 
        filtros.status.includes(imovel.status || 'Disponível')
      )
    }
    
    // Filtro de características
    if (filtros.caracteristicas.length > 0) {
      filtered = filtered.filter(imovel => 
        filtros.caracteristicas.every(c => 
          imovel.caracteristicas && Array.isArray(imovel.caracteristicas) && 
          imovel.caracteristicas.includes(c)
        )
      )
    }
    
    // Ordenação
    filtered.sort((a, b) => {
      // Ordenando por campo
      switch (filtros.ordenacao.campo) {
        case 'preco':
          return filtros.ordenacao.direcao === 'asc'
            ? a.preco - b.preco
            : b.preco - a.preco
        case 'area':
          return filtros.ordenacao.direcao === 'asc'
            ? a.area - b.area
            : b.area - a.area
        case 'quartos':
          return filtros.ordenacao.direcao === 'asc'
            ? a.quartos - b.quartos
            : b.quartos - a.quartos
        case 'dataAtualizacao':
          if (!a.dataAtualizacao || !b.dataAtualizacao) return 0
          try {
            // Para datas, precisamos converter para timestamp
            const dateA = new Date(a.dataAtualizacao.split('/').reverse().join('-')).getTime()
            const dateB = new Date(b.dataAtualizacao.split('/').reverse().join('-')).getTime()
            return filtros.ordenacao.direcao === 'asc'
              ? dateA - dateB
              : dateB - dateA
          } catch (e) {
            return 0
          }
        default:
          return 0
      }
    })
    
    setImoveisFiltrados(filtered)
  }, [imoveis, filtros])
  
  // Aplicar paginação aos imóveis filtrados
  useEffect(() => {
    if (!imoveisFiltrados.length) {
      setImoveisPaginados([])
      setTotalPaginas(1)
      return
    }
    
    // Calcular o total de páginas
    const total = Math.ceil(imoveisFiltrados.length / itensPorPagina)
    setTotalPaginas(total)
    
    // Se a página atual exceder o total, ajustar para a última página
    if (pagina > total) {
      setPagina(total)
    }
    
    // Calcular o índice inicial e final
    const inicio = (pagina - 1) * itensPorPagina
    const fim = Math.min(inicio + itensPorPagina, imoveisFiltrados.length)
    
    // Obter os imóveis da página atual
    const paginados = imoveisFiltrados.slice(inicio, fim)
    setImoveisPaginados(paginados)
  }, [imoveisFiltrados, pagina, itensPorPagina])
  
  // Esqueletos de carregamento
  const skeletonArray = Array(itensPorPagina).fill(null)
  
  return (
    <DashboardLayout userRole="construtora">
      <div className="space-y-6 py-2 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-1.5"
          >
            <h1 className="text-3xl font-bold tracking-tight">Meus Imóveis</h1>
            <p className="text-muted-foreground text-lg">
              Gerencie os imóveis vinculados à sua construtora
            </p>
          </motion.div>
        </div>
        
        {/* Banner de informações */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl text-white p-6 shadow-lg"
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-lg">
              <h3 className="text-2xl font-bold">Painel da Construtora</h3>
              <p className="text-blue-100">
                Aqui você visualiza todos os imóveis vinculados à sua construtora. 
                Estes imóveis são sincronizados com a API Orulo e cadastrados pelo administrador do sistema.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-blue-100 text-sm mb-1">Total de imóveis</p>
                <h4 className="text-3xl font-bold">{loading ? <Skeleton className="h-9 w-16 bg-white/20" /> : imoveis.length}</h4>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-blue-100 text-sm mb-1">Imóveis filtrados</p>
                <h4 className="text-3xl font-bold">
                  {loading ? 
                    <Skeleton className="h-9 w-16 bg-white/20" /> : 
                    imoveisFiltrados.length
                  }
                </h4>
              </div>
            </div>
          </div>
          
          {/* Círculos decorativos */}
          <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute top-6 right-32 w-16 h-16 rounded-full bg-white/5" />
          <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-white/5" />
        </motion.div>
        
        {/* Filtros */}
        <ImoveisFiltros 
          filtros={filtros}
          setFiltros={setFiltros}
          totalImoveis={imoveis.length}
          totalImoveisFiltrados={imoveisFiltrados.length}
          caracteristicasDisponiveis={caracteristicasDisponiveis}
          precoMaximo={precoMaximo}
          areaMaxima={areaMaxima}
          onResetFiltros={resetFiltros}
        />
        
        {/* Abas de visualização */}
        <Tabs defaultValue="grid" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList className="grid grid-cols-2 w-[200px]">
              <TabsTrigger value="grid">
                <Grid className="h-4 w-4 mr-2" />
                Grade
              </TabsTrigger>
              <TabsTrigger value="table">
                <TableIcon className="h-4 w-4 mr-2" />
                Tabela
              </TabsTrigger>
            </TabsList>
            
            <div className="text-sm text-muted-foreground">
              Mostrando {imoveisPaginados.length} de {imoveisFiltrados.length} imóveis
            </div>
          </div>
          
          {/* Visualização em grade */}
          <TabsContent value="grid" className="space-y-4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {skeletonArray.map((_, index) => (
                  <Skeleton key={index} className="h-80 w-full rounded-xl" />
                ))}
              </div>
            ) : imoveis.length === 0 ? (
              <EmptyStateImoveis onResetFiltros={resetFiltros} semImoveis={true} />
            ) : imoveisFiltrados.length === 0 ? (
              <EmptyStateImoveis onResetFiltros={resetFiltros} />
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
                  {imoveisPaginados.map(imovel => (
                    <ImovelCard key={imovel.id} imovel={imovel} />
                  ))}
                </motion.div>
                
                {/* Controles de paginação */}
                {totalPaginas > 1 && (
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
                )}
              </>
            )}
            
          </TabsContent>
          
          {/* Visualização em tabela */}
          <TabsContent value="table" className="space-y-4">
            {loading ? (
              <Skeleton className="h-[500px] w-full rounded-xl" />
            ) : imoveis.length === 0 ? (
              <EmptyStateImoveis onResetFiltros={resetFiltros} semImoveis={true} />
            ) : imoveisFiltrados.length === 0 ? (
              <EmptyStateImoveis onResetFiltros={resetFiltros} />
            ) : (
              <ImovelTable imoveis={imoveisFiltrados} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
