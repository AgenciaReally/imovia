"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { CardIntegracao } from "@/components/dashboard/integracoes/card-integracao";
import { DialogApiConfig } from "@/components/dashboard/integracoes/dialog-api-config";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  PlusCircle,
  FileText,
  LayoutDashboard,
  ArrowRight,
  BrainCircuit,
  Database,
  LineChart,
  LucideIcon,
  RefreshCw,
  Settings,
  Lock,
  LogIn,
  UserCog,
  Fingerprint
} from "lucide-react";

// Logos dos serviços
const LogoDeepSeek = () => (
  <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-blue-50">
    <BrainCircuit className="h-5 w-5 text-blue-600" />
  </div>
);

const LogoOpenAI = () => (
  <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-lime-50">
    <BrainCircuit className="h-5 w-5 text-lime-600" />
  </div>
);

const LogoClaude = () => (
  <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-purple-50">
    <BrainCircuit className="h-5 w-5 text-purple-600" />
  </div>
);

const LogoGoogleAnalytics = () => (
  <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-amber-50">
    <LineChart className="h-5 w-5 text-amber-600" />
  </div>
);

const LogoFacebookLogin = () => (
  <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-blue-50">
    <LogIn className="h-5 w-5 text-blue-600" />
  </div>
);

const LogoGoogleLogin = () => (
  <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-red-50">
    <LogIn className="h-5 w-5 text-red-600" />
  </div>
);

// Estado inicial para as integrações
const integracoesIniciais = [
  {
    id: "deepseek",
    tipo: "ia",
    nome: "DeepSeek AI",
    descricao: "Integração com o motor de IA para filtragem de imóveis",
    logo: <LogoDeepSeek />,
    status: "ativo",
    limiteUso: 50000,
    usoAtual: 12450,
    ultimaAtualizacao: "27/04/2025 20:15",
    documentacaoUrl: "https://docs.deepseek.ai",
  },
  {
    id: "openai",
    tipo: "ia",
    nome: "OpenAI",
    descricao: "Integração com GPT-4 para processamento de linguagem natural",
    logo: <LogoOpenAI />,
    status: "ativo",
    limiteUso: 100000,
    usoAtual: 67450,
    ultimaAtualizacao: "27/04/2025 19:30",
    documentacaoUrl: "https://platform.openai.com/docs",
  },
  {
    id: "claude",
    tipo: "ia",
    nome: "Anthropic Claude",
    descricao: "Integração para análise de texto e documentos",
    logo: <LogoClaude />,
    status: "inativo",
    limiteUso: 80000,
    usoAtual: 10200,
    ultimaAtualizacao: "25/04/2025 14:20",
    documentacaoUrl: "https://docs.anthropic.com",
  },
  {
    id: "google-analytics",
    tipo: "analytics",
    nome: "Google Analytics",
    descricao: "Integração para acompanhamento de métricas de uso",
    logo: <LogoGoogleAnalytics />,
    status: "ativo",
    ultimaAtualizacao: "27/04/2025 21:45",
    documentacaoUrl: "https://developers.google.com/analytics",
  },
  {
    id: "facebook-login",
    tipo: "autenticacao",
    nome: "Facebook Login",
    descricao: "Autenticação social via Facebook",
    logo: <LogoFacebookLogin />,
    status: "ativo",
    ultimaAtualizacao: "26/04/2025 18:10",
    documentacaoUrl: "https://developers.facebook.com/docs/facebook-login",
  },
  {
    id: "google-login",
    tipo: "autenticacao",
    nome: "Google Login",
    descricao: "Autenticação social via Google",
    logo: <LogoGoogleLogin />,
    status: "ativo",
    ultimaAtualizacao: "27/04/2025 10:35",
    documentacaoUrl: "https://developers.google.com/identity/sign-in/web/sign-in",
  },
];

export default function IntegracoesPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [integracoes, setIntegracoes] = useState(integracoesIniciais);
  const [filtro, setFiltro] = useState("todas");
  const [configDialog, setConfigDialog] = useState({
    aberto: false,
    integracao: null as any,
  });
  
  // Toggle de integração
  const handleToggleIntegracao = (id: string, ativado: boolean) => {
    setIntegracoes(prev => 
      prev.map(integ => 
        integ.id === id 
          ? { ...integ, status: ativado ? "ativo" : "inativo" } 
          : integ
      )
    );
  };
  
  // Abrir dialog de configuração
  const abrirConfiguracao = (integracao: any) => {
    setConfigDialog({
      aberto: true,
      integracao,
    });
  };
  
  // Salvar configurações de API
  const salvarConfiguracao = async (dados: any) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Aqui seria uma chamada à API real
        console.log("Salvando configuração:", dados);
        resolve();
      }, 1500);
    });
  };
  
  // Filtrar integrações
  const integracoesFiltradas = filtro === "todas" 
    ? integracoes 
    : integracoes.filter(integ => integ.tipo === filtro);
  
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
            <h1 className="text-2xl font-bold tracking-tight">Integrações</h1>
            <p className="text-muted-foreground">
              Gerencie todas as integrações de APIs e serviços externos
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="h-9">
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar Tudo
            </Button>
            
            <Button className="h-9">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Integração
            </Button>
          </div>
        </div>
        
        {/* Abas de categorias */}
        <Tabs defaultValue="todas" value={filtro} onValueChange={setFiltro}>
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="ia">IA & APIs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="autenticacao">Autenticação</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Cards de integrações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integracoesFiltradas.map(integracao => (
            <CardIntegracao
              key={integracao.id}
              titulo={integracao.nome}
              descricao={integracao.descricao}
              logo={integracao.logo}
              status={integracao.status as any}
              limiteUso={integracao.limiteUso}
              usoAtual={integracao.usoAtual}
              ultimaAtualizacao={integracao.ultimaAtualizacao}
              documentacaoUrl={integracao.documentacaoUrl}
              onToggle={(ativado) => handleToggleIntegracao(integracao.id, ativado)}
              onConfigure={() => abrirConfiguracao(integracao)}
            />
          ))}
        </div>
        
        {/* Integrações Adicionais */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Integrações Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { id: "slack", nome: "Slack", descricao: "Receba notificações no Slack" },
              { id: "zapier", nome: "Zapier", descricao: "Automatize processos com outras ferramentas" },
              { id: "hubspot", nome: "HubSpot", descricao: "Integração com CRM" },
              { id: "mixpanel", nome: "Mixpanel", descricao: "Analytics avançado de comportamento do usuário" },
              { id: "hotjar", nome: "Hotjar", descricao: "Mapas de calor e gravações de sessão" },
              { id: "twilio", nome: "Twilio", descricao: "SMS e notificações por telefone" },
            ].map(item => (
              <Card key={item.id} className="border hover:border-primary/50 cursor-pointer transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{item.nome}</CardTitle>
                  <CardDescription>{item.descricao}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Integração
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Seção de Segurança */}
        <div className="mt-8">
          <div className="flex items-start space-x-4 bg-muted/30 p-4 rounded-lg">
            <div className="p-2 bg-primary/10 rounded-full">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Segurança e Conformidade</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Todas as chaves de API são criptografadas e armazenadas com segurança. 
                Nenhum dado sensível é compartilhado com serviços de terceiros sem sua permissão explícita.
              </p>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Política de Privacidade
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações de Segurança
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Dialog de Configuração */}
        {configDialog.integracao && (
          <DialogApiConfig
            open={configDialog.aberto}
            onOpenChange={(open) => setConfigDialog(prev => ({ ...prev, aberto: open }))}
            apiName={configDialog.integracao.nome}
            apiKey=""
            apiEndpoint=""
            organizationId=""
            onSave={salvarConfiguracao}
          />
        )}
      </motion.div>
    </DashboardLayout>
  );
}
