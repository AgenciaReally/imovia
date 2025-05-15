// Serviço para gerenciamento de perguntas

export interface Pergunta {
  id: string
  texto: string
  tipo: string
  opcoes?: any
  ordem: number
  categoria: string
  fluxo: string
  pontuacao: number
  obrigatoria: boolean
  condicional?: any
  geradaPorIA: boolean
  ativa: boolean
  createdAt: string
  updatedAt: string
}

// Interface para itens de seleção no formulário
export interface PerguntaSelect {
  value: string
  label: string
  categoria: string
}

export const CATEGORIAS_PERGUNTA = [
  { valor: 'CADASTRO', nome: 'Cadastro', descricao: 'Informações básicas do cliente' },
  { valor: 'AVALIACAO_CREDITO', nome: 'Avaliação de Crédito', descricao: 'Informações para análise de crédito' },
  { valor: 'INFORMACOES_COMPLEMENTARES', nome: 'Informações Complementares', descricao: 'Outras informações relevantes' },
  { valor: 'PREFERENCIAS', nome: 'Preferências', descricao: 'O que o cliente procura' },
  { valor: 'IMOVEL_IDEAL', nome: 'Imóvel Ideal', descricao: 'Características do imóvel desejado' },
  { valor: 'EMPREENDIMENTO', nome: 'Empreendimento', descricao: 'Características do empreendimento' },
  { valor: 'PROXIMIDADES', nome: 'Proximidades', descricao: 'Locais próximos de interesse' }
]

export const TIPOS_PERGUNTA = [
  { valor: 'text', nome: 'Texto', descricao: 'Resposta em texto livre' },
  { valor: 'number', nome: 'Número', descricao: 'Resposta numérica' },
  { valor: 'email', nome: 'E-mail', descricao: 'Endereço de e-mail' },
  { valor: 'tel', nome: 'Telefone', descricao: 'Número de telefone' },
  { valor: 'date', nome: 'Data', descricao: 'Data' },
  { valor: 'select', nome: 'Seleção', descricao: 'Escolha entre opções' },
  { valor: 'radio', nome: 'Escolha única', descricao: 'Botões de opção' },
  { valor: 'checkbox', nome: 'Múltipla escolha', descricao: 'Caixas de seleção' },
  { valor: 'range', nome: 'Intervalo', descricao: 'Seleção de um intervalo' },
  { valor: 'slider', nome: 'Slider', descricao: 'Seleção por slider' },
  { valor: 'priority', nome: 'Prioridade', descricao: 'Preferível, Aceitável, Impeditivo' },
  { valor: 'file', nome: 'Arquivo', descricao: 'Upload de arquivo' }
]

export const TIPOS_FLUXO = [
  { valor: 'COM_APROVACAO', nome: 'Com Aprovação', descricao: 'Fluxo com aprovação de crédito' },
  { valor: 'SEM_APROVACAO', nome: 'Sem Aprovação', descricao: 'Fluxo sem aprovação de crédito' },
  { valor: 'AMBOS', nome: 'Ambos', descricao: 'Pergunta aparece em ambos os fluxos' }
]

// Busca todas as perguntas
export async function buscarPerguntas(filtros?: { 
  categoria?: string,
  fluxo?: string,
  ativa?: boolean
}): Promise<Pergunta[]> {
  try {
    let url = '/api/perguntas'
    
    // Adicionar parâmetros de consulta se houver filtros
    if (filtros) {
      const params = new URLSearchParams()
      
      if (filtros.categoria) {
        params.append('categoria', filtros.categoria)
      }
      
      if (filtros.fluxo) {
        params.append('fluxo', filtros.fluxo)
      }
      
      if (filtros.ativa !== undefined) {
        params.append('ativa', filtros.ativa.toString())
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }
    }
    
    const response = await fetch(url)
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao buscar perguntas: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`)
    }
    
    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error: any) {
    console.error('Erro ao buscar perguntas:', error)
    throw new Error(error?.message || 'Erro ao buscar perguntas')
  }
}

// Busca uma pergunta específica
export async function buscarPerguntaPorId(id: string): Promise<Pergunta | null> {
  try {
    const response = await fetch(`/api/perguntas/${id}`)
    
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(`Erro ao buscar pergunta: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error(`Erro ao buscar pergunta ${id}:`, error)
    return null
  }
}

// Cria uma nova pergunta
export async function criarPergunta(pergunta: Omit<Pergunta, 'id' | 'createdAt' | 'updatedAt' | 'ordem'>): Promise<Pergunta | null> {
  try {
    console.log('Enviando dados para criar pergunta:', JSON.stringify(pergunta, null, 2));
    
    const response = await fetch('/api/perguntas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pergunta)
    })
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resposta de erro do servidor:', errorText);
      throw new Error(`Erro ao criar pergunta: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`)
    }
    
    const result = await response.json();
    console.log('Resposta da API ao criar pergunta:', result);
    return result;
  } catch (error) {
    console.error('Erro ao criar pergunta:', error)
    throw error; // Propaga o erro para ser tratado pelo componente
  }
}

// Atualiza uma pergunta existente
export async function atualizarPergunta(id: string, dados: Partial<Pergunta>): Promise<Pergunta | null> {
  try {
    console.log(`Enviando dados para atualizar pergunta ${id}:`, JSON.stringify(dados, null, 2));
    
    const response = await fetch(`/api/perguntas/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    })
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resposta de erro do servidor:', errorText);
      throw new Error(`Erro ao atualizar pergunta: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`)
    }
    
    const result = await response.json();
    console.log('Resposta da API ao atualizar pergunta:', result);
    return result;
  } catch (error) {
    console.error(`Erro ao atualizar pergunta ${id}:`, error)
    throw error; // Propaga o erro para ser tratado pelo componente
  }
}

// Exclui uma pergunta
export async function excluirPergunta(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/perguntas/${id}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      throw new Error(`Erro ao excluir pergunta: ${response.statusText}`)
    }
    
    return true
  } catch (error) {
    console.error(`Erro ao excluir pergunta ${id}:`, error)
    return false
  }
}

// Atualiza a ordem de uma pergunta
export async function atualizarOrdemPergunta(
  perguntaId: string,
  novaOrdem: number,
  categoria: string
): Promise<boolean> {
  try {
    const response = await fetch('/api/perguntas/ordem', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ perguntaId, novaOrdem, categoria })
    })
    
    if (!response.ok) {
      throw new Error(`Erro ao reordenar pergunta: ${response.statusText}`)
    }
    
    return true
  } catch (error) {
    console.error('Erro ao reordenar pergunta:', error)
    return false
  }
}
