"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  Search,
  Download,
  MessageSquare,
  Home,
  Mail,
  Calendar,
  BarChart3,
  Filter
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ModalRespostasCliente } from "@/components/admin/ModalRespostasCliente";
import { ModalImoveisCliente } from "@/components/admin/ModalImoveisCliente";
import { toast } from "@/components/ui/use-toast";

// Tipos de dados
interface Cliente {
  id: string;
  name?: string;
  email: string;
  totalRespostas: number;
  ultimaResposta: string;
  imoveisSugeridos: number;
  status: 'completo' | 'parcial' | 'inicio';
}

interface Estatisticas {
  totalClientes: number;
  totalRespostas: number;
  clientesCompletos: number;
  clientesParciais: number;
  mediaRespostasPorCliente: number;
  imoveisSugeridos: number;
}

export default function RespostasAdminNova() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Estados de filtros
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  
  // Estados dos modais
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [modalRespostasAberto, setModalRespostasAberto] = useState(false);
  const [modalImoveisAberto, setModalImoveisAberto] = useState(false);

  // Carregar dados dos clientes
  useEffect(() => {
    const carregarClientes = async () => {
      try {
        setLoading(true);
        
        // Mock data por enquanto
        const mockClientes: Cliente[] = [
          {
            id: "1",
            name: "João Silva",
            email: "joao@exemplo.com",
            totalRespostas: 15,
            ultimaResposta: "2024-01-20T10:30:00Z",
            imoveisSugeridos: 3,
            status: "completo"
          },
          {
            id: "2",
            name: "Maria Santos",
            email: "maria@exemplo.com",
            totalRespostas: 8,
            ultimaResposta: "2024-01-19T14:20:00Z",
            imoveisSugeridos: 2,
            status: "parcial"
          },
          {
            id: "3",
            email: "pedro@exemplo.com",
            totalRespostas: 3,
            ultimaResposta: "2024-01-18T09:15:00Z",
            imoveisSugeridos: 0,
            status: "inicio"
          }
        ];

        const mockEstatisticas: Estatisticas = {
          totalClientes: 3,
          totalRespostas: 26,
          clientesCompletos: 1,
          clientesParciais: 1,
          mediaRespostasPorCliente: 8.7,
          imoveisSugeridos: 5
        };

        setClientes(mockClientes);
        setClientesFiltrados(mockClientes);
        setEstatisticas(mockEstatisticas);
      } catch (error) {
        console.error("Erro:", error);
        toast({
          title: "Erro",
          description: "Erro ao carregar dados dos clientes",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    carregarClientes();
  }, []);
  
  // Filtrar clientes
  useEffect(() => {
    let resultado = [...clientes];
    
    // Aplicar filtro de busca
    if (busca) {
      const termoBusca = busca.toLowerCase();
      resultado = resultado.filter(cliente => 
        cliente.email.toLowerCase().includes(termoBusca) ||
        cliente.name?.toLowerCase().includes(termoBusca)
      );
    }
    
    // Aplicar filtro de status
    if (filtroStatus !== "todos") {
      resultado = resultado.filter(cliente => cliente.status === filtroStatus);
    }
    
    setClientesFiltrados(resultado);
  }, [clientes, busca, filtroStatus]);
  
  // Funções dos modais
  const abrirModalRespostas = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setModalRespostasAberto(true);
  };
  
  const abrirModalImoveis = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setModalImoveisAberto(true);
  };
  
  const exportarCSV = () => {
    let csv = "Nome,Email,Total Respostas,Imóveis Sugeridos,Status,Última Resposta\n";
    
    clientesFiltrados.forEach(cliente => {
      const linha = [
        cliente.name || "N/A",
        cliente.email,
        cliente.totalRespostas.toString(),
        cliente.imoveisSugeridos.toString(),
        cliente.status,
        new Date(cliente.ultimaResposta).toLocaleDateString("pt-BR")
      ].join(",");
      
      csv += linha + "\n";
    });
    
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `clientes-imovia-${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completo':
        return <Badge className="bg-green-100 text-green-800">Completo</Badge>;
      case 'parcial':
        return <Badge variant="secondary">Parcial</Badge>;
      default:
        return <Badge variant="outline">Iniciou</Badge>;
    }
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    }
    return email?.slice(0, 2).toUpperCase() || 'CL';
  };

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
            <h1 className="text-2xl font-bold tracking-tight">Painel de Clientes</h1>
            <p className="text-muted-foreground">
              Visualize clientes, suas respostas e imóveis sugeridos
            </p>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportarCSV}
            disabled={clientesFiltrados.length === 0}
          >
            <Download className="mr-2 h-3.5 w-3.5" />
            Exportar CSV
          </Button>
        </div>
        
        {/* Cards de estatísticas */}
        {estatisticas && (
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
                    Total de Clientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{estatisticas.totalClientes}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {estatisticas.clientesCompletos} completos / {estatisticas.clientesParciais} parciais
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5 text-muted-foreground" />
                    Respostas Totais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{estatisticas.totalRespostas}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Média de {estatisticas.mediaRespostasPorCliente.toFixed(1)} por cliente
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Home className="mr-2 h-5 w-5 text-muted-foreground" />
                    Imóveis Sugeridos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{estatisticas.imoveisSugeridos}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Total de imóveis recomendados
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                    Taxa de Conversão
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {Math.round((estatisticas.clientesCompletos / estatisticas.totalClientes) * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Clientes que completaram o fluxo
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
        
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Buscar por nome ou email..." 
                className="pl-8 w-full sm:w-[350px]"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>
          
          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <span>Status</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="completo">Completo</SelectItem>
              <SelectItem value="parcial">Parcial</SelectItem>
              <SelectItem value="inicio">Iniciou</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center ml-auto">
            {clientesFiltrados.length > 0 && (
              <Badge variant="outline" className="ml-auto mr-2">
                {clientesFiltrados.length} {clientesFiltrados.length === 1 ? 'cliente' : 'clientes'}
              </Badge>
            )}
          </div>
        </div>
        
        {/* Lista de clientes */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[220px] rounded-xl" />
            ))}
          </div>
        ) : clientesFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum cliente encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou aguarde novos clientes.
            </p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.05 }
              },
              hidden: {}
            }}
          >
            {clientesFiltrados.map((cliente) => (
              <motion.div
                key={cliente.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {getInitials(cliente.name, cliente.email)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-1">
                          {cliente.name || "Cliente"}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span className="line-clamp-1">{cliente.email}</span>
                        </div>
                        <div className="mt-2">
                          {getStatusBadge(cliente.status)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Estatísticas do cliente */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{cliente.totalRespostas}</span>
                        <span className="text-muted-foreground">respostas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-green-500" />
                        <span className="font-medium">{cliente.imoveisSugeridos}</span>
                        <span className="text-muted-foreground">imóveis</span>
                      </div>
                    </div>

                    {/* Última atividade */}
                    <div className="text-xs text-muted-foreground border-t pt-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Última resposta: {new Date(cliente.ultimaResposta).toLocaleDateString("pt-BR")}</span>
                      </div>
                    </div>

                    {/* Botões de ação */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => abrirModalRespostas(cliente)}
                        className="gap-1"
                      >
                        <MessageSquare className="h-3 w-3" />
                        Respostas
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => abrirModalImoveis(cliente)}
                        className="gap-1"
                        disabled={cliente.imoveisSugeridos === 0}
                      >
                        <Home className="h-3 w-3" />
                        Imóveis
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Modais */}
      <ModalRespostasCliente
        cliente={clienteSelecionado}
        open={modalRespostasAberto}
        onOpenChange={setModalRespostasAberto}
      />

      <ModalImoveisCliente
        cliente={clienteSelecionado}
        open={modalImoveisAberto}
        onOpenChange={setModalImoveisAberto}
      />
    </DashboardLayout>
  );
}
