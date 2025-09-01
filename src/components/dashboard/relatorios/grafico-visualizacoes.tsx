"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Eye, MousePointerClick, CheckCircle2 } from "lucide-react";

// Dados mockados para o gráfico
const dadosPorDia = [
  { data: "01/04", visualizacoes: 1245, cliques: 230, conversoes: 35 },
  { data: "02/04", visualizacoes: 1350, cliques: 280, conversoes: 42 },
  { data: "03/04", visualizacoes: 1190, cliques: 210, conversoes: 32 },
  { data: "04/04", visualizacoes: 1420, cliques: 310, conversoes: 48 },
  { data: "05/04", visualizacoes: 1680, cliques: 390, conversoes: 52 },
  { data: "06/04", visualizacoes: 1560, cliques: 350, conversoes: 47 },
  { data: "07/04", visualizacoes: 1230, cliques: 270, conversoes: 38 },
  { data: "08/04", visualizacoes: 1380, cliques: 320, conversoes: 43 },
  { data: "09/04", visualizacoes: 1490, cliques: 340, conversoes: 51 },
  { data: "10/04", visualizacoes: 1620, cliques: 380, conversoes: 58 },
  { data: "11/04", visualizacoes: 1720, cliques: 410, conversoes: 63 },
  { data: "12/04", visualizacoes: 1850, cliques: 440, conversoes: 68 },
  { data: "13/04", visualizacoes: 1920, cliques: 460, conversoes: 70 },
  { data: "14/04", visualizacoes: 1780, cliques: 420, conversoes: 62 },
];

const dadosPorSemana = [
  { data: "Semana 1", visualizacoes: 8200, cliques: 1850, conversoes: 280 },
  { data: "Semana 2", visualizacoes: 9400, cliques: 2100, conversoes: 320 },
  { data: "Semana 3", visualizacoes: 10600, cliques: 2400, conversoes: 360 },
  { data: "Semana 4", visualizacoes: 12100, cliques: 2850, conversoes: 410 },
];

const dadosPorMes = [
  { data: "Jan", visualizacoes: 35000, cliques: 7600, conversoes: 1200 },
  { data: "Fev", visualizacoes: 38000, cliques: 8200, conversoes: 1320 },
  { data: "Mar", visualizacoes: 42000, cliques: 9500, conversoes: 1450 },
  { data: "Abr", visualizacoes: 48000, cliques: 11200, conversoes: 1680 },
  { data: "Mai", visualizacoes: 52000, cliques: 12400, conversoes: 1840 },
  { data: "Jun", visualizacoes: 49000, cliques: 11500, conversoes: 1720 },
];

// Cores personalizadas para o gráfico
const cores = {
  visualizacoes: "#4285F4",
  cliques: "#FF6B00",
  conversoes: "#34A853"
};

type PeriodoTipo = "dia" | "semana" | "mes";
type DadosTipo = "visualizacoes" | "cliques" | "conversoes";

interface GraficoVisualizacoesProps {
  titulo?: string;
  descricao?: string;
  altura?: number;
  tipoGrafico?: "linha" | "area" | "barra";
  mostrarDados?: DadosTipo[];
}

export function GraficoVisualizacoes({ 
  titulo = "Visualizações e Engajamento",
  descricao = "Acompanhe as métricas de visualizações, cliques e conversões da plataforma",
  altura = 320,
  tipoGrafico = "area",
  mostrarDados = ["visualizacoes", "cliques", "conversoes"]
}: GraficoVisualizacoesProps) {
  const [periodo, setPeriodo] = useState<PeriodoTipo>("dia");
  
  // Selecionar o conjunto de dados com base no período
  const dados = periodo === "dia" 
    ? dadosPorDia 
    : periodo === "semana" 
      ? dadosPorSemana 
      : dadosPorMes;
  
  // Calcular os números totais e taxas de crescimento
  const totalVisualizacoes = dados.reduce((acc, item) => acc + item.visualizacoes, 0);
  const totalCliques = dados.reduce((acc, item) => acc + item.cliques, 0);
  const totalConversoes = dados.reduce((acc, item) => acc + item.conversoes, 0);
  
  // Calcular taxa de cliques (CTR) e taxa de conversão
  const taxaCliques = (totalCliques / totalVisualizacoes) * 100;
  const taxaConversao = (totalConversoes / totalCliques) * 100;
  
  // Crescimento percentual (simulado)
  const crescimentoVisualizacoes = periodo === "dia" ? 7.2 : periodo === "semana" ? 12.5 : 9.8;
  const crescimentoCliques = periodo === "dia" ? 8.5 : periodo === "semana" ? 11.2 : 10.3;
  
  const renderizarGrafico = () => {
    switch (tipoGrafico) {
      case "linha":
        return (
          <LineChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip formatter={(value) => new Intl.NumberFormat('pt-BR').format(Number(value))} />
            <Legend />
            {mostrarDados.includes("visualizacoes") && (
              <Line 
                type="monotone" 
                dataKey="visualizacoes" 
                stroke={cores.visualizacoes} 
                activeDot={{ r: 8 }} 
                strokeWidth={2} 
                name="Visualizações"
              />
            )}
            {mostrarDados.includes("cliques") && (
              <Line 
                type="monotone" 
                dataKey="cliques" 
                stroke={cores.cliques} 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
                name="Cliques"
              />
            )}
            {mostrarDados.includes("conversoes") && (
              <Line 
                type="monotone" 
                dataKey="conversoes" 
                stroke={cores.conversoes} 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
                name="Conversões"
              />
            )}
          </LineChart>
        );
      case "barra":
        return (
          <BarChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip formatter={(value) => new Intl.NumberFormat('pt-BR').format(Number(value))} />
            <Legend />
            {mostrarDados.includes("visualizacoes") && (
              <Bar 
                dataKey="visualizacoes" 
                fill={cores.visualizacoes} 
                name="Visualizações"
              />
            )}
            {mostrarDados.includes("cliques") && (
              <Bar 
                dataKey="cliques" 
                fill={cores.cliques} 
                name="Cliques"
              />
            )}
            {mostrarDados.includes("conversoes") && (
              <Bar 
                dataKey="conversoes" 
                fill={cores.conversoes} 
                name="Conversões"
              />
            )}
          </BarChart>
        );
      case "area":
      default:
        return (
          <AreaChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip formatter={(value) => new Intl.NumberFormat('pt-BR').format(Number(value))} />
            <Legend />
            {mostrarDados.includes("visualizacoes") && (
              <Area 
                type="monotone" 
                dataKey="visualizacoes" 
                stroke={cores.visualizacoes} 
                fill={`${cores.visualizacoes}20`} 
                stackId="1"
                name="Visualizações"
              />
            )}
            {mostrarDados.includes("cliques") && (
              <Area 
                type="monotone" 
                dataKey="cliques" 
                stroke={cores.cliques} 
                fill={`${cores.cliques}20`} 
                stackId="2"
                name="Cliques"
              />
            )}
            {mostrarDados.includes("conversoes") && (
              <Area 
                type="monotone" 
                dataKey="conversoes" 
                stroke={cores.conversoes} 
                fill={`${cores.conversoes}20`} 
                stackId="3"
                name="Conversões"
              />
            )}
          </AreaChart>
        );
    }
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl">{titulo}</CardTitle>
          <CardDescription>{descricao}</CardDescription>
        </div>
        <Select value={periodo} onValueChange={(value) => setPeriodo(value as PeriodoTipo)}>
          <SelectTrigger className="w-[130px]">
            {periodo === "dia" ? "Diário" : periodo === "semana" ? "Semanal" : "Mensal"}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dia">Diário</SelectItem>
            <SelectItem value="semana">Semanal</SelectItem>
            <SelectItem value="mes">Mensal</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2">
        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 px-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Eye className="mr-1 h-4 w-4" />
                  Visualizações
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {new Intl.NumberFormat('pt-BR').format(totalVisualizacoes)}
                </h3>
              </div>
              <div className={`flex items-center ${crescimentoVisualizacoes >= 0 ? 'text-green-500' : 'text-red-500'} text-sm font-medium`}>
                {crescimentoVisualizacoes >= 0 ? (
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                ) : (
                  <ArrowDownRight className="mr-1 h-4 w-4" />
                )}
                {Math.abs(crescimentoVisualizacoes)}%
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              vs. período anterior
            </p>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground flex items-center">
                  <MousePointerClick className="mr-1 h-4 w-4" />
                  Taxa de Cliques
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {taxaCliques.toFixed(1)}%
                </h3>
              </div>
              <div className={`flex items-center ${crescimentoCliques >= 0 ? 'text-green-500' : 'text-red-500'} text-sm font-medium`}>
                {crescimentoCliques >= 0 ? (
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                ) : (
                  <ArrowDownRight className="mr-1 h-4 w-4" />
                )}
                {Math.abs(crescimentoCliques)}%
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {new Intl.NumberFormat('pt-BR').format(totalCliques)} cliques totais
            </p>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground flex items-center">
                  <CheckCircle2 className="mr-1 h-4 w-4" />
                  Taxa de Conversão
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {taxaConversao.toFixed(1)}%
                </h3>
              </div>
              <div className="text-green-500 text-sm font-medium flex items-center">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                5.3%
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {new Intl.NumberFormat('pt-BR').format(totalConversoes)} conversões
            </p>
          </div>
        </div>
        
        {/* Gráfico principal */}
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderizarGrafico()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
