"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { getUserSession, UserSession } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, User, Home, LogOut, ArrowRight } from "lucide-react";

// Schema de validação para o formulário de login
const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  senha: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  lembrarMe: z.boolean().default(false).optional(),
});

// Schema de validação para o formulário de cadastro
const cadastroSchema = z.object({
  nome: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  telefone: z
    .string()
    .min(10, { message: "Telefone deve ter pelo menos 10 números" })
    .refine((val) => /^(\(\d{2}\)|\d{2})\s?9?\d{4}-?\d{4}$|^\d{10,11}$/.test(val.replace(/\D/g, '')), {
      message: "Formato de telefone inválido",
    }),
  senha: z
    .string()
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  confirmarSenha: z.string(),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type CadastroFormValues = z.infer<typeof cadastroSchema>;

interface ModalAutenticacaoProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalAutenticacao({ isOpen, onClose }: ModalAutenticacaoProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [usuarioLogado, setUsuarioLogado] = useState<UserSession | null>(null);
  const [verificandoSessao, setVerificandoSessao] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  
  // Verificar se o usuário já está logado
  useEffect(() => {
    async function verificarSessao() {
      try {
        setVerificandoSessao(true);
        const sessao = await getUserSession();
        setUsuarioLogado(sessao);
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
      } finally {
        setVerificandoSessao(false);
      }
    }
    
    if (isOpen) {
      verificarSessao();
    }
  }, [isOpen]);

  // Formulário de login
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      senha: "",
      lembrarMe: false,
    },
  });

  // Formulário de cadastro
  const cadastroForm = useForm<CadastroFormValues>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      senha: "",
      confirmarSenha: "",
    },
  });

  // Função para formatar o telefone enquanto o usuário digita
  const formatTelefone = (value: string) => {
    // Remove caracteres não numéricos
    const phoneNumbers = value.replace(/\D/g, '');

    // Aplica a máscara do telefone
    if (phoneNumbers.length <= 2) {
      return `(${phoneNumbers}`;
    } else if (phoneNumbers.length <= 6) {
      return `(${phoneNumbers.slice(0, 2)}) ${phoneNumbers.slice(2)}`;
    } else if (phoneNumbers.length <= 10) {
      return `(${phoneNumbers.slice(0, 2)}) ${phoneNumbers.slice(2, 6)}-${phoneNumbers.slice(6)}`;
    } else {
      return `(${phoneNumbers.slice(0, 2)}) ${phoneNumbers.slice(2, 7)}-${phoneNumbers.slice(7, 11)}`;
    }
  };

  // Função para fazer login
  async function onLogin(data: z.infer<typeof loginSchema>) {
    setIsLoading(true);

    try {
      // Fazer requisição para a API de login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          senha: data.senha,
          lembrarMe: data.lembrarMe || false,
        }),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Falha na autenticação');
      }
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para o painel...",
        variant: "default",
      });

      // Se autenticado com sucesso, redirecionar baseado na role do usuário
      if (responseData.role === 'ADMIN') {
        router.push('/painel/admin');
      } else if (responseData.role === 'CONSTRUTORA') {
        router.push('/painel/construtora');
      } else if (responseData.role === 'CLIENTE') {
        router.push('/painel/cliente');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      console.error("Erro ao fazer login:", err);
      toast({
        title: "Erro ao fazer login",
        description: err.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Função para cadastrar
  async function onCadastro(data: CadastroFormValues) {
    setIsLoading(true);

    try {
      // Fazer requisição para a API de cadastro de cliente
      const response = await fetch('/api/usuarios/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.nome,
          email: data.email,
          telefone: data.telefone.replace(/\D/g, ''),
          password: data.senha
          // Não é necessário enviar role, pois a API já define como CLIENTE
        }),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Falha no cadastro');
      }
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Fazendo login automaticamente...",
        variant: "default",
      });

      // Fazer login automático após o cadastro
      await onLogin({
        email: data.email,
        senha: data.senha
      });
    } catch (err: any) {
      console.error("Erro ao fazer cadastro:", err);
      toast({
        title: "Erro ao fazer cadastro",
        description: err.message || "Verifique seus dados e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Função para iniciar uma nova simulação
  const iniciarNovaSimulacao = () => {
    onClose();
    // Apenas fecha o modal e deixa o usuário na página inicial
  };

  // Função para acessar o painel do cliente
  const acessarPainel = () => {
    router.push('/painel/cliente');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {verificandoSessao ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : usuarioLogado ? (
          <>
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <Image 
                  src="/logo.webp" 
                  alt="Imovia Logo" 
                  width={120} 
                  height={40} 
                  className="h-auto" 
                />
              </div>
              <DialogTitle className="sr-only">Perfil do Usuário</DialogTitle>
            </DialogHeader>
            <div className="text-center py-2 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold">Olá, {usuarioLogado.name || usuarioLogado.email}</h2>
                <p className="text-gray-500 text-sm mb-4">{usuarioLogado.email}</p>
                
                <div className="grid grid-cols-1 gap-3 mt-4">
                  <Button onClick={acessarPainel} className="w-full flex items-center justify-center gap-2">
                    <Home className="h-4 w-4" />
                    <span>Acessar meu painel</span>
                  </Button>
                  
                  <Button onClick={iniciarNovaSimulacao} variant="outline" className="w-full flex items-center justify-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span>Iniciar nova simulação</span>
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      // Logout
                      fetch('/api/auth/logout', { method: 'POST' })
                        .then(() => {
                          setUsuarioLogado(null);
                          toast({
                            title: "Logout realizado",
                            description: "Você foi desconectado com sucesso.",
                          });
                          router.refresh();
                        });
                    }} 
                    variant="ghost" 
                    className="mt-2 text-gray-500 hover:text-gray-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Sair</span>
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Conteúdo para usuário não logado
          <>
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <Image 
                  src="/logo.webp" 
                  alt="Imovia Logo" 
                  width={120} 
                  height={40} 
                  className="h-auto" 
                />
              </div>
              <DialogTitle className="text-center text-xl font-bold">Acesse sua conta</DialogTitle>
              <DialogDescription className="text-center">
                Entre com seu email e senha ou crie uma nova conta
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="cadastro">Criar conta</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
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
                      control={loginForm.control}
                      name="senha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex items-center justify-between">
                      <FormField
                        control={loginForm.control}
                        name="lembrarMe"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer">Lembrar-me</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <Link 
                        href="/auth/recuperar-senha" 
                        className="text-sm text-primary hover:text-primary-600 transition-colors"
                        onClick={() => onClose()}
                      >
                        Esqueci minha senha
                      </Link>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Entrando...
                        </>
                      ) : "Entrar"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="cadastro" className="space-y-4">
                <Form {...cadastroForm}>
                  <form onSubmit={cadastroForm.handleSubmit(onCadastro)} className="space-y-4">
                    <FormField
                      control={cadastroForm.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={cadastroForm.control}
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
                      control={cadastroForm.control}
                      name="telefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="(99) 99999-9999" 
                              {...field} 
                              onChange={(e) => {
                                const formatted = formatTelefone(e.target.value);
                                field.onChange(formatted);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={cadastroForm.control}
                      name="senha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={cadastroForm.control}
                      name="confirmarSenha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar senha</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Criando conta...
                        </>
                      ) : "Criar conta"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
