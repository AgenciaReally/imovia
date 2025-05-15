"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
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
import { 
  Trees, 
  ShoppingBag, 
  UtensilsCrossed, 
  Footprints,
  Dog,
  GraduationCap,
  Bus
} from "lucide-react";

// Interface para as props do componente
export interface FormularioProximidadesProps {
  onComplete: (respostas: Record<string, any>) => void;
  onProgress: (progress: number) => void;
  onPerguntaRespondida: (perguntaId: string, resposta: any) => void;
  respostasAnteriores?: Record<string, any>;
}

/**
 * Componente para capturar preferências sobre proximidades
 */
export function FormularioProximidades({
  onComplete,
  onProgress,
  onPerguntaRespondida,
  respostasAnteriores = {}
}: FormularioProximidadesProps) {
  // Estados para controle de fluxo
  const [etapaAtual, setEtapaAtual] = useState<number>(0);
  const [passoAtual, setPassoAtual] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Estados para respostas
  const [importanciaParques, setImportanciaParques] = useState<number>(50);
  const [importanciaShoppings, setImportanciaShoppings] = useState<number>(50);
  const [importanciaRestaurantes, setImportanciaRestaurantes] = useState<number>(50);
  const [importanciaCaminhabilidade, setImportanciaCaminhabilidade] = useState<number>(50);
  const [temPet, setTemPet] = useState<string>("");
  const [importanciaEscolas, setImportanciaEscolas] = useState<number>(50);
  const [importanciaTransporte, setImportanciaTransporte] = useState<number>(50);
  
  // Definição das etapas e campos
  const etapas = [
    {
      titulo: "Proximidades & Conveniência",
      campos: ["importanciaParques", "importanciaShoppings", "importanciaRestaurantes", "importanciaCaminhabilidade"]
    },
    {
      titulo: "Lifestyle & Necessidades",
      campos: ["temPet", "importanciaEscolas", "importanciaTransporte"]
    }
  ];
  
  // Atualizar progresso
  useEffect(() => {
    let novoProgresso = 95; // Começa em 95% (após empreendimento)
    
    if (etapaAtual === 0) {
      // Calcular progresso com base no passo atual
      const porcentagemPorCampo = 5 / (etapas[0].campos.length + etapas[1].campos.length);
      novoProgresso += (passoAtual * porcentagemPorCampo);
    } else if (etapaAtual === 1) {
      // Já concluiu a etapa 1
      const porcentagemEtapa1 = 3; // 3% para a etapa 1
      const porcentagemPorCampo = 5 / (etapas[0].campos.length + etapas[1].campos.length);
      novoProgresso += porcentagemEtapa1 + (passoAtual * porcentagemPorCampo);
    }
    
    onProgress(Math.min(novoProgresso, 99)); // Limitamos a 99% (último 1% quando finalizar)
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
      // Finalizar fluxo de proximidades
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
      case "importanciaParques":
        onPerguntaRespondida("seed-PROXIMIDADES-1", importanciaParques);
        break;
      case "importanciaShoppings":
        onPerguntaRespondida("seed-PROXIMIDADES-2", importanciaShoppings);
        break;
      case "importanciaRestaurantes":
        onPerguntaRespondida("seed-PROXIMIDADES-3", importanciaRestaurantes);
        break;
      case "importanciaCaminhabilidade":
        onPerguntaRespondida("seed-PROXIMIDADES-4", importanciaCaminhabilidade);
        break;
      case "temPet":
        onPerguntaRespondida("seed-PROXIMIDADES-5", temPet);
        break;
      case "importanciaEscolas":
        onPerguntaRespondida("seed-PROXIMIDADES-6", importanciaEscolas);
        break;
      case "importanciaTransporte":
        onPerguntaRespondida("seed-PROXIMIDADES-7", importanciaTransporte);
        break;
    }
  };
  
  // Verificar se o campo atual tem dados válidos para prosseguir
  const podeProsseguir = () => {
    const campoAtual = getCampoAtual();
    
    switch (campoAtual) {
      case "importanciaParques":
      case "importanciaShoppings":
      case "importanciaRestaurantes":
      case "importanciaCaminhabilidade":
      case "importanciaEscolas":
      case "importanciaTransporte":
        return true; // Sempre tem um valor padrão
      case "temPet":
        return temPet !== "";
      default:
        return true;
    }
  };
  
  // Finalizar o fluxo e enviar todas as respostas
  const finalizarFluxo = () => {
    setLoading(true);
    
    // Juntar todas as respostas
    const todasRespostas = {
      importanciaParques,
      importanciaShoppings,
      importanciaRestaurantes,
      importanciaCaminhabilidade,
      temPet,
      importanciaEscolas,
      importanciaTransporte,
      fluxoAtual: "PROXIMIDADES",
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
      case "importanciaParques":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Trees className="h-5 w-5 text-green-500" />
                <Label className="text-base font-medium">Qual a importância de estar perto de parques?</Label>
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="px-3 py-1 font-semibold">
                  {importanciaParques}%
                </Badge>
              </div>
              <Slider
                value={[importanciaParques]}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) => setImportanciaParques(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Irrelevante</span>
                <span>Essencial</span>
              </div>
            </div>
          </div>
        );
        
      case "importanciaShoppings":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBag className="h-5 w-5 text-pink-500" />
                <Label className="text-base font-medium">Qual a importância de estar perto de shoppings?</Label>
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="px-3 py-1 font-semibold">
                  {importanciaShoppings}%
                </Badge>
              </div>
              <Slider
                value={[importanciaShoppings]}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) => setImportanciaShoppings(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Irrelevante</span>
                <span>Essencial</span>
              </div>
            </div>
          </div>
        );
        
      case "importanciaRestaurantes":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <UtensilsCrossed className="h-5 w-5 text-orange-500" />
                <Label className="text-base font-medium">Qual a importância de estar perto de restaurantes e bares?</Label>
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="px-3 py-1 font-semibold">
                  {importanciaRestaurantes}%
                </Badge>
              </div>
              <Slider
                value={[importanciaRestaurantes]}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) => setImportanciaRestaurantes(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Irrelevante</span>
                <span>Essencial</span>
              </div>
            </div>
          </div>
        );
        
      case "importanciaCaminhabilidade":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Footprints className="h-5 w-5 text-blue-500" />
                <Label className="text-base font-medium">Qual a importância de poder fazer coisas a pé (caminhabilidade)?</Label>
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="px-3 py-1 font-semibold">
                  {importanciaCaminhabilidade}%
                </Badge>
              </div>
              <Slider
                value={[importanciaCaminhabilidade]}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) => setImportanciaCaminhabilidade(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Irrelevante</span>
                <span>Essencial</span>
              </div>
            </div>
          </div>
        );
        
      case "temPet":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Dog className="h-5 w-5 text-amber-500" />
                <Label className="text-base font-medium">Você tem pet?</Label>
              </div>
              <RadioGroup onValueChange={setTemPet} value={temPet} className="flex flex-col space-y-3">
                <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-slate-50">
                  <RadioGroupItem value="sim" id="pet-sim" />
                  <Label htmlFor="pet-sim" className="flex-1">Sim</Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-slate-50">
                  <RadioGroupItem value="nao" id="pet-nao" />
                  <Label htmlFor="pet-nao" className="flex-1">Não</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );
        
      case "importanciaEscolas":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-5 w-5 text-indigo-500" />
                <Label className="text-base font-medium">Qual a importância de estar perto de escolas?</Label>
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="px-3 py-1 font-semibold">
                  {importanciaEscolas}%
                </Badge>
              </div>
              <Slider
                value={[importanciaEscolas]}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) => setImportanciaEscolas(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Irrelevante</span>
                <span>Essencial</span>
              </div>
            </div>
          </div>
        );
        
      case "importanciaTransporte":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Bus className="h-5 w-5 text-green-500" />
                <Label className="text-base font-medium">Qual a importância de estar perto de transporte público?</Label>
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="px-3 py-1 font-semibold">
                  {importanciaTransporte}%
                </Badge>
              </div>
              <Slider
                value={[importanciaTransporte]}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) => setImportanciaTransporte(value[0])}
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
          style={{ width: "97%" }}
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
                      <Footprints className="h-5 w-5 text-orange-500" /> 
                      <span>Proximidades & Conveniência</span>
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
