// Serviço para consumir a API da Orulo

// Tipagem para os imóveis da Orulo
export interface OruloBuilding {
  id: number
  name: string
  description: string
  address: string
  neighborhood: string
  city: string
  state: string
  postal_code: string
  latitude: number
  longitude: number
  min_price: number
  max_price: number
  min_area: number
  max_area: number
  min_bedrooms: number
  max_bedrooms: number
  min_bathrooms: number
  max_bathrooms: number
  min_parking_spaces: number
  max_parking_spaces: number
  status: string
  delivery_date: string
  construction_status: string
  type: string
  developer: {
    id: number
    name: string
  }
  features: string[]
  images: string[]
}

// Tipagem para a resposta da API Orulo para imóveis
export interface OruloResponse {
  count: number
  next: string | null
  previous: string | null
  results: OruloBuilding[]
}

// Tipagem para as construtoras da Orulo
export interface OruloConstrutora {
  id: number
  name: string
  description: string
  logo_url: string
  site_url: string
  phone: string
  email: string
  properties_count: number
  city: string
  state: string
  status: string
  address: string
  creci: string
  verified: boolean
}

// Tipagem para a resposta da API Orulo para construtoras
export interface OruloConstrutoraPaginatedResponse {
  count: number
  next: string | null
  previous: string | null
  results: OruloConstrutora[]
}

// Função para buscar todos os imóveis da Orulo
export async function buscarImoveisOrulo(all: boolean = false): Promise<OruloBuilding[]> {
  try {
    // Primeiro, tentamos buscar da API
    let response = await fetch('/api/orulo?all=' + all)
    
    if (!response.ok) {
      throw new Error('Falha ao buscar imóveis da Orulo')
    }
    
    const data: OruloResponse = await response.json()
    return data.results
  } catch (error) {
    console.error('Erro ao buscar imóveis da Orulo:', error)
    return []
  }
}

// Função para buscar um imóvel específico da Orulo
export async function buscarImovelOruloPorId(id: string): Promise<OruloBuilding | null> {
  try {
    const response = await fetch(`/api/orulo/${id}`)
    
    if (!response.ok) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error(`Erro ao buscar imóvel ${id} da Orulo:`, error)
    return null
  }
}

// Função para buscar construtoras da Orulo
export async function buscarConstrutorasOrulo(): Promise<OruloConstrutora[]> {
  try {
    const response = await fetch('/api/orulo/construtoras')
    
    if (!response.ok) {
      throw new Error('Falha ao buscar construtoras da Orulo')
    }
    
    const data: OruloConstrutoraPaginatedResponse = await response.json()
    return data.results
  } catch (error) {
    console.error('Erro ao buscar construtoras da Orulo:', error)
    return []
  }
}

// Função para buscar uma construtora específica da Orulo
export async function buscarConstrutoraPorIdOrulo(id: string): Promise<OruloConstrutora | null> {
  try {
    const response = await fetch(`/api/orulo/construtoras/${id}`)
    
    if (!response.ok) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error(`Erro ao buscar construtora ${id} da Orulo:`, error)
    return null
  }
}
