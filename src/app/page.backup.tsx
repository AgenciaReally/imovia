"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Importar tipos compartilhados
import { Imovel } from "@/types/imovel";
import { FormularioDinamico } from "@/components/home/FormularioDinamico";
import { enviarRespostas, solicitarRelatorio } from "@/components/home/api-service";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Home as HomeIcon, User, Mail, Phone, Eye, EyeOff, Check, X, Clock, Bath, Car, Square, Loader2 } from "lucide-react";
import { enviarRelatorio } from "@/services/relatorio-service";
import { SearchParamsHandler } from "@/components/home/SearchParamsHandler";
import { RelatorioModal } from '@/components/ui/relatorio-modal'
import { Poppins } from "next/font/google";
import { ModalAutenticacao } from "@/components/auth/ModalAutenticacao";
import { getUserSession } from "@/lib/auth-client";
import { useAnalytics } from "@/hooks/useAnalytics";

// 🚀 SISTEMA DE LOGGING GLOBAL EM TEMPO REAL
class GlobalLogger {
  private logs: string[] = [];
  private sessionId: string;
  private startTime: number;
  
  constructor() {
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.startTime = Date.now();
    this.log('🌟 [INIT] GlobalLogger inicializado', { 
      sessionId: this.sessionId,
      timestamp: new Date().toISOString()
    });
  }

  log(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const elapsedMs = Date.now() - this.startTime;
    const elapsedFormatted = `${(elapsedMs / 1000).toFixed(2)}s`;
    
    let logEntry = `[${timestamp}] [+${elapsedFormatted}] ${message}`;
    
    if (data) {
      logEntry += `\n📊 Data: ${JSON.stringify(data, null, 2)}`;
    }
    
    this.logs.push(logEntry);
    console.log(`🔍 [GLOBAL LOG] ${message}`, data || '');
    
    // Limitar logs para não explodir memória (manter últimos 500)
    if (this.logs.length > 500) {
      this.logs = this.logs.slice(-500);
    }
  }

  exportLogs(filename?: string) {
    const finalFilename = filename || `logs_${this.sessionId}.txt`;
    const logContent = this.logs.join('\n\n');
    
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = finalFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    this.log('📁 [EXPORT] Logs exportados', { filename: finalFilename, totalLogs: this.logs.length });
  }

  getSessionId() {
    return this.sessionId;
  }

  getAllLogs() {
    return this.logs;
  }
}

// Criar instância global
const globalLogger = new GlobalLogger();

// Expor globalmente para debug
if (typeof window !== 'undefined') {
  (window as any).globalLogger = globalLogger;
}

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap"
});

// Definir o tipo completo das respostas com todas as propriedades
type RespostasCompletas = {
  [key: string]: string | number | boolean;
  // Propriedades específicas importantes
  fluxoAtual?: string;
  limiteCredito?: number;
  finalizacaoRapida?: boolean;
};

export default function Home() {
  globalLogger.log('🏠 [HOME] Componente Home carregando...');
  
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  const [imoveisEncontrados, setImoveisEncontrados] = useState<Imovel[]>([]);
  const [analisandoIA, setAnalisandoIA] = useState(false);
  const [showMatches, setShowMatches] = useState(false);
  const [currentLimit, setCurrentLimit] = useState<number | null>(null);
  const [showRelatorioModal, setShowRelatorioModal] = useState(false);
  const [mostrarDialogoEmail, setMostrarDialogoEmail] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);
  const [usuarioAutenticado, setUsuarioAutenticado] = useState<any>(null);
  const [mostrarModalAuth, setMostrarModalAuth] = useState(false);
  const { toast } = useToast();
  const { track } = useAnalytics();

  // Estado do relatório
  const [relatorioState, setRelatorioState] = useState({
    loading: false,
    data: null as any,
    error: null as string | null
  });

  useEffect(() => {
    globalLogger.log('🎯 [USEEFFECT] Hook de inicialização executado');
    
    // Verificar se o usuário está autenticado
    const checkAuth = async () => {
      try {
        globalLogger.log('🔐 [AUTH] Verificando autenticação do usuário...');
        const session = await getUserSession();
        if (session?.user) {
          globalLogger.log('✅ [AUTH] Usuário autenticado encontrado', { 
            userId: session.user.id, 
            email: session.user.email 
          });
          setUsuarioAutenticado(session.user);
        } else {
          globalLogger.log('❌ [AUTH] Nenhum usuário autenticado');
        }
      } catch (error) {
        globalLogger.log('⚠️ [AUTH] Erro ao verificar autenticação', { 
          error: error instanceof Error ? error.message : String(error) 
        });
      }
    };

    checkAuth();
  }, []);

  const handleQuestionarioConcluido = async (respostas: RespostasCompletas) => {
    globalLogger.log('✅ [QUESTIONARIO] Questionário concluído!', {
      totalRespostas: Object.keys(respostas).length,
      temLimiteCredito: !!respostas.limiteCredito,
      limiteCredito: respostas.limiteCredito,
      fluxoAtual: respostas.fluxoAtual,
      finalizacaoRapida: respostas.finalizacaoRapida
    });

    // Armazenar limite de crédito
    if (respostas.limiteCredito) {
      setCurrentLimit(respostas.limiteCredito as number);
      globalLogger.log('💰 [LIMITE] Limite de crédito definido', { limite: respostas.limiteCredito });
    }

    // Esconder formulário e mostrar loading de análise
    setMostrarFormulario(false);
    setAnalisandoIA(true);

    try {
      globalLogger.log('🚀 [ANALISE] Iniciando análise de imóveis...');
      
      await executarAnaliseDeepseek(respostas);
    } catch (error) {
      globalLogger.log('❌ [ANALISE] Erro na análise', { 
        error: error instanceof Error ? error.message : String(error) 
      });
      
      toast({
        title: "Erro na análise",
        description: "Ocorreu um erro ao analisar os imóveis. Tente novamente.",
        variant: "destructive",
      });
      
      setMostrarFormulario(true);
      setAnalisandoIA(false);
    }
  };

  const executarAnaliseDeepseek = async (respostas: RespostasCompletas) => {
    globalLogger.log('🤖 [DEEPSEEK] Executando análise via Deepseek...', {
      totalRespostas: Object.keys(respostas).length,
      limiteCredito: respostas.limiteCredito,
      finalizacaoRapida: respostas.finalizacaoRapida
    });

    try {
      const payload = {
        respostas: respostas,
        limiteCredito: respostas.limiteCredito || 300000, // Fallback para R$ 300k
        fluxoAtual: respostas.fluxoAtual || 'completo'
      };

      globalLogger.log('📡 [DEEPSEEK] Enviando payload para API...', {
        payloadKeys: Object.keys(payload),
        limiteCredito: payload.limiteCredito,
        fluxoAtual: payload.fluxoAtual,
        totalRespostas: Object.keys(payload.respostas).length
      });

      const response = await fetch('/api/analise-deepseek', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      globalLogger.log('📡 [DEEPSEEK] Resposta da API recebida', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        const errorText = await response.text();
        globalLogger.log('❌ [DEEPSEEK] Erro na resposta da API', { 
          status: response.status, 
          errorText: errorText.substring(0, 500) 
        });
        throw new Error(`Erro na API: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      globalLogger.log('✅ [DEEPSEEK] Dados recebidos com sucesso', {
        temImoveis: !!data.imoveis,
        totalImoveis: data.imoveis?.length || 0,
        temRelatorio: !!data.relatorio,
        dataKeys: Object.keys(data)
      });

      if (data.imoveis && data.imoveis.length > 0) {
        setImoveisEncontrados(data.imoveis);
        
        globalLogger.log('🏠 [IMOVEIS] Imóveis definidos no estado', {
          totalImoveis: data.imoveis.length,
          primeiroImovel: data.imoveis[0] ? {
            id: data.imoveis[0].id,
            valor: data.imoveis[0].valor,
            endereco: data.imoveis[0].endereco?.substring(0, 50) + '...'
          } : null
        });

        // Salvar dados do relatório no localStorage para o mapa interativo
        if (data.relatorio) {
          const mapData = {
            imoveis: data.imoveis,
            relatorio: data.relatorio,
            timestamp: Date.now()
          };
          
          const mapId = `map_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem(`mapa_${mapId}`, JSON.stringify(mapData));
          
          globalLogger.log('💾 [LOCALSTORAGE] Dados salvos para mapa interativo', {
            mapId,
            totalImoveis: data.imoveis.length,
            temRelatorio: !!data.relatorio
          });
        }

        // Mostrar modal de matches
        setShowMatches(true);
        setAnalisandoIA(false);
        
        globalLogger.log('✅ [SUCCESS] Análise concluída com sucesso - mostrando matches');
      } else {
        globalLogger.log('⚠️ [NOMATCHES] Nenhum imóvel encontrado na resposta');
        
        toast({
          title: "Nenhum imóvel encontrado",
          description: "Não encontramos imóveis que correspondam ao seu perfil. Tente ajustar os filtros.",
          variant: "destructive",
        });
        
        setMostrarFormulario(true);
        setAnalisandoIA(false);
      }

    } catch (error) {
      globalLogger.log('❌ [DEEPSEEK] Erro na execução da análise', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      
      setAnalisandoIA(false);
      throw error; // Re-throw para ser capturado pelo caller
    }
  };

  const handleSolicitarRelatorio = async () => {
    globalLogger.log('📊 [RELATORIO] Solicitação de relatório iniciada...');
    
    if (!usuarioAutenticado) {
      globalLogger.log('🔐 [RELATORIO] Usuário não autenticado - exibindo modal de autenticação');
      setMostrarModalAuth(true);
      return;
    }

    setRelatorioState({ loading: true, data: null, error: null });
    
    try {
      globalLogger.log('📡 [RELATORIO] Enviando solicitação para API...');
      
      const relatorioData = await enviarRelatorio({
        imoveis: imoveisEncontrados,
        usuarioId: usuarioAutenticado.id,
        limiteCredito: currentLimit || 300000
      });

      globalLogger.log('✅ [RELATORIO] Relatório gerado com sucesso', {
        temDados: !!relatorioData,
        dataKeys: relatorioData ? Object.keys(relatorioData) : []
      });

      setRelatorioState({ 
        loading: false, 
        data: relatorioData, 
        error: null 
      });
      
      setShowRelatorioModal(true);
      
      // Tracking
      track('relatorio_solicitado', {
        user_id: usuarioAutenticado.id,
        total_imoveis: imoveisEncontrados.length,
        limite_credito: currentLimit
      });

    } catch (error) {
      globalLogger.log('❌ [RELATORIO] Erro ao gerar relatório', {
        error: error instanceof Error ? error.message : String(error)
      });
      
      setRelatorioState({ 
        loading: false, 
        data: null, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      });
      
      toast({
        title: "Erro ao gerar relatório",
        description: "Ocorreu um erro ao gerar o relatório. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const resetarFluxo = () => {
    globalLogger.log('🔄 [RESET] Resetando fluxo da aplicação...');
    
    setMostrarFormulario(true);
    setShowMatches(false);
    setImoveisEncontrados([]);
    setAnalisandoIA(false);
    setCurrentLimit(null);
    setRelatorioState({ loading: false, data: null, error: null });
    
    globalLogger.log('✅ [RESET] Fluxo resetado com sucesso');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 ${poppins.className}`}>
      <globalLogger.log('🎨 [RENDER] Renderizando página Home...');
      
      <Suspense fallback={<div>Carregando parâmetros...</div>}>
        <SearchParamsHandler />
      </Suspense>

      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {mostrarFormulario && (
            <motion.div
              key="formulario"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Encontre seu Imóvel dos Sonhos
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Responda algumas perguntas e nossa IA encontrará os melhores imóveis para você
                </p>
              </div>

              <FormularioDinamico 
                onComplete={handleQuestionarioConcluido}
              />
            </motion.div>
          )}

          {analisandoIA && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center min-h-[600px]"
            >
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Analisando suas preferências
                </h2>
                <p className="text-gray-600">
                  Nossa IA está buscando os melhores imóveis para você...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Matches Modal */}
        {showMatches && (
          <Dialog open={showMatches} onOpenChange={setShowMatches}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogTitle>Imóveis Encontrados</DialogTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {imoveisEncontrados.map((imovel) => (
                  <div key={imovel.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold">{imovel.titulo}</h3>
                    <p className="text-gray-600">{imovel.endereco}</p>
                    <p className="text-lg font-bold text-green-600">
                      R$ {imovel.valor?.toLocaleString('pt-BR')}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleSolicitarRelatorio}>
                  Gerar Relatório
                </Button>
                <Button variant="outline" onClick={resetarFluxo}>
                  Nova Busca
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Relatório Modal */}
        <RelatorioModal
          isOpen={showRelatorioModal}
          onClose={() => setShowRelatorioModal(false)}
          data={relatorioState.data}
          loading={relatorioState.loading}
          error={relatorioState.error}
        />

        {/* Modal de Autenticação */}
        <ModalAutenticacao
          isOpen={mostrarModalAuth}
          onClose={() => setMostrarModalAuth(false)}
          onSuccess={(user) => {
            setUsuarioAutenticado(user);
            setMostrarModalAuth(false);
            handleSolicitarRelatorio();
          }}
        />
      </div>

      <Toaster />
    </div>
  );
}
