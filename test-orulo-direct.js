// Script para teste da API da Orulo - Foco em Curitiba
require('dotenv').config();
const axios = require('axios');

// Credenciais da Orulo
const CLIENT_ID = process.env.ORULO_CLIENT_ID || 'NVMeJ6c9nVZM3kMYhPBwU6CvL4CQbAgiZMLcuMgvfXA';
const CLIENT_SECRET = process.env.ORULO_CLIENT_SECRET || 'LFCtyXG3QP3V5o9pkXGjRJvKKf0gwozPiJ7TuDs8kmQ';

// URLs da API com base na documentação oficial
const TOKEN_URL = 'https://www.orulo.com.br/oauth/token';
const API_BASE = 'https://www.orulo.com.br/api/v2';
const BUILDINGS_URL = `${API_BASE}/buildings`;
const CITIES_URL = `${API_BASE}/cities`;

/**
 * Busca e analisa imóveis da API Orulo com foco em Curitiba
 */
async function main() {
  try {
    console.log('=== TESTE DA API ORULO - IMÓVEIS EM CURITIBA ===');
    console.log('Obtendo token OAuth...');
    
    // 1) Obter token OAuth2
    const tokenParams = new URLSearchParams();
    tokenParams.append('grant_type', 'client_credentials');
    tokenParams.append('client_id', CLIENT_ID);
    tokenParams.append('client_secret', CLIENT_SECRET);
    
    const tokenResponse = await axios.post(TOKEN_URL, tokenParams, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    const token = tokenResponse.data.access_token;
    console.log('Token obtido:', token.substring(0, 15) + '...');
    
    // 2) Buscar todos os imóveis disponíveis na API (máximo de 100 por página)
    console.log('\n=== BUSCANDO IMÓVEIS DISPONÍVEIS ===');
    const allBuildingsResponse = await axios.get(BUILDINGS_URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      params: {
        per_page: 100
      }
    });
    
    const totalBuildings = allBuildingsResponse.data.total || 0;
    const allBuildings = allBuildingsResponse.data.buildings || [];
    console.log(`Total de imóveis na API: ${totalBuildings}`);
    console.log(`Imóveis carregados nesta página: ${allBuildings.length}`);
    
    // 3) Analisar dados do primeiro imóvel como exemplo
    if (allBuildings.length > 0) {
      console.log('\n=== ANALISANDO ESTRUTURA DE DADOS ===');
      const sampleBuilding = allBuildings[0];
      
      // Mostrar campos disponíveis
      console.log('Campos disponíveis nos imóveis:');
      console.log(Object.keys(sampleBuilding).join(', '));
      
      // Mostrar detalhes básicos do imóvel exemplo
      console.log('\nDetalhes básicos do primeiro imóvel:');
      console.log(`- Nome: ${sampleBuilding.name || 'Não disponível'}`);
      console.log(`- ID: ${sampleBuilding.id || 'Não disponível'}`);
      console.log(`- Cidade: ${sampleBuilding.city || 'Não disponível'}`);
      console.log(`- Estado: ${sampleBuilding.state || 'Não disponível'}`);
      console.log(`- Bairro: ${sampleBuilding.neighborhood || 'Não disponível'}`);
    }
    
    // 4) Agrupar imóveis por cidade
    console.log('\n=== DISTRIBUIÇÃO DE IMÓVEIS POR CIDADE ===');
    
    const buildingsByCity = {};
    allBuildings.forEach(building => {
      // Usar o campo city se existir, ou marcar como 'Não definido'
      const city = building.city || 'Não definido';
      
      if (!buildingsByCity[city]) {
        buildingsByCity[city] = [];
      }
      buildingsByCity[city].push(building);
    });
    
    // Ordenar cidades por quantidade de imóveis (decrescente)
    const sortedCities = Object.entries(buildingsByCity)
      .sort((a, b) => b[1].length - a[1].length);
    
    console.log('Imóveis por cidade:');
    sortedCities.forEach(([city, buildings]) => {
      const percentage = ((buildings.length / allBuildings.length) * 100).toFixed(2);
      console.log(`- ${city}: ${buildings.length} imóveis (${percentage}%)`);
    });
    
    // 5) Analisar imóveis de Curitiba
    const curitibaCount = buildingsByCity['Curitiba']?.length || 0;
    const nonCuritibaCount = allBuildings.length - curitibaCount;
    
    console.log('\n=== ANÁLISE DE IMÓVEIS EM CURITIBA ===');
    console.log(`Total de imóveis em Curitiba: ${curitibaCount}`);
    console.log(`Total de imóveis em outras cidades: ${nonCuritibaCount}`);
    
    if (nonCuritibaCount === 0 && curitibaCount > 0) {
      console.log('RESULTADO: Todos os imóveis estão em Curitiba!');
    } else if (curitibaCount > 0) {
      console.log(`RESULTADO: ${((curitibaCount / allBuildings.length) * 100).toFixed(2)}% dos imóveis estão em Curitiba.`);
    } else {
      console.log('RESULTADO: Nenhum imóvel encontrado em Curitiba.');
    }
    
    // 6) Tentar buscar especificamente por Curitiba
    if (curitibaCount === 0) {
      console.log('\n=== TENTANDO BUSCA ESPECÍFICA POR CURITIBA ===');
      console.log('Buscando imóveis com filtro de cidade...');
      
      try {
        const curitibaResponse = await axios.get(BUILDINGS_URL, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          params: {
            city: 'Curitiba',
            per_page: 100
          }
        });
        
        const curitibaBuildings = curitibaResponse.data.buildings || [];
        console.log(`Imóveis encontrados com filtro de cidade 'Curitiba': ${curitibaBuildings.length}`);
        
        // Mostrar primeiros imóveis se houver
        if (curitibaBuildings.length > 0) {
          console.log('\nPrimeiros imóveis em Curitiba:');
          curitibaBuildings.slice(0, 3).forEach((building, index) => {
            console.log(`\n[${index + 1}] ${building.name || 'Sem nome'}`);
            console.log(`   - ID: ${building.id}`);
            console.log(`   - Bairro: ${building.neighborhood || 'Não informado'}`);
          });
        }
      } catch (error) {
        console.log('Erro ao buscar imóveis com filtro de cidade:', error.message);
      }
    }
    
    // 7) Resumo final
    console.log('\n=== RESUMO DA ANÁLISE ===');
    console.log(`- Total de imóveis disponíveis: ${totalBuildings}`);
    console.log(`- Total de imóveis encontrados nesta consulta: ${allBuildings.length}`);
    console.log(`- Imóveis em Curitiba: ${curitibaCount}`);
    
    console.log('\nTeste concluído com sucesso!');
      
  } catch (error) {
    console.error('\nERRO NA EXECUÇÃO:');
    
    if (error.response) {
      // Erro com resposta do servidor
      console.error(`Status HTTP: ${error.response.status}`);
      console.error('Mensagem de erro:');
      console.error(JSON.stringify(error.response.data || error.response.statusText, null, 2));
    } else if (error.request) {
      // Erro sem resposta (timeout, etc)
      console.error('Sem resposta do servidor');
      console.error(error.request);
    } else {
      // Erro de requisição
      console.error('Erro na requisição:', error.message);
    }
  }
}

// Executar o teste
main();
