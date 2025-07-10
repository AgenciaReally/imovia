"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  BarChart4,
  PieChart,
  Calendar,
  Search,
  Download,
  Filter,
  CheckCircle2,
  UserCircle2
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DetalhesUsuario } from "@/components/dashboard/respostas/detalhes-usuario";
import { UsuariosAgrupados } from "@/components/dashboard/respostas/usuarios-agrupados";

// Tipos para as respostas
interface Resposta {
  id: string;
  userId: string;
  perguntaId: string;
  pergunta?: {
    texto: string;
    categoria: string;
    tipo?: string;
  };
  usuario?: {
    email: string;
    name?: string;
  };
  valor: string;
  resposta?: string; // Campo alternativo que pode estar presente em algumas respostas
  createdAt: string;
  updatedAt: string;
}

interface Metricas {
  total: number;
  naDiaria: number[];
  naSemanal: number[];
  porCategoria: Record<string, number>;
  usuariosCompletos: number;
  usuariosParciais: number;
  taxaDeConversao: number;
}

export default function RespostasAdmin() {
  // Estados principais
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [filtradas, setFiltradas] = useState<Resposta[]>([]);
  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  // Estados de filtros e paginação
  const [busca, setBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todas");
  const [filtroPeriodo, setFiltroPeriodo] = useState<string>("30d");
  const [tabAtiva, setTabAtiva] = useState("usuarios");
  
  // Estados para detalhes de usuário
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<string | null>(null);
  const [respostasUsuario, setRespostasUsuario] = useState<Resposta[]>([]);
  const [carregandoDetalhes, setCarregandoDetalhes] = useState(false);

  // Buscar respostas da API
  useEffect(() => {
    const buscarRespostas = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/respostas");
        
        if (!res.ok) {
          throw new Error("Erro ao buscar respostas");
        }
        
        const data = await res.json();
        setRespostas(data.respostas);
        setFiltradas(data.respostas);
        setMetricas(data.metricas);
      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setLoading(false);
      }
    };
    
    buscarRespostas();
  }, []);
  
  // Filtrar respostas
  useEffect(() => {
    let resultado = [...respostas];
    
    // Aplicar filtro de busca
    if (busca) {
      const termoBusca = busca.toLowerCase();
      resultado = resultado.filter(resp => 
        resp.valor.toLowerCase().includes(termoBusca) ||
        resp.pergunta?.texto.toLowerCase().includes(termoBusca) ||
        resp.usuario?.email?.toLowerCase().includes(termoBusca) ||
        resp.usuario?.name?.toLowerCase().includes(termoBusca)
      );
    }
    
    // Aplicar filtro de categoria
    if (filtroCategoria !== "todas") {
      resultado = resultado.filter(resp => 
        resp.pergunta?.categoria === filtroCategoria
      );
    }
    
    // Aplicar filtro de período
    const hoje = new Date();
    let dataLimite = new Date();
    
    switch (filtroPeriodo) {
      case "7d":
        dataLimite.setDate(hoje.getDate() - 7);
        break;
      case "30d":
        dataLimite.setDate(hoje.getDate() - 30);
        break;
      case "90d":
        dataLimite.setDate(hoje.getDate() - 90);
        break;
      case "365d":
        dataLimite.setDate(hoje.getDate() - 365);
        break;
      default:
        // "todos" - não filtra
        break;
    }
    
    if (filtroPeriodo !== "todos") {
      resultado = resultado.filter(resp => 
        new Date(resp.createdAt) >= dataLimite
      );
    }
    
    setFiltradas(resultado);
  }, [respostas, busca, filtroCategoria, filtroPeriodo]);
  
  // Buscar detalhes de um usuário específico
  const buscarDetalhesUsuario = async (userId: string) => {
    setCarregandoDetalhes(true);
    setUsuarioSelecionado(userId);
    
    try {
      const res = await fetch(`/api/admin/respostas/usuario/${userId}`);
      
      if (!res.ok) {
        throw new Error("Erro ao buscar detalhes do usuário");
      }
      
      const data = await res.json();
      setRespostasUsuario(data.respostas);
      setTabAtiva("detalhes");
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setCarregandoDetalhes(false);
    }
  };
  
  // Voltar para a lista de usuários
  const voltarParaLista = () => {
    setTabAtiva("usuarios");
    setUsuarioSelecionado(null);
    setRespostasUsuario([]);
  };
  
  // Exportar para CSV
  const exportarCSV = () => {
    // Cabeçalho do CSV
    let csv = "ID,Usuário,Pergunta,Categoria,Resposta,Data\n";
    
    // Linhas de dados
    filtradas.forEach(r => {
      const linha = [
        r.id,
        r.usuario?.email || "N/A",
        r.pergunta?.texto?.replace(/,/g, ";") || "N/A",
        r.pergunta?.categoria || "N/A",
        r.valor.replace(/,/g, ";"),
        new Date(r.createdAt).toLocaleDateString("pt-BR")
      ].join(",");
      
      csv += linha + "\n";
    });
    
    // Criar blob e link para download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `respostas-imovia-${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();
  };
  
  // Renderização das categorias disponíveis
  const categorias = [...new Set(respostas.map(r => r.pergunta?.categoria).filter(Boolean))];
  
  // Garantir renderização apenas no cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return null;
  }

  return (
    <DashboardLayout userRole="admin" userName="Admin Imovia">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Cabeçalho da página */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Painel de Respostas</h1>
            <p className="text-muted-foreground">
              Visualize, analise e exporte as respostas dos usuários ao questionário Imovia
            </p>
          </div>
          
          {tabAtiva === "usuarios" && (
            <div className="flex flex-wrap gap-2">
              <Select value={filtroPeriodo} onValueChange={setFiltroPeriodo}>
                <SelectTrigger className="w-[150px] h-8">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Período</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  <SelectItem value="90d">Últimos 90 dias</SelectItem>
                  <SelectItem value="365d">Último ano</SelectItem>
                  <SelectItem value="todos">Todo o período</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8"
                onClick={exportarCSV}
                disabled={filtradas.length === 0}
              >
                <Download className="mr-2 h-3.5 w-3.5" />
                Exportar CSV
              </Button>
            </div>
          )}
          
          {tabAtiva === "detalhes" && (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8"
              onClick={voltarParaLista}
            >
              <UserCircle2 className="mr-2 h-3.5 w-3.5" />
              Voltar para a lista
            </Button>
          )}
        </div>
        
        {/* Cards de métricas */}
        {metricas && tabAtiva === "usuarios" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                    Total de Usuários
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {metricas.usuariosCompletos + metricas.usuariosParciais}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {metricas.usuariosCompletos} completos / {metricas.usuariosParciais} parciais
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BarChart4 className="mr-2 h-5 w-5 text-muted-foreground" />
                    Respostas Totais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {metricas.total}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Média de {Math.round(metricas.total / (metricas.usuariosCompletos + metricas.usuariosParciais))} por usuário
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <PieChart className="mr-2 h-5 w-5 text-muted-foreground" />
                    Taxa de Conversão
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {Math.round(metricas.taxaDeConversao * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {metricas.usuariosCompletos} usuários completaram todo o fluxo
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                    Tendência
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {metricas.naDiaria.length > 0 
                      ? `+${metricas.naDiaria[metricas.naDiaria.length - 1]}` 
                      : "0"}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Respostas nas últimas 24 horas
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
        
        {/* Filtros para a lista de respostas */}
        {tabAtiva === "usuarios" && (
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Buscar por usuário ou resposta..." 
                  className="pl-8 w-full sm:w-[350px]"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
            </div>
            
            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Categoria</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                {categorias.map(cat => (
                  <SelectItem key={cat} value={cat as string}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center ml-auto">
              {filtradas.length > 0 && (
                <Badge 
                  variant="outline" 
                  className="ml-auto mr-2"
                >
                  {filtradas.length} {filtradas.length === 1 ? 'resposta' : 'respostas'}
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {/* Conteúdo principal */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-primary rounded-full border-t-transparent" />
            <p className="mt-4 text-muted-foreground">Carregando dados...</p>
          </div>
        ) : tabAtiva === "usuarios" ? (
          // Visualização da lista de usuários
          <UsuariosAgrupados 
            respostas={filtradas}
            onVerDetalhes={buscarDetalhesUsuario}
          />
        ) : tabAtiva === "detalhes" && usuarioSelecionado ? (
          // Visualização detalhada de um usuário
          carregandoDetalhes ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-primary rounded-full border-t-transparent" />
              <p className="mt-4 text-muted-foreground">Carregando detalhes do usuário...</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <DetalhesUsuario 
                userId={usuarioSelecionado}
                respostas={respostasUsuario}
                onClose={voltarParaLista}
              />
            </motion.div>
          )
        ) : null}
      </motion.div>
    </DashboardLayout>
  );
}
