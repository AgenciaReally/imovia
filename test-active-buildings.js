// Teste simplificado para o endpoint active buildings
require('dotenv').config();
const axios = require('axios');

const CLIENT_ID = process.env.ORULO_CLIENT_ID || 'NVMeJ6c9nVZM3kMYhPBwU6CvL4CQbAgiZMLcuMgvfXA';
const CLIENT_SECRET = process.env.ORULO_CLIENT_SECRET || 'LFCtyXG3QP3V5o9pkXGjRJvKKf0gwozPiJ7TuDs8kmQ';

const TOKEN_URL = 'https://www.orulo.com.br/oauth/token';
const API_BASE = 'https://www.orulo.com.br/api/v2';
const ACTIVE_BUILDINGS_URL = `${API_BASE}/buildings/ids/active`;

async function main() {
  try {
    console.log('===== TESTE DO ENDPOINT ACTIVE BUILDINGS =====');
    console.log('Obtendo token OAuth...');

    // Passo 1: Obter o token OAuth
    const tokenResponse = await axios.post(TOKEN_URL, {
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    });

    const tokenData = tokenResponse.data;
    const accessToken = tokenData.access_token;
    console.log(`Token obtido: ${accessToken.substring(0, 10)}...`);

    // Passo 2: Buscar imóveis ativos
    console.log(`\nBuscando imóveis no endpoint: ${ACTIVE_BUILDINGS_URL}`);
    const buildingsResponse = await axios.get(ACTIVE_BUILDINGS_URL, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    const buildingsData = buildingsResponse.data;
    
    // Analisar a estrutura da resposta
    console.log('\n===== ANÁLISE DA RESPOSTA =====');
    
    if (typeof buildingsData === 'object') {
      const keys = Object.keys(buildingsData);
      console.log(`Campos na resposta: ${keys.join(', ')}`);
      
      let totalImóveis = 0;
      
      if (buildingsData.buildings && Array.isArray(buildingsData.buildings)) {
        totalImóveis = buildingsData.buildings.length;
        console.log(`Total de imóveis no campo 'buildings': ${totalImóveis}`);
        
        if (totalImóveis > 0) {
          console.log('\nPrimeiros 3 imóveis:');
          buildingsData.buildings.slice(0, 3).forEach((building, index) => {
            console.log(`[${index + 1}] ID: ${building.id}, Nome: ${building.name || 'Sem nome'}`);
          });
        }
      } else if (buildingsData.results && Array.isArray(buildingsData.results)) {
        totalImóveis = buildingsData.results.length;
        console.log(`Total de imóveis no campo 'results': ${totalImóveis}`);
        
        if (totalImóveis > 0) {
          console.log('\nPrimeiros 3 imóveis:');
          buildingsData.results.slice(0, 3).forEach((building, index) => {
            console.log(`[${index + 1}] ID: ${building.id}, Nome: ${building.name || 'Sem nome'}`);
          });
        }
      } else if (Array.isArray(buildingsData)) {
        totalImóveis = buildingsData.length;
        console.log(`Total de imóveis (resposta como array): ${totalImóveis}`);
        
        if (totalImóveis > 0) {
          console.log('\nPrimeiros 3 imóveis:');
          buildingsData.slice(0, 3).forEach((building, index) => {
            console.log(`[${index + 1}] ID: ${building.id}, Nome: ${building.name || 'Sem nome'}`);
          });
        }
      }
      
      console.log(`\nTotal de imóveis encontrados: ${totalImóveis}`);
    } else {
      console.log(`Resposta em formato não esperado: ${typeof buildingsData}`);
    }
    
    console.log('\n===== TESTE CONCLUÍDO =====');
  } catch (error) {
    console.error('Erro:', error.message);
    if (error.response) {
      console.error('Detalhes da resposta:', error.response.data);
    }
  }
}

main();
