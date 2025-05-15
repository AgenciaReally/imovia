"use client"

import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Download, 
  ChevronDown,
  Check,
  CalendarRange
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ConstrutoraSortOptions {
  field: string
  direction: 'asc' | 'desc'
}

interface ConstrutoraDashboardFiltersProps {
  search: string
  setSearch: (search: string) => void
  sortOptions: ConstrutoraSortOptions
  setSortOptions: (options: ConstrutoraSortOptions) => void
  dateRange: { from: Date | undefined; to: Date | undefined }
  setDateRange: (range: { from: Date | undefined; to: Date | undefined }) => void
  onExport: () => void
  statusFilter: 'todas' | 'ativa' | 'inativa' | 'pendente'
}

export function ConstrutoraDashboardFilters({
  search,
  setSearch,
  sortOptions,
  setSortOptions,
  dateRange,
  setDateRange,
  onExport,
  statusFilter
}: ConstrutoraDashboardFiltersProps) {
  const [isFocused, setIsFocused] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Efeito de foco automático
  useEffect(() => {
    if (isExpanded && searchRef.current) {
      searchRef.current.focus()
    }
  }, [isExpanded])
  
  const handleSortChange = (field: string) => {
    if (sortOptions.field === field) {
      setSortOptions({
        ...sortOptions,
        direction: sortOptions.direction === 'asc' ? 'desc' : 'asc'
      })
    } else {
      setSortOptions({
        field,
        direction: 'asc'
      })
    }
  }
  
  const clearSearch = () => {
    setSearch('')
    if (searchRef.current) {
      searchRef.current.focus()
    }
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-md border border-gray-100 dark:border-slate-800 mb-6"
    >
      <div className="flex flex-wrap gap-3 items-center">
        {/* Barra de busca animada */}
        <div 
          className={cn(
            "relative transition-all duration-300 overflow-hidden",
            isExpanded ? "flex-1 md:flex-none md:w-80" : "w-10 md:w-auto md:flex-none"
          )}
        >
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className={cn(
                "h-10 w-10 p-2 text-muted-foreground rounded-l-md",
                isExpanded ? "border-y border-l border-input" : "border border-input",
                isFocused ? "text-primary border-primary" : ""
              )}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Search className="h-4 w-4" />
            </Button>
            
            {isExpanded && (
              <>
                <Input
                  ref={searchRef}
                  type="search"
                  placeholder="Buscar construtora..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="rounded-none rounded-r-md border-y border-r h-10 pl-2 focus-visible:ring-0 focus-visible:ring-offset-0"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
                
                {search && (
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Filtro de período */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-10 border-dashed",
                dateRange.from && "text-primary border-primary"
              )}
            >
              <CalendarRange className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "dd/MM/yy", { locale: ptBR })} -{" "}
                    {format(dateRange.to, "dd/MM/yy", { locale: ptBR })}
                  </>
                ) : (
                  format(dateRange.from, "dd/MM/yy", { locale: ptBR })
                )
              ) : (
                <span>Período</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={dateRange}
              onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
              locale={ptBR}
              numberOfMonths={2}
            />
            
            <div className="p-3 border-t border-border flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDateRange({ from: undefined, to: undefined })}
                className="text-xs"
              >
                Limpar
              </Button>
              <Button
                size="sm"
                onClick={() => setDateRange({ 
                  from: new Date(new Date().setDate(new Date().getDate() - 30)), 
                  to: new Date() 
                })}
                className="text-xs"
              >
                Últimos 30 dias
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Ordenação */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-10"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              <span>Ordenar</span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuCheckboxItem
                checked={sortOptions.field === 'nome'}
                onCheckedChange={() => handleSortChange('nome')}
              >
                Nome {sortOptions.field === 'nome' && 
                  <span className="ml-2 text-xs opacity-60">
                    ({sortOptions.direction === 'asc' ? '↑' : '↓'})
                  </span>
                }
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortOptions.field === 'dataRegistro'}
                onCheckedChange={() => handleSortChange('dataRegistro')}
              >
                Data de Registro {sortOptions.field === 'dataRegistro' && 
                  <span className="ml-2 text-xs opacity-60">
                    ({sortOptions.direction === 'asc' ? '↑' : '↓'})
                  </span>
                }
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortOptions.field === 'qtdImoveis'}
                onCheckedChange={() => handleSortChange('qtdImoveis')}
              >
                Quantidade de Imóveis {sortOptions.field === 'qtdImoveis' && 
                  <span className="ml-2 text-xs opacity-60">
                    ({sortOptions.direction === 'asc' ? '↑' : '↓'})
                  </span>
                }
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortOptions.field === 'qtdUsuarios'}
                onCheckedChange={() => handleSortChange('qtdUsuarios')}
              >
                Quantidade de Usuários {sortOptions.field === 'qtdUsuarios' && 
                  <span className="ml-2 text-xs opacity-60">
                    ({sortOptions.direction === 'asc' ? '↑' : '↓'})
                  </span>
                }
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Botão de exportar */}
        <Button
          variant="default"
          size="sm"
          className="h-10 ml-auto"
          onClick={onExport}
        >
          <Download className="mr-2 h-4 w-4" />
          <span>Exportar</span>
        </Button>
      </div>
      
      {/* Mostrar filtros ativos */}
      {(search || dateRange.from || statusFilter !== 'todas') && (
        <div className="mt-3 flex flex-wrap gap-2">
          <div className="text-sm text-muted-foreground">Filtros ativos:</div>
          
          {search && (
            <div className="flex items-center bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">
              <span>Busca: {search}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0" 
                onClick={clearSearch}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {dateRange.from && (
            <div className="flex items-center bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">
              <span>
                Período: {format(dateRange.from, "dd/MM/yy")} 
                {dateRange.to && ` - ${format(dateRange.to, "dd/MM/yy")}`}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0" 
                onClick={() => setDateRange({ from: undefined, to: undefined })}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {statusFilter !== 'todas' && (
            <div className={cn(
              "flex items-center px-2 py-1 rounded-md text-xs",
              statusFilter === 'ativa' ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" :
              statusFilter === 'inativa' ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" :
              "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
            )}>
              <span>
                Status: {statusFilter === 'ativa' ? 'Ativas' : statusFilter === 'inativa' ? 'Inativas' : 'Pendentes'}
              </span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
