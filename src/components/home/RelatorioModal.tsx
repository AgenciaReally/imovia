"use client";

import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download, Printer, Mail, CheckCircle2, MapPin, Loader2, Phone } from 'lucide-react';
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Imóveis Recomendados para Você
          </DialogTitle>
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
                  <MapPin className="h-4 w-4 mr-1" />
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
              <h3 className="font-semibold text-gray-800 mb-4">
                Imóveis Encontrados ({imoveis?.length || 0})
              </h3>
              
              {!imoveis || imoveis.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <IconMap className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Nenhum imóvel encontrado com os critérios selecionados.</p>
                </div>
              ) : (
                <div className="grid gap-4">
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
                        
                        {/* Botão WhatsApp padrão igual ao mapa interativo */}
                        <div className="mt-3 pt-3 border-t">
                          <Button 
                            size="sm"
                            className="w-full text-sm font-medium bg-green-600 text-white hover:bg-green-700 gap-2 shadow-lg rounded-full py-3 transition-all duration-200 hover:scale-105"
                            onClick={() => {
                              const detalhes = [
                                `🏠 Título: ${imovel.titulo}`,
                                `🆔 ID: ${imovel.id}`,
                                `💰 Preço: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(imovel.preco)}`,
                                imovel.quartos ? `🛏️ Quartos: ${imovel.quartos}` : '',
                                imovel.banheiros ? `🚿 Banheiros: ${imovel.banheiros}` : '',
                                imovel.area ? `📐 Área: ${imovel.area}m²` : '',
                                imovel.vagas ? `🚗 Vagas: ${imovel.vagas}` : '',
                                (imovel.thumbnail || imovel.fotoPrincipal) ? `📸 Foto: ${imovel.thumbnail || imovel.fotoPrincipal}` : ''
                              ].filter(Boolean).join('\n');
                              
                              const mensagem = `Olá, vim através do app iMovia e gostaria de obter mais informações sobre este imóvel:\n\n${detalhes}`;
                              window.open(`https://wa.me/554192223032?text=${encodeURIComponent(mensagem)}`, '_blank');
                            }}
                          >
                            <Phone className="h-4 w-4" />
                            Atendimento direto
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
