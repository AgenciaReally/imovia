"use client";

import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Loader2, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IconMap } from "@tabler/icons-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "@/components/ui/use-toast";

// Interface para os imóveis recomendados
interface Imovel {
  id: string;
  titulo: string;
  preco: number;
  caracteristicas?: {
    quartos: number;
    banheiros: number;
    area: number;
    vagas?: number;
  };
  quartos?: number;
  banheiros?: number;
  area?: number;
  vagas?: number;
  thumbnail?: string;
  fotoPrincipal?: string;
  matchPercentage?: number;
  destaque?: boolean;
  telefone?: string;
  telefoneContato?: string;
  construtora?: string;
}

// Interface para as respostas da simulação
interface RespostaSimulacao {
  pergunta: string;
  resposta: string | number | boolean;
  categoria?: string;
}

// Props do componente
interface NewRelatorioModalProps {
  isOpen: boolean;
  onClose: () => void;
  imoveis?: Imovel[];
  isLoading?: boolean;
  valorMaximo?: number;
  respostasSimulacao?: RespostaSimulacao[];
  dadosCredito?: {
    rendaMensal?: number;
    valorImovel?: number;
    entradaDisponivel?: number;
    valorParcelaMaxima?: number;
    temOutrosEmprestimos?: boolean;
    score?: number;
    aprovado?: boolean;
  };
}

export default function NewRelatorioModal({ 
  isOpen, 
  onClose, 
  imoveis = [], 
  isLoading = false,
  valorMaximo = 0,
  respostasSimulacao = [],
  dadosCredito = {}
}: NewRelatorioModalProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Função para baixar o relatório como PDF
  const downloadPDF = async () => {
    if (reportRef.current) {
      try {
        toast({
          title: "Gerando PDF...",
          description: "O download começará automaticamente em instantes.",
        });

        const canvas = await html2canvas(reportRef.current, {
          scale: 2,
          useCORS: true,
          logging: false
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const ratio = canvas.width / canvas.height;
        const imgWidth = pdfWidth;
        const imgHeight = pdfWidth / ratio;
        
        // Centralizar verticalmente se a imagem for menor que a página
        const yPosition = Math.max(0, (pdfHeight - imgHeight) / 2);
        
        pdf.addImage(imgData, 'PNG', 0, yPosition, imgWidth, imgHeight);
        pdf.save('relatorio-imoveis.pdf');
        
        toast({
          title: "PDF Gerado com Sucesso!",
          description: "O relatório foi salvo no seu dispositivo.",
        });
      } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        toast({
          variant: "destructive",
          title: "Erro ao Gerar PDF",
          description: "Ocorreu um erro ao gerar o PDF. Tente novamente.",
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Imóveis Recomendados para Você
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-[#fe4f17]" />
            <p className="mt-4 text-gray-500">Gerando seu relatório personalizado...</p>
          </div>
        ) : (
          <div ref={reportRef} className="bg-white p-4 rounded-lg">
            {valorMaximo > 0 && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-medium text-lg">Parâmetros da Busca</h3>
                <div className="mt-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Valor máximo:</span>{' '}
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      maximumFractionDigits: 0
                    }).format(valorMaximo)}
                  </p>
                </div>
              </div>
            )}
            
            {/* Seção de Simulação de Crédito */}
            {dadosCredito && Object.keys(dadosCredito).length > 0 && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-medium text-lg mb-3">Simulação de Crédito</h3>
                
                {dadosCredito.aprovado !== undefined && (
                  <div className={`p-3 mb-4 rounded-md ${dadosCredito.aprovado ? 'bg-green-50 border border-green-100' : 'bg-amber-50 border border-amber-100'}`}>
                    <p className={`font-medium ${dadosCredito.aprovado ? 'text-green-700' : 'text-amber-700'}`}>
                      {dadosCredito.aprovado ? 'Pré-aprovado' : 'Requer análise adicional'}
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dadosCredito.rendaMensal !== undefined && (
                    <div>
                      <p className="text-sm text-gray-500">Renda Mensal</p>
                      <p className="font-medium">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(dadosCredito.rendaMensal)}
                      </p>
                    </div>
                  )}
                  
                  {dadosCredito.valorImovel !== undefined && (
                    <div>
                      <p className="text-sm text-gray-500">Valor do Imóvel</p>
                      <p className="font-medium">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(dadosCredito.valorImovel)}
                      </p>
                    </div>
                  )}
                  
                  {dadosCredito.entradaDisponivel !== undefined && (
                    <div>
                      <p className="text-sm text-gray-500">Entrada Disponível</p>
                      <p className="font-medium">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(dadosCredito.entradaDisponivel)}
                        {dadosCredito.valorImovel && (
                          <span className="text-xs text-gray-500 ml-1">
                            ({Math.round((dadosCredito.entradaDisponivel / dadosCredito.valorImovel) * 100)}%)
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  
                  {dadosCredito.valorParcelaMaxima !== undefined && (
                    <div>
                      <p className="text-sm text-gray-500">Parcela Máxima</p>
                      <p className="font-medium">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(dadosCredito.valorParcelaMaxima)}
                        {dadosCredito.rendaMensal && (
                          <span className="text-xs text-gray-500 ml-1">
                            ({Math.round((dadosCredito.valorParcelaMaxima / dadosCredito.rendaMensal) * 100)}% da renda)
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  
                  {dadosCredito.score !== undefined && (
                    <div>
                      <p className="text-sm text-gray-500">Score de Crédito</p>
                      <p className="font-medium">{dadosCredito.score}</p>
                    </div>
                  )}
                  
                  {dadosCredito.temOutrosEmprestimos !== undefined && (
                    <div>
                      <p className="text-sm text-gray-500">Outros Empréstimos</p>
                      <p className="font-medium">{dadosCredito.temOutrosEmprestimos ? 'Sim' : 'Não'}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Respostas do Questionário */}
            {respostasSimulacao && respostasSimulacao.length > 0 && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-medium text-lg mb-3">Preferências do Imóvel</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                  {respostasSimulacao.map((item, index) => (
                    <div key={index} className="border-b pb-2">
                      <p className="text-sm text-gray-500">{item.pergunta}</p>
                      <p className="font-medium">
                        {typeof item.resposta === 'boolean'
                          ? (item.resposta ? 'Sim' : 'Não')
                          : typeof item.resposta === 'number'
                            ? (item.categoria === 'VALOR' 
                                ? new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                  }).format(item.resposta)
                                : item.resposta)
                            : item.resposta}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Imóveis Recomendados</h2>
                <Button 
                  onClick={downloadPDF}
                  variant="outline" 
                  className="flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Salvar PDF
                </Button>
              </div>
              
              {imoveis.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Nenhum imóvel encontrado com os parâmetros informados.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {imoveis.map(imovel => (
                    <div key={imovel.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      {(imovel.thumbnail || imovel.fotoPrincipal) ? (
                        <div className="relative aspect-video">
                          <img 
                            src={imovel.thumbnail || imovel.fotoPrincipal} 
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
                        {/* Removida a exibição de características conforme solicitado */}
                        {(imovel.telefone || imovel.telefoneContato) && (
                          <div className="mt-3 pt-3 border-t">
                            <Button 
                              size="sm"
                              variant="outline" 
                              className="w-full flex items-center justify-center text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                              onClick={() => {
                                const telefone = (imovel.telefone || imovel.telefoneContato || '').replace(/\D/g, '');
                                if (telefone) {
                                  window.open(`https://wa.me/55${telefone}?text=Olá! Vi este imóvel no site e gostaria de mais informações.`, '_blank');
                                }
                              }}
                            >
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Falar no WhatsApp
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
