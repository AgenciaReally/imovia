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

// Mapeamento de IDs de perguntas para textos legíveis
const PERGUNTAS_MAPEAMENTO: Record<string, string> = {
  // Avaliação de Crédito
  "Seed- A V A L I A C A O C R E D I T O-10": "Renda mensal",
  "Seed- A V A L I A C A O  C R E D I T O-10": "Renda mensal",
  "Seed- A V A L I A C A O C R E D I T O-11": "Possui restrição de crédito",
  "Seed- A V A L I A C A O C R E D I T O-12": "Data de nascimento",
  
  // Informações Complementares
  "Seed- I N F O C O M P L E M E N T A R E S-1": "Valor do imóvel",
  "Seed- I N F O C O M P L E M E N T A R E S-2": "Valor parcela máxima",
  "Seed- I N F O C O M P L E M E N T A R E S-3": "Prazo do financiamento",
  "Seed- I N F O C O M P L E M E N T A R E S-4": "Entrada disponível",
  "Seed- I N F O C O M P L E M E N T A R E S-5": "Valor do financiamento",
  
  // Preferências
  "Seed- P R E F E R E N C I A S-1": "Código da cidade",
  "Seed- P R E F E R E N C I A S-2": "Bairros Selecionados",
  "Seed- P R E F E R E N C I A S-3": "Local Trabalho",
  "Seed- P R E F E R E N C I A S-4": "Local da escola",
  
  // Empreendimento
  "Seed- E M P R E E N D I M E N T O-1": "Importância do piso nos quartos",
  "Seed- E M P R E E N D I M E N T O-2": "Importância da academia",
  "Seed- E M P R E E N D I M E N T O-3": "Importância da piscina",
  "Seed- E M P R E E N D I M E N T O-4": "Tipo de portaria preferido",
  "Seed- E M P R E E N D I M E N T O-5": "Importância do salão de festas",
  "Seed- E M P R E E N D I M E N T O-6": "Importância do playground",
  "Seed- E M P R E E N D I M E N T O-7": "Importância do espaço pet",
  
  // Proximidades
  "Seed- P R O X I M I D A D E S-1": "Importância de parques próximos",
  "Seed- P R O X I M I D A D E S-2": "Importância de shoppings próximos",
  "Seed- P R O X I M I D A D E S-3": "Importância de restaurantes próximos",
  "Seed- P R O X I M I D A D E S-4": "Importância da caminhabilidade",
  "Seed- P R O X I M I D A D E S-5": "Possui pet",
  "Seed- P R O X I M I D A D E S-6": "Importância de escolas próximas",
  "Seed- P R O X I M I D A D E S-7": "Importância de transporte público próximo",
  
  // Campos gerais
  "rendaMensal": "Renda mensal",
  "valorImovel": "Valor do imóvel",
  "entradaDisponivel": "Entrada disponível",
  "valorParcelaMaxima": "Valor máximo da parcela",
  "temOutrosEmprestimos": "Possui outros empréstimos",
  "aprovado": "Pré-aprovado",
  "score": "Score de avaliação",
  "codCidade": "Código da cidade",
  "nomeCidade": "Cidade",
  "bairros": "Bairros de interesse",
  "localTrabalho": "Local de trabalho",
  "quartos": "Número de quartos",
  "banheiros": "Número de banheiros",
  "valorMaximoImovel": "Valor máximo do imóvel",
  "fgts": "Valor do FGTS",
  "proximidades": "Proximidades desejadas",
  "tipoImovel": "Tipo de imóvel",
  "prazoFinanciamento": "Prazo de financiamento",
  "tipoPortaria": "Tipo de portaria",
  "localizacao": "Localização",
  "caracteristicas": "Características"
};

// Hooks para copiar conteúdo
const useCopyToClipboard = () => {
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Falha ao copiar texto:', error);
      return false;
    }
  };
  
  return { copy };
};

export function NewRelatorioModal({ isOpen, onClose, respostas, isLoading = false, imoveis = [] }: RelatorioModalProps) {
  const [activeTab, setActiveTab] = useState("respostas");
  const relatorioPdfRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [downloadIniciado, setDownloadIniciado] = useState(false);
  const { copy } = useCopyToClipboard();
  const [copiado, setCopiado] = useState(false);
  
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
    Object.entries(respostas || {}).forEach(([chave, valor]) => {
      // Ignorar campos internos e metadados
      if (chave.startsWith('_') || chave === 'userId' || chave === 'fluxoAtual' || valor === undefined || valor === null) {
        return;
      }
      
      // Verificar se existe no mapeamento direto
      let categoriaEncontrada = false;
      
      // Caso especial para chaves com prefixo Seed
      if (chave.startsWith('Seed-')) {
        for (const categoria of CATEGORIAS) {
          for (const prefixo of categoria.prefixos) {
            if (chave.includes(prefixo.replace(/\s+/g, ''))) {
              grupos[categoria.titulo][chave] = valor;
              categoriaEncontrada = true;
              break;
            }
          }
          if (categoriaEncontrada) break;
        }
      }
      
      // Se não encontrou ainda, procurar nas categorias por prefixos
      if (!categoriaEncontrada) {
        for (const categoria of CATEGORIAS) {
          for (const prefixo of categoria.prefixos) {
            if (chave.startsWith(prefixo) || chave.includes(prefixo)) {
              grupos[categoria.titulo][chave] = valor;
              categoriaEncontrada = true;
              break;
            }
          }
          if (categoriaEncontrada) break;
        }
      }
      
      // Se ainda não encontrou, coloca em "Outros"
      if (!categoriaEncontrada) {
        grupos["Outros"][chave] = valor;
      }
    });
    
    // Remover categorias vazias
    return Object.fromEntries(
      Object.entries(grupos).filter(([_, valores]) => Object.keys(valores).length > 0)
    );
  };
  
  // Função para obter nome legível da pergunta
  const getNomePergunta = (chave: string): string => {
    // Verificar se há mapeamento direto
    if (PERGUNTAS_MAPEAMENTO[chave]) {
      return PERGUNTAS_MAPEAMENTO[chave];
    }
    
    // Remover prefixos e caracteres especiais para chaves do tipo Seed-
    if (chave.startsWith('Seed-')) {
      // Extrair o número da pergunta (ex: Seed- P R E F E R E N C I A S-2 -> 2)
      const numeroPergunta = chave.split('-').pop();
      
      // Extrair nome da categoria
      let categoriaNome = "";
      if (chave.includes('A V A L I A C A O C R E D I T O')) {
        categoriaNome = "Avaliação de Crédito";
      } else if (chave.includes('I N F O C O M P L E M E N T A R E S')) {
        categoriaNome = "Informações Complementares";
      } else if (chave.includes('P R E F E R E N C I A S')) {
        categoriaNome = "Preferências";
      } else if (chave.includes('E M P R E E N D I M E N T O')) {
        categoriaNome = "Características do Empreendimento";
      } else if (chave.includes('P R O X I M I D A D E S')) {
        categoriaNome = "Proximidades";
      }
      
      // Se tiver categoria e número, retornar "Pergunta X da categoria Y"
      if (categoriaNome && numeroPergunta) {
        return `Pergunta ${numeroPergunta} de ${categoriaNome}`;
      }
    }
    
    // Tentar formatar chave para ficar mais legível
    return chave
      .replace(/([A-Z])/g, ' $1') // adicionar espaço antes de letras maiúsculas
      .replace(/^./, str => str.toUpperCase()) // primeira letra maiúscula
      .replace(/[_-]/g, ' ') // substituir underscores e hífens por espaços
      .trim();
  };
  
  // Formatar o valor para exibição
  const formatarValor = (valor: any): string => {
    if (valor === null || valor === undefined) return "";
    
    if (typeof valor === 'boolean') {
      return valor ? "Sim" : "Não";
    }
    
    if (valor instanceof Date) {
      return valor.toLocaleDateString('pt-BR');
    }
    
    if (typeof valor === 'string' && valor.match(/^\d{4}-\d{2}-\d{2}/)) {
      try {
        return new Date(valor).toLocaleDateString('pt-BR');
      } catch (e) {
        return valor;
      }
    }
    
    if (Array.isArray(valor)) {
      return valor.join(', ');
    }
    
    return String(valor);
  };
  
  // Gerar PDF com o relatório
  const gerarPDF = async () => {
    setDownloadIniciado(true);
    
    if (relatorioPdfRef.current) {
      try {
        const canvas = await html2canvas(relatorioPdfRef.current, {
          scale: 1.5,
          useCORS: true,
          logging: false
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 0.8);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
        pdf.save(`Relatório iMovia - ${new Date().toLocaleDateString('pt-BR')}.pdf`);
        
        toast({
          title: "PDF gerado com sucesso",
          description: "O download do seu relatório foi iniciado"
        });
      } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        toast({
          title: "Erro ao gerar PDF",
          description: "Ocorreu um problema ao gerar o relatório",
          variant: "destructive",
        });
      } finally {
        setDownloadIniciado(false);
      }
    }
  };
  
  // Função para copiar o relatório como texto
  const copiarRelatorio = async () => {
    const textoCategorias = Object.entries(agruparRespostas()).map(([categoria, items]) => {
      const itensTexto = Object.entries(items).map(([chave, valor]) => {
        return `${getNomePergunta(chave)}: ${formatarValor(valor)}`;
      }).join('\n');
      
      return `${categoria}\n${itensTexto}`;
    }).join('\n\n');
    
    const sucessoCopia = await copy(textoCategorias);
    if (sucessoCopia) {
      setCopiado(true);
      toast({
        title: "Relatório copiado",
        description: "O relatório foi copiado para a área de transferência"
      });
      
      setTimeout(() => setCopiado(false), 2000);
    }
  };
  
  // Renderizar o componente
  return (
    <Dialog open={isOpen} onOpenChange={isLoading ? undefined : onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#fe4f17]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            Relatório de Preferências
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-[#fe4f17]" />
            <p className="mt-4 text-muted-foreground">Gerando seu relatório...</p>
          </div>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
              <TabsList className="m-0 justify-start px-0 pt-0 pb-2 border-b overflow-x-auto">
                <TabsTrigger value="respostas" className="data-[state=active]:text-[#fe4f17] data-[state=active]:border-b-2 data-[state=active]:border-[#fe4f17] rounded-none">
                  Respostas
                </TabsTrigger>
                {imoveis.length > 0 && (
                  <TabsTrigger value="imoveis" className="data-[state=active]:text-[#fe4f17] data-[state=active]:border-b-2 data-[state=active]:border-[#fe4f17] rounded-none">
                    Imóveis Recomendados ({imoveis.length})
                  </TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="respostas" className="flex-1 overflow-y-auto p-1 pt-4">
                <div ref={relatorioPdfRef} className="bg-white p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[#fe4f17]">Suas Preferências</h2>
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={copiarRelatorio}
                      >
                        {copiado ? (
                          <>
                            <IconCheck className="mr-1 h-3 w-3" />
                            Copiado
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            Copiar
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={gerarPDF}
                        disabled={downloadIniciado}
                      >
                        {downloadIniciado ? (
                          <>
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            Gerando...
                          </>
                        ) : (
                          <>
                            <Download className="mr-1 h-3 w-3" />
                            PDF
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Conteúdo do relatório por categorias */}
                  <div className="space-y-6">
                    {Object.entries(agruparRespostas()).map(([categoria, items]) => (
                      <div key={categoria} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-100 p-3 font-medium text-gray-900 border-b">
                          {categoria}
                        </div>
                        <div className="p-3 divide-y">
                          {Object.entries(items).map(([chave, valor]) => (
                            <div key={chave} className="py-2 flex flex-wrap justify-between">
                              <span className="font-medium text-gray-700 mr-2">
                                {getNomePergunta(chave)}:
                              </span>
                              <span className="text-gray-900">
                                {formatarValor(valor)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              {imoveis.length > 0 && (
                <TabsContent value="imoveis" className="flex-1 overflow-y-auto p-1 pt-4">
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-[#fe4f17] mb-4">Imóveis Recomendados para Você</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {imoveis.map((imovel) => (
                        <div key={imovel.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-all">
                          {imovel.thumbnail ? (
                            <div className="aspect-video bg-gray-100 relative overflow-hidden">
                              <img 
                                src={imovel.thumbnail} 
                                alt={imovel.titulo} 
                                className="w-full h-full object-cover"
                              />
                              {imovel.matchPercentage && (
                                <Badge className="absolute top-2 right-2 bg-[#fe4f17]">
                                  {imovel.matchPercentage}% Match
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <div className="aspect-video bg-gray-100 flex items-center justify-center">
                              <IconMap className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                          <div className="p-4">
                            <h3 className="font-bold truncate">{imovel.titulo}</h3>
                            <p className="text-[#fe4f17] font-bold text-lg mt-1">
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                                maximumFractionDigits: 0
                              }).format(imovel.preco)}
                            </p>
                            <div className="flex mt-2 text-sm text-gray-500 gap-3">
                              {imovel.caracteristicas?.quartos && (
                                <div className="flex items-center">
                                  <IconBed className="h-4 w-4 mr-1" />
                                  {imovel.caracteristicas.quartos} {imovel.caracteristicas.quartos === 1 ? 'quarto' : 'quartos'}
                                </div>
                              )}
                              {imovel.caracteristicas?.banheiros && (
                                <div className="flex items-center">
                                  <IconBath className="h-4 w-4 mr-1" />
                                  {imovel.caracteristicas.banheiros} {imovel.caracteristicas.banheiros === 1 ? 'banho' : 'banhos'}
                                </div>
                              )}
                              {imovel.caracteristicas?.area && (
                                <div className="flex items-center">
                                  <IconRuler className="h-4 w-4 mr-1" />
                                  {imovel.caracteristicas.area}m²
                                </div>
                              )}
                              {imovel.caracteristicas?.vagas && (
                                <div className="flex items-center">
                                  <IconCar className="h-4 w-4 mr-1" />
                                  {imovel.caracteristicas.vagas} {imovel.caracteristicas.vagas === 1 ? 'vaga' : 'vagas'}
                                </div>
                              )}
                            </div>
                            {imovel.telefone && (
                              <div className="mt-3 pt-3 border-t flex">
                                <Phone className="h-4 w-4 mr-2 text-[#fe4f17]" />
                                <span className="text-sm">{imovel.telefone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
            
            <div className="mt-6 flex justify-between items-center pt-4 border-t">
              <Button 
                variant="ghost" 
                onClick={onClose}
              >
                Fechar
              </Button>
              
              <div className="flex text-sm text-gray-500 items-center">
                <span className="mr-1">Gerado em </span>
                <span className="font-medium">
                  {new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

