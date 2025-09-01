"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion } from 'framer-motion'
import { Plus, Info, Filter, CheckCircle2, Table as TableIcon, Grid, ChevronLeft, ChevronRight, RefreshCcw } from 'lucide-react';
import Image from "next/image"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImovelCard } from "@/components/dashboard/imovel/imovel-card"
import { ImoveisFiltros } from "@/components/dashboard/imovel/imovel-filtros"
import { Skeleton } from "@/components/ui/skeleton"
import { ImovelDisplay, buscarImoveisOrulo, OruloBuilding } from '@/services/imovel-service'
import { ImovelTable } from '@/components/dashboard/imovel/imovel-table'
import { ImovelFormModal } from '@/components/dashboard/imovel/imovel-form-modal';
import { ImovelSyncButton } from '@/components/dashboard/imovel/imovel-sync-button';
import { toast } from "@/components/ui/use-toast"
import { Trash2, AlertTriangle } from "lucide-react"

// Componente para exibir o banner quando não há filtros ativos
function EmptyStateImoveis({ onResetFiltros }: { onResetFiltros: () => void }) {
  return (
    <div className="text-center py-16 bg-muted/30 rounded-xl">
      <Info className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
      <h3 className="text-xl font-medium">Nenhum imóvel encontrado</h3>
      <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">
        Não encontramos imóveis com os filtros aplicados. Tente remover alguns filtros ou recarregar os imóveis.
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
          onClick={() => window.location.reload()}
          className="gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Recarregar imóveis
        </Button>
      </div>
    </div>
  )
}

// Componente da página principal
export default function ImoveisPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [imoveis, setImoveis] = useState<ImovelDisplay[]>([])
  const [imoveisFiltrados, setImoveisFiltrados] = useState<ImovelDisplay[]>([])
  const [caracteristicasDisponiveis, setCaracteristicasDisponiveis] = useState<string[]>([])
  const [precoMaximo, setPrecoMaximo] = useState(5000000)
  const [areaMaxima, setAreaMaxima] = useState(500)
  
  // Paginação
  const [pagina, setPagina] = useState(1)
  const [itensPorPagina, setItensPorPagina] = useState(8)
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
  
  // Função para atualizar a lista após adicionar um novo imóvel
  const handleNovoImovel = async () => {
    await loadData(true);
  }
  
  // Função para excluir um imóvel
  const handleDeleteImovel = async (id: string) => {
    try {
      const response = await fetch(`/api/imoveis/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao excluir imóvel: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Imóvel excluído",
          description: "O imóvel foi excluído com sucesso.",
        });
        // Recarregar dados
        await loadData(true);
      } else {
        throw new Error(data.error || 'Erro ao excluir imóvel');
      }
    } catch (error: any) {
      console.error('Erro ao excluir imóvel:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir imóvel",
        description: error instanceof Error ? error.message : "Não foi possível excluir o imóvel."
      });
    }
  }

  // Função para alternar o status do imóvel (ativo/inativo)
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/imoveis/${id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ativo: !currentStatus }),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao alterar status do imóvel: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: `Imóvel ${!currentStatus ? 'ativado' : 'desativado'}`,
          description: `O imóvel foi ${!currentStatus ? 'ativado' : 'desativado'} com sucesso.`,
        });
        // Recarregar dados
        await loadData(true);
      } else {
        throw new Error(data.error || 'Erro ao alterar status do imóvel');
      }
    } catch (error: any) {
      console.error('Erro ao alterar status do imóvel:', error);
      toast({
        variant: "destructive",
        title: "Erro ao alterar status",
        description: error instanceof Error ? error.message : "Não foi possível alterar o status do imóvel."
      });
    }
  }
  
  // Função principal para carregar dados da API
  const loadData = async (forceReload = false) => {
    // Evitar chamadas desnecessárias
    if (loading && !forceReload) return;
    
    // Iniciar loading
    setLoading(true);
    
    try {
      // Buscar imóveis da API local (Prisma)
      const response = await fetch('/api/imoveis', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar imóveis: ${response.status}`);
      }
      
      const imoveisResponse = await response.json();
      
      // Garantir que temos resultados válidos
      const allProperties = Array.isArray(imoveisResponse) ? imoveisResponse : [];
      console.log(`Encontrados ${allProperties.length} imóveis no banco de dados`);
      
      // Extrair características únicas
      const todasCaracteristicas = new Set<string>();
      allProperties.forEach((imovel: ImovelDisplay) => {
        if (Array.isArray(imovel.caracteristicas)) {
          imovel.caracteristicas.forEach((c: string) => {
            if (typeof c === 'string') {
              todasCaracteristicas.add(c);
            }
          });
        }
      });
      

      
      // Calcular valores máximos para filtros
      const maxPreco = Math.max(...allProperties.map((i: ImovelDisplay) => i.preco || 0), 5000000);
      const maxArea = Math.max(...allProperties.map((i: ImovelDisplay) => i.area || 0), 500);
      
      // Atualizar estado
      setTotal(allProperties.length);
      setImoveis(allProperties);
      setImoveisFiltrados(allProperties);
      setCaracteristicasDisponiveis(Array.from(todasCaracteristicas));
      setPrecoMaximo(maxPreco);
      setAreaMaxima(maxArea);
      setFiltros(prev => ({
        ...prev,
        precoRange: [0, maxPreco],
        areaRange: [0, maxArea]
      }));
      
      // Notificar usuário
      toast({
        title: `${allProperties.length} imóveis encontrados`,
        description: "Lista de imóveis atualizada com sucesso.",
      });
    } catch (error) {
      // Tratar erro
      console.error('Erro ao buscar imóveis:', error);
      toast({
        title: "Erro ao carregar imóveis",
        description: "Não foi possível carregar os imóveis do banco de dados. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      // Sempre finalizar loading
      setLoading(false);
    }
  };
  
  // Função pública para recarregar imóveis
  const fetchImoveis = useCallback(async () => {
    await loadData(true);
  }, []);
  
  // Inicialização
  useEffect(() => {
    loadData();
  }, []);
  
  // Aplicando filtros aos imóveis
  useEffect(() => {
    if (!imoveis.length) return
    
    let filtered = [...imoveis]
    
    // Filtro de busca
    if (filtros.busca) {
      const termo = filtros.busca.toLowerCase()
      filtered = filtered.filter(imovel => 
        imovel.titulo.toLowerCase().includes(termo) ||
        imovel.descricao.toLowerCase().includes(termo) ||
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
        filtros.status.includes(imovel.status)
      )
    }
    
    // Filtro de características
    if (filtros.caracteristicas.length > 0) {
      filtered = filtered.filter(imovel => 
        filtros.caracteristicas.every(c => imovel.caracteristicas.includes(c))
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
          // Para datas, precisamos converter para timestamp
          const dateA = new Date(a.dataAtualizacao.split('/').reverse().join('-')).getTime()
          const dateB = new Date(b.dataAtualizacao.split('/').reverse().join('-')).getTime()
          return filtros.ordenacao.direcao === 'asc'
            ? dateA - dateB
            : dateB - dateA
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
  const skeletonArray = Array(12).fill(null)
  
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6 py-2 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-1.5"
          >
            <h1 className="text-3xl font-bold tracking-tight">Imóveis</h1>
            <p className="text-muted-foreground text-lg">
              Gerencie os imóveis da plataforma e integre com a API do Prisma
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex gap-3"
          >
              <div className="space-x-2 flex items-center">                
                <Button onClick={() => fetchImoveis()} size="default" className="gap-2">
                  <RefreshCcw className="h-4 w-4" /> Atualizar Imóveis
                </Button>
                <ImovelFormModal onSuccess={handleNovoImovel} />
              </div>
          </motion.div>
        </div>
        
    
        
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
            <TabsList className="grid grid-cols-3 w-[300px]">
              <TabsTrigger value="grid">
                <Grid className="h-4 w-4 mr-2" />
                Grade
              </TabsTrigger>
              <TabsTrigger value="table">
                <TableIcon className="h-4 w-4 mr-2" />
                Tabela
              </TabsTrigger>
              <TabsTrigger value="mapa">Mapa</TabsTrigger>
            </TabsList>
            
            <div className="text-sm text-muted-foreground">
              Mostrando {imoveisPaginados.length} de {imoveisFiltrados.length} imóveis
            </div>
          </div>
          
          {/* Visualização em grade */}
          <TabsContent value="grid" className="space-y-4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {skeletonArray.map((_, index) => (
                  <Skeleton key={index} className="h-80 w-full rounded-xl" />
                ))}
              </div>
            ) : imoveisFiltrados.length === 0 ? (
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
                      onDelete={handleDeleteImovel}
                      onToggleStatus={handleToggleStatus} 
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
          
          {/* Visualização em tabela */}
          {/* Visualiza├º├úo em tabela */}
          <TabsContent value="table" className="space-y-4">
            {loading ? (
              <Skeleton className="h-[500px] w-full rounded-xl" />
            ) : imoveisFiltrados.length === 0 ? (
              <EmptyStateImoveis onResetFiltros={resetFiltros} />
            ) : (
              <ImovelTable imoveis={imoveisFiltrados} />
            )}
          </TabsContent>
          
          {/* Visualiza├º├úo em mapa */}
          <TabsContent value="mapa">
            <div className="bg-muted/30 text-center p-10 rounded-lg">
              <div className="max-w-xl mx-auto">
                <Image 
                  src="https://via.placeholder.com/800x400?text=Mapa+de+Im%C3%B3veis" 
                  alt="Mapa de visualiza├º├úo"
                  width={800}
                  height={400}
                  className="rounded-lg mx-auto mb-4 opacity-50"
                />
                <h3 className="text-lg font-medium">Visualiza├º├úo em mapa</h3>
                <p className="text-muted-foreground mt-2">
                  A visualiza├º├úo em mapa est├í sendo implementada e estar├í dispon├¡vel em breve.
                  Ser├úo exibidos os {imoveisFiltrados.length} im├│veis filtrados.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
