"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
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
  Legend,
  AreaChart,
  Area
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
  FileText,
  PieChart as PieChartIcon,
  MessageCircle,
  Settings
} from "lucide-react"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Dados zerados para os gráficos (serão substituídos por dados reais futuramente)
const interessadosData = [
  { nome: "Jan", interessados: 0, contatos: 0 },
  { nome: "Fev", interessados: 0, contatos: 0 },
  { nome: "Mar", interessados: 0, contatos: 0 },
  { nome: "Abr", interessados: 0, contatos: 0 },
  { nome: "Mai", interessados: 0, contatos: 0 },
  { nome: "Jun", interessados: 0, contatos: 0 },
]

// Definindo a interface para os dados de imóveis
interface ImovelPerformance {
  nome: string;
  visualizacoes: number;
  contatos: number;
  tipo: string;
}

// Array vazio com tipagem correta
const imovelPerformanceData: ImovelPerformance[] = [
  // Dados serão carregados do banco de dados
]

const leadsByChannelData = [
  { nome: "Website", valor: 0, color: "#FF6B00" },
  { nome: "Redes Sociais", valor: 0, color: "#FFB370" },
  { nome: "Parceiros", valor: 0, color: "#FF8F3D" },
  { nome: "Indicações", valor: 0, color: "#FFCFA3" },
]

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

export default function ConstrutoraDashboard() {
  const [isMounted, setIsMounted] = useState(false)
  const [construtora, setConstrutora] = useState({
    nome: "Construtora Exemplo", // Manteremos o nome da construtora
    imoveis: 0,
    imoveis_novos: 0,
    interessados: 0,
    interessados_novos: 0,
    mensagens: 0,
    mensagens_novas: 0,
    visualizacoes: 0,
    contatos: 0,
    conversao: 0
  })
  
  // Garantindo renderização apenas no cliente
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  if (!isMounted) {
    return null
  }

  return (
    <DashboardLayout userRole="construtora" userName={construtora.nome}>

      <div className="space-y-8">
        {/* Header e filtros */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold tracking-tight">Dashboard da Construtora</h1>
            <p className="text-muted-foreground">Bem-vindo, {construtora.nome}. Aqui está um resumo dos seus dados.</p>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap gap-2" 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Button variant="outline" size="sm" className="h-8">
              <Eye className="mr-2 h-3.5 w-3.5" />
              Últimos 7 dias
            </Button>
            <Button size="sm" className="h-8">
              <FileText className="mr-2 h-3.5 w-3.5" />
              Exportar Relatório
            </Button>
          </motion.div>
        </div>
        
        {/* Grid de métricas principais */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard 
              title="Imóveis"
              value={construtora.imoveis}
              subtitle="Cadastrados no sistema"
              icon={<Home className="h-5 w-5" />}
              change="33%"
              changeType="increase"
            />
            
            <MetricCard 
              title="Interessados"
              value={construtora.interessados}
              subtitle="Potenciais clientes"
              icon={<Users className="h-5 w-5" />}
              change="22%"
              changeType="increase"
            />
            
            <MetricCard 
              title="Visualizações"
              value={construtora.visualizacoes}
              subtitle="Nos seus imóveis"
              icon={<Eye className="h-5 w-5" />}
              change="18%"
              changeType="increase"
            />
            
            <MetricCard 
              title="Taxa de Conversão"
              value={`${construtora.conversao}%`}
              subtitle="Visualizações para contatos"
              icon={<TrendingUp className="h-5 w-5" />}
              change="5%"
              changeType="increase"
            />
          </div>
        </motion.div>
        
        {/* Gráficos principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Interessados ao Longo do Tempo</span>
                  <Badge variant="outline" className="ml-2 bg-primary/5 text-primary">
                    Últimos 6 meses
                  </Badge>
                </CardTitle>
                <CardDescription>Evolução de interessados e contatos realizados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={interessadosData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="nome" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <RechartsTooltip
                        contentStyle={{ background: "#fff", border: "1px solid #eaeaea", borderRadius: "4px" }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="interessados" 
                        stackId="1"
                        stroke="#FF6B00" 
                        fill="#FF6B00" 
                        fillOpacity={0.6}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="contatos" 
                        stackId="2"
                        stroke="#FFB370" 
                        fill="#FFB370" 
                        fillOpacity={0.6}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        iconType="circle"
                        formatter={(value: string) => <span className="text-sm capitalize">{value}</span>}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-primary" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{construtora.interessados}</p>
                    <p className="text-xs text-muted-foreground">Total de interessados</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{construtora.contatos}</p>
                    <p className="text-xs text-muted-foreground">Contatos recebidos</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 gap-6"
          >
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Origem dos Leads</CardTitle>
                <CardDescription>Distribuição por canais de aquisição</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leadsByChannelData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="valor"
                        label={({ nome, percent }: { nome: string, percent: number }) => `${nome} ${(percent * 100).toFixed(0)}%`}
                      >
                        {leadsByChannelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{ background: "#fff", border: "1px solid #eaeaea", borderRadius: "4px" }}
                        formatter={(value: any, nome: string) => [
                          `${value} leads`, nome
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle>Ações Rápidas</CardTitle>
                  <CardDescription>Acesso direto às funções principais</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <Button className="w-full justify-start text-sm h-10 bg-primary hover:bg-primary-600 transition-colors duration-200">
                    <Home className="mr-2 h-4 w-4" />
                    Adicionar Imóvel
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm h-10">
                    <Users className="mr-2 h-4 w-4" />
                    Ver Interessados ({construtora.interessados})
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm h-10">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Verificar Mensagens ({construtora.mensagens_novas > 0 ? `+${construtora.mensagens_novas}` : construtora.mensagens})
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        {/* Tabela de desempenho de imóveis */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Desempenho dos Imóveis</CardTitle>
              <CardDescription>
                Visualizações e contatos recebidos por imóvel
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <div className="overflow-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left font-medium text-sm text-gray-500 p-4">Imóvel</th>
                      <th className="text-center font-medium text-sm text-gray-500 p-4">Tipo</th>
                      <th className="text-center font-medium text-sm text-gray-500 p-4">Visualizações</th>
                      <th className="text-center font-medium text-sm text-gray-500 p-4">Contatos</th>
                      <th className="text-center font-medium text-sm text-gray-500 p-4">Conversão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {imovelPerformanceData.map((imovel, index) => {
                      const conversionRate = ((imovel.contatos / imovel.visualizacoes) * 100).toFixed(1)
                      return (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-medium">{imovel.nome}</td>
                          <td className="p-4 text-center">
                            <Badge variant="outline" className="bg-primary/5 text-primary">
                              {imovel.tipo}
                            </Badge>
                          </td>
                          <td className="p-4 text-center">{imovel.visualizacoes}</td>
                          <td className="p-4 text-center">{imovel.contatos}</td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center space-x-1">
                              <span>{conversionRate}%</span>
                              {Number(conversionRate) > 6 ? (
                                <ArrowUp className="h-3 w-3 text-green-500" />
                              ) : (
                                <ArrowDown className="h-3 w-3 text-amber-500" />
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t py-4">
              <Button variant="outline" size="sm" className="h-8">
                <Eye className="h-3.5 w-3.5 mr-2" />
                Ver Todos os Imóveis
              </Button>
              <Button size="sm" className="h-8">
                <Home className="h-3.5 w-3.5 mr-2" />
                Adicionar Novo Imóvel
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
