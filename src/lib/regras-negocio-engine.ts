import { prisma } from "@/lib/prisma";

export interface RegraNegocio {
  id: string;
  nome: string;
  descricao?: string;
  tipo: 'ENTRADA' | 'FINANCIAMENTO' | 'RENDA' | 'ENCERRAMENTO';
  ativa: boolean;
  condicao: any;
  acao: 'CONTINUAR' | 'ENCERRAR' | 'CRIAR_PERGUNTA' | 'OCULTAR_PERGUNTA';
  valorMinimo?: number;
  valorMaximo?: number;
  percentualMinimo?: number;
  percentualMaximo?: number;
  taxaJuros?: number;
  taxaAprovacao?: number;
  custoAdicionalITBI?: number;
  custoEscrituraReg?: number;
  taxaAvaliacaoImovel?: number;
  custoSegurosTaxas?: number;
  mensagemEncerramento?: string;
  perguntasCriar?: any;
  perguntasOcultar?: string[];
  ordem: number;
}

export interface RespostasUsuario {
  [perguntaId: string]: string;
}

export interface ResultadoRegra {
  regra: RegraNegocio;
  ativada: boolean;
  acao: 'CONTINUAR' | 'ENCERRAR' | 'CRIAR_PERGUNTA' | 'OCULTAR_PERGUNTA';
  dados?: {
    mensagem?: string;
    perguntasParaCriar?: any[];
    perguntasParaOcultar?: string[];
    calculosFinanceiros?: CalculosFinanciamento;
  };
}

export interface CalculosFinanciamento {
  valorImovel: number;
  valorEntrada: number;
  valorFinanciamento: number;
  parcela: number;
  custoTotal: number;
  custoITBI: number;
  custoEscritura: number;
  custoAvaliacao: number;
  custoSeguros: number;
  aprovado: boolean;
  compatibilidadeRenda: number; // Percentual da renda comprometido
  observacoes: string[];
}

export class RegrasNegocioEngine {
  private regras: RegraNegocio[] = [];

  constructor() {}

  async carregarRegras(): Promise<void> {
    try {
      this.regras = await prisma.regraNegocio.findMany({
        where: { ativa: true },
        orderBy: { ordem: 'asc' }
      });
    } catch (error) {
      console.error('Erro ao carregar regras de negócio:', error);
      this.regras = [];
    }
  }

  async processarRegras(respostas: RespostasUsuario): Promise<ResultadoRegra[]> {
    await this.carregarRegras();
    const resultados: ResultadoRegra[] = [];

    for (const regra of this.regras) {
      const resultado = await this.avaliarRegra(regra, respostas);
      resultados.push(resultado);

      // Se a regra resulta em encerramento, pare o processamento
      if (resultado.ativada && resultado.acao === 'ENCERRAR') {
        break;
      }
    }

    return resultados;
  }

  private async avaliarRegra(regra: RegraNegocio, respostas: RespostasUsuario): Promise<ResultadoRegra> {
    let ativada = false;
    const dados: any = {};

    switch (regra.tipo) {
      case 'ENTRADA':
        ativada = await this.avaliarRegraEntrada(regra, respostas, dados);
        break;
      case 'FINANCIAMENTO':
        ativada = await this.avaliarRegraFinanciamento(regra, respostas, dados);
        break;
      case 'RENDA':
        ativada = await this.avaliarRegraRenda(regra, respostas, dados);
        break;
      case 'ENCERRAMENTO':
        ativada = await this.avaliarRegraEncerramento(regra, respostas, dados);
        break;
    }

    return {
      regra,
      ativada,
      acao: regra.acao,
      dados: ativada ? dados : undefined
    };
  }

  private async avaliarRegraEntrada(regra: RegraNegocio, respostas: RespostasUsuario, dados: any): Promise<boolean> {
    // Procurar resposta sobre valor de entrada
    const valorEntradaStr = this.buscarResposta(respostas, ['entrada', 'valor_entrada', 'recursos']);
    if (!valorEntradaStr) return false;

    const valorEntrada = this.extrairValor(valorEntradaStr);
    if (valorEntrada === 0) return false;

    // Verificar se está dentro dos limites
    const dentroDoLimite = (
      (!regra.valorMinimo || valorEntrada >= regra.valorMinimo) &&
      (!regra.valorMaximo || valorEntrada <= regra.valorMaximo)
    );

    if (!dentroDoLimite && regra.acao === 'ENCERRAR') {
      dados.mensagem = regra.mensagemEncerramento || 
        `Valor de entrada de ${this.formatarMoeda(valorEntrada)} está fora dos limites aceitos.`;
      return true;
    }

    return !dentroDoLimite;
  }

  private async avaliarRegraFinanciamento(regra: RegraNegocio, respostas: RespostasUsuario, dados: any): Promise<boolean> {
    const valorImovelStr = this.buscarResposta(respostas, ['valor_imovel', 'preco']);
    const valorEntradaStr = this.buscarResposta(respostas, ['entrada', 'valor_entrada']);
    const rendaStr = this.buscarResposta(respostas, ['renda', 'salario', 'renda_familiar']);

    if (!valorImovelStr || !valorEntradaStr || !rendaStr) return false;

    const valorImovel = this.extrairValor(valorImovelStr);
    const valorEntrada = this.extrairValor(valorEntradaStr);
    const renda = this.extrairValor(rendaStr);

    if (valorImovel === 0 || valorEntrada === 0 || renda === 0) return false;

    // Calcular financiamento
    const calculos = this.calcularFinanciamento(valorImovel, valorEntrada, renda, regra);
    dados.calculosFinanceiros = calculos;

    return !calculos.aprovado;
  }

  private async avaliarRegraRenda(regra: RegraNegocio, respostas: RespostasUsuario, dados: any): Promise<boolean> {
    const rendaStr = this.buscarResposta(respostas, ['renda', 'salario', 'renda_familiar']);
    const valorImovelStr = this.buscarResposta(respostas, ['valor_imovel', 'preco']);

    if (!rendaStr || !valorImovelStr) return false;

    const renda = this.extrairValor(rendaStr);
    const valorImovel = this.extrairValor(valorImovelStr);

    if (renda === 0 || valorImovel === 0) return false;

    // Estimar parcela (aproximada para análise rápida)
    const parcela = valorImovel * 0.007; // Aproximadamente 0.7% do valor do imóvel
    const percentualRenda = (parcela / renda) * 100;

    const limitarPerguntas = percentualRenda > (regra.percentualMaximo || 30);

    if (limitarPerguntas && regra.acao === 'OCULTAR_PERGUNTA') {
      dados.perguntasParaOcultar = regra.perguntasOcultar || [];
      dados.mensagem = `Renda comprometida em ${percentualRenda.toFixed(1)}%. Algumas perguntas foram ocultadas.`;
      return true;
    }

    return limitarPerguntas;
  }

  private async avaliarRegraEncerramento(regra: RegraNegocio, respostas: RespostasUsuario, dados: any): Promise<boolean> {
    // Lógica personalizada baseada na condição da regra
    const condicoes = regra.condicao || {};
    
    // Exemplo: encerrar se o usuário não tem interesse em financiamento
    const interesseFinanciamento = this.buscarResposta(respostas, ['financiamento', 'interesse_financiamento']);
    if (interesseFinanciamento?.toLowerCase().includes('não') || interesseFinanciamento?.toLowerCase().includes('nao')) {
      dados.mensagem = regra.mensagemEncerramento || 'Formulário encerrado conforme suas preferências.';
      return true;
    }

    return false;
  }

  private calcularFinanciamento(valorImovel: number, valorEntrada: number, renda: number, regra: RegraNegocio): CalculosFinanciamento {
    const valorFinanciamento = valorImovel - valorEntrada;
    const percentualEntrada = (valorEntrada / valorImovel) * 100;
    
    // Custos adicionais
    const custoITBI = valorImovel * (regra.custoAdicionalITBI || 0.03);
    const custoEscritura = valorImovel * (regra.custoEscrituraReg || 0.015);
    const custoAvaliacao = regra.taxaAvaliacaoImovel || 2500;
    const custoSeguros = regra.custoSegurosTaxas || 15000;
    const custoTotal = custoITBI + custoEscritura + custoAvaliacao + custoSeguros;

    // Calcular parcela (Sistema Price - aproximação)
    const taxaMensal = (regra.taxaJuros || 0.08) / 12;
    const numeroMeses = 360; // 30 anos
    const parcela = valorFinanciamento * (taxaMensal * Math.pow(1 + taxaMensal, numeroMeses)) / 
                   (Math.pow(1 + taxaMensal, numeroMeses) - 1);

    const compatibilidadeRenda = (parcela / renda) * 100;
    
    const observacoes: string[] = [];
    let aprovado = true;

    // Verificar critérios de aprovação
    if (percentualEntrada < (regra.percentualMinimo || 20)) {
      aprovado = false;
      observacoes.push(`Entrada mínima de ${regra.percentualMinimo || 20}% não atingida`);
    }

    if (percentualEntrada > (regra.percentualMaximo || 80)) {
      observacoes.push('Entrada acima do limite máximo financiável');
    }

    if (compatibilidadeRenda > 30) {
      aprovado = false;
      observacoes.push('Comprometimento de renda acima de 30%');
    }

    // Score de aprovação baseado em múltiplos fatores
    const scoreAprovacao = this.calcularScoreAprovacao(percentualEntrada, compatibilidadeRenda, renda);
    if (scoreAprovacao < (regra.taxaAprovacao || 0.7)) {
      aprovado = false;
      observacoes.push('Score de aprovação insuficiente');
    }

    return {
      valorImovel,
      valorEntrada,
      valorFinanciamento,
      parcela,
      custoTotal,
      custoITBI,
      custoEscritura,
      custoAvaliacao,
      custoSeguros,
      aprovado,
      compatibilidadeRenda,
      observacoes
    };
  }

  private calcularScoreAprovacao(percentualEntrada: number, compatibilidadeRenda: number, renda: number): number {
    let score = 0.5; // Score base

    // Bonus por entrada alta
    if (percentualEntrada >= 30) score += 0.2;
    else if (percentualEntrada >= 20) score += 0.1;

    // Bonus por baixo comprometimento de renda
    if (compatibilidadeRenda <= 20) score += 0.2;
    else if (compatibilidadeRenda <= 25) score += 0.1;

    // Bonus por renda alta
    if (renda >= 15000) score += 0.1;
    else if (renda >= 8000) score += 0.05;

    return Math.min(score, 1.0);
  }

  private buscarResposta(respostas: RespostasUsuario, chaves: string[]): string | null {
    for (const [perguntaId, resposta] of Object.entries(respostas)) {
      for (const chave of chaves) {
        if (perguntaId.toLowerCase().includes(chave.toLowerCase()) || 
            resposta.toLowerCase().includes(chave.toLowerCase())) {
          return resposta;
        }
      }
    }
    return null;
  }

  private extrairValor(texto: string): number {
    // Extrair valores monetários do texto
    const numeroLimpo = texto.replace(/[^\d.,]/g, '').replace(',', '.');
    const valor = parseFloat(numeroLimpo);
    return isNaN(valor) ? 0 : valor;
  }

  private formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }
}

// Instância singleton
export const regrasEngine = new RegrasNegocioEngine();
