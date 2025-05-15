"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Plus, Info } from "lucide-react"

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
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOptions, setSortOptions] = useState({ field: 'nome', direction: 'asc' as 'asc' | 'desc' })
  const [statusFilter, setStatusFilter] = useState<'todas' | 'ativa' | 'inativa' | 'pendente'>('todas')
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined })
  
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
    
    setFilteredConstrutoras(filtered)
  }, [construtoras, searchQuery, statusFilter])

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
          onExport={() => alert("Exportação em desenvolvimento")}
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
              {filteredConstrutoras.map(construtora => (
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
      </div>
    </DashboardLayout>
  )
}
