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

// Interface para dados de atividade
interface AtividadeDiaria {
  data: string;
  visitas: number;
  cliques: number;
  conversoes: number;
}

// Cores personalizadas para o gráfico
const cores = {
  visualizacoes: "#4285F4",
  cliques: "#FF6B00",
  conversoes: "#34A853"
};

type PeriodoTipo = "dia" | "semana" | "mes";
type DadosTipo = "visualizacoes" | "cliques" | "conversoes";

interface GraficoVisualizacoesProps {
  dados: AtividadeDiaria[];
  titulo?: string;
  descricao?: string;
  altura?: number;
  tipoGrafico?: "linha" | "area" | "barra";
  mostrarDados?: DadosTipo[];
}

export function GraficoVisualizacoes({ 
  dados,
  titulo = "Visualizações e Engajamento",
  descricao = "Acompanhe as métricas de visualizações, cliques e conversões da plataforma",
  altura = 320,
  tipoGrafico = "area",
  mostrarDados = ["visualizacoes", "cliques", "conversoes"]
}: GraficoVisualizacoesProps) {
  // Mapear os dados recebidos para o formato do gráfico
  const dadosGrafico = dados.map(item => ({
    data: item.data,
    visualizacoes: item.visitas,
    cliques: item.cliques,
    conversoes: item.conversoes
  }));
  
  // Calcular os números totais e taxas de crescimento
  const totalVisualizacoes = dadosGrafico.reduce((acc: number, item) => acc + item.visualizacoes, 0);
  const totalCliques = dadosGrafico.reduce((acc: number, item) => acc + item.cliques, 0);
  const totalConversoes = dadosGrafico.reduce((acc: number, item) => acc + item.conversoes, 0);
  
  // Calcular taxa de cliques (CTR) e taxa de conversão
  const taxaCliques = (totalCliques / totalVisualizacoes) * 100;
  const taxaConversao = (totalConversoes / totalCliques) * 100;
  
  // Calcular crescimento baseado nos dados reais
  const metadeDados = Math.floor(dadosGrafico.length / 2);
  const primeiraMetade = dadosGrafico.slice(0, metadeDados);
  const segundaMetade = dadosGrafico.slice(metadeDados);
  
  const totalPrimeiraMetade = primeiraMetade.reduce((acc: number, item) => acc + item.visualizacoes, 0);
  const totalSegundaMetade = segundaMetade.reduce((acc: number, item) => acc + item.visualizacoes, 0);
  
  const crescimentoVisualizacoes = totalPrimeiraMetade > 0 
    ? ((totalSegundaMetade - totalPrimeiraMetade) / totalPrimeiraMetade) * 100 
    : 0;
    
  const cliquePrimeiraMetade = primeiraMetade.reduce((acc: number, item) => acc + item.cliques, 0);
  const cliqueSegundaMetade = segundaMetade.reduce((acc: number, item) => acc + item.cliques, 0);
  
  const crescimentoCliques = cliquePrimeiraMetade > 0 
    ? ((cliqueSegundaMetade - cliquePrimeiraMetade) / cliquePrimeiraMetade) * 100 
    : 0;
  
  const renderizarGrafico = () => {
    switch (tipoGrafico) {
      case "linha":
        return (
          <LineChart data={dadosGrafico}>
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
          <BarChart data={dadosGrafico}>
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
          <AreaChart data={dadosGrafico}>
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
        <div className="text-sm text-muted-foreground">
          {dadosGrafico.length} pontos de dados
        </div>
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
