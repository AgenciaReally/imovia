"use client"

import React from "react"
import { motion } from "framer-motion"
import { Calendar, User, Hash, MessageSquare, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatarValorResposta, formatarCategoria, corCategoria } from "@/utils/formatarRespostas"

interface RespostaCompleta {
  id: string
  perguntaId: string
  pergunta: {
    id: string
    texto: string
    tipo: string
    categoria: string
    fluxo?: string
  }
  valor?: string
  createdAt?: string
  updatedAt?: string
  usuario?: {
    name?: string
    email?: string
    telefone?: string
  }
}

interface CardRespostaProps {
  resposta: RespostaCompleta
  showUserInfo?: boolean
  onViewDetails?: (resposta: RespostaCompleta) => void
}

export function CardResposta({ resposta, showUserInfo = false, onViewDetails }: CardRespostaProps) {
  const formatarData = (dataString: string | null | undefined) => {
    if (!dataString) return 'Data não disponível'
    
    try {
      const data = new Date(dataString)
      if (isNaN(data.getTime())) return 'Data inválida'
      
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(data)
    } catch (error) {
      return 'Erro na data'
    }
  }

  const valorFormatado = formatarValorResposta(
    resposta.valor || '', 
    resposta.pergunta.tipo
  )

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary">
        <CardContent className="p-6">
          {/* Header com categoria e tipo */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className={`${corCategoria(resposta.pergunta.categoria)} text-xs font-medium`}
              >
                {formatarCategoria(resposta.pergunta.categoria)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {resposta.pergunta.tipo}
              </Badge>
            </div>
            
            {onViewDetails && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onViewDetails(resposta)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Pergunta */}
          <div className="mb-4">
            <h3 className="font-semibold text-base leading-tight mb-2 text-foreground">
              {resposta.pergunta.texto}
            </h3>
          </div>

          {/* Resposta */}
          <div className="mb-4">
            <div className="bg-muted/50 rounded-lg p-3 border-l-2 border-l-primary/30">
              <p className="text-sm font-medium text-foreground leading-relaxed">
                {valorFormatado}
              </p>
            </div>
          </div>

          {/* Footer com informações */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              {/* Data */}
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatarData(resposta.updatedAt || resposta.createdAt)}</span>
              </div>
              
              {/* ID da pergunta */}
              <div className="flex items-center gap-1">
                <Hash className="h-3 w-3" />
                <span className="font-mono">{resposta.perguntaId.slice(-8)}</span>
              </div>
            </div>

            {/* Info do usuário (só para admin) */}
            {showUserInfo && resposta.usuario && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>
                  {resposta.usuario.name || resposta.usuario.email?.split('@')[0] || 'Usuário'}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
