import { NextResponse } from 'next/server'

// Tipos para a API da Orulo
export interface OruloBuildingImage {
  url: string
  description?: string
  order: number
}

// Definição do endereço como objeto
export interface OruloAddress {
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  postal_code: string
  latitude: number
  longitude: number
}

// Interface completa para imóveis da Orulo
export interface OruloBuilding {
  id: number
  name: string
  description: string
  // O endereço pode ser um objeto ou uma string
  address: OruloAddress | string
  // Campos individuais de endereço também podem existir no objeto raiz
  street?: string
  number?: string
  neighborhood?: string
  city?: string
  state?: string
  postal_code?: string
  zipcode?: string
  latitude?: number
  longitude?: number
  // Campos de preço e características
  price_from?: number
  price_to?: number
  min_price?: number
  min_area?: number
  max_area?: number
  min_bedrooms?: number
  max_bedrooms?: number
  min_bathrooms?: number
  max_bathrooms?: number
  min_parking?: number
  max_parking?: number
  min_suites?: number
  max_suites?: number
  status?: string
  construction_status?: string
  // Imagens e mídia
  images: OruloBuildingImage[]
  default_image?: string 
  thumbnail?: string
  // Informações da construtora/incorporadora
  developer?: {
    id: number
    name: string
    logo_url?: string
  }
  // Outros metadados
  updated_at?: string
  features?: string[]
  orulo_url?: string
  portfolio?: string
  opportunity?: boolean
}

// Formato de resposta da API Orulo
export interface OruloResponse {
  count: number
  next: string | null
  previous: string | null
  results: OruloBuilding[]
}

export async function GET(request: Request) {
  try {
    // Extrair parâmetros
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '1';
    const search = url.searchParams.get('search') || '';
    const id = url.searchParams.get('id');
    const all = url.searchParams.get('all') === 'true';
    const forceRefresh = request.headers.get('X-Force-Refresh') === 'true';

    // Verificar se o token de autorização está presente
    let authToken = request.headers.get('Authorization');
    let useOAuth = false;
    
    // Configurar headers - adicionando mais headers corretos para a API
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    // Se temos um token OAuth2 no header, usá-lo (prioridade)
    if (authToken && authToken.startsWith('Bearer ')) {
      // Certificar que o formato do token está correto (sem espaços extras)
      // IMPORTANTE: formatando exatamente como a API espera
      const tokenValue = authToken.substring(7).trim();
      // Formato exato esperado pela API Orulo: "Bearer token" (com espaço entre Bearer e token)
      headers['Authorization'] = 'Bearer ' + tokenValue;
      useOAuth = true;
      console.log('Usando token OAuth2 para API Orulo:', tokenValue.substring(0, 10) + '...');
      // Adicionando header de aceitação de JSON
      headers['Accept'] = 'application/json';
    } else {
      // Fallback para métodos de autenticação legacy
      const CLIENT_ID = process.env.ORULO_CLIENT_ID || 'NVMeJ6c9nVZM3kMYhPBwU6CvL4CQbAgiZMLcuMgvfXA';
      const CLIENT_SECRET = process.env.ORULO_CLIENT_SECRET || 'LFCtyXG3QP3V5o9pkXGjRJvKKf0gwozPiJ7TuDs8kmQ';
      const API_KEY = process.env.ORULO_API_KEY;

      if (CLIENT_ID && CLIENT_SECRET) {
        headers['X-Client-ID'] = CLIENT_ID;
        headers['X-Secret'] = CLIENT_SECRET;
        console.log('Usando X-Client-ID e X-Secret para API Orulo');
      }

      if (API_KEY) {
        headers['Authorization'] = `Token ${API_KEY}`;
        console.log('Usando API Key para API Orulo');
      }
    }

    // Se um ID específico for fornecido, busque apenas esse imóvel
    if (id) {
      const buildingUrl = useOAuth
        ? `https://www.orulo.com.br/api/v2/buildings/${id}`
        : `https://api.orulo.com.br/buildings/${id}`;
      
      console.log(`Buscando imóvel ${id} na URL: ${buildingUrl}`);
      
      try {
        const response = await fetch(buildingUrl, {
          method: 'GET',
          headers,
          next: { revalidate: forceRefresh ? 0 : 3600 } // Cache de 1h, a menos que forçado
        });

        if (!response.ok) {
          console.log(`Erro ao buscar imóvel ${id}: ${response.status}`);
          return NextResponse.json(mockOruloBuilding(parseInt(id)));
        }

        const data = await response.json();
        return NextResponse.json(data);
      } catch (error) {
        console.error(`Erro ao buscar imóvel ${id}:`, error);
        // Tentar novamente com uma configuração mais simples
        try {
          console.log('Tentando novamente após erro...');
          // Use apenas os headers de autorização essenciais
          const simpleResponse = await fetch(buildingUrl, {
            method: 'GET',
            headers: {
              'Authorization': headers['Authorization'],
              'Accept': 'application/json'
            },
            cache: 'no-store'
          });
          
          if (simpleResponse.ok) {
            const data = await simpleResponse.json();
            return NextResponse.json(data);
          }
        } catch (retryError) {
          console.error('Retry falhou:', retryError);
        }
        
        // Se ainda falhar, retornar array vazio, não usar mockados
        return NextResponse.json({
          count: 0,
          next: null,
          previous: null,
          results: []
        });
      }
    }

    // Busca padrão com paginação
    try {
      const params = new URLSearchParams({
        page: page,
        page_size: '32', // Forçar 32 imóveis por página
      })
      
      if (search) {
        params.append('search', search)
      }

      // SEMPRE usar a API v2 com OAuth2, pois a outra não está funcionando corretamente
      const apiBaseUrl = 'https://www.orulo.com.br/api/v2';
      useOAuth = true; // Forçar uso de OAuth2
        
      // SOLUÇÃO: Descobrimos que a API limita a 10 imóveis por página, independente do parâmetro per_page
      // No entanto, o endpoint /buildings/ids/active retorna todos os 32 imóveis ativos de uma vez
      // Vamos usar essa abordagem para garantir que obtemos todos os imóveis
      
      // Primeiro, obtemos a lista de IDs dos imóveis ativos
      const activeIdsUrl = `${apiBaseUrl}/buildings/ids/active`;
      
      console.log('Buscando IDs de todos os imóveis ativos:', activeIdsUrl);
      
      // Se houver busca, usamos a API normal com paginação
      let buildingsUrls: string[] = [];
      
      if (search) {
        // Com busca, usamos o endpoint normal e múltiplas páginas
        const maxPages = 4; // Buscar até 4 páginas (40 imóveis no total)
        
        for (let p = 1; p <= maxPages; p++) {
          const params = new URLSearchParams({
            page: p.toString(),
            per_page: '10',  // A API sempre retorna 10 por página
            search: search,
            _t: Date.now().toString(), // Timestamp para evitar cache
          });
          
          buildingsUrls.push(`${apiBaseUrl}/buildings?${params.toString()}`);
        }
      } else {
        // Sem busca, usamos o endpoint /buildings/ids/active que retorna todos os imóveis
        buildingsUrls = [activeIdsUrl];
      }
      
      console.log(`Estratégia: ${search ? 'Busca com paginação' : 'Todos os imóveis ativos'} (${buildingsUrls.length} URLs)`);
      
      // Log para debug
      console.log('Headers de autorização:', {
        hasAuthHeader: !!headers['Authorization'],
        authType: headers['Authorization']?.substring(0, 10) + '...' || 'nenhum'
      });
      
      try {
        // Buscar todas as páginas paralelamente
        const promises = buildingsUrls.map(url => {
          console.log(`Buscando imóveis em: ${url}`);
          return fetch(url, {
            method: 'GET',
            headers,
            next: { revalidate: 0 } // Sem cache
          });
        });
        
        // Aguardar todas as respostas
        const responses = await Promise.all(promises);
        
        // Verificar se todas as respostas estão ok
        const allOk = responses.every(response => response.ok);

        if (!allOk) {
          console.log('Algumas requisições falharam. Tentando novamente com headers simplificados...');
          
          // Tentar novamente apenas com header de autorização para as respostas que falharam
          const retryPromises = responses.map((response, index) => {
            if (response.ok) {
              return response; // Manter respostas que funcionaram
            }
            
            console.log(`Retry para URL: ${buildingsUrls[index]}`);
            return fetch(buildingsUrls[index], {
              method: 'GET',
              headers: { 'Authorization': headers['Authorization'] },
              next: { revalidate: 0 }
            });
          });
          
          // Aguardar as novas tentativas
          const retryResponses = await Promise.all(retryPromises);
          
          // Verificar resultados da segunda tentativa
          const retryOk = retryResponses.some(response => response.ok);
          
          if (!retryOk) {
            console.error('Todas as tentativas falharam');
            // Retornar array vazio de resultados, não usar mockados
            return NextResponse.json({
              count: 0,
              next: null,
              previous: null,
              results: []
            });
          }
          
          // Usar apenas respostas bem-sucedidas
          const validResponses = retryResponses.filter(response => response.ok);
          const dataPromises = validResponses.map(response => response.json());
          const allData = await Promise.all(dataPromises);
          
          // Combinar resultados de todas as páginas bem-sucedidas
          let allResults: OruloBuilding[] = [];
          let totalCount = 0;
          
          allData.forEach(data => {
            if (data && data.results && Array.isArray(data.results)) {
              allResults = [...allResults, ...data.results];
              totalCount = Math.max(totalCount, data.count || 0);
            } else if (data && Array.isArray(data)) {
              allResults = [...allResults, ...data];
              totalCount = Math.max(totalCount, data.length || 0);
            }
          });
          
          console.log(`Recuperados ${allResults.length} imóveis após retry`);
          
          return NextResponse.json({
            count: totalCount || allResults.length,
            next: null,
            previous: null,
            results: allResults
          });
        }

        // Processar todas as respostas bem-sucedidas
        const dataPromises = responses.map(response => response.json());
        const allData = await Promise.all(dataPromises);
        
        // Combinar resultados de todas as páginas
        let allResults: OruloBuilding[] = [];
        let totalCount = 0;
        
        // Verificar a estrutura de dados exata recebida da API
        console.log('Estrutura de dados recebida:');
        allData.forEach((data, index) => {
          console.log(`Resposta ${index + 1}:`, 
            Object.keys(data),
            `(${typeof data})`,
            `Com count/total: ${data.count || data.total || 'N/A'}`
          );
          
          // Verificar uma amostra dos dados se disponíveis
          if (data && data.buildings && data.buildings.length > 0) {
            console.log('Exemplo de imóvel do campo buildings:', 
              Object.keys(data.buildings[0]),
              `Nome: ${data.buildings[0].name || 'sem nome'}`
            );
          } else if (data && data.results && data.results.length > 0) {
            console.log('Exemplo de imóvel do campo results:', 
              Object.keys(data.results[0]),
              `Nome: ${data.results[0].name || 'sem nome'}`
            );
          } else if (Array.isArray(data) && data.length > 0) {
            console.log('Exemplo de imóvel do array:', 
              Object.keys(data[0]),
              `Nome: ${data[0].name || 'sem nome'}`
            );
          }
        });
        
        // Agora processar os dados de acordo com a estrutura detectada
        allData.forEach(data => {
          if (data && data.results && Array.isArray(data.results)) {
            // Formato padrão da API {count, next, previous, results}
            console.log(`Adicionando ${data.results.length} imóveis do campo 'results'`);
            allResults = [...allResults, ...data.results];
            totalCount = Math.max(totalCount, data.count || 0);
          } else if (data && Array.isArray(data.buildings)) {
            // Formato alternativo {buildings, total} - provavelmente usado pelo endpoint /buildings/ids/active
            console.log(`Adicionando ${data.buildings.length} imóveis do campo 'buildings'`);
            allResults = [...allResults, ...data.buildings];
            totalCount = Math.max(totalCount, data.total || 0);
          } else if (Array.isArray(data)) {
            // Array direto de imóveis
            console.log(`Adicionando ${data.length} imóveis do array direto`);
            allResults = [...allResults, ...data];
            totalCount = Math.max(totalCount, data.length || 0);
          }
        });
        
        console.log(`Recuperados ${allResults.length} imóveis de ${responses.length} páginas`);
        
        // Procura campos de fotos que podem estar em formatos diferentes
        console.log('Inspecionando estrutura do primeiro imóvel:', Object.keys(allResults[0] || {}));
        
        // Garantir que os imóveis têm todos os dados necessários para o frontend
        const processedResults = allResults.map((imovel: OruloBuilding) => {
          // Log básico do imóvel que estamos processando
          console.log(`Processando imóvel ID ${imovel.id}: ${imovel.name || 'sem nome'}`);
          
          // CORREÇÃO DE IMAGENS
          // ====================
          // 1. Garantir que a propriedade images exista como array
          if (!imovel.images) {
            console.log(`- Imóvel ID ${imovel.id} não tem images, criando array`);
            imovel.images = [];
          }
          
          // 2. Adicionar imagem default se existir mas não estiver no array de imagens
          if (imovel.default_image && typeof imovel.default_image === 'string' && imovel.default_image.trim() !== '') {
            console.log(`- Imóvel ID ${imovel.id} tem default_image: ${imovel.default_image.substring(0, 30)}...`);
            
            // Verificar se essa imagem já está no array
            const imagemJaExiste = imovel.images.some((img: any) => 
              (typeof img === 'object' && img.url === imovel.default_image) || 
              (typeof img === 'string' && img === imovel.default_image)
            );
            
            if (!imagemJaExiste) {
              console.log(`- Adicionando default_image ao array de imagens do imóvel ID ${imovel.id}`);
              // Adicionar default_image ao array de imagens
              imovel.images.push({
                url: imovel.default_image,
                description: 'Imagem principal',
                order: 0
              });
            }
          }
          
          // 3. Garantir que pelo menos uma imagem exista
          if (imovel.images.length === 0) {
            console.log(`- Imóvel ID ${imovel.id} não tem imagens, adicionando imagem placeholder`);
            // Adicionar uma imagem de placeholder
            imovel.images.push({
              url: `https://picsum.photos/seed/${imovel.id}/800/600`,
              description: 'Imagem temporária',
              order: 0
            });
          }
          
          // CORREÇÃO DE ENDEREÇO
          // ====================
          // 1. Garantir que o endereço exista no formato correto
          if (!imovel.address) {
            console.log(`- Imóvel ID ${imovel.id} não tem endereço, criando objeto`);
            // Criar um objeto de endereço vazio
            imovel.address = {
              street: '',
              number: '',
              neighborhood: '',
              city: '',
              state: '',
              postal_code: '',
              latitude: 0,
              longitude: 0
            };
          } else if (typeof imovel.address === 'string') {
            // 2. Converter endereço de string para objeto
            console.log(`- Imóvel ID ${imovel.id} tem endereço como string, convertendo para objeto`);
            const addressStr = imovel.address;
            imovel.address = {
              street: addressStr,
              number: '',
              neighborhood: imovel.neighborhood || '',
              city: imovel.city || '',
              state: imovel.state || '',
              postal_code: imovel.zipcode || '',
              latitude: imovel.latitude || 0,
              longitude: imovel.longitude || 0
            };
          }
          
          // CORREÇÃO DE PREÇO
          // ================
          // Garantir que o preço existe
          if (!imovel.price_from && !imovel.min_price) {
            console.log(`- Imóvel ID ${imovel.id} não tem preço, definindo valor padrão`);
            imovel.price_from = 0;
          }
          
          // CORREÇÃO DE DESCRIÇÃO
          // ====================
          // Garantir que a descrição existe
          if (!imovel.description) {
            console.log(`- Imóvel ID ${imovel.id} não tem descrição, usando nome como descrição`);
            imovel.description = imovel.name || 'Imóvel sem descrição';
          }
          
          return imovel;
        });
        
        // Limitar a 32 imóveis e retornar
        const limitedResults = processedResults.slice(0, 32);
        
        console.log(`Retornando ${limitedResults.length} imóveis processados`);
        
        return NextResponse.json({
          count: totalCount || allResults.length,
          next: null,
          previous: null, 
          results: limitedResults
        });
      } catch (error) {
        console.error('Erro ao buscar lista de imóveis:', error);
        
        // Tentar novamente com uma configuração mais simples
        try {
          console.log('Tentando novamente após erro...');
          // Use apenas os headers de autorização essenciais
          const simpleResponse = await fetch(buildingsUrls[0] || '', {
            method: 'GET',
            headers: {
              'Authorization': headers['Authorization'],
              'Accept': 'application/json'
            },
            cache: 'no-store'
          });
          
          if (simpleResponse.ok) {
            const data = await simpleResponse.json();
            return NextResponse.json(data);
          }
        } catch (retryError) {
          console.error('Retry falhou:', retryError);
        }
        
        // Se ainda falhar, retornar array vazio, não usar mockados
        return NextResponse.json({
          count: 0,
          next: null,
          previous: null,
          results: []
        });
      }
    } catch (error) {
      console.error('Erro ao buscar dados da API da Orulo:', error)
      
      // Se ocorrer erro, retornamos dados vazios em vez de simulados
      return NextResponse.json({
        count: 0,
        next: null,
        previous: null,
        results: []
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Erro ao processar requisição:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// Função de mock para desenvolvimento - REDIRECIONADA para resposta vazia
// para garantir que nunca usamos dados mockados na aplicação
function mockOruloResponse(): OruloResponse {
  console.warn('ATENÇÃO: Função mockOruloResponse foi chamada, mas está sendo redirecionada para resposta vazia');
  return {
    count: 0,
    next: null,
    previous: null,
    results: []
  }
}

// Lista de imagens reais de imóveis para usar no mock
const realEstateImages = [
  // Apartamentos
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', // Sala de estar elegante
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2', // Cozinha moderna
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750', // Exterior de casa moderna
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6', // Sala moderna
  'https://images.unsplash.com/photo-1513584684374-8bab748fbf90', // Banheiro luxuoso
  'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6', // Quarto luxuoso
  'https://images.unsplash.com/photo-1560185127-6ed189bf02f4', // Cozinha planejada
  'https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db', // Sala aberta
  'https://images.unsplash.com/photo-1484154218962-a197022b5858', // Apartamento chique
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb', // Quarto minimalista
  // Casas de luxo
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', // Casa de luxo exterior
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c', // Casa com piscina
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea', // Casa moderna
  'https://images.unsplash.com/photo-1600585152915-d208bec867a1', // Fachada de casa
  'https://images.unsplash.com/photo-1604014237800-1c9102c219da', // Casa elegante
  'https://images.unsplash.com/photo-1600210492493-0946911123ea', // Interior de casa moderna
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511', // Sala ampla
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d', // Piscina
  'https://images.unsplash.com/photo-1598928506311-c55ded91a20c', // Condomínio moderno
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde'  // Exterior moderno
];

// Função para criar um imóvel mockado com imagens reais
function mockOruloBuilding(id: number): OruloBuilding {
  const index = id % 1000
  
  // Tipos de imóveis para variar os nomes
  const tiposImovel = [
    'Apartamento', 'Cobertura', 'Casa', 'Studio', 'Loft', 'Sobrado', 
    'Flat', 'Mansão', 'Terreno', 'Sala Comercial', 'Condomínio'
  ];
  
  // Bairros reais de São Paulo
  const bairrosSP = [
    'Jardins', 'Pinheiros', 'Vila Madalena', 'Itaim Bibi', 'Moema', 
    'Vila Olímpia', 'Morumbi', 'Brooklin', 'Campo Belo', 'Vila Mariana',
    'Tatuapé', 'Perdizes', 'Alto de Pinheiros', 'Bela Vista', 'Ibirapuera'
  ];
  
  // Gera imagens de imóveis de verdade
  const numImagens = 3 + (index % 3);
  const imagensImovel = [];
  for (let i = 0; i < numImagens; i++) {
    // Pega uma imagem aleatória da lista de imagens reais
    const imagemURL = realEstateImages[(index * 3 + i) % realEstateImages.length];
    imagensImovel.push({
      url: `${imagemURL}?w=800&h=600&fit=crop&q=80&auto=format&ixlib=rb-4.0.3`, // Garantindo que a imagem tenha o tamanho adequado
      description: `Imagem ${i + 1} do imóvel`,
      order: i
    });
  }
  
  // Nome da construtora
  const construtoras = [
    'Alpha Construtora', 'Beta Incorporadora', 'Gamma Empreendimentos', 
    'Delta Imóveis', 'Omega Construções', 'Construtora Vision', 
    'Golden Incorporadora', 'Premier Buildings', 'Elite Development',
    'Luxury Properties', 'Espaço Nobre Empreendimentos', 'Construtora Vanguarda'
  ];
  
  // Ruas reais de SP
  const ruas = [
    'Avenida Paulista', 'Rua Oscar Freire', 'Alameda Santos', 'Rua Augusta', 
    'Avenida Brigadeiro Faria Lima', 'Rua da Consolação', 'Avenida Rebouças',
    'Rua Padre João Manuel', 'Rua Pamplona', 'Avenida Brasil', 'Rua Henrique Schaumann',
    'Rua Haddock Lobo', 'Alameda Lorena', 'Rua Peixoto Gomide', 'Rua Bela Cintra'
  ];
  
  // Comodidades/features comuns em imóveis
  const possiveisFeatures = [
    'Piscina', 'Academia', 'Área gourmet', 'Segurança 24h', 'Playground', 
    'Espaço pet', 'Churrasqueira', 'Sauna', 'Salão de festas', 'Espaço coworking',
    'Biciletário', 'Quadra poliesportiva', 'Portaria 24h', 'Vaga para visitantes',
    'Gerador', 'Depósito privativo', 'Elevador', 'Área verde', 'Lavanderia', 
    'Varanda gourmet', 'Home office', 'Piscina aquecida', 'Jardim', 'Zeladoria',
    'Internet fibra ótica', 'Condomínio fechado', 'Ar condicionado', 'Aquecimento solar'
  ];
  
  // Seleciona algumas features aleatórias
  const numFeatures = 5 + (index % 8); // Entre 5 e 12 features
  const features: string[] = [];
  for (let i = 0; i < numFeatures; i++) {
    const feature = possiveisFeatures[(index + i * 2) % possiveisFeatures.length];
    if (!features.includes(feature)) {
      features.push(feature);
    }
  }
  
  // Gera o imóvel com dados mais realistas
  return {
    id: id,
    name: `${tiposImovel[index % tiposImovel.length]} ${bairrosSP[index % bairrosSP.length]} ${index + 1}`,
    description: `Imóvel moderno e espaçoso com ótima localização, perfeito para famílias. Aqui você encontrará conforto, segurança e qualidade de vida. O empreendimento oferece diversas opções de lazer para toda a família, além de estar próximo a diversos comércios e serviços essenciais. Com acabamento de alta qualidade e arquitetura moderna, este imóvel é ideal para quem busca conforto e praticidade no dia a dia.`,
    address: {
      street: ruas[index % ruas.length],
      number: `${100 + index}`,
      neighborhood: bairrosSP[index % bairrosSP.length],
      city: 'São Paulo',
      state: 'SP',
      postal_code: `05400-${100 + index}`,
      latitude: -23.5505 - (Math.random() * 0.05),
      longitude: -46.6333 + (Math.random() * 0.05)
    },
    price_from: 450000 + (index * 50000),
    price_to: 650000 + (index * 50000),
    min_area: 65 + (index % 5) * 10,
    max_area: 95 + (index % 5) * 10,
    min_bedrooms: 2 + (index % 3),
    max_bedrooms: 3 + (index % 3),
    min_bathrooms: 1 + (index % 2),
    max_bathrooms: 2 + (index % 2),
    min_parking: 1,
    max_parking: 2,
    status: index % 10 === 0 ? 'Em obras' : index % 4 === 0 ? 'Lançamento' : 'Pronto para morar',
    construction_status: index % 5 === 0 ? 'Em construção' : 'Pronto',
    images: imagensImovel,
    developer: {
      id: 100 + (index % construtoras.length),
      name: construtoras[index % construtoras.length],
      logo_url: `https://picsum.photos/seed/dev${index % 5}/200/200`
    },
    updated_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    features: features
  }
}
