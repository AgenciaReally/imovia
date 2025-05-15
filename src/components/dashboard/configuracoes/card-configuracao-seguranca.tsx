"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Lock,
  Key,
  Smartphone,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Info,
  Loader2
} from "lucide-react";

interface CardConfiguracaoSegurancaProps {
  is2FAEnabled?: boolean;
  onToggle2FA?: (enabled: boolean) => void;
  onChangePassword?: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

export function CardConfiguracaoSeguranca({
  is2FAEnabled = false,
  onToggle2FA,
  onChangePassword
}: CardConfiguracaoSegurancaProps) {
  const [senha2FA, setSenha2FA] = useState(is2FAEnabled);
  const [atualizando2FA, setAtualizando2FA] = useState(false);
  
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [atualizandoSenha, setAtualizandoSenha] = useState(false);
  const [statusAtualizacao, setStatusAtualizacao] = useState<"success" | "error" | null>(null);
  const [mensagemStatus, setMensagemStatus] = useState("");
  
  // Lidar com toggle de 2FA
  const handle2FAToggle = async (checked: boolean) => {
    setAtualizando2FA(true);
    setSenha2FA(checked);
    
    // Simulação de ativação/desativação
    setTimeout(() => {
      setAtualizando2FA(false);
      if (onToggle2FA) onToggle2FA(checked);
    }, 1000);
  };
  
  // Verificar força da senha
  const verificarForcaSenha = (senha: string) => {
    if (!senha) return { forca: 0, texto: "", cor: "" };
    
    const comprimento = senha.length >= 8;
    const temNumero = /\d/.test(senha);
    const temMaiuscula = /[A-Z]/.test(senha);
    const temMinuscula = /[a-z]/.test(senha);
    const temEspecial = /[^A-Za-z0-9]/.test(senha);
    
    const pontos = [comprimento, temNumero, temMaiuscula, temMinuscula, temEspecial].filter(Boolean).length;
    
    if (pontos <= 2) return { forca: 1, texto: "Fraca", cor: "text-red-500" };
    if (pontos <= 3) return { forca: 2, texto: "Média", cor: "text-amber-500" };
    if (pontos <= 4) return { forca: 3, texto: "Boa", cor: "text-green-500" };
    return { forca: 4, texto: "Forte", cor: "text-green-600" };
  };
  
  const forcaSenha = verificarForcaSenha(novaSenha);
  
  // Atualizar senha
  const handleAtualizarSenha = async () => {
    // Validar campos
    if (!senhaAtual) {
      setStatusAtualizacao("error");
      setMensagemStatus("A senha atual é obrigatória");
      return;
    }
    
    if (!novaSenha) {
      setStatusAtualizacao("error");
      setMensagemStatus("A nova senha é obrigatória");
      return;
    }
    
    if (novaSenha !== confirmarSenha) {
      setStatusAtualizacao("error");
      setMensagemStatus("As senhas não coincidem");
      return;
    }
    
    if (forcaSenha.forca < 2) {
      setStatusAtualizacao("error");
      setMensagemStatus("A senha é muito fraca. Use letras, números e símbolos.");
      return;
    }
    
    setAtualizandoSenha(true);
    setStatusAtualizacao(null);
    
    try {
      // Chamar função de atualização (ou simular)
      if (onChangePassword) {
        const sucesso = await onChangePassword(senhaAtual, novaSenha);
        
        if (sucesso) {
          setStatusAtualizacao("success");
          setMensagemStatus("Senha atualizada com sucesso!");
          // Limpar campos
          setSenhaAtual("");
          setNovaSenha("");
          setConfirmarSenha("");
        } else {
          setStatusAtualizacao("error");
          setMensagemStatus("Não foi possível atualizar a senha. Verifique a senha atual.");
        }
      } else {
        // Simulação
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStatusAtualizacao("success");
        setMensagemStatus("Senha atualizada com sucesso!");
        // Limpar campos
        setSenhaAtual("");
        setNovaSenha("");
        setConfirmarSenha("");
      }
    } catch (error) {
      setStatusAtualizacao("error");
      setMensagemStatus("Erro ao atualizar senha. Tente novamente.");
    } finally {
      setAtualizandoSenha(false);
    }
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lock className="h-5 w-5 mr-2 text-primary" />
          Segurança da Conta
        </CardTitle>
        <CardDescription>
          Configure as opções de segurança e acesso à sua conta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Seção Autenticação de Dois Fatores */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-md font-medium mb-1">Autenticação de Dois Fatores (2FA)</h3>
              <p className="text-sm text-muted-foreground">
                Adicione uma camada extra de segurança à sua conta
              </p>
            </div>
            
            <div className="flex items-center">
              <Switch 
                checked={senha2FA} 
                onCheckedChange={handle2FAToggle}
                disabled={atualizando2FA}
              />
              <Badge variant={senha2FA ? "default" : "outline"} className={`ml-3 ${senha2FA ? "bg-green-500 text-white hover:bg-green-600" : ""}`}>
                {senha2FA ? "Ativado" : "Desativado"}
              </Badge>
            </div>
          </div>
          
          {senha2FA && (
            <div className="bg-muted p-4 rounded-md flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <div className="text-sm">
                <p className="font-medium">Autenticação via Aplicativo</p>
                <p className="text-muted-foreground mt-1">
                  Use aplicativos como Google Authenticator, Microsoft Authenticator ou Authy para gerar códigos de verificação.
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  Configurar Aplicativo
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Separador */}
        <div className="border-t my-6" />
        
        {/* Seção Alterar Senha */}
        <div className="space-y-4">
          <div>
            <h3 className="text-md font-medium mb-1">Alterar Senha</h3>
            <p className="text-sm text-muted-foreground">
              É recomendado alterar sua senha periodicamente
            </p>
          </div>
          
          <div className="space-y-4">
            {/* Senha Atual */}
            <div className="space-y-2">
              <Label htmlFor="senhaAtual">Senha Atual</Label>
              <div className="relative">
                <Input 
                  id="senhaAtual"
                  type={mostrarSenhaAtual ? "text" : "password"}
                  value={senhaAtual}
                  onChange={e => setSenhaAtual(e.target.value)}
                  placeholder="Digite sua senha atual"
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                >
                  {mostrarSenhaAtual ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Nova Senha */}
            <div className="space-y-2">
              <Label htmlFor="novaSenha">Nova Senha</Label>
              <div className="relative">
                <Input 
                  id="novaSenha"
                  type={mostrarNovaSenha ? "text" : "password"}
                  value={novaSenha}
                  onChange={e => setNovaSenha(e.target.value)}
                  placeholder="Digite sua nova senha"
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                >
                  {mostrarNovaSenha ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              {novaSenha && (
                <div className={`text-xs ${forcaSenha.cor} mt-1`}>
                  Força da senha: {forcaSenha.texto}
                </div>
              )}
            </div>
            
            {/* Confirmar Senha */}
            <div className="space-y-2">
              <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
              <Input 
                id="confirmarSenha"
                type="password"
                value={confirmarSenha}
                onChange={e => setConfirmarSenha(e.target.value)}
                placeholder="Confirme sua nova senha"
              />
              {novaSenha && confirmarSenha && novaSenha !== confirmarSenha && (
                <p className="text-xs text-red-500 mt-1">
                  As senhas não coincidem
                </p>
              )}
            </div>
            
            {/* Status da atualização */}
            {statusAtualizacao && (
              <div className={`p-3 rounded-md flex items-start gap-2 ${statusAtualizacao === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {statusAtualizacao === "success" ? (
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                )}
                <p className="text-sm">{mensagemStatus}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <div className="flex items-center text-sm text-muted-foreground">
          <Info className="h-4 w-4 mr-1" />
          Última atualização: 27/04/2025
        </div>
        <Button 
          onClick={handleAtualizarSenha}
          disabled={atualizandoSenha}
        >
          {atualizandoSenha ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Atualizando...
            </>
          ) : (
            <>
              <Key className="mr-2 h-4 w-4" />
              Atualizar Senha
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
