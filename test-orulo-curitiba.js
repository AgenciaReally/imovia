// Script para buscar imóveis em Curitiba usando as coordenadas de mapa
require('dotenv').config();
const axios = require('axios');

// Credenciais da API Orulo
const CLIENT_ID = process.env.ORULO_CLIENT_ID || 'NVMeJ6c9nVZM3kMYhPBwU6CvL4CQbAgiZMLcuMgvfXA';
const CLIENT_SECRET = process.env.ORULO_CLIENT_SECRET || 'LFCtyXG3QP3V5o9pkXGjRJvKKf0gwozPiJ7TuDs8kmQ';

// Parâmetros do mapa (extraídos da URL compartilhada)
const MAP_PARAMS = {
  map_sw_lat: '-25.55949592590332',
  map_sw_lng: '-49.35896301269531',
  map_ne_lat: '-25.354276657104492',
  map_ne_lng: '-49.19785690307617'
};

// URLs da API
const TOKEN_URL = 'https://www.orulo.com.br/oauth/token';
const BUILDINGS_URL = 'https://www.orulo.com.br/api/v2/buildings';

async function main() {
  try {
    console.log('===== BUSCANDO IMÓVEIS EM CURITIBA =====');
    
    // Obter token de autenticação usando x-www-form-urlencoded (formato correto)
    console.log('Obtendo token OAuth...');
    const tokenResponse = await axios.post(TOKEN_URL, 
      `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    const accessToken = tokenResponse.data.access_token;
    console.log(`Token obtido: ${accessToken.substring(0, 10)}...\n`);
    
    // Tentar diferentes variações de parâmetros para encontrar todos os imóveis
    const testCases = [
      {
        name: "1. Apenas endpoint básico",
        url: BUILDINGS_URL,
        params: {}
      },
      {
        name: "2. Com parâmetros de mapa",
        url: BUILDINGS_URL,
        params: MAP_PARAMS
      },
      {
        name: "3. Com cidade e estado",
        url: BUILDINGS_URL,
        params: {
          city: 'Curitiba',
          state: 'PR'
        }
      },
      {
        name: "4. Com city_slug",
        url: BUILDINGS_URL,
        params: {
          city_slug: 'curitiba'
        }
      },
      {
        name: "5. Com user_city e user_uf",
        url: BUILDINGS_URL,
        params: {
          user_city: 'Curitiba',
          user_uf: 'PR'
        }
      },
      {
        name: "6. Usar endpoint específico para Curitiba",
        url: 'https://www.orulo.com.br/api/v2/cities/curitiba/buildings',
        params: {}
      }
    ];
    
    // Testar cada caso
    console.log('Testando diferentes formas de buscar imóveis...\n');
    
    for (const testCase of testCases) {
      console.log(`\n===== TESTE: ${testCase.name} =====`);
      console.log(`URL: ${testCase.url}`);
      console.log(`Parâmetros: ${JSON.stringify(testCase.params)}`);
      
      try {
        const response = await axios.get(testCase.url, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          },
          params: testCase.params
        });
        
        const data = response.data;
        
        // Verificar formato da resposta e contar imóveis
        let buildingsCount = 0;
        let firstBuilding = null;
        
        if (data.buildings && Array.isArray(data.buildings)) {
          buildingsCount = data.buildings.length;
          firstBuilding = data.buildings[0];
        } else if (data.results && Array.isArray(data.results)) {
          buildingsCount = data.results.length;
          firstBuilding = data.results[0];
        } else if (Array.isArray(data)) {
          buildingsCount = data.length;
          firstBuilding = data[0];
        }
        
        console.log(`SUCESSO! Encontrados ${buildingsCount} imóveis`);
        
        if (buildingsCount > 0 && firstBuilding) {
          console.log(`Exemplo: "${firstBuilding.name || 'Sem nome'}" (ID: ${firstBuilding.id})`);
          
          // Se encontrarmos uma boa quantidade, mostrar mais detalhes
          if (buildingsCount > 10) {
            console.log('\nEste é o método que parece funcionar! ✓');
          }
        }
      } catch (error) {
        console.log(`FALHA! Status: ${error.response?.status || 'Desconhecido'}`);
        console.log(`Erro: ${error.message}`);
        
        if (error.response?.data) {
          console.log(`Detalhes: ${JSON.stringify(error.response.data)}`);
        }
      }
    }
    
    console.log('\n===== CONCLUSÃO =====');
    console.log('Verifique acima qual método retornou mais imóveis.');
    console.log('Use esse método para modificar a API do projeto e obter todos os imóveis de Curitiba.');
    
  } catch (error) {
    console.error('Erro geral:', error.message);
    if (error.response) {
      console.error('Detalhes da resposta:', error.response.data);
    }
  }
}

main();
