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
  Settings,
  Search,
  Calculator
} from "lucide-react"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

// Interface para dados da API
interface DashboardData {
  metricas: {
    totalImoveis: number;
    totalConstrutoras: number;
    totalRespostas: number;
    taxaMatchImoveis: string;
    crescimento: {
      visualizacoes: string;
      matches: string;
      respostas: string;
    };
  };
  graficos: {
    atividadeRecenteMeses: Array<{
      name: string;
      visualizacoes: number;
      matches: number;
      respostas: number;
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
    respostasRecentes: Array<any>;
    construtoras: Array<any>;
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

export default function ClienteDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("Cliente");
  const [carregando, setCarregando] = useState(true);
  const [dados, setDados] = useState<DashboardData | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Buscar dados da API e informações do usuário
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true);
        
        // Buscar dados do dashboard
        const resposta = await fetch('/api/cliente/dashboard');
        
        if (!resposta.ok) {
          throw new Error('Erro ao buscar dados do dashboard');
        }
        
        const { data } = await resposta.json();
        setDados(data);
        
        // Atualizar o nome do usuário com o retornado pela API
        if (data.userName) {
          setUserName(data.userName);
        }
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
    <DashboardLayout userRole="cliente" userName={userName}>
      <div className="flex-1 space-y-6 p-5 pt-6">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Meu Painel</h1>
            <p className="text-muted-foreground">
              Acompanhe seus imóveis, construtoras e respostas personalizadas
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 gap-1" 
              onClick={() => router.push('/painel/cliente/relatorios')}
            >
              <Activity className="h-4 w-4" />
              Relatórios
            </Button>
            <Button 
              size="sm" 
              className="h-9 gap-1"
              onClick={() => router.push('/painel/cliente/configuracoes')}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden border-0 shadow-md">
                  <CardHeader className="pb-2 pt-4">
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : erro ? (
            <div className="bg-destructive/10 p-4 rounded-lg flex items-center gap-3 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p>{erro}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Imóveis Compatíveis"
                value={dados?.metricas.totalImoveis || 0}
                subtitle="Total de imóveis"
                icon={<Home className="h-5 w-5" />}
                changeType="increase"
              />
              <MetricCard
                title="Construtoras"
                value={dados?.metricas.totalConstrutoras || 0}
                subtitle="Parceiras disponíveis"
                icon={<Building className="h-5 w-5" />}
                changeType="increase"
              />
              <MetricCard
                title="Imóveis Visitados"
                value={dados?.metricas.imoveisVisitados || 0}
                subtitle="Visitas realizadas"
                icon={<Eye className="h-5 w-5" />}
                changeType="increase"
              />
              <MetricCard
                title="Simulações"
                value={dados?.metricas.simulacoesRealizadas || 0}
                subtitle="Simulações de crédito"
                icon={<Calculator className="h-5 w-5" />}
                changeType="increase"
              />
            </div>
          )}
        </motion.div>
        
        {/* Gráfico de atividade */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>Visualizações, matches e respostas nos últimos meses</CardDescription>
            </CardHeader>
            <CardContent>
              {carregando ? (
                <div className="w-full h-[300px] flex items-center justify-center">
                  <div className="h-8 w-8 animate-spin text-primary rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={dados?.graficos?.atividadeRecenteMeses || []}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: "#fff", 
                          border: "none", 
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                          borderRadius: "0.5rem",
                          padding: "0.5rem"
                        }} 
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="visitas"
                        name="Visitas"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="simulacoes" 
                        name="Simulações"
                        stroke="#10b981" 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="respostas" 
                        name="Respostas IA"
                        stroke="#ffc658" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Gráficos de estatísticas e construtoras */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tipos de imóveis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="border-0 shadow-md h-full">
              <CardHeader>
                <CardTitle>Tipos de Imóveis</CardTitle>
                <CardDescription>Distribuição por tipo de imóvel compatível</CardDescription>
              </CardHeader>
              <CardContent>
                {carregando ? (
                  <div className="w-full h-[250px] flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin text-primary rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                ) : (
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dados?.graficos.estatisticasTiposImoveis || []}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip 
                          formatter={(value: number) => [`${value} imóveis`, 'Quantidade']}
                          contentStyle={{ 
                            backgroundColor: "#fff", 
                            border: "none", 
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                            borderRadius: "0.375rem",
                            padding: "0.75rem"
                          }} 
                        />
                        <Bar dataKey="valor" fill="#8884d8" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Construtoras */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card className="border-0 shadow-md h-full">
              <CardHeader>
                <CardTitle>Construtoras</CardTitle>
                <CardDescription>Distribuição de imóveis por construtora</CardDescription>
              </CardHeader>
              <CardContent>
                {carregando ? (
                  <div className="w-full h-[250px] flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin text-primary rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                ) : (
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dados?.graficos.estatisticasConstrutoras || []}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {dados?.graficos.estatisticasConstrutoras?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend />
                        <RechartsTooltip 
                          formatter={(value: number, name: string) => [`${value} imóveis`, name]}
                          contentStyle={{ 
                            backgroundColor: "#fff", 
                            border: "none", 
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                            borderRadius: "0.375rem",
                            padding: "0.75rem"
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}