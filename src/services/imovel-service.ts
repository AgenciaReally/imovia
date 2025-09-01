// Serviço de imóveis atualizado para chamadas de API

// Reutilizando os tipos da implementação OAuth2 para evitar incompatibilidades
import { OruloBuilding, OruloResponse } from '@/config/orulo'

// Re-exportar os tipos para manter compatibilidade
export type { OruloBuilding, OruloResponse }

// Tipos adicionais específicos para o serviço de imóveis
export interface OruloBuildingImage {
  url: string
  description?: string
  order: number
}

// Interface para o tipo de imóvel relacionado
export interface TipoImovel {
  id: string
  nome: string
  slug: string
  descricao?: string
}

export interface ImovelDisplay {
  id: string
  idExterno?: string
  titulo: string
  descricao: string
  preco: number
  area: number
  quartos: number
  banheiros: number
  vagas: number
  endereco: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  latitude: number
  longitude: number
  imagens: string[]
  fotoPrincipal?: string  // URL da foto principal
  construtora: string
  construtoraId: string
  status: string
  dataAtualizacao: string
  caracteristicas: string[]
  ativo?: boolean
  destaque?: boolean
  telefoneContato?: string    // Telefone de contato do imóvel
  
  // Campos adicionados para o novo modelo relacional de tipo de imóvel
  tipoImovel?: TipoImovel      // Objeto relacionado completo
  tipoImovelId?: string        // ID do tipo relacionado
  tipoImovelNome?: string      // Nome do tipo para compatibilidade
}

// Importando nossa implementação OAuth2 da Orulo
import { buscarImoveisOrulo as fetchOruloBuildings, isUsingMockData } from '@/config/orulo'

// Função para buscar imóveis da API da Orulo
export async function buscarImoveisOrulo(page = 1, search = '', buscarTodos = false): Promise<OruloResponse> {
  try {
    // Usar a implementação OAuth2 atualizada
    return await fetchOruloBuildings(page, search, buscarTodos);
  } catch (error) {
    console.error('Erro ao buscar imóveis da API Orulo:', error)
    
    // Falha segura: retornar um array vazio em caso de erro
    return {
      count: 0,
      next: null,
      previous: null,
      results: []
    }
  }
}

// Função para buscar um imóvel específico da API da Orulo por ID
export async function buscarImovelOruloPorId(id: string): Promise<OruloBuilding> {
  try {
    // Verificar se temos um token OAuth2 válido
    const oauthToken = localStorage.getItem('oruloToken');
    const headers: HeadersInit = {};
    
    if (oauthToken) {
      try {
        const tokenData = JSON.parse(oauthToken);
        if (tokenData.access_token && Date.now() < (tokenData.expires_at || 0)) {
          headers['Authorization'] = `Bearer ${tokenData.access_token}`;
        }
      } catch (e) {
        console.warn('Erro ao processar token OAuth2:', e);
      }
    }
    
    // Fazer requisição através da API Gateway
    const response = await fetch(`/api/orulo?id=${id}`, { headers })
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar imóvel: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error(`Erro ao buscar imóvel ${id} da API Orulo:`, error)
    
    // Falha segura: retornar um objeto vazio em caso de erro
    return {
      id: parseInt(id),
      name: 'Imóvel não encontrado',
      address: '',
      neighborhood: '',
      city: '',
      state: '',
      zipcode: '',
      thumbnail: '',
      min_price: 0,
      min_area: 0,
      status: 'error',
      developer: {
        name: ''
      }
    } as unknown as OruloBuilding
  }
}

// Função para obter imóveis do banco de dados
export async function obterImoveisDoDb(filtros?: Record<string, any>): Promise<ImovelDisplay[]> {
  try {
    // Construir URL com parâmetros de filtro
    let url = '/api/imoveis';
    
    if (filtros && Object.keys(filtros).length > 0) {
      const params = new URLSearchParams();
      
      // Adicionar filtros específicos baseados nas respostas
      if (filtros.quartos) {
        params.append('quartos', filtros.quartos.toString());
      }
      
      if (filtros.banheiros) {
        params.append('banheiros', filtros.banheiros.toString());
      }
      
      if (filtros.valorMaximo) {
        params.append('valorMaximo', filtros.valorMaximo.toString());
      }
      
      if (filtros.valorMinimo) {
        params.append('valorMinimo', filtros.valorMinimo.toString());
      }
      
      if (filtros.area) {
        params.append('area', filtros.area.toString());
      }
      
      if (filtros.bairro) {
        params.append('bairro', filtros.bairro);
      }
      
      if (filtros.tipoImovel) {
        params.append('tipoImovel', filtros.tipoImovel);
      }
      
      // Adicionar parâmetro para filtrar apenas imóveis ativos
      params.append('ativo', 'true');
      
      url = `${url}?${params.toString()}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar imóveis: ${response.statusText}`);
    }
    
    const imoveis = await response.json();
    console.log(`Encontrados ${imoveis.length} imóveis com os filtros aplicados:`, filtros);
    return imoveis;
  } catch (error) {
    console.error('Erro ao buscar imóveis do banco de dados:', error);
    return [];
  }
}
