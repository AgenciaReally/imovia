"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Plus, Loader2, X } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"

// Schema de validação para o formulário
const construtoraFormSchema = z.object({
  nome: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
  cnpj: z.string().min(14, { message: "CNPJ inválido" }).max(18),
  telefone: z.string().min(10, { message: "Telefone inválido" }),
  email: z.string().email({ message: "E-mail inválido" }),
  endereco: z.string().min(5, { message: "Endereço deve ter pelo menos 5 caracteres" }),
  ativa: z.boolean().default(true),
})

type ConstrutorFormValues = z.infer<typeof construtoraFormSchema>

type ConstrutoraNovo = {
  id?: string
  nome: string
  cnpj: string
  telefone: string
  email: string
  endereco: string
  ativa: boolean
}

export function ConstrutorFormModal({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  // Formatação do CNPJ ao digitar
  const formatCNPJ = (value: string) => {
    const cnpjNumeros = value.replace(/\D/g, "")
    if (cnpjNumeros.length <= 2) return cnpjNumeros
    if (cnpjNumeros.length <= 5) return `${cnpjNumeros.slice(0, 2)}.${cnpjNumeros.slice(2)}`
    if (cnpjNumeros.length <= 8) return `${cnpjNumeros.slice(0, 2)}.${cnpjNumeros.slice(2, 5)}.${cnpjNumeros.slice(5)}`
    if (cnpjNumeros.length <= 12) return `${cnpjNumeros.slice(0, 2)}.${cnpjNumeros.slice(2, 5)}.${cnpjNumeros.slice(5, 8)}/${cnpjNumeros.slice(8)}`
    return `${cnpjNumeros.slice(0, 2)}.${cnpjNumeros.slice(2, 5)}.${cnpjNumeros.slice(5, 8)}/${cnpjNumeros.slice(8, 12)}-${cnpjNumeros.slice(12, 14)}`
  }
  
  // Formatação do telefone ao digitar
  const formatTelefone = (value: string) => {
    const telefoneNumeros = value.replace(/\D/g, "")
    if (telefoneNumeros.length <= 2) return telefoneNumeros
    if (telefoneNumeros.length <= 6) return `(${telefoneNumeros.slice(0, 2)}) ${telefoneNumeros.slice(2)}`
    if (telefoneNumeros.length <= 10) return `(${telefoneNumeros.slice(0, 2)}) ${telefoneNumeros.slice(2, 6)}-${telefoneNumeros.slice(6)}`
    return `(${telefoneNumeros.slice(0, 2)}) ${telefoneNumeros.slice(2, 7)}-${telefoneNumeros.slice(7, 11)}`
  }

  const form = useForm<ConstrutorFormValues>({
    resolver: zodResolver(construtoraFormSchema),
    defaultValues: {
      nome: "",
      cnpj: "",
      telefone: "",
      email: "",
      endereco: "",
      ativa: true,
    },
  })

  const onSubmit = async (values: ConstrutorFormValues) => {
    setLoading(true)
    try {
      // Remover formatação do CNPJ e telefone
      const cnpjLimpo = values.cnpj.replace(/\D/g, "")
      const telefoneLimpo = values.telefone.replace(/\D/g, "")
      
      const payload: ConstrutoraNovo = {
        ...values,
        cnpj: cnpjLimpo,
        telefone: telefoneLimpo,
      }
      
      const response = await fetch('/api/construtoras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      
      if (!response.ok) {
        throw new Error('Erro ao criar construtora')
      }
      
      toast({
        title: "Construtora criada com sucesso!",
        description: "A construtora foi adicionada ao sistema.",
      })
      
      setOpen(false)
      form.reset()
      
      // Atualizar a listagem de construtoras
      if (onSuccess) {
        onSuccess()
      } else {
        router.refresh()
      }
    } catch (error) {
      console.error('Erro ao criar construtora:', error)
      toast({
        title: "Erro ao criar construtora",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Nova Construtora
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Construtora</DialogTitle>
          <DialogDescription>
            Preencha os dados da construtora e clique em salvar.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 my-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Construtora</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo da construtora" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="00.000.000/0000-00" 
                        {...field} 
                        value={formatCNPJ(field.value)}
                      />
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
                        value={formatTelefone(field.value)}
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
                      <Input placeholder="email@construtora.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endereco"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input placeholder="Endereço completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="ativa"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Construtora Ativa</FormLabel>
                      <FormDescription>
                        Desmarque para cadastrar como inativa
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
