"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { MapPin, Home, Building, Check, ChevronsUpDown } from "lucide-react";

// Tipos para o formulário
type CidadeType = {
  value: string;
  label: string;
};

type EnderecoType = {
  id: string;
  endereco: string;
};

// Vamos criar os componentes Command, necessários para o combobox
// Estes seriam normalmente importados de '@/components/ui/command'
const Command = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="flex h-full w-full flex-col overflow-hidden rounded-md bg-white text-slate-950" {...props}>
    {children}
  </div>
);

const CommandInput = ({ 
  className, 
  ...props 
}: React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="flex items-center border-b px-3">
    <input
      className={cn(
        "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
);

const CommandEmpty = ({ children }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="py-6 text-center text-sm">{children}</div>
);

const CommandGroup = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "overflow-hidden p-1 text-slate-950",
      className
    )}
    {...props}
  />
);

const CommandItem = ({ 
  className, 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-slate-100 aria-selected:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-slate-100",
      className
    )}
    {...props}
  />
);

// Popover components
const Popover = ({ children, open, onOpenChange }: { children: React.ReactNode, open?: boolean, onOpenChange?: (open: boolean) => void }) => {
  return (
    <div className="relative">
      {children}
    </div>
  );
};

const PopoverTrigger = ({ asChild, children, ...props }: { asChild?: boolean, children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return asChild ? children : <button {...props}>{children}</button>;
};

const PopoverContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("absolute z-50 w-full min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white p-1 shadow-md animate-in fade-in-80", className)} {...props}>
      {children}
    </div>
  );
};

// Interface para as props do componente
export interface FormularioPreferenciasProps {
  onComplete: (respostas: Record<string, any>) => void;
  onProgress: (progress: number) => void;
  onPerguntaRespondida: (perguntaId: string, resposta: any) => void;
  respostasAnteriores?: Record<string, any>;
}

/**
 * Componente para capturar preferências do usuário sobre localização
 */
export function FormularioPreferencias({
  onComplete,
  onProgress,
  onPerguntaRespondida,
  respostasAnteriores = {}
}: FormularioPreferenciasProps) {
  // Estados para controle de fluxo
  const [etapaAtual, setEtapaAtual] = useState<number>(0);
  const [passoAtual, setPassoAtual] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Estados para respostas
  const [cidade, setCidade] = useState<string>("");
  const [cidadeSelecionada, setCidadeSelecionada] = useState<CidadeType | null>(null);
  const [cidadePesquisa, setCidadePesquisa] = useState("");
  const [cidadesSugeridas, setCidadesSugeridas] = useState<CidadeType[]>([]);
  const [cidadesOptions, setCidadesOptions] = useState<CidadeType[]>([]);
  const [cidadesLoading, setCidadesLoading] = useState<boolean>(false);
  const [cidadeAberta, setCidadeAberta] = useState<boolean>(false);
  
  const [tiposImovelSelecionados, setTiposImovelSelecionados] = useState<string[]>([]);
  
  const [bairrosSelecionados, setBairrosSelecionados] = useState<string[]>([]);
  const [bairroPesquisa, setBairroPesquisa] = useState("");
  const [bairrosSugeridos, setBairrosSugeridos] = useState<string[]>([]);
  const [novoBairro, setNovoBairro] = useState<string>("");
  const [localTrabalho, setLocalTrabalho] = useState<string>("");
  const [localEscola, setLocalEscola] = useState<string>("");
  const [bairrosDisponiveis, setBairrosDisponiveis] = useState<CidadeType[]>([
    { value: "centro", label: "Centro" },
    { value: "agua_verde", label: "Água Verde" },
    { value: "batel", label: "Batel" },
    { value: "bigorrilho", label: "Bigorrilho" },
    { value: "cabral", label: "Cabral" },
    { value: "portao", label: "Portão" },
    { value: "santa_felicidade", label: "Santa Felicidade" },
    { value: "boa_vista", label: "Boa Vista" },
  ]);
  
  const [enderecosTrabalho, setEnderecosTrabalho] = useState<EnderecoType[]>([]);
  const [enderecosEscola, setEnderecosEscola] = useState<EnderecoType[]>([]);

  // Função para buscar cidades de uma API
  const buscarCidades = async (termo?: string) => {
    setCidadesLoading(true);
    try {
      if (!termo || termo.length < 2) {
        // Algumas cidades populares se não tem termo de busca
        setCidadesOptions([
          { value: 'curitiba', label: 'Curitiba - PR' },
          { value: 'sao_paulo', label: 'São Paulo - SP' },
          { value: 'rio_de_janeiro', label: 'Rio de Janeiro - RJ' },
          { value: 'belo_horizonte', label: 'Belo Horizonte - MG' },
          { value: 'brasilia', label: 'Brasília - DF' },
          { value: 'salvador', label: 'Salvador - BA' },
          { value: 'fortaleza', label: 'Fortaleza - CE' },
          { value: 'recife', label: 'Recife - PE' },
        ]);
        return;
      }

      // Usando a API pública do Brasil API para busca precisa
      const url = `https://brasilapi.com.br/api/ibge/municipios/v1/${encodeURIComponent(termo)}`;
      
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          
          // Formatar os dados para o formato esperado
          const options = data.map((cidade: any) => ({
            value: cidade.codigo_ibge.toString(),
            label: `${cidade.nome} - ${cidade.uf}`
          }));
          
          // Limitar para os primeiros 15 resultados para melhor visibilidade
          setCidadesOptions(options.slice(0, 15));
        } else {
          // Tentativa alternativa com a API do IBGE
          const ibgeUrl = `https://servicodados.ibge.gov.br/api/v1/localidades/municipios?nome=${encodeURIComponent(termo)}`;
          const ibgeResponse = await fetch(ibgeUrl);
          const ibgeData = await ibgeResponse.json();
          
          const options = ibgeData.map((cidade: any) => ({
            value: cidade.id.toString(),
            label: `${cidade.nome} - ${cidade.microrregiao?.mesorregiao?.UF?.sigla || ''}`
          }));
          
          // Ordenar por relevância (começa com o termo de busca primeiro)
          const sortedOptions = options.sort((a: any, b: any) => {
            const nameA = a.label.split(' - ')[0].toLowerCase();
            const nameB = b.label.split(' - ')[0].toLowerCase();
            const termLower = termo.toLowerCase();
            
            // Prioriza cidades que começam com o termo de busca
            if (nameA.startsWith(termLower) && !nameB.startsWith(termLower)) return -1;
            if (!nameA.startsWith(termLower) && nameB.startsWith(termLower)) return 1;
            
            // Em seguida, ordem alfabética
            return nameA.localeCompare(nameB);
          });
          
          setCidadesOptions(sortedOptions.slice(0, 15));
        }
      } catch (error) {
        console.error('Erro com BrasilAPI, tentando IBGE diretamente:', error);
        
        // Fallback para IBGE direto
        const ibgeUrl = `https://servicodados.ibge.gov.br/api/v1/localidades/municipios?nome=${encodeURIComponent(termo)}`;
        const ibgeResponse = await fetch(ibgeUrl);
        const ibgeData = await ibgeResponse.json();
        
        const options = ibgeData.map((cidade: any) => ({
          value: cidade.id.toString(),
          label: `${cidade.nome} - ${cidade.microrregiao?.mesorregiao?.UF?.sigla || ''}`
        }));
        
        setCidadesOptions(options.slice(0, 15));
      }
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
      // Fornecer algumas cidades padrão em caso de erro
      setCidadesOptions([
        { value: 'curitiba', label: 'Curitiba - PR' },
        { value: 'sao_paulo', label: 'São Paulo - SP' },
        { value: 'rio_de_janeiro', label: 'Rio de Janeiro - RJ' },
        { value: 'belo_horizonte', label: 'Belo Horizonte - MG' },
        { value: 'brasilia', label: 'Brasília - DF' },
        { value: 'salvador', label: 'Salvador - BA' },
        { value: 'fortaleza', label: 'Fortaleza - CE' },
        { value: 'recife', label: 'Recife - PE' },
      ]);
    } finally {
      setCidadesLoading(false);
    }
  };
  
  // Definição das etapas e campos
  const etapas = [
    {
      titulo: "Localização e Acesso",
      campos: ["cidade", "tipoImovel", "bairros", "trabalho", "escola"]
    }
  ];
  
  // Atualizar progresso
  useEffect(() => {
    let novoProgresso = 70; // Começa em 70% (após informações complementares)
    
    if (etapaAtual === 0) {
      // Calcular progresso com base no passo atual
      const porcentagemPorCampo = 10 / etapas[etapaAtual].campos.length;
      novoProgresso += (passoAtual * porcentagemPorCampo);
    }
    
    onProgress(Math.min(novoProgresso, 80)); // Limita a 80% (guardamos 20% para próximas etapas)
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
      // Finalizar fluxo de preferências
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
      case "cidade":
        onPerguntaRespondida("seed-PREFERENCIAS-1", cidade);
        break;
      case "bairros":
        onPerguntaRespondida("seed-PREFERENCIAS-2", bairrosSelecionados);
        break;
      case "trabalho":
        onPerguntaRespondida("seed-PREFERENCIAS-3", localTrabalho);
        break;
      case "escola":
        onPerguntaRespondida("seed-PREFERENCIAS-4", localEscola);
        break;
    }
  };
  
  // Verificar se o campo atual tem dados válidos para prosseguir
  const podeProsseguir = () => {
    const campoAtual = getCampoAtual();
    
    switch (campoAtual) {
      case "cidade":
        return cidade !== "";
      case "bairros":
        return true; // Opcional, pode avançar sem selecionar
      case "trabalho":
        return true; // Opcional, pode avançar sem preencher
      case "escola":
        return true; // Opcional, pode avançar sem preencher
      default:
        return true;
    }
  };
  
  // Finalizar o fluxo atual
  const finalizarFluxo = () => {
    setLoading(true);
    
    // Consolidar todas as respostas
    const todasRespostas = {
      fluxo: "PREFERENCIAS",
      cidade,
      bairrosSelecionados,
      localTrabalho,
      localEscola
    };
    
    // Simulação de processamento
    setTimeout(() => {
      // Enviar todas as respostas
      onPerguntaRespondida("seed-PREFERENCIAS-1", cidade);
      onPerguntaRespondida("seed-PREFERENCIAS-2", bairrosSelecionados);
      onPerguntaRespondida("seed-PREFERENCIAS-3", localTrabalho);
      onPerguntaRespondida("seed-PREFERENCIAS-4", localEscola);
      
      // Chamar o callback de conclusão para avançar para o próximo fluxo
      if (onComplete) {
        onComplete({
          ...respostasAnteriores,
          ...todasRespostas,
          fluxoAtual: "IMOVEL_IDEAL" // Próximo fluxo
        });
      }
      
      setLoading(false);
    }, 1000);
  };
  
  // Renderizar campo conforme o tipo
  const renderizarCampo = () => {
    const campoAtual = getCampoAtual();
    
    switch (campoAtual) {
      case "cidade":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Em qual cidade você deseja comprar um imóvel?</Label>
              
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Digite o nome da cidade..."
                  value={cidadePesquisa}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCidadePesquisa(value);
                    if (value.length >= 2) {
                      buscarCidades(value);
                      setCidadeAberta(true);
                    } else {
                      setCidadeAberta(false);
                    }
                  }}
                  onClick={() => {
                    if (cidadePesquisa.length >= 2) {
                      setCidadeAberta(true);
                    }
                  }}
                  className="w-full"
                />
                
                {cidadeAberta && (
                  <div className="absolute z-50 w-full mt-1 max-h-60 overflow-auto bg-white border border-gray-200 rounded-md shadow-lg">
                    {cidadesLoading ? (
                      <div className="py-4 px-3 text-center text-sm">Carregando cidades...</div>
                    ) : cidadesOptions.length === 0 ? (
                      <div className="py-4 px-3 text-center text-sm">Nenhuma cidade encontrada.</div>
                    ) : (
                      <div>
                        {cidadesOptions.map((city) => (
                          <div
                            key={city.value}
                            className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center ${cidade === city.value ? 'bg-orange-50 text-orange-600' : ''}`}
                            onClick={() => {
                              setCidade(city.value);
                              setCidadePesquisa(city.label.split(' - ')[0]); // Apenas o nome da cidade, sem a UF
                              setCidadeAberta(false);
                            }}
                          >
                            {city.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground">Digite o nome da cidade e selecione uma das opções.</p>
            </div>
          </div>
        );
        
      case "tipoImovel":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Que tipo de imóvel você está buscando?</Label>
              
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div 
                  className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all hover:border-orange-400 ${tiposImovelSelecionados.includes("casa") ? "border-2 border-orange-500 bg-orange-50" : "border-gray-200"}`}
                  onClick={() => {
                    if (tiposImovelSelecionados.includes("casa")) {
                      setTiposImovelSelecionados(tiposImovelSelecionados.filter(t => t !== "casa"));
                    } else {
                      setTiposImovelSelecionados([...tiposImovelSelecionados, "casa"]);
                    }
                  }}
                >
                  <Home className={`h-12 w-12 mb-2 ${tiposImovelSelecionados.includes("casa") ? "text-orange-500" : "text-gray-400"}`} />
                  <span className="text-base font-medium">Casa</span>
                </div>
                
                <div 
                  className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all hover:border-orange-400 ${tiposImovelSelecionados.includes("apartamento") ? "border-2 border-orange-500 bg-orange-50" : "border-gray-200"}`}
                  onClick={() => {
                    if (tiposImovelSelecionados.includes("apartamento")) {
                      setTiposImovelSelecionados(tiposImovelSelecionados.filter(t => t !== "apartamento"));
                    } else {
                      setTiposImovelSelecionados([...tiposImovelSelecionados, "apartamento"]);
                    }
                  }}
                >
                  <Building className={`h-12 w-12 mb-2 ${tiposImovelSelecionados.includes("apartamento") ? "text-orange-500" : "text-gray-400"}`} />
                  <span className="text-base font-medium">Apartamento</span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mt-2">Selecione uma ou ambas as opções conforme sua preferência.</p>
            </div>
          </div>
        );
        
      case "bairros":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-medium">Quais bairros você prefere?</Label>
              
              {/* Campo para adicionar novo bairro */}
              <div className="flex items-center space-x-2 mb-4">
                <Input
                  type="text"
                  value={novoBairro}
                  onChange={(e) => setNovoBairro(e.target.value)}
                  placeholder="Digite um bairro personalizado"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={() => {
                    if (novoBairro.trim()) {
                      // Criar um ID único baseado no nome do bairro
                      const newValue = `bairro-custom-${Date.now()}`;
                      
                      // Adicionar o novo bairro à lista e também selecioná-lo automaticamente
                      setBairrosDisponiveis([
                        ...bairrosDisponiveis, 
                        { value: newValue, label: novoBairro.trim() }
                      ]);
                      setBairrosSelecionados([...bairrosSelecionados, newValue]);
                      setNovoBairro(""); // Limpar o campo após adicionar
                    }
                  }}
                  variant="outline"
                  size="sm"
                  disabled={!novoBairro.trim()}
                >
                  Adicionar
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 max-h-60 overflow-y-auto pr-2">
                {bairrosDisponiveis.map((bairro) => (
                  <div key={bairro.value} className="flex items-start space-x-2">
                    <Checkbox
                      id={`bairro-${bairro.value}`}
                      checked={bairrosSelecionados.includes(bairro.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setBairrosSelecionados([...bairrosSelecionados, bairro.value]);
                        } else {
                          setBairrosSelecionados(
                            bairrosSelecionados.filter((value) => value !== bairro.value)
                          );
                        }
                      }}
                    />
                    <Label
                      htmlFor={`bairro-${bairro.value}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {bairro.label}
                    </Label>
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground">
                Selecione bairros existentes ou adicione novos conforme sua preferência.
              </p>
            </div>
          </div>
        );
        
      case "trabalho":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Onde você trabalha? (Endereço ou bairro)</Label>
              <Input
                type="text"
                value={localTrabalho}
                onChange={(e) => setLocalTrabalho(e.target.value)}
                placeholder="Digite o endereço ou bairro do seu trabalho"
              />
              <p className="text-sm text-muted-foreground">Essa informação nos ajuda a encontrar imóveis próximos ao seu local de trabalho.</p>
            </div>
          </div>
        );
      
      case "escola":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Onde seus filhos estudam? (Colégio ou bairro)</Label>
              <Input
                type="text"
                value={localEscola}
                onChange={(e) => setLocalEscola(e.target.value)}
                placeholder="Digite o nome do colégio ou bairro"
              />
              <p className="text-sm text-muted-foreground">Opcional: essa informação nos ajuda a encontrar imóveis próximos à escola.</p>
            </div>
          </div>
        );
        
      default:
        return <div>Campo não encontrado</div>;
    }
  };
  
  // Renderização principal do componente
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      {/* Barra de progresso */}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-8">
        <div 
          className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-300"
          style={{ width: "75%" }}
        />
      </div>
      
      {/* Formulário por etapas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="space-y-8"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Suas Preferências de Localização</CardTitle>
                <CardDescription>
                  {`Etapa ${etapaAtual + 1} de ${etapas.length}: ${etapas[etapaAtual].titulo}`}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs">
                Preferências
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-10 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
                <p className="text-muted-foreground">Processando suas preferências...</p>
              </div>
            ) : (
              renderizarCampo()
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6">
            <Button variant="outline" onClick={voltar} disabled={etapaAtual === 0 && passoAtual === 0 || loading}>
              Voltar
            </Button>
            <Button onClick={avancar} disabled={!podeProsseguir() || loading}>
              {etapaAtual === etapas.length - 1 && 
               passoAtual === etapas[etapaAtual].campos.length - 1 
                ? "Finalizar" : "Próximo"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
