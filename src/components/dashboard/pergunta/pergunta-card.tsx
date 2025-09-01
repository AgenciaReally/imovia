"use client"

import { useState } from 'react'
import { Pergunta, CATEGORIAS_PERGUNTA, TIPOS_PERGUNTA, TIPOS_FLUXO } from '@/services/pergunta-service'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Edit, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Copy, 
  AlertCircle, 
  Type, 
  ListChecks,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { motion } from 'framer-motion'

interface PerguntaCardProps {
  pergunta: Pergunta
  onEdit: (pergunta: Pergunta) => void
  onDelete: (pergunta: Pergunta) => void
  onToggleAtiva: (pergunta: Pergunta, novoEstado: boolean) => void
  onMoveUp?: (pergunta: Pergunta) => void
  onMoveDown?: (pergunta: Pergunta) => void
  index: number
  total: number
}

export function PerguntaCard({ 
  pergunta, 
  onEdit, 
  onDelete, 
  onToggleAtiva,
  onMoveUp,
  onMoveDown,
  index,
  total
}: PerguntaCardProps) {
  const [expanded, setExpanded] = useState(false)
  
  // Encontrar nomes legíveis para exibição
  const categoria = CATEGORIAS_PERGUNTA.find(c => c.valor === pergunta.categoria)?.nome || pergunta.categoria
  const tipo = TIPOS_PERGUNTA.find(t => t.valor === pergunta.tipo)?.nome || pergunta.tipo
  const fluxo = TIPOS_FLUXO.find(f => f.valor === pergunta.fluxo)?.nome || pergunta.fluxo
  
  // Função para verificar se a pergunta tem opções
  const temOpcoes = () => {
    return ['select', 'radio', 'checkbox', 'priority'].includes(pergunta.tipo) && 
           pergunta.opcoes && 
           Object.keys(pergunta.opcoes).length > 0
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className={`group transition-all duration-200 hover:border-primary/50 ${!pergunta.ativa ? 'opacity-70' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Badge variant={pergunta.ativa ? "default" : "outline"} className="mr-2">
                {pergunta.ordem}
              </Badge>
              <CardTitle className="text-base text-gray-800 dark:text-gray-200">
                {pergunta.texto}
              </CardTitle>
            </div>
            
            <div className="flex space-x-1">
              {pergunta.geradaPorIA && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Sparkles className="h-4 w-4 text-amber-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Gerada por IA</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {!pergunta.ativa && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Pergunta inativa</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => onEdit(pergunta)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onToggleAtiva(pergunta, !pergunta.ativa)}>
                    {pergunta.ativa ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Desativar
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Ativar
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onMoveUp?.(pergunta)} disabled={index === 0}>
                    <MoveUp className="h-4 w-4 mr-2" />
                    Mover para cima
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onMoveDown?.(pergunta)} disabled={index === total - 1}>
                    <MoveDown className="h-4 w-4 mr-2" />
                    Mover para baixo
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(pergunta)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Substituindo CardDescription por div para evitar erro de hidraração com Badge */}
          <div className="text-sm text-muted-foreground flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="bg-primary/5">
              <Type className="h-3 w-3 mr-1" />
              {tipo}
            </Badge>
            <Badge variant="outline" className="bg-secondary/5">
              {categoria}
            </Badge>
            <Badge variant="outline" className="bg-amber-500/5">
              {fluxo}
            </Badge>
            {pergunta.obrigatoria && (
              <Badge variant="outline" className="bg-destructive/5">
                <AlertCircle className="h-3 w-3 mr-1" />
                Obrigatória
              </Badge>
            )}
            {pergunta.pontuacao > 1 && (
              <Badge variant="outline" className="bg-green-500/10">
                {pergunta.pontuacao} pts
              </Badge>
            )}
          </div>
        </CardHeader>
        
        {temOpcoes() && expanded && (
          <CardContent className="pt-0">
            <div className="text-sm font-medium mb-2">Opções de resposta:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(pergunta.opcoes).map(([value, label]) => (
                <div key={value} className="flex items-center text-sm px-2 py-1 rounded border bg-muted/30">
                  <ListChecks className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <span>{label as string}</span>
                </div>
              ))}
            </div>
          </CardContent>
        )}
        
        <CardFooter className="pt-2 pb-3 flex justify-between">
          <div className="text-xs text-muted-foreground">
            ID: {pergunta.id.substring(0, 8)}...
          </div>
          
          {temOpcoes() && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setExpanded(!expanded)}
              className="text-xs h-7"
            >
              {expanded ? 'Ocultar opções' : 'Ver opções'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
