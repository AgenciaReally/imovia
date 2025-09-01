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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

// Interface para as propriedades do componente
interface ClienteEditarProps {
  clienteId: string
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

// Schema de validação para o formulário
const clienteSchema = z.object({
  nome: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  telefone: z.string().min(10, { message: "Telefone inválido" }).optional().or(z.literal("")),
  status: z.enum(["ativo", "inativo", "pendente"]),
  cep: z.string().regex(/^\d{5}-?\d{3}$/, { message: "CEP inválido" }).optional().or(z.literal("")),
  rua: z.string().optional().or(z.literal("")),
  numero: z.string().optional().or(z.literal("")),
  complemento: z.string().optional().or(z.literal("")),
  bairro: z.string().optional().or(z.literal("")),
  cidade: z.string().optional().or(z.literal("")),
  estado: z.string().optional().or(z.literal("")),
  observacoes: z.string().optional().or(z.literal(""))
})

type ClienteFormValues = z.infer<typeof clienteSchema>

export function ClienteEditar({ clienteId, isOpen, onClose, onSuccess }: ClienteEditarProps) {
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  
  // Inicializar o formulário
  const form = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      status: "ativo",
      cep: "",
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      observacoes: ""
    }
  })

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
        const cliente = data.cliente
        
        // Preencher o formulário com os dados do cliente
        form.reset({
          nome: cliente.name,
          email: cliente.email,
          telefone: cliente.telefone || "",
          status: cliente.status || "ativo",
          cep: cliente.endereco?.cep || "",
          rua: cliente.endereco?.rua || "",
          numero: cliente.endereco?.numero || "",
          complemento: cliente.endereco?.complemento || "",
          bairro: cliente.endereco?.bairro || "",
          cidade: cliente.endereco?.cidade || "",
          estado: cliente.endereco?.estado || "",
          observacoes: cliente.observacoes || ""
        })
      } catch (error) {
        console.error('Erro ao buscar cliente:', error)
        setErro('Não foi possível carregar os dados do cliente.')
      } finally {
        setCarregando(false)
      }
    }

    fetchCliente()
  }, [clienteId, isOpen, form])

  // Função para buscar endereço pelo CEP
  const buscarEnderecoPorCEP = async (cep: string) => {
    // Remover caracteres não numéricos
    const cepLimpo = cep.replace(/\D/g, '')
    
    if (cepLimpo.length !== 8) return
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await response.json()
      
      if (!data.erro) {
        form.setValue('rua', data.logradouro)
        form.setValue('bairro', data.bairro)
        form.setValue('cidade', data.localidade)
        form.setValue('estado', data.uf)
        // Foca o campo de número após preencher o endereço
        document.getElementById('numero')?.focus()
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
    }
  }

  // Função para salvar o cliente
  const onSubmit = async (values: ClienteFormValues) => {
    if (salvando) return
    
    try {
      setSalvando(true)
      setErro(null)
      
      // Preparar dados para envio
      const clienteData = {
        id: clienteId,
        name: values.nome,
        email: values.email,
        telefone: values.telefone || "",
        status: values.status,
        endereco: {
          cep: values.cep,
          rua: values.rua,
          numero: values.numero,
          complemento: values.complemento,
          bairro: values.bairro,
          cidade: values.cidade,
          estado: values.estado
        },
        observacoes: values.observacoes
      }
      
      // Enviar para a API
      const response = await fetch(`/api/admin/clientes/${clienteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clienteData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Falha ao atualizar cliente')
      }
      
      // Sucesso
      toast.success("Cliente atualizado com sucesso")
      
      // Chamar callback de sucesso
      if (onSuccess) onSuccess()
      
      // Fechar modal
      onClose()
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error)
      setErro(error instanceof Error ? error.message : 'Erro ao atualizar cliente')
      toast.error("Erro ao atualizar cliente")
    } finally {
      setSalvando(false)
    }
  }

  // Função para lidar com mudança no CEP
  const handleCepChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value
    if (cep && cep.length >= 8) {
      buscarEnderecoPorCEP(cep)
    }
  }

  // Formatar CEP
  const formatarCEP = (cep: string) => {
    cep = cep.replace(/\D/g, '')
    if (cep.length > 8) cep = cep.substring(0, 8)
    if (cep.length > 5) cep = cep.substring(0, 5) + '-' + cep.substring(5)
    return cep
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Atualize as informações do cliente no sistema
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
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-primary">Informações Básicas</h3>
                
                {/* Nome */}
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Telefone */}
                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ativo">Ativo</SelectItem>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="inativo">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-primary">Endereço</h3>
                
                {/* CEP */}
                <FormField
                  control={form.control}
                  name="cep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="00000-000" 
                          {...field} 
                          onBlur={handleCepChange}
                          onChange={(e) => {
                            field.onChange(formatarCEP(e.target.value))
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Digite o CEP para preencher o endereço automaticamente
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Rua */}
                  <FormField
                    control={form.control}
                    name="rua"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rua</FormLabel>
                        <FormControl>
                          <Input placeholder="Rua" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Número */}
                  <FormField
                    control={form.control}
                    name="numero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                          <Input id="numero" placeholder="Número" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Complemento */}
                <FormField
                  control={form.control}
                  name="complemento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input placeholder="Apto, bloco, etc" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Bairro */}
                  <FormField
                    control={form.control}
                    name="bairro"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <FormControl>
                          <Input placeholder="Bairro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Cidade */}
                  <FormField
                    control={form.control}
                    name="cidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input placeholder="Cidade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Estado */}
                  <FormField
                    control={form.control}
                    name="estado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input placeholder="UF" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Observações */}
              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Observações sobre o cliente" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                <Button type="submit" disabled={salvando}>
                  {salvando ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : "Salvar Alterações"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
