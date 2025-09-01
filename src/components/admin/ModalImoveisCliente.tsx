"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Home, 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Car, 
  Square,
  Star,
  ExternalLink
} from "lucide-react";

interface Imovel {
  id: string;
  titulo: string;
  endereco: string;
  preco: number;
  quartos: number;
  banheiros: number;
  vagas: number;
  area: number;
  score: number;
  construtora?: {
    nome: string;
    logo?: string;
  };
  imagens?: string[];
  descricao?: string;
}

interface Cliente {
  id: string;
  name?: string;
  email: string;
  totalRespostas: number;
}

interface ModalImoveisClienteProps {
  cliente: Cliente | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ModalImoveisCliente({ cliente, open, onOpenChange }: ModalImoveisClienteProps) {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && cliente) {
      buscarImoveisCliente();
    }
  }, [open, cliente]);

  const buscarImoveisCliente = async () => {
    if (!cliente) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/imoveis-sugeridos/${cliente.id}`);
      if (response.ok) {
        const data = await response.json();
        setImoveis(data.imoveis || []);
      }
    } catch (error) {
      console.error("Erro ao buscar imóveis do cliente:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(preco);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  if (!cliente) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Imóveis Sugeridos para {cliente.name || cliente.email}
          </DialogTitle>
          <DialogDescription>
            Os 3 melhores imóveis baseados nas respostas do questionário
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-[400px] rounded-xl" />
              ))}
            </div>
          ) : imoveis.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Home className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum imóvel sugerido</h3>
              <p className="text-muted-foreground">
                Este cliente ainda não possui imóveis sugeridos baseados em suas respostas.
              </p>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.1 }
                },
                hidden: {}
              }}
            >
              {imoveis.map((imovel, index) => (
                <motion.div
                  key={imovel.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <Badge variant={index === 0 ? "default" : "secondary"} className="mb-2">
                          {index + 1}º Lugar
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className={`h-4 w-4 ${getScoreColor(imovel.score)}`} />
                          <span className={`font-bold ${getScoreColor(imovel.score)}`}>
                            {imovel.score.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">
                        {imovel.titulo}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Preço */}
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-xl font-bold text-green-600">
                          {formatarPreco(imovel.preco)}
                        </span>
                      </div>

                      {/* Localização */}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm line-clamp-1">{imovel.endereco}</span>
                      </div>

                      {/* Características */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4 text-muted-foreground" />
                          <span>{imovel.quartos} quartos</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="h-4 w-4 text-muted-foreground" />
                          <span>{imovel.banheiros} banheiros</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Car className="h-4 w-4 text-muted-foreground" />
                          <span>{imovel.vagas} vagas</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Square className="h-4 w-4 text-muted-foreground" />
                          <span>{imovel.area}m²</span>
                        </div>
                      </div>

                      {/* Construtora */}
                      {imovel.construtora && (
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground">Construtora:</p>
                          <p className="text-sm font-medium">{imovel.construtora.nome}</p>
                        </div>
                      )}

                      {/* Descrição */}
                      {imovel.descricao && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {imovel.descricao}
                        </p>
                      )}

                      {/* Botão de ver mais */}
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        <ExternalLink className="h-3 w-3 mr-2" />
                        Ver Detalhes
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
