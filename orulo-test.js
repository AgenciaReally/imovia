// Script para testar a integração com a API da Orulo usando fetch em vez de axios
const fetch = require('node-fetch');

// Credenciais fornecidas
const clientId = '5XiTt4QaH8zalFH-byzBw-bpRgxkxSFewly9pWdQeTQ';
const clientSecret = 'KphfUnhkeUX_5-44XzuFF1KYTHoQq8ahGbqeBLu4J9o';

// Função para obter o token - Método 1 com URL encoded
async function getTokenMethod1() {
  console.log('Tentando Método 1: application/x-www-form-urlencoded');
  try {
    const data = qs.stringify({
      'grant_type': 'client_credentials',
      'client_id': clientId,
      'client_secret': clientSecret 
    });
    
    const response = await axios({
      method: 'post',
      url: 'https://api.orulo.com.br/oauth/token',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    });
    
    console.log('Método 1 - Token obtido com sucesso:');
    console.log(response.data);
    return response.data.access_token;
  } catch (error) {
    console.log('Método 1 falhou');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
    } else {
      console.error('Erro:', error.message);
    }
    return null;
  }
}

// Função para obter o token - Método 2 com Basic Auth
async function getTokenMethod2() {
  console.log('\nTentando Método 2: Basic Auth com base64');
  try {
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const response = await axios({
      method: 'post',
      url: 'https://api.orulo.com.br/oauth/token',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`
      },
      data: 'grant_type=client_credentials'
    });
    
    console.log('Método 2 - Token obtido com sucesso:');
    console.log(response.data);
    return response.data.access_token;
  } catch (error) {
    console.log('Método 2 falhou');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
    } else {
      console.error('Erro:', error.message);
    }
    return null;
  }
}

// Função para obter o token - Método 3 com Form Data
async function getTokenMethod3() {
  console.log('\nTentando Método 3: multipart/form-data');
  try {
    const form = new FormData();
    form.append('grant_type', 'client_credentials');
    form.append('client_id', clientId);
    form.append('client_secret', clientSecret);
    
    const response = await axios({
      method: 'post',
      url: 'https://api.orulo.com.br/oauth/token',
      headers: { 
        ...form.getHeaders()
      },
      data: form
    });
    
    console.log('Método 3 - Token obtido com sucesso:');
    console.log(response.data);
    return response.data.access_token;
  } catch (error) {
    console.log('Método 3 falhou');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
    } else {
      console.error('Erro:', error.message);
    }
    return null;
  }
}

// Função para verificar a API diretamente
async function checkApiDirectly() {
  console.log('\nVerificando API diretamente com credênciais...');
  try {
    const response = await axios({
      method: 'get',
      url: 'https://api.orulo.com.br/v2/info',
      headers: {
        'Authorization': `Bearer ${clientId}:${clientSecret}`
      }
    });
    
    console.log('Resposta direta:');
    console.log(response.data);
    return true;
  } catch (error) {
    console.error('Erro na verificação direta:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
    } else {
      console.error('Erro:', error.message);
    }
    return false;
  }
}

// Função para obter a lista de empreendimentos
async function getEmpreendimentos(token) {
  try {
    console.log('\nBuscando empreendimentos com o token...');
    const response = await axios({
      method: 'get',
      url: 'https://api.orulo.com.br/v2/empreendimentos',
      headers: { 
        'Authorization': `Bearer ${token}` 
      }
    });
    
    console.log('Empreendimentos encontrados:');
    console.log(`Total: ${response.data.count}`);
    console.log('Lista de empreendimentos:');
    response.data.results.forEach((emp, index) => {
      console.log(`${index + 1}. ${emp.nome} (ID: ${emp.id})`);
    });
    
    return response.data;
  } catch (error) {
    console.error('Erro ao obter empreendimentos:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
    } else if (error.request) {
      console.error('Sem resposta:', error.request);
    } else {
      console.error('Erro:', error.message);
    }
    return null;
  }
}

// Executar o teste
async function runTest() {
  console.log('Iniciando teste de integração com a API da Orulo...');
  
  // Tentamos diferentes métodos de autenticação
  let token = await getTokenMethod1();
  if (!token) token = await getTokenMethod2();
  if (!token) token = await getTokenMethod3();
  
  if (token) {
    console.log(`\nToken: ${token}`);
    await getEmpreendimentos(token);
  } else {
    console.log('Não foi possível obter um token válido. Verificando API diretamente...');
    await checkApiDirectly();
  }
  
  console.log('\nTeste de integração concluído!');
}

runTest();
