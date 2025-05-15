"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pergunta } from "@/services/pergunta-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
  ChevronRight, 
  ChevronLeft, 
  Sparkles,
  Check, 
  X,
  AlertCircle
} from "lucide-react";

interface FormularioPerguntasProps {
  onComplete: (respostas: Record<string, any>) => void;
  onProgress: (progress: number) => void;
  onPerguntaRespondida: (perguntaId: string, resposta: any) => void;
}

export const FormularioPerguntas = ({ 
  onComplete, 
  onProgress,
  onPerguntaRespondida
}: FormularioPerguntasProps) => {
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [perguntasFiltradas, setPerguntasFiltradas] = useState<Pergunta[]>([]);
  const [categoriaAtual, setCategoriaAtual] = useState("CADASTRO");
  const [indicePergunta, setIndicePergunta] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [progressoTotal, setProgressoTotal] = useState(0);
  
  // Para pré-qualificação
  const [preQualificado, setPreQualificado] = useState<boolean | null>(null);
  const [etapaAtual, setEtapaAtual] = useState<"PRE_QUALIFICACAO" | "QUESTIONARIO_COMPLETO">("PRE_QUALIFICACAO");
  
  // Carregar todas as perguntas
  useEffect(() => {
    const buscarPerguntas = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/perguntas");
        if (!response.ok) {
          throw new Error("Erro ao carregar perguntas");
        }
        
        const data = await response.json();
        setPerguntas(data);
        
        // Iniciar com perguntas de CADASTRO
        const perguntasInicio = data.filter((p: Pergunta) => 
          p.categoria === "CADASTRO" && p.ativa
        ).sort((a: Pergunta, b: Pergunta) => a.ordem - b.ordem);
        
        setPerguntasFiltradas(perguntasInicio);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar perguntas:", error);
        setErro("Não foi possível carregar as perguntas. Tente novamente mais tarde.");
        setLoading(false);
      }
    };
    
    buscarPerguntas();
  }, []);
  
  // Otimizar fluxo de perguntas com DeepSeek (integração real)
  useEffect(() => {
    if (Object.keys(respostas).length > 3) { // Após algumas respostas, começar a otimizar
      otimizarFluxoPerguntas();
    }
  }, [respostas]);
  
  // Calcular progresso
  useEffect(() => {
    if (perguntas.length > 0) {
      const totalPerguntas = perguntas.filter(p => p.ativa).length;
      const respondidas = Object.keys(respostas).length;
      const progresso = Math.min(Math.round((respondidas / totalPerguntas) * 100), 100);
      
      setProgressoTotal(progresso);
      onProgress(progresso);
    }
  }, [respostas, perguntas, onProgress]);
  
  // Avançar para próxima pergunta ou categoria
  const avancar = () => {
    if (indicePergunta < perguntasFiltradas.length - 1) {
      setIndicePergunta(indicePergunta + 1);
    } else {
      // Verificar se é o fim da categoria
      const todasCategorias = [...new Set(perguntas.map(p => p.categoria))];
      const indiceCategoriaAtual = todasCategorias.indexOf(categoriaAtual);
      
      if (etapaAtual === "PRE_QUALIFICACAO") {
        // Verificar se o usuário está pré-qualificado
        const avaliacaoPreQualificacao = verificarPreQualificacao();
        setPreQualificado(avaliacaoPreQualificacao);
        
        if (avaliacaoPreQualificacao) {
          setEtapaAtual("QUESTIONARIO_COMPLETO");
          
          // Aqui vamos continuar com TODAS as categorias, não apenas PREFERENCIAS
          // Isso vai permitir que o usuário veja mais perguntas
          const proximaCategoria = "PREFERENCIAS";
          setCategoriaAtual(proximaCategoria);
          
          // Carregar TODAS as perguntas da próxima categoria
          const perguntasProximaCategoria = perguntas.filter(
            p => p.categoria === proximaCategoria && p.ativa
          ).sort((a, b) => a.ordem - b.ordem);
          
          setPerguntasFiltradas(perguntasProximaCategoria);
          setIndicePergunta(0);
          
          // Aviso que mais perguntas serão carregadas
          console.log(`Carregadas ${perguntasProximaCategoria.length} perguntas da categoria ${proximaCategoria}`);
        }
        // Se não estiver qualificado, o formulário termina aqui
        else {
          onComplete(respostas);
        }
      } 
      else if (indiceCategoriaAtual < todasCategorias.length - 1) {
        // Avançar para a próxima categoria
        const proximaCategoria = todasCategorias[indiceCategoriaAtual + 1];
        setCategoriaAtual(proximaCategoria);
        
        // Carregar TODAS as perguntas da próxima categoria
        const perguntasProximaCategoria = perguntas.filter(
          p => p.categoria === proximaCategoria && p.ativa
        ).sort((a, b) => a.ordem - b.ordem);
        
        setPerguntasFiltradas(perguntasProximaCategoria);
        setIndicePergunta(0);
        
        // Aviso que mais perguntas serão carregadas
        console.log(`Avançando para categoria ${proximaCategoria} com ${perguntasProximaCategoria.length} perguntas`);
        
        // Se tivermos poucas perguntas, já preparar a próxima chamada de otimização
        if (perguntasProximaCategoria.length > 0) {
          setTimeout(() => {
            otimizarFluxoPerguntas();
          }, 1000);
        }
      } else {
        // Fim do questionário
        onComplete(respostas);
      }
    }
  };
  
  // Voltar para pergunta anterior
  const voltar = () => {
    if (indicePergunta > 0) {
      setIndicePergunta(indicePergunta - 1);
    } else {
      // Voltar para categoria anterior
      const todasCategorias = [...new Set(perguntas.map(p => p.categoria))];
      const indiceCategoriaAtual = todasCategorias.indexOf(categoriaAtual);
      
      if (indiceCategoriaAtual > 0) {
        const categoriaAnterior = todasCategorias[indiceCategoriaAtual - 1];
        setCategoriaAtual(categoriaAnterior);
        const perguntasCategoriaAnterior = perguntas.filter(
          p => p.categoria === categoriaAnterior && p.ativa
        ).sort((a, b) => a.ordem - b.ordem);
        
        setPerguntasFiltradas(perguntasCategoriaAnterior);
        setIndicePergunta(perguntasCategoriaAnterior.length - 1);
      }
    }
  };
  
  // Responder uma pergunta
  const responderPergunta = (perguntaId: string, resposta: any) => {
    const novasRespostas = { ...respostas, [perguntaId]: resposta };
    setRespostas(novasRespostas);
    onPerguntaRespondida(perguntaId, resposta);
  };
  
  // Otimização do fluxo de perguntas com DeepSeek
  const otimizarFluxoPerguntas = async () => {
    try {
      // Preparar dados para enviar à API DeepSeek
      const todasCategorias = [...new Set(perguntas.map(p => p.categoria))];
      const perguntasRestantes = perguntas.filter(p => !respostas[p.id]);
      
      const requestData = {
        perguntas: perguntasRestantes.map(p => ({
          id: p.id,
          texto: p.texto,
          categoria: p.categoria,
          tipo: p.tipo,
          ordem: p.ordem,
          pontuacao: p.pontuacao
        })),
        respostas,
        categorias: todasCategorias
      };
      
      // Chamar a API DeepSeek
      const response = await fetch('/api/deepseek', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) throw new Error('Falha na otimização do fluxo');
      
      const data = await response.json();
      
      // Log para depuração
      console.log('Otimização DeepSeek:', data);
      
      // Aplicar recomendações
      if (data.perguntasRelevantes && Array.isArray(data.perguntasRelevantes)) {
        // Filtrar perguntas relevantes para a categoria atual
        const perguntasRelevantes = perguntas
          .filter(p => p.categoria === categoriaAtual && data.perguntasRelevantes.includes(p.id))
          .sort((a, b) => a.ordem - b.ordem);
        
        if (perguntasRelevantes.length > 0) {
          setPerguntasFiltradas(perguntasRelevantes);
          // Manter o índice da pergunta atual ou resetar se necessário
          setIndicePergunta(prev => prev >= perguntasRelevantes.length ? 0 : prev);
        }
        
        // Se a IA recomendou mudar de categoria
        if (data.proximaCategoria && data.proximaCategoria !== categoriaAtual) {
          // Preparar para mudar para próxima categoria quando terminar as perguntas atuais
          console.log(`IA recomendou mudar para categoria: ${data.proximaCategoria}`);
        }
      }
    } catch (error) {
      console.error('Erro na otimização do fluxo:', error);
      // Falha silenciosa, continuamos com as perguntas normais
    }
  };
  
  // Verificar se o usuário está pré-qualificado (temporariamente sempre aprovando)
  const verificarPreQualificacao = (): boolean => {
    // TEMP: Sempre retorna true para mostrar todas as perguntas
    console.log("Usuário pré-qualificado: Bypass implementado para testes");
    return true;
    
    // IMPLEMENTAÇÃO ORIGINAL COMENTADA
    /*
    // Lógica de pré-qualificação - Verificar condições financeiras
    
    // Verificar renda mensal (para fluxo sem aprovação)
    const rendaMensal = respostas['seed-AVALIACAO_CREDITO-10'];
    if (rendaMensal === 'ate_2000') {
      return false; // Renda baixa demais
    }
    
    // Verificar valor disponível para entrada
    const valorEntrada = Number(respostas['seed-INFORMACOES_COMPLEMENTARES-1'] || 0);
    if (valorEntrada < 20000) {
      return false; // Entrada insuficiente
    }
    
    // Verificar se há valor para taxas
    const valorTaxas = Number(respostas['seed-INFORMACOES_COMPLEMENTARES-4'] || 0);
    if (valorTaxas < 10000) {
      return false; // Sem reserva para taxas
    }
    
    return true;
    */
  };
  
  if (loading) {
    return (
      <Card className="w-full max-w-3xl mx-auto p-8">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Carregando perguntas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (erro) {
    return (
      <Card className="w-full max-w-3xl mx-auto p-8">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <p className="text-destructive font-semibold">{erro}</p>
            <Button onClick={() => window.location.reload()}>
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (preQualificado === false) {
    return (
      <Card className="w-full max-w-3xl mx-auto p-8">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Resultado da Pré-qualificação</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-yellow-500" />
            </div>
            <h3 className="text-xl font-semibold">É necessário revisar alguns pontos</h3>
            <p className="text-muted-foreground max-w-md">
              Com base nas suas respostas, identificamos que pode ser necessário
              revisar alguns aspectos financeiros antes de prosseguir com a busca
              por imóveis.
            </p>
            <div className="bg-muted p-4 rounded-lg w-full mt-4 text-left">
              <p className="font-medium mb-2">Recomendações:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Rever o valor disponível para entrada (mínimo recomendado: R$ 20.000)</li>
                <li>Reservar valor para custos de transferência e documentação (aprox. 5,5% do valor do imóvel)</li>
                <li>Considerar imóveis em uma faixa de preço mais adequada ao seu orçamento</li>
              </ul>
            </div>
            <Button className="mt-6" onClick={() => window.location.reload()}>
              Recomeçar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const perguntaAtual = perguntasFiltradas[indicePergunta];
  
  if (!perguntaAtual) {
    return (
      <Card className="w-full max-w-3xl mx-auto p-8">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <p className="text-muted-foreground">Nenhuma pergunta disponível.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Renderizar o campo baseado no tipo da pergunta
  const renderizarCampoPergunta = () => {
    const opcoes = perguntaAtual.opcoes ? 
      (typeof perguntaAtual.opcoes === 'string' ? 
        JSON.parse(perguntaAtual.opcoes) : perguntaAtual.opcoes) : [];
    
    switch (perguntaAtual.tipo) {
      case 'text':
        return (
          <Input
            type="text"
            value={respostas[perguntaAtual.id] || ''}
            onChange={(e) => responderPergunta(perguntaAtual.id, e.target.value)}
            className="w-full"
            placeholder="Digite sua resposta..."
          />
        );
      
      case 'number':
        return (
          <Input
            type="number"
            value={respostas[perguntaAtual.id] || ''}
            onChange={(e) => responderPergunta(perguntaAtual.id, e.target.value)}
            className="w-full"
            placeholder="Digite um número..."
          />
        );
      
      case 'email':
        return (
          <Input
            type="email"
            value={respostas[perguntaAtual.id] || ''}
            onChange={(e) => responderPergunta(perguntaAtual.id, e.target.value)}
            className="w-full"
            placeholder="Digite seu e-mail..."
          />
        );
      
      case 'tel':
        return (
          <Input
            type="tel"
            value={respostas[perguntaAtual.id] || ''}
            onChange={(e) => responderPergunta(perguntaAtual.id, e.target.value)}
            className="w-full"
            placeholder="Digite seu telefone..."
          />
        );
      
      case 'date':
        return (
          <Input
            type="date"
            value={respostas[perguntaAtual.id] || ''}
            onChange={(e) => responderPergunta(perguntaAtual.id, e.target.value)}
            className="w-full"
          />
        );
      
      case 'select':
        return (
          <Select
            value={respostas[perguntaAtual.id] || ''}
            onValueChange={(value) => responderPergunta(perguntaAtual.id, value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              {opcoes.map((opcao: any) => (
                <SelectItem key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'radio':
        return (
          <RadioGroup
            value={respostas[perguntaAtual.id] || ''}
            onValueChange={(value) => responderPergunta(perguntaAtual.id, value)}
            className="space-y-3"
          >
            {opcoes.map((opcao: any) => (
              <div key={opcao.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opcao.value} id={`radio-${opcao.value}`} />
                <Label htmlFor={`radio-${opcao.value}`}>{opcao.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      
      case 'checkbox':
        const checkboxValue = respostas[perguntaAtual.id] || [];
        return (
          <div className="space-y-3">
            {opcoes.map((opcao: any) => (
              <div key={opcao.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`checkbox-${opcao.value}`}
                  checked={checkboxValue.includes(opcao.value)}
                  onCheckedChange={(checked) => {
                    const updatedValues = checked
                      ? [...checkboxValue, opcao.value]
                      : checkboxValue.filter((v: string) => v !== opcao.value);
                    responderPergunta(perguntaAtual.id, updatedValues);
                  }}
                />
                <Label htmlFor={`checkbox-${opcao.value}`}>{opcao.label}</Label>
              </div>
            ))}
          </div>
        );
      
      case 'slider':
        const sliderValue = respostas[perguntaAtual.id] !== undefined
          ? respostas[perguntaAtual.id]
          : opcoes.min || 0;
        
        return (
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>{opcoes.min || 0}</span>
              <span>{opcoes.max || 100}</span>
            </div>
            <Slider
              value={[sliderValue]}
              min={opcoes.min || 0}
              max={opcoes.max || 100}
              step={opcoes.step || 1}
              onValueChange={(value) => responderPergunta(perguntaAtual.id, value[0])}
            />
            <div className="text-center font-medium">
              {sliderValue} {opcoes.unit || ''}
            </div>
          </div>
        );
      
      case 'priority':
        const priorityValue = respostas[perguntaAtual.id] || {};
        
        return (
          <div className="space-y-4">
            {opcoes.map((opcao: any) => (
              <div key={opcao.value} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>{opcao.label}</Label>
                  <Select
                    value={priorityValue[opcao.value] || ''}
                    onValueChange={(value) => {
                      const updatedValues = {
                        ...priorityValue,
                        [opcao.value]: value
                      };
                      responderPergunta(perguntaAtual.id, updatedValues);
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preferivel">Preferível</SelectItem>
                      <SelectItem value="aceitavel">Aceitável</SelectItem>
                      <SelectItem value="impeditivo">Impeditivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        );
      
      default:
        return (
          <Input
            type="text"
            value={respostas[perguntaAtual.id] || ''}
            onChange={(e) => responderPergunta(perguntaAtual.id, e.target.value)}
            className="w-full"
            placeholder="Digite sua resposta..."
          />
        );
    }
  };
  
  // Verificar se a pergunta atual pode ser pulada
  const podeAvancar = () => {
    if (!perguntaAtual.obrigatoria) return true;
    
    const resposta = respostas[perguntaAtual.id];
    if (resposta === undefined || resposta === '') return false;
    if (Array.isArray(resposta) && resposta.length === 0) return false;
    
    return true;
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>
            <Badge variant="outline" className="mr-2">
              {perguntaAtual.categoria}
            </Badge>
            {etapaAtual === "PRE_QUALIFICACAO" ? "Pré-qualificação" : "Questionário"}
          </div>
          <div className="text-sm text-muted-foreground">
            {indicePergunta + 1}/{perguntasFiltradas.length}
          </div>
        </CardTitle>
        <CardDescription>
          Pergunta {perguntaAtual.ordem} - {perguntaAtual.obrigatoria ? "Obrigatória" : "Opcional"}
        </CardDescription>
        <Progress value={progressoTotal} className="h-1" />
      </CardHeader>
      
      <CardContent className="pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={perguntaAtual.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-medium mb-4">
              {perguntaAtual.texto}
            </h3>
            
            {renderizarCampoPergunta()}
            
            {perguntaAtual.tipo === 'priority' && (
              <div className="bg-muted p-3 rounded-md text-sm">
                <p className="font-medium">Legendas:</p>
                <ul className="space-y-1 mt-1">
                  <li className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded-full mr-2" /> Preferível: Você prefere que o imóvel tenha essa característica</li>
                  <li className="flex items-center"><span className="w-3 h-3 bg-yellow-500 rounded-full mr-2" /> Aceitável: Não é um problema se o imóvel não tiver essa característica</li>
                  <li className="flex items-center"><span className="w-3 h-3 bg-red-500 rounded-full mr-2" /> Impeditivo: Você não aceitará imóveis sem essa característica</li>
                </ul>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={voltar}
          disabled={indicePergunta === 0 && categoriaAtual === "CADASTRO"}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>
        
        <Button 
          onClick={avancar}
          disabled={!podeAvancar()}
          className="gap-2 relative overflow-hidden group"
        >
          <div className="absolute inset-0 w-3 bg-white dark:bg-gray-800 opacity-10 transform -skew-x-12 group-hover:animate-shimmer" />
          Próxima
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
