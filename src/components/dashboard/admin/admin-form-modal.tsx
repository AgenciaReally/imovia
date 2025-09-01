"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Loader2, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

// Interface para o formulário de administrador
export interface AdminFormData {
  id?: string
  nome: string
  email: string
  senha?: string
}

// Schema de validação do formulário
const formSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").optional().or(z.literal("")),
  confirmarSenha: z.string().optional().or(z.literal(""))
}).refine((data) => {
  // Validar que as senhas coincidem quando uma senha é fornecida
  if (data.senha && data.senha !== data.confirmarSenha) {
    return false;
  }
  return true;
}, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

type FormData = z.infer<typeof formSchema>

// Função para criar um administrador
async function criarAdmin(data: AdminFormData) {
  try {
    const response = await fetch('/api/admins', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar administrador');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao criar administrador:', error);
    throw error;
  }
}

// Função para atualizar um administrador
async function atualizarAdmin(data: AdminFormData) {
  try {
    const response = await fetch('/api/admins', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao atualizar administrador');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar administrador:', error);
    throw error;
  }
}

interface AdminFormModalProps {
  admin?: AdminFormData
  onSuccess: () => void
}

export function AdminFormModal({ admin, onSuccess }: AdminFormModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const isEditing = !!admin?.id

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: admin?.nome || "",
      email: admin?.email || "",
      senha: "",
      confirmarSenha: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      // Remover confirmarSenha do payload pois não é usado na API
      const { confirmarSenha, ...payload } = data;
      
      if (isEditing) {
        // Se a senha estiver vazia, remover do payload
        if (!payload.senha) {
          delete payload.senha
        }
        
        const result = await atualizarAdmin({
          ...payload,
          id: admin.id,
        })
        
        if (result) {
          toast({
            title: "Administrador atualizado",
            description: "O administrador foi atualizado com sucesso.",
          })
          onSuccess()
          setOpen(false)
        }
      } else {
        // Se a senha estiver vazia para um novo admin, exibir erro
        if (!payload.senha) {
          toast({
            title: "Senha obrigatória",
            description: "Por favor, defina uma senha para o novo administrador.",
            variant: "destructive",
          })
          setLoading(false)
          return
        }
        
        const result = await criarAdmin(payload)
        
        if (result) {
          toast({
            title: "Administrador criado",
            description: "O administrador foi criado com sucesso.",
          })
          onSuccess()
          setOpen(false)
          form.reset()
        }
      }
    } catch (error) {
      console.error("Erro ao salvar administrador:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o administrador.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant="outline" size="sm">
            Editar
          </Button>
        ) : (
          <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
            <Plus className="mr-2 h-4 w-4" />
            Novo Administrador
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ShieldCheck className="mr-2 h-5 w-5 text-orange-500" />
            {isEditing ? "Editar Administrador" : "Novo Administrador"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Altere os dados do administrador conforme necessário." 
              : "Preencha o formulário para criar um novo administrador."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Digite o nome completo" 
                      {...field} 
                    />
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
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="exemplo@imovia.com.br" 
                      type="email" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isEditing ? "Nova Senha (opcional)" : "Senha"}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={isEditing ? "Deixe em branco para manter a atual" : "Digite a senha"}
                      type="password" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmarSenha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isEditing ? "Confirmar Nova Senha" : "Confirmar Senha"}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Confirme a senha" 
                      type="password" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  isEditing ? "Atualizar" : "Criar"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
