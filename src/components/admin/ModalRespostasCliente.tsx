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
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CardResposta } from "@/components/respostas/CardResposta";
import { MessageSquare, User, Clock } from "lucide-react";

interface Resposta {
  id: string;
  userId: string;
  perguntaId: string;
  pergunta?: {
    texto: string;
    categoria: string;
    tipo?: string;
  };
  usuario?: {
    email: string;
    name?: string;
  };
  valor: string;
  createdAt: string;
  updatedAt: string;
}

interface Cliente {
  id: string;
  name?: string;
  email: string;
  totalRespostas: number;
}

interface ModalRespostasClienteProps {
  cliente: Cliente | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ModalRespostasCliente({ cliente, open, onOpenChange }: ModalRespostasClienteProps) {
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && cliente) {
      buscarRespostasCliente();
    }
  }, [open, cliente]);

  const buscarRespostasCliente = async () => {
    if (!cliente) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/respostas/cliente/${cliente.id}`);
      if (response.ok) {
        const data = await response.json();
        setRespostas(data.respostas || []);
      }
    } catch (error) {
      console.error("Erro ao buscar respostas do cliente:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!cliente) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Respostas de {cliente.name || cliente.email}
          </DialogTitle>
          <DialogDescription>
            Visualize todas as respostas deste cliente no questionário
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 py-2">
          <Badge variant="secondary" className="gap-1">
            <MessageSquare className="h-3 w-3" />
            {cliente.totalRespostas} respostas
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            Cliente: {cliente.email}
          </Badge>
        </div>

        <ScrollArea className="max-h-[60vh]">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[200px] rounded-xl" />
              ))}
            </div>
          ) : respostas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma resposta encontrada</h3>
              <p className="text-muted-foreground">
                Este cliente ainda não respondeu ao questionário.
              </p>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.05 }
                },
                hidden: {}
              }}
            >
              {respostas.map((resposta) => (
                <motion.div
                  key={resposta.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <CardResposta 
                    resposta={resposta as any}
                    showUserInfo={false}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
