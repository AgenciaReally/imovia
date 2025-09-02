"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  ArrowUpDown, 
  ChevronDown, 
  ChevronUp,
  BarChart2, 
  ArrowUpRight, 
  Home 
} from "lucide-react";

interface ImovelDados {
  id: string;
  titulo: string;
  visualizacoes: number;
  cliques: number;
  tempo: number; // segundos
  ctr: number;
  variacao: number;
}

interface TabelaImoveisProps {
  dados?: ImovelDados[];
  titulo?: string;
  descricao?: string;
  itensPorPagina?: number;
}

type OrdenacaoTipo = "visualizacoes" | "cliques" | "tempo" | "ctr" | "nome";
type DirecaoOrdenacao = "asc" | "desc";

export function TabelaImoveis({
  dados = [],
  titulo = "Imóveis Mais Populares",
  descricao = "Lista dos imóveis mais visualizados e com mais interações",
  itensPorPagina = 5
}: TabelaImoveisProps) {
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const [ordenarPor, setOrdenarPor] = useState<OrdenacaoTipo>("visualizacoes");
  const [direcao, setDirecao] = useState<DirecaoOrdenacao>("desc");
  
  // Filtragem e ordenação
  const imoveisFiltrados = dados
    .filter((imovel: ImovelDados) => 
      imovel.titulo.toLowerCase().includes(busca.toLowerCase())
    )
    .sort((a: ImovelDados, b: ImovelDados) => {
      if (ordenarPor === "nome") {
        return direcao === "asc" 
          ? a.titulo.localeCompare(b.titulo) 
          : b.titulo.localeCompare(a.titulo);
      }
      
      // Ordenação numérica para outros campos
      const valorA = a[ordenarPor];
      const valorB = b[ordenarPor];
      
      return direcao === "asc" 
        ? Number(valorA) - Number(valorB) 
        : Number(valorB) - Number(valorA);
    });
  
  // Paginação
  const totalImoveisFiltrados = imoveisFiltrados.length;
  const totalPaginas = Math.ceil(totalImoveisFiltrados / itensPorPagina);
  const imoveisPaginados = imoveisFiltrados.slice(
    (pagina - 1) * itensPorPagina,
    pagina * itensPorPagina
  );
  
  // Função para alterar ordenação
  const alterarOrdenacao = (campo: OrdenacaoTipo) => {
    if (ordenarPor === campo) {
      setDirecao(direcao === "asc" ? "desc" : "asc");
    } else {
      setOrdenarPor(campo);
      setDirecao("desc"); // Nova coluna sempre começa com DESC
    }
  };
  
  // Formatar tempo
  const formatarTempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segsRestantes = segundos % 60;
    return `${minutos}m ${segsRestantes}s`;
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{titulo}</CardTitle>
            <CardDescription>{descricao}</CardDescription>
          </div>
          <div className="relative mt-2 sm:mt-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Buscar imóvel..." 
              className="pl-8 w-full sm:w-auto"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">
                  <button 
                    className="flex items-center gap-1 font-medium"
                    onClick={() => alterarOrdenacao("nome")}
                  >
                    Imóvel
                    {ordenarPor === "nome" && (
                      direcao === "asc" 
                        ? <ChevronUp className="h-3 w-3" /> 
                        : <ChevronDown className="h-3 w-3" />
                    )}
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    className="flex items-center gap-1 font-medium"
                    onClick={() => alterarOrdenacao("visualizacoes")}
                  >
                    Visualizações
                    {ordenarPor === "visualizacoes" && (
                      direcao === "asc" 
                        ? <ChevronUp className="h-3 w-3" /> 
                        : <ChevronDown className="h-3 w-3" />
                    )}
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    className="flex items-center gap-1 font-medium"
                    onClick={() => alterarOrdenacao("cliques")}
                  >
                    Cliques
                    {ordenarPor === "cliques" && (
                      direcao === "asc" 
                        ? <ChevronUp className="h-3 w-3" /> 
                        : <ChevronDown className="h-3 w-3" />
                    )}
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    className="flex items-center gap-1 font-medium"
                    onClick={() => alterarOrdenacao("ctr")}
                  >
                    CTR
                    {ordenarPor === "ctr" && (
                      direcao === "asc" 
                        ? <ChevronUp className="h-3 w-3" /> 
                        : <ChevronDown className="h-3 w-3" />
                    )}
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    className="flex items-center gap-1 font-medium"
                    onClick={() => alterarOrdenacao("tempo")}
                  >
                    Tempo médio
                    {ordenarPor === "tempo" && (
                      direcao === "asc" 
                        ? <ChevronUp className="h-3 w-3" /> 
                        : <ChevronDown className="h-3 w-3" />
                    )}
                  </button>
                </TableHead>
                <TableHead>Variação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {imoveisPaginados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Nenhum imóvel encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                imoveisPaginados.map((imovel: ImovelDados) => (
                  <TableRow key={imovel.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-primary/10 rounded-full">
                          <Home className="h-5 w-5 text-primary" />
                        </div>
                        <span className="line-clamp-1">
                          {imovel.titulo}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {imovel.visualizacoes.toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      {imovel.cliques.toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {imovel.ctr.toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatarTempo(imovel.tempo)}
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center text-sm ${imovel.variacao >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {imovel.variacao >= 0 ? (
                          <ArrowUpRight className="mr-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="mr-1 h-4 w-4" />
                        )}
                        <span>{Math.abs(imovel.variacao)}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Paginação */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Mostrando <span className="font-medium">{(pagina - 1) * itensPorPagina + 1}</span> a <span className="font-medium">{Math.min(pagina * itensPorPagina, totalImoveisFiltrados)}</span> de <span className="font-medium">{totalImoveisFiltrados}</span> imóveis
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagina(Math.max(1, pagina - 1))}
                disabled={pagina === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagina(Math.min(totalPaginas, pagina + 1))}
                disabled={pagina === totalPaginas}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
