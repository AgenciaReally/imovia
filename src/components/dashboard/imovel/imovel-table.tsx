"use client"

import { ImovelDisplay } from "@/services/imovel-service"
import { formatCurrency } from "@/lib/utils"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { 
  Bed, 
  Bath, 
  Car, 
  MapPin, 
  Building,
  ArrowUpDown, 
  MoreHorizontal 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Componente para exibir a tabela de imóveis
export function ImovelTable({ imoveis }: { imoveis: ImovelDisplay[] }) {
  // Definição das colunas da tabela
  const columns: ColumnDef<ImovelDisplay>[] = [
    // Coluna de imagem
    {
      accessorKey: "imagens",
      header: "Imagem",
      cell: ({ row }) => {
        const imagens = row.getValue("imagens") as string[]
        const imagemUrl = imagens && imagens.length > 0 ? imagens[0] : `https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=100&h=100&fit=crop&q=80`
        
        return (
          <div className="w-16 h-16 relative rounded-md overflow-hidden">
            <Image
              src={imagemUrl}
              alt={row.getValue("titulo")}
              fill
              className="object-cover"
            />
          </div>
        )
      },
    },
    // Coluna de título
    {
      accessorKey: "titulo",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Imóvel
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const titulo = row.getValue("titulo") as string
        const status = row.getValue("status") as string
        
        // Indicadores de status com cores
        const statusColors: Record<string, string> = {
          'Disponível': 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800',
          'Vendido': 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800',
          'Reservado': 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800',
          'Em obras': 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800',
          'Lançamento': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
          'Pronto para morar': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
        }
        
        const statusColor = statusColors[status] || 'bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800'
        
        return (
          <div className="flex flex-col">
            <div className="font-medium">{titulo}</div>
            <Badge variant="outline" className={`mt-1 text-xs px-2 py-0.5 border ${statusColor}`}>
              {status}
            </Badge>
          </div>
        )
      },
    },
    // Coluna de preço
    {
      accessorKey: "preco",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Preço
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const preco = parseFloat(row.getValue("preco"))
        
        return (
          <div className="font-medium">
            {formatCurrency(preco)}
          </div>
        )
      },
    },
    // Coluna de características
    {
      id: "caracteristicas",
      header: "Características",
      cell: ({ row }) => {
        const quartos = row.original.quartos
        const banheiros = row.original.banheiros
        const vagas = row.original.vagas
        const area = row.original.area
        
        return (
          <div className="flex space-x-4">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm">{quartos}</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm">{banheiros}</span>
            </div>
            <div className="flex items-center">
              <Car className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm">{vagas}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm">{area}m²</span>
            </div>
          </div>
        )
      },
    },
    // Coluna de localização
    {
      accessorKey: "bairro",
      header: "Localização",
      cell: ({ row }) => {
        const bairro = row.getValue("bairro") as string
        const cidade = row.original.cidade
        
        return (
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-1 mt-0.5 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">{bairro}</div>
              <div className="text-xs text-muted-foreground">{cidade}</div>
            </div>
          </div>
        )
      },
    },
    // Coluna de construtora
    {
      accessorKey: "construtora",
      header: "Construtora",
      cell: ({ row }) => {
        const construtora = row.getValue("construtora") as string
        
        return (
          <div className="flex items-center">
            <Building className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-sm">{construtora}</span>
          </div>
        )
      },
    },
    // Coluna de ações
    {
      id: "actions",
      cell: ({ row }) => {
        const imovel = row.original
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(imovel.id)}>
                Copiar ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
              <DropdownMenuItem>Editar imóvel</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
  
  return (
    <DataTable 
      columns={columns} 
      data={imoveis} 
      pageSize={15}
      showSearch={true}
      searchColumn="titulo"
    />
  )
}
