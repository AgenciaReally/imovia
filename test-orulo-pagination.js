// Script para buscar todos os imóveis em Curitiba usando paginação
require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

// Credenciais da API Orulo
const CLIENT_ID = process.env.ORULO_CLIENT_ID || 'NVMeJ6c9nVZM3kMYhPBwU6CvL4CQbAgiZMLcuMgvfXA';
const CLIENT_SECRET = process.env.ORULO_CLIENT_SECRET || 'LFCtyXG3QP3V5o9pkXGjRJvKKf0gwozPiJ7TuDs8kmQ';

// URLs da API
const TOKEN_URL = 'https://www.orulo.com.br/oauth/token';
const BUILDINGS_URL = 'https://www.orulo.com.br/api/v2/buildings';

// Filtros de Curitiba
const CURITIBA_PARAMS = {
  city_slug: 'curitiba',
  map_sw_lat: '-25.55949592590332',
  map_sw_lng: '-49.35896301269531',
  map_ne_lat: '-25.354276657104492',
  map_ne_lng: '-49.19785690307617'
};

async function main() {
  try {
    console.log('===== BUSCANDO TODOS OS IMÓVEIS EM CURITIBA COM PAGINAÇÃO =====');
    
    // Obter token de autenticação
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
    
    // Iniciar busca paginada
    console.log('Iniciando busca paginada de imóveis em Curitiba...');
    
    let page = 1;
    let hasMorePages = true;
    const allBuildings = [];
    
    const maxPages = 50; // Limite de segurança para evitar loops infinitos
    
    while (hasMorePages && page <= maxPages) {
      console.log(`\nBuscando página ${page}...`);
      
      // Adicionar página aos parâmetros
      const params = {
        ...CURITIBA_PARAMS,
        page: page.toString(),
        per_page: '10' // A API só retorna 10 por página, independentemente do valor aqui
      };
      
      try {
        const response = await axios.get(BUILDINGS_URL, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          },
          params: params
        });
        
        const data = response.data;
        
        // Processar resultados baseado no formato da resposta
        let pageBuildings = [];
        let totalPages = 0;
        let nextPage = null;
        
        if (data.buildings && Array.isArray(data.buildings)) {
          pageBuildings = data.buildings;
          totalPages = data.total_pages || 1;
          nextPage = data.next_page_url;
        } else if (data.results && Array.isArray(data.results)) {
          pageBuildings = data.results;
          totalPages = Math.ceil((data.count || 0) / 10);
          nextPage = data.next;
        } else if (Array.isArray(data)) {
          pageBuildings = data;
        }
        
        // Adicionar imóveis encontrados ao array principal
        if (pageBuildings.length > 0) {
          allBuildings.push(...pageBuildings);
          console.log(`✅ Encontrados ${pageBuildings.length} imóveis na página ${page}`);
          
          // Exemplos dos primeiros imóveis na página
          pageBuildings.slice(0, 3).forEach((building, index) => {
            console.log(`   [${index+1}] "${building.name || 'Sem nome'}" (ID: ${building.id})`);
          });
        } else {
          console.log(`❌ Nenhum imóvel encontrado na página ${page}`);
          hasMorePages = false;
        }
        
        // Verificar se há mais páginas
        if (!nextPage && page >= totalPages) {
          hasMorePages = false;
          console.log('Chegamos à última página.');
        }
        
        // Avançar para a próxima página
        page++;
        
        // Aguardar um pouco entre as requisições para não sobrecarregar a API
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.log(`❌ Erro ao buscar página ${page}: ${error.message}`);
        if (error.response) {
          console.log(`   Status: ${error.response.status}`);
          console.log(`   Detalhes: ${JSON.stringify(error.response.data)}`);
        }
        hasMorePages = false;
      }
    }
    
    // Resumo final
    console.log('\n===== RESUMO FINAL =====');
    console.log(`Total de imóveis encontrados em Curitiba: ${allBuildings.length}`);
    
    if (allBuildings.length > 0) {
      // Salvar resultado em um arquivo JSON
      const outputFile = 'imoveis-curitiba.json';
      fs.writeFileSync(outputFile, JSON.stringify(allBuildings, null, 2));
      console.log(`\nResultados salvos em ${outputFile}`);
      
      // Análise básica dos resultados
      console.log('\n===== ANÁLISE DOS IMÓVEIS =====');
      
      // Contagem por incorporadora
      const developerCount = {};
      allBuildings.forEach(building => {
        const devName = building.developer?.name || 'Não informada';
        developerCount[devName] = (developerCount[devName] || 0) + 1;
      });
      
      console.log('\nImóveis por incorporadora:');
      Object.entries(developerCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .forEach(([name, count]) => {
          console.log(`- ${name}: ${count} imóveis`);
        });
      
      // Contagem por bairro
      const neighborhoodCount = {};
      allBuildings.forEach(building => {
        let neighborhood = '';
        
        if (typeof building.address === 'object' && building.address) {
          neighborhood = building.address.neighborhood || '';
        } else {
          neighborhood = building.neighborhood || '';
        }
        
        neighborhood = neighborhood || 'Não informado';
        neighborhoodCount[neighborhood] = (neighborhoodCount[neighborhood] || 0) + 1;
      });
      
      console.log('\nImóveis por bairro:');
      Object.entries(neighborhoodCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .forEach(([name, count]) => {
          console.log(`- ${name}: ${count} imóveis`);
        });
    }
    
    console.log('\n===== CONCLUSÃO =====');
    console.log(`Encontramos um total de ${allBuildings.length} imóveis em Curitiba.`);
    console.log('O site da Orulo mostra 441 imóveis, então há uma discrepância.');
    console.log('Possíveis explicações:');
    console.log('1. A API tem acesso limitado aos imóveis (mais provável)');
    console.log('2. Algum filtro adicional é necessário');
    console.log('3. É necessário outro endpoint ou método de autenticação');
    
  } catch (error) {
    console.error('Erro geral:', error.message);
    if (error.response) {
      console.error('Detalhes da resposta:', error.response.data);
    }
  }
}

main();
