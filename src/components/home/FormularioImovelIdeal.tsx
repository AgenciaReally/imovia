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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Home, Building } from "lucide-react";

// Interface para as props do componente
export interface FormularioImovelIdealProps {
  onComplete: (respostas: Record<string, any>) => void;
  onProgress: (progress: number) => void;
  onPerguntaRespondida: (perguntaId: string, resposta: any) => void;
  respostasAnteriores?: Record<string, any>;
}

/**
 * Componente para capturar características do imóvel ideal do usuário
 */
export function FormularioImovelIdeal({
  onComplete,
  onProgress,
  onPerguntaRespondida,
  respostasAnteriores = {}
}: FormularioImovelIdealProps) {
  // Estados para controle de fluxo
  const [etapaAtual, setEtapaAtual] = useState<number>(0);
  const [passoAtual, setPassoAtual] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Estados para respostas
  const [prazoMudanca, setPrazoMudanca] = useState<string>("");
  const [tipoImovel, setTipoImovel] = useState<string>("");
  const [qtdQuartos, setQtdQuartos] = useState<string>("");
  const [qtdSuites, setQtdSuites] = useState<string>("");
  const [qtdVagas, setQtdVagas] = useState<string>("");
  const [metragem, setMetragem] = useState<number>(80);
  const [importanciaChurrasqueira, setImportanciaChurrasqueira] = useState<number>(50);
  const [arCondicionado, setArCondicionado] = useState<string>("");
  const [importanciaVaranda, setImportanciaVaranda] = useState<number>(50);
  const [importanciaSilencio, setImportanciaSilencio] = useState<number>(50);
  const [faceSolar, setFaceSolar] = useState<string>("");
  
  // Definição das etapas e campos
  const etapas = [
    {
      titulo: "Características Básicas",
      campos: ["prazoMudanca", "tipoImovel", "qtdQuartos", "qtdSuites", "qtdVagas", "metragem"]
    },
    {
      titulo: "Características Adicionais",
      campos: ["importanciaChurrasqueira", "arCondicionado", "importanciaVaranda", "importanciaSilencio", "faceSolar"]
    }
  ];
  
  // Atualizar progresso
  useEffect(() => {
    let novoProgresso = 80; // Começa em 80% (após preferências)
    
    if (etapaAtual === 0) {
      // Calcular progresso com base no passo atual
      const porcentagemPorCampo = 10 / (etapas[0].campos.length + etapas[1].campos.length);
      novoProgresso += (passoAtual * porcentagemPorCampo);
    } else if (etapaAtual === 1) {
      // Já concluiu a etapa 1
      const porcentagemEtapa1 = 10 / 2; // 5% para a etapa 1
      const porcentagemPorCampo = 10 / (etapas[0].campos.length + etapas[1].campos.length);
      novoProgresso += porcentagemEtapa1 + (passoAtual * porcentagemPorCampo);
    }
    
    onProgress(Math.min(novoProgresso, 90)); // Limita a 90% (guardamos 10% para próximas etapas)
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
      // Finalizar fluxo de imóvel ideal
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
      case "prazoMudanca":
        onPerguntaRespondida("seed-IMOVEL_IDEAL-1", prazoMudanca);
        break;
      case "tipoImovel":
        onPerguntaRespondida("seed-IMOVEL_IDEAL-2", tipoImovel);
        break;
      case "qtdQuartos":
        onPerguntaRespondida("seed-IMOVEL_IDEAL-3", qtdQuartos);
        break;
      case "qtdSuites":
        onPerguntaRespondida("seed-IMOVEL_IDEAL-4", qtdSuites);
        break;
      case "qtdVagas":
        onPerguntaRespondida("seed-IMOVEL_IDEAL-5", qtdVagas);
        break;
      case "metragem":
        onPerguntaRespondida("seed-IMOVEL_IDEAL-6", metragem);
        break;
      case "importanciaChurrasqueira":
        onPerguntaRespondida("seed-IMOVEL_IDEAL-7", importanciaChurrasqueira);
        break;
      case "arCondicionado":
        onPerguntaRespondida("seed-IMOVEL_IDEAL-8", arCondicionado);
        break;
      case "importanciaVaranda":
        onPerguntaRespondida("seed-IMOVEL_IDEAL-9", importanciaVaranda);
        break;
      case "importanciaSilencio":
        onPerguntaRespondida("seed-IMOVEL_IDEAL-10", importanciaSilencio);
        break;
      case "faceSolar":
        onPerguntaRespondida("seed-IMOVEL_IDEAL-11", faceSolar);
        break;
    }
  };
  
  // Verificar se o campo atual tem dados válidos para prosseguir
  const podeProsseguir = () => {
    const campoAtual = getCampoAtual();
    
    switch (campoAtual) {
      case "prazoMudanca":
        return prazoMudanca !== "";
      case "tipoImovel":
        return tipoImovel !== "";
      case "qtdQuartos":
        return qtdQuartos !== "";
      case "qtdSuites":
        return qtdSuites !== "";
      case "qtdVagas":
        return qtdVagas !== "";
      case "metragem":
        return true; // Sempre tem um valor padrão
      case "importanciaChurrasqueira":
        return true; // Sempre tem um valor padrão
      case "arCondicionado":
        return arCondicionado !== "";
      case "importanciaVaranda":
        return true; // Sempre tem um valor padrão
      case "importanciaSilencio":
        return true; // Sempre tem um valor padrão
      case "faceSolar":
        return faceSolar !== "";
      default:
        return true;
    }
  };
  
  // Finalizar o fluxo e enviar todas as respostas
  const finalizarFluxo = () => {
    setLoading(true);
    
    // Juntar todas as respostas
    const todasRespostas = {
      prazoMudanca,
      tipoImovel,
      qtdQuartos,
      qtdSuites,
      qtdVagas,
      metragem,
      importanciaChurrasqueira,
      arCondicionado,
      importanciaVaranda,
      importanciaSilencio,
      faceSolar,
      fluxoAtual: "IMOVEL_IDEAL",
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
      case "prazoMudanca":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base font-medium">Quando você quer se mudar?</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: '3 meses (imóvel pronto)', value: '3_meses' },
                  { label: '1 ano', value: '1_ano' },
                  { label: 'Até 2 anos', value: '2_anos' },
                  { label: 'Até 3+ anos', value: '3_mais_anos' }
                ].map((opcao) => (
                  <Button
                    key={opcao.value}
                    type="button"
                    variant={prazoMudanca === opcao.value ? "default" : "outline"}
                    className={cn(
                      "h-auto py-4 px-3 justify-start items-center",
                      prazoMudanca === opcao.value ? "ring-2 ring-orange-500" : ""
                    )}
                    onClick={() => setPrazoMudanca(opcao.value)}
                  >
                    <span className="text-left">{opcao.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );
        
      case "tipoImovel":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base font-medium">Selecione seu tipo de imóvel ideal</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Casa de rua', value: 'casa_rua', icon: Home },
                  { label: 'Sobrado', value: 'sobrado', icon: Home },
                  { label: 'Apartamento', value: 'apartamento', icon: Building },
                  { label: 'Apartamento Garden', value: 'ap_garden', icon: Building },
                  { label: 'Cobertura', value: 'cobertura', icon: Building }
                ].map((opcao) => {
                  const Icon = opcao.icon;
                  return (
                    <Button
                      key={opcao.value}
                      type="button"
                      variant={tipoImovel === opcao.value ? "default" : "outline"}
                      className={cn(
                        "h-auto py-4 px-3 justify-start items-center",
                        tipoImovel === opcao.value ? "ring-2 ring-orange-500" : ""
                      )}
                      onClick={() => setTipoImovel(opcao.value)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      <span className="text-left">{opcao.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        );
        
      case "qtdQuartos":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base font-medium">Quantidade mínima de quartos</Label>
              <Select onValueChange={setQtdQuartos} value={qtdQuartos}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 quarto</SelectItem>
                  <SelectItem value="2">2 quartos</SelectItem>
                  <SelectItem value="3">3 quartos</SelectItem>
                  <SelectItem value="4_mais">4 ou mais quartos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case "qtdSuites":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base font-medium">É necessário ter suítes?</Label>
              <Select onValueChange={setQtdSuites} value={qtdSuites}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nao">Não é necessário</SelectItem>
                  <SelectItem value="1">1 suíte</SelectItem>
                  <SelectItem value="2_mais">2 ou mais suítes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case "qtdVagas":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base font-medium">Quantidade mínima de vagas de garagem</Label>
              <Select onValueChange={setQtdVagas} value={qtdVagas}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Não preciso de garagem</SelectItem>
                  <SelectItem value="1">1 vaga</SelectItem>
                  <SelectItem value="2">2 vagas</SelectItem>
                  <SelectItem value="3_mais">3 ou mais vagas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case "metragem":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base font-medium">Metragem útil mínima desejada (m²)</Label>
                <Badge variant="outline" className="text-lg px-3 py-1 font-semibold">
                  {metragem} m²
                </Badge>
              </div>
              <Slider
                value={[metragem]}
                min={40}
                max={300}
                step={10}
                onValueChange={(value) => setMetragem(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>40 m²</span>
                <span>300 m²</span>
              </div>
            </div>
          </div>
        );
        
      case "importanciaChurrasqueira":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base font-medium">Qual a importância de ter churrasqueira particular?</Label>
                <Badge variant="outline" className="px-3 py-1 font-semibold">
                  {importanciaChurrasqueira}%
                </Badge>
              </div>
              <Slider
                value={[importanciaChurrasqueira]}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) => setImportanciaChurrasqueira(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Irrelevante</span>
                <span>Essencial</span>
              </div>
            </div>
          </div>
        );
        
      case "arCondicionado":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base font-medium">Ar condicionado é imprescindível?</Label>
              <RadioGroup onValueChange={setArCondicionado} value={arCondicionado} className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="ar-sim" />
                  <Label htmlFor="ar-sim">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="ar-nao" />
                  <Label htmlFor="ar-nao">Não</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );
        
      case "importanciaVaranda":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base font-medium">Qual a importância de ter varanda/sacada?</Label>
                <Badge variant="outline" className="px-3 py-1 font-semibold">
                  {importanciaVaranda}%
                </Badge>
              </div>
              <Slider
                value={[importanciaVaranda]}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) => setImportanciaVaranda(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Irrelevante</span>
                <span>Essencial</span>
              </div>
            </div>
          </div>
        );
        
      case "importanciaSilencio":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base font-medium">Qual a importância do imóvel ser silencioso?</Label>
                <Badge variant="outline" className="px-3 py-1 font-semibold">
                  {importanciaSilencio}%
                </Badge>
              </div>
              <Slider
                value={[importanciaSilencio]}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) => setImportanciaSilencio(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Irrelevante</span>
                <span>Essencial</span>
              </div>
            </div>
          </div>
        );
        
      case "faceSolar":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base font-medium">Qual face solar você prefere?</Label>
              <RadioGroup onValueChange={setFaceSolar} value={faceSolar} className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="norte" id="face-norte" />
                  <Label htmlFor="face-norte">Norte (mais sol durante o dia todo)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="leste" id="face-leste" />
                  <Label htmlFor="face-leste">Leste (sol da manhã)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="oeste" id="face-oeste" />
                  <Label htmlFor="face-oeste">Oeste (sol da tarde)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sul" id="face-sul" />
                  <Label htmlFor="face-sul">Sul (menos sol, mais fresco)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="irrelevante" id="face-irrelevante" />
                  <Label htmlFor="face-irrelevante">Irrelevante para mim</Label>
                </div>
              </RadioGroup>
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
          style={{ width: "85%" }}
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
                    Seu Imóvel Ideal
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
