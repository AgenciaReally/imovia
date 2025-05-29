"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Plus, Info, ChevronLeft, ChevronRight } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConstrutoraTileCard } from "@/components/dashboard/construtora/construtora-card"
import { ConstrutoraDashboardStats } from "@/components/dashboard/construtora/construtora-stats"
import { ConstrutoraDashboardFilters } from "@/components/dashboard/construtora/construtora-filters"
import { ConstrutorFormModal } from "@/components/dashboard/construtora/construtora-form-modal"
import { getConstrutoras, getEstatisticasConstrutoras, ConstrutoraDashboard } from "@/services/construtora-service"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"

// Versão básica da página para resolver o erro de build
export default function ConstrutorasPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [construtoras, setConstrutoras] = useState<ConstrutoraDashboard[]>([])
  const [filteredConstrutoras, setFilteredConstrutoras] = useState<ConstrutoraDashboard[]>([])
  const [paginatedConstrutoras, setPaginatedConstrutoras] = useState<ConstrutoraDashboard[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOptions, setSortOptions] = useState({ field: 'nome', direction: 'asc' as 'asc' | 'desc' })
  const [statusFilter, setStatusFilter] = useState<'todas' | 'ativa' | 'inativa' | 'pendente'>('todas')
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined })
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 8
  
  // Função para recarregar dados após adicionar ou excluir construtora
  const handleNovaConstrutora = async () => {
    try {
      setLoading(true)
      const [construtorasData, statsData] = await Promise.all([
        getConstrutoras(),
        getEstatisticasConstrutoras()
      ])
      
      setConstrutoras(construtorasData)
      setStats(statsData as typeof stats)
      setLoading(false)
      
      toast({
        title: "Lista atualizada",
        description: "Lista de construtoras atualizada com sucesso.",
      })
    } catch (error) {
      console.error('Erro ao recarregar dados:', error)
      setLoading(false)
    }
  }
  
  // Tipagem correta para o ranking de construtoras
  type RankingConstrutora = {
    nome: string;
    id: string;
    _count: {
      usuarios: number;
      imoveis: number;
    };
  }

  const [stats, setStats] = useState({
    total: 0,
    ativas: 0,
    inativas: 0,
    pendentes: 0,
    totalImoveis: 0,
    mediaImoveisPorConstrutora: 0,
    mediaUsuariosPorConstrutora: 0,
    rankingConstrutoras: [] as RankingConstrutora[]
  })
  
  // Carregando dados reais do banco
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [construtorasData, statsData] = await Promise.all([
          getConstrutoras(),
          getEstatisticasConstrutoras()
        ])
        
        setConstrutoras(construtorasData)
        setStats(statsData as typeof stats)
        setLoading(false)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  // Filtragem e ordenação
  useEffect(() => {
    let filtered = [...construtoras]
    
    // Aplicar filtro de busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(c => 
        c.nome.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.cnpj.toLowerCase().includes(query)
      )
    }
    
    // Aplicar filtro de status
    if (statusFilter !== 'todas') {
      filtered = filtered.filter(c => c.status === statusFilter)
    }
    
    // Ordenação
    filtered = filtered.sort((a, b) => {
      const fieldA = a[sortOptions.field as keyof ConstrutoraDashboard];
      const fieldB = b[sortOptions.field as keyof ConstrutoraDashboard];
      
      // Converter para string ou número para comparação
      const valueA = typeof fieldA === 'string' ? fieldA.toLowerCase() : Number(fieldA) || 0;
      const valueB = typeof fieldB === 'string' ? fieldB.toLowerCase() : Number(fieldB) || 0;
      
      if (sortOptions.direction === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
    
    setFilteredConstrutoras(filtered)
    setCurrentPage(1) // Resetar para primeira página quando filtros mudam
    setTotalPages(Math.ceil(filtered.length / itemsPerPage))
  }, [construtoras, searchQuery, statusFilter, sortOptions])
  
  // Paginação
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    setPaginatedConstrutoras(filteredConstrutoras.slice(startIndex, endIndex))
  }, [filteredConstrutoras, currentPage, itemsPerPage])

  // Função para exportar dados das construtoras em CSV
  const handleExport = () => {
    try {
      // Criar cabeçalhos para o CSV
      const headers = ['Nome', 'CNPJ', 'Email', 'Telefone', 'Endereço', 'Status', 'Data Registro', 'Qtd. Imóveis', 'Qtd. Usuários']
      
      // Transformar os dados em linhas de CSV
      const csvRows = [
        headers.join(','),
        ...filteredConstrutoras.map(c => {
          return [
            `"${c.nome}"`,
            `"${c.cnpj}"`,
            `"${c.email}"`,
            `"${c.telefone}"`,
            `"${c.endereco}"`,
            `"${c.status}"`,
            `"${c.dataRegistro}"`,
            c.qtdImoveis,
            c.qtdUsuarios
          ].join(',')
        })
      ]
      
      // Criar conteúdo do CSV
      const csvContent = csvRows.join('\n')
      
      // Criar o blob e link para download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      
      // Configurar e simular o clique no link para download
      link.setAttribute('href', url)
      link.setAttribute('download', `construtoras_${format(new Date(), 'dd-MM-yyyy')}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast({
        title: "Exportação concluída",
        description: `${filteredConstrutoras.length} construtoras exportadas com sucesso.`
      })
    } catch (error) {
      console.error('Erro ao exportar dados:', error)
      toast({
        variant: "destructive",
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados.",
      })
    }
  }
  
  // Esqueletos de carregamento para o estado de loading
  const skeletonArray = Array(8).fill(null)
  
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6 py-2">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-bold tracking-tight">Construtoras</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie todas as construtoras parceiras e seus imóveis
            </p>
          </div>
          
          <div>
            <ConstrutorFormModal onSuccess={handleNovaConstrutora} />
          </div>
        </div>
        
        {/* Stats Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {skeletonArray.slice(0, 4).map((_, index) => (
              <Skeleton key={index} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <ConstrutoraDashboardStats 
            stats={stats}
            selectedFilter={statusFilter}
            onFilterChange={setStatusFilter}
          />
        )}
        
        {/* Filtros */}
        <ConstrutoraDashboardFilters
          search={searchQuery}
          setSearch={setSearchQuery}
          sortOptions={sortOptions}
          setSortOptions={setSortOptions}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onExport={handleExport}
          statusFilter={statusFilter}
        />
        
        {/* Lista de construtoras */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <>
              {skeletonArray.map((_, index) => (
                <Skeleton key={index} className="h-80 w-full rounded-xl" />
              ))}
            </>
          ) : filteredConstrutoras.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Info className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Nenhuma construtora encontrada</h3>
              <p className="text-muted-foreground mt-1">
                Tente ajustar seus filtros ou adicione uma nova construtora
              </p>
            </div>
          ) : (
            <>
              {paginatedConstrutoras.map(construtora => (
                <ConstrutoraTileCard 
                  key={construtora.id}
                  construtora={construtora}
                  className="h-full"
                  onDelete={handleNovaConstrutora} // Recarregar após exclusão
                  onStatusChange={handleNovaConstrutora} // Recarregar após mudança de status
                />
              ))}
            </>
          )}
        </div>
        
        {/* Paginação */}
        {filteredConstrutoras.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Mostrando {paginatedConstrutoras.length} de {filteredConstrutoras.length} construtoras
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    // Mostrar apenas páginas próximas à atual ou as extremidades
                    return (
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                    );
                  })
                  .map((page, i, arr) => {
                    const pageNum = page as number;
                    // Adicionar elipses quando necessário
                    if (i > 0 && (arr[i - 1] as number) !== pageNum - 1) {
                      return (
                        <React.Fragment key={`ellipsis-${pageNum}`}>
                          <span className="px-2 text-muted-foreground">
                            ...
                          </span>
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        </React.Fragment>
                      );
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
