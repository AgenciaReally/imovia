"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, DownloadCloud, MapPin, ThumbsUp, Home, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

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
  localizacao: {
    lat: number;
    lng: number;
    endereco?: string;
  };
  thumbnail?: string;
  matchPercentage?: number;
  destaque?: boolean;
  telefone?: string;
}

interface ResultadoImoveisProps {
  respostas: Record<string, any>;
  concluido: boolean;
  onSolicitarRelatorio: () => void;
  relatorioSolicitado: boolean;
}

export const ResultadoImoveis = ({
  respostas,
  concluido,
  onSolicitarRelatorio,
  relatorioSolicitado
}: ResultadoImoveisProps) => {
  const [imoveisDestaque, setImoveisDestaque] = useState<Imovel[]>([
    {
      id: "orulo-001",
      titulo: "Apartamento Luxuoso",
      preco: 850000,
      caracteristicas: {
        quartos: 3,
        banheiros: 2,
        area: 120,
        vagas: 2
      },
      localizacao: { 
        lat: -25.428954, 
        lng: -49.267137,
        endereco: "Centro, Curitiba - PR"
      },
      thumbnail: "/mock/property1.jpg",
      matchPercentage: 95,
      destaque: true,
      telefone: "(41) 99999-0001"
    },
    {
      id: "orulo-002",
      titulo: "Casa Ampla com Jardim",
      preco: 1200000,
      caracteristicas: {
        quartos: 4,
        banheiros: 3,
        area: 240,
        vagas: 3
      },
      localizacao: { 
        lat: -25.432632, 
        lng: -49.280154,
        endereco: "Água Verde, Curitiba - PR"
      },
      thumbnail: "/mock/property2.jpg",
      matchPercentage: 87,
      destaque: true,
      telefone: "(41) 99999-0002"
    },
    {
      id: "orulo-003",
      titulo: "Cobertura Duplex",
      preco: 1500000,
      caracteristicas: {
        quartos: 3,
        banheiros: 3,
        area: 180,
        vagas: 2
      },
      localizacao: { 
        lat: -25.424125, 
        lng: -49.271234,
        endereco: "Batel, Curitiba - PR"
      },
      thumbnail: "/mock/property3.jpg",
      matchPercentage: 83,
      destaque: true,
      telefone: "(41) 99999-0003"
    }
  ]);

  const [mostrarModalMatches, setMostrarModalMatches] = useState(false);

  // Não mostrar nada se ainda não tiver concluído
  if (!concluido) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="backdrop-blur-md bg-white/60 p-8 rounded-3xl shadow-xl border border-white/30">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center mb-6 shadow-inner">
            <ThumbsUp className="w-10 h-10 text-orange-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Encontramos os imóveis ideais para você!
          </h2>
          <p className="text-gray-600 text-lg mt-2 max-w-2xl leading-relaxed">
            Com base nas suas respostas, identificamos os 3 imóveis que melhor atendem às suas preferências.
            Explore os cards abaixo ou solicite um relatório completo com análise detalhada.
          </p>
          
          <div className="flex gap-4 mt-8">
            <Button
              onClick={onSolicitarRelatorio}
              disabled={relatorioSolicitado}
              className={`${relatorioSolicitado ? 'bg-gray-100 text-gray-500' : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg'} rounded-full px-8 py-6 text-lg font-medium transition-all duration-300 hover:scale-105 gap-3`}
            >
              <DownloadCloud className="w-5 h-5" />
              {relatorioSolicitado ? 'Relatório solicitado' : 'Receber relatório completo'}
            </Button>
            
            <Button
              onClick={() => setMostrarModalMatches(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg rounded-full px-8 py-6 text-lg font-medium transition-all duration-300 hover:scale-105 gap-3"
            >
              <MapPin className="w-5 h-5" />
              Ver Matches no Mapa
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <AnimatePresence>
          {imoveisDestaque.map((imovel, index) => (
            <motion.div
              key={imovel.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15, type: "spring" }}
            >
              <Card className="h-full flex flex-col backdrop-blur-md bg-white/60 rounded-3xl shadow-lg border border-white/30 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-56 bg-gray-50/60">
                  <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
                    <div className="w-20 h-20 rounded-full bg-gray-100/70 flex items-center justify-center">
                      <Home className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="absolute bottom-5 left-0 right-0 text-center text-gray-500 text-sm px-4">
                      Imagem disponível após contato
                    </p>
                  </div>
                  
                  <Badge 
                    className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold px-3 py-1.5 rounded-full shadow-md"
                  >
                    {imovel.matchPercentage}% match
                  </Badge>
                  
                  <Badge 
                    variant="outline"
                    className="absolute top-3 left-3 backdrop-blur-md bg-white/70 border-white/50 px-2.5 py-1 rounded-full shadow-sm"
                  >
                    <MapPin className="w-3 h-3 mr-1 text-orange-500" />
                    Pin {index + 1}
                  </Badge>
                </div>
                
                <CardContent className="flex-grow pt-6 p-5">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg leading-tight">Imóvel borrado</h3>
                      <Badge variant="outline" className="text-xs font-normal bg-orange-50 text-orange-700 border-orange-200">
                        {imovel.caracteristicas.area}m²
                      </Badge>
                    </div>
                    <p className="text-gray-500 text-sm">
                      Localização borrada
                    </p>
                  </div>
                  
                  <div className="mt-3 mb-4">
                    <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600">
                      {imovel.preco.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      })}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="flex items-center p-3 bg-white/70 rounded-xl border border-white/60 shadow-sm">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                        <span className="font-bold text-orange-500">{imovel.caracteristicas.quartos}</span>
                      </div>
                      <p className="text-gray-700">Quartos</p>
                    </div>
                    <div className="flex items-center p-3 bg-white/70 rounded-xl border border-white/60 shadow-sm">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                        <span className="font-bold text-orange-500">{imovel.caracteristicas.banheiros}</span>
                      </div>
                      <p className="text-gray-700">Banheiros</p>
                    </div>
                  </div>
                </CardContent>
                
                <div className="px-5 pb-5">
                  <Button
                    className="w-full gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl h-12 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group-hover:shadow-md"
                    onClick={() => window.open(`tel:${imovel.telefone}`, '_blank')}
                  >
                    <Phone className="w-4 h-4" />
                    Entrar em contato
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Modal para exibir pins no mapa */}
      <Dialog open={mostrarModalMatches} onOpenChange={setMostrarModalMatches}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-hidden">
          <DialogTitle className="sr-only">Mapa de Matches</DialogTitle>
          <div className="relative w-full h-[80vh]">
            <div className="absolute top-3 right-3 z-50">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMostrarModalMatches(false)}
                className="rounded-full bg-white/80 hover:bg-white shadow-md"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="w-full h-full">
              <iframe 
                src="/mapa-interativo?modo=matches" 
                className="w-full h-full border-0"
                title="Mapa de Matches"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
