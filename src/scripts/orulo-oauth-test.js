// Teste de autenticação OAuth2 com a API da Orulo usando Node.js
const fetch = require('node-fetch');
const readline = require('readline');

// Criar interface para input do usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Novas credenciais fornecidas pelo usuário
const CLIENT_ID = '5XiTt4QaH8zalFH-byzBw-bpRgxkxSFewly9pWdQeTQ';
const CLIENT_SECRET = 'KphfUnhkeUX_5-44XzuFF1KYTHoQq8ahGbqeBLu4J9o';
const REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob'; // padrão para apps sem URL de callback

// Função principal
async function testOruloOAuth() {
  try {
    // Passo 1: Obter o código de autorização
    const authorizationUrl = `https://www.orulo.com.br/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    console.log(`\nAcesse a seguinte URL no seu navegador para autorizar o acesso:`);
    console.log(`\n${authorizationUrl}\n`);
    
    // Solicitar o código de autorização ao usuário
    const authorizationCode = await new Promise((resolve) => {
      rl.question('Após autorizar, cole o código aqui: ', (code) => {
        resolve(code.trim());
      });
    });
    
    console.log('\nSolicitando token de acesso...');
    
    // Passo 2: Trocar o código de autorização por um token de acesso
    const tokenResponse = await fetch('https://www.orulo.com.br/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: authorizationCode,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });
    
    if (!tokenResponse.ok) {
      console.error(`Erro ao solicitar token: ${tokenResponse.status}`);
      const errorData = await tokenResponse.text();
      console.error(`Detalhes: ${errorData}`);
      
      // Tentar método alternativo com client credentials
      console.log('\nTentando método alternativo (client_credentials)...');
      
      const altTokenResponse = await fetch('https://api.orulo.com.br/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        }),
      });
      
      if (!altTokenResponse.ok) {
        console.error(`Falha no método alternativo: ${altTokenResponse.status}`);
        const altErrorData = await altTokenResponse.text();
        console.error(`Detalhes: ${altErrorData}`);
        
        // Tentar com headers X-Client-ID e X-Secret
        console.log('\nTentando com headers X-Client-ID e X-Secret...');
        
        const headerResponse = await fetch('https://api.orulo.com.br/buildings?page=1&page_size=1', {
          method: 'GET',
          headers: {
            'X-Client-ID': CLIENT_ID,
            'X-Secret': CLIENT_SECRET,
            'Content-Type': 'application/json',
          },
        });
        
        if (!headerResponse.ok) {
          console.error(`Falha com headers: ${headerResponse.status}`);
          const headerErrorData = await headerResponse.text();
          console.error(`Detalhes: ${headerErrorData}`);
          throw new Error('Todos os métodos de autenticação falharam');
        } else {
          const headerData = await headerResponse.json();
          console.log('Sucesso com headers X-Client-ID e X-Secret!');
          console.log(`Total de imóveis: ${headerData.count || 'N/A'}`);
          console.log(`Resultados obtidos: ${headerData.results?.length || 0}`);
        }
        
        return;
      }
      
      const altTokenData = await altTokenResponse.json();
      console.log('Token obtido com método client_credentials!');
      console.log(`Access Token: ${altTokenData.access_token.substring(0, 10)}...${altTokenData.access_token.substring(altTokenData.access_token.length - 5)}`);
      
      // Testar acesso à API com este token
      await testApiAccess(altTokenData.access_token);
      return;
    }
    
    const tokenData = await tokenResponse.json();
    console.log('Token obtido com sucesso!');
    console.log(`Access Token: ${tokenData.access_token.substring(0, 10)}...${tokenData.access_token.substring(tokenData.access_token.length - 5)}`);
    console.log(`Tipo: ${tokenData.token_type}`);
    console.log(`Expiração: ${tokenData.expires_in} segundos`);
    
    // Passo 3: Testar acesso à API com o token
    await testApiAccess(tokenData.access_token);
    
  } catch (error) {
    console.error(`Erro durante a execução: ${error.message}`);
  } finally {
    rl.close();
  }
}

// Função para testar o acesso à API com o token
async function testApiAccess(accessToken) {
  console.log('\nTestando acesso à API...');
  
  try {
    // Tentar obter lista de IDs de imóveis ativos
    const apiResponse = await fetch('https://www.orulo.com.br/api/v2/buildings/ids/active', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!apiResponse.ok) {
      console.error(`Falha ao acessar a API principal: ${apiResponse.status}`);
      
      // Tentar endpoint alternativo
      console.log('Tentando endpoint alternativo...');
      
      const altResponse = await fetch('https://api.orulo.com.br/buildings?page=1&page_size=5', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (!altResponse.ok) {
        console.error(`Falha no endpoint alternativo: ${altResponse.status}`);
        const altErrorData = await altResponse.text();
        console.error(`Detalhes: ${altErrorData}`);
        return;
      }
      
      const altData = await altResponse.json();
      console.log('Acesso alternativo bem-sucedido!');
      console.log(`Total de imóveis: ${altData.count || 'N/A'}`);
      console.log(`Resultados obtidos: ${altData.results?.length || 0}`);
      
      if (altData.results?.length > 0) {
        console.log('\nPrimeiro imóvel:');
        const primeiroImovel = altData.results[0];
        console.log(`ID: ${primeiroImovel.id}`);
        console.log(`Nome: ${primeiroImovel.name}`);
        console.log(`Endereço: ${primeiroImovel.address?.street}, ${primeiroImovel.address?.neighborhood}`);
        console.log(`Cidade: ${primeiroImovel.address?.city}, ${primeiroImovel.address?.state}`);
      }
      
      return;
    }
    
    const activeBuildings = await apiResponse.json();
    console.log('Acesso bem-sucedido!');
    console.log(`Total de imóveis ativos: ${activeBuildings.length}`);
    
    if (activeBuildings.length > 0) {
      console.log('\nPrimeiros 5 IDs:');
      activeBuildings.slice(0, 5).forEach(id => {
        console.log(` - ${id}`);
      });
    }
    
  } catch (error) {
    console.error(`Erro ao testar API: ${error.message}`);
  }
}

// Executar o teste
testOruloOAuth();
