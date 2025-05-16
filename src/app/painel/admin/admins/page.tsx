"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Info } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { AdminCard } from "@/components/dashboard/admin/admin-card"
import { AdminDashboardStats } from "@/components/dashboard/admin/admin-stats"
import { AdminDashboardFilters } from "@/components/dashboard/admin/admin-filters"
import { AdminFormModal } from "@/components/dashboard/admin/admin-form-modal"
import { AdminDashboard, AdminStats, getAdmins, getEstatisticasAdmins } from "@/services/admin-service"

// Componente de exportar dados em CSV
const exportarAdminsCSV = (admins: AdminDashboard[]) => {
  const headers = ['ID', 'Nome', 'Email', 'Perfil', 'Status', 'Data de Criação'];
  
  const rows = admins.map(admin => [
    admin.id,
    admin.nome,
    admin.email,
    admin.perfil === 'super' ? 'Super Admin' : admin.perfil === 'admin' ? 'Admin' : 'Gerente',
    admin.status.charAt(0).toUpperCase() + admin.status.slice(1),
    format(parseISO(admin.dataCriacao), 'dd/MM/yyyy', { locale: ptBR })
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `administradores-${format(new Date(), 'dd-MM-yyyy')}.csv`);
  link.click();
  URL.revokeObjectURL(url);
};

// Implementação da página
export default function AdminsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [admins, setAdmins] = useState<AdminDashboard[]>([])
  const [filteredAdmins, setFilteredAdmins] = useState<AdminDashboard[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOptions, setSortOptions] = useState({ field: 'nome', direction: 'asc' as 'asc' | 'desc' })
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativo' | 'inativo' | 'pendente'>('todos')
  const [perfilFilter, setPerfilFilter] = useState<'todos' | 'super' | 'admin' | 'gerente'>('todos')
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined })
  
  const [stats, setStats] = useState<AdminStats>({
    total: 0,
    ativos: 0,
    inativos: 0,
    pendentes: 0,
    superAdmins: 0,
    admins: 0,
    gerentes: 0,
    ultimosCadastros: []
  })
  
  // Função para recarregar dados após adicionar, excluir ou modificar admin
  const handleAdminChange = async () => {
    try {
      setLoading(true)
      const [adminsData, statsData] = await Promise.all([
        getAdmins(),
        getEstatisticasAdmins()
      ])
      
      setAdmins(adminsData)
      setStats(statsData)
      setLoading(false)
      
      toast({
        title: "Lista atualizada",
        description: "Lista de administradores atualizada com sucesso.",
      })
    } catch (error) {
      console.error('Erro ao recarregar dados:', error)
      setLoading(false)
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível atualizar a lista de administradores",
        variant: "destructive",
      })
    }
  }
  
  // Carregando dados reais da API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [adminsData, statsData] = await Promise.all([
          getAdmins(),
          getEstatisticasAdmins()
        ])
        
        setAdmins(adminsData)
        setStats(statsData)
        setLoading(false)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        setLoading(false)
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os administradores",
          variant: "destructive",
        })
      }
    }
    
    fetchData()
  }, [])
  
  // Filtragem e ordenação
  useEffect(() => {
    let filtered = [...admins]
    
    // Aplicar filtro de busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(a => 
        a.nome.toLowerCase().includes(query) ||
        a.email.toLowerCase().includes(query)
      )
    }
    
    // Aplicar filtro de status
    if (statusFilter !== 'todos') {
      filtered = filtered.filter(a => a.status === statusFilter)
    }
    
    // Aplicar filtro de perfil
    if (perfilFilter !== 'todos') {
      filtered = filtered.filter(a => a.perfil === perfilFilter)
    }
    
    // Aplicar filtro de data
    if (dateRange.from || dateRange.to) {
      filtered = filtered.filter(a => {
        const dataCriacao = parseISO(a.dataCriacao)
        
        if (dateRange.from && dateRange.to) {
          return dataCriacao >= dateRange.from && dataCriacao <= dateRange.to
        }
        
        if (dateRange.from) {
          return dataCriacao >= dateRange.from
        }
        
        if (dateRange.to) {
          return dataCriacao <= dateRange.to
        }
        
        return true
      })
    }
    
    // Aplicar ordenação
    filtered.sort((a, b) => {
      let valueA = a[sortOptions.field as keyof AdminDashboard];
      let valueB = b[sortOptions.field as keyof AdminDashboard];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortOptions.direction === 'asc' 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      
      return 0;
    });
    
    setFilteredAdmins(filtered)
  }, [admins, searchQuery, statusFilter, perfilFilter, sortOptions, dateRange])

  // Esqueletos de carregamento para o estado de loading
  const skeletonArray = Array(6).fill(null)
  
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6 py-2">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-bold tracking-tight">Administradores</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie todos os administradores e suas permissões no sistema
            </p>
          </div>
          
          <div>
            <AdminFormModal onSuccess={handleAdminChange} />
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
          <AdminDashboardStats 
            stats={stats}
            selectedFilter={statusFilter}
            onFilterChange={setStatusFilter}
          />
        )}
        
        {/* Filtros */}
        <AdminDashboardFilters 
          search={searchQuery}
          setSearch={setSearchQuery}
          sortOptions={sortOptions}
          setSortOptions={setSortOptions}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onExport={() => exportarAdminsCSV(filteredAdmins)}
          perfilFilter={perfilFilter}
          setPerfilFilter={setPerfilFilter}
          statusFilter={statusFilter}
        />
        
        {/* Lista de administradores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <>
              {skeletonArray.map((_, index) => (
                <Skeleton key={index} className="h-64 w-full rounded-xl" />
              ))}
            </>
          ) : filteredAdmins.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Info className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Nenhum administrador encontrado</h3>
              <p className="text-muted-foreground mt-1">
                Tente ajustar seus filtros ou adicione um novo administrador
              </p>
            </div>
          ) : (
            <>
              {filteredAdmins.map(admin => (
                <AdminCard 
                  key={admin.id}
                  admin={admin}
                  onDelete={handleAdminChange}
                  onStatusChange={handleAdminChange}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
