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

// Dados mockados
const IMOVEIS_DADOS = [
  {
    id: "im1",
    titulo: "Apartamento Premium Zona Norte",
    visualizacoes: 2840,
    cliques: 682,
    tempo: 185, // segundos
    ctr: 24.01,
    variacao: 12.5,
  },
  {
    id: "im2",
    titulo: "Casa em Condomínio Fechado",
    visualizacoes: 2350,
    cliques: 597,
    tempo: 205,
    ctr: 25.40,
    variacao: 8.3,
  },
  {
    id: "im3",
    titulo: "Studio Moderno Centro",
    visualizacoes: 1920,
    cliques: 435,
    tempo: 160,
    ctr: 22.66,
    variacao: -3.2,
  },
  {
    id: "im4",
    titulo: "Cobertura Duplex Jardins",
    visualizacoes: 1840,
    cliques: 520,
    tempo: 240,
    ctr: 28.26,
    variacao: 15.7,
  },
  {
    id: "im5",
    titulo: "Apartamento Vista Parque",
    visualizacoes: 1780,
    cliques: 490,
    tempo: 215,
    ctr: 27.53,
    variacao: 9.8,
  },
  {
    id: "im6",
    titulo: "Casa Térrea",
    visualizacoes: 1650,
    cliques: 380,
    tempo: 170,
    ctr: 23.03,
    variacao: -1.5,
  },
  {
    id: "im7",
    titulo: "Loft Industrial",
    visualizacoes: 1580,
    cliques: 420,
    tempo: 195,
    ctr: 26.58,
    variacao: 7.2,
  },
  {
    id: "im8",
    titulo: "Kitnet Universitária",
    visualizacoes: 1540,
    cliques: 350,
    tempo: 145,
    ctr: 22.73,
    variacao: -5.8,
  },
  {
    id: "im9",
    titulo: "Sobrado Estilo Americano",
    visualizacoes: 1490,
    cliques: 365,
    tempo: 175,
    ctr: 24.50,
    variacao: 2.1,
  },
  {
    id: "im10",
    titulo: "Apartamento Alto Padrão",
    visualizacoes: 1430,
    cliques: 395,
    tempo: 220,
    ctr: 27.62,
    variacao: 10.5,
  },
];

interface TabelaImoveisProps {
  titulo?: string;
  descricao?: string;
  itensPorPagina?: number;
}

type OrdenacaoTipo = "visualizacoes" | "cliques" | "tempo" | "ctr" | "nome";
type DirecaoOrdenacao = "asc" | "desc";

export function TabelaImoveis({
  titulo = "Imóveis Mais Populares",
  descricao = "Lista dos imóveis mais visualizados e com mais interações",
  itensPorPagina = 5
}: TabelaImoveisProps) {
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const [ordenarPor, setOrdenarPor] = useState<OrdenacaoTipo>("visualizacoes");
  const [direcao, setDirecao] = useState<DirecaoOrdenacao>("desc");
  
  // Filtragem e ordenação
  const imoveisFiltrados = IMOVEIS_DADOS
    .filter(imovel => 
      imovel.titulo.toLowerCase().includes(busca.toLowerCase())
    )
    .sort((a, b) => {
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
                imoveisPaginados.map((imovel) => (
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
