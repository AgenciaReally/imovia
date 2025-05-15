"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, Users, HomeIcon, CalendarIcon, Eye, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { ConstrutoraDashboard } from '@/services/construtora-service'
import { ConstrutorDetalheModal } from './construtora-detalhe-modal'
import { ConstrutorDeleteButton } from './construtora-delete-button'
import { ConstrutorStatusButton } from './construtora-status-button'

interface ConstrutoraProp {
  construtora: ConstrutoraDashboard
  className?: string
  onDelete?: () => void
  onStatusChange?: () => void
}

export function ConstrutoraTileCard({ construtora, className, onDelete, onStatusChange }: ConstrutoraProp) {
  const [isHovered, setIsHovered] = useState(false)
  
  const statusColors = {
    ativa: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800',
    inativa: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800',
    pendente: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800'
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "overflow-hidden", 
        className
      )}
    >
      <Card className="border-0 shadow-lg transition-all duration-300 h-full relative overflow-hidden group">
        {/* Faixa lateral de status */}
        <div 
          className={cn(
            "absolute left-0 top-0 w-1 h-full",
            construtora.status === 'ativa' ? 'bg-green-500' : 
            construtora.status === 'inativa' ? 'bg-red-500' : 
            'bg-amber-500'
          )}
        />
        
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg line-clamp-1 pr-2">{construtora.nome}</h3>
              <p className="text-muted-foreground text-sm mt-0.5">{construtora.email}</p>
            </div>
            <Badge 
              className={cn(
                "ml-2 uppercase text-xs font-semibold px-2.5 py-0.5 rounded border", 
                statusColors[construtora.status]
              )}
            >
              {construtora.status}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center">
              <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-900/20 mr-2.5">
                <Building2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">CNPJ</p>
                <p className="text-sm font-medium">{construtora.cnpj}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="p-1.5 rounded-md bg-indigo-50 dark:bg-indigo-900/20 mr-2.5">
                <CalendarIcon className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Registro</p>
                <p className="text-sm font-medium">{construtora.dataRegistro}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="p-1.5 rounded-md bg-violet-50 dark:bg-violet-900/20 mr-2.5">
                <HomeIcon className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Imóveis</p>
                <p className="text-sm font-medium">{construtora.qtdImoveis}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="p-1.5 rounded-md bg-pink-50 dark:bg-pink-900/20 mr-2.5">
                <Users className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Usuários</p>
                <p className="text-sm font-medium">{construtora.qtdUsuarios}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-auto relative z-10 space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ConstrutorDetalheModal construtora={construtora}>
                    <Button 
                      variant="default" 
                      size="sm"
                      className="w-full flex gap-2 items-center"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Visualizar Detalhes</span>
                    </Button>
                  </ConstrutorDetalheModal>
                </TooltipTrigger>
                <TooltipContent>
                  Visualizar todos os detalhes da construtora
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Botão de ativar/desativar */}
            <ConstrutorStatusButton 
              id={construtora.id} 
              nome={construtora.nome} 
              status={construtora.status} 
              onStatusChange={onStatusChange} 
            />
            
            {/* Botão de exclusão */}
            <ConstrutorDeleteButton id={construtora.id} nome={construtora.nome} onDelete={onDelete} />
          </div>
          
          {/* Efeito decorativo */}
          <motion.div 
            className="absolute -bottom-16 -right-16 w-32 h-32 rounded-full bg-blue-500/5 z-0"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: isHovered ? 1.2 : 1, 
              opacity: isHovered ? 0.2 : 0.1 
            }}
            transition={{ duration: 0.4 }}
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}
