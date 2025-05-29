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
import { OruloBuilding } from '@/types/orulo'
import { ImovelTable } from '@/components/dashboard/imovel/imovel-table'
import { toast } from "@/components/ui/use-toast"

// Componente para exibir o banner quando não há imóveis ou quando ocorre um erro
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

// Adapter para converter imóveis da Orulo para o formato usado pela UI
function adaptOruloToImovelDisplay(oruloBuilding: OruloBuilding) {
  return {
    id: oruloBuilding.id.toString(),
    titulo: oruloBuilding.name || `Imóvel ${oruloBuilding.id}`,
    descricao: oruloBuilding.description || 'Descrição não disponível',
    preco: oruloBuilding.min_price || 0,
    area: oruloBuilding.area_total || 0,
    quartos: oruloBuilding.dormitories || 0,
    banheiros: oruloBuilding.bathrooms || 0,
    vagas: oruloBuilding.parking_spots || 0,
    endereco: {
      logradouro: oruloBuilding.address?.street || '',
      numero: oruloBuilding.address?.number || '',
      bairro: oruloBuilding.address?.neighborhood || '',
      cidade: oruloBuilding.address?.city || 'Cidade não disponível',
      estado: oruloBuilding.address?.state || '',
      cep: oruloBuilding.address?.zipcode || ''
    },
    caracteristicas: oruloBuilding.characteristics?.map(c => c.name) || [],
    ativo: true,
    destaque: false,
    dataAtualizacao: oruloBuilding.updated_at || new Date().toISOString(),
    imagens: [
      oruloBuilding.default_image?.['520x280'] || '/placeholder-imovel.jpg'
    ],
    // Campos adicionais específicos da Orulo
    oruloId: oruloBuilding.id.toString(),
  };
}

// Componente da página principal
export default function ImoveisOruloPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [imoveis, setImoveis] = useState<any[]>([])
  const [imoveisFiltrados, setImoveisFiltrados] = useState<any[]>([])
  const [caracteristicasDisponiveis, setCaracteristicasDisponiveis] = useState<string[]>([])
  const [precoMaximo, setPrecoMaximo] = useState(5000000)
  const [areaMaxima, setAreaMaxima] = useState(500)
  
  // Paginação
  const [pagina, setPagina] = useState(1)
  const [itensPorPagina, setItensPorPagina] = useState(8)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [imoveisPaginados, setImoveisPaginados] = useState<any[]>([])
  
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
  
  // Função principal para carregar dados da API
  const loadData = useCallback(async (forceReload = false) => {
    try {
      setLoading(true);
      
      // Buscar dados da API da Orulo
      const response = await fetch('/api/orulo?all=true');
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar imóveis: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Dados da API Orulo:', data);
      
      // Se temos apenas IDs, precisamos buscar os detalhes de cada imóvel
      if (data && data.results) {
        const imoveisOrulo = data.results;
        
        // Formatar dados para o formato usado pela UI
        const imoveisFormatados = imoveisOrulo.map(adaptOruloToImovelDisplay);
        
        setImoveis(imoveisFormatados);
        setImoveisFiltrados(imoveisFormatados);
        setTotal(data.count || imoveisFormatados.length);
        
        // Extrair características disponíveis
        const todasCaracteristicas = new Set<string>();
        imoveisFormatados.forEach(imovel => {
          if (imovel.caracteristicas && Array.isArray(imovel.caracteristicas)) {
            imovel.caracteristicas.forEach((carac: string) => todasCaracteristicas.add(carac));
          }
        });
        setCaracteristicasDisponiveis(Array.from(todasCaracteristicas));
        
        // Determinar preço e área máximos para os filtros
        const maxPreco = Math.max(...imoveisFormatados.map(i => i.preco || 0));
        const maxArea = Math.max(...imoveisFormatados.map(i => i.area || 0));
        
        if (maxPreco > 0) setPrecoMaximo(maxPreco);
        if (maxArea > 0) setAreaMaxima(maxArea);
      }
    } catch (error) {
      console.error('Erro ao carregar imóveis da Orulo:', error);
      toast({
        title: "Erro ao carregar imóveis",
        description: `Ocorreu um erro ao buscar os imóveis da Orulo. ${error instanceof Error ? error.message : 'Tente novamente mais tarde.'}`,
        variant: "destructive"
      });
      
      setImoveis([]);
      setImoveisFiltrados([]);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Efeito para carregar dados iniciais
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  // Efeito para aplicar filtros
  useEffect(() => {
    if (imoveis.length === 0) return;
    
    let filtered = [...imoveis];
    
    // Filtro de busca textual
    if (filtros.busca) {
      const searchTerm = filtros.busca.toLowerCase();
      filtered = filtered.filter(imovel => 
        imovel.titulo?.toLowerCase().includes(searchTerm) || 
        imovel.descricao?.toLowerCase().includes(searchTerm) ||
        imovel.endereco?.cidade?.toLowerCase().includes(searchTerm) ||
        imovel.endereco?.bairro?.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filtro de preço
    filtered = filtered.filter(imovel => 
      imovel.preco >= filtros.precoRange[0] && 
      imovel.preco <= filtros.precoRange[1]
    );
    
    // Filtro de área
    filtered = filtered.filter(imovel => 
      imovel.area >= filtros.areaRange[0] && 
      imovel.area <= filtros.areaRange[1]
    );
    
    // Filtro de quartos
    if (filtros.quartos.length > 0) {
      filtered = filtered.filter(imovel => 
        filtros.quartos.includes(imovel.quartos)
      );
    }
    
    // Filtro de banheiros
    if (filtros.banheiros.length > 0) {
      filtered = filtered.filter(imovel => 
        filtros.banheiros.includes(imovel.banheiros)
      );
    }
    
    // Filtro de vagas
    if (filtros.vagas.length > 0) {
      filtered = filtered.filter(imovel => 
        filtros.vagas.includes(imovel.vagas)
      );
    }
    
    // Filtro de características
    if (filtros.caracteristicas.length > 0) {
      filtered = filtered.filter(imovel => 
        filtros.caracteristicas.every(c => 
          imovel.caracteristicas && imovel.caracteristicas.includes(c)
        )
      );
    }
    
    // Ordenação
    filtered.sort((a, b) => {
      const campo = filtros.ordenacao.campo;
      const fator = filtros.ordenacao.direcao === 'asc' ? 1 : -1;
      
      if (campo === 'dataAtualizacao') {
        return (new Date(a.dataAtualizacao).getTime() - new Date(b.dataAtualizacao).getTime()) * fator;
      }
      
      return (a[campo] - b[campo]) * fator;
    });
    
    setImoveisFiltrados(filtered);
    
    // Atualizar total de páginas
    const novoTotalPaginas = Math.ceil(filtered.length / itensPorPagina);
    setTotalPaginas(novoTotalPaginas);
    
    // Garantir que a página atual é válida
    if (pagina > novoTotalPaginas && novoTotalPaginas > 0) {
      setPagina(novoTotalPaginas);
    }
  }, [filtros, imoveis, itensPorPagina, pagina]);
  
  // Efeito para paginação
  useEffect(() => {
    const inicio = (pagina - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    setImoveisPaginados(imoveisFiltrados.slice(inicio, fim));
  }, [imoveisFiltrados, pagina, itensPorPagina]);
  
  // Array para mostrar skeletons durante carregamento
  const skeletonArray = Array(8).fill(0);
  
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Imóveis da Orulo</h1>
            <p className="text-muted-foreground">
              Gerencie e visualize os imóveis importados da API Orulo.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => loadData(true)} variant="outline" className="gap-2">
              <RefreshCcw className="h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </div>
        
        <ImoveisFiltros 
          filtros={filtros}
          setFiltros={setFiltros}
          precoMaximo={precoMaximo}
          areaMaxima={areaMaxima}
          caracteristicasDisponiveis={caracteristicasDisponiveis}
          resetFiltros={resetFiltros}
        />
        
        <Tabs defaultValue="grid" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="grid" className="flex items-center gap-2">
                <Grid className="h-4 w-4" />
                Grade
              </TabsTrigger>
              <TabsTrigger value="table" className="flex items-center gap-2">
                <TableIcon className="h-4 w-4" />
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
                      onDelete={() => {}}
                      onToggleStatus={() => {}} 
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
          <TabsContent value="table" className="space-y-4">
            {loading ? (
              <Skeleton className="h-[500px] w-full rounded-xl" />
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
