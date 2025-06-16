"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { getUserSession, UserSession } from "@/lib/auth-client";

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
import { Loader2, User, Home } from "lucide-react";

// Schema de validação para o formulário de login
const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  senha: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
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
  async function onLogin(data: LoginFormValues) {
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
          password: data.senha
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
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Verificando sessão...</p>
          </div>
        ) : usuarioLogado ? (
          // Conteúdo para usuário logado
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold">
                Bem-vindo de volta!
              </DialogTitle>
              <DialogDescription className="text-center">
                Você está logado como <span className="font-semibold">{usuarioLogado.name}</span>
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col space-y-4 py-4">
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <User className="h-6 w-6 text-primary" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{usuarioLogado.email}</p>
                  <p className="text-xs text-muted-foreground">Conta de cliente</p>
                </div>
              </div>
              
              <p className="text-center text-muted-foreground">
                O que você gostaria de fazer agora?
              </p>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2">
              <Button 
                variant="outline" 
                onClick={iniciarNovaSimulacao}
                className="w-full sm:w-auto"
              >
                Iniciar nova simulação
              </Button>
              <Button 
                onClick={acessarPainel}
                className="w-full sm:w-auto"
              >
                <Home className="mr-2 h-4 w-4" />
                Acessar painel
              </Button>
            </DialogFooter>
          </>
        ) : (
          // Conteúdo para usuário não logado
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold">
                Acesse sua conta
              </DialogTitle>
              <DialogDescription className="text-center">
                Faça login ou crie uma nova conta para continuar
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
