"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts"
import { DownloadIcon, UploadIcon, EyeIcon, PlusIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react"

// Dados simulados para os gráficos
const visitasData = [
  { mes: 'Jan', quantidade: 65 },
  { mes: 'Fev', quantidade: 59 },
  { mes: 'Mar', quantidade: 80 },
  { mes: 'Abr', quantidade: 81 },
  { mes: 'Mai', quantidade: 56 },
  { mes: 'Jun', quantidade: 55 },
  { mes: 'Jul', quantidade: 40 },
  { mes: 'Ago', quantidade: 70 },
  { mes: 'Set', quantidade: 90 },
  { mes: 'Out', quantidade: 110 },
  { mes: 'Nov', quantidade: 130 },
  { mes: 'Dez', quantidade: 85 },
]

const interessesData = [
  { name: 'Studio', value: 35 },
  { name: '1 Dormitório', value: 40 },
  { name: '2 Dormitórios', value: 55 },
  { name: '3+ Dormitórios', value: 20 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const leadsOrigem = [
  { mes: 'Jan', Site: 10, Instagram: 15, Parceiros: 5 },
  { mes: 'Fev', Site: 15, Instagram: 20, Parceiros: 10 },
  { mes: 'Mar', Site: 20, Instagram: 25, Parceiros: 15 },
  { mes: 'Abr', Site: 25, Instagram: 30, Parceiros: 20 },
  { mes: 'Mai', Site: 30, Instagram: 35, Parceiros: 25 },
]

export default function RelatoriosPage() {
  const [periodoSelecionado, setPeriodoSelecionado] = useState("90dias")

  return (
    <DashboardLayout userRole="construtora">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground">Acompanhe as métricas e desempenho dos seus imóveis</p>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <Select defaultValue={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
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
          Exportar Relatórios
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Visualizações Totais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">1,562</div>
              <div className="flex items-center text-sm text-green-500">
                <ArrowUpIcon className="mr-1 h-4 w-4" />
                12.5%
              </div>
            </div>
            <p className="text-xs text-muted-foreground">+156 em relação ao período anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Leads Gerados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">89</div>
              <div className="flex items-center text-sm text-green-500">
                <ArrowUpIcon className="mr-1 h-4 w-4" />
                8.3%
              </div>
            </div>
            <p className="text-xs text-muted-foreground">+7 em relação ao período anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Conversão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">5.7%</div>
              <div className="flex items-center text-sm text-red-500">
                <ArrowDownIcon className="mr-1 h-4 w-4" />
                1.2%
              </div>
            </div>
            <p className="text-xs text-muted-foreground">-0.5% em relação ao período anterior</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="visitas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visitas">Visualizações</TabsTrigger>
          <TabsTrigger value="interesses">Interesses</TabsTrigger>
          <TabsTrigger value="leads">Leads por Origem</TabsTrigger>
        </TabsList>

        <TabsContent value="visitas" className="p-0 border rounded-lg">
          <Card className="border-0">
            <CardHeader>
              <CardTitle>Visualizações por Mês</CardTitle>
              <CardDescription>
                Total de visualizações nos seus imóveis ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent className="px-1">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={visitasData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantidade" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interesses" className="p-0 border rounded-lg">
          <Card className="border-0">
            <CardHeader>
              <CardTitle>Interesses por Tipo de Imóvel</CardTitle>
              <CardDescription>
                Distribuição de interesse por tipologia de imóvel
              </CardDescription>
            </CardHeader>
            <CardContent className="px-1">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={interessesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {interessesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads" className="p-0 border rounded-lg">
          <Card className="border-0">
            <CardHeader>
              <CardTitle>Leads por Origem</CardTitle>
              <CardDescription>
                Origem dos leads gerados pelos seus imóveis
              </CardDescription>
            </CardHeader>
            <CardContent className="px-1">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={leadsOrigem}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Site" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="Instagram" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="Parceiros" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Imóveis Mais Visualizados</CardTitle>
            <CardDescription>
              Os imóveis com maior número de visualizações no período
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="font-medium p-3">Imóvel</th>
                    <th className="font-medium p-3">Visualizações</th>
                    <th className="font-medium p-3">Leads</th>
                    <th className="font-medium p-3">Conversão</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="p-3">Studio Itaim Bibi 4</td>
                    <td className="p-3">243</td>
                    <td className="p-3">21</td>
                    <td className="p-3">8.6%</td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="p-3">Apartamento Pinheiros 2</td>
                    <td className="p-3">198</td>
                    <td className="p-3">15</td>
                    <td className="p-3">7.6%</td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="p-3">Apartamento Vila Madalena</td>
                    <td className="p-3">156</td>
                    <td className="p-3">12</td>
                    <td className="p-3">7.7%</td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="p-3">Studio Vila Olímpia</td>
                    <td className="p-3">134</td>
                    <td className="p-3">8</td>
                    <td className="p-3">6.0%</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="p-3">Apartamento Moema</td>
                    <td className="p-3">118</td>
                    <td className="p-3">7</td>
                    <td className="p-3">5.9%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
