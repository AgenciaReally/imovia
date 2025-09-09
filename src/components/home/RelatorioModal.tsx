"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, Home, Loader2, MapPin as IconMap, Phone } from "lucide-react";
import { useRef, useState } from "react";
import { X, CheckCircle2, Mail } from 'lucide-react';

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
interface RelatorioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dados: any;
  imoveis: any[];
  finalizarSimulacao?: boolean;
  loading?: boolean;
  cidade?: string | null;
  bairro?: string | null;
  onSolicitarRelatorio?: () => void;
  onEnviarRelatorioEmail?: () => void;
}

export default function RelatorioModal({
  open,
  onOpenChange,
  dados,
  imoveis,
  finalizarSimulacao = false,
  loading = false,
  cidade,
  bairro,
  onSolicitarRelatorio,
  onEnviarRelatorioEmail,
}: RelatorioModalProps) {
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
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onOpenChange(false)}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-center text-orange-800">
            📊 Relatório de Imóveis Personalizados
          </DialogTitle>
          <p className="text-center text-gray-600 mt-2">
            Baseado na sua análise IA e preferências informadas
          </p>
        </DialogHeader>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-[#fe4f17]" />
            <p className="mt-4 text-gray-500">Gerando seu relatório personalizado...</p>
          </div>
        ) : (
          <div ref={reportRef} className="bg-white p-4 rounded-lg">
            {/* Header do Relatório */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Relatório de Imóveis Personalizados
              </h2>
              <p className="text-gray-600">
                Baseado nas suas preferências e necessidades
              </p>
              {(cidade || bairro) && (
                <div className="flex items-center justify-center mt-2 text-sm text-gray-500">
                  <IconMap className="h-4 w-4 mr-1" />
                  <span>
                    {bairro && cidade ? `${bairro}, ${cidade}` : bairro || cidade}
                  </span>
                </div>
              )}
            </div>

            {/* Resumo das Preferências */}
            {dados && Object.keys(dados).length > 0 && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />
                  Suas Preferências
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {Object.entries(dados).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                      </span>
                      <span className="font-medium text-gray-800">
                        {typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lista de Imóveis */}
            <div className="mb-6">
              <h3 className="font-semibold text-orange-800 mb-4 text-lg flex items-center gap-2">
                <Home className="h-5 w-5" />
                Imóveis Selecionados pela IA ({imoveis?.length || 0})
              </h3>
              
              {!imoveis || imoveis.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  <IconMap className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-lg font-medium mb-2">Nenhum imóvel encontrado</p>
                  <p className="text-sm">Ajuste seus critérios ou tente outra cidade.</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {imoveis.map((imovel, index) => (
                    <div key={imovel.id} className="border-2 border-orange-100 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:border-orange-200">
                      <div className="flex flex-col md:flex-row">
                        {/* Imagem */}
                        <div className="md:w-1/3">
                          {(imovel.thumbnail || imovel.fotoPrincipal) ? (
                            <div className="relative aspect-video md:aspect-square">
                              <img 
                                src={imovel.thumbnail || imovel.fotoPrincipal} 
                                alt={imovel.titulo}
                                className="w-full h-full object-cover"
                              />
                              {(imovel.matchPercentage || imovel.score) && (
                                <Badge className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold">
                                  #{index + 1} - {imovel.matchPercentage || imovel.score}% Match
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <div className="aspect-video md:aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                              <Home className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        {/* Detalhes */}
                        <div className="flex-1 p-6">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-bold text-xl text-gray-800 leading-tight">{imovel.titulo}</h4>
                            <p className="text-orange-600 font-bold text-2xl">
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                                maximumFractionDigits: 0
                              }).format(imovel.preco)}
                            </p>
                          </div>
                          
                          {/* Características */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                            {imovel.quartos && (
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <span className="font-medium">{imovel.quartos}</span> quartos
                              </div>
                            )}
                            {imovel.banheiros && (
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <span className="font-medium">{imovel.banheiros}</span> banheiros
                              </div>
                            )}
                            {imovel.area && (
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <span className="font-medium">{imovel.area}m²</span> área
                              </div>
                            )}
                            {imovel.vagas && (
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <span className="font-medium">{imovel.vagas}</span> vagas
                              </div>
                            )}
                          </div>
                          
                          {/* Motivos da IA */}
                          {imovel.motivos && imovel.motivos.length > 0 && (
                            <div className="mb-4">
                              <p className="text-sm font-semibold text-gray-700 mb-2">Por que a IA escolheu este imóvel:</p>
                              <div className="flex flex-wrap gap-1">
                                {imovel.motivos.map((motivo: string, idx: number) => (
                                  <Badge key={idx} variant="outline" className="text-xs border-orange-300 text-orange-700">
                                    {motivo}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Botão WhatsApp */}
                          <Button 
                            size="sm"
                            className="w-full bg-green-600 text-white hover:bg-green-700 gap-2 shadow-lg rounded-lg py-3 transition-all duration-200 hover:scale-105"
                            onClick={() => {
                              const detalhes = [
                                `🏠 Título: ${imovel.titulo}`,
                                `🆔 ID: ${imovel.id}`,
                                `💰 Preço: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(imovel.preco)}`,
                                imovel.quartos ? `🛏️ Quartos: ${imovel.quartos}` : '',
                                imovel.banheiros ? `🚿 Banheiros: ${imovel.banheiros}` : '',
                                imovel.area ? `📐 Área: ${imovel.area}m²` : '',
                                imovel.vagas ? `🚗 Vagas: ${imovel.vagas}` : '',
                                `📍 Endereço: ${imovel.endereco || 'Não informado'}`
                              ].filter(Boolean).join('\n');
                              
                              const mensagem = `Olá! Vim através do app iMovia e gostaria de mais informações sobre este imóvel selecionado pela nossa IA:\n\n${detalhes}\n\nObrigado!`;
                              window.open(`https://wa.me/554192223032?text=${encodeURIComponent(mensagem)}`, '_blank');
                            }}
                          >
                            <Phone className="h-4 w-4" />
                            Entrar em Contato
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-between items-center pt-4 border-t">
              <Button 
                variant="ghost" 
                onClick={() => onOpenChange(false)}
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
