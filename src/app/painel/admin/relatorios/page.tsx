"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

import {
  Calendar,
  Download,
  FileText,
  BarChart4,
  Users,
  Activity,
  MousePointerClick,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  Filter,
  Share2,
  PlusCircle
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { GraficoVisualizacoes } from "@/components/dashboard/relatorios/grafico-visualizacoes";
import { MapaCalor } from "@/components/dashboard/relatorios/mapa-calor";
import { TabelaImoveis } from "@/components/dashboard/relatorios/tabela-imoveis";

const periodos = [
  { valor: "7d", label: "Últimos 7 dias" },
  { valor: "30d", label: "Últimos 30 dias" },
  { valor: "90d", label: "Últimos 3 meses" },
  { valor: "180d", label: "Últimos 6 meses" },
  { valor: "365d", label: "Último ano" },
];

// Definir tipagem para o histórico de atividade
interface AtividadeDiaria {
  data: string;
  visitas: number;
  cliques: number;
  conversoes: number;
}

export default function RelatoriosPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [periodoSelecionado, setPeriodoSelecionado] = useState("30d");
  const [tabAtiva, setTabAtiva] = useState("visao-geral");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Estados para os dados reais do banco
  const [metricas, setMetricas] = useState({
    visualizacoes: {
      total: 0,
      percentual: 0,
      positivo: true,
    },
    cliques: {
      total: 0,
      percentual: 0,
      positivo: true,
    },
    ctr: {
      total: 0,
      percentual: 0,
      positivo: true,
    },
    tempoMedio: {
      total: "0m 0s",
      percentual: 0,
      positivo: true,
    },
    usuarios: {
      total: 0,
      percentual: 0,
      positivo: true,
    },
    conversoes: {
      total: 0,
      percentual: 0,
      positivo: true,
    },
  });
  
  const [totais, setTotais] = useState({
    usuarios: 0,
    imoveis: 0,
    respostas: 0,
    construtoras: 0,
    matches: 0,
    relatorios: 0
  });
  
  const [historicoAtividade, setHistoricoAtividade] = useState<AtividadeDiaria[]>([]);
  const [distribuicao, setDistribuicao] = useState({
    imoveisPorConstrutora: [] as any[],
    perguntasPorCategoria: [] as any[]
  });
  
  // Função para carregar dados da API
  const carregarDados = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/relatorios?periodo=${periodoSelecionado}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao carregar relatórios: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Atualizar os estados com os dados reais
      setMetricas(data.metricas);
      setTotais(data.totais);
      setHistoricoAtividade(data.historicoAtividade);
      setDistribuicao(data.distribuicao);
      
    } catch (error) {
      console.error('Erro ao buscar dados de relatórios:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Atualiza as datas de início e fim com base no período selecionado
  useEffect(() => {
    const hoje = new Date();
    let dias = 30;
    
    switch (periodoSelecionado) {
      case "7d": dias = 7; break;
      case "30d": dias = 30; break;
      case "90d": dias = 90; break;
      case "180d": dias = 180; break;
      case "365d": dias = 365; break;
    }
    
    const dataInicioObj = subDays(hoje, dias);
    
    setDataInicio(format(dataInicioObj, "dd 'de' MMMM", { locale: ptBR }));
    setDataFim(format(hoje, "dd 'de' MMMM", { locale: ptBR }));
    
    // Carregar dados para o período selecionado
    carregarDados();
  }, [periodoSelecionado]);
  
  // Garantir renderização apenas no cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return null;
  }
  
  // Função para exportar relatório
  const exportarRelatorio = () => {
    // Preparar dados para exportação
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const dadosExportacao = {
      periodo: periodoSelecionado,
      dataExportacao: dataAtual,
      metricas,
      totais
    };
    
    // Criar blob com dados JSON
    const blob = new Blob([JSON.stringify(dadosExportacao, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Criar link de download
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-imovia-${dataAtual.replace(/\//g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Limpar recursos
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
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
            <h1 className="text-2xl font-bold tracking-tight">Relatórios e Analytics</h1>
            <p className="text-muted-foreground">
              Visualize métricas detalhadas de desempenho e engajamento da plataforma
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
              <SelectTrigger className="w-[180px] h-9">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>
                    {periodos.find(p => p.valor === periodoSelecionado)?.label || "Período"}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                {periodos.map(periodo => (
                  <SelectItem key={periodo.valor} value={periodo.valor}>
                    {periodo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="h-9" onClick={exportarRelatorio}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            
            <Button className="h-9">
              <FileText className="mr-2 h-4 w-4" />
              Gerar PDF
            </Button>
          </div>
        </div>
        
        {/* Período selecionado */}
        <div className="flex items-center justify-between bg-muted/50 rounded-lg px-4 py-2">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              Período: <span className="font-medium">{dataInicio}</span> até <span className="font-medium">{dataFim}</span>
            </span>
          </div>
          <Badge variant="outline">
            {periodoSelecionado === "7d" ? "Últimos 7 dias" : 
             periodoSelecionado === "30d" ? "Últimos 30 dias" : 
             periodoSelecionado === "90d" ? "Últimos 3 meses" : 
             periodoSelecionado === "180d" ? "Últimos 6 meses" : "Último ano"}
          </Badge>
        </div>
        
        {/* Cards de métricas */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card de Visualizações */}
            <Card className="bg-white dark:bg-zinc-900 shadow-md border-0 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center font-medium text-muted-foreground">
                  <Activity className="mr-2 h-5 w-5" />
                  Visualizações de Páginas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-[140px]">
                    <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-3xl font-bold">
                      {metricas.visualizacoes.total.toLocaleString('pt-BR')}
                    </div>
                    <div className="flex items-center mt-1">
                      <div className={`text-sm flex items-center ${metricas.visualizacoes.positivo ? 'text-green-500' : 'text-red-500'}`}>
                        {metricas.visualizacoes.positivo ? 
                          <ArrowUpRight className="mr-1 h-4 w-4" /> : 
                          <ArrowDownRight className="mr-1 h-4 w-4" />
                        }
                        {Math.abs(metricas.visualizacoes.percentual)}%
                      </div>
                      <div className="text-muted-foreground text-xs ml-2">
                        vs. período anterior
                      </div>
                    </div>
                    <div className="w-full h-[60px] mt-3">
                      {/* Mini gráfico */}
                      <div className="w-full h-full bg-slate-50 dark:bg-slate-800/50 rounded-md flex items-end px-1">
                        {historicoAtividade.slice(-14).map((dia, i) => (
                          <div 
                            key={i} 
                            className="flex-1 mx-[1px] rounded-t-sm" 
                            style={{ 
                              height: `${Math.min(dia.visitas / 5, 100)}%`, 
                              backgroundColor: i > 10 ? '#4285F4' : '#4285F480'
                            }}
                            title={`${dia.data}: ${dia.visitas} visitas`}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            {/* Card de Cliques */}
            <Card className="bg-white dark:bg-zinc-900 shadow-md border-0 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center font-medium text-muted-foreground">
                  <MousePointerClick className="mr-2 h-5 w-5" />
                  Cliques em Imóveis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-[140px]">
                    <div className="animate-spin h-6 w-6 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-3xl font-bold">
                      {metricas.cliques.total.toLocaleString('pt-BR')}
                    </div>
                    <div className="flex items-center mt-1">
                      <div className={`text-sm flex items-center ${metricas.cliques.positivo ? 'text-green-500' : 'text-red-500'}`}>
                        {metricas.cliques.positivo ? 
                          <ArrowUpRight className="mr-1 h-4 w-4" /> : 
                          <ArrowDownRight className="mr-1 h-4 w-4" />
                        }
                        {Math.abs(metricas.cliques.percentual)}%
                      </div>
                      <div className="text-muted-foreground text-xs ml-2">
                        vs. período anterior
                      </div>
                    </div>
                    <div className="w-full h-[60px] mt-3">
                      {/* Mini gráfico */}
                      <div className="w-full h-full bg-slate-50 dark:bg-slate-800/50 rounded-md flex items-end px-1">
                        {historicoAtividade.slice(-14).map((dia, i) => (
                          <div 
                            key={i} 
                            className="flex-1 mx-[1px] rounded-t-sm" 
                            style={{ 
                              height: `${Math.min(dia.cliques / 5, 100)}%`, 
                              backgroundColor: i > 10 ? '#FF6B00' : '#FF6B0080'
                            }}
                            title={`${dia.data}: ${dia.cliques} cliques`}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            {/* Card de CTR */}
            <Card className="bg-white dark:bg-zinc-900 shadow-md border-0 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center font-medium text-muted-foreground">
                  <BarChart4 className="mr-2 h-5 w-5" />
                  Taxa de Cliques (CTR)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-[140px]">
                    <div className="animate-spin h-6 w-6 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-3xl font-bold">
                      {metricas.ctr.total.toFixed(1)}%
                    </div>
                    <div className="flex items-center mt-1">
                      <div className={`text-sm flex items-center ${metricas.ctr.positivo ? 'text-green-500' : 'text-red-500'}`}>
                        {metricas.ctr.positivo ? 
                          <ArrowUpRight className="mr-1 h-4 w-4" /> : 
                          <ArrowDownRight className="mr-1 h-4 w-4" />
                        }
                        {Math.abs(metricas.ctr.percentual)}%
                      </div>
                      <div className="text-muted-foreground text-xs ml-2">
                        vs. período anterior
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <div className="text-xs text-muted-foreground">Taxa de conversão</div>
                        <div className="text-sm font-medium">
                          {metricas.cliques.total > 0 
                            ? (metricas.conversoes.total / metricas.cliques.total * 100).toFixed(1) 
                            : '0.0'}%
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Tempo médio</div>
                        <div className="text-sm font-medium">{metricas.tempoMedio.total}</div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
        
        {/* Abas de visualização */}
        <Tabs value={tabAtiva} onValueChange={setTabAtiva} className="space-y-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
            <TabsTrigger value="imoveis">Imóveis</TabsTrigger>
            <TabsTrigger value="acessos">Acessos</TabsTrigger>
            <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visao-geral" className="space-y-6">
            {/* Estatísticas resumidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-4 flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900/20 h-12 w-12 rounded-lg flex items-center justify-center mr-4">
                  <BarChart4 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Total de Acessos</p>
                  {loading ? (
                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <h3 className="text-2xl font-bold">{metricas.visualizacoes.total.toLocaleString('pt-BR')}</h3>
                  )}
                </div>
              </div>
              
              <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-4 flex items-center">
                <div className="bg-green-100 dark:bg-green-900/20 h-12 w-12 rounded-lg flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Usuários Ativos</p>
                  {loading ? (
                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <h3 className="text-2xl font-bold">{totais.usuarios.toLocaleString('pt-BR')}</h3>
                  )}
                </div>
              </div>
              
              <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-4 flex items-center">
                <div className="bg-amber-100 dark:bg-amber-900/20 h-12 w-12 rounded-lg flex items-center justify-center mr-4">
                  <FileText className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Relatórios Gerados</p>
                  {loading ? (
                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <h3 className="text-2xl font-bold">{totais.relatorios.toLocaleString('pt-BR')}</h3>
                  )}
                </div>
              </div>
              
              <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-4 flex items-center">
                <div className="bg-rose-100 dark:bg-rose-900/20 h-12 w-12 rounded-lg flex items-center justify-center mr-4">
                  <Share2 className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Taxa de Conversão</p>
                  {loading ? (
                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <h3 className="text-2xl font-bold">
                      {totais.respostas > 0 
                        ? Math.round((totais.matches / totais.respostas) * 100) 
                        : 0}%
                    </h3>
                  )}
                </div>
              </div>
            </div>
            
            {/* Gráficos e estatísticas detalhadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Distribuição de Imóveis por Construtora */}
              <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Distribuição de Imóveis por Construtora</h3>
                
                {loading ? (
                  <div className="flex items-center justify-center h-[200px]">
                    <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  </div>
                ) : distribuicao.imoveisPorConstrutora.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[200px] text-center">
                    <div className="text-muted-foreground mb-2">Nenhum dado disponível</div>
                    <p className="text-sm text-muted-foreground">Adicione construtoras e imóveis ao sistema para visualizar esta estatística.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {distribuicao.imoveisPorConstrutora.map((construtora, index) => {
                      const totalImoveis = totais.imoveis || 1; // Evitar divisão por zero
                      const percentual = Math.round((construtora._count.imoveis / totalImoveis) * 100);
                      
                      return (
                        <div key={construtora.id} className="space-y-1">
                          <div className="flex justify-between items-center text-sm">
                            <span>{construtora.nome}</span>
                            <span className="font-medium">{percentual}% ({construtora._count.imoveis})</span>
                          </div>
                          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full" 
                              style={{ 
                                width: `${percentual}%`,
                                backgroundColor: index === 0 ? '#4285F4' : 
                                                index === 1 ? '#4ECDC4' : 
                                                index === 2 ? '#FF6B6B' :
                                                index === 3 ? '#FFE66D' : '#C7F464'
                              }} 
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              {/* Gráfico de Visualizações (mockado) */}
              <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Visualizações ao Longo do Tempo</h3>
                {loading ? (
                  <div className="flex items-center justify-center h-[200px]">
                    <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <div className="h-[200px]">
                    <GraficoVisualizacoes dados={historicoAtividade} />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="imoveis" className="space-y-6">
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Desempenho de Imóveis</h3>
              <div className="overflow-x-auto">
                <TabelaImoveis />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="acessos" className="space-y-6">
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Mapa de Calor de Acessos</h3>
              <div className="h-[400px]">
                <MapaCalor />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="usuarios" className="space-y-6">
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Dados Demográficos de Usuários</h3>
              <p>Dados demográficos serão implementados em breve.</p>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
}
