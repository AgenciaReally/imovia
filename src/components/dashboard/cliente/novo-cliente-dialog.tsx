"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { UserPlus, Loader2 } from "lucide-react"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

// Schema de validação
const formSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  telefone: z.string().optional(),
  senha: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }).optional(),
  gerarSenha: z.boolean().default(true),
  enviarEmail: z.boolean().default(true),
  status: z.enum(["ativo", "pendente", "inativo"]).default("ativo"),
})

interface NovoClienteDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

type FormValues = z.infer<typeof formSchema>

export function NovoClienteDialog({ isOpen, onClose, onSuccess }: NovoClienteDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Inicializar o formulário
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      telefone: "",
      senha: "",
      gerarSenha: true,
      enviarEmail: true,
      status: "ativo",
    },
  });
  
  // Funções auxiliares
  const formatarTelefone = (telefone: string) => {
    // Remover caracteres não numéricos
    const numeros = telefone.replace(/\D/g, '')
    
    // Formatações diferentes com base no tamanho
    if (numeros.length <= 2) {
      return numeros
    } else if (numeros.length <= 6) {
      return numeros.replace(/^(\d{2})(\d{0,4}).*/, '($1) $2').trim()
    } else {
      return numeros.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3').trim()
    }
  }

  // Efeito para alternar visibilidade do campo de senha
  const gerarSenha = form.watch("gerarSenha");

  // Função para enviar o formulário
  const onSubmit = async (data: FormValues) => {
    if (isSubmitting) return;

    try {
      console.log('Início do processo de submissão:', data);
      setIsSubmitting(true);

      // Dados para enviar à API
      const clienteData = {
        name: data.name,
        email: data.email,
        telefone: data.telefone || "",
        senha: data.gerarSenha ? undefined : data.senha,
        gerarSenha: data.gerarSenha,
        enviarEmail: data.enviarEmail,
        status: data.status
      };
      
      console.log('Dados formatados para API:', clienteData);
    
      // Enviar para API
      const response = await fetch('/api/admin/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clienteData),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao adicionar cliente');
      }
      
      const result = await response.json();
      
      // Fechar o modal e resetar o formulário
      onClose();
      form.reset();

      // Notificar o usuário
      toast.success("Cliente adicionado com sucesso");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      toast.error("Erro ao adicionar cliente", {
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao adicionar o cliente',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Função auxiliar para lidar com o clique no botão
  const handleButtonClick = () => {
    if (!isSubmitting) {
      console.log('Botão Adicionar Cliente clicado diretamente');
      const formValues = form.getValues();
      onSubmit(formValues);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Adicionar Novo Cliente
          </DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para adicionar um novo cliente.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome do cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="cliente@exemplo.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="(00) 00000-0000" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(formatarTelefone(e.target.value))
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gerarSenha"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Gerar senha automaticamente</FormLabel>
                    <FormDescription>
                      Quando ativado, o sistema irá gerar uma senha segura para o cliente.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {!gerarSenha && (
              <FormField
                control={form.control}
                name="senha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Digite a senha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="enviarEmail"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enviar email de boas-vindas</FormLabel>
                    <FormDescription>
                      Enviar um email ao cliente com os dados de acesso.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

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
                        <SelectValue placeholder="Selecione o status do cliente" />
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                type="button" 
                disabled={isSubmitting}
                onClick={handleButtonClick}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adicionando...
                  </>
                ) : "Adicionar Cliente"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
