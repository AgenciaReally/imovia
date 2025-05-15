// Script para obter os URLs dos imóveis na Orulo
require('dotenv').config();
const axios = require('axios');

// Credenciais da API Orulo
const CLIENT_ID = process.env.ORULO_CLIENT_ID || 'NVMeJ6c9nVZM3kMYhPBwU6CvL4CQbAgiZMLcuMgvfXA';
const CLIENT_SECRET = process.env.ORULO_CLIENT_SECRET || 'LFCtyXG3QP3V5o9pkXGjRJvKKf0gwozPiJ7TuDs8kmQ';

// URLs da API
const TOKEN_URL = 'https://www.orulo.com.br/oauth/token';
const BUILDINGS_URL = 'https://www.orulo.com.br/api/v2/buildings/ids/active';

async function main() {
  try {
    console.log('===== OBTENDO LINKS DOS IMÓVEIS NA ORULO =====');
    
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
    
    // Buscar imóveis
    console.log('Buscando imóveis...');
    const buildingsResponse = await axios.get(BUILDINGS_URL, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });
    
    const data = buildingsResponse.data;
    let buildings = [];
    
    // Processar os dados dependendo do formato retornado
    if (data.buildings && Array.isArray(data.buildings)) {
      buildings = data.buildings;
    } else if (data.results && Array.isArray(data.results)) {
      buildings = data.results;
    } else if (Array.isArray(data)) {
      buildings = data;
    }
    
    console.log(`\nEncontrados ${buildings.length} imóveis\n`);
    
    // Mostrar informações dos primeiros 10 imóveis
    console.log('===== LINKS PARA OS IMÓVEIS NA ORULO =====');
    buildings.slice(0, 10).forEach((building, index) => {
      console.log(`\n[${index + 1}] ${building.name || 'Sem nome'} (ID: ${building.id})`);
      
      // Verificar se o URL direto está disponível
      if (building.orulo_url) {
        console.log(`Link direto: ${building.orulo_url}`);
      } else {
        console.log(`Link genérico: https://www.orulo.com.br/buildings/${building.id}`);
      }
      
      // Mostrar algumas informações extras
      console.log(`Preço: ${building.price_from || building.min_price || 'Não informado'}`);
      if (building.address) {
        if (typeof building.address === 'object') {
          console.log(`Localização: ${building.address.city || ''}, ${building.address.state || ''}`);
        } else {
          console.log(`Endereço: ${building.address}`);
        }
      }
    });
    
    console.log('\n===== PARA VER UM IMÓVEL ESPECÍFICO =====');
    console.log('Copie o link acima e cole em seu navegador');
    
  } catch (error) {
    console.error('Erro ao buscar imóveis:', error.message);
    if (error.response) {
      console.error('Detalhes:', error.response.data);
    }
  }
}

main();
