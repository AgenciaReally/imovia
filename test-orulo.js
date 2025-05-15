// Script de teste para a integração com a API da Orulo
require('dotenv').config();
const axios = require('axios');

// Credenciais da Orulo
const CLIENT_ID = process.env.ORULO_CLIENT_ID || 'NVMeJ6c9nVZM3kMYhPBwU6CvL4CQbAgiZMLcuMgvfXA';
const CLIENT_SECRET = process.env.ORULO_CLIENT_SECRET || 'LFCtyXG3QP3V5o9pkXGjRJvKKf0gwozPiJ7TuDs8kmQ';

// URLs da API
const TOKEN_URL = 'https://www.orulo.com.br/oauth/token';
const BUILDINGS_URL = 'https://api.orulo.com.br/buildings';

// Chave da API (opcional, para tentar método alternativo)
const API_KEY = process.env.ORULO_API_KEY || '';

async function main() {
  try {
    // 1) Obter o token de autenticação
    console.log('Obtendo token OAuth...');
    
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
    console.log('Token obtido com sucesso!');
    console.log('- Token:', token.substring(0, 15) + '...');
    console.log('- Expira em:', tokenResponse.data.expires_in, 'segundos');
    
    // 2) Tentar diferentes métodos de autenticação
    console.log('\nTentando métodos alternativos de autenticação...');
    
    // Tentativa 1: Usando URL da documentação fornecida pelo usuário
    try {
      console.log('\nMétodo 1: Bearer token com URL da documentação');
      
      // Documentação da API da Orulo
      console.log('Informações para integração com a Orulo:');
      console.log('- Client ID:', CLIENT_ID);
      console.log('- Token obtido com sucesso:', token.substring(0, 15) + '...');
      
      // Tentando a URL exata fornecida pelo usuário
      const url1 = 'https://www.orulo.com.br/api/v2/buildings';
      console.log('URL:', url1);
      
      const authHeader = `Bearer ${token}`;
      console.log('Authorization:', authHeader);
      
      const response1 = await axios.get(url1, {
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json'
        }
      });
      
      console.log('Sucesso! Status:', response1.status);
      return response1.data;
    } catch (error1) {
      console.log('Falha no método 1:', error1.response?.status, error1.message);
      console.log('Detalhes:', error1.response?.data || {});
    }
    
    // Tentativa 2: API padrão com cliente_id e client_secret como parâmetros
    try {
      console.log('\nMétodo 2: client_id e client_secret como parâmetros');
      const url2 = 'https://api.orulo.com.br/buildings';
      console.log('URL:', url2);
      
      const response2 = await axios.get(url2, {
        params: { 
          page: 1, 
          per_page: 5,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET
        }
      });
      
      console.log('Sucesso! Status:', response2.status);
      return response2.data;
    } catch (error2) {
      console.log('Falha no método 2:', error2.response?.status, error2.message);
      console.log('Detalhes:', error2.response?.data || {});
    }
    
    // Tentativa 3: Usando X-Client-ID e X-Secret nos headers
    try {
      console.log('\nMétodo 3: X-Client-ID e X-Secret nos headers');
      const url3 = 'https://api.orulo.com.br/buildings';
      console.log('URL:', url3);
      
      const response3 = await axios.get(url3, {
        headers: {
          'X-Client-ID': CLIENT_ID,
          'X-Secret': CLIENT_SECRET,
          'Accept': 'application/json'
        },
        params: { page: 1, per_page: 5 }
      });
      
      console.log('Sucesso! Status:', response3.status);
      return response3.data;
    } catch (error3) {
      console.log('Falha no método 3:', error3.response?.status, error3.message);
      console.log('Detalhes:', error3.response?.data || {});
    }
    
    // Nenhum método funcionou
    throw new Error('Todos os métodos de autenticação falharam');
    
    // 3) Mostrar resultados
    const buildings = buildingsResponse.data;
    console.log('\n=== RESULTADO ===');
    console.log(`Total de imóveis encontrados: ${buildings.count || buildings.total || buildings.length || 0}`);
    
    if (buildings.results && buildings.results.length > 0) {
      console.log('\nPrimeiros imóveis:');
      buildings.results.slice(0, 3).forEach((building, index) => {
        console.log(`\n[${index + 1}] ${building.name || 'Sem nome'}`);
        console.log(`   - ID: ${building.id}`);
        console.log(`   - Endereço: ${building.address?.street || building.address || 'Não informado'}`);
        console.log(`   - Bairro: ${building.address?.neighborhood || building.neighborhood || 'Não informado'}`);
        console.log(`   - Preço: ${building.price_from || building.min_price || 'Não informado'}`);
      });
    }
    
    console.log('\nTeste concluído com sucesso!');
  } catch (error) {
    console.error('Erro:');
    
    if (error.response) {
      // A API retornou uma resposta com status de erro
      console.error(`Status: ${error.response.status}`);
      console.error('Dados:');
      console.error(JSON.stringify(error.response.data || error.response.statusText, null, 2));
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Sem resposta do servidor');
      console.error(error.request);
    } else {
      // Erro na configuração da requisição
      console.error('Erro na requisição:', error.message);
    }
  }
}

// Executar o teste
main();
