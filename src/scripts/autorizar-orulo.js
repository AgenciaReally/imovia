// Script para autorização da API Orulo e obtenção de token

// Credenciais fornecidas
const CLIENT_ID = 'NVMeJ6c9nVZM3kMYhPBwU6CvL4CQbAgiZMLcuMgvfXA';
const CLIENT_SECRET = 'LFCtyXG3QP3V5o9pkXGjRJvKKf0gwozPiJ7TuDs8kmQ';
const REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob'; // padrão para apps sem URL de callback

// Função principal que executa o fluxo de autorização
async function autorizarOrulo() {
  // Passo 1: Gerar a URL de autorização
  const authorizationUrl = `https://www.orulo.com.br/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  
  console.log('==== AUTORIZAÇÃO ORULO ====');
  console.log('1. Acesse a URL abaixo no seu navegador:');
  console.log('\x1b[36m%s\x1b[0m', authorizationUrl); // Colorido em ciano
  console.log('2. Faça login e autorize o acesso');
  console.log('3. Copie o código de autorização que será exibido');
  console.log('4. Execute o script trocar-token-orulo.js com o código obtido');
  console.log('==========================');
  
  // Opcional: se quiser automatizar todo o processo, descomente o código abaixo
  /*
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  readline.question('Cole o código de autorização aqui: ', async (code) => {
    console.log(`Código recebido: ${code}`);
    await trocarCodigoPorToken(code);
    readline.close();
  });
  */
}

// Função para trocar o código de autorização por um token
async function trocarCodigoPorToken(authorizationCode) {
  console.log('\nTrocando código por token...');
  
  try {
    // Preparar os dados para a requisição
    const formData = new URLSearchParams();
    formData.append('grant_type', 'authorization_code');
    formData.append('code', authorizationCode);
    formData.append('redirect_uri', REDIRECT_URI);
    formData.append('client_id', CLIENT_ID);
    formData.append('client_secret', CLIENT_SECRET);
    
    // Fazer a requisição para obter o token
    const response = await fetch('https://www.orulo.com.br/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro ao obter token: ${response.status}`);
      console.error(`Detalhes: ${errorText}`);
      return null;
    }
    
    const tokenData = await response.json();
    
    console.log('\n==== TOKEN OBTIDO COM SUCESSO ====');
    console.log('Access Token:');
    console.log('\x1b[32m%s\x1b[0m', tokenData.access_token); // Colorido em verde
    console.log(`Tipo: ${tokenData.token_type}`);
    console.log(`Expira em: ${tokenData.expires_in} segundos`);
    console.log(`Refresh Token: ${tokenData.refresh_token ? 'Disponível' : 'Não disponível'}`);
    console.log('================================');
    
    // Testar o token obtido
    await testarToken(tokenData.access_token);
    
    return tokenData;
  } catch (error) {
    console.error(`Erro ao trocar código por token: ${error.message}`);
    return null;
  }
}

// Função para testar o token obtido
async function testarToken(accessToken) {
  console.log('\nTestando o token obtido...');
  
  try {
    // Testar o endpoint que lista imóveis
    const response = await fetch('https://api.orulo.com.br/buildings?page=1&page_size=1', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      console.error(`Falha ao testar token: ${response.status}`);
      const errorText = await response.text();
      console.error(`Detalhes: ${errorText}`);
      return false;
    }
    
    const data = await response.json();
    
    console.log('\n==== TESTE DO TOKEN BEM-SUCEDIDO ====');
    console.log(`Total de imóveis disponíveis: ${data.count || 'Não informado'}`);
    
    if (data.results && data.results.length > 0) {
      const primeiroImovel = data.results[0];
      console.log('\nExemplo de imóvel:');
      console.log(`- ID: ${primeiroImovel.id}`);
      console.log(`- Nome: ${primeiroImovel.name}`);
      if (primeiroImovel.address) {
        console.log(`- Cidade: ${primeiroImovel.address.city}, ${primeiroImovel.address.state}`);
      }
    }
    
    console.log('\nTudo pronto para implementar a página de imóveis da Orulo!');
    console.log('=====================================');
    
    return true;
  } catch (error) {
    console.error(`Erro ao testar token: ${error.message}`);
    return false;
  }
}

// Executar o script
autorizarOrulo();
