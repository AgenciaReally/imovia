"use client";

import { useState, useEffect, useRef } from "react";
import { cn, formatCurrency } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Check, ChevronRight, X, PiggyBank, FileCheck, Plus, Minus, Calendar as CalendarIcon, Upload } from 'lucide-react';
import { SimuladorAprovacaoInicial } from './SimuladorAprovacaoInicial';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Para verificações de tipos mais seguras
type FluxoOperacional = "COM_APROVACAO" | "SEM_APROVACAO" | "INFORMACOES_COMPLEMENTARES";
type FluxoTipo = FluxoOperacional | "SIMULACAO_INICIAL" | null;

// Interface auxiliar para garantir segurança de tipos
interface FluxoSet {
  [key: string]: any;
  COM_APROVACAO: any;
  SEM_APROVACAO: any;
  INFORMACOES_COMPLEMENTARES: any;
}

/**
 * Props do componente SimuladorCredito
 */
export interface SimuladorCreditoProps {
  onComplete: (respostas: Record<string, any>) => void;
  onProgress: (progress: number) => void;
  onPerguntaRespondida: (perguntaId: string, resposta: any) => void;
  dadosUsuario?: { nome?: string; email?: string; telefone?: string };
}

/**
 * Componente principal do Simulador de Crédito
 * Implementa um fluxo moderno de simulação com escolha entre aprovação ou não
 */
export const SimuladorCredito: React.FC<SimuladorCreditoProps> = ({
  onComplete,
  onProgress,
  onPerguntaRespondida,
  dadosUsuario = {}
}: SimuladorCreditoProps) => {
  // Estados principais
  const [fluxoSelecionado, setFluxoSelecionado] = useState<FluxoTipo>("SIMULACAO_INICIAL");
  const [etapaAtual, setEtapaAtual] = useState<number>(0);
  const [passoAtual, setPassoAtual] = useState<number>(0);
  const [respostas, setRespostas] = useState<Record<string, any>>({});
  const [progresso, setProgresso] = useState<number>(0);
  const [resultadoAprovacao, setResultadoAprovacao] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [simulacaoInicialRealizada, setSimulacaoInicialRealizada] = useState<boolean>(false);
  const [mostrarSelecaoFluxo, setMostrarSelecaoFluxo] = useState<boolean>(false);
  const [dadosSimulacaoInicial, setDadosSimulacaoInicial] = useState<any>(null);
  
  // Dados de formulário
  const [valorMaximoImovel, setValorMaximoImovel] = useState<number>(500000);
  const [cpf, setCpf] = useState<string>("");
  const [estadoCivil, setEstadoCivil] = useState<string | null>(null);
  const [comprovanteRenda, setComprovanteRenda] = useState<string>("");
  const [comprovanteEndereco, setComprovanteEndereco] = useState<string>("");
  const [carteiraTrabalho, setCarteiraTrabalho] = useState<string>("");
  const [irpf, setIrpf] = useState<string>("");
  const [escolaridade, setEscolaridade] = useState<string>("");
  const [outrosCompradores, setOutrosCompradores] = useState<"sim" | "nao" | null>(null);
  const [rendaMensal, setRendaMensal] = useState<string>("");
  
  // Estados para controle de upload de arquivos
  const [uploadingRendaFile, setUploadingRendaFile] = useState<boolean>(false);
  const [uploadingEnderecoFile, setUploadingEnderecoFile] = useState<boolean>(false);
  const [uploadingCarteiraFile, setUploadingCarteiraFile] = useState<boolean>(false);
  const [uploadingIrpfFile, setUploadingIrpfFile] = useState<boolean>(false);
  
  const [rendaFileName, setRendaFileName] = useState<string>("");
  const [enderecoFileName, setEnderecoFileName] = useState<string>("");
  const [carteiraFileName, setCarteiraFileName] = useState<string>("");
  const [irpfFileName, setIrpfFileName] = useState<string>("");
  const [outrosFinanciamentos, setOutrosFinanciamentos] = useState<"sim" | "nao" | null>(null);
  const [dataNascimento, setDataNascimento] = useState<Date | undefined>();
  const [fgts, setFgts] = useState<string>("");
  const [prazoFinanciamento, setPrazoFinanciamento] = useState<string>("");
  const [tipoImovel, setTipoImovel] = useState<string>("");
  const [entradaVista, setEntradaVista] = useState<number>(0);
  const [valorParcela, setValorParcela] = useState<number>(0);
  const [mesesPagamento, setMesesPagamento] = useState<string>("");
  const [mesesPagamentoCustom, setMesesPagamentoCustom] = useState<string>("");
  const [custoTransferencia, setCustoTransferencia] = useState<number>(0);
  const [valorMobiliar, setValorMobiliar] = useState<number>(0);
  
  // Definição dos fluxos e etapas
  const fluxos = {
    SIMULACAO_INICIAL: {
      titulo: "Simulador Rápido de Crédito",
      descricao: "Verifique sua capacidade de financiamento em menos de 1 minuto",
      icon: <PiggyBank className="w-6 h-6 text-orange-500" />,
      etapas: []
    },
    COM_APROVACAO: {
      titulo: "Simulação com Pré-aprovação de Crédito",
      descricao: "Simule o valor aprovado com base em seus documentos",
      icon: <FileCheck className="w-6 h-6 text-orange-500" />,
      etapas: [
        {
          titulo: "Documentos",
          campos: [
            "comprovanteRenda"
          ]
        },
        {
          titulo: "Informações Adicionais",
          campos: ["carteiraTrabalho", "irpf", "escolaridade", "outrosCompradores"]
        }
      ]
    },
    SEM_APROVACAO: {
      titulo: "Simulação sem Pré-aprovação",
      descricao: "Simule com base na sua renda e condições",
      icon: <PiggyBank className="w-6 h-6 text-orange-500" />,
      etapas: [
        {
          titulo: "Informações Complementares",
          campos: [
            "outrosFinanciamentos",
            "dataNascimento"
          ]
        }
      ]
    },
    INFORMACOES_COMPLEMENTARES: {
      titulo: "Informações Complementares",
      descricao: "Complete para termos resultados mais precisos",
      icon: <Plus className="w-6 h-6 text-orange-500" />,
      etapas: [
        {
          titulo: "Valores e Condições",
          campos: ["entradaVista", "valorParcela", "mesesPagamento", "custoTransferencia", "valorMobiliar"]
        }
      ]
    }
  };

  // Atualizar progresso
  useEffect(() => {
    let novoProgresso = 0;
    
    if (fluxoSelecionado === null) {
      novoProgresso = 0;
    } else if (fluxoSelecionado === "SIMULACAO_INICIAL") {
      novoProgresso = simulacaoInicialRealizada ? 15 : 5;
    } else if (fluxoSelecionado && etapaAtual === 0 && passoAtual === 0) {
      novoProgresso = 20; // Aumentamos para 20 porque já passamos pela simulação inicial
    } else if (fluxoSelecionado && fluxoSelecionado !== null) {
      // Se não é simulação inicial nem null, verificamos se é um fluxo operacional
      const fluxosOperacionais: FluxoOperacional[] = ["COM_APROVACAO", "SEM_APROVACAO", "INFORMACOES_COMPLEMENTARES"];
      const isFluxoOperacional = fluxosOperacionais.includes(fluxoSelecionado as any);
      
      if (isFluxoOperacional) {
        const totalEtapas = fluxoSelecionado === "COM_APROVACAO" ? 2 : 1;
        const porcentagemPorEtapa = 60 / totalEtapas; // Aumentamos para 60% pois os primeiros 20% são da simulação inicial
        
        // Se não estamos na simulação inicial e temos etapas, calculamos o progresso
        if (fluxos[fluxoSelecionado].etapas.length > 0) {
          const camposEtapaAtual = fluxos[fluxoSelecionado].etapas[etapaAtual].campos;
          const porcentagemPorCampo = porcentagemPorEtapa / camposEtapaAtual.length;
          
          novoProgresso = 20 + (etapaAtual * porcentagemPorEtapa) + (passoAtual * porcentagemPorCampo);
        }
      }
    }
    
    if (resultadoAprovacao !== null) {
      novoProgresso = 40; // Primeiro fluxo concluído
    }
    
    setProgresso(novoProgresso);
    onProgress(novoProgresso);
  }, [fluxoSelecionado, etapaAtual, passoAtual, resultadoAprovacao]);

  // Formatar CPF 
  const formatarCPF = (valor: string) => {
    const cpfNumeros = valor.replace(/\D/g, "");
    
    if (cpfNumeros.length <= 3) return cpfNumeros;
    if (cpfNumeros.length <= 6) return `${cpfNumeros.slice(0, 3)}.${cpfNumeros.slice(3)}`;
    if (cpfNumeros.length <= 9) return `${cpfNumeros.slice(0, 3)}.${cpfNumeros.slice(3, 6)}.${cpfNumeros.slice(6)}`;
    return `${cpfNumeros.slice(0, 3)}.${cpfNumeros.slice(3, 6)}.${cpfNumeros.slice(6, 9)}-${cpfNumeros.slice(9, 11)}`;
  };

  // Formatar valor monetário
  const formatarDinheiro = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };
  
  // Formatar string de entrada de dinheiro (para uso em campos de input)
  const formatarEntradaDinheiro = (valor: string) => {
    // Remover caracteres não numéricos
    const apenasNumeros = valor.replace(/\D/g, '');
    
    // Verificar se está vazio
    if (apenasNumeros === '') return '';
    
    // Converter para um número inteiro, depois para string para evitar problemas com números grandes
    const valorNumerico = parseFloat(apenasNumeros) / 100;
    
    // Formatar o número usando toLocaleString (que funciona bem com valores grandes)
    return valorNumerico.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  
  // Converter string formatada para valor numérico
  const extrairNumeroDeStringFormatada = (valor: string) => {
    // Remove todos os caracteres não numéricos, exceto dígitos
    const numeros = valor.replace(/[^0-9]/g, '');
    
    // Converte a string para número (dividindo por 100 para tratar os centavos)
    if (numeros === '') return 0;
    
    // Converte para número usando parseFloat para garantir precisão com números grandes
    const valorNumerico = parseFloat(numeros) / 100;
    return valorNumerico || 0;
  };

  // Avançar para o próximo campo ou etapa
  const avancar = () => {
    const etapaAtualObj = fluxos[fluxoSelecionado!].etapas[etapaAtual];
    const campoAtual = etapaAtualObj.campos[passoAtual];
    
    // Processar caso específico do campo mesesPagamento quando 'outro' for selecionado
    if (campoAtual === 'mesesPagamento' && mesesPagamento === 'outro') {
      // Verificar se o valor personalizado é válido
      if (mesesPagamentoCustom && parseInt(mesesPagamentoCustom) > 0 && parseInt(mesesPagamentoCustom) <= 360) {
        // Atualizar resposta com o valor personalizado 
        onPerguntaRespondida("mesesPagamento", mesesPagamentoCustom);
        
        // Avançar para o próximo campo
        if (passoAtual < etapaAtualObj.campos.length - 1) {
          setPassoAtual(passoAtual + 1);
        } else if (etapaAtual < fluxos[fluxoSelecionado!].etapas.length - 1) {
          setEtapaAtual(etapaAtual + 1);
          setPassoAtual(0);
        } else {
          finalizarFluxo();
        }
      } else {
        // Mostrar alerta se o valor não for válido
        alert("Por favor, insira um valor entre 1 e 360 meses.");
      }
      return;
    }
    
    if (passoAtual < etapaAtualObj.campos.length - 1) {
      // Avançar para o próximo campo na mesma etapa
      setPassoAtual(passoAtual + 1);
    } else if (etapaAtual < fluxos[fluxoSelecionado!].etapas.length - 1) {
      // Avançar para a próxima etapa
      setEtapaAtual(etapaAtual + 1);
      setPassoAtual(0);
    } else {
      // Finalizar fluxo
      finalizarFluxo();
    }
  };

  // Voltar para o campo ou etapa anterior
  const voltar = () => {
    if (fluxoSelecionado === "SIMULACAO_INICIAL") {
      // Não há para onde voltar no formulário inicial
      return;
    }

    // Tratar caso especial do fluxo de Informações Complementares na primeira etapa
    if (fluxoSelecionado === "INFORMACOES_COMPLEMENTARES" && etapaAtual === 0 && passoAtual === 0) {
      // Em vez de voltar para a simulação inicial, voltar para o fluxo anterior
      // (COM_APROVACAO ou SEM_APROVACAO)
      const fluxoOriginal = resultadoAprovacao ? "COM_APROVACAO" : "SEM_APROVACAO";
      setFluxoSelecionado(fluxoOriginal);

      // Pular direto para a última etapa/passo do fluxo original
      const ultimaEtapa = fluxos[fluxoOriginal].etapas.length - 1;
      setEtapaAtual(ultimaEtapa);
      const ultimoPasso = fluxos[fluxoOriginal].etapas[ultimaEtapa].campos.length - 1;
      setPassoAtual(ultimoPasso);
      
      // Remover o modal definindo resultadoAprovacao como null
      setResultadoAprovacao(null);
      return;
    }
    
    if (passoAtual > 0) {
      // Voltar para o campo anterior na mesma etapa
      setPassoAtual(passoAtual - 1);
    } else if (etapaAtual > 0 && fluxoSelecionado && fluxoSelecionado !== null) {
      // Se não é null, verificamos se é um fluxo operacional
      const fluxosOperacionais: FluxoOperacional[] = ["COM_APROVACAO", "SEM_APROVACAO", "INFORMACOES_COMPLEMENTARES"];
      const isFluxoOperacional = fluxosOperacionais.includes(fluxoSelecionado as any);
      
      if (isFluxoOperacional) {
        // Voltar para a etapa anterior
        setEtapaAtual(etapaAtual - 1);
        const camposEtapaAnterior = fluxos[fluxoSelecionado as FluxoOperacional].etapas[etapaAtual - 1].campos;
        setPassoAtual(camposEtapaAnterior.length - 1);
      }
    } else if (simulacaoInicialRealizada) {
      // Voltar para a simulação inicial
      setFluxoSelecionado("SIMULACAO_INICIAL");
      setEtapaAtual(0);
      setPassoAtual(0);
    } else {
      // Voltar para a seleção de fluxo
      setFluxoSelecionado(null);
      setEtapaAtual(0);
      setPassoAtual(0);
    }
  };

  // Estados para a animação de IA
  const [mostrarAnimacaoIA, setMostrarAnimacaoIA] = useState<boolean>(false);
  const [animacaoTerminou, setAnimacaoTerminou] = useState<boolean>(false);
  const [fraseAnimacaoIA, setFraseAnimacaoIA] = useState<string>('');
  const frasesAnimacao = [
    "Analisando seu perfil financeiro...",
    "Calculando capacidade de endividamento...",
    "Processando modelos preditivos...",
    "Consultando oportunidades imobiliárias...",
    "Aplicando algoritmos de correspondência...",
    "Identificando melhores opções...",
    "Finalizando análise personalizada..." 
  ];

  // Função para tratar a resposta do SimuladorAprovacaoInicial
  const handleSimulacaoInicial = (dadosSimulacao: {
    aprovado: boolean;
    rendaMensal: number;
    valorImovel: number;
    entradaDisponivel: number;
    valorParcelaMaxima: number;
    temOutrosEmprestimos: boolean | null;
    score: number | null;
  }) => {
    // Iniciar a animação de IA
    setMostrarAnimacaoIA(true);
    
    // Salvar os dados da simulação
    setSimulacaoInicialRealizada(true);
    setDadosSimulacaoInicial(dadosSimulacao);
    
    // Configurar valores iniciais com base na simulação
    setValorMaximoImovel(dadosSimulacao.valorImovel);
    setRendaMensal(dadosSimulacao.rendaMensal.toString());
    setEntradaVista(dadosSimulacao.entradaDisponivel);
    setValorParcela(dadosSimulacao.valorParcelaMaxima);
    setOutrosFinanciamentos(dadosSimulacao.temOutrosEmprestimos ? "sim" : "nao");
    
    // Adicionar dados ao objeto de respostas
    setRespostas(prev => ({
      ...prev,
      simulacaoInicial: {
        realizada: true,
        ...dadosSimulacao
      }
    }));
    
    // Informar ao componente pai que uma pergunta foi respondida
    onPerguntaRespondida('simulacaoInicial', { 
      realizada: true, 
      aprovado: dadosSimulacao.aprovado,
      dados: dadosSimulacao 
    });

    // Animar as frases em sequência
    let fraseIndex = 0;
    const animarFrases = () => {
      if (fraseIndex < frasesAnimacao.length) {
        setFraseAnimacaoIA(frasesAnimacao[fraseIndex]);
        fraseIndex++;
        setTimeout(animarFrases, 1200); // Troca de frases a cada 1.2 segundos
      } else {
        // Finalizar animação e mostrar a seleção de fluxo
        setTimeout(() => {
          setAnimacaoTerminou(true);
          setTimeout(() => {
            setMostrarAnimacaoIA(false);
            setAnimacaoTerminou(false);
            setMostrarSelecaoFluxo(true);
          }, 500);
        }, 800);
      }
    };
    
    // Iniciar animação das frases
    animarFrases();
  };

  // Finalizar o fluxo atual
  const finalizarFluxo = () => {
    setLoading(true);
    
    // Consolidar todas as respostas
    const todasRespostas = {
      fluxo: fluxoSelecionado,
      ...respostas
    };
    
    // Simulação de processamento do resultado
    setTimeout(() => {
      // Cálculo simulado de aprovação baseado nas respostas
      let aprovado = false;
      
      if (fluxoSelecionado === "COM_APROVACAO") {
        // No fluxo com aprovação, verifica documentação
        aprovado = comprovanteRenda === "sim" && comprovanteEndereco === "sim" && estadoCivil === "sim";
        
        // Atualizar respostas individuais
        onPerguntaRespondida("seed-AVALIACAO_CREDITO-1", valorMaximoImovel);
        onPerguntaRespondida("seed-AVALIACAO_CREDITO-2", cpf);
        onPerguntaRespondida("seed-AVALIACAO_CREDITO-3", estadoCivil);
        
        // Enviar respostas com nomes dos arquivos para os documentos
        onPerguntaRespondida("seed-AVALIACAO_CREDITO-4", {
          resposta: comprovanteRenda,
          arquivo: rendaFileName || ""
        });
        onPerguntaRespondida("seed-AVALIACAO_CREDITO-5", {
          resposta: comprovanteEndereco,
          arquivo: enderecoFileName || ""
        });
        onPerguntaRespondida("seed-AVALIACAO_CREDITO-6", {
          resposta: carteiraTrabalho,
          arquivo: carteiraFileName || ""
        });
        onPerguntaRespondida("seed-AVALIACAO_CREDITO-7", {
          resposta: irpf,
          arquivo: irpfFileName || ""
        });
        onPerguntaRespondida("seed-AVALIACAO_CREDITO-8", escolaridade);
        onPerguntaRespondida("seed-AVALIACAO_CREDITO-9", outrosCompradores);
      } else if (fluxoSelecionado === "SEM_APROVACAO") {
        // No fluxo sem aprovação, consideramos renda e outros fatores
        const rendaSuficiente = rendaMensal === "5001_10000" || rendaMensal === "acima_10000";
        const semComprometimentos = outrosFinanciamentos === "nao";
        aprovado = rendaSuficiente && semComprometimentos;
        
        // Atualizar respostas individuais
        onPerguntaRespondida("seed-AVALIACAO_CREDITO-10", rendaMensal);
        onPerguntaRespondida("seed-AVALIACAO_CREDITO-11", outrosFinanciamentos);
        onPerguntaRespondida("seed-AVALIACAO_CREDITO-12", dataNascimento);
      } else if (fluxoSelecionado === "INFORMACOES_COMPLEMENTARES") {
        // No fluxo de informações complementares
        onPerguntaRespondida("seed-INFO_COMPLEMENTARES-1", entradaVista);
        onPerguntaRespondida("seed-INFO_COMPLEMENTARES-2", valorParcela);
        onPerguntaRespondida("seed-INFO_COMPLEMENTARES-3", mesesPagamento);
        onPerguntaRespondida("seed-INFO_COMPLEMENTARES-4", custoTransferencia);
        onPerguntaRespondida("seed-INFO_COMPLEMENTARES-5", valorMobiliar);
        
        // Atualizar progresso
        if (onProgress) {
          onProgress(75);
        }
        
        // Chamar o callback de conclusão para avançar para próximos questionários
        // (Preferências, Imóvel ideal, etc.)
        if (onComplete) {
          onComplete(todasRespostas);
        }
        
        setLoading(false);
        return;
      }
      
      setResultadoAprovacao(aprovado);
      setLoading(false);
      
      // Avançar diretamente para o fluxo de informações complementares
      // sem mostrar o modal de resultado
      setFluxoSelecionado("INFORMACOES_COMPLEMENTARES");
      setEtapaAtual(0);
      setPassoAtual(0);
    }, 1000);
  };

  // Finalizar o fluxo complementar e enviar tudo
  const finalizarFluxoComplementar = () => {
    // Atualizar respostas individuais para informações complementares
    onPerguntaRespondida("seed-INFORMACOES_COMPLEMENTARES-1", entradaVista);
    onPerguntaRespondida("seed-INFORMACOES_COMPLEMENTARES-2", valorParcela);
    onPerguntaRespondida("seed-INFORMACOES_COMPLEMENTARES-3", mesesPagamento);
    onPerguntaRespondida("seed-INFORMACOES_COMPLEMENTARES-4", custoTransferencia);
    onPerguntaRespondida("seed-INFORMACOES_COMPLEMENTARES-5", valorMobiliar);
    
    // Finalizar o formulário completo
    onComplete(respostas);
  };

  // Obter campo atual
  const getCampoAtual = (): string | null => {
    if (!fluxoSelecionado) return null;
    
    // Se estamos na etapa de simulação inicial, não há um campo específico
    const etapaSimulacaoInicial = fluxoSelecionado === "SIMULACAO_INICIAL";
    if (etapaSimulacaoInicial) return null;
    
    // Verificar se o fluxo selecionado é um dos fluxos operacionais
    const fluxosOperacionais: FluxoOperacional[] = ["COM_APROVACAO", "SEM_APROVACAO", "INFORMACOES_COMPLEMENTARES"];
    const isFluxoOperacional = fluxosOperacionais.includes(fluxoSelecionado as FluxoOperacional);
                             
    if (!isFluxoOperacional) return null;
    
    return fluxos[fluxoSelecionado as FluxoOperacional].etapas[etapaAtual].campos[passoAtual];
  };
    
  // Função para verificar se pode prosseguir para o próximo campo
  const podeProsseguir = (): boolean => {
    if (!fluxoSelecionado) return false;
    
    // Se estiver na simulação inicial, não precisamos verificar campos
    const etapaSimulacaoInicial = fluxoSelecionado === "SIMULACAO_INICIAL";
    if (etapaSimulacaoInicial) return true;
    
    const campoAtual = getCampoAtual();
    if (!campoAtual) return false;
    
    switch (campoAtual) {
      // Campos relacionados a documentos (com pré-aprovação)
      case "comprovanteRenda":
        return comprovanteRenda !== null;
      case "comprovanteEndereco":
        return comprovanteEndereco !== null;
      case "carteiraTrabalho":
        return carteiraTrabalho !== null;
      case "irpf":
        return irpf !== null;
      
      // Campos opcionais
      case "entradaVista":
        return true; 
      case "valorParcela":
        return valorParcela > 0;
      case "mesesPagamento":
        return mesesPagamento !== "";
      case "custoTransferencia":
        return true;
      
      // Campos para simulação sem pré-aprovação
      case "fgts":
        return true; // Opcional
      case "prazoFinanciamento":
        return prazoFinanciamento !== "";
      case "tipoImovel":
        return tipoImovel !== "";
      case "valorMobiliar":
        return true; // Opcional
      default:
        return true;
    }
  };
  
  // Renderizar campo conforme o tipo
  const renderizarCampo = () => {
    if (!fluxoSelecionado) return null;
    
    const campoAtual = getCampoAtual();
    
    switch (campoAtual) {
      case "valorMaximoImovel":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Qual é o valor máximo do imóvel que você considera?</Label>
              <div className="relative pt-5">
                <Slider
                  value={[valorMaximoImovel]}
                  min={200000}
                  max={3000000}
                  step={50000}
                  onValueChange={(values) => setValorMaximoImovel(values[0])}
                  className="my-6"
                />
                <div className="absolute inset-x-0 -top-1 flex justify-between">
                  <span className="text-sm text-muted-foreground">R$ 200 mil</span>
                  <span className="text-sm text-muted-foreground">R$ 3 milhões</span>
                </div>
              </div>
              <div className="text-center">
                <span className="text-2xl font-semibold text-orange-500">{formatarDinheiro(valorMaximoImovel)}</span>
              </div>
            </div>
          </div>
        );
        
      case "cpf":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Informe seu CPF</Label>
              <Input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(formatarCPF(e.target.value))}
                maxLength={14}
                placeholder="000.000.000-00"
                className="text-base"
              />
              <p className="text-sm text-muted-foreground">Utilizamos seu CPF para verificar sua elegibilidade.</p>
            </div>
          </div>
        );

      case "estadoCivil":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Possui comprovante de estado civil?</Label>
              <RadioGroup
                value={estadoCivil || ""}
                onValueChange={(value) => setEstadoCivil(value as "sim" | "nao")}
                className="grid grid-cols-2 gap-4 pt-2"
              >
                <Label
                  htmlFor="estadoCivil-sim"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground",
                    estadoCivil === "sim" && "border-orange-500 bg-orange-50"
                  )}
                >
                  <RadioGroupItem value="sim" id="estadoCivil-sim" className="sr-only" />
                  <Check className={cn("h-6 w-6", estadoCivil === "sim" ? "text-orange-500" : "text-muted")} />
                  <span className="mt-2">Sim</span>
                </Label>
                <Label
                  htmlFor="estadoCivil-nao"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground",
                    estadoCivil === "nao" && "border-orange-500 bg-orange-50"
                  )}
                >
                  <RadioGroupItem value="nao" id="estadoCivil-nao" className="sr-only" />
                  <X className={cn("h-6 w-6", estadoCivil === "nao" ? "text-orange-500" : "text-muted")} />
                  <span className="mt-2">Não</span>
                </Label>
              </RadioGroup>
            </div>
          </div>
        );

      case "comprovanteRenda":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Possui comprovante de renda atualizado?</Label>
              <RadioGroup
                value={comprovanteRenda || ""}
                onValueChange={(value) => setComprovanteRenda(value as "sim" | "nao")}
                className="grid grid-cols-2 gap-4 pt-2"
              >
                <Label
                  htmlFor="renda-sim"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground",
                    comprovanteRenda === "sim" && "border-orange-500 bg-orange-50"
                  )}
                >
                  <RadioGroupItem value="sim" id="renda-sim" className="sr-only" />
                  <Check className={cn("h-6 w-6", comprovanteRenda === "sim" ? "text-orange-500" : "text-muted")} />
                  <span className="mt-2">Sim</span>
                </Label>
                <Label
                  htmlFor="renda-nao"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground",
                    comprovanteRenda === "nao" && "border-orange-500 bg-orange-50"
                  )}
                >
                  <RadioGroupItem value="nao" id="renda-nao" className="sr-only" />
                  <X className={cn("h-6 w-6", comprovanteRenda === "nao" ? "text-orange-500" : "text-muted")} />
                  <span className="mt-2">Não</span>
                </Label>
              </RadioGroup>
              
              {/* Campo de upload que aparece quando 'Sim' é selecionado */}
              {comprovanteRenda === "sim" && (
                <div className="mt-4 p-4 border rounded-md border-orange-200 bg-orange-50">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Envie seu comprovante de renda:</p>
                      {rendaFileName && !uploadingRendaFile && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex gap-1">
                          <Check className="h-3 w-3" /> Enviado
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="comprovanteRendaFile" className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${uploadingRendaFile ? 'bg-orange-50 border-orange-300' : 'bg-gray-50 hover:bg-gray-100 border-gray-300'} ${rendaFileName ? 'bg-green-50 border-green-300 hover:bg-green-100' : ''}`}>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {uploadingCarteiraFile ? (
                            <>
                              <div className="h-8 w-8 mb-3 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"></div>
                              <p className="mb-2 text-sm text-orange-600">Enviando arquivo...</p>
                            </>
                          ) : carteiraFileName ? (
                            <>
                              <Check className="w-8 h-8 mb-3 text-green-500" />
                              <p className="mb-2 text-sm text-green-600"><span className="font-semibold">{carteiraFileName}</span></p>
                              <p className="text-xs text-green-500">Clique para alterar o arquivo</p>
                            </>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 mb-3 text-gray-400" />
                              <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Clique para enviar</span> ou arraste arquivos</p>
                              <p className="text-xs text-gray-500">PDF, JPG, PNG ou HEIC (máx. 10MB)</p>
                            </>
                          )}
                        </div>
                        <input 
                          id="comprovanteRendaFile" 
                          type="file" 
                          className="hidden" 
                          accept=".pdf,.jpg,.jpeg,.png,.heic"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                              const file = files[0];
                              // Iniciar processo de upload
                              setUploadingRendaFile(true);
                              
                              // Simular/processar o upload do arquivo
                              setTimeout(() => {
                                // Em produção, aqui você faria uma chamada para salvar o arquivo em /public
                                // Por exemplo: usando fetch() para enviar para uma API que salva o arquivo
                                
                                console.log("Arquivo de comprovante de renda enviado:", file.name);
                                setRendaFileName(file.name);
                                setUploadingRendaFile(false);
                              }, 1500);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case "comprovanteEndereco":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Possui comprovante de endereço atualizado?</Label>
              <RadioGroup
                value={comprovanteEndereco || ""}
                onValueChange={(value) => setComprovanteEndereco(value as "sim" | "nao")}
                className="grid grid-cols-2 gap-4 pt-2"
              >
                <Label
                  htmlFor="endereco-sim"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground",
                    comprovanteEndereco === "sim" && "border-orange-500 bg-orange-50"
                  )}
                >
                  <RadioGroupItem value="sim" id="endereco-sim" className="sr-only" />
                  <Check className={cn("h-6 w-6", comprovanteEndereco === "sim" ? "text-orange-500" : "text-muted")} />
                  <span className="mt-2">Sim</span>
                </Label>
                <Label
                  htmlFor="endereco-nao"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground",
                    comprovanteEndereco === "nao" && "border-orange-500 bg-orange-50"
                  )}
                >
                  <RadioGroupItem value="nao" id="endereco-nao" className="sr-only" />
                  <X className={cn("h-6 w-6", comprovanteEndereco === "nao" ? "text-orange-500" : "text-muted")} />
                  <span className="mt-2">Não</span>
                </Label>
              </RadioGroup>
              
              {/* Campo de upload que aparece quando 'Sim' é selecionado */}
              {comprovanteEndereco === "sim" && (
                <div className="mt-4 p-4 border rounded-md border-orange-200 bg-orange-50">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Envie seu comprovante de endereço:</p>
                      {enderecoFileName && !uploadingEnderecoFile && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex gap-1">
                          <Check className="h-3 w-3" /> Enviado
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="comprovanteEnderecoFile" className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${uploadingEnderecoFile ? 'bg-orange-50 border-orange-300' : 'bg-gray-50 hover:bg-gray-100 border-gray-300'} ${enderecoFileName ? 'bg-green-50 border-green-300 hover:bg-green-100' : ''}`}>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {uploadingCarteiraFile ? (
                            <>
                              <div className="h-8 w-8 mb-3 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"></div>
                              <p className="mb-2 text-sm text-orange-600">Enviando arquivo...</p>
                            </>
                          ) : carteiraFileName ? (
                            <>
                              <Check className="w-8 h-8 mb-3 text-green-500" />
                              <p className="mb-2 text-sm text-green-600"><span className="font-semibold">{carteiraFileName}</span></p>
                              <p className="text-xs text-green-500">Clique para alterar o arquivo</p>
                            </>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 mb-3 text-gray-400" />
                              <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Clique para enviar</span> ou arraste arquivos</p>
                              <p className="text-xs text-gray-500">PDF, JPG, PNG ou HEIC (máx. 10MB)</p>
                            </>
                          )}
                        </div>
                        <input 
                          id="comprovanteEnderecoFile" 
                          type="file" 
                          className="hidden" 
                          accept=".pdf,.jpg,.jpeg,.png,.heic"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                              const file = files[0];
                              // Iniciar processo de upload
                              setUploadingEnderecoFile(true);
                              
                              // Simular/processar o upload do arquivo
                              setTimeout(() => {
                                // Em produção, aqui você faria uma chamada para salvar o arquivo em /public
                                console.log("Arquivo de comprovante de endereço enviado:", file.name);
                                setEnderecoFileName(file.name);
                                setUploadingEnderecoFile(false);
                              }, 1500);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case "carteiraTrabalho":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Possui carteira de trabalho?</Label>
              <RadioGroup
                value={carteiraTrabalho || ""}
                onValueChange={(value) => setCarteiraTrabalho(value as "sim" | "nao" | "nao_se_aplica")}
                className="grid grid-cols-3 gap-4 pt-2"
              >
                <Label
                  htmlFor="carteira-sim"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground",
                    carteiraTrabalho === "sim" && "border-orange-500 bg-orange-50"
                  )}
                >
                  <RadioGroupItem value="sim" id="carteira-sim" className="sr-only" />
                  <Check className={cn("h-6 w-6", carteiraTrabalho === "sim" ? "text-orange-500" : "text-muted")} />
                  <span className="mt-2">Sim</span>
                </Label>
                <Label
                  htmlFor="carteira-nao"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground",
                    carteiraTrabalho === "nao" && "border-orange-500 bg-orange-50"
                  )}
                >
                  <RadioGroupItem value="nao" id="carteira-nao" className="sr-only" />
                  <X className={cn("h-6 w-6", carteiraTrabalho === "nao" ? "text-orange-500" : "text-muted")} />
                  <span className="mt-2">Não</span>
                </Label>
                <Label
                  htmlFor="carteira-na"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground",
                    carteiraTrabalho === "nao_se_aplica" && "border-orange-500 bg-orange-50"
                  )}
                >
                  <RadioGroupItem value="nao_se_aplica" id="carteira-na" className="sr-only" />
                  <span className="h-6 w-6 flex items-center justify-center text-sm font-medium">N/A</span>
                  <span className="mt-2 text-xs text-center">Não se aplica</span>
                </Label>
              </RadioGroup>
              
              {/* Campo de upload que aparece quando 'Sim' é selecionado */}
              {carteiraTrabalho === "sim" && (
                <div className="mt-4 p-4 border rounded-md border-orange-200 bg-orange-50">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Envie sua carteira de trabalho (páginas principais):</p>
                      {carteiraFileName && !uploadingCarteiraFile && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex gap-1">
                          <Check className="h-3 w-3" /> Enviado
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="carteiraTrabalhoFile" className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${uploadingCarteiraFile ? 'bg-orange-50 border-orange-300' : 'bg-gray-50 hover:bg-gray-100 border-gray-300'} ${carteiraFileName ? 'bg-green-50 border-green-300 hover:bg-green-100' : ''}`}>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {uploadingCarteiraFile ? (
                            <>
                              <div className="h-8 w-8 mb-3 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"></div>
                              <p className="mb-2 text-sm text-orange-600">Enviando arquivo...</p>
                            </>
                          ) : carteiraFileName ? (
                            <>
                              <Check className="w-8 h-8 mb-3 text-green-500" />
                              <p className="mb-2 text-sm text-green-600"><span className="font-semibold">{carteiraFileName}</span></p>
                              <p className="text-xs text-green-500">Clique para alterar o arquivo</p>
                            </>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 mb-3 text-gray-400" />
                              <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Clique para enviar</span> ou arraste arquivos</p>
                              <p className="text-xs text-gray-500">PDF, JPG, PNG ou HEIC (máx. 10MB)</p>
                            </>
                          )}
                        </div>
                        <input 
                          id="carteiraTrabalhoFile" 
                          type="file" 
                          className="hidden" 
                          accept=".pdf,.jpg,.jpeg,.png,.heic"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                              const file = files[0];
                              setUploadingCarteiraFile(true);
                              
                              // Simulação de upload para a pasta /public
                              setTimeout(() => {
                                console.log("Arquivo de carteira de trabalho enviado:", file.name);
                                setCarteiraFileName(file.name);
                                setUploadingCarteiraFile(false);
                              }, 1500);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case "irpf":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Possui declaração de IRPF do último ano?</Label>
              <RadioGroup
                value={irpf || ""}
                onValueChange={(value) => setIrpf(value as "sim" | "nao" | "isento")}
                className="grid grid-cols-3 gap-4 pt-2"
              >
                <Label
                  htmlFor="irpf-sim"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground",
                    irpf === "sim" && "border-orange-500 bg-orange-50"
                  )}
                >
                  <RadioGroupItem value="sim" id="irpf-sim" className="sr-only" />
                  <Check className={cn("h-6 w-6", irpf === "sim" ? "text-orange-500" : "text-muted")} />
                  <span className="mt-2">Sim</span>
                </Label>
                <Label
                  htmlFor="irpf-nao"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground",
                    irpf === "nao" && "border-orange-500 bg-orange-50"
                  )}
                >
                  <RadioGroupItem value="nao" id="irpf-nao" className="sr-only" />
                  <X className={cn("h-6 w-6", irpf === "nao" ? "text-orange-500" : "text-muted")} />
                  <span className="mt-2">Não</span>
                </Label>
                <Label
                  htmlFor="irpf-isento"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground",
                    irpf === "isento" && "border-orange-500 bg-orange-50"
                  )}
                >
                  <RadioGroupItem value="isento" id="irpf-isento" className="sr-only" />
                  <span className="h-6 w-6 flex items-center justify-center text-sm font-medium">N/A</span>
                  <span className="mt-2 text-xs text-center">Isento</span>
                </Label>
              </RadioGroup>
              
              {/* Campo de upload que aparece quando 'Sim' é selecionado */}
              {irpf === "sim" && (
                <div className="mt-4 p-4 border rounded-md border-orange-200 bg-orange-50">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Envie sua declaração de IRPF:</p>
                      {irpfFileName && !uploadingIrpfFile && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex gap-1">
                          <Check className="h-3 w-3" /> Enviado
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="irpfFile" className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${uploadingIrpfFile ? 'bg-orange-50 border-orange-300' : 'bg-gray-50 hover:bg-gray-100 border-gray-300'} ${irpfFileName ? 'bg-green-50 border-green-300 hover:bg-green-100' : ''}`}>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {uploadingCarteiraFile ? (
                            <>
                              <div className="h-8 w-8 mb-3 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"></div>
                              <p className="mb-2 text-sm text-orange-600">Enviando arquivo...</p>
                            </>
                          ) : carteiraFileName ? (
                            <>
                              <Check className="w-8 h-8 mb-3 text-green-500" />
                              <p className="mb-2 text-sm text-green-600"><span className="font-semibold">{carteiraFileName}</span></p>
                              <p className="text-xs text-green-500">Clique para alterar o arquivo</p>
                            </>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 mb-3 text-gray-400" />
                              <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Clique para enviar</span> ou arraste arquivos</p>
                              <p className="text-xs text-gray-500">PDF, JPG, PNG ou HEIC (máx. 10MB)</p>
                            </>
                          )}
                        </div>
                        <input 
                          id="irpfFile" 
                          type="file" 
                          className="hidden" 
                          accept=".pdf,.jpg,.jpeg,.png,.heic"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                              const file = files[0];
                              setUploadingIrpfFile(true);
                              
                              // Simulação de upload para a pasta /public
                              setTimeout(() => {
                                console.log("Arquivo de declaração de IRPF enviado:", file.name);
                                setIrpfFileName(file.name);
                                setUploadingIrpfFile(false);
                              }, 1500);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case "escolaridade":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Qual seu grau de escolaridade?</Label>
              <Select value={escolaridade} onValueChange={setEscolaridade}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione sua escolaridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fundamental">Ensino Fundamental</SelectItem>
                  <SelectItem value="medio">Ensino Médio</SelectItem>
                  <SelectItem value="superior">Ensino Superior</SelectItem>
                  <SelectItem value="pos">Pós-graduação</SelectItem>
                  <SelectItem value="mestrado_doutorado">Mestrado/Doutorado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "outrosCompradores":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Haverá outros compradores no financiamento?</Label>
              <RadioGroup
                value={outrosCompradores || ""}
                onValueChange={(value) => setOutrosCompradores(value as "sim" | "nao")}
                className="grid grid-cols-2 gap-4 pt-2"
              >
                <Label
                  htmlFor="outros-sim"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground",
                    outrosCompradores === "sim" && "border-orange-500 bg-orange-50"
                  )}
                >
                  <RadioGroupItem value="sim" id="outros-sim" className="sr-only" />
                  <Check className={cn("h-6 w-6", outrosCompradores === "sim" ? "text-orange-500" : "text-muted")} />
                  <span className="mt-2">Sim</span>
                </Label>
                <Label
                  htmlFor="outros-nao"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground",
                    outrosCompradores === "nao" && "border-orange-500 bg-orange-50"
                  )}
                >
                  <RadioGroupItem value="nao" id="outros-nao" className="sr-only" />
                  <X className={cn("h-6 w-6", outrosCompradores === "nao" ? "text-orange-500" : "text-muted")} />
                  <span className="mt-2">Não</span>
                </Label>
              </RadioGroup>
            </div>
          </div>
        );

      // Campos para fluxo SEM_APROVACAO
      case "rendaMensal":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Qual é a sua renda mensal?</Label>
              <Select value={rendaMensal} onValueChange={setRendaMensal}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione sua faixa de renda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ate_2000">Até R$ 2.000</SelectItem>
                  <SelectItem value="2001_5000">De R$ 2.001 a R$ 5.000</SelectItem>
                  <SelectItem value="5001_10000">De R$ 5.001 a R$ 10.000</SelectItem>
                  <SelectItem value="acima_10000">Acima de R$ 10.000</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Usamos essa informação para calcular seu perfil de financiamento.</p>
            </div>
          </div>
        );

      case "outrosFinanciamentos":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Possui outros financiamentos ou empréstimos que comprometem sua renda?</Label>
              <RadioGroup
                value={outrosFinanciamentos || ""}
                onValueChange={(value) => setOutrosFinanciamentos(value as "sim" | "nao")}
                className="grid grid-cols-2 gap-4 pt-2"
              >
                <Label
                  htmlFor="financiamentos-sim"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground",
                    outrosFinanciamentos === "sim" && "border-orange-500 bg-orange-50"
                  )}
                >
                  <RadioGroupItem value="sim" id="financiamentos-sim" className="sr-only" />
                  <Check className={cn("h-6 w-6", outrosFinanciamentos === "sim" ? "text-orange-500" : "text-muted")} />
                  <span className="mt-2">Sim</span>
                </Label>
                <Label
                  htmlFor="financiamentos-nao"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground",
                    outrosFinanciamentos === "nao" && "border-orange-500 bg-orange-50"
                  )}
                >
                  <RadioGroupItem value="nao" id="financiamentos-nao" className="sr-only" />
                  <X className={cn("h-6 w-6", outrosFinanciamentos === "nao" ? "text-orange-500" : "text-muted")} />
                  <span className="mt-2">Não</span>
                </Label>
              </RadioGroup>
            </div>
          </div>
        );

      // Campo de Data de Nascimento
      case "dataNascimento":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Qual é a sua data de nascimento?</Label>
              <div className="flex flex-col space-y-2">
                <Input
                  type="text"
                  placeholder="DD/MM/AAAA"
                  defaultValue={dataNascimento ? format(dataNascimento, "dd/MM/yyyy") : ""}
                  onBlur={(e) => {
                    const valor = e.target.value;
                    
                    // Só processa se tiver algo digitado
                    if (valor && valor.length > 0) {
                      // Tenta diferentes formatos de data
                      let partes;
                      let dia, mes, ano;
                      
                      // Tenta formato DD/MM/AAAA
                      if (valor.includes('/')) {
                        partes = valor.split('/');
                        if (partes.length === 3) {
                          dia = parseInt(partes[0]);
                          mes = parseInt(partes[1]) - 1; // mês em JS é 0-11
                          ano = parseInt(partes[2]);
                          
                          const data = new Date(ano, mes, dia);
                          // Verifica se é data válida e não está no futuro
                          if (!isNaN(data.getTime()) && data < new Date()) {
                            setDataNascimento(data);
                            return;
                          }
                        }
                      }
                      
                      // Avisa que o formato está inválido
                      alert("Digite a data no formato DD/MM/AAAA, por exemplo: 01/12/1990");
                    } else {
                      setDataNascimento(undefined);
                    }
                  }}
                  className="w-full max-w-md"
                />
                <p className="text-xs text-muted-foreground">
                  Digite no formato: DD/MM/AAAA (ex: 01/12/1990)
                </p>
              </div>
              <p className="text-sm text-muted-foreground">Sua data de nascimento é importante para o cálculo do financiamento.</p>
            </div>
          </div>
        );
      
      // Campo de Escolaridade - implementado com Select
      case "escolaridade":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Escolaridade</Label>
              <Select
                value={escolaridade}
                onValueChange={setEscolaridade}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione sua escolaridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fundamental">Ensino Fundamental</SelectItem>
                  <SelectItem value="medio">Ensino Médio</SelectItem>
                  <SelectItem value="superior">Ensino Superior</SelectItem>
                  <SelectItem value="pos">Pós-graduação</SelectItem>
                  <SelectItem value="mestrado_doutorado">Mestrado/Doutorado</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Seu nível de escolaridade pode influenciar nas condições de financiamento.</p>
            </div>
          </div>
        );

      // Campo de Outros Compradores
      case "outrosCompradores":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Há outros compradores para este imóvel?</Label>
              <RadioGroup
                value={outrosCompradores || ""}
                onValueChange={(value) => setOutrosCompradores(value as "sim" | "nao")}
                className="grid grid-cols-2 gap-4 pt-2"
              >
                <Label
                  htmlFor="outros-sim"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground",
                    outrosCompradores === "sim" && "border-orange-500 bg-orange-50"
                  )}
                >
                  <RadioGroupItem value="sim" id="outros-sim" className="sr-only" />
                  <Check className={cn("h-6 w-6", outrosCompradores === "sim" ? "text-orange-500" : "text-muted")} />
                  <span className="mt-2">Sim</span>
                </Label>
                <Label
                  htmlFor="outros-nao"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground",
                    outrosCompradores === "nao" && "border-orange-500 bg-orange-50"
                  )}
                >
                  <RadioGroupItem value="nao" id="outros-nao" className="sr-only" />
                  <X className={cn("h-6 w-6", outrosCompradores === "nao" ? "text-orange-500" : "text-muted")} />
                  <span className="mt-2">Não</span>
                </Label>
              </RadioGroup>
              <p className="text-sm text-muted-foreground">Indique se haverá outros compradores para este imóvel junto com você.</p>
            </div>
          </div>
        );

      // Tipo de Imóvel
      case "tipoImovel":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Tipo de Imóvel</Label>
              <RadioGroup
                value={tipoImovel}
                onValueChange={setTipoImovel}
                className="grid grid-cols-2 gap-4 pt-2"
              >
                <Label
                  htmlFor="tipo-apartamento"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground",
                    tipoImovel === "apartamento" && "border-orange-500 bg-orange-50"
                  )}
                >
                  <RadioGroupItem value="apartamento" id="tipo-apartamento" className="sr-only" />
                  <div className="text-2xl mb-1">🏢</div>
                  <span className="mt-2">Apartamento</span>
                </Label>
                <Label
                  htmlFor="tipo-casa"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground",
                    tipoImovel === "casa" && "border-orange-500 bg-orange-50"
                  )}
                >
                  <RadioGroupItem value="casa" id="tipo-casa" className="sr-only" />
                  <div className="text-2xl mb-1">🏠</div>
                  <span className="mt-2">Casa</span>
                </Label>
                <Label
                  htmlFor="tipo-terreno"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground",
                    tipoImovel === "terreno" && "border-orange-500 bg-orange-50"
                  )}
                >
                  <RadioGroupItem value="terreno" id="tipo-terreno" className="sr-only" />
                  <div className="text-2xl mb-1">🏞️</div>
                  <span className="mt-2">Terreno</span>
                </Label>
                <Label
                  htmlFor="tipo-comercial"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground",
                    tipoImovel === "comercial" && "border-orange-500 bg-orange-50"
                  )}
                >
                  <RadioGroupItem value="comercial" id="tipo-comercial" className="sr-only" />
                  <div className="text-2xl mb-1">🏪</div>
                  <span className="mt-2">Comercial</span>
                </Label>
              </RadioGroup>
            </div>
          </div>
        );
        
      // Campo de Prazo de Financiamento
      case "prazoFinanciamento":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Prazo de Financiamento</Label>
              <RadioGroup
                value={prazoFinanciamento}
                onValueChange={setPrazoFinanciamento}
                className="grid grid-cols-2 gap-4 pt-2"
              >
                <Label
                  htmlFor="prazo-120"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground",
                    prazoFinanciamento === "120" && "border-orange-500 bg-orange-50"
                  )}
                >
                  <RadioGroupItem value="120" id="prazo-120" className="sr-only" />
                  <span className="font-semibold">10 anos</span>
                  <span className="text-sm text-muted-foreground mt-1">120 meses</span>
                </Label>
                <Label
                  htmlFor="prazo-180"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground",
                    prazoFinanciamento === "180" && "border-orange-500 bg-orange-50"
                  )}
                >
                  <RadioGroupItem value="180" id="prazo-180" className="sr-only" />
                  <span className="font-semibold">15 anos</span>
                  <span className="text-sm text-muted-foreground mt-1">180 meses</span>
                </Label>
                <Label
                  htmlFor="prazo-240"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground",
                    prazoFinanciamento === "240" && "border-orange-500 bg-orange-50"
                  )}
                >
                  <RadioGroupItem value="240" id="prazo-240" className="sr-only" />
                  <span className="font-semibold">20 anos</span>
                  <span className="text-sm text-muted-foreground mt-1">240 meses</span>
                </Label>
                <Label
                  htmlFor="prazo-360"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground",
                    prazoFinanciamento === "360" && "border-orange-500 bg-orange-50"
                  )}
                >
                  <RadioGroupItem value="360" id="prazo-360" className="sr-only" />
                  <span className="font-semibold">30 anos</span>
                  <span className="text-sm text-muted-foreground mt-1">360 meses</span>
                </Label>
              </RadioGroup>
            </div>
          </div>
        );

      // Campo de Entrada à Vista
      case "entradaVista":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Qual valor você tem disponível para dar de entrada à vista?</Label>
              <div className="relative pt-5">
                <Slider
                  value={[entradaVista]}
                  min={0}
                  max={500000}
                  step={5000}
                  onValueChange={(values) => setEntradaVista(values[0])}
                  className="my-6"
                />
                <div className="absolute inset-x-0 -top-1 flex justify-between">
                  <span className="text-sm text-muted-foreground">R$ 0</span>
                  <span className="text-sm text-muted-foreground">R$ 500 mil</span>
                </div>
              </div>
              <div className="text-center">
                <span className="text-2xl font-semibold text-orange-500">{formatarDinheiro(entradaVista)}</span>
              </div>
              <p className="text-sm text-muted-foreground">Quanto maior sua entrada, menor o valor financiado.</p>
            </div>
          </div>
        );

      // Campo de Valor da Parcela
      case "valorParcela":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Qual valor você pode pagar mensalmente (parcelas)?</Label>
              <div className="relative pt-5">
                <Slider
                  value={[valorParcela]}
                  min={0}
                  max={15000}
                  step={100}
                  onValueChange={(values) => setValorParcela(values[0])}
                  className="my-6"
                />
                <div className="absolute inset-x-0 -top-1 flex justify-between">
                  <span className="text-sm text-muted-foreground">R$ 0</span>
                  <span className="text-sm text-muted-foreground">R$ 15 mil</span>
                </div>
              </div>
              <div className="text-center">
                <span className="text-2xl font-semibold text-orange-500">{formatarDinheiro(valorParcela)}</span>
              </div>
              <p className="text-sm text-muted-foreground">Esse valor é a parcela mensal do financiamento.</p>
            </div>
          </div>
        );

      // Campo de Prazo de Pagamento
      case "mesesPagamento":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Por quantos meses você pode pagar essas parcelas?</Label>
              {mesesPagamento === "outro" ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="number" 
                      min="1"
                      max="360"
                      placeholder="Digite a quantidade de meses"
                      value={mesesPagamentoCustom || ''}
                      onChange={(e) => setMesesPagamentoCustom(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setMesesPagamento('')}
                    >
                      Voltar
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Digite um valor entre 1 e 360 meses</p>
                </div>
              ) : (
                <Select value={mesesPagamento} onValueChange={setMesesPagamento}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o prazo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 meses (1 ano)</SelectItem>
                    <SelectItem value="24">24 meses (2 anos)</SelectItem>
                    <SelectItem value="36">36 meses (3 anos)</SelectItem>
                    <SelectItem value="48">48 meses (4 anos)</SelectItem>
                    <SelectItem value="60">60 meses (5 anos)</SelectItem>
                    <SelectItem value="72">72 meses (6 anos)</SelectItem>
                    <SelectItem value="84">84 meses (7 anos)</SelectItem>
                    <SelectItem value="96">96 meses (8 anos)</SelectItem>
                    <SelectItem value="108">108 meses (9 anos)</SelectItem>
                    <SelectItem value="120">120 meses (10 anos)</SelectItem>
                    <SelectItem value="180">180 meses (15 anos)</SelectItem>
                    <SelectItem value="240">240 meses (20 anos)</SelectItem>
                    <SelectItem value="300">300 meses (25 anos)</SelectItem>
                    <SelectItem value="360">360 meses (30 anos)</SelectItem>
                    <SelectItem value="420">420 meses (35 anos)</SelectItem>
                    <SelectItem value="outro" className="font-medium text-primary">Outro (personalizado)</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <p className="text-sm text-muted-foreground">Prazos mais longos resultam em parcelas menores, mas custo total maior.</p>
            </div>
          </div>
        );

      // Campo de Custo de Transferência
      case "custoTransferencia":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Quanto você pode reservar para custos de transferência (aprox. 5,5% do valor)?</Label>
              <div className="relative pt-5">
                <Slider
                  value={[custoTransferencia]}
                  min={0}
                  max={100000}
                  step={1000}
                  onValueChange={(values) => setCustoTransferencia(values[0])}
                  className="my-6"
                />
                <div className="absolute inset-x-0 -top-1 flex justify-between">
                  <span className="text-sm text-muted-foreground">R$ 0</span>
                  <span className="text-sm text-muted-foreground">R$ 100 mil</span>
                </div>
              </div>
              <div className="text-center">
                <span className="text-2xl font-semibold text-orange-500">{formatarDinheiro(custoTransferencia)}</span>
              </div>
              <p className="text-sm text-muted-foreground">Inclui ITBI, registro, certidões e outras taxas.</p>
            </div>
          </div>
        );

      // Campo de Valor Mobiliário
      case "valorMobiliar":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Qual valor você planeja separar para mobiliar o imóvel?</Label>
              <div className="relative pt-5">
                <Slider
                  value={[valorMobiliar]}
                  min={0}
                  max={150000}
                  step={1000}
                  onValueChange={(values) => setValorMobiliar(values[0])}
                  className="my-6"
                />
                <div className="absolute inset-x-0 -top-1 flex justify-between">
                  <span className="text-sm text-muted-foreground">R$ 0</span>
                  <span className="text-sm text-muted-foreground">R$ 150 mil</span>
                </div>
              </div>
              <div className="text-center">
                <span className="text-2xl font-semibold text-orange-500">{formatarDinheiro(valorMobiliar)}</span>
              </div>
              <p className="text-sm text-muted-foreground">Opcional: inclua um valor para móveis e equipamentos.</p>
            </div>
          </div>
        );

      default:
        return <div className="p-4 text-center text-muted-foreground">Campo em implementação</div>;
    }
  };
  
  // Renderização principal do componente
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Barra de progresso */}
      <div className="w-full h-2 bg-gray-100 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-500 ease-in-out" 
          style={{ width: `${progresso}%` }}
        />
      </div>

      {/* Simulador Inicial de Aprovação */}
      {fluxoSelecionado === "SIMULACAO_INICIAL" && !mostrarSelecaoFluxo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="space-y-8"
        >
          <SimuladorAprovacaoInicial 
            onContinuar={handleSimulacaoInicial}
          />
        </motion.div>
      )}
      
      {/* Animação de IA processando */}
      {mostrarAnimacaoIA && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-white"
        >
          <div className="max-w-md w-full mx-auto text-center p-8">
            {!animacaoTerminou ? (
              <>
                <div className="relative w-32 h-32 mx-auto mb-8">
                  <motion.div 
                    className="absolute inset-0 rounded-full border-4 border-[#fe4f17]/20"
                    style={{ borderTopColor: '#fe4f17' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-[#fe4f17]/30"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fe4f17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 8v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/>
                      <path d="M10 2v4"/>
                      <path d="M14 2v4"/>
                      <path d="M10 18v4"/>
                      <path d="M14 18v4"/>
                      <path d="M2 10h4"/>
                      <path d="M2 14h4"/>
                      <path d="M18 10h4"/>
                      <path d="M18 14h4"/>
                    </svg>
                  </div>
                </div>
                <motion.h3 
                  className="text-2xl font-bold text-gray-900 mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Nossa IA está trabalhando
                </motion.h3>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="h-24 flex flex-col justify-center mb-6"
                >
                  <motion.p 
                    key={fraseAnimacaoIA}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-lg text-orange-600 font-medium"
                  >
                    {fraseAnimacaoIA}
                  </motion.p>
                </motion.div>
                <motion.p 
                  className="text-gray-500 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Analisando seu perfil para entregar as melhores recomendações
                </motion.p>
              </>
            ) : (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring" }}
                className="text-center"
              >
                <div className="mb-4 mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Análise concluída!</h3>
                <p className="text-gray-600">Encontramos as melhores opções para você</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Tela de seleção de fluxo após simulação inicial */}
      {fluxoSelecionado === "SIMULACAO_INICIAL" && mostrarSelecaoFluxo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="space-y-8"
        >
          <div className="text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-block mb-4"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-[#fe4f17]/10 flex items-center justify-center">
                <span className="text-orange-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 12 2 2 4-4"/>
                    <path d="M12 3c-1.2 0-2.4.6-3 1.7A4 4 0 0 0 5 8c0 4 7 10 7 10s7-6 7-10a4 4 0 0 0-4-4c-1.4 0-2.8.7-3.5 2"/>
                  </svg>
                </span>
              </div>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-extrabold text-center text-gray-900 mb-2"
            >
              Análise Concluída com Sucesso!
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center text-gray-600 max-w-3xl mx-auto mb-8"
            >
              {dadosSimulacaoInicial?.aprovado 
                ? "Parabéns! Com base na análise da nossa IA, sua simulação inicial foi aprovada. Escolha como deseja prosseguir:" 
                : "Com base nos dados analisados, recomendamos uma simulação sem pré-aprovação. Selecione a opção que melhor atende suas necessidades:"}
            </motion.p>
          </div>
          
          {/* Exibir resultados da simulação rápida */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl shadow-sm mx-auto max-w-2xl mb-8 border border-orange-200"
          >
            <h3 className="font-semibold mb-4 text-orange-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M2 9V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1"/>
                <path d="M2 13h10"/>
                <path d="m9 16 3-3-3-3"/>
              </svg>
              Resumo da Sua Simulação
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="text-sm font-medium text-orange-700 mb-1">Valor do Imóvel</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency ? formatCurrency(dadosSimulacaoInicial?.valorImovel || 0) : dadosSimulacaoInicial?.valorImovel}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="text-sm font-medium text-orange-700 mb-1">Entrada Disponível</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency ? formatCurrency(dadosSimulacaoInicial?.entradaDisponivel || 0) : dadosSimulacaoInicial?.entradaDisponivel}
                  <span className="ml-2 text-sm font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
                    {dadosSimulacaoInicial?.valorImovel ? 
                    `${Math.round((dadosSimulacaoInicial.entradaDisponivel / dadosSimulacaoInicial.valorImovel) * 100)}%` : '0%'}
                  </span>
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="text-sm font-medium text-orange-700 mb-1">Renda Mensal</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency ? formatCurrency(dadosSimulacaoInicial?.rendaMensal || 0) : dadosSimulacaoInicial?.rendaMensal}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="text-sm font-medium text-orange-700 mb-1">Parcela Máxima</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency ? formatCurrency(dadosSimulacaoInicial?.valorParcelaMaxima || 0) : dadosSimulacaoInicial?.valorParcelaMaxima}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl mx-auto mt-6"
          >
            <h3 className="font-semibold mb-4 text-gray-800">Escolha como deseja prosseguir:</h3>
            <div className="flex flex-col gap-4">
            <Card className={`overflow-hidden cursor-pointer hover:shadow-lg hover:border-[#fe4f17]/30 transition-all duration-300 ${dadosSimulacaoInicial?.aprovado ? 'border-[#fe4f17]/30 shadow-md' : 'border-gray-200'}`}>
              <div className={`h-2 ${dadosSimulacaoInicial?.aprovado ? 'bg-[#fe4f17]' : 'bg-gray-200'}`}></div>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center mb-2">
                  <CardTitle className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-[#fe4f17]">
                      <path d="M9 5H2v7"/>
                      <path d="M2 12c0 4.31 3.13 8 7.33 8 4.2 0 7.67-3.69 7.67-8 0-4.31-3.47-8-7.67-8C7.18 4 3.6 6.16 2 9"/>
                      <path d="M14 9h8v8"/>
                      <path d="M22 9c0-4.31-3.13-8-7.33-8-4.2 0-7.67 3.69-7.67 8 0 4.31 3.47 8 7.67 8 4.15 0 7.73-2.16 9.33-5"/>
                    </svg>
                    Com Pré-aprovação
                  </CardTitle>
                  {dadosSimulacaoInicial?.aprovado && (
                    <Badge className="bg-[#fe4f17]/10 text-[#fe4f17] hover:bg-[#fe4f17]/20">Recomendado</Badge>
                  )}
                </div>
                <CardDescription className="text-gray-600 h-12">
                  Obtenha uma simulação com pré-aprovação de crédito baseada em seus documentos
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="rounded-md border p-4 bg-gray-50 h-24 flex items-center">
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#fe4f17]/10 p-1 rounded-full">
                      <Check className="h-4 w-4 text-[#fe4f17]" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Análise mais precisa</p>
                      <p className="text-xs text-muted-foreground">Baseada em seus documentos reais</p>
                    </div>
                  </div>
                </div>
                <Button 
                  className="w-full bg-[#fe4f17] hover:bg-[#fe4f17]/90"
                  onClick={() => setFluxoSelecionado("COM_APROVACAO")}
                >
                  Iniciar com pré-aprovação
                </Button>
              </CardContent>
            </Card>

            <Card className={`mt-4 overflow-hidden cursor-pointer hover:shadow-lg hover:border-orange-300 transition-all duration-300 ${!dadosSimulacaoInicial?.aprovado ? 'border-orange-300 shadow-md' : 'border-gray-200'}`}>
              <div className={`h-2 ${!dadosSimulacaoInicial?.aprovado ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center mb-2">
                  <CardTitle className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-orange-500">
                      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
                    </svg>
                    Sem Pré-aprovação
                  </CardTitle>
                  {!dadosSimulacaoInicial?.aprovado && (
                    <Badge className="bg-[#fe4f17]/10 text-[#fe4f17] hover:bg-[#fe4f17]/20">Recomendado</Badge>
                  )}
                </div>
                <CardDescription className="text-gray-600 h-12">
                  Simulação rápida baseada em estimativas de renda e condições
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="rounded-md border p-4 bg-gray-50 h-24 flex items-center">
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#fe4f17]/10 p-1 rounded-full">
                      <Check className="h-4 w-4 text-[#fe4f17]" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Processo mais simples</p>
                      <p className="text-xs text-muted-foreground">Estimativa rápida sem necessidade de documentos</p>
                    </div>
                  </div>
                </div>
                <Button 
                  className="w-full bg-[#fe4f17] hover:bg-[#fe4f17]/90"
                  onClick={() => setFluxoSelecionado("SEM_APROVACAO")}
                >
                  Iniciar sem pré-aprovação
                </Button>
              </CardContent>
            </Card>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Seleção de fluxo - Só exibido se o usuário fez reset após a simulação inicial */}
      {fluxoSelecionado === null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="space-y-8"
        >
          <h2 className="text-3xl font-extrabold text-center text-[#fe4f17]">
            Inteligência Artificial com a iMovia
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            Responda às perguntas-chave com suas preferências e deixe que a <span className="text-[#fe4f17] font-medium">iMovia</span> encontre a
            melhor opção para você em instantes.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <Card className="overflow-hidden cursor-pointer hover:border-[#fe4f17]/30 transition-all">
              <CardHeader className="pb-3">
                <CardTitle>Com Pré-aprovação</CardTitle>
                <CardDescription>
                  Obtenha uma simulação com pré-aprovação de crédito baseada em seus documentos
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="rounded-md border p-4 bg-gray-50">
                  <div className="flex items-start space-x-4">
                    <Check className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Análise mais precisa</p>
                      <p className="text-xs text-muted-foreground">Baseada em seus documentos reais</p>
                    </div>
                  </div>
                </div>
                <Button 
                  className="w-full bg-orange-500 hover:bg-orange-600" 
                  onClick={() => setFluxoSelecionado("COM_APROVACAO")}
                >
                  Iniciar com pré-aprovação
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden cursor-pointer hover:border-[#fe4f17]/30 transition-all">
              <CardHeader className="pb-3">
                <CardTitle>Sem Pré-aprovação</CardTitle>
                <CardDescription>
                  Simulação rápida baseada em estimativas de renda e condições
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="rounded-md border p-4 bg-gray-50">
                  <div className="flex items-start space-x-4">
                    <Check className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Processo mais simples</p>
                      <p className="text-xs text-muted-foreground">Estimativa rápida sem necessidade de documentos</p>
                    </div>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  onClick={() => setFluxoSelecionado("SEM_APROVACAO")}
                >
                  Iniciar sem pré-aprovação
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Formulário por etapas */}
      {fluxoSelecionado !== null && fluxoSelecionado !== "SIMULACAO_INICIAL" && resultadoAprovacao === null && fluxoSelecionado !== "INFORMACOES_COMPLEMENTARES" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="space-y-8"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {fluxoSelecionado === "COM_APROVACAO" && "Simulação com Pré-aprovação"}
                    {fluxoSelecionado === "SEM_APROVACAO" && "Simulação sem Pré-aprovação"}
                  </CardTitle>
                  <CardDescription>
                    {fluxoSelecionado === "COM_APROVACAO" && `Etapa ${etapaAtual + 1} de 3: ${fluxos[fluxoSelecionado].etapas[etapaAtual].titulo}`}
                    {fluxoSelecionado === "SEM_APROVACAO" && `Etapa ${etapaAtual + 1} de 1: ${fluxos[fluxoSelecionado].etapas[etapaAtual].titulo}`}
                  </CardDescription>
                </div>
                <Badge variant={fluxoSelecionado === "COM_APROVACAO" ? "default" : "outline"} className="text-xs">
                  {fluxoSelecionado === "COM_APROVACAO" ? "Pré-aprovação" : "Simulação Rápida"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-10 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-muted-foreground">Processando sua solicitação...</p>
                </div>
              ) : (
                renderizarCampo()
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6">
              <Button variant="outline" onClick={voltar} disabled={loading}>
                Voltar
              </Button>
              <Button onClick={avancar} disabled={!podeProsseguir() || loading}>
                {etapaAtual === fluxos[fluxoSelecionado].etapas.length - 1 && 
                 passoAtual === fluxos[fluxoSelecionado].etapas[etapaAtual].campos.length - 1 
                  ? "Finalizar" : "Próximo"}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
      
      {/* Etapa de informações complementares */}
      {fluxoSelecionado === "INFORMACOES_COMPLEMENTARES" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="space-y-8"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Informações Complementares</CardTitle>
                  <CardDescription>
                    {`Etapa final: ${fluxos[fluxoSelecionado].etapas[etapaAtual].titulo}`}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                  {resultadoAprovacao ? "Aprovado" : "Pré-qualificado"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-10 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-muted-foreground">Processando sua solicitação...</p>
                </div>
              ) : (
                renderizarCampo()
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6">
              <Button variant="outline" onClick={voltar} disabled={loading}>
                Voltar
              </Button>
              <Button onClick={avancar} disabled={!podeProsseguir() || loading}>
                {etapaAtual === fluxos[fluxoSelecionado].etapas.length - 1 && 
                 passoAtual === fluxos[fluxoSelecionado].etapas[etapaAtual].campos.length - 1 
                  ? "Finalizar" : "Próximo"}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
      
      {/* Tela de resultado da aprovação */}
      {resultadoAprovacao !== null && fluxoSelecionado !== "INFORMACOES_COMPLEMENTARES" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-8"
        >
          <Card className="overflow-hidden">
            <div className={cn(
              "p-6 text-center border-b",
              resultadoAprovacao ? "bg-green-50 border-green-100" : "bg-orange-50 border-orange-100"
            )}>
              <div className="mx-auto rounded-full p-3 w-16 h-16 flex items-center justify-center bg-white mb-4">
                {resultadoAprovacao ? (
                  <Check className="h-8 w-8 text-green-500" />
                ) : (
                  <Check className="h-8 w-8 text-orange-500" />
                )}
              </div>
              <h3 className="text-xl font-semibold">
                {resultadoAprovacao ? "Crédito Pré-Aprovado!" : "Pré-Qualificado!"}
              </h3>
              <p className="text-sm mt-2 text-muted-foreground">
                {resultadoAprovacao 
                  ? "Com base nas informações fornecidas, você foi pré-aprovado. Complete as informações adicionais para prosseguir." 
                  : "Você está pré-qualificado para continuar. Complete as informações complementares para melhorarmos sua experiência."}
              </p>
            </div>
            
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Valor máximo do imóvel</p>
                    <p className="text-xl font-semibold text-orange-600">{formatarDinheiro(valorMaximoImovel)}</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Renda mensal estimada</p>
                    <p className="text-xl font-semibold text-orange-600">
                      {fluxoSelecionado === "COM_APROVACAO" ? "Baseado em documentos" : "Baseado em declaração"}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Próximos passos:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Complete as informações complementares</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Indique suas preferências para encontrarmos o imóvel ideal</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Receba sugestões personalizadas de imóveis</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="border-t p-6">
              <Button className="w-full" onClick={() => {
                // Avançar para o fluxo de informações complementares
                setFluxoSelecionado("INFORMACOES_COMPLEMENTARES");
                setEtapaAtual(0);
                setPassoAtual(0);
                setResultadoAprovacao(null);
                // Atualizar o progresso global
                if (onProgress) {
                  onProgress(60);
                }
              }}>
                Continuar para informações complementares
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
