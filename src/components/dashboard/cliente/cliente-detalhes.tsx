"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, Calendar, MapPin, Building, Timer, PenSquare, MessageSquare, Tag, User, ShoppingBag } from "lucide-react"

// Interface para as propriedades do componente
interface ClienteDetalhesProps {
  clienteId: string
  isOpen: boolean
  onClose: () => void
}

// Interface para os dados do cliente
interface Cliente {
  id: string
  name: string
  email: string
  telefone: string
  createdAt: string
  updatedAt: string
  role: string
  status?: 'ativo' | 'inativo' | 'pendente'
  endereco?: {
    rua?: string
    numero?: string
    complemento?: string
    bairro?: string
    cidade?: string
    estado?: string
    cep?: string
  }
  interesses?: string[]
  ultimaAtividade?: string
  origemCadastro?: string
  historico?: {
    data: string
    acao: string
    descricao: string
  }[]
  preferencias?: {
    tipoImovel?: string[]
    quartos?: number
    banheiros?: number
    vagas?: number
    precoMinimo?: number
    precoMaximo?: number
    bairros?: string[]
  }
}

export function ClienteDetalhes({ clienteId, isOpen, onClose }: ClienteDetalhesProps) {
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  // Buscar dados do cliente quando o componente montar ou o ID mudar
  useEffect(() => {
    const fetchCliente = async () => {
      if (!clienteId || !isOpen) return

      try {
        setCarregando(true)
        setErro(null)

        const response = await fetch(`/api/admin/clientes/${clienteId}`)
        
        if (!response.ok) {
          throw new Error('Falha ao carregar dados do cliente')
        }
        
        const data = await response.json()
        setCliente(data.cliente)
      } catch (error) {
        console.error('Erro ao buscar cliente:', error)
        setErro('Não foi possível carregar os dados do cliente.')
      } finally {
        setCarregando(false)
      }
    }

    fetchCliente()
  }, [clienteId, isOpen])

  // Formatar data para exibição
  const formatarData = (dataString: string) => {
    if (!dataString) return 'Data não disponível'
    const data = new Date(dataString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(data)
  }

  // Gerar as iniciais para o avatar
  const getIniciais = (name: string) => {
    if (!name) return 'CL'
    const parts = name.split(' ')
    if (parts.length === 1) return name.substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  // Formatar valor monetário
  const formatarDinheiro = (valor?: number) => {
    if (valor === undefined) return 'Não definido'
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Cliente</DialogTitle>
          <DialogDescription>
            Informações detalhadas e histórico do cliente
          </DialogDescription>
        </DialogHeader>

        {carregando ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-sm text-muted-foreground">Carregando informações...</p>
          </div>
        ) : erro ? (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md">
            <p>{erro}</p>
            <Button variant="outline" className="mt-2" onClick={onClose}>Fechar</Button>
          </div>
        ) : cliente ? (
          <div className="space-y-6">
            {/* Cabeçalho com informações básicas */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="w-24 h-24 border-4 border-background">
                <AvatarImage src={`https://avatar.vercel.sh/${cliente.email}`} alt={cliente.name} />
                <AvatarFallback className="text-2xl">{getIniciais(cliente.name)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <h2 className="text-2xl font-bold">{cliente.name}</h2>
                  <Badge 
                    variant={
                      cliente.status === 'inativo' ? 'outline' : 
                      cliente.status === 'pendente' ? 'secondary' : 'default'
                    }
                    className={
                      cliente.status === 'ativo' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''
                    }
                  >
                    {cliente.status === 'inativo' ? 'Inativo' : 
                     cliente.status === 'pendente' ? 'Pendente' : 'Ativo'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{cliente.email}</span>
                  </div>
                  
                  {cliente.telefone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{cliente.telefone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Cadastro: {formatarData(cliente.createdAt)}</span>
                  </div>
                  
                  {cliente.origemCadastro && (
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span>Origem: {cliente.origemCadastro}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={onClose}>
                    <PenSquare className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Enviar mensagem
                  </Button>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Tabs para diferentes seções de informações */}
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="info">Informações</TabsTrigger>
                <TabsTrigger value="preferencias">Preferências</TabsTrigger>
                <TabsTrigger value="historico">Histórico</TabsTrigger>
              </TabsList>
              
              {/* Aba de Informações gerais */}
              <TabsContent value="info" className="space-y-4">
                {/* Endereço */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Endereço
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {cliente.endereco ? (
                      <div className="text-sm">
                        <p>{cliente.endereco.rua}, {cliente.endereco.numero}{cliente.endereco.complemento ? `, ${cliente.endereco.complemento}` : ''}</p>
                        <p>{cliente.endereco.bairro}, {cliente.endereco.cidade} - {cliente.endereco.estado}</p>
                        <p>CEP: {cliente.endereco.cep}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Endereço não cadastrado</p>
                    )}
                  </CardContent>
                </Card>
                
                {/* Atividades recentes */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center">
                      <Timer className="h-4 w-4 mr-2" />
                      Atividade Recente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {cliente.ultimaAtividade ? (
                      <div className="text-sm">
                        <p>Última atividade em {formatarData(cliente.ultimaAtividade)}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhuma atividade registrada</p>
                    )}
                  </CardContent>
                </Card>
                
                {/* Outras informações */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Informações Adicionais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="font-medium">ID do Cliente</p>
                      <p className="text-muted-foreground">{cliente.id}</p>
                    </div>
                    <div>
                      <p className="font-medium">Tipo de Conta</p>
                      <p className="text-muted-foreground">{cliente.role || 'Cliente Padrão'}</p>
                    </div>
                    <div>
                      <p className="font-medium">Data de Atualização</p>
                      <p className="text-muted-foreground">{formatarData(cliente.updatedAt)}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Aba de Preferências */}
              <TabsContent value="preferencias" className="space-y-4">
                {/* Interesses */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center">
                      <Tag className="h-4 w-4 mr-2" />
                      Interesses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {cliente.interesses && cliente.interesses.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {cliente.interesses.map((interesse, index) => (
                          <Badge key={index} variant="secondary">
                            {interesse}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhum interesse registrado</p>
                    )}
                  </CardContent>
                </Card>
                
                {/* Preferências de Imóvel */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center">
                      <Building className="h-4 w-4 mr-2" />
                      Preferências de Imóvel
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {cliente.preferencias ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Tipo de Imóvel</p>
                          <p className="text-muted-foreground">
                            {cliente.preferencias.tipoImovel?.join(', ') || 'Não especificado'}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Quartos</p>
                          <p className="text-muted-foreground">
                            {cliente.preferencias.quartos || 'Não especificado'}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Banheiros</p>
                          <p className="text-muted-foreground">
                            {cliente.preferencias.banheiros || 'Não especificado'}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Vagas de Garagem</p>
                          <p className="text-muted-foreground">
                            {cliente.preferencias.vagas || 'Não especificado'}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Faixa de Preço</p>
                          <p className="text-muted-foreground">
                            {cliente.preferencias.precoMinimo && cliente.preferencias.precoMaximo ? 
                              `${formatarDinheiro(cliente.preferencias.precoMinimo)} a ${formatarDinheiro(cliente.preferencias.precoMaximo)}` : 
                              'Não especificado'}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Bairros de Interesse</p>
                          <p className="text-muted-foreground">
                            {cliente.preferencias.bairros?.join(', ') || 'Não especificado'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Preferências não registradas</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Aba de Histórico */}
              <TabsContent value="historico" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Histórico de Atividades</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {cliente.historico && cliente.historico.length > 0 ? (
                      <div className="space-y-4">
                        {cliente.historico.map((item, index) => (
                          <div key={index} className="border-l-2 border-muted pl-4 relative">
                            <div className="absolute w-2 h-2 rounded-full bg-primary left-[-4.5px] top-1.5"></div>
                            <p className="text-xs text-muted-foreground">{formatarData(item.data)}</p>
                            <p className="text-sm font-medium">{item.acao}</p>
                            <p className="text-sm">{item.descricao}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhum histórico disponível</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="bg-muted p-4 rounded-md text-center">
            <p className="text-muted-foreground">Nenhum cliente selecionado ou dados não disponíveis</p>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
