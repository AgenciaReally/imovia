"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts"
import { 
  ArrowUp, 
  ArrowDown, 
  Building, 
  Home, 
  Users, 
  TrendingUp,
  AlertCircle,
  Activity,
  Eye,
  MousePointer,
  CheckCircle2,
  MessageSquare,
  Settings
} from "lucide-react"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

// Interface para dados da API
interface DashboardData {
  metricas: {
    totalUsuarios: number;
    totalImoveis: number;
    totalConstrutoras: number;
    totalRespostas: number;
    taxaConversao: string;
    taxaCliques: string;
    crescimento: {
      visualizacoes: string;
      cliques: string;
      conversoes: string;
    };
  };
  graficos: {
    atividadeRecenteMeses: Array<{
      name: string;
      visualizacoes: number;
      cliques: number;
      matches: number;
    }>;
    estatisticasTiposImoveis: Array<{
      name: string;
      valor: number;
    }>;
    estatisticasConstrutoras: Array<{
      name: string;
      value: number;
      color: string;
    }>;
  };
  listas: {
    ultimosImoveisVisualizados: Array<any>;
    perguntasRecentes: Array<any>;
    respostasRecentes: Array<any>;
    estatisticasCategorias: Array<any>;
  };
}

// Componente para métricas
interface MetricCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: React.ReactNode
  change?: string
  changeType?: 'increase' | 'decrease'
}

const MetricCard = ({ title, value, subtitle, icon, change, changeType }: MetricCardProps) => {
  return (
    <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-2 pt-4 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${changeType === 'increase' ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-sm text-gray-500 mt-1 flex items-center">
          {subtitle}
          {change && (
            <span className={`ml-2 flex items-center text-xs font-medium ${changeType === 'increase' ? 'text-green-600' : 'text-amber-600'}`}>
              {changeType === 'increase' ? (
                <ArrowUp className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDown className="mr-1 h-3 w-3" />
              )}
              {change}
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  )
}

export default function AdminDashboard() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);
  const [dados, setDados] = useState<DashboardData | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Buscar dados da API
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true);
        const resposta = await fetch('/api/admin/dashboard');
        
        if (!resposta.ok) {
          throw new Error('Erro ao buscar dados do dashboard');
        }
        
        const { data } = await resposta.json();
        setDados(data);
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        setErro('Não foi possível carregar as estatísticas. Tente novamente mais tarde.');
      } finally {
        setCarregando(false);
      }
    };
    
    carregarDados();
  }, []);

  // Evitar erro de hidratação
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <DashboardLayout userRole="admin" userName="Admin Imovia">
      <div className="flex-1 space-y-6 p-5 pt-6">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard Admin</h1>
            <p className="text-muted-foreground">
              Gerencie e monitore a plataforma Imovia
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 gap-1" 
              onClick={() => router.push('/painel/admin/relatorios')}
            >
              <Activity className="h-4 w-4" />
              Relatórios
            </Button>
            <Button 
              size="sm" 
              className="h-9 gap-1"
              onClick={() => router.push('/painel/admin/configuracoes')}
            >
              <Settings className="h-4 w-4" />
              Configurações
            </Button>
          </div>
        </div>
        
        {/* Cartões de métricas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {carregando ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden border-0 shadow-md">
                  <CardHeader className="pb-2 pt-4">
                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 w-16 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : erro ? (
            <Card className="border-0 shadow-md">
              <CardContent className="p-6 flex items-center">
                <AlertCircle className="h-5 w-5 text-destructive mr-2" />
                <p>{erro}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Usuários Ativos"
                value={dados?.metricas.totalUsuarios || 0}
                subtitle="Total de usuários"
                icon={<Users className="h-5 w-5" />}
                change={dados?.metricas.crescimento.conversoes || '0%'}
                changeType="increase"
              />
              
              <MetricCard
                title="Imóveis Vinculados"
                value={dados?.metricas.totalImoveis || 0}
                subtitle="Imóveis gerenciados"
                icon={<Home className="h-5 w-5" />}
                change={dados?.metricas.crescimento.visualizacoes || '0%'}
                changeType="increase"
              />
              
              <MetricCard
                title="Construtoras"
                value={dados?.metricas.totalConstrutoras || 0}
                subtitle="Construtoras parceiras"
                icon={<Building className="h-5 w-5" />}
              />
              
              <MetricCard
                title="Taxa de Conversão"
                value={`${dados?.metricas.taxaConversao || 0}%`}
                subtitle="Média de conversão"
                icon={<TrendingUp className="h-5 w-5" />}
                change={dados?.metricas.crescimento.cliques || '0%'}
                changeType="increase"
              />
            </div>
          )}
        </motion.div>
        
        {/* Gráficos e estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Gráfico de atividade */}
          <motion.div
            className="xl:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-0 shadow-md h-full">
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>Visualizações, cliques e matches realizados</CardDescription>
              </CardHeader>
              <CardContent>
                {carregando ? (
                  <div className="h-[240px] flex items-center justify-center">
                    <div className="animate-pulse flex flex-col items-center w-full">
                      <div className="h-4 w-24 bg-muted rounded mb-4" />
                      <div className="h-40 w-full bg-muted rounded" />
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={dados?.graficos.atividadeRecenteMeses || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip 
                        formatter={(value, name) => [
                          new Intl.NumberFormat('pt-BR').format(Number(value)), 
                          name === 'visualizacoes' ? 'Visualizações' : 
                          name === 'cliques' ? 'Cliques' : 'Matches'
                        ]}
                      />
                      <Line type="monotone" dataKey="visualizacoes" name="Visualizações" stroke="#FF6B00" strokeWidth={2} />
                      <Line type="monotone" dataKey="cliques" name="Cliques" stroke="#FFB370" strokeWidth={2} />
                      <Line type="monotone" dataKey="matches" name="Matches" stroke="#FF9A3D" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-primary" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{!carregando ? dados?.graficos.atividadeRecenteMeses?.[dados.graficos.atividadeRecenteMeses.length - 1]?.visualizacoes.toLocaleString() || 0 : 0}</p>
                    <p className="text-xs text-muted-foreground">Visualizações</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MousePointer className="h-4 w-4 text-primary" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{!carregando ? dados?.graficos.atividadeRecenteMeses?.[dados.graficos.atividadeRecenteMeses.length - 1]?.cliques.toLocaleString() || 0 : 0}</p>
                    <p className="text-xs text-muted-foreground">Cliques</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{!carregando ? dados?.graficos.atividadeRecenteMeses?.[dados.graficos.atividadeRecenteMeses.length - 1]?.matches.toLocaleString() || 0 : 0}</p>
                    <p className="text-xs text-muted-foreground">Matches</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
          
          {/* Gráfico de construtoras */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-0 shadow-md h-full">
              <CardHeader>
                <CardTitle>Construtoras</CardTitle>
                <CardDescription>Por plano de assinatura</CardDescription>
              </CardHeader>
              <CardContent>
                {carregando ? (
                  <div className="h-[200px] flex items-center justify-center">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="h-4 w-24 bg-muted rounded mb-4" />
                      <div className="h-32 w-32 bg-muted rounded-full" />
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={dados?.graficos.estatisticasConstrutoras || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {dados?.graficos.estatisticasConstrutoras.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="grid grid-cols-3 w-full gap-2 text-center">
                  {!carregando && dados?.graficos.estatisticasConstrutoras.map((item, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-xs text-gray-500">{item.value} construtoras</span>
                    </div>
                  ))}
                </div>
              </CardFooter>
            </Card>
          </motion.div>
          
          {/* Gráfico de imóveis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-0 shadow-md h-full">
              <CardHeader>
                <CardTitle>Tipos de Imóveis</CardTitle>
                <CardDescription>Distribuição por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                {carregando ? (
                  <div className="h-[200px] flex items-center justify-center">
                    <div className="animate-pulse flex flex-col items-center w-full">
                      <div className="h-4 w-24 bg-muted rounded mb-4" />
                      <div className="h-40 w-full bg-muted rounded" />
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={dados?.graficos.estatisticasTiposImoveis || []}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <RechartsTooltip formatter={(value) => new Intl.NumberFormat('pt-BR').format(Number(value))} />
                      <Bar dataKey="valor" fill="#FF6B00" radius={[0, 4, 4, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  Total de {dados?.metricas.totalImoveis || 0} imóveis distribuídos por {dados?.graficos.estatisticasTiposImoveis?.length || 0} categorias
                </p>
              </CardFooter>
            </Card>
          </motion.div>
          
          {/* Atividades recentes */}
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="border-0 shadow-md h-full">
              <CardHeader>
                <CardTitle>Últimas Atividades</CardTitle>
                <CardDescription>Últimas interações no sistema</CardDescription>
              </CardHeader>
              <CardContent>
                {carregando ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-start space-x-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-[80%]" />
                          <Skeleton className="h-4 w-[60%]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dados?.listas.respostasRecentes.slice(0, 5).map((resposta, index) => (
                      <div key={index} className="flex items-start space-x-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <MessageSquare className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <p className="text-sm font-medium">
                            {resposta.usuario?.name || 'Usuário'} respondeu a pergunta
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {resposta.pergunta?.texto || 'Pergunta'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(resposta.createdAt).toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-center">
                <Button variant="outline" size="sm">
                  Ver todas as atividades
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
