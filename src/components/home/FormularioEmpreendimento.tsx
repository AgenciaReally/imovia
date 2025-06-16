"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Building, Home, Dumbbell, Waves, Shield, PartyPopper, Trees, Dog } from "lucide-react";

// Interface para as props do componente
export interface FormularioEmpreendimentoProps {
  onComplete: (respostas: Record<string, any>) => void;
  onProgress: (progress: number) => void;
  onPerguntaRespondida: (perguntaId: string, resposta: any) => void;
  respostasAnteriores?: Record<string, any>;
}

/**
 * Componente para capturar preferências sobre o empreendimento/condomínio
 */
export function FormularioEmpreendimento({
  onComplete,
  onProgress,
  onPerguntaRespondida,
  respostasAnteriores = {}
}: FormularioEmpreendimentoProps) {
  // Estados para controle de fluxo
  const [etapaAtual, setEtapaAtual] = useState<number>(0);
  const [passoAtual, setPassoAtual] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Estados para respostas
  const [importanciaPisoQuartos, setImportanciaPisoQuartos] = useState<number>(50);
  const [importanciaAcademia, setImportanciaAcademia] = useState<number>(50);
  const [importanciaPiscina, setImportanciaPiscina] = useState<number>(50);
  const [tipoPortaria, setTipoPortaria] = useState<string>("");
  const [importanciaSalaoFestas, setImportanciaSalaoFestas] = useState<number>(50);
  const [importanciaPlayground, setImportanciaPlayground] = useState<number>(50);
  const [importanciaEspacoPet, setImportanciaEspacoPet] = useState<number>(50);
  
  // Definição das etapas e campos
  const etapas = [
    {
      titulo: "Detalhes do Empreendimento",
      campos: ["importanciaPisoQuartos", "importanciaAcademia", "importanciaPiscina", "tipoPortaria"]
    },
    {
      titulo: "Áreas Comuns",
      campos: ["importanciaSalaoFestas", "importanciaPlayground", "importanciaEspacoPet"]
    }
  ];
  
  // Atualizar progresso
  useEffect(() => {
    let novoProgresso = 90; // Começa em 90% (após imóvel ideal)
    
    if (etapaAtual === 0) {
      // Calcular progresso com base no passo atual
      const porcentagemPorCampo = 5 / (etapas[0].campos.length + etapas[1].campos.length);
      novoProgresso += (passoAtual * porcentagemPorCampo);
    } else if (etapaAtual === 1) {
      // Já concluiu a etapa 1
      const porcentagemEtapa1 = 2.5; // 2.5% para a etapa 1
      const porcentagemPorCampo = 5 / (etapas[0].campos.length + etapas[1].campos.length);
      novoProgresso += porcentagemEtapa1 + (passoAtual * porcentagemPorCampo);
    }
    
    onProgress(Math.min(novoProgresso, 95)); // Limita a 95% (guardamos 5% para última etapa)
  }, [etapaAtual, passoAtual, onProgress]);
  
  // Avançar para o próximo campo ou etapa
  const avancar = () => {
    const camposEtapaAtual = etapas[etapaAtual].campos;
    
    // Salvar resposta do campo atual
    const campoAtual = getCampoAtual();
    salvarResposta(campoAtual);
    
    if (passoAtual < camposEtapaAtual.length - 1) {
      // Avançar para o próximo campo na mesma etapa
      setPassoAtual(passoAtual + 1);
    } else if (etapaAtual < etapas.length - 1) {
      // Avançar para a próxima etapa
      setEtapaAtual(etapaAtual + 1);
      setPassoAtual(0);
    } else {
      // Finalizar fluxo de empreendimento
      finalizarFluxo();
    }
  };
  
  // Voltar para o campo ou etapa anterior
  const voltar = () => {
    if (passoAtual > 0) {
      // Voltar para o campo anterior na mesma etapa
      setPassoAtual(passoAtual - 1);
    } else if (etapaAtual > 0) {
      // Voltar para a etapa anterior, último campo
      setEtapaAtual(etapaAtual - 1);
      const etapaAnterior = etapas[etapaAtual - 1];
      setPassoAtual(etapaAnterior.campos.length - 1);
    }
  };
  
  // Obter o campo atual com base na etapa e passo
  const getCampoAtual = () => {
    return etapas[etapaAtual].campos[passoAtual];
  };
  
  // Salvar resposta para o campo atual
  const salvarResposta = (campo: string) => {
    switch (campo) {
      case "importanciaPisoQuartos":
        onPerguntaRespondida("seed-EMPREENDIMENTO-1", importanciaPisoQuartos);
        break;
      case "importanciaAcademia":
        onPerguntaRespondida("seed-EMPREENDIMENTO-2", importanciaAcademia);
        break;
      case "importanciaPiscina":
        onPerguntaRespondida("seed-EMPREENDIMENTO-3", importanciaPiscina);
        break;
      case "tipoPortaria":
        onPerguntaRespondida("seed-EMPREENDIMENTO-4", tipoPortaria);
        break;
      case "importanciaSalaoFestas":
        onPerguntaRespondida("seed-EMPREENDIMENTO-5", importanciaSalaoFestas);
        break;
      case "importanciaPlayground":
        onPerguntaRespondida("seed-EMPREENDIMENTO-6", importanciaPlayground);
        break;
      case "importanciaEspacoPet":
        onPerguntaRespondida("seed-EMPREENDIMENTO-7", importanciaEspacoPet);
        break;
    }
  };
  
  // Verificar se o campo atual tem dados válidos para prosseguir
  const podeProsseguir = () => {
    const campoAtual = getCampoAtual();
    
    switch (campoAtual) {
      case "importanciaPisoQuartos":
      case "importanciaAcademia":
      case "importanciaPiscina":
      case "importanciaSalaoFestas":
      case "importanciaPlayground":
      case "importanciaEspacoPet":
        return true; // Sempre tem um valor padrão
      case "tipoPortaria":
        return tipoPortaria !== "";
      default:
        return true;
    }
  };
  
  // Finalizar o fluxo e enviar todas as respostas
  const finalizarFluxo = () => {
    setLoading(true);
    
    // Juntar todas as respostas
    const todasRespostas = {
      importanciaPisoQuartos,
      importanciaAcademia,
      importanciaPiscina,
      tipoPortaria,
      importanciaSalaoFestas,
      importanciaPlayground,
      importanciaEspacoPet,
      fluxoAtual: "EMPREENDIMENTO",
      ...respostasAnteriores
    };
    
    // Notificar conclusão
    onComplete(todasRespostas);
    setLoading(false);
  };
  
  // Renderizar o campo atual
  const renderizarCampo = () => {
    const campoAtual = getCampoAtual();
    
    switch (campoAtual) {
      case "importanciaPisoQuartos":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base font-medium">Vir com pisos nos quartos?</Label>
                <Badge variant="outline" className="px-3 py-1 font-semibold">
                  {importanciaPisoQuartos}%
                </Badge>
              </div>
              <Slider
                value={[importanciaPisoQuartos]}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) => setImportanciaPisoQuartos(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Irrelevante</span>
                <span>Essencial</span>
              </div>
            </div>
          </div>
        );
        
      case "importanciaAcademia":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Dumbbell className="h-5 w-5 text-orange-500" />
                <Label className="text-base font-medium">Qual a importância de ter academia no condomínio?</Label>
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="px-3 py-1 font-semibold">
                  {importanciaAcademia}%
                </Badge>
              </div>
              <Slider
                value={[importanciaAcademia]}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) => setImportanciaAcademia(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Irrelevante</span>
                <span>Essencial</span>
              </div>
            </div>
          </div>
        );
        
      case "importanciaPiscina":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Waves className="h-5 w-5 text-blue-500" />
                <Label className="text-base font-medium">Qual a importância de ter piscina no condomínio?</Label>
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="px-3 py-1 font-semibold">
                  {importanciaPiscina}%
                </Badge>
              </div>
              <Slider
                value={[importanciaPiscina]}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) => setImportanciaPiscina(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Irrelevante</span>
                <span>Essencial</span>
              </div>
            </div>
          </div>
        );
        
      case "tipoPortaria":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-green-500" />
                <Label className="text-base font-medium">Qual tipo de portaria você prefere?</Label>
              </div>
              <RadioGroup onValueChange={setTipoPortaria} value={tipoPortaria} className="flex flex-col space-y-3">
                <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-slate-50">
                  <RadioGroupItem value="portaria_24h" id="portaria-24h" />
                  <Label htmlFor="portaria-24h" className="flex-1">Portaria 24h</Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-slate-50">
                  <RadioGroupItem value="portaria_remota" id="portaria-remota" />
                  <Label htmlFor="portaria-remota" className="flex-1">Portaria remota</Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-slate-50">
                  <RadioGroupItem value="nao_importante" id="portaria-nao-importante" />
                  <Label htmlFor="portaria-nao-importante" className="flex-1">Não é importante</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );
        
      case "importanciaSalaoFestas":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <PartyPopper className="h-5 w-5 text-purple-500" />
                <Label className="text-base font-medium">Qual a importância de ter salão de festas?</Label>
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="px-3 py-1 font-semibold">
                  {importanciaSalaoFestas}%
                </Badge>
              </div>
              <Slider
                value={[importanciaSalaoFestas]}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) => setImportanciaSalaoFestas(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Irrelevante</span>
                <span>Essencial</span>
              </div>
            </div>
          </div>
        );
        
      case "importanciaPlayground":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Trees className="h-5 w-5 text-green-500" />
                <Label className="text-base font-medium">Qual a importância de ter playground/área infantil?</Label>
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="px-3 py-1 font-semibold">
                  {importanciaPlayground}%
                </Badge>
              </div>
              <Slider
                value={[importanciaPlayground]}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) => setImportanciaPlayground(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Irrelevante</span>
                <span>Essencial</span>
              </div>
            </div>
          </div>
        );
        
      case "importanciaEspacoPet":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Dog className="h-5 w-5 text-amber-500" />
                <Label className="text-base font-medium">Qual a importância de ter espaço pet?</Label>
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="px-3 py-1 font-semibold">
                  {importanciaEspacoPet}%
                </Badge>
              </div>
              <Slider
                value={[importanciaEspacoPet]}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) => setImportanciaEspacoPet(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Irrelevante</span>
                <span>Essencial</span>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="w-full px-4 py-8">
      {/* Barra de Progresso */}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-8">
        <div 
          className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-300"
          style={{ width: "92%" }}
        />
      </div>
      
      {/* Formulário Principal */}
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${etapaAtual}-${passoAtual}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <Badge 
                variant="outline" 
                className="mb-2 px-3 py-1 text-sm font-medium text-orange-600 bg-orange-50 border-orange-200"
              >
                {etapas[etapaAtual].titulo}
              </Badge>
              
              <Card className="border-none shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold">
                    <div className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-orange-500" /> 
                      <span>Detalhes do Empreendimento</span>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Etapa {etapaAtual + 1} de {etapas.length} - Pergunta {passoAtual + 1} de {etapas[etapaAtual].campos.length}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pb-6">
                  {renderizarCampo()}
                </CardContent>
                
                <CardFooter className="flex justify-between pt-2 border-t">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={voltar}
                    disabled={etapaAtual === 0 && passoAtual === 0}
                  >
                    Voltar
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={avancar}
                    disabled={!podeProsseguir() || loading}
                  >
                    {loading ? (
                      "Processando..."
                    ) : etapaAtual === etapas.length - 1 && passoAtual === etapas[etapaAtual].campos.length - 1 ? (
                      "Finalizar"
                    ) : (
                      "Continuar"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
