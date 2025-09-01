import { NextRequest, NextResponse } from 'next/server';
import { OruloBuilding } from '@/types/orulo';

// Interface para a resposta da API Orulo
interface OruloResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: OruloBuilding[];
}

// Interface para a resposta de imóveis ativos da API Orulo
interface OruloActiveBuildings {
  buildings: { id: string; updated_at: string }[];
  total: number;
  page: number;
  total_pages: number;
}

// Função para obter o token de acesso à API Orulo
async function getOruloToken(): Promise<string> {
  console.log('Usando token fixo que já validamos');
  // Token fixo obtido via curl que sabemos que funciona
  return 'ebLQ_HFn3RegIXU0D6Y7WfP1IHijjmw4heG8ZF7TuNg';
}

// Função principal da API
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const search = searchParams.get('search');
    const all = searchParams.get('all');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    
    // Obter token de autenticação
    const token = await getOruloToken();
    
    // URL base correta da API Orulo
    const baseUrl = 'https://www.orulo.com.br/api/v2';
    
    // Definir a URL correta baseada nos parâmetros
    let url;
    
    // Se ID for fornecido, buscar imóvel específico
    if (id) {
      url = `${baseUrl}/buildings/${id}`;
    } 
    // Se houver termo de busca
    else if (search) {
      url = `${baseUrl}/buildings?search=${encodeURIComponent(search)}`;
    }
    // Se "all" for fornecido ou como padrão, buscar todos os imóveis ativos
    else {
      url = `${baseUrl}/buildings/ids/active`;
    }
    
    console.log('Fazendo requisição para URL:', url);
    
    // Fazer requisição à API Orulo
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      // Timeout para garantir que a requisição não demore muito
      signal: AbortSignal.timeout(10000),
    });
    
    console.log('Status da resposta:', response.status);
    
    if (!response.ok) {
      // Tentar obter mais detalhes do erro
      try {
        const errorData = await response.text();
        console.error('Detalhes do erro:', errorData);
        throw new Error(`Erro na requisição à API Orulo: ${response.status}, Detalhes: ${errorData}`);
      } catch (errorParseError) {
        throw new Error(`Erro na requisição à API Orulo: ${response.status}`);
      }
    }
    
    // Processar a resposta da API
    const responseData = await response.json();
    console.log('Resposta recebida da API Orulo');
    
    // Se estamos buscando os imóveis ativos
    if (url.includes('/buildings/ids/active')) {
      const activeBuildings = responseData as OruloActiveBuildings;
      
      // Se all=true, buscar detalhes completos de cada imóvel
      if (all === 'true') {
        console.log(`Buscando detalhes completos de ${activeBuildings.buildings.length} imóveis ativos`);
        
        // Calcular a paginação
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const totalPages = Math.ceil(activeBuildings.buildings.length / pageSize);
        
        // Obter os imóveis da página atual
        const buildings = activeBuildings.buildings.slice(startIndex, endIndex);
        
        // Buscar detalhes de cada imóvel em paralelo
        const detailedBuildings = await Promise.all(
          buildings.map(async (building) => {
            try {
              const detailResponse = await fetch(`${baseUrl}/buildings/${building.id}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Accept': 'application/json',
                },
                signal: AbortSignal.timeout(8000), // timeout menor para cada requisição individual
              });
              
              if (!detailResponse.ok) {
                console.error(`Erro ao buscar detalhes do imóvel ${building.id}: ${detailResponse.status}`);
                return {
                  id: building.id,
                  updated_at: building.updated_at,
                  name: `Imóvel ${building.id}`,
                  address: { city: 'Cidade não carregada' },
                  min_price: 0,
                };
              }
              
              const buildingData = await detailResponse.json();
              console.log(`Detalhes do imóvel ${building.id} obtidos com sucesso`);
              return buildingData;
            } catch (error) {
              console.error(`Erro ao buscar detalhes do imóvel ${building.id}:`, error);
              return {
                id: building.id,
                updated_at: building.updated_at,
                name: `Imóvel ${building.id}`,
                address: { city: 'Erro ao carregar' },
                min_price: 0,
              };
            }
          })
        );
        
        return NextResponse.json({
          results: detailedBuildings,
          count: activeBuildings.total,
          total_pages: totalPages,
          current_page: page
        });
      } else {
        // Calcular a paginação para a resposta sem detalhes
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const totalPages = Math.ceil(activeBuildings.buildings.length / pageSize);
        
        // Se não precisamos dos detalhes, retornamos apenas os IDs formatados
        return NextResponse.json({
          results: activeBuildings.buildings
            .slice(startIndex, endIndex)
            .map(building => ({
              id: building.id,
              updated_at: building.updated_at,
              // Adicionamos informações básicas para compatibilidade com o tipo OruloBuilding
              name: `Imóvel ${building.id}`,
              address: { city: 'Cidade não carregada' },
              min_price: 0,
            })),
          count: activeBuildings.total,
          total_pages: totalPages,
          current_page: page
        });
      }
    }
    
    // Se for um imóvel específico (objeto único)
    if (id) {
      return NextResponse.json({
        results: [responseData],
        count: 1
      });
    } 
    
    // Se a resposta já estiver no formato esperado
    if (responseData.results && Array.isArray(responseData.results)) {
      return NextResponse.json(responseData);
    } 
    
    // Se for um array direto
    if (Array.isArray(responseData)) {
      return NextResponse.json({
        results: responseData,
        count: responseData.length
      });
    } 
    
    // Caso não seja reconhecido, retornar o objeto como está
    return NextResponse.json({
      results: responseData && responseData.id ? [responseData] : [],
      count: responseData && responseData.id ? 1 : 0
    });
    
  } catch (error: any) {
    console.error('Erro inesperado na API Orulo:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor', 
      message: error.message || 'Erro desconhecido'
    }, { status: 500 });
  }
}
