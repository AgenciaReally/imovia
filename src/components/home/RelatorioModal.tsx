"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Loader2, ArrowRight, MessageSquare, AlertCircle, ChevronDown, MapPin, Phone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { IconCheck, IconMap, IconBed, IconBath, IconRuler, IconCar } from "@tabler/icons-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "@/components/ui/use-toast";

// Interface para os imóveis recomendados
interface Imovel {
  id: string;
  titulo: string;
  preco: number;
  caracteristicas: {
    quartos: number;
    banheiros: number;
    area: number;
    vagas?: number;
  };
  thumbnail?: string;
  matchPercentage?: number;
  destaque?: boolean;
  telefone?: string;
  construtora?: string;
}

// Props do componente
interface RelatorioModalProps {
  isOpen: boolean;
  onClose: () => void;
  respostas: Record<string, any>;
  isLoading?: boolean;
  imoveis?: Imovel[];
}

// Mapeamento organizado de categorias de perguntas
type Categoria = {
  titulo: string;
  descricao?: string;
  icon?: React.ReactNode;
  prefixos: string[];
};

// Categorias organizadas por área
const CATEGORIAS: Categoria[] = [
  {
    titulo: "Simulação Inicial",
    descricao: "Informações básicas da simulação",
    prefixos: ["Simulacao_Inicial", "Simulacao", "simulacaoInicial", "Fluxo"]
  },
  {
    titulo: "Avaliação de Crédito",
    descricao: "Dados financeiros e aprovação de crédito",
    prefixos: ["AVALIACAO_CREDITO", "AVALIACAOCREDITO", "Seed-AVALIACAOCREDITO", "Seed- A V A L I A C A O C R E D I T O"]
  },
  {
    titulo: "Informações Complementares",
    descricao: "Detalhes adicionais para análise",
    prefixos: ["INFO_COMPLEMENTARES", "INFOCOMPLEMENTARES", "Seed-INFOCOMPLEMENTARES", "Seed- I N F O C O M P L E M E N T A R E S"]
  },
  {
    titulo: "Preferências",
    descricao: "Preferências de localização",
    prefixos: ["PREFERENCIAS", "Seed-PREFERENCIAS", "Seed- P R E F E R E N C I A S"]
  },
  {
    titulo: "Características do Empreendimento",
    descricao: "Características desejadas no imóvel",
    prefixos: ["EMPREENDIMENTO", "Seed-EMPREENDIMENTO", "Seed- E M P R E E N D I M E N T O"]
  },
  {
    titulo: "Proximidades",
    descricao: "Características do entorno",
    prefixos: ["PROXIMIDADES", "Seed-PROXIMIDADES", "Seed- P R O X I M I D A D E S"]
  }
];


// Mapeamento detalhado de chaves para textos legíveis
const MAPEAMENTO_PERGUNTAS: Record<string, string> = {
  // Simulação Inicial e valores básicos
  // Mapeamentos para categorias de chaves do formato Seed-
"A_V_A_L_I_A_C_A_O_C_R_E_D_I_T_O": "Avaliação de Crédito",
"I_N_F_O_C_O_M_P_L_E_M_E_N_T_A_R_E_S": "Informações Complementares",
"P_R_E_F_E_R_E_N_C_I_A_S": "Preferências",
"E_M_P_R_E_E_N_D_I_M_E_N_T_O": "Características do Empreendimento",
"P_R_O_X_I_M_I_D_A_D_E_S": "Proximidades",

// Mapeamentos específicos para perguntas individuais
"Seed- A V A L I A C A O C R E D I T O-10": "Renda mensal",
"Seed- A V A L I A C A O C R E D I T O-11": "Possui restrição de crédito",
"Seed- A V A L I A C A O C R E D I T O-12": "Data de nascimento",

"Seed- I N F O C O M P L E M E N T A R E S-1": "Valor do imóvel",
"Seed- I N F O C O M P L E M E N T A R E S-2": "Valor parcela máxima",
"Seed- I N F O C O M P L E M E N T A R E S-3": "Prazo do financiamento",
"Seed- I N F O C O M P L E M E N T A R E S-4": "Entrada disponível",
"Seed- I N F O C O M P L E M E N T A R E S-5": "Valor do financiamento",

"Seed- P R E F E R E N C I A S-1": "Código da cidade",
"Seed- P R E F E R E N C I A S-2": "Bairros de interesse",
"Seed- P R E F E R E N C I A S-3": "Local de trabalho",
"Seed- P R E F E R E N C I A S-4": "Local da escola",

"Seed- E M P R E E N D I M E N T O-1": "Importância do piso nos quartos",
"Seed- E M P R E E N D I M E N T O-2": "Importância da academia",
"Seed- E M P R E E N D I M E N T O-3": "Importância da piscina",
"Seed- E M P R E E N D I M E N T O-4": "Tipo de portaria preferido",
"Seed- E M P R E E N D I M E N T O-5": "Importância do salão de festas",
"Seed- E M P R E E N D I M E N T O-6": "Importância do playground",
"Seed- E M P R E E N D I M E N T O-7": "Importância do espaço pet",

"Seed- P R O X I M I D A D E S-1": "Importância de parques próximos",
"Seed- P R O X I M I D A D E S-2": "Importância de shoppings próximos",
"Seed- P R O X I M I D A D E S-3": "Importância de restaurantes próximos",
"Seed- P R O X I M I D A D E S-4": "Importância da caminhabilidade",
"Seed- P R O X I M I D A D E S-5": "Possui pet",
"Seed- P R O X I M I D A D E S-6": "Importância de escolas próximas",
"Seed- P R O X I M I D A D E S-7": "Importância de transporte público próximo",


  "Simulacao_Inicial": "Simulação Inicial",
  "Simulacao": "Dados da simulação",
  "simulacaoInicial": "Dados iniciais da simulação",
  "Fluxo": "Fluxo de simulação escolhido",
  "realizada": "Simulação realizada",
  "aprovado": "Aprovação inicial",
  "rendaMensal": "Renda mensal bruta",
  "valorImovel": "Valor do imóvel desejado",
  "entradaDisponivel": "Entrada disponível",
  "valorParcelaMaxima": "Valor máximo de parcela",
  "temOutrosEmprestimos": "Possui outros empréstimos",
  "score": "Pontuação de crédito",
  
  // Valores específicos
  "ValorImovel": "Valor do imóvel",
  "EntradaDisponivel": "Entrada disponível",
  "RendaMensal": "Renda mensal",
  "Entrada": "Valor da entrada",
  "Parcela": "Valor da parcela",
  
  // Preferências de localização
  "Cidade": "Código da cidade",
  "Bairros Selecionados": "Bairros selecionados",
  "Local Trabalho": "Local de trabalho",
  "Local Escola": "Local da escola",
  "tipoImovel": "Tipo de imóvel desejado",
  "quantidadeQuartos": "Quantidade de quartos",
  "regiao": "Região de interesse",
  "proximidades": "Características próximas desejadas",
  "caracteristicasDesejadas": "Características do imóvel desejadas",
  
  // Avaliação de Crédito
  "AVALIACAO_CREDITO-1": "Valor do imóvel desejado",
  "AVALIACAO_CREDITO-2": "Valor da entrada disponível",
  "AVALIACAO_CREDITO-4": "Tempo de financiamento",
  "AVALIACAO_CREDITO-5": "Valor do FGTS",
  "AVALIACAO_CREDITO-6": "Situação profissional",
  "AVALIACAO_CREDITO-7": "Tipo de comprovante de renda",
  "AVALIACAO_CREDITO-8": "Classificação de risco de crédito",
  "AVALIACAO_CREDITO-9": "Possui nome limpo?",
  "AVALIACAO_CREDITO-10": "Renda mensal bruta",
  "AVALIACAO_CREDITO-11": "Possui outros financiamentos ativos?",
  "AVALIACAO_CREDITO-12": "Data de nascimento",
  
  // Informações Complementares
  "INFO_COMPLEMENTARES-1": "Entrada disponível",
  "INFO_COMPLEMENTARES-2": "Valor máximo da parcela",
  "INFO_COMPLEMENTARES-3": "Prazo de financiamento (meses)",
  "INFO_COMPLEMENTARES-4": "Valor do FGTS disponível",
  "INFO_COMPLEMENTARES-5": "Renda mensal bruta",
  
  // Preferências
  "PREFERENCIAS-1": "Código da cidade",
  "PREFERENCIAS-2": "Bairros de interesse",
  "PREFERENCIAS-3": "Local de trabalho",
  "PREFERENCIAS-4": "Local da escola",
  
  // Empreendimento
  "EMPREENDIMENTO-1": "Importância do piso nos quartos",
  "EMPREENDIMENTO-2": "Importância da academia",
  "EMPREENDIMENTO-3": "Importância da piscina",
  "EMPREENDIMENTO-4": "Tipo de portaria",
  "EMPREENDIMENTO-5": "Importância do salão de festas",
  "EMPREENDIMENTO-6": "Importância do playground",
  "EMPREENDIMENTO-7": "Importância do espaço pet",
  "Importancia Piso Quartos": "Importância do piso nos quartos",
  "Importancia Academia": "Importância da academia",
  "Importancia Piscina": "Importância da piscina",
  "Tipo Portaria": "Tipo de portaria",
  "Importancia Salao Festas": "Importância do salão de festas",
  "Importancia Playground": "Importância do playground",
  "Importancia Espaco Pet": "Importância do espaço pet",
  
  // Proximidades
  "PROXIMIDADES-1": "Importância de parques",
  "PROXIMIDADES-2": "Importância de shoppings",
  "PROXIMIDADES-3": "Importância de restaurantes",
  "PROXIMIDADES-4": "Importância de caminhabilidade",
  "PROXIMIDADES-5": "Tem pet?",
  "PROXIMIDADES-6": "Importância de escolas",
  "PROXIMIDADES-7": "Importância de transporte público",
  "Importancia Parques": "Importância de parques",
  "Importancia Shoppings": "Importância de shoppings",
  "Importancia Restaurantes": "Importância de restaurantes",
  "Importancia Caminhabilidade": "Importância de caminhabilidade",
  "Tem Pet": "Tem pet?",
  "Importancia Escolas": "Importância de escolas",
  "Importancia Transporte": "Importância de transporte público"
};

// Aliases - adicionar variações de nomenclatura aqui
const aliases: Record<string, string[]> = {
  "AVALIACAO_CREDITO-1": ["AVALIACAOCREDITO-1", "Seed-AVALIACAOCREDITO-1", "Seed- A V A L I A C A O C R E D I T O-1"]
  // Outros aliases conforme necessário
};

// Preencher aliases automaticamente
Object.entries(aliases).forEach(([chave, variantes]) => {
  variantes.forEach(variante => {
    MAPEAMENTO_PERGUNTAS[variante] = MAPEAMENTO_PERGUNTAS[chave];
  });
});

export function NewRelatorioModal({ isOpen, onClose, respostas, isLoading = false, imoveis = [] }: RelatorioModalProps) {
  const [activeTab, setActiveTab] = useState("respostas");
  const relatorioPdfRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [downloadIniciado, setDownloadIniciado] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  
  // Função para agrupar respostas por categoria
  const agruparRespostas = () => {
    // Inicializar grupos vazios
    const grupos: Record<string, Record<string, any>> = {};
    CATEGORIAS.forEach(cat => {
      grupos[cat.titulo] = {};
    });
    
    // Grupo para itens não categorizados
    grupos["Outros"] = {};
    
    // Processar todas as respostas
    Object.entries(respostas).forEach(([chave, valor]) => {
      // Ignorar campos internos e metadados
      if (chave.startsWith('_') || chave === 'userId' || chave === 'fluxoAtual' || valor === undefined || valor === null) {
        return;
      }
      
      // Caso especial: chaves que começam com Seed-
      if (chave.startsWith('Seed-')) {
        const seedMatch = chave.match(/Seed-\s*([A-Z\s]+)-\d+/);
        if (seedMatch && seedMatch[1]) {
          const categoriaNormalizada = seedMatch[1].trim().replace(/\s+/g, "_").toUpperCase();
          
          // Mapear para a categoria correta
          if (categoriaNormalizada === "A_V_A_L_I_A_C_A_O_C_R_E_D_I_T_O") {
            grupos["Avaliação de Crédito"][chave] = valor;
            return;
          } else if (categoriaNormalizada === "I_N_F_O_C_O_M_P_L_E_M_E_N_T_A_R_E_S") {
            grupos["Informações Complementares"][chave] = valor;
            return;
          } else if (categoriaNormalizada === "P_R_E_F_E_R_E_N_C_I_A_S") {
            grupos["Preferências"][chave] = valor;
            return;
          } else if (categoriaNormalizada === "E_M_P_R_E_E_N_D_I_M_E_N_T_O") {
            grupos["Características do Empreendimento"][chave] = valor;
            return;
          } else if (categoriaNormalizada === "P_R_O_X_I_M_I_D_A_D_E_S") {
            grupos["Proximidades"][chave] = valor;
            return;
          }
        }
      }
      
      // Tentar encontrar a categoria para a chave usando prefixos
      let categoriaEncontrada = false;
      for (const categoria of CATEGORIAS) {
        // Verificar se a chave começa com algum dos prefixos da categoria
        if (categoria.prefixos.some(prefixo => 
          chave.startsWith(prefixo) || 
          chave.includes(prefixo) || 
          (chave.match(/^\d+$/) && prefixo === 'Fluxo') // Caso especial para fluxo
        )) {
          grupos[categoria.titulo][chave] = valor;
          categoriaEncontrada = true;
          break;
        }
      }
      
      // Se não encontrou categoria, coloca em "Outros"
      if (!categoriaEncontrada) {
        grupos["Outros"][chave] = valor;
      }
    });
    
    // Remover categorias vazias
    Object.keys(grupos).forEach(cat => {
      if (Object.keys(grupos[cat]).length === 0) {
        delete grupos[cat];
      }
    });
    
    return grupos;
  };
  
  // Função para obter pergunta formatada
  const getPergunta = (chave: string): string => {
    // Mapeamento direto para perguntas específicas
    // Verificar se a chave existe diretamente no mapeamento
    if (MAPEAMENTO_PERGUNTAS[chave]) {
      return MAPEAMENTO_PERGUNTAS[chave];
    }
    
    // Mapeamentos específicos para Seed-
    if (chave.startsWith("Seed-")) {
      // AVALIACAO CREDITO
      if (chave === "Seed- A V A L I A C A O C R E D I T O-1") return "Renda mensal";
      if (chave === "Seed- A V A L I A C A O C R E D I T O-2") return "Score de crédito";
      if (chave === "Seed- A V A L I A C A O C R E D I T O-4") return "Possui restrição";
      if (chave === "Seed- A V A L I A C A O C R E D I T O-5") return "Possui imóvel financiado";
      if (chave === "Seed- A V A L I A C A O C R E D I T O-6") return "Possui FGTS";
      if (chave === "Seed- A V A L I A C A O C R E D I T O-7") return "Trabalha como";
      if (chave === "Seed- A V A L I A C A O C R E D I T O-8") return "Escolaridade";
      if (chave === "Seed- A V A L I A C A O C R E D I T O-9") return "Possui outros empréstimos";
      if (chave === "Seed- A V A L I A C A O C R E D I T O-10") return "Renda mensal";
      if (chave === "Seed- A V A L I A C A O C R E D I T O-11") return "Possui restrição de crédito";
      if (chave === "Seed- A V A L I A C A O C R E D I T O-12") return "Data de nascimento";
      
      // INFO COMPLEMENTARES
      if (chave === "Seed- I N F O C O M P L E M E N T A R E S-1") return "Valor do imóvel";
      if (chave === "Seed- I N F O C O M P L E M E N T A R E S-2") return "Valor parcela máxima";
      if (chave === "Seed- I N F O C O M P L E M E N T A R E S-3") return "Prazo do financiamento";
      if (chave === "Seed- I N F O C O M P L E M E N T A R E S-4") return "Entrada disponível";
      if (chave === "Seed- I N F O C O M P L E M E N T A R E S-5") return "Valor do financiamento";
      
      // PREFERENCIAS
      if (chave === "Seed- P R E F E R E N C I A S-1") return "Código da cidade";
      if (chave === "Seed- P R E F E R E N C I A S-2") return "Bairros de interesse";
      if (chave === "Seed- P R E F E R E N C I A S-3") return "Local de trabalho";
      if (chave === "Seed- P R E F E R E N C I A S-4") return "Local da escola";
      
      // EMPREENDIMENTO
      if (chave === "Seed- E M P R E E N D I M E N T O-1") return "Importância do piso nos quartos";
      if (chave === "Seed- E M P R E E N D I M E N T O-2") return "Importância da academia";
      if (chave === "Seed- E M P R E E N D I M E N T O-3") return "Importância da piscina";
      if (chave === "Seed- E M P R E E N D I M E N T O-4") return "Tipo de portaria preferido";
      if (chave === "Seed- E M P R E E N D I M E N T O-5") return "Importância do salão de festas";
      if (chave === "Seed- E M P R E E N D I M E N T O-6") return "Importância do playground";
      if (chave === "Seed- E M P R E E N D I M E N T O-7") return "Importância do espaço pet";
      
      // PROXIMIDADES
      if (chave === "Seed- P R O X I M I D A D E S-1") return "Importância de parques próximos";
      if (chave === "Seed- P R O X I M I D A D E S-2") return "Importância de shoppings próximos";
      if (chave === "Seed- P R O X I M I D A D E S-3") return "Importância de restaurantes próximos";
      if (chave === "Seed- P R O X I M I D A D E S-4") return "Importância da caminhabilidade";
      if (chave === "Seed- P R O X I M I D A D E S-5") return "Possui pet";
      if (chave === "Seed- P R O X I M I D A D E S-6") return "Importância de escolas próximas";
      if (chave === "Seed- P R O X I M I D A D E S-7") return "Importância de transporte público próximo";
      
      // Caso não tenha um mapeamento específico, tentar extrair pelo padrão
      const seedMatch = chave.match(/Seed-\s*([A-Z\s]+)-(\d+)/);
      if (seedMatch && seedMatch[1] && seedMatch[2]) {
        const categoria = seedMatch[1].trim();
        const numero = seedMatch[2];
        
        // Tentar encontrar mapeamento para categoria normalizada
        const categoriaNormalizada = categoria.replace(/\s+/g, "_").toUpperCase();
        if (MAPEAMENTO_PERGUNTAS[categoriaNormalizada]) {
          return MAPEAMENTO_PERGUNTAS[categoriaNormalizada] + " " + numero;
        }
        
        // Formatar a categoria de forma legível 
        return categoria.split(" ").map(p => p.charAt(0) + p.slice(1).toLowerCase()).join(" ") + " " + numero;
      }
    }
    
    // Verificar outros padrões de correspondência (ex: AVALIACAO_CREDITO-10)
    const match = chave.match(/(.*?)-(\d+)/);
    if (match) {
      const baseKey = match[0];
      if (MAPEAMENTO_PERGUNTAS[baseKey]) {
        return MAPEAMENTO_PERGUNTAS[baseKey];
      }
    }
    
    // Formatar a chave como fallback
    return chave
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/(\w)([A-Z])/g, '$1 $2')
      .replace(/_/g, ' ')
      .trim();
  };
  
  // Função para formatar valor para exibição
  const formatValue = (value: any, key: string): string => {
    // Valores nulos ou undefined
    if (value === null || value === undefined) return '---';
    
    // Formatar booleanos
    if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
    
    // Formatar arrays
    if (Array.isArray(value)) return value.join(', ');
    
    // Formatar objetos
    if (typeof value === 'object') {
      try {
        // Se o objeto tem propriedades formatadas para apresentação
        if (value.label || value.nome || value.title || value.descricao) {
          return value.label || value.nome || value.title || value.descricao;
        }
        
        // Se o objeto tem valor
        if (value.valor || value.value) {
          return String(value.valor || value.value);
        }
        
        // Retornar uma representação legível do objeto
        return JSON.stringify(value)
          .replace(/[{}"\[\]]/g, '')
          .replace(/,/g, ', ')
          .replace(/:/g, ': ');
      } catch (e) {
        return 'Objeto complexo';
      }
    }
    
    // Formatar números
    if (typeof value === 'number') {
      // Se parece com dinheiro
      if (key.toLowerCase().includes('valor') || 
          key.toLowerCase().includes('preco') || 
          key.toLowerCase().includes('renda') ||
          key.toLowerCase().includes('entrada') ||
          key.toLowerCase().includes('fgts')) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
      }
      
      // Outros números
      return value.toString();
    }
    
    // Valor padrão (string)
    return String(value);
  };
  
  // Gerar PDF do relatório
  const handleDownloadPDF = async () => {
    if (!relatorioPdfRef.current) return;
    
    try {
      setDownloadIniciado(true);
      setPdfError(null);
      
      const content = relatorioPdfRef.current;
      
      // Converter a div em canvas
      const canvas = await html2canvas(content, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });
      
      const imgWidth = 210; // A4 width in mm (210mm × 297mm)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Salvar PDF
      pdf.save(`Relatório_Imóvia_${new Date().toLocaleDateString('pt-BR')}.pdf`);
      
      toast({
        title: "PDF gerado com sucesso!",
        description: "Seu relatório foi baixado.",
        variant: "success",
      });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      setPdfError("Erro ao gerar PDF. Tente novamente ou entre em contato com o suporte.");
    } finally {
      setDownloadIniciado(false);
    }
  };
  
  // Função para abrir WhatsApp
  const abrirWhatsApp = (telefone: string, imovelId: string) => {
    const msg = `Olá! Tenho interesse no imóvel ${imovelId} que vi no Imóvia. Gostaria de mais informações.`;
    window.open(`https://wa.me/${telefone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };
  
  // Formatar preço em reais
  const formatarPreco = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(valor);
  };
  
  // Determinar melhores imóveis (com destaque ou melhor match)
  const melhoresImoveis = imoveis
    ? [...imoveis].sort((a, b) => {
        // Primeiro os destacados
        if (a.destaque && !b.destaque) return -1;
        if (!a.destaque && b.destaque) return 1;
        
        // Depois por match percentage
        return (b.matchPercentage || 0) - (a.matchPercentage || 0);
      }).slice(0, 3) // Limitar a 3 imóveis
    : [];
  
  // Agrupar respostas por categoria
  const respostasAgrupadas = agruparRespostas();
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="p-6 bg-[#fe4f17] text-white sticky top-0 z-10">
          <DialogTitle className="text-xl md:text-2xl font-bold">Relatório de Simulação</DialogTitle>
          <p className="text-white/90 mt-1">Resultado da sua simulação de financiamento imobiliário</p>
        </DialogHeader>
        
        <div className="px-4 md:px-6 py-4">
          <Tabs
            defaultValue="respostas"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4 w-full justify-start">
              <TabsTrigger value="respostas" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Suas Respostas
              </TabsTrigger>
              {melhoresImoveis.length > 0 && (
                <TabsTrigger value="recomendacoes" className="flex items-center gap-2">
                  <IconCheck className="h-4 w-4" />
                  Imóveis Recomendados
                </TabsTrigger>
              )}
            </TabsList>
            
            <AnimatePresence mode="wait">
              {activeTab === "respostas" && (
                <motion.div
                  key="respostas"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  ref={relatorioPdfRef}
                  className="space-y-6 pb-6"
                >
                  <div className="flex flex-col gap-1 items-center justify-center py-3 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-700">Relatório de Simulação Imobiliária</h3>
                    <p className="text-gray-500 text-sm">Gerado em {new Date().toLocaleDateString('pt-BR')}</p>
                  </div>
                  
                  {Object.entries(respostasAgrupadas).map(([categoria, itens]) => (
                    <div key={categoria} className="rounded-lg border border-gray-200 overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                        <h3 className="font-medium text-gray-700">{categoria}</h3>
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </div>
                      
                      <div className="p-4">
                        <div className="space-y-3">
                          {Object.entries(itens).map(([key, value]) => (
                            <div key={key} className="grid grid-cols-1 md:grid-cols-3 gap-2 py-2 border-b border-gray-100 last:border-0">
                              <div className="text-gray-600 font-medium">
                                {key.startsWith("Seed- A V A L I A C A O C R E D I T O") ? (
                                  key === "Seed- A V A L I A C A O C R E D I T O-1" ? "Renda mensal" :
                                  key === "Seed- A V A L I A C A O C R E D I T O-2" ? "Score de crédito" :
                                  key === "Seed- A V A L I A C A O C R E D I T O-4" ? "Possui restrição" :
                                  key === "Seed- A V A L I A C A O C R E D I T O-5" ? "Possui imóvel financiado" :
                                  key === "Seed- A V A L I A C A O C R E D I T O-6" ? "Possui FGTS" :
                                  key === "Seed- A V A L I A C A O C R E D I T O-7" ? "Trabalha como" :
                                  key === "Seed- A V A L I A C A O C R E D I T O-8" ? "Escolaridade" :
                                  key === "Seed- A V A L I A C A O C R E D I T O-9" ? "Possui outros empréstimos" :
                                  key === "Seed- A V A L I A C A O C R E D I T O-10" ? "Renda mensal" :
                                  key === "Seed- A V A L I A C A O C R E D I T O-11" ? "Possui restrição de crédito" :
                                  key === "Seed- A V A L I A C A O C R E D I T O-12" ? "Data de nascimento" :
                                  "Avaliação de Crédito"
                                ) : key.startsWith("Seed- I N F O C O M P L E M E N T A R E S") ? (
                                  key === "Seed- I N F O C O M P L E M E N T A R E S-1" ? "Valor do imóvel" :
                                  key === "Seed- I N F O C O M P L E M E N T A R E S-2" ? "Valor parcela máxima" :
                                  key === "Seed- I N F O C O M P L E M E N T A R E S-3" ? "Prazo do financiamento" :
                                  key === "Seed- I N F O C O M P L E M E N T A R E S-4" ? "Entrada disponível" :
                                  key === "Seed- I N F O C O M P L E M E N T A R E S-5" ? "Valor do financiamento" :
                                  "Informações Complementares"
                                ) : key.startsWith("Seed- P R E F E R E N C I A S") ? (
                                  key === "Seed- P R E F E R E N C I A S-1" ? "Código da cidade" :
                                  key === "Seed- P R E F E R E N C I A S-2" ? "Bairros de interesse" :
                                  key === "Seed- P R E F E R E N C I A S-3" ? "Local de trabalho" :
                                  key === "Seed- P R E F E R E N C I A S-4" ? "Local da escola" :
                                  "Preferências"
                                ) : key.startsWith("Seed- E M P R E E N D I M E N T O") ? (
                                  key === "Seed- E M P R E E N D I M E N T O-1" ? "Importância do piso nos quartos" :
                                  key === "Seed- E M P R E E N D I M E N T O-2" ? "Importância da academia" :
                                  key === "Seed- E M P R E E N D I M E N T O-3" ? "Importância da piscina" :
                                  key === "Seed- E M P R E E N D I M E N T O-4" ? "Tipo de portaria preferido" :
                                  key === "Seed- E M P R E E N D I M E N T O-5" ? "Importância do salão de festas" :
                                  key === "Seed- E M P R E E N D I M E N T O-6" ? "Importância do playground" :
                                  key === "Seed- E M P R E E N D I M E N T O-7" ? "Importância do espaço pet" :
                                  "Características do Empreendimento"
                                ) : key.startsWith("Seed- P R O X I M I D A D E S") ? (
                                  key === "Seed- P R O X I M I D A D E S-1" ? "Importância de parques próximos" :
                                  key === "Seed- P R O X I M I D A D E S-2" ? "Importância de shoppings próximos" :
                                  key === "Seed- P R O X I M I D A D E S-3" ? "Importância de restaurantes próximos" :
                                  key === "Seed- P R O X I M I D A D E S-4" ? "Importância da caminhabilidade" :
                                  key === "Seed- P R O X I M I D A D E S-5" ? "Possui pet" :
                                  key === "Seed- P R O X I M I D A D E S-6" ? "Importância de escolas próximas" :
                                  key === "Seed- P R O X I M I D A D E S-7" ? "Importância de transporte público próximo" :
                                  "Proximidades"
                                ) : getPergunta(key)}
                              </div>
                              <div className="md:col-span-2 text-gray-800">{formatValue(value, key)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Ação principal */}
                  <div className="flex flex-col items-center mt-6">
                    <Button 
                      variant="default" 
                      size="lg" 
                      className="w-full sm:w-auto"
                      onClick={handleDownloadPDF}
                      disabled={downloadIniciado}
                    >
                      {downloadIniciado ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Gerando PDF...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-5 w-5" />
                          Baixar Relatório Completo em PDF
                        </>
                      )}
                    </Button>
                    
                    {pdfError && (
                      <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {pdfError}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Este relatório é válido por 7 dias. Os valores e disponibilidade dos imóveis podem mudar.
                    <br />Contate as construtoras para obter informações atualizadas.
                  </p>
                </motion.div>
              )}
              
              {activeTab === "recomendacoes" && (
                <motion.div
                  key="recomendacoes"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 pb-6"
                >
                  <div className="flex flex-col gap-1 items-center justify-center py-3 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-700">Imóveis Recomendados</h3>
                    <p className="text-gray-500 text-sm">Com base no seu perfil e preferências</p>
                  </div>
                  
                  <div className="space-y-6 mb-8">
                    {melhoresImoveis.map((imovel) => (
                      <div key={imovel.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                        <div className="flex flex-col md:flex-row">
                          {/* Thumbnail */}
                          <div className="relative w-full md:w-1/3 h-48 md:h-auto">
                            <div className="relative h-full w-full overflow-hidden">
                              {/* Imagem borrada no fundo */}
                              <div
                                className="absolute inset-0 blur-md scale-110 opacity-80"
                                style={{
                                  backgroundImage: `url(${imovel.thumbnail || '/placeholder-imovel.jpg'})`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center'
                                }}
                              />
                              
                              {/* Imagem principal */}
                              <div
                                className="absolute inset-0 flex items-center justify-center"
                                style={{
                                  backgroundImage: `url(${imovel.thumbnail || '/placeholder-imovel.jpg'})`,
                                  backgroundSize: 'contain',
                                  backgroundPosition: 'center',
                                  backgroundRepeat: 'no-repeat'
                                }}
                              />
                              
                              {/* Badge de destaque */}
                              {imovel.destaque && (
                                <Badge className="absolute top-2 left-2 bg-orange-500" variant="secondary">
                                  Destaque
                                </Badge>
                              )}
                              
                              {/* Badge de compatibilidade */}
                              {imovel.matchPercentage && (
                                <Badge className="absolute bottom-2 right-2 bg-green-600" variant="secondary">
                                  {Math.round(imovel.matchPercentage)}% compatível
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {/* Informações */}
                          <div className="p-4 md:p-6 w-full md:w-2/3">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{imovel.titulo}</h3>
                            
                            <div className="flex flex-wrap items-center gap-3 mb-3 text-gray-600">
                              {imovel.caracteristicas.quartos > 0 && (
                                <div className="flex items-center gap-1">
                                  <IconBed size={16} />
                                  <span>{imovel.caracteristicas.quartos} quarto{imovel.caracteristicas.quartos !== 1 ? 's' : ''}</span>
                                </div>
                              )}
                              
                              {imovel.caracteristicas.banheiros > 0 && (
                                <div className="flex items-center gap-1">
                                  <IconBath size={16} />
                                  <span>{imovel.caracteristicas.banheiros} banheiro{imovel.caracteristicas.banheiros !== 1 ? 's' : ''}</span>
                                </div>
                              )}
                              
                              {imovel.caracteristicas.area > 0 && (
                                <div className="flex items-center gap-1">
                                  <IconRuler size={16} />
                                  <span>{imovel.caracteristicas.area}m²</span>
                                </div>
                              )}
                              
                              {imovel.caracteristicas.vagas && imovel.caracteristicas.vagas > 0 && (
                                <div className="flex items-center gap-1">
                                  <IconCar size={16} />
                                  <span>{imovel.caracteristicas.vagas} vaga{imovel.caracteristicas.vagas !== 1 ? 's' : ''}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-4">
                              <div className="text-lg md:text-xl font-bold text-orange-600">
                                {formatarPreco(imovel.preco)}
                              </div>
                              
                              <div className="flex gap-2">
                                {imovel.telefone && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1"
                                    onClick={() => abrirWhatsApp(imovel.telefone!, imovel.id)}
                                  >
                                    <Phone className="h-4 w-4" />
                                    Contato
                                  </Button>
                                )}
                                
                                <Button variant="default" size="sm" className="gap-1">
                                  <ArrowRight className="h-4 w-4" />
                                  Ver detalhes
                                </Button>
                              </div>
                            </div>
                            
                            {imovel.construtora && (
                              <div className="mt-3 text-sm text-gray-500">
                                Construtora: {imovel.construtora}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Ação principal */}
                  <div className="flex flex-col items-center mt-6">
                    <Button 
                      variant="default" 
                      size="lg" 
                      className="w-full sm:w-auto"
                      onClick={handleDownloadPDF}
                      disabled={downloadIniciado}
                    >
                      {downloadIniciado ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Gerando PDF...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-5 w-5" />
                          Baixar Relatório Completo em PDF
                        </>
                      )}
                    </Button>
                    
                    {pdfError && (
                      <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {pdfError}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Este relatório é válido por 7 dias. Os valores e disponibilidade dos imóveis podem mudar.
                    <br />Contate as construtoras para obter informações atualizadas.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}