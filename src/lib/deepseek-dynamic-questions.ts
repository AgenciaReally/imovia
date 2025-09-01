import { ResultadoRegra } from "@/lib/regras-negocio-engine";

export interface PerguntaDinamica {
  id: string;
  texto: string;
  tipo: 'TEXT' | 'NUMBER' | 'SELECT' | 'RADIO' | 'TEXTAREA' | 'RANGE';
  opcoes?: string[];
  obrigatoria: boolean;
  categoria: string;
  ordem: number;
  condicaoExibicao?: any;
  geradaPorIA: boolean;
}

export interface ContextoDeepseek {
  respostasExistentes: Record<string, string>;
  etapaAtual: number;
  regrasAplicadas: ResultadoRegra[];
  perfilUsuario?: {
    renda?: number;
    entrada?: number;
    objetivo?: string;
    localizacao?: string;
  };
}

export class DeepseekDynamicQuestions {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || '';
    this.baseURL = 'https://api.deepseek.com/v1';
  }

  async gerarPerguntasDinamicas(
    contexto: ContextoDeepseek,
    tipoRegra: 'FINANCIAMENTO' | 'RENDA' | 'ENTRADA' | 'ENCERRAMENTO'
  ): Promise<PerguntaDinamica[]> {
    if (!this.apiKey) {
      console.warn('🚨 API Key do Deepseek não configurada');
      return [];
    }

    try {
      const prompt = this.construirPrompt(contexto, tipoRegra);
      console.log('🤖 Enviando prompt para Deepseek:', prompt.substring(0, 200) + '...');

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt()
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na API Deepseek: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const perguntasJSON = data.choices[0]?.message?.content;

      if (!perguntasJSON) {
        throw new Error('Resposta vazia do Deepseek');
      }

      // Parsear JSON das perguntas
      const perguntas = this.parsearRespostaDeepseek(perguntasJSON, tipoRegra);
      console.log('✅ Perguntas dinâmicas geradas:', perguntas.length);

      return perguntas;

    } catch (error) {
      console.error('❌ Erro ao gerar perguntas dinâmicas:', error);
      return [];
    }
  }

  private construirPrompt(contexto: ContextoDeepseek, tipoRegra: string): string {
    const { respostasExistentes, etapaAtual, perfilUsuario } = contexto;

    let prompt = `
CONTEXTO DO USUÁRIO:
- Etapa atual: ${etapaAtual}
- Tipo de regra ativada: ${tipoRegra}
- Respostas existentes: ${JSON.stringify(respostasExistentes, null, 2)}
`;

    if (perfilUsuario) {
      prompt += `
PERFIL DO USUÁRIO:
- Renda: ${perfilUsuario.renda ? `R$ ${perfilUsuario.renda.toLocaleString('pt-BR')}` : 'Não informado'}
- Entrada disponível: ${perfilUsuario.entrada ? `R$ ${perfilUsuario.entrada.toLocaleString('pt-BR')}` : 'Não informado'}
- Objetivo: ${perfilUsuario.objetivo || 'Não especificado'}
- Localização preferida: ${perfilUsuario.localizacao || 'Não especificado'}
`;
    }

    switch (tipoRegra) {
      case 'FINANCIAMENTO':
        prompt += `
SITUAÇÃO: O usuário precisa de mais informações sobre financiamento imobiliário.
Baseado nas respostas dele, gere 2-3 perguntas específicas para:
1. Entender melhor sua situação financeira
2. Avaliar sua elegibilidade para financiamento
3. Identificar o melhor tipo de financiamento

FOQUE EM: histórico de crédito, relacionamento bancário, garantias adicionais, prazo desejado.
`;
        break;

      case 'RENDA':
        prompt += `
SITUAÇÃO: O usuário pode ter limitações de renda para o imóvel desejado.
Gere 2-3 perguntas para:
1. Entender fontes adicionais de renda
2. Avaliar estabilidade financeira
3. Explorar opções de co-financiamento

FOQUE EM: renda comprovável, tempo no emprego, outras fontes de renda, gastos mensais.
`;
        break;

      case 'ENTRADA':
        prompt += `
SITUAÇÃO: O usuário pode precisar de orientações sobre entrada do imóvel.
Gere 2-3 perguntas para:
1. Explorar opções de recursos para entrada
2. Avaliar cronograma de aquisição
3. Identificar alternativas criativas

FOQUE EM: FGTS, investimentos, venda de bens, prazo para compra, parcelamento da entrada.
`;
        break;

      default:
        prompt += `
SITUAÇÃO: Gere perguntas relevantes baseadas no contexto atual do usuário.
`;
    }

    prompt += `
INSTRUÇÕES IMPORTANTES:
1. Gere APENAS 2-3 perguntas muito específicas e relevantes
2. Use linguagem simples e direta
3. Evite perguntas já respondidas
4. Seja empático e consultivo
5. Retorne APENAS um JSON válido no formato especificado

FORMATO DE RESPOSTA (JSON):
{
  "perguntas": [
    {
      "texto": "Pergunta específica aqui?",
      "tipo": "TEXT|NUMBER|SELECT|RADIO|TEXTAREA",
      "opcoes": ["opção1", "opção2"] // apenas se tipo for SELECT ou RADIO
      "obrigatoria": true|false,
      "categoria": "FINANCEIRO|PESSOAL|IMOVEL|LOCALIZACAO",
      "justificativa": "Por que esta pergunta é importante neste momento"
    }
  ]
}
`;

    return prompt;
  }

  private getSystemPrompt(): string {
    return `
Você é um assistente especializado em imóveis e financiamentos no Brasil.
Sua função é gerar perguntas dinâmicas e inteligentes para um formulário de captação de clientes interessados em comprar imóveis.

CARACTERÍSTICAS:
- Especialista em mercado imobiliário brasileiro
- Conhece todas as modalidades de financiamento (CEF, bancos privados, consórcios)
- Entende FGTS, subsídios do Minha Casa Minha Vida
- Foca em maximizar aprovação de financiamentos
- Linguagem consultiva e empática

OBJETIVO:
Gerar perguntas específicas que ajudem a:
1. Qualificar melhor o cliente
2. Identificar a melhor estratégia de financiamento
3. Aumentar chances de aprovação
4. Descobrir necessidades não explicitadas

SEMPRE retorne apenas JSON válido, sem explicações adicionais.
`;
  }

  private parsearRespostaDeepseek(resposta: string, tipoRegra: string): PerguntaDinamica[] {
    try {
      // Limpar resposta e extrair JSON
      let jsonStr = resposta.trim();
      
      // Remover markdown se presente
      jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '');
      
      // Encontrar o JSON no texto
      const jsonStart = jsonStr.indexOf('{');
      const jsonEnd = jsonStr.lastIndexOf('}');
      
      if (jsonStart >= 0 && jsonEnd >= 0) {
        jsonStr = jsonStr.substring(jsonStart, jsonEnd + 1);
      }

      const parsed = JSON.parse(jsonStr);
      const perguntas: PerguntaDinamica[] = [];

      if (parsed.perguntas && Array.isArray(parsed.perguntas)) {
        parsed.perguntas.forEach((p: any, index: number) => {
          if (p.texto && p.tipo) {
            perguntas.push({
              id: `dynamic_${tipoRegra.toLowerCase()}_${Date.now()}_${index}`,
              texto: p.texto,
              tipo: p.tipo,
              opcoes: p.opcoes,
              obrigatoria: p.obrigatoria !== false, // default true
              categoria: p.categoria || this.mapearCategoria(tipoRegra),
              ordem: 1000 + index, // Ordem alta para aparecer depois das estáticas
              condicaoExibicao: { geradaPorRegra: tipoRegra },
              geradaPorIA: true
            });
          }
        });
      }

      return perguntas;

    } catch (error) {
      console.error('❌ Erro ao parsear resposta do Deepseek:', error);
      console.log('📄 Resposta original:', resposta);
      return [];
    }
  }

  private mapearCategoria(tipoRegra: string): string {
    switch (tipoRegra) {
      case 'FINANCIAMENTO':
        return 'FINANCEIRO';
      case 'RENDA':
        return 'FINANCEIRO';
      case 'ENTRADA':
        return 'FINANCEIRO';
      default:
        return 'PESSOAL';
    }
  }

  async analisarNecessidadeNovasPerguntas(
    respostas: Record<string, string>,
    etapaAtual: number
  ): Promise<boolean> {
    // Lógica para determinar se precisamos de mais perguntas
    const respostasCount = Object.keys(respostas).length;
    
    // Se temos poucas respostas, precisamos de mais informações
    if (respostasCount < 5) return true;
    
    // Se não temos informações financeiras básicas
    const temRenda = Object.values(respostas).some(r => r.toLowerCase().includes('renda') || r.includes('salário'));
    const temEntrada = Object.values(respostas).some(r => r.toLowerCase().includes('entrada') || r.includes('recurso'));
    
    if (!temRenda || !temEntrada) return true;
    
    return false;
  }
}

// Instância singleton
export const deepseekQuestions = new DeepseekDynamicQuestions();
