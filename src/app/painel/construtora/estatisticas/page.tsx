"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts"
import { DownloadIcon, TrendingUp, TrendingDown, PercentIcon, Users, Clock } from "lucide-react"

// Dados simulados para estatísticas
const dadosInteresse = [
  { mes: 'Jan', valor: 4000 },
  { mes: 'Fev', valor: 3000 },
  { mes: 'Mar', valor: 2000 },
  { mes: 'Abr', valor: 2780 },
  { mes: 'Mai', valor: 1890 },
  { mes: 'Jun', valor: 2390 },
  { mes: 'Jul', valor: 3490 },
  { mes: 'Ago', valor: 4500 },
  { mes: 'Set', valor: 6300 },
  { mes: 'Out', valor: 5400 },
  { mes: 'Nov', valor: 4900 },
  { mes: 'Dez', valor: 4100 },
]

const dadosConversao = [
  { mes: 'Jan', taxaConversao: 2.4 },
  { mes: 'Fev', taxaConversao: 2.8 },
  { mes: 'Mar', taxaConversao: 3.2 },
  { mes: 'Abr', taxaConversao: 3.8 },
  { mes: 'Mai', taxaConversao: 4.5 },
  { mes: 'Jun', taxaConversao: 5.2 },
  { mes: 'Jul', taxaConversao: 5.5 },
  { mes: 'Ago', taxaConversao: 5.8 },
  { mes: 'Set', taxaConversao: 6.2 },
  { mes: 'Out', taxaConversao: 6.5 },
  { mes: 'Nov', taxaConversao: 6.7 },
  { mes: 'Dez', taxaConversao: 7.0 },
]

const dadosCanais = [
  { nome: 'Busca Orgânica', valor: 45 },
  { nome: 'Redes Sociais', valor: 25 },
  { nome: 'Email Marketing', valor: 15 },
  { nome: 'Referência', valor: 10 },
  { nome: 'Direto', valor: 5 },
]

const dadosTipoImovel = [
  { nome: 'Studio', valor: 30 },
  { nome: '1 Dormitório', valor: 25 },
  { nome: '2 Dormitórios', valor: 35 },
  { nome: '3+ Dormitórios', valor: 10 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const dadosTempoPermanencia = [
  { faixa: '0-30s', visitas: 150 },
  { faixa: '30s-1m', visitas: 120 },
  { faixa: '1m-2m', visitas: 200 },
  { faixa: '2m-5m', visitas: 180 },
  { faixa: '5m-10m', visitas: 90 },
  { faixa: '10m+', visitas: 60 },
]

const dadosDispositivos = [
  { dispositivo: 'Desktop', porcentagem: 42 },
  { dispositivo: 'Mobile', porcentagem: 53 },
  { dispositivo: 'Tablet', porcentagem: 5 },
]

export default function EstatisticasPage() {
  const [periodo, setPeriodo] = useState("12meses")

  return (
    <DashboardLayout userRole="construtora">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Estatísticas</h1>
        <p className="text-muted-foreground">Dados detalhados sobre o desempenho dos seus imóveis</p>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <Select defaultValue={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30dias">Últimos 30 dias</SelectItem>
              <SelectItem value="90dias">Últimos 90 dias</SelectItem>
              <SelectItem value="6meses">Últimos 6 meses</SelectItem>
              <SelectItem value="12meses">Últimos 12 meses</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline">
          <DownloadIcon className="mr-2 h-4 w-4" />
          Exportar Dados
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-base font-medium">Taxa de Conversão</CardTitle>
              <CardDescription>Total de leads / visitantes</CardDescription>
            </div>
            <div className="bg-muted/80 p-2 rounded-full">
              <PercentIcon className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">6.8%</div>
            <div className="flex items-center text-sm text-green-500">
              <TrendingUp className="mr-1 h-4 w-4" />
              <span>+1.2% vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-base font-medium">Novos Leads</CardTitle>
              <CardDescription>Total no período</CardDescription>
            </div>
            <div className="bg-muted/80 p-2 rounded-full">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">143</div>
            <div className="flex items-center text-sm text-green-500">
              <TrendingUp className="mr-1 h-4 w-4" />
              <span>+12.5% vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-base font-medium">Tempo Médio</CardTitle>
              <CardDescription>Duração de visita no site</CardDescription>
            </div>
            <div className="bg-muted/80 p-2 rounded-full">
              <Clock className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">2:45</div>
            <div className="flex items-center text-sm text-red-500">
              <TrendingDown className="mr-1 h-4 w-4" />
              <span>-0:15 vs período anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tendencias" className="space-y-8">
        <TabsList className="grid grid-cols-4 w-full max-w-md mb-4">
          <TabsTrigger value="tendencias">Tendências</TabsTrigger>
          <TabsTrigger value="origens">Origens</TabsTrigger>
          <TabsTrigger value="comportamento">Comportamento</TabsTrigger>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
        </TabsList>

        {/* Tab Tendências */}
        <TabsContent value="tendencias" className="space-y-6 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Interesse ao Longo do Tempo</CardTitle>
                <CardDescription>Número de visualizações por mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={dadosInteresse}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorInteresse" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="valor" 
                        stroke="#8884d8" 
                        fillOpacity={1} 
                        fill="url(#colorInteresse)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Taxa de Conversão</CardTitle>
                <CardDescription>Percentual de conversão por mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={dadosConversao}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, 'Taxa de Conversão']} />
                      <Line 
                        type="monotone" 
                        dataKey="taxaConversao" 
                        stroke="#00C49F" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Origens */}
        <TabsContent value="origens" className="space-y-6 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Canais de Aquisição</CardTitle>
                <CardDescription>Distribuição de acessos por canal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        dataKey="valor"
                        data={dadosCanais}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ nome, percent }) => `${nome}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {dadosCanais.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name, props) => [`${value}%`, props.payload.nome]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dispositivos</CardTitle>
                <CardDescription>Distribuição de acessos por dispositivo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dadosDispositivos}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="dispositivo" type="category" width={80} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Acessos']} />
                      <Bar dataKey="porcentagem" fill="#0088FE" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Comportamento */}
        <TabsContent value="comportamento" className="space-y-6 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tempo de Permanência</CardTitle>
                <CardDescription>Distribuição por tempo de visita</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dadosTempoPermanencia}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="faixa" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="visitas" fill="#FFBB28" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Páginas Mais Visitadas</CardTitle>
                <CardDescription>Top 5 páginas por número de visualizações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="font-medium pb-2">Página</th>
                        <th className="font-medium pb-2 text-right">Visualizações</th>
                        <th className="font-medium pb-2 text-right">Tempo Médio</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Studio Itaim Bibi 4</td>
                        <td className="py-2 text-right">1,245</td>
                        <td className="py-2 text-right">3:12</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Apartamento Moema</td>
                        <td className="py-2 text-right">987</td>
                        <td className="py-2 text-right">2:45</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Apartamento Vila Madalena</td>
                        <td className="py-2 text-right">754</td>
                        <td className="py-2 text-right">2:21</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Apartamento Pinheiros</td>
                        <td className="py-2 text-right">632</td>
                        <td className="py-2 text-right">2:03</td>
                      </tr>
                      <tr>
                        <td className="py-2">Studio Vila Olímpia</td>
                        <td className="py-2 text-right">521</td>
                        <td className="py-2 text-right">1:58</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Perfil */}
        <TabsContent value="perfil" className="space-y-6 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Interesse por Tipo de Imóvel</CardTitle>
                <CardDescription>Distribuição de interesse por tipologia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        dataKey="valor"
                        data={dadosTipoImovel}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ nome, percent }) => `${nome}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {dadosTipoImovel.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name, props) => [`${value}%`, props.payload.nome]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Localização dos Usuários</CardTitle>
                <CardDescription>Top 5 cidades com maior interesse</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="font-medium pb-2">Cidade</th>
                        <th className="font-medium pb-2 text-right">Usuários</th>
                        <th className="font-medium pb-2 text-right">Porcentagem</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">São Paulo, SP</td>
                        <td className="py-2 text-right">8,426</td>
                        <td className="py-2 text-right">76.2%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Rio de Janeiro, RJ</td>
                        <td className="py-2 text-right">872</td>
                        <td className="py-2 text-right">7.9%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Campinas, SP</td>
                        <td className="py-2 text-right">456</td>
                        <td className="py-2 text-right">4.1%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Belo Horizonte, MG</td>
                        <td className="py-2 text-right">321</td>
                        <td className="py-2 text-right">2.9%</td>
                      </tr>
                      <tr>
                        <td className="py-2">Brasília, DF</td>
                        <td className="py-2 text-right">287</td>
                        <td className="py-2 text-right">2.6%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
