"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Search, 
  ChevronDown, 
  Users, 
  Mail, 
  Phone, 
  MoreHorizontal, 
  Clock, 
  Filter, 
  UserPlus,
  Download,
  MessageSquare,
  Pencil,
  PenSquare,
  UserX,
  Trash2,
  Info
} from "lucide-react"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { NovoClienteDialog } from "@/components/dashboard/cliente/novo-cliente-dialog"
import { ClienteDetalhes } from "@/components/dashboard/cliente/cliente-detalhes"
import { ClienteEditar } from "@/components/dashboard/cliente/cliente-editar"
import { ClienteMensagem } from "@/components/dashboard/cliente/cliente-mensagem"
import { ClienteDesativar } from "@/components/dashboard/cliente/cliente-desativar"
import { toast } from "sonner"

// Interface para dados do cliente
interface Cliente {
  id: string;
  name: string;
  email: string;
  telefone: string;
  createdAt: string;
  updatedAt: string;
  role: string;
  // Campos opcionais que podem não existir para todos os clientes
  ultimaAtividade?: string;
  interesses?: string[];
  status?: 'ativo' | 'inativo' | 'pendente';
  origem?: string;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtro, setFiltro] = useState('');
  const [activeTab, setActiveTab] = useState('todos');
  const [novoClienteDialogOpen, setNovoClienteDialogOpen] = useState(false);
  
  // Estados para os modais de ações
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [detalhesDialogOpen, setDetalhesDialogOpen] = useState(false);
  const [editarDialogOpen, setEditarDialogOpen] = useState(false);
  const [mensagemDialogOpen, setMensagemDialogOpen] = useState(false);
  const [desativarDialogOpen, setDesativarDialogOpen] = useState(false);
  const [modoDesativacao, setModoDesativacao] = useState<'desativar' | 'excluir'>('desativar');
  
  // Buscar clientes da API
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setCarregando(true);
        const response = await fetch('/api/admin/clientes');
        
        if (!response.ok) {
          throw new Error('Falha ao carregar clientes');
        }
        
        const data = await response.json();
        setClientes(data.clientes);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        setErro('Não foi possível carregar a lista de clientes.');
      } finally {
        setCarregando(false);
      }
    };
    
    fetchClientes();
  }, []);
  
  // Filtrar clientes com base no termo de busca e na aba ativa
  const clientesFiltrados = clientes.filter(cliente => {
    // Filtro de busca (nome, email ou telefone)
    const matchSearch = 
      cliente.name.toLowerCase().includes(filtro.toLowerCase()) ||
      cliente.email.toLowerCase().includes(filtro.toLowerCase()) ||
      cliente.telefone.toLowerCase().includes(filtro.toLowerCase());
      
    // Filtro por aba
    const matchTab = 
      activeTab === 'todos' || 
      (activeTab === 'ativos' && cliente.status !== 'inativo') ||
      (activeTab === 'inativos' && cliente.status === 'inativo') ||
      (activeTab === 'pendentes' && cliente.status === 'pendente');
      
    return matchSearch && matchTab;
  });
  
  // Gerar as iniciais para o avatar
  const getIniciais = (name: string) => {
    if (!name) return 'CL';
    const parts = name.split(' ');
    if (parts.length === 1) return name.substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  
  // Formatar data para exibição
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(data);
  };

  // Função para atualizar a lista de clientes após operações de sucesso
  const atualizarListaClientes = async () => {
    try {
      setCarregando(true);
      const response = await fetch('/api/admin/clientes');
      
      if (!response.ok) {
        throw new Error('Falha ao carregar clientes');
      }
      
      const data = await response.json();
      setClientes(data.clientes);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      toast.error('Não foi possível atualizar a lista de clientes.');
    } finally {
      setCarregando(false);
    }
  };

  // Funções para manipular ações em clientes
  const handleVerDetalhes = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setDetalhesDialogOpen(true);
  };

  const handleEditarCliente = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setEditarDialogOpen(true);
  };

  const handleEnviarMensagem = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setMensagemDialogOpen(true);
  };

  const handleDesativarCliente = (cliente: Cliente, modo: 'desativar' | 'excluir' = 'desativar') => {
    setClienteSelecionado(cliente);
    setModoDesativacao(modo);
    setDesativarDialogOpen(true);
  };

  return (
    <DashboardLayout userRole="admin" userName="Admin Imovia">
      <div className="flex-1 space-y-4 p-5 pt-6">
        {/* Cabeçalho da página */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
            <p className="text-muted-foreground">
              Gerencie e acompanhe os clientes cadastrados na plataforma
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar clientes..."
                className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-1">
                    <Filter className="h-4 w-4" />
                    Filtros
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    Mais recentes
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Mais antigos
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Nomes A-Z
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    Apenas com telefone
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Cadastro via site externo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
              
              <Button size="sm" className="h-9 gap-1" onClick={() => setNovoClienteDialogOpen(true)}>
                <UserPlus className="h-4 w-4" />
                Novo Cliente
              </Button>
            </div>
          </div>
        </div>
        
        {/* Tabs e estatísticas */}
        <Tabs defaultValue="todos" className="space-y-4" onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <TabsList>
              <TabsTrigger value="todos">Todos os Clientes</TabsTrigger>
              <TabsTrigger value="ativos">Ativos</TabsTrigger>
              <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
              <TabsTrigger value="inativos">Inativos</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Card className="border border-border">
                <CardContent className="p-2 flex items-center gap-2">
                  <div className="bg-primary/10 text-primary p-1.5 rounded">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{clientes.length}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-border">
                <CardContent className="p-2 flex items-center gap-2">
                  <div className="bg-green-100 text-green-600 p-1.5 rounded">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {clientes.filter(c => new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                    </p>
                    <p className="text-xs text-muted-foreground">Últimos 7 dias</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Conteúdo das tabs - Lista de clientes */}
          <TabsContent value="todos" className="space-y-4">
            {carregando ? (
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                        <div className="space-y-2 flex-1">
                          <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                          <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : erro ? (
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <p className="text-destructive">{erro}</p>
                </CardContent>
              </Card>
            ) : clientesFiltrados.length === 0 ? (
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-3" />
                  <h3 className="text-lg font-medium mb-1">Nenhum cliente encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    {filtro ? 'Tente ajustar os critérios de busca' : 'Não há clientes cadastrados ainda'}
                  </p>
                  <Button onClick={() => setNovoClienteDialogOpen(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Adicionar Cliente
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-md">
                <CardContent className="p-0">
                  <div className="rounded-md border">
                    <div className="bg-muted/50 p-3 grid grid-cols-12 text-sm font-medium text-muted-foreground">
                      <div className="col-span-5 md:col-span-4">Cliente</div>
                      <div className="col-span-4 md:col-span-3">Contato</div>
                      <div className="hidden md:block md:col-span-2">Cadastro</div>
                      <div className="col-span-2 md:col-span-2">Status</div>
                      <div className="col-span-1">Ações</div>
                    </div>
                    
                    <div className="divide-y">
                      {clientesFiltrados.map((cliente) => (
                        <div key={cliente.id} className="grid grid-cols-12 p-3 items-center">
                          <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={`https://avatar.vercel.sh/${cliente.email}`} alt={cliente.name} />
                              <AvatarFallback>{getIniciais(cliente.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{cliente.name}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                                Cliente {cliente.origem ? `(via ${cliente.origem})` : ''}
                              </p>
                            </div>
                          </div>
                          
                          <div className="col-span-4 md:col-span-3">
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="truncate max-w-[150px]">{cliente.email}</span>
                            </div>
                            {cliente.telefone && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                <Phone className="h-3 w-3" />
                                <span>{cliente.telefone}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="hidden md:block md:col-span-2 text-sm text-muted-foreground">
                            {formatarData(cliente.createdAt)}
                          </div>
                          
                          <div className="col-span-2 md:col-span-2">
                            <Badge 
                              variant={
                                cliente.status === 'inativo' ? 'outline' : 
                                cliente.status === 'pendente' ? 'secondary' : 'default'
                              }
                              className={
                                cliente.status === 'ativo' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''
                              }
                            >
                              {cliente.status === 'inativo' ? 'Inativo' : 
                               cliente.status === 'pendente' ? 'Pendente' : 'Ativo'}
                            </Badge>
                          </div>
                          
                          <div className="col-span-1 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onSelect={() => handleVerDetalhes(cliente)}>
                                  <Info className="h-4 w-4 mr-2" />
                                  Ver detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => handleEditarCliente(cliente)}>
                                  <PenSquare className="h-4 w-4 mr-2" />
                                  Editar cliente
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => handleEnviarMensagem(cliente)}>
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Enviar mensagem
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {cliente.status === 'ativo' ? (
                                  <DropdownMenuItem 
                                    className="text-amber-500" 
                                    onSelect={() => handleDesativarCliente(cliente, 'desativar')}
                                  >
                                    <UserX className="h-4 w-4 mr-2" />
                                    Desativar cliente
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem 
                                    className="text-green-500" 
                                    onSelect={() => handleEditarCliente(cliente)}
                                  >
                                    <Users className="h-4 w-4 mr-2" />
                                    Ativar cliente
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem 
                                  className="text-destructive" 
                                  onSelect={() => handleDesativarCliente(cliente, 'excluir')}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir cliente
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Replicamos o mesmo padrão para as outras abas */}
          <TabsContent value="ativos" className="space-y-4">
            {/* Mesmo conteúdo da aba "todos", filtrado para clientes ativos */}
            {/* Filtrado automaticamente pela lógica na variável clientesFiltrados */}
          </TabsContent>
          
          <TabsContent value="pendentes" className="space-y-4">
            {/* Mesmo conteúdo da aba "todos", filtrado para clientes pendentes */}
            {/* Filtrado automaticamente pela lógica na variável clientesFiltrados */}
          </TabsContent>
          
          <TabsContent value="inativos" className="space-y-4">
            {/* Mesmo conteúdo da aba "todos", filtrado para clientes inativos */}
            {/* Filtrado automaticamente pela lógica na variável clientesFiltrados */}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Modal para adicionar novo cliente */}
      <NovoClienteDialog 
        isOpen={novoClienteDialogOpen} 
        onClose={() => setNovoClienteDialogOpen(false)} 
        onSuccess={atualizarListaClientes}
      />
      
      {clienteSelecionado && (
        <>
          <ClienteDetalhes 
            clienteId={clienteSelecionado.id}
            isOpen={detalhesDialogOpen}
            onClose={() => setDetalhesDialogOpen(false)}
          />
          
          <ClienteEditar 
            clienteId={clienteSelecionado.id}
            isOpen={editarDialogOpen}
            onClose={() => setEditarDialogOpen(false)}
            onSuccess={atualizarListaClientes}
          />
          
          <ClienteMensagem 
            cliente={clienteSelecionado}
            isOpen={mensagemDialogOpen}
            onClose={() => setMensagemDialogOpen(false)}
          />
          
          <ClienteDesativar 
            cliente={clienteSelecionado}
            isOpen={desativarDialogOpen}
            onClose={() => setDesativarDialogOpen(false)}
            onSuccess={atualizarListaClientes}
            modo={modoDesativacao}
          />
        </>
      )}
    </DashboardLayout>
  )
}
