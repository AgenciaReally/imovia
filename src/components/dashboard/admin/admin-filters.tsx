"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, Calendar, FileDown } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}

interface AdminDashboardFiltersProps {
  search: string
  setSearch: (value: string) => void
  sortOptions: SortOptions
  setSortOptions: (options: SortOptions) => void
  dateRange: { from: Date | undefined; to: Date | undefined }
  setDateRange: (range: { from: Date | undefined; to: Date | undefined }) => void
  onExport: () => void
  perfilFilter: 'todos' | 'super' | 'admin' | 'gerente'
  setPerfilFilter: (value: 'todos' | 'super' | 'admin' | 'gerente') => void
  statusFilter: 'todos' | 'ativo' | 'inativo' | 'pendente'
  className?: string
}

export function AdminDashboardFilters({
  search,
  setSearch,
  sortOptions,
  setSortOptions,
  dateRange,
  setDateRange,
  onExport,
  perfilFilter,
  setPerfilFilter,
  statusFilter,
  className
}: AdminDashboardFiltersProps) {
  const [openDatePicker, setOpenDatePicker] = useState(false)

  return (
    <div className={cn("bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4", className)}>
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar administradores..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select 
            value={perfilFilter}
            onValueChange={(value: any) => setPerfilFilter(value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Todos os perfis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os perfis</SelectItem>
              <SelectItem value="super">Super Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="gerente">Gerente</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={`${sortOptions.field}-${sortOptions.direction}`}
            onValueChange={(value) => {
              const [field, direction] = value.split('-')
              setSortOptions({ field, direction: direction as 'asc' | 'desc' })
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nome-asc">Nome (A-Z)</SelectItem>
              <SelectItem value="nome-desc">Nome (Z-A)</SelectItem>
              <SelectItem value="dataCriacao-desc">Mais recentes</SelectItem>
              <SelectItem value="dataCriacao-asc">Mais antigos</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-10">
                <Calendar className="mr-2 h-4 w-4" />
                {dateRange.from || dateRange.to ? (
                  <>
                    {dateRange.from && format(dateRange.from, 'dd/MM/yy', { locale: ptBR })}
                    {dateRange.to && ` - ${format(dateRange.to, 'dd/MM/yy', { locale: ptBR })}`}
                  </>
                ) : (
                  "Filtrar por data"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={{
                  from: dateRange.from,
                  to: dateRange.to,
                }}
                onSelect={(range) => {
                  setDateRange({ 
                    from: range?.from, 
                    to: range?.to 
                  })
                  if (range?.to) {
                    setOpenDatePicker(false)
                  }
                }}
                locale={ptBR}
                numberOfMonths={2}
                footer={
                  <div className="flex justify-end border-t p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDateRange({ from: undefined, to: undefined })
                        setOpenDatePicker(false)
                      }}
                    >
                      Limpar
                    </Button>
                  </div>
                }
              />
            </PopoverContent>
          </Popover>
          
          <Button 
            onClick={onExport}
            variant="outline"
            className="h-10"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>
    </div>
  )
}
