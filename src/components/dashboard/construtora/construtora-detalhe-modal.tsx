"use client"

import { useState } from 'react'
import { X, Building2, Mail, Phone, MapPin, CalendarIcon, HomeIcon, Users, BarChart3, FileCheck, FileEdit } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { ConstrutoraDashboard } from '@/services/construtora-service'

interface ConstrutordetalheModalProps {
  construtora: ConstrutoraDashboard
  children: React.ReactNode
}

export function ConstrutorDetalheModal({ construtora, children }: ConstrutordetalheModalProps) {
  const [open, setOpen] = useState(false)
  
  // Cores baseadas no status
  const statusColors = {
    ativa: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800',
    inativa: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800',
    pendente: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800'
  }
  
  // Iniciais para o avatar
  const getInitials = (name: string) => {
    const parts = name.split(' ')
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/10">
                <AvatarFallback className="bg-primary/5 text-primary text-xl">
                  {getInitials(construtora.nome)}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl">{construtora.nome}</DialogTitle>
                <DialogDescription className="text-base mt-1 flex items-center gap-1">
                  <Mail className="h-4 w-4 mr-1 text-muted-foreground" /> 
                  {construtora.email}
                </DialogDescription>
              </div>
            </div>
            <Badge 
              className={cn(
                "uppercase text-xs font-semibold px-3 py-1 rounded border", 
                statusColors[construtora.status]
              )}
            >
              {construtora.status}
            </Badge>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="info" className="mt-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-card rounded-lg p-4 border">
                  <h3 className="font-medium text-sm text-muted-foreground mb-3">Informações Principais</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-3 text-primary/70" />
                      <div>
                        <span className="text-xs text-muted-foreground block">CNPJ</span>
                        <span className="font-medium">{construtora.cnpj || "Não informado"}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-3 text-primary/70" />
                      <div>
                        <span className="text-xs text-muted-foreground block">Telefone</span>
                        <span className="font-medium">{construtora.telefone || "Não informado"}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-3 mt-0.5 text-primary/70" />
                      <div>
                        <span className="text-xs text-muted-foreground block">Endereço</span>
                        <span className="font-medium">{construtora.endereco || "Não informado"}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-3 text-primary/70" />
                      <div>
                        <span className="text-xs text-muted-foreground block">Data de Registro</span>
                        <span className="font-medium">{construtora.dataRegistro}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-card rounded-lg p-4 border">
                  <h3 className="font-medium text-sm text-muted-foreground mb-3">Relacionados</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <HomeIcon className="h-4 w-4 mr-3 text-primary/70" />
                      <div>
                        <span className="text-xs text-muted-foreground block">Imóveis</span>
                        <span className="font-medium">{construtora.qtdImoveis} imóveis cadastrados</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-3 text-primary/70" />
                      <div>
                        <span className="text-xs text-muted-foreground block">Usuários</span>
                        <span className="font-medium">{construtora.qtdUsuarios} usuários associados</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg p-4 border">
                  <h3 className="font-medium text-sm text-muted-foreground mb-3">Ações</h3>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="w-full flex items-center gap-1">
                      <FileEdit className="h-3.5 w-3.5 mr-1" />
                      Editar Dados
                    </Button>
                    <Button variant="outline" size="sm" className="w-full flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 mr-1" />
                      Ver Usuários
                    </Button>
                    <Button variant="outline" size="sm" className="w-full flex items-center gap-1">
                      <HomeIcon className="h-3.5 w-3.5 mr-1" />
                      Ver Imóveis
                    </Button>
                    <Button variant="outline" size="sm" className="w-full flex items-center gap-1">
                      <BarChart3 className="h-3.5 w-3.5 mr-1" />
                      Ver Métricas
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-4">
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-medium text-lg mb-4">Estatísticas</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <span className="text-sm text-muted-foreground">Imóveis Cadastrados</span>
                  <div className="flex items-end justify-between mt-1">
                    <span className="text-2xl font-semibold">{construtora.qtdImoveis}</span>
                    <HomeIcon className="h-5 w-5 text-primary/70" />
                  </div>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-lg">
                  <span className="text-sm text-muted-foreground">Usuários Associados</span>
                  <div className="flex items-end justify-between mt-1">
                    <span className="text-2xl font-semibold">{construtora.qtdUsuarios}</span>
                    <Users className="h-5 w-5 text-primary/70" />
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <p className="text-sm text-muted-foreground text-center">
                  Estatísticas detalhadas em desenvolvimento
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-medium text-lg mb-4">Histórico de Atividades</h3>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Cadastro Realizado</p>
                    <p className="text-sm text-muted-foreground">{construtora.dataRegistro}</p>
                    <p className="text-sm mt-1">A construtora foi registrada no sistema.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <p className="text-sm text-muted-foreground text-center">
                  Histórico completo em desenvolvimento
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
