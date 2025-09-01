"use client"

import { ShieldCheck, Users, UserCheck, UserX, Clock } from "lucide-react"
import { AdminStats } from "@/services/admin-service"
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AdminDashboardStatsProps {
  stats: AdminStats
  selectedFilter: 'todos' | 'ativo' | 'inativo' | 'pendente'
  onFilterChange: (filter: 'todos' | 'ativo' | 'inativo' | 'pendente') => void
  className?: string
}

export function AdminDashboardStats({ 
  stats, 
  selectedFilter, 
  onFilterChange,
  className 
}: AdminDashboardStatsProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {/* Total de Administradores */}
      <Card 
        className={cn(
          "group transition-all duration-200 cursor-pointer border-2", 
          selectedFilter === 'todos' 
            ? "border-orange-500 bg-orange-50/50 dark:bg-orange-900/10" 
            : "hover:border-orange-200"
        )}
        onClick={() => onFilterChange('todos')}
      >
        <CardHeader className="pb-2">
          <CardDescription>Total de Administradores</CardDescription>
          <CardTitle className="text-3xl font-bold">{stats.total}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-muted-foreground">
            <ShieldCheck className={cn(
              "h-4 w-4 mr-1.5",
              selectedFilter === 'todos' ? "text-orange-500" : "text-muted-foreground group-hover:text-orange-500"
            )} />
            <span>Todos os perfis</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Administradores Ativos */}
      <Card 
        className={cn(
          "group transition-all duration-200 cursor-pointer border-2", 
          selectedFilter === 'ativo' 
            ? "border-green-500 bg-green-50/50 dark:bg-green-900/10" 
            : "hover:border-green-200"
        )}
        onClick={() => onFilterChange('ativo')}
      >
        <CardHeader className="pb-2">
          <CardDescription>Administradores Ativos</CardDescription>
          <CardTitle className="text-3xl font-bold">{stats.ativos}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-muted-foreground">
            <UserCheck className={cn(
              "h-4 w-4 mr-1.5",
              selectedFilter === 'ativo' ? "text-green-500" : "text-muted-foreground group-hover:text-green-500"
            )} />
            <span>{((stats.ativos / stats.total) * 100).toFixed(0)}% do total</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Administradores Inativos */}
      <Card 
        className={cn(
          "group transition-all duration-200 cursor-pointer border-2", 
          selectedFilter === 'inativo' 
            ? "border-gray-500 bg-gray-50/50 dark:bg-gray-800/50" 
            : "hover:border-gray-200"
        )}
        onClick={() => onFilterChange('inativo')}
      >
        <CardHeader className="pb-2">
          <CardDescription>Administradores Inativos</CardDescription>
          <CardTitle className="text-3xl font-bold">{stats.inativos}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-muted-foreground">
            <UserX className={cn(
              "h-4 w-4 mr-1.5",
              selectedFilter === 'inativo' ? "text-gray-500" : "text-muted-foreground group-hover:text-gray-500"
            )} />
            <span>{((stats.inativos / stats.total) * 100).toFixed(0)}% do total</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Administradores Pendentes */}
      <Card 
        className={cn(
          "group transition-all duration-200 cursor-pointer border-2", 
          selectedFilter === 'pendente' 
            ? "border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10" 
            : "hover:border-yellow-200"
        )}
        onClick={() => onFilterChange('pendente')}
      >
        <CardHeader className="pb-2">
          <CardDescription>Administradores Pendentes</CardDescription>
          <CardTitle className="text-3xl font-bold">{stats.pendentes}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className={cn(
              "h-4 w-4 mr-1.5",
              selectedFilter === 'pendente' ? "text-yellow-500" : "text-muted-foreground group-hover:text-yellow-500"
            )} />
            <span>Aguardando ativação</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
