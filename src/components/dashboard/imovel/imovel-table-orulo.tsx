"use client"

import { useState } from "react"
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { OruloBuilding } from "@/app/api/orulo/route"
import { formatCurrency } from "@/lib/formatters"

interface ImovelTableOruloProps {
  imoveis: OruloBuilding[]
}

export function ImovelTableOrulo({ imoveis }: ImovelTableOruloProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  
  // Definição das colunas
  const columns: ColumnDef<OruloBuilding>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Selecionar todos"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Selecionar linha"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Nome
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const name = row.getValue("name") as string
        return (
          <div className="flex items-center gap-2">
            <div className="font-medium max-w-[180px] truncate">{name}</div>
            {row.original.orulo_url && (
              <a 
                href={row.original.orulo_url} 
                target="_blank" 
                rel="noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        )
      }
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status || "Disponível"
        
        let statusVariant = "default"
        if (status.toLowerCase().includes("lançamento")) {
          statusVariant = "destructive"
        } else if (status.toLowerCase().includes("pronto")) {
          statusVariant = "success"
        } else if (status.toLowerCase().includes("obra")) {
          statusVariant = "warning"
        }
        
        return (
          <Badge variant={statusVariant as any}>
            {status}
          </Badge>
        )
      }
    },
    {
      id: "endereco",
      header: "Localização",
      cell: ({ row }) => {
        const endereco = typeof row.original.address === 'string' 
          ? row.original.address 
          : row.original.address 
            ? `${row.original.address.neighborhood}, ${row.original.address.city}`
            : `${row.original.neighborhood || ''}, ${row.original.city || ''}`
        
        return <div className="max-w-[200px] truncate">{endereco}</div>
      }
    },
    {
      id: "preco",
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
        const min_price = row.original.price_from || row.original.min_price || 0
        const max_price = row.original.price_to || 0
        
        if (min_price && max_price && min_price !== max_price) {
          return (
            <div>
              <div>{formatCurrency(min_price)}</div>
              <div className="text-xs text-muted-foreground">até {formatCurrency(max_price)}</div>
            </div>
          )
        }
        
        return min_price ? formatCurrency(min_price) : "Consulte"
      },
      sortingFn: (rowA, rowB) => {
        const priceA = rowA.original.price_from || rowA.original.min_price || 0
        const priceB = rowB.original.price_from || rowB.original.min_price || 0
        return priceA - priceB
      }
    },
    {
      accessorKey: "developer",
      header: "Construtora",
      cell: ({ row }) => {
        const developer = row.original.developer
        return developer ? developer.name : "N/A"
      }
    },
    {
      id: "caracteristicas",
      header: "Características",
      cell: ({ row }) => {
        const quartos = row.original.min_bedrooms || row.original.max_bedrooms || 0
        const banheiros = row.original.min_bathrooms || row.original.max_bathrooms || 0
        const vagas = row.original.min_parking || row.original.max_parking || 0
        const area = row.original.min_area || row.original.max_area || 0
        
        return (
          <div className="text-sm">
            <span className="text-muted-foreground">{quartos}</span> quarto(s), 
            <span className="text-muted-foreground"> {banheiros}</span> banh(s), 
            <span className="text-muted-foreground"> {vagas}</span> vaga(s), 
            <span className="text-muted-foreground"> {area}m²</span>
          </div>
        )
      }
    },
    {
      id: "acoes",
      header: "Ações",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-2 text-xs"
              onClick={() => window.open(`/painel/admin/imoveis/${row.original.id}`, "_blank")}
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              Detalhes
            </Button>
          </div>
        )
      }
    }
  ]
  
  const table = useReactTable({
    data: imoveis,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    }
  })
  
  return (
    <div className="rounded-md border">
      <div className="flex items-center py-4 px-4 border-b">
        <div className="flex-1">
          <h3 className="text-sm font-medium">
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} linha(s) selecionada(s)
          </h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto h-8">
              Colunas <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id === "endereco" 
                      ? "Localização" 
                      : column.id === "caracteristicas" 
                        ? "Características" 
                        : column.id === "preco" 
                          ? "Preço" 
                          : column.id === "acoes"
                            ? "Ações"
                            : column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Nenhum resultado encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 p-4 border-t">
        <div className="flex-1 text-sm text-muted-foreground">
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próxima
        </Button>
      </div>
    </div>
  )
}
