// Serviço de construtoras atualizado para chamadas de API

export interface ConstrutoraDashboard {
  id: string
  nome: string
  email: string
  telefone?: string
  cnpj: string
  endereco?: string
  status: 'ativa' | 'inativa' | 'pendente'
  dataRegistro: string
  qtdImoveis: number
  qtdUsuarios: number
}

export async function getConstrutoras(): Promise<ConstrutoraDashboard[]> {
  try {
    const response = await fetch('/api/construtoras')
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar construtoras: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // Verifica o formato da resposta e retorna o array correto
    if (data && Array.isArray(data)) {
      // Resposta é diretamente um array
      return data
    } else if (data && Array.isArray(data.construtoraMapeada)) {
      // Resposta tem a propriedade construtoraMapeada
      return data.construtoraMapeada
    } else if (data && Array.isArray(data.construtoras)) {
      // Resposta tem a propriedade construtoras (formato simples)
      return data.construtoras.map((c: any) => ({
        ...c,
        email: c.email || '',
        cnpj: c.cnpj || '',
        status: c.status || 'ativa',
        dataRegistro: c.dataRegistro || new Date().toLocaleDateString('pt-BR'),
        qtdImoveis: c.qtdImoveis || 0,
        qtdUsuarios: c.qtdUsuarios || 0
      }))
    }
    
    // Fallback para array vazio se nenhum formato conhecido for detectado
    console.error('Formato de resposta não reconhecido:', data)
    return []
  } catch (error) {
    console.error('Erro ao buscar construtoras:', error)
    return []
  }
}

export async function getConstrutoraPorId(id: string): Promise<ConstrutoraDashboard | null> {
  try {
    const response = await fetch(`/api/construtoras/${id}`)
    
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(`Erro ao buscar construtora: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error(`Erro ao buscar construtora ${id}:`, error)
    return null
  }
}

export async function getEstatisticasConstrutoras() {
  try {
    const response = await fetch('/api/construtoras/estatisticas')
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar estatísticas: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar estatísticas de construtoras:', error)
    // Retorna dados padrão em caso de erro
    return {
      total: 0,
      ativas: 0,
      inativas: 0,
      pendentes: 0,
      totalImoveis: 0,
      mediaImoveisPorConstrutora: 0,
      mediaUsuariosPorConstrutora: 0,
      rankingConstrutoras: []
    }
  }
}

// Função para ativar uma construtora
export async function ativarConstrutora(id: string): Promise<boolean> {
  try {
    console.log(`Tentando ativar construtora ${id}`)
    const response = await fetch(`/api/construtoras/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'ativa' })
    })
    
    if (!response.ok) {
      throw new Error(`Erro ao ativar construtora: ${response.statusText}`)
    }
    
    return true
  } catch (error) {
    console.error(`Erro ao ativar construtora ${id}:`, error)
    return false
  }
}

// Função para desativar uma construtora
export async function desativarConstrutora(id: string): Promise<boolean> {
  try {
    console.log(`Tentando desativar construtora ${id}`)
    const response = await fetch(`/api/construtoras/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'inativa' })
    })
    
    if (!response.ok) {
      throw new Error(`Erro ao desativar construtora: ${response.statusText}`)
    }
    
    return true
  } catch (error) {
    console.error(`Erro ao desativar construtora ${id}:`, error)
    return false
  }
}
