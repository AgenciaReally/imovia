"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/components/ui/use-toast"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Building, 
  Save, 
  BellRing, 
  FileText,
  LogOut,
  Trash2,
} from "lucide-react"

// Esquemas de validação
const perfilSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  endereco: z.string().min(5, "Endereço muito curto"),
  descricao: z.string().optional(),
})

const senhaSchema = z.object({
  senhaAtual: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  novaSenha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmarSenha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
}).refine(data => data.novaSenha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
})

const notificacoesSchema = z.object({
  emailNovosLeads: z.boolean(),
  emailLeadsRespondidos: z.boolean(),
  emailRelatorioSemanal: z.boolean(),
  emailNovidades: z.boolean(),
})

export default function ConfiguracoesPage() {
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)

  // Formulário de perfil
  const perfilForm = useForm<z.infer<typeof perfilSchema>>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      nome: "Construtora Vyzer",
      email: "contato@vyzer.com.br",
      telefone: "(11) 98765-4321",
      endereco: "Av. Paulista, 1000, São Paulo - SP",
      descricao: "Construtora especializada em imóveis de alto padrão no Estado de São Paulo.",
    },
  })

  // Formulário de senha
  const senhaForm = useForm<z.infer<typeof senhaSchema>>({
    resolver: zodResolver(senhaSchema),
    defaultValues: {
      senhaAtual: "",
      novaSenha: "",
      confirmarSenha: "",
    },
  })

  // Formulário de notificações
  const notificacoesForm = useForm<z.infer<typeof notificacoesSchema>>({
    resolver: zodResolver(notificacoesSchema),
    defaultValues: {
      emailNovosLeads: true,
      emailLeadsRespondidos: true,
      emailRelatorioSemanal: true,
      emailNovidades: false,
    },
  })

  // Handler para envio do formulário de perfil
  const onPerfilSubmit = async (data: z.infer<typeof perfilSchema>) => {
    try {
      setIsUpdating(true)
      // Simulando uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
      toast({
        variant: "destructive",
        title: "Erro ao atualizar perfil",
        description: "Não foi possível atualizar suas informações. Tente novamente.",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Handler para envio do formulário de senha
  const onSenhaSubmit = async (data: z.infer<typeof senhaSchema>) => {
    try {
      setIsUpdating(true)
      // Simulando uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi alterada com sucesso.",
      })
      
      senhaForm.reset({
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: "",
      })
    } catch (error) {
      console.error("Erro ao atualizar senha:", error)
      toast({
        variant: "destructive",
        title: "Erro ao atualizar senha",
        description: "Não foi possível atualizar sua senha. Tente novamente.",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Handler para envio do formulário de notificações
  const onNotificacoesSubmit = async (data: z.infer<typeof notificacoesSchema>) => {
    try {
      setIsUpdating(true)
      // Simulando uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Preferências atualizadas",
        description: "Suas preferências de notificação foram atualizadas com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao atualizar notificações:", error)
      toast({
        variant: "destructive",
        title: "Erro ao atualizar preferências",
        description: "Não foi possível atualizar suas preferências. Tente novamente.",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <DashboardLayout userRole="construtora">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Gerencie suas preferências e informações</p>
      </div>
      <Tabs defaultValue="perfil" className="space-y-6">
        <TabsList>
          <TabsTrigger value="perfil">
            <User className="h-4 w-4 mr-2" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="seguranca">
            <Lock className="h-4 w-4 mr-2" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="notificacoes">
            <BellRing className="h-4 w-4 mr-2" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="conta">
            <Building className="h-4 w-4 mr-2" />
            Conta
          </TabsTrigger>
        </TabsList>

        {/* Tab Perfil */}
        <TabsContent value="perfil" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações de Perfil</CardTitle>
              <CardDescription>
                Atualize as informações do seu perfil e dados da construtora
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-5">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/avatars/construtora.png" alt="Avatar" />
                  <AvatarFallback>CV</AvatarFallback>
                </Avatar>
                <div>
                  <Button size="sm" variant="outline" className="mb-2">
                    Alterar Imagem
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Formatos suportados: JPG, PNG. Tamanho máximo: 2MB
                  </p>
                </div>
              </div>

              <Form {...perfilForm}>
                <form onSubmit={perfilForm.handleSubmit(onPerfilSubmit)} className="space-y-4">
                  <FormField
                    control={perfilForm.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Construtora</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da construtora" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={perfilForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="seu@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={perfilForm.control}
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
                  </div>

                  <FormField
                    control={perfilForm.control}
                    name="endereco"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Input placeholder="Endereço da construtora" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={perfilForm.control}
                    name="descricao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva sua construtora" 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Esta descrição aparecerá no seu perfil público.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? (
                        <>Salvando...</>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Salvar Alterações
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Segurança */}
        <TabsContent value="seguranca" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>
                Altere sua senha para manter sua conta segura
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...senhaForm}>
                <form onSubmit={senhaForm.handleSubmit(onSenhaSubmit)} className="space-y-4">
                  <FormField
                    control={senhaForm.control}
                    name="senhaAtual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha Atual</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Digite sua senha atual" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={senhaForm.control}
                    name="novaSenha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nova Senha</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Digite sua nova senha" {...field} />
                        </FormControl>
                        <FormDescription>
                          Sua senha deve ter pelo menos 6 caracteres.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={senhaForm.control}
                    name="confirmarSenha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar Nova Senha</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Confirme sua nova senha" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? (
                        <>Atualizando...</>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Atualizar Senha
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sessões Ativas</CardTitle>
              <CardDescription>
                Gerencie seus dispositivos conectados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Computer className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Windows PC - Chrome</p>
                      <p className="text-sm text-muted-foreground">São Paulo, BR • Atual</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" disabled>
                    Este dispositivo
                  </Button>
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Smartphone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">iPhone 13 - Safari</p>
                      <p className="text-sm text-muted-foreground">São Paulo, BR • 2 dias atrás</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Encerrar
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline">
                Encerrar todas as outras sessões
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Tab Notificações */}
        <TabsContent value="notificacoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Escolha quais tipos de notificações você deseja receber
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificacoesForm}>
                <form onSubmit={notificacoesForm.handleSubmit(onNotificacoesSubmit)} className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium mb-3">Notificações por Email</h3>
                    
                    <FormField
                      control={notificacoesForm.control}
                      name="emailNovosLeads"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0 rounded-md border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Novos Leads</FormLabel>
                            <FormDescription>
                              Receba notificações quando um novo lead for gerado.
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
                      control={notificacoesForm.control}
                      name="emailLeadsRespondidos"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0 rounded-md border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Leads Respondidos</FormLabel>
                            <FormDescription>
                              Receba notificações quando um lead responder sua mensagem.
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
                      control={notificacoesForm.control}
                      name="emailRelatorioSemanal"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0 rounded-md border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Relatório Semanal</FormLabel>
                            <FormDescription>
                              Receba um relatório semanal com estatísticas.
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
                      control={notificacoesForm.control}
                      name="emailNovidades"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0 rounded-md border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Novidades da Plataforma</FormLabel>
                            <FormDescription>
                              Receba atualizações sobre novas funcionalidades.
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
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? (
                        <>Salvando...</>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Salvar Preferências
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Conta */}
        <TabsContent value="conta" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentos da Empresa</CardTitle>
              <CardDescription>
                Gerencie os documentos da sua empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border p-4 rounded-md">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">CNPJ</p>
                      <p className="text-sm text-muted-foreground">Atualizado em 12/03/2025</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Visualizar</Button>
                    <Button variant="outline" size="sm">Atualizar</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between border p-4 rounded-md">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Contrato Social</p>
                      <p className="text-sm text-muted-foreground">Atualizado em 05/01/2025</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Visualizar</Button>
                    <Button variant="outline" size="sm">Atualizar</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between border p-4 rounded-md border-dashed">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Adicionar novo documento</p>
                      <p className="text-sm text-muted-foreground">Formato: PDF (máx. 5MB)</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Adicionar</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-500">Ações Perigosas</CardTitle>
              <CardDescription>
                Ações que podem afetar permanentemente sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border border-red-200 p-4">
                <div className="flex items-start gap-4">
                  <LogOut className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Sair de Todos os Dispositivos</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Esta ação encerrará todas as suas sessões ativas em todos os dispositivos. 
                      Você precisará fazer login novamente.
                    </p>
                    <Button variant="outline" className="mt-3" size="sm">
                      Sair de Todos os Dispositivos
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-md border border-red-200 p-4">
                <div className="flex items-start gap-4">
                  <Trash2 className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Desativar Conta</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Esta ação desativará temporariamente sua conta. Seus dados serão preservados, 
                      mas não serão exibidos aos usuários do sistema.
                    </p>
                    <Button variant="outline" className="mt-3 text-red-500" size="sm">
                      Desativar Conta
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}

// Ícones adicionais não importados 
const Computer = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" x2="16" y1="21" y2="21" />
    <line x1="12" x2="12" y1="17" y2="21" />
  </svg>
)

const Smartphone = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" x2="12.01" y1="18" y2="18" />
  </svg>
)
