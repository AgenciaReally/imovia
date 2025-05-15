// Configurações de integração com a Orulo
export const ORULO_CONFIG = {
  // Definindo valores padrão conforme fornecido pelo cliente
  CLIENT_ID: process.env.ORULO_CLIENT_ID || 'NVMeJ6c9nVZM3kMYhPBwU6CvL4CQbAgiZMLcuMgvfXA',
  CLIENT_SECRET: process.env.ORULO_CLIENT_SECRET || 'LFCtyXG3QP3V5o9pkXGjRJvKKf0gwozPiJ7TuDs8kmQ',
  API_KEY: process.env.ORULO_API_KEY,
  BASE_URL: 'https://api.orulo.com.br',
  OAUTH_URL: 'https://www.orulo.com.br/oauth/token'
}

// Interfaces para integração com a Orulo
export interface OruloBuilding {
  id: number;
  name: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zipcode: string;
  thumbnail?: string;
  images?: string[];
  min_price?: number;
  min_area?: number;
  typologies?: string[];
  status?: string;
  developer?: {
    name: string;
    logo?: string;
  };
  marketing?: {
    stage?: string;
    tags?: string[];
  };
  company?: {
    name: string;
  };
}

export interface OruloResponse {
  count: number;
  results: OruloBuilding[];
  next: string | null;
  previous: string | null;
}

export interface OruloToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at?: number; // Timestamp quando o token expira
}

// Função para buscar imóveis da Orulo com suporte a paginação
export async function fetchOruloBuildings(options: { 
  page?: number, 
  search?: string, 
  limit?: number 
} = {}) {
  const { page = 1, search = '', limit = 20 } = options;
  
  try {
    // Construir a URL com parâmetros
    const url = new URL(`${ORULO_CONFIG.BASE_URL}/buildings`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('page_size', limit.toString());
    
    if (search) {
      url.searchParams.append('search', search);
    }
    
    // Construir headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    // Adiciona credenciais disponíveis
    if (ORULO_CONFIG.CLIENT_ID && ORULO_CONFIG.CLIENT_SECRET) {
      headers['X-Client-ID'] = ORULO_CONFIG.CLIENT_ID;
      headers['X-Secret'] = ORULO_CONFIG.CLIENT_SECRET;
    }
    
    if (ORULO_CONFIG.API_KEY) {
      headers['Authorization'] = `Token ${ORULO_CONFIG.API_KEY}`;
    }
    
    // Fazer requisição
    const response = await fetch(url.toString(), { headers });
    
    if (!response.ok) {
      throw new Error(`Erro na API Orulo: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar imóveis da Orulo:', error);
    throw error;
  }
}

// Serviço de configuração da API Orulo


// Constants
const ORULO_TOKEN_KEY = 'orulo_access_token';
const ORULO_TOKEN_EXPIRES_KEY = 'orulo_token_expires';
const ORULO_BUILDINGS_CACHE_KEY = 'orulo_buildings_cache';
const ORULO_CACHE_TTL = 3600 * 1000; // 1 hora em milissegundos

// Cache local para armazenar token e imóveis
// Resposta vazia para fallback quando não conseguimos dados reais
const EMPTY_RESPONSE: OruloResponse = {
  count: 0,
  next: null,
  previous: null,
  results: []
};

const oruloCache = {
  token: null as OruloToken | null,
  buildings: EMPTY_RESPONSE as OruloResponse, // Inicializa com resposta vazia em vez de null
  lastFetch: 0,
  isUsingMock: false,
};

// Busca um token OAuth2 válido do servidor

async function getOruloToken(forceRefresh: boolean = false): Promise<string | null> {
  try {
    // Se já temos um token válido em cache e não estamos forçando atualização
    if (
      oruloCache.token && 
      oruloCache.token.expires_at && 
      Date.now() < oruloCache.token.expires_at - 300000 && // 5 minutos de margem
      !forceRefresh
    ) {
      console.log('Usando token OAuth2 Orulo em cache');
      return oruloCache.token.access_token;
    }
    
    console.log('Buscando novo token OAuth2 Orulo do servidor...');
    const response = await fetch('/api/orulo/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 } // Sem cache
    });
    
    if (!response.ok) {
      console.error(`Erro ao obter token Orulo: ${response.status}`);
      return null;
    }
    
    const tokenData = await response.json();
    // Calcula quando o token vai expirar e armazena com o timestamp
    const expiresAt = Date.now() + (tokenData.expires_in * 1000);
    
    // Armazena no cache
    oruloCache.token = {
      ...tokenData,
      expires_at: expiresAt
    };
    
    // Salva no localStorage para persistência entre sessões
    try {
      localStorage.setItem('oruloToken', JSON.stringify(oruloCache.token));
    } catch (storageError) {
      console.warn('Não foi possível salvar token no localStorage:', storageError);
    }
    
    return tokenData.access_token;
  } catch (error) {
    console.error('Erro ao buscar token Orulo:', error);
    return null;
  }
}

// Carrega token do localStorage na inicialização
if (typeof window !== 'undefined') {
  try {
    const savedToken = localStorage.getItem('oruloToken');
    if (savedToken) {
      const parsedToken = JSON.parse(savedToken) as OruloToken;
      // Verifica se o token ainda é válido (com margem de 5 minutos)
      if (parsedToken.expires_at && Date.now() < parsedToken.expires_at - 300000) {
        oruloCache.token = parsedToken;
        console.log('Token Orulo restaurado do localStorage');
      } else {
        console.log('Token Orulo do localStorage expirado');
      }
    }
  } catch (error) {
    console.warn('Erro ao restaurar token Orulo do localStorage:', error);
  }
}

// Busca imóveis da Orulo (com autenticação automática)
// cache pode ser desativado com forceRefresh = true

export async function buscarImoveisOrulo(page: number = 1, search: string = '', forceRefresh: boolean = false): Promise<OruloResponse> {
  console.log(`Buscando imóveis Orulo - Página ${page}, Pesquisa: '${search}', Forçar atualização: ${forceRefresh}`);
  try {
    // Verifica se podemos usar cache
    const cacheValidity = 1800000; // 30 minutos em ms
    const useCache = !forceRefresh && 
                    oruloCache.buildings && 
                    (Date.now() - oruloCache.lastFetch) < cacheValidity;
                    
    if (useCache) {
      console.log('Usando cache de imóveis Orulo');
      return oruloCache.buildings;
    }

    // Obtém um token OAuth2 válido
    const token = await getOruloToken(forceRefresh);
    
    if (!token) {
      console.warn('Não foi possível obter token para API Orulo, usando resposta vazia');
      oruloCache.isUsingMock = true;
      // Usar resposta vazia pré-definida
      oruloCache.buildings = EMPTY_RESPONSE;
      oruloCache.lastFetch = Date.now();
      return oruloCache.buildings;
    }
    
    // Prepara parâmetros da requisição
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    if (search) {
      params.append('search', search);
    }
    
    if (forceRefresh) {
      // Adiciona um timestamp para evitar cache
      params.append('_t', Date.now().toString());
    }
    
    // Adiciona o header de autorização com o token OAuth2
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
      'X-Force-Refresh': forceRefresh ? 'true' : 'false'
    };
    
    // Faz a requisição através do endpoint da API Gateway
    const response = await fetch(`/api/orulo?${params.toString()}`, { headers });
      
    if (!response.ok) {
      throw new Error(`Erro API Gateway: ${response.status}`);
    }
    
    const data = await response.json();
    // Atualiza o cache
    oruloCache.buildings = data;
    oruloCache.lastFetch = Date.now();
    oruloCache.isUsingMock = false;
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar imóveis da Orulo:', error);
    
    // Verifica se já temos dados em cache, mesmo que antigos
    if (oruloCache.buildings) {
      console.log('Usando cache antigo como fallback');
      return oruloCache.buildings;
    }
    
    // Último fallback: dados mockados simplificados
    console.log('Usando dados mockados simplificados como último fallback');
    oruloCache.isUsingMock = true;
    oruloCache.buildings = {
      count: 0,
      next: null,
      previous: null,
      results: []
    };
    oruloCache.lastFetch = Date.now();
    return oruloCache.buildings;
  }
}

// Função para sincronizar imóveis da Orulo para o banco de dados local
// Retorna objeto com informações do resultado da sincronização
export async function syncOruloBuildings() {
  try {
    const startTime = Date.now();
    
    // Força a atualização do token e dos dados
    const token = await getOruloToken(true);
    
    if (!token) {
      return {
        success: false,
        count: 0,
        message: 'Não foi possível obter token de autenticação',
      };
    }
    
    // Busca os imóveis com o token atualizado e forçando refresh do cache
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
      'X-Force-Refresh': 'true'
    };
    
    const response = await fetch('/api/orulo?all=true', { headers });
    
    if (!response.ok) {
      return {
        success: false,
        count: 0,
        message: `Erro ao buscar imóveis: Status ${response.status}`,
        error: new Error(`HTTP Error: ${response.status}`)
      };
    }
    
    const data = await response.json();
    const totalSynced = data.results.length;
    const timeElapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    
    // Atualiza o cache
    oruloCache.buildings = data;
    oruloCache.lastFetch = Date.now();
    oruloCache.isUsingMock = false;
    
    if (totalSynced === 0) {
      return {
        success: false,
        count: 0,
        message: 'Nenhum imóvel encontrado para sincronizar'
      };
    }
    
    return {
      success: true,
      count: totalSynced,
      message: `${totalSynced} imóveis sincronizados em ${timeElapsed}s`,
    };
  } catch (error) {
    console.error('Erro na sincronização de imóveis:', error);
    return {
      success: false,
      count: 0,
      message: `Erro na sincronização: ${(error as Error).message}`,
      error
    };
  }
}

// Verifica se estamos usando dados mockados/simulados
export function isUsingMockData(): boolean {
  return oruloCache.isUsingMock;
}
