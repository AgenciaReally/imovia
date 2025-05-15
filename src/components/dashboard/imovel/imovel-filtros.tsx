"use client"

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Tag, 
  ChevronDown, 
  Check,
  Home,
  Ruler,
  BedDouble,
  Bath,
  Car,
  CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface ImoveisFiltros {
  busca: string
  ordenacao: {
    campo: 'preco' | 'area' | 'quartos' | 'dataAtualizacao'
    direcao: 'asc' | 'desc'
  }
  precoRange: [number, number]
  areaRange: [number, number]
  quartos: number[]
  banheiros: number[]
  vagas: number[]
  status: string[]
  caracteristicas: string[]
}

interface ImoveisFiltrosProps {
  filtros: ImoveisFiltros
  setFiltros: (filtros: ImoveisFiltros) => void
  totalImoveis: number
  totalImoveisFiltrados: number
  caracteristicasDisponiveis: string[]
  precoMaximo: number
  areaMaxima: number
  onResetFiltros: () => void
}

export function ImoveisFiltros({
  filtros,
  setFiltros,
  totalImoveis,
  totalImoveisFiltrados,
  caracteristicasDisponiveis,
  precoMaximo,
  areaMaxima,
  onResetFiltros
}: ImoveisFiltrosProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  
  // Formatar moeda
  const formatCurrency = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor)
  }
  
  // Efeito de foco automático
  useEffect(() => {
    if (isExpanded && searchRef.current) {
      searchRef.current.focus()
    }
  }, [isExpanded])
  
  // Alterar ordenação
  const handleSortChange = (campo: 'preco' | 'area' | 'quartos' | 'dataAtualizacao') => {
    if (filtros.ordenacao.campo === campo) {
      setFiltros({
        ...filtros,
        ordenacao: {
          ...filtros.ordenacao,
          direcao: filtros.ordenacao.direcao === 'asc' ? 'desc' : 'asc'
        }
      })
    } else {
      setFiltros({
        ...filtros,
        ordenacao: {
          campo,
          direcao: 'asc'
        }
      })
    }
  }
  
  // Alternar status
  const toggleStatus = (status: string) => {
    const newStatus = filtros.status.includes(status)
      ? filtros.status.filter(s => s !== status)
      : [...filtros.status, status]
    
    setFiltros({
      ...filtros,
      status: newStatus
    })
  }
  
  // Alternar característica
  const toggleCaracteristica = (caracteristica: string) => {
    const novasCaracteristicas = filtros.caracteristicas.includes(caracteristica)
      ? filtros.caracteristicas.filter(c => c !== caracteristica)
      : [...filtros.caracteristicas, caracteristica]
    
    setFiltros({
      ...filtros,
      caracteristicas: novasCaracteristicas
    })
  }
  
  // Alternar valores de quartos, banheiros, vagas
  const toggleNumericFilter = (field: 'quartos' | 'banheiros' | 'vagas', value: number) => {
    const currentValues = filtros[field]
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]
    
    setFiltros({
      ...filtros,
      [field]: newValues
    })
  }
  
  // Limpar busca
  const clearSearch = () => {
    setFiltros({
      ...filtros,
      busca: ''
    })
    if (searchRef.current) {
      searchRef.current.focus()
    }
  }
  
  // Verificar se há filtros ativos
  const temFiltrosAtivos = 
    filtros.busca !== '' || 
    filtros.status.length > 0 || 
    filtros.caracteristicas.length > 0 ||
    filtros.quartos.length > 0 ||
    filtros.banheiros.length > 0 ||
    filtros.vagas.length > 0 ||
    filtros.precoRange[0] > 0 ||
    filtros.precoRange[1] < precoMaximo ||
    filtros.areaRange[0] > 0 ||
    filtros.areaRange[1] < areaMaxima
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-gray-100 dark:border-slate-800 mb-6 overflow-hidden"
    >
      <div className="p-4 border-b border-gray-100 dark:border-slate-800">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Barra de busca animada */}
          <div 
            className={cn(
              "relative transition-all duration-300 overflow-hidden",
              isExpanded ? "flex-1 md:flex-none md:w-96" : "w-10 md:w-auto md:flex-none"
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
                    placeholder="Buscar imóvel, localização..."
                    value={filtros.busca}
                    onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
                    className="rounded-none rounded-r-md border-y border-r h-10 pl-2 focus-visible:ring-0 focus-visible:ring-offset-0"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                  
                  {filtros.busca && (
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
                  checked={filtros.ordenacao.campo === 'preco'}
                  onCheckedChange={() => handleSortChange('preco')}
                >
                  Preço {filtros.ordenacao.campo === 'preco' && 
                    <span className="ml-2 text-xs opacity-60">
                      ({filtros.ordenacao.direcao === 'asc' ? '↑' : '↓'})
                    </span>
                  }
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filtros.ordenacao.campo === 'area'}
                  onCheckedChange={() => handleSortChange('area')}
                >
                  Área {filtros.ordenacao.campo === 'area' && 
                    <span className="ml-2 text-xs opacity-60">
                      ({filtros.ordenacao.direcao === 'asc' ? '↑' : '↓'})
                    </span>
                  }
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filtros.ordenacao.campo === 'quartos'}
                  onCheckedChange={() => handleSortChange('quartos')}
                >
                  Quantidade de quartos {filtros.ordenacao.campo === 'quartos' && 
                    <span className="ml-2 text-xs opacity-60">
                      ({filtros.ordenacao.direcao === 'asc' ? '↑' : '↓'})
                    </span>
                  }
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filtros.ordenacao.campo === 'dataAtualizacao'}
                  onCheckedChange={() => handleSortChange('dataAtualizacao')}
                >
                  Data de atualização {filtros.ordenacao.campo === 'dataAtualizacao' && 
                    <span className="ml-2 text-xs opacity-60">
                      ({filtros.ordenacao.direcao === 'asc' ? '↑' : '↓'})
                    </span>
                  }
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Status */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-10",
                  filtros.status.length > 0 && "bg-primary/10 text-primary border-primary/20"
                )}
              >
                <Tag className="mr-2 h-4 w-4" />
                <span>Status</span>
                {filtros.status.length > 0 && (
                  <Badge className="ml-2 bg-primary text-primary-foreground">
                    {filtros.status.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Status do imóvel</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {['Disponível', 'Vendido', 'Reservado', 'Em obras', 'Lançamento', 'Pronto para morar'].map(status => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={filtros.status.includes(status)}
                    onCheckedChange={() => toggleStatus(status)}
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Botão para expandir filtros */}
          <Button
            variant={isFiltersExpanded ? "default" : "outline"}
            size="sm"
            className="h-10 ml-auto"
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            <span>Filtros avançados</span>
          </Button>
        </div>
        
        {/* Mostrar filtros ativos */}
        {temFiltrosAtivos && (
          <div className="mt-3 flex flex-wrap gap-2">
            <div className="text-sm text-muted-foreground">Filtros ativos:</div>
            
            {filtros.busca && (
              <div className="flex items-center bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">
                <span>Busca: {filtros.busca}</span>
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
            
            {filtros.status.length > 0 && (
              <div className="flex items-center bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">
                <span>Status: {filtros.status.join(', ')}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 p-0" 
                  onClick={() => setFiltros({ ...filtros, status: [] })}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            {/* Exibir outros filtros ativos aqui */}
            
            {temFiltrosAtivos && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 ml-auto text-xs" 
                onClick={onResetFiltros}
              >
                Limpar todos os filtros
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Filtros avançados colapsáveis */}
      <Collapsible open={isFiltersExpanded} onOpenChange={setIsFiltersExpanded}>
        <CollapsibleContent>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Faixa de preço */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-1.5">
                <Tag className="h-4 w-4" />
                Faixa de preço
              </h4>
              <div className="px-2">
                <Slider
                  defaultValue={filtros.precoRange}
                  min={0}
                  max={precoMaximo}
                  step={50000}
                  onValueChange={(value) => 
                    setFiltros({ ...filtros, precoRange: value as [number, number] })
                  }
                  className="my-5"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <div>{formatCurrency(filtros.precoRange[0])}</div>
                  <div>{formatCurrency(filtros.precoRange[1])}</div>
                </div>
              </div>
            </div>
            
            {/* Área */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-1.5">
                <Ruler className="h-4 w-4" />
                Área
              </h4>
              <div className="px-2">
                <Slider
                  defaultValue={filtros.areaRange}
                  min={0}
                  max={areaMaxima}
                  step={5}
                  onValueChange={(value) => 
                    setFiltros({ ...filtros, areaRange: value as [number, number] })
                  }
                  className="my-5"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <div>{filtros.areaRange[0]} m²</div>
                  <div>{filtros.areaRange[1]} m²</div>
                </div>
              </div>
            </div>
            
            {/* Quartos */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-1.5">
                <BedDouble className="h-4 w-4" />
                Quartos
              </h4>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(value => (
                  <Button
                    key={`quarto-${value}`}
                    variant={filtros.quartos.includes(value) ? "default" : "outline"}
                    size="sm"
                    className="h-9 min-w-9 px-2.5"
                    onClick={() => toggleNumericFilter('quartos', value)}
                  >
                    {value}
                  </Button>
                ))}
                <Button
                  variant={filtros.quartos.includes(6) ? "default" : "outline"}
                  size="sm"
                  className="h-9 px-2.5"
                  onClick={() => toggleNumericFilter('quartos', 6)}
                >
                  6+
                </Button>
              </div>
            </div>
            
            {/* Banheiros */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-1.5">
                <Bath className="h-4 w-4" />
                Banheiros
              </h4>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(value => (
                  <Button
                    key={`banheiro-${value}`}
                    variant={filtros.banheiros.includes(value) ? "default" : "outline"}
                    size="sm"
                    className="h-9 min-w-9 px-2.5"
                    onClick={() => toggleNumericFilter('banheiros', value)}
                  >
                    {value}
                  </Button>
                ))}
                <Button
                  variant={filtros.banheiros.includes(5) ? "default" : "outline"}
                  size="sm"
                  className="h-9 px-2.5"
                  onClick={() => toggleNumericFilter('banheiros', 5)}
                >
                  5+
                </Button>
              </div>
            </div>
            
            {/* Vagas */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-1.5">
                <Car className="h-4 w-4" />
                Vagas
              </h4>
              <div className="flex gap-1">
                {[1, 2, 3].map(value => (
                  <Button
                    key={`vaga-${value}`}
                    variant={filtros.vagas.includes(value) ? "default" : "outline"}
                    size="sm"
                    className="h-9 min-w-9 px-2.5"
                    onClick={() => toggleNumericFilter('vagas', value)}
                  >
                    {value}
                  </Button>
                ))}
                <Button
                  variant={filtros.vagas.includes(4) ? "default" : "outline"}
                  size="sm"
                  className="h-9 px-2.5"
                  onClick={() => toggleNumericFilter('vagas', 4)}
                >
                  4+
                </Button>
              </div>
            </div>
            
            {/* Características */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Características
              </h4>
              <div className="flex flex-wrap gap-1">
                {caracteristicasDisponiveis.slice(0, 12).map(caracteristica => (
                  <Button
                    key={caracteristica}
                    variant={filtros.caracteristicas.includes(caracteristica) ? "default" : "outline"}
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => toggleCaracteristica(caracteristica)}
                  >
                    {caracteristica}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="px-4 pb-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Mostrando <span className="font-medium">{totalImoveisFiltrados}</span> de <span className="font-medium">{totalImoveis}</span> imóveis
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  )
}
