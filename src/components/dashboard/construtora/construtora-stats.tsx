"use client"

import { motion } from 'framer-motion'
import { Building2, CheckCircle2, XCircle, Clock, TrendingUp, Briefcase, Users2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ConstrutoraDashboardStats {
  total: number
  ativas: number
  inativas: number
  pendentes: number
  totalImoveis: number
  mediaImoveisPorConstrutora: number
  mediaUsuariosPorConstrutora: number
}

interface ConstrutoraSelectorProps {
  stats: ConstrutoraDashboardStats
  selectedFilter: 'todas' | 'ativa' | 'inativa' | 'pendente'
  onFilterChange: (filter: 'todas' | 'ativa' | 'inativa' | 'pendente') => void
}

export function ConstrutoraDashboardStats({
  stats,
  selectedFilter,
  onFilterChange
}: ConstrutoraSelectorProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8"
    >
      {/* Cards de status */}
      <motion.div variants={itemVariants}>
        <Card 
          className={cn(
            "border-0 shadow-md h-full transition-all cursor-pointer overflow-hidden",
            selectedFilter === 'todas' ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-950" : ""
          )}
          onClick={() => onFilterChange('todas')}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
          <CardContent className="p-6 flex items-center">
            <div className="mr-4 p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Building2 className="h-6 w-6 text-blue-700 dark:text-blue-400" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-3xl font-bold tracking-tight">{stats.total}</h3>
              <p className="text-sm font-medium text-muted-foreground">Total de Construtoras</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card 
          className={cn(
            "border-0 shadow-md h-full transition-all cursor-pointer overflow-hidden",
            selectedFilter === 'ativa' ? "ring-2 ring-green-500 ring-offset-2 dark:ring-offset-slate-950" : ""
          )}
          onClick={() => onFilterChange('ativa')}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-600" />
          <CardContent className="p-6 flex items-center">
            <div className="mr-4 p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
              <CheckCircle2 className="h-6 w-6 text-green-700 dark:text-green-400" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-3xl font-bold tracking-tight text-green-700 dark:text-green-400">{stats.ativas}</h3>
              <p className="text-sm font-medium text-muted-foreground">Construtoras Ativas</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card 
          className={cn(
            "border-0 shadow-md h-full transition-all cursor-pointer overflow-hidden",
            selectedFilter === 'inativa' ? "ring-2 ring-red-500 ring-offset-2 dark:ring-offset-slate-950" : ""
          )}
          onClick={() => onFilterChange('inativa')}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-rose-600" />
          <CardContent className="p-6 flex items-center">
            <div className="mr-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/20">
              <XCircle className="h-6 w-6 text-red-700 dark:text-red-400" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-3xl font-bold tracking-tight text-red-700 dark:text-red-400">{stats.inativas}</h3>
              <p className="text-sm font-medium text-muted-foreground">Construtoras Inativas</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card 
          className={cn(
            "border-0 shadow-md h-full transition-all cursor-pointer overflow-hidden",
            selectedFilter === 'pendente' ? "ring-2 ring-amber-500 ring-offset-2 dark:ring-offset-slate-950" : ""
          )}
          onClick={() => onFilterChange('pendente')}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-yellow-600" />
          <CardContent className="p-6 flex items-center">
            <div className="mr-4 p-3 rounded-lg bg-amber-100 dark:bg-amber-900/20">
              <Clock className="h-6 w-6 text-amber-700 dark:text-amber-400" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-3xl font-bold tracking-tight text-amber-700 dark:text-amber-400">{stats.pendentes}</h3>
              <p className="text-sm font-medium text-muted-foreground">Aguardando Aprovação</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Stats avançadas */}
      <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-4">
        <Card className="border-0 shadow-md overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-violet-600 to-indigo-700" />
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Métricas Avançadas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 mr-4">
                  <Briefcase className="h-5 w-5 text-indigo-700 dark:text-indigo-400" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Imóveis</p>
                  <p className="text-xl font-bold">{stats.totalImoveis}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-violet-100 dark:bg-violet-900/20 mr-4">
                  <TrendingUp className="h-5 w-5 text-violet-700 dark:text-violet-400" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Média de Imóveis</p>
                  <p className="text-xl font-bold">{stats.mediaImoveisPorConstrutora.toFixed(1)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-fuchsia-100 dark:bg-fuchsia-900/20 mr-4">
                  <Users2 className="h-5 w-5 text-fuchsia-700 dark:text-fuchsia-400" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Média de Usuários</p>
                  <p className="text-xl font-bold">{stats.mediaUsuariosPorConstrutora.toFixed(1)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
