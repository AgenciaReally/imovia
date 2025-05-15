"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { CardConfiguracaoTema } from "@/components/dashboard/configuracoes/card-configuracao-tema";
import { CardConfiguracaoSeguranca } from "@/components/dashboard/configuracoes/card-configuracao-seguranca";

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  Settings,
  Palette,
  Lock,
  Bell,
  User,
  Mail,
  Globe,
  Database,
  HelpCircle,
  LogOut,
  Upload,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";

export default function ConfiguracoesPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [tabAtiva, setTabAtiva] = useState("geral");
  const [perfil, setPerfil] = useState({
    nome: "Admin Imovia",
    email: "admin@imovia.com.br",
    telefone: "(11) 98765-4321",
    cargo: "Administrador",
    avatar: ""
  });
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);
  const [statusSalvar, setStatusSalvar] = useState<"success" | "error" | null>(null);
  const [notificacoes, setNotificacoes] = useState({
    email: true,
    push: true,
    atualizacoes: true,
    marketing: false,
    seguranca: true
  });
  
  const { theme } = useTheme();
  
  // Simular salvamento do perfil
  const salvarPerfil = async () => {
    setSalvandoPerfil(true);
    setStatusSalvar(null);
    
    try {
      // Simulação de requisição API
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatusSalvar("success");
      
      // Limpar status após alguns segundos
      setTimeout(() => {
        setStatusSalvar(null);
      }, 3000);
    } catch (error) {
      setStatusSalvar("error");
    } finally {
      setSalvandoPerfil(false);
    }
  };
  
  // Simular alteração de senha
  const alterarSenha = async (senhaAtual: string, novaSenha: string) => {
    // Simulação de requisição API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulação de sucesso (em ambiente real verificaríamos a senha atual)
    return true;
  };
  
  // Salvar preferências de tema
  const salvarPreferenciasTema = (temaEscolhido: string, corPrimaria: string) => {
    console.log("Salvando preferências:", { temaEscolhido, corPrimaria });
    // Aqui salvaria na API/backend
  };
  
  // Garantir renderização apenas no cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return null;
  }

  return (
    <DashboardLayout userRole="admin" userName="Admin Imovia">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Cabeçalho da página */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
            <p className="text-muted-foreground">
              Gerencie suas preferências, segurança e notificações
            </p>
          </div>
        </div>
        
        {/* Navegação em abas */}
        <Tabs 
          defaultValue="geral" 
          value={tabAtiva}
          onValueChange={setTabAtiva}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-3 sm:grid-cols-5 w-full sm:w-auto">
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="aparencia">Aparência</TabsTrigger>
            <TabsTrigger value="seguranca">Segurança</TabsTrigger>
            <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
            <TabsTrigger value="dados">Dados</TabsTrigger>
          </TabsList>
          
          {/* Aba de Informações Gerais */}
          <TabsContent value="geral" className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  Perfil de Usuário
                </CardTitle>
                <CardDescription>
                  Atualize suas informações de perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Avatar */}
                  <div className="flex flex-col items-center gap-3">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={perfil.avatar || ""} alt={perfil.nome} />
                      <AvatarFallback className="text-2xl">{perfil.nome.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Alterar Foto
                    </Button>
                  </div>
                  
                  {/* Informações de perfil */}
                  <div className="space-y-4 flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome Completo</Label>
                        <Input 
                          id="nome"
                          value={perfil.nome}
                          onChange={e => setPerfil({...perfil, nome: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email"
                          type="email"
                          value={perfil.email}
                          onChange={e => setPerfil({...perfil, email: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input 
                          id="telefone"
                          value={perfil.telefone}
                          onChange={e => setPerfil({...perfil, telefone: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cargo">Cargo</Label>
                        <Input 
                          id="cargo"
                          value={perfil.cargo}
                          onChange={e => setPerfil({...perfil, cargo: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center border-t pt-6">
                <div>
                  {statusSalvar === "success" && (
                    <div className="text-green-500 text-sm flex items-center">
                      <CheckCircle2 className="mr-1 h-4 w-4" />
                      Perfil atualizado com sucesso
                    </div>
                  )}
                  
                  {statusSalvar === "error" && (
                    <div className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="mr-1 h-4 w-4" />
                      Erro ao atualizar perfil
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={salvarPerfil}
                  disabled={salvandoPerfil}
                >
                  {salvandoPerfil ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Configurações do Sistema */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-primary" />
                  Configurações do Sistema
                </CardTitle>
                <CardDescription>
                  Configurações gerais da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {/* Idioma */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Idioma</Label>
                      <p className="text-sm text-muted-foreground">
                        Idioma padrão da plataforma
                      </p>
                    </div>
                    <div className="ml-4">
                      <select
                        className="w-[140px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                        defaultValue="pt-BR"
                      >
                        <option value="pt-BR">Português (BR)</option>
                        <option value="en-US">English (US)</option>
                        <option value="es">Español</option>
                      </select>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Fuso Horário */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Fuso Horário</Label>
                      <p className="text-sm text-muted-foreground">
                        Configuração de fuso horário
                      </p>
                    </div>
                    <div className="ml-4">
                      <select
                        className="w-[220px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                        defaultValue="America/Sao_Paulo"
                      >
                        <option value="America/Sao_Paulo">(GMT-3) Brasília</option>
                        <option value="America/Manaus">(GMT-4) Manaus</option>
                        <option value="America/New_York">(GMT-5) Nova Iorque</option>
                        <option value="Europe/London">(GMT+0) Londres</option>
                      </select>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Formato de Data */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Formato de Data</Label>
                      <p className="text-sm text-muted-foreground">
                        Como as datas são exibidas
                      </p>
                    </div>
                    <div className="ml-4">
                      <select
                        className="w-[140px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                        defaultValue="DD/MM/YYYY"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Sessão Automática */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Sessão Automática</Label>
                      <p className="text-sm text-muted-foreground">
                        Encerrar sessão após inatividade
                      </p>
                    </div>
                    <div className="ml-4">
                      <select
                        className="w-[140px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                        defaultValue="30"
                      >
                        <option value="15">15 minutos</option>
                        <option value="30">30 minutos</option>
                        <option value="60">1 hora</option>
                        <option value="never">Nunca</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-6">
                <Button>
                  Salvar Configurações
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Aba de Aparência */}
          <TabsContent value="aparencia" className="space-y-6">
            <CardConfiguracaoTema onSavePreferences={salvarPreferenciasTema} />
          </TabsContent>
          
          {/* Aba de Segurança */}
          <TabsContent value="seguranca" className="space-y-6">
            <CardConfiguracaoSeguranca 
              is2FAEnabled={false}
              onChangePassword={alterarSenha}
            />
            
            {/* Logs de Atividade */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2 text-primary" />
                  Logs de Atividade
                </CardTitle>
                <CardDescription>
                  Histórico de acesso à conta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { acao: "Login", data: "27/04/2025 21:15", ip: "189.54.220.85", sucesso: true, dispositivo: "Chrome / Windows" },
                    { acao: "Alteração de Senha", data: "20/04/2025 14:30", ip: "189.54.220.85", sucesso: true, dispositivo: "Chrome / Windows" },
                    { acao: "Login", data: "15/04/2025 08:45", ip: "200.155.108.72", sucesso: true, dispositivo: "Safari / iOS" },
                    { acao: "Tentativa de Login", data: "10/04/2025 22:10", ip: "45.178.96.23", sucesso: false, dispositivo: "Firefox / Linux" },
                  ].map((log, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <div className="font-medium flex items-center">
                          {log.acao}
                          <Badge 
                            variant={log.sucesso ? "default" : "destructive"}
                            className={`ml-2 ${log.sucesso ? "bg-green-500 text-white hover:bg-green-600" : ""}`}
                          >
                            {log.sucesso ? "Sucesso" : "Falha"}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {log.data}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">{log.dispositivo}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          IP: {log.ip}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-6">
                <Button variant="outline">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Ver Todos os Logs
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Aba de Notificações */}
          <TabsContent value="notificacoes" className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-primary" />
                  Notificações
                </CardTitle>
                <CardDescription>
                  Configure como deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {/* Email */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Notificações por E-mail</Label>
                      <p className="text-sm text-muted-foreground">
                        Receber notificações via e-mail
                      </p>
                    </div>
                    <Switch
                      checked={notificacoes.email}
                      onCheckedChange={(checked) => 
                        setNotificacoes({...notificacoes, email: checked})
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  {/* Push */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Notificações Push</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificações no navegador
                      </p>
                    </div>
                    <Switch
                      checked={notificacoes.push}
                      onCheckedChange={(checked) => 
                        setNotificacoes({...notificacoes, push: checked})
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  {/* Atualizações */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Atualizações da Plataforma</Label>
                      <p className="text-sm text-muted-foreground">
                        Novidades e recursos
                      </p>
                    </div>
                    <Switch
                      checked={notificacoes.atualizacoes}
                      onCheckedChange={(checked) => 
                        setNotificacoes({...notificacoes, atualizacoes: checked})
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  {/* Marketing */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Marketing</Label>
                      <p className="text-sm text-muted-foreground">
                        Ofertas e promoções
                      </p>
                    </div>
                    <Switch
                      checked={notificacoes.marketing}
                      onCheckedChange={(checked) => 
                        setNotificacoes({...notificacoes, marketing: checked})
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  {/* Segurança */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Alertas de Segurança</Label>
                      <p className="text-sm text-muted-foreground">
                        Avisos de segurança importantes
                      </p>
                    </div>
                    <Switch
                      checked={notificacoes.seguranca}
                      onCheckedChange={(checked) => 
                        setNotificacoes({...notificacoes, seguranca: checked})
                      }
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-6">
                <Button>
                  Salvar Preferências
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Aba de Dados */}
          <TabsContent value="dados" className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2 text-primary" />
                  Seus Dados
                </CardTitle>
                <CardDescription>
                  Gerencie seus dados na plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {/* Backup de Dados */}
                  <div className="bg-muted p-4 rounded-lg flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Database className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Exportar Seus Dados</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Faça download de todos os seus dados em um arquivo CSV ou JSON.
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm">
                          Exportar como CSV
                        </Button>
                        <Button variant="outline" size="sm">
                          Exportar como JSON
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Armazenamento de Dados */}
                  <div className="bg-muted p-4 rounded-lg flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Armazenamento de Dados</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Seus dados são armazenados com segurança em servidores no Brasil, em conformidade com a LGPD.
                      </p>
                      <div className="mt-3">
                        <Button variant="outline" size="sm">
                          Política de Privacidade
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Exclusão de Conta */}
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg flex items-start gap-4 border border-red-200 dark:border-red-800/30">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-red-600 dark:text-red-400">Excluir Conta</h3>
                      <p className="text-sm text-red-600/70 dark:text-red-400/70 mt-1">
                        Esta ação é irreversível e removerá todos os seus dados permanentemente.
                      </p>
                      <div className="mt-3">
                        <Button variant="destructive" size="sm">
                          Solicitar Exclusão
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
}
