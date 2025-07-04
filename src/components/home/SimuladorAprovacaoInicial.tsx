import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle, CheckCircle, AlertTriangle, ThumbsUp, ThumbsDown, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface SimuladorAprovacaoInicialProps {
  onContinuar: (simulacaoData: {
    aprovado: boolean;
    rendaMensal: number;
    valorImovel: number;
    entradaDisponivel: number;
    valorParcelaMaxima: number;
    temOutrosEmprestimos: boolean | null;
    score: number | null;
  }) => void;
}

export const SimuladorAprovacaoInicial = ({ 
  onContinuar
}: SimuladorAprovacaoInicialProps) => {
  // Estados para controle dos campos
  const [rendaMensal, setRendaMensal] = useState<number>(3000);
  const [valorImovel, setValorImovel] = useState<number>(300000);
  const [entradaDisponivel, setEntradaDisponivel] = useState<number>(30000);
  const [valorParcelaMaxima, setValorParcelaMaxima] = useState<number>(1000);
  const [temOutrosEmprestimos, setTemOutrosEmprestimos] = useState<boolean | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [resultadoVisivel, setResultadoVisivel] = useState<boolean>(false);
  const [isAprovado, setIsAprovado] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aceitouTermos, setAceitouTermos] = useState<boolean>(false);

  // Calcular capacidade de pagamento e porcentagem da entrada
  const porcentagemEntrada = (entradaDisponivel / valorImovel) * 100;
  const comprometimentoRenda = (valorParcelaMaxima / rendaMensal) * 100;
  const valorFinanciamento = valorImovel - entradaDisponivel;
  

  
  const getFeedbackEntrada = () => {
    if (porcentagemEntrada < 5) {
      return {
        icon: <ThumbsDown className="h-4 w-4 text-red-500" />,
        message: "Entrada muito baixa. Para imóveis de luxo, é necessário pelo menos 30% de entrada.",
        color: "bg-red-100 text-red-800 border-red-200"
      };
    } else if (porcentagemEntrada < 10) {
      return {
        icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
        message: "Entrada abaixo do recomendado. Para imóveis de luxo, bancos exigem entradas a partir de 30%.",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200"
      };
    } else if (porcentagemEntrada < 20) {
      return {
        icon: <ThumbsUp className="h-4 w-4 text-green-500" />,
        message: "Entrada razoável. Você pode conseguir financiamento, mas considere aumentar se possível.",
        color: "bg-green-100 text-green-800 border-green-200"
      };
    } else if (porcentagemEntrada < 30) {
      return {
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        message: "Ótima entrada! Isso aumenta suas chances de aprovação e melhora as condições do financiamento.",
        color: "bg-green-100 text-green-800 border-green-200"
      };
    } else {
      return {
        icon: <CheckCircle className="h-4 w-4 text-blue-500" />,
        message: "Excelente entrada! Você terá as melhores condições de financiamento disponíveis.",
        color: "bg-blue-100 text-blue-800 border-blue-200"
      };
    }
  };
  
  const getFeedbackRendaMensal = () => {
    const rendaNecessaria = (valorFinanciamento / 30) / 0.3; // Cálculo aproximado da renda necessária (30 anos, 30% da renda)
    
    if (rendaMensal < 2000) {
      return {
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
        message: "Renda abaixo do recomendado para este simulador. Pode ser difícil conseguir financiamento.",
        color: "bg-red-100 text-red-800 border-red-200"
      };
    } else if (rendaMensal < rendaNecessaria * 0.7) {
      return {
        icon: <ThumbsDown className="h-4 w-4 text-red-500" />,
        message: `Sua renda é insuficiente para o imóvel selecionado. Considere um imóvel mais acessível ou aumente sua entrada.`,
        color: "bg-red-100 text-red-800 border-red-200"
      };
    } else if (rendaMensal < rendaNecessaria) {
      return {
        icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
        message: `Sua renda está próxima do necessário, mas pode enfrentar restrições. Considere aumentar a entrada.`,
        color: "bg-yellow-100 text-yellow-800 border-yellow-200"
      };
    } else if (rendaMensal < rendaNecessaria * 1.5) {
      return {
        icon: <ThumbsUp className="h-4 w-4 text-green-500" />,
        message: `Boa renda para o imóvel selecionado. Você tem boas chances de aprovação.`,
        color: "bg-green-100 text-green-800 border-green-200"
      };
    } else {
      return {
        icon: <CheckCircle className="h-4 w-4 text-blue-500" />,
        message: `Excelente renda para o imóvel desejado. Você tem ótimas chances de aprovação.`,
        color: "bg-blue-100 text-blue-800 border-blue-200"
      };
    }
  };
  
  const getFeedbackParcela = () => {
    if (comprometimentoRenda > 40) {
      return {
        icon: <ThumbsDown className="h-4 w-4 text-red-500" />,
        message: `Comprometimento muito alto (${comprometimentoRenda.toFixed(1)}%). Bancos geralmente limitam a 30% da renda.`,
        color: "bg-red-100 text-red-800 border-red-200"
      };
    } else if (comprometimentoRenda > 30) {
      return {
        icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
        message: `Comprometimento alto (${comprometimentoRenda.toFixed(1)}%). Considere uma parcela menor para aumentar chances de aprovação.`,
        color: "bg-yellow-100 text-yellow-800 border-yellow-200"
      };
    } else if (comprometimentoRenda > 20) {
      return {
        icon: <ThumbsUp className="h-4 w-4 text-green-500" />,
        message: `Bom comprometimento (${comprometimentoRenda.toFixed(1)}%). Dentro do limite aceito pelos bancos.`,
        color: "bg-green-100 text-green-800 border-green-200"
      };
    } else {
      return {
        icon: <CheckCircle className="h-4 w-4 text-blue-500" />,
        message: `Excelente comprometimento (${comprometimentoRenda.toFixed(1)}%). Muito confortável para seu orçamento.`,
        color: "bg-blue-100 text-blue-800 border-blue-200"
      };
    }
  };
  
  // Feedback para cada slider
  const feedbackEntrada = getFeedbackEntrada();
  const feedbackRendaMensal = getFeedbackRendaMensal();
  const feedbackParcela = getFeedbackParcela();
  
  // Simular cálculo da aprovação
  const calcularAprovacao = () => {
    setIsLoading(true);
    
    // Simular chamada a uma API de aprovação
    setTimeout(() => {
      // Critérios de aprovação conforme padrões do mercado imobiliário para imóveis de luxo
      const aprovadoEntrada = porcentagemEntrada >= 30; // Entrada mínima de 30% para imóveis de luxo
      const aprovadoRenda = comprometimentoRenda <= 30; // Máximo 30% da renda comprometida
      const aprovadoOutrosEmprestimos = temOutrosEmprestimos === false; // Preferencialmente sem outros empréstimos
      
      // Calcular pontuação baseada nos critérios (0-100)
      let pontuacao = 0;
      
      // Entrada tem peso maior e exige no mínimo 30% (regra mais rígida para imóveis de luxo)
      pontuacao += aprovadoEntrada ? 40 : 0; // Sem pontos parciais para entrada menor que 30%
      pontuacao += aprovadoRenda ? 40 : (comprometimentoRenda <= 40 ? 20 : 0);
      pontuacao += aprovadoOutrosEmprestimos ? 20 : 0; // Sem outros empréstimos é essencial
      
      setScore(pontuacao);
      
      // Regra mais rígida: Aprovado apenas se pontuação >= 60 E entrada >= 30%
      setIsAprovado(pontuacao >= 60 && aprovadoEntrada);
      setResultadoVisivel(true);
      setIsLoading(false);
    }, 1500);
  };

  // Limpar resultado quando os inputs mudam significativamente
  useEffect(() => {
    if (resultadoVisivel) {
      setResultadoVisivel(false);
    }
  }, [rendaMensal, valorImovel, entradaDisponivel, valorParcelaMaxima, temOutrosEmprestimos]);

  // Função para continuar após o resultado
  const handleContinuar = () => {
    onContinuar({
      aprovado: isAprovado,
      rendaMensal,
      valorImovel,
      entradaDisponivel,
      valorParcelaMaxima,
      temOutrosEmprestimos,
      score
    });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader className="bg-[#fe4f17] text-white">
        <CardTitle className="text-2xl font-bold">Simulador Rápido de Crédito</CardTitle>
        <CardDescription className="text-white/90">
          Verifique sua capacidade de financiamento em menos de 1 minuto
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Valor do Imóvel */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label htmlFor="valorImovel" className="text-lg font-medium">
              Valor do Imóvel
            </Label>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">R$</span>
            <Input
              id="valorImovel"
              type="text"
              className="pl-10 text-lg font-bold"
              placeholder="Digite o valor do imóvel"
              value={valorImovel === 0 ? '' : valorImovel.toLocaleString('pt-BR')}
              onChange={(e) => {
                // Obter apenas os dígitos do valor digitado
                const digitsOnly = e.target.value.replace(/\D/g, '');
                
                // Converter para número
                let numValue = parseInt(digitsOnly, 10) || 0;
                
                // Verificar limites apenas ao perder o foco
                setValorImovel(numValue);
              }}
              onBlur={() => {
                // Aplicar limites apenas ao perder o foco
                if (valorImovel < 100000) {
                  setValorImovel(100000);
                } else if (valorImovel > 50000000) {
                  setValorImovel(50000000);
                }
              }}
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Mínimo: R$ 100 mil</span>
            <span>Máximo: R$ 50 milhões</span>
          </div>
          
       
        </div>

        {/* Entrada Disponível */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label htmlFor="entradaDisponivel" className="text-lg font-medium">
              Entrada Disponível
            </Label>
            <div className="text-right">
              <span className="font-bold text-lg text-[#fe4f17]">
                {formatCurrency(entradaDisponivel)}
              </span>
              <p className="text-sm text-muted-foreground">
                {porcentagemEntrada.toFixed(1)}% do valor do imóvel
              </p>
            </div>
          </div>
          <Slider
            id="entradaDisponivel"
            min={0}
            max={valorImovel}
            step={5000}
            value={[entradaDisponivel]}
            onValueChange={(value) => setEntradaDisponivel(value[0])}
            className="py-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Sem entrada</span>
            <span>100% do valor</span>
          </div>
          
          <div className={`mt-2 flex items-center gap-2 rounded-lg border p-3 ${feedbackEntrada.color}`}>
            {feedbackEntrada.icon}
            <span className="text-sm">{feedbackEntrada.message}</span>
          </div>
        </div>

        {/* Renda Mensal */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label htmlFor="rendaMensal" className="text-lg font-medium">
            Renda Mensal (familiar)
            </Label>
            <span className="font-bold text-lg text-[#fe4f17]">
              {formatCurrency(rendaMensal)}
            </span>
          </div>
          <Slider
            id="rendaMensal"
            min={1000}
            max={300000}
            step={500}
            value={[rendaMensal]}
            onValueChange={(value) => setRendaMensal(value[0])}
            className="py-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>R$ 1 mil</span>
            <span>R$ 300 mil</span>
          </div>
          
          <div className={`mt-2 flex items-center gap-2 rounded-lg border p-3 ${feedbackRendaMensal.color}`}>
            {feedbackRendaMensal.icon}
            <span className="text-sm">{feedbackRendaMensal.message}</span>
          </div>
        </div>

        {/* Valor da Parcela Máxima */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label htmlFor="valorParcelaMaxima" className="text-lg font-medium">
              Valor da Parcela Máxima
            </Label>
            <div className="text-right">
              <span className="font-bold text-lg text-[#fe4f17]">
                {formatCurrency(valorParcelaMaxima)}
              </span>
              <p className="text-sm text-muted-foreground">
                {comprometimentoRenda.toFixed(1)}% da sua renda
              </p>
            </div>
          </div>
          <Slider
            id="valorParcelaMaxima"
            min={300}
            max={rendaMensal * 0.5}
            step={100}
            value={[valorParcelaMaxima]}
            onValueChange={(value) => setValorParcelaMaxima(value[0])}
            className="py-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>R$ 300</span>
            <span>50% da renda</span>
          </div>
          
          <div className={`mt-2 flex items-center gap-2 rounded-lg border p-3 ${feedbackParcela.color}`}>
            {feedbackParcela.icon}
            <span className="text-sm">{feedbackParcela.message}</span>
          </div>
        </div>

        {/* Outros Empréstimos */}
        <div className="space-y-3">
          <Label className="text-lg font-medium">
            Você possui outros financiamentos ou empréstimos?
          </Label>
          <div className="flex gap-4">
            <Button 
              variant={temOutrosEmprestimos === true ? "default" : "outline"} 
              className={temOutrosEmprestimos === true ? "bg-[#fe4f17] hover:bg-[#fe4f17]/90" : ""}
              onClick={() => setTemOutrosEmprestimos(true)}
            >
              Sim, possuo
            </Button>
            <Button 
              variant={temOutrosEmprestimos === false ? "default" : "outline"}
              className={temOutrosEmprestimos === false ? "bg-[#fe4f17] hover:bg-[#fe4f17]/90" : ""}
              onClick={() => setTemOutrosEmprestimos(false)}
            >
              Não possuo
            </Button>
          </div>
        </div>

        {/* Resumo */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Resumo da Simulação</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Valor a Financiar</p>
              <p className="font-bold">{formatCurrency(valorFinanciamento)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Entrada</p>
              <p className="font-bold">{formatCurrency(entradaDisponivel)} ({porcentagemEntrada.toFixed(1)}%)</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Parcela Máxima</p>
              <p className="font-bold">{formatCurrency(valorParcelaMaxima)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Comprometimento</p>
              <p className="font-bold">{comprometimentoRenda.toFixed(1)}% da renda</p>
            </div>
          </div>
          
          {/* Alerta sobre custos adicionais */}
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="text-sm font-semibold text-amber-800 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> 
              Atenção aos custos adicionais
            </h4>
            <p className="text-xs text-amber-700 mt-1">
              Além da entrada de {formatCurrency(entradaDisponivel)}, você precisará dispor de valores adicionais para:
            </p>
            <ul className="text-xs text-amber-700 mt-1 list-disc pl-4 space-y-1">
              <li>ITBI: ~3% do valor do imóvel ({formatCurrency(valorImovel * 0.03)})</li>
              <li>Escritura e Registro: ~1-2% do valor do imóvel ({formatCurrency(valorImovel * 0.015)})</li>
              <li>Taxa de avaliação do imóvel: ~R$ 2.500,00</li>
              <li>Seguros e taxas bancárias</li>
            </ul>
            <p className="text-xs font-semibold text-amber-800 mt-2">
              Valor aproximado adicional: {formatCurrency(valorImovel * 0.05)} (cerca de 5% do valor do imóvel)
            </p>
          </div>
        </div>

        <Button 
          onClick={calcularAprovacao} 
          disabled={isLoading || temOutrosEmprestimos === null}
          className="w-full bg-[#fe4f17] hover:bg-[#fe4f17]/90 text-white py-6 text-lg"
        >
          {isLoading ? "Analisando sua situação..." : "Verificar Aprovação"}
        </Button>
      </CardContent>

      <AnimatePresence>
        {resultadoVisivel && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="px-6 pb-6"
          >
            <Card className={`border-2 ${isAprovado ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
              <CardContent className="p-6 flex items-start gap-4">
                {isAprovado ? (
                  <CheckCircle className="h-10 w-10 text-green-500 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-10 w-10 text-red-500 flex-shrink-0" />
                )}
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    {isAprovado ? 'Pré-aprovado!' : 'Não aprovado neste momento'}
                  </h3>
                  <p className="text-sm mb-3">
                    {isAprovado 
                      ? 'Parabéns! Com base nos dados informados, você tem boas chances de aprovação. Prossiga para a simulação completa.' 
                      : 'Com base nos dados informados, você pode enfrentar dificuldades para aprovação. Considere aumentar a entrada ou ajustar o valor da parcela.'}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${isAprovado ? 'bg-green-500' : 'bg-[#fe4f17]'}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="font-bold">{score}/100</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      {porcentagemEntrada >= 30 ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span>Entrada {porcentagemEntrada >= 30 ? 'adequada' : 'insuficiente'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {comprometimentoRenda <= 30 ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span>Comprometimento {comprometimentoRenda <= 30 ? 'adequado' : 'elevado'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {!temOutrosEmprestimos ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-[#fe4f17]" />
                      )}
                      <span>{!temOutrosEmprestimos ? 'Sem outros empréstimos' : 'Outros empréstimos'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-6 pb-6 pt-0">
                <Button 
                  onClick={handleContinuar}
                  className={`w-full ${isAprovado ? 'bg-green-500 hover:bg-green-600' : 'bg-[#fe4f17] hover:bg-[#fe4f17]/90'}`}
                >
                  {isAprovado ? 'Continuar para Simulação Completa' : 'Ver Opções de Simulação'}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default SimuladorAprovacaoInicial;
