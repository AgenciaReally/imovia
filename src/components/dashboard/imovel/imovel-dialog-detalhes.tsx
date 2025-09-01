"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ImovelDisplay, OruloBuilding } from '@/services/imovel-service'
import { 
  Square, 
  BedDouble, 
  Bath, 
  Car, 
  Building, 
  Home, 
  MapPin, 
  Phone, 
  FileText, 
  Save,
  Calendar, 
  Check, 
  X,
  Loader2,
  ExternalLink
} from 'lucide-react'
import Image from 'next/image'
import { Badge } from "@/components/ui/badge"
// ScrollArea removido - usando div com overflow auto
import { motion, AnimatePresence } from "framer-motion"

// Schema para validar o formulário de metadados
const metadataSchema = z.object({
  telefone: z.string().optional(),
  observacoes: z.string().optional(),
  construtoraIds: z.array(z.string()).default([]),
})

type MetadataForm = z.infer<typeof metadataSchema>

interface ImovelMetadata {
  id?: string
  imovelIdExterno: string
  telefone: string
  observacoes: string
  construtoraId?: string
  createdAt?: Date
  updatedAt?: Date
}

interface Construtora {
  id: string
  nome: string
}

interface ImovelDialogDetalhesProps {
  imovel: ImovelDisplay | null
  isOpen: boolean
  onClose: () => void
}

export function ImovelDialogDetalhes({ imovel, isOpen, onClose }: ImovelDialogDetalhesProps) {
  const [aba, setAba] = useState('geral')
  const [carregandoMetadados, setCarregandoMetadados] = useState(false)
  const [salvandoMetadados, setSalvandoMetadados] = useState(false)
  const [metadata, setMetadata] = useState<ImovelMetadata | null>(null)
  const [construtoras, setConstrutoras] = useState<Construtora[]>([])
  const [carregandoConstrutoras, setCarregandoConstrutoras] = useState(false)
  const { toast } = useToast()

  // Formulário para telefone e observações
  const form = useForm<MetadataForm>({
    resolver: zodResolver(metadataSchema),
    defaultValues: {
      telefone: '',
      observacoes: '',
      construtoraIds: [],
    },
  })

  // Formatar preço 
  const formatarPreco = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor)
  }

  // Aplicar máscara ao telefone
  const formatarTelefone = (telefone: string) => {
    // Remove todos os caracteres não numéricos
    const numeros = telefone.replace(/\D/g, '');
    
    // Aplica a máscara conforme o tamanho do número
    if (numeros.length <= 10) {
      // Formato (XX) XXXX-XXXX para telefones fixos
      return numeros.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3').trim();
    } else {
      // Formato (XX) XXXXX-XXXX para celulares
      return numeros.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3').trim();
    }
  }
  
  // Função para lidar com o input de telefone
  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    const valorFormatado = formatarTelefone(valor);
    form.setValue('telefone', valorFormatado);
  }
  
  // Buscar lista de construtoras
  const buscarConstrutoras = async () => {
    setCarregandoConstrutoras(true)
    
    try {
      const response = await fetch('/api/construtoras')
      const data = await response.json()
      
      if (data.success && data.construtoras) {
        setConstrutoras(data.construtoras)
      }
    } catch (error) {
      console.error('Erro ao buscar construtoras:', error)
      toast({
        variant: "destructive",
        title: "Erro ao carregar construtoras",
        description: "Não foi possível carregar a lista de construtoras."
      })
    } finally {
      setCarregandoConstrutoras(false)
    }
  }

  // Buscar metadados quando o diálogo for aberto
  useEffect(() => {
    if (isOpen && imovel && imovel.idExterno) {
      buscarMetadados(imovel.idExterno)
      buscarConstrutoras()
    }
  }, [isOpen, imovel])

  // Função para buscar metadados do imóvel
  const buscarMetadados = async (id: string) => {
    try {
      setCarregandoMetadados(true)
      console.log('Buscando metadados para ID:', id)
      const response = await fetch(`/api/imoveis/${id}/metadata`)
      const data = await response.json()
      
      if (data.success && data.data) {
        setMetadata(data.data)
        
        // Buscar metadados existentes se houver
      if (data?.metadados) {
        form.reset({
          telefone: data.metadados.telefone || '',
          observacoes: data.metadados.observacoes || '',
          construtoraIds: data.metadados.construtoraIds || [],
        });
        setMetadata(data.metadados);
      } else {
        form.reset({
          telefone: '',
          observacoes: '',
          construtoraIds: [],
        });
        setMetadata(null);
      }
      } else {
        throw new Error('Erro ao buscar metadados')
      }
    } catch (error) {
      console.error('Erro ao buscar metadados:', error)
      toast({
        variant: "destructive",
        title: "Erro ao carregar informações adicionais",
        description: "Não foi possível buscar o telefone e observações deste imóvel."
      })
    } finally {
      setCarregandoMetadados(false)
    }
  }

  // Função para salvar metadados
  const salvarMetadados = async (dados: MetadataForm) => {
    if (!imovel || !imovel.idExterno) return
    
    try {
      setSalvandoMetadados(true)
      
      console.log('Salvando metadados com construtoraId:', dados.construtoraId)
      const response = await fetch(`/api/imoveis/${imovel.idExterno}/metadata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telefone: dados.telefone,
          observacoes: dados.observacoes,
          construtoraId: dados.construtoraId === 'null' ? null : dados.construtoraId,
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMetadata(data.data)
        toast({
          title: "Alterações salvas com sucesso!",
          description: "As informações do imóvel (telefone, observações e vínculo com construtora) foram atualizadas.",
          variant: "default"
        })
      } else {
        throw new Error('Erro ao salvar dados')
      }
    } catch (error) {
      console.error('Erro ao salvar metadados:', error)
      toast({
        variant: "destructive",
        title: "Erro ao salvar alterações",
        description: "Não foi possível salvar as informações do imóvel. Tente novamente."
      })
    } finally {
      setSalvandoMetadados(false)
    }
  }

  // Se não tiver imóvel selecionado, não renderiza o diálogo
  if (!imovel) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold flex items-center">
            <Building className="mr-2 h-5 w-5 text-primary" />
            {imovel.titulo}
          </DialogTitle>
          <DialogDescription className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-muted-foreground flex-shrink-0" />
            <span className="truncate">
              {imovel.endereco}, {imovel.bairro}, {imovel.cidade} - {imovel.estado}
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={aba} onValueChange={setAba} className="flex flex-col h-full">
          <div className="px-6">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="geral">Informações Gerais</TabsTrigger>
              <TabsTrigger value="caracteristicas">Características</TabsTrigger>
              <TabsTrigger value="metadados">Telefone e Observações</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto max-h-[60vh]">
            <TabsContent value="geral" className="mt-0 space-y-6">
              {/* Imagem e preço */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="relative h-64 w-full rounded-lg overflow-hidden">
                    <Image 
                      src={imovel.imagens[0] || '/img/placeholder-imovel.jpg'} 
                      alt={imovel.titulo}
                      className="object-cover"
                      fill
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    <Badge 
                      className="absolute top-3 left-3"
                      variant={imovel.id.startsWith('orulo-') ? "default" : "outline"}
                    >
                      {imovel.id.startsWith('orulo-') ? 'API Orulo' : 'Banco Local'}
                    </Badge>
                    
                    {imovel.status && (
                      <Badge 
                        className="absolute top-3 right-3 bg-primary"
                      >
                        {imovel.status}
                      </Badge>
                    )}
                  </div>
                  
                  {imovel.imagens.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {imovel.imagens.slice(1, 5).map((img, i) => (
                        <div key={i} className="relative h-16 rounded-md overflow-hidden">
                          <Image 
                            src={img}
                            alt={`${imovel.titulo} - imagem ${i+2}`}
                            className="object-cover"
                            fill
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="text-lg font-bold text-primary mb-1">
                      {formatarPreco(imovel.preco)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {imovel.construtora}
                    </p>
                    
                    <Separator className="my-3" />
                    
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <div className="flex items-center">
                        <Square className="h-4 w-4 mr-2 text-muted-foreground" />
                        {imovel.area}m²
                      </div>
                      
                      <div className="flex items-center">
                        <BedDouble className="h-4 w-4 mr-2 text-muted-foreground" />
                        {imovel.quartos} quarto{imovel.quartos !== 1 ? 's' : ''}
                      </div>
                      
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-2 text-muted-foreground" />
                        {imovel.banheiros} banh{imovel.banheiros !== 1 ? 's' : ''}
                      </div>
                      
                      <div className="flex items-center">
                        <Car className="h-4 w-4 mr-2 text-muted-foreground" />
                        {imovel.vagas} vaga{imovel.vagas !== 1 ? 's' : ''}
                      </div>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      Atualizado em {imovel.dataAtualizacao}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => window.open(`https://www.orulo.com.br/${imovel.idExterno}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver no site da Orulo
                  </Button>
                </div>
              </div>
              
              {/* Descrição */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Descrição</h3>
                <div className="text-sm text-muted-foreground">
                  {imovel.descricao || 'Sem descrição disponível.'}
                </div>
              </div>
              
              {/* Localização */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Localização</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Endereço completo:</p>
                      <p className="text-muted-foreground">
                        {imovel.endereco}, {imovel.bairro}
                        <br />
                        {imovel.cidade} - {imovel.estado}, {imovel.cep}
                      </p>
                    </div>
                    
                    <div>
                      <p className="font-medium">Coordenadas:</p>
                      <p className="text-muted-foreground">
                        Latitude: {imovel.latitude}
                        <br />
                        Longitude: {imovel.longitude}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="caracteristicas" className="mt-0 space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Características do imóvel</h3>
                
                {imovel.caracteristicas && imovel.caracteristicas.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {imovel.caracteristicas.map((caract, index) => (
                      <div 
                        key={index}
                        className="flex items-center p-2 rounded-md bg-muted/50"
                      >
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-sm">{caract}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Não há características específicas cadastradas para este imóvel.
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Dados da construtora</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-medium">{imovel.construtora}</p>
                  <p className="text-sm text-muted-foreground">ID: {imovel.construtoraId}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Informações adicionais</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">ID do imóvel:</p>
                      <p className="text-muted-foreground">{imovel.id}</p>
                    </div>
                    
                    <div>
                      <p className="font-medium">ID externo:</p>
                      <p className="text-muted-foreground">{imovel.idExterno || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <p className="font-medium">Status:</p>
                      <p className="text-muted-foreground">{imovel.status || 'Disponível'}</p>
                    </div>
                    
                    <div>
                      <p className="font-medium">Última atualização:</p>
                      <p className="text-muted-foreground">{imovel.dataAtualizacao}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="metadados" className="mt-0 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Phone className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <h3 className="text-lg font-medium">Telefone e observações</h3>
                    <p className="text-sm text-muted-foreground">
                      Adicione informações complementares para este imóvel da API Orulo.
                      Essas informações são armazenadas apenas no seu banco de dados local.
                    </p>
                  </div>
                </div>
                
                {carregandoMetadados ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(salvarMetadados)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="telefone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone de contato</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="(00) 00000-0000" 
                                value={field.value}
                                onChange={(e) => {
                                  handleTelefoneChange(e);
                                  field.onChange(e);
                                }}
                                maxLength={15}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="observacoes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observações</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Adicione observações internas sobre este imóvel..." 
                                className="min-h-[120px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="construtoraIds"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vincular às Construtoras</FormLabel>
                            <div className="space-y-2 border rounded-md p-3 max-h-40 overflow-y-auto">
                              {carregandoConstrutoras ? (
                                <div className="flex justify-center p-2">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span className="ml-2 text-sm">Carregando construtoras...</span>
                                </div>
                              ) : construtoras.length === 0 ? (
                                <div className="text-sm text-muted-foreground p-2">
                                  Nenhuma construtora encontrada
                                </div>
                              ) : (
                                construtoras.map((construtora) => (
                                  <div key={construtora.id} className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      id={`construtora-${construtora.id}`}
                                      checked={field.value.includes(construtora.id)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          field.onChange([...field.value, construtora.id]);
                                        } else {
                                          field.onChange(field.value.filter((id) => id !== construtora.id));
                                        }
                                      }}
                                      className="rounded border-gray-300 focus:ring-primary"
                                    />
                                    <label 
                                      htmlFor={`construtora-${construtora.id}`}
                                      className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {construtora.nome}
                                    </label>
                                  </div>
                                ))
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full" disabled={salvandoMetadados}>
                        {salvandoMetadados ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar informações
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
                
                {metadata && metadata.updatedAt && (
                  <p className="text-xs text-muted-foreground text-center">
                    Última atualização: {new Date(metadata.updatedAt).toLocaleString('pt-BR')}
                  </p>
                )}
              </div>
            </TabsContent>
          </div>
          
          <DialogFooter className="p-4 border-t">
            <Button variant="outline" onClick={onClose}>Fechar</Button>
          </DialogFooter>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
