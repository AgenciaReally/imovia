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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  Settings2,
  RefreshCw,
  Loader2
} from "lucide-react";

type StatusTipo = "ativo" | "inativo" | "pendente" | "erro";

interface CardIntegracaoProps {
  titulo: string;
  descricao: string;
  logo: React.ReactNode;
  status: StatusTipo;
  limiteUso?: number;
  usoAtual?: number;
  ultimaAtualizacao?: string;
  documentacaoUrl?: string;
  onToggle?: (ativado: boolean) => void;
  onRefresh?: () => void;
  onConfigure?: () => void;
}

export function CardIntegracao({
  titulo,
  descricao,
  logo,
  status,
  limiteUso,
  usoAtual,
  ultimaAtualizacao,
  documentacaoUrl,
  onToggle,
  onRefresh,
  onConfigure
}: CardIntegracaoProps) {
  const [atualStatus, setAtualStatus] = useState<StatusTipo>(status);
  const [atualizando, setAtualizando] = useState<boolean>(false);
  
  // Função para renderizar ícone de status
  const renderizarIconeStatus = () => {
    switch (atualStatus) {
      case "ativo":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "inativo":
        return <XCircle className="h-5 w-5 text-gray-400" />;
      case "pendente":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "erro":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };
  
  // Função para renderizar badge de status
  const renderizarBadgeStatus = () => {
    switch (atualStatus) {
      case "ativo":
        return <Badge variant="success">Ativo</Badge>;
      case "inativo":
        return <Badge variant="outline">Inativo</Badge>;
      case "pendente":
        return <Badge variant="warning">Pendente</Badge>;
      case "erro":
        return <Badge variant="destructive">Erro</Badge>;
      default:
        return null;
    }
  };
  
  // Função para lidar com o toggle
  const handleToggle = (checked: boolean) => {
    setAtualizando(true);
    setTimeout(() => {
      setAtualStatus(checked ? "ativo" : "inativo");
      setAtualizando(false);
      if (onToggle) onToggle(checked);
    }, 600);
  };
  
  // Função para atualizar o status
  const handleRefresh = () => {
    setAtualizando(true);
    setTimeout(() => {
      setAtualizando(false);
      if (onRefresh) onRefresh();
    }, 800);
  };
  
  // Calcular porcentagem de uso
  const percentualUso = usoAtual && limiteUso 
    ? Math.min(100, Math.round((usoAtual / limiteUso) * 100)) 
    : 0;
  
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-md bg-muted flex items-center justify-center">
              {logo}
              <div className="absolute -top-1 -right-1">
                {renderizarIconeStatus()}
              </div>
            </div>
            <div>
              <CardTitle className="text-lg">{titulo}</CardTitle>
              <CardDescription>{descricao}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {renderizarBadgeStatus()}
            <Switch 
              checked={atualStatus === "ativo"}
              onCheckedChange={handleToggle}
              disabled={atualizando || atualStatus === "erro" || atualStatus === "pendente"}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Uso da API */}
        {limiteUso && usoAtual !== undefined && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Uso da API</span>
              <span className="font-medium">{usoAtual.toLocaleString()} / {limiteUso.toLocaleString()}</span>
            </div>
            <Progress value={percentualUso} className="h-2" />
            <div className="text-xs text-muted-foreground text-right">
              {percentualUso >= 90 
                ? <span className="text-red-500">Quase no limite</span>
                : percentualUso >= 75
                  ? <span className="text-amber-500">Uso moderado</span>
                  : <span className="text-green-500">Uso tranquilo</span>
              }
            </div>
          </div>
        )}
        
        {/* Última atualização */}
        {ultimaAtualizacao && (
          <div className="text-xs text-muted-foreground">
            Última verificação: {ultimaAtualizacao}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={atualizando}
          >
            {atualizando ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-1" />
            )}
            Atualizar
          </Button>
          
          {onConfigure && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onConfigure}
            >
              <Settings2 className="h-4 w-4 mr-1" />
              Configurar
            </Button>
          )}
        </div>
        
        {documentacaoUrl && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => window.open(documentacaoUrl, "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Documentação
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
