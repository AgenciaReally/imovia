// Script para testar a integração com a API da Orulo usando as credenciais fornecidas

// Credenciais fornecidas
const CLIENT_ID = '5XiTt4QaH8zalFH-byzBw-bpRgxkxSFewly9pWdQeTQ';
const CLIENT_SECRET = 'KphfUnhkeUX_5-44XzuFF1KYTHoQq8ahGbqeBLu4J9o';

async function testOruloApi() {
  console.log('Testando integração com a API da Orulo...');
  
  // Método 1: Usando headers X-Client-ID e X-Secret (conforme exemplo do check-orulo.mjs)
  async function testWithHeaders() {
    console.log('\nMétodo 1: Testando com headers X-Client-ID e X-Secret');
    
    try {
      const response = await fetch('https://api.orulo.com.br/buildings?page=1&page_size=5', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-ID': CLIENT_ID,
          'X-Secret': CLIENT_SECRET
        }
      });
      
      if (!response.ok) {
        console.error(`Falha na requisição: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.error(`Detalhes do erro: ${errorText}`);
        return false;
      }
      
      const data = await response.json();
      console.log('\n=== RESULTADO ===');
      console.log(`Total de imóveis disponíveis: ${data.count || 'Não informado'}`);
      
      if (data.results && data.results.length > 0) {
        console.log('\nPrimeiros imóveis:');
        data.results.forEach((imovel, index) => {
          console.log(`${index + 1}. ${imovel.name || 'Sem nome'} (ID: ${imovel.id})`);
          console.log(`   Localização: ${imovel.address?.city || 'N/A'}, ${imovel.address?.state || 'N/A'}`);
        });
      }
      
      console.log('=================');
      return true;
    } catch (error) {
      console.error('Erro ao testar com headers:', error);
      return false;
    }
  }
  
  // Método 2: Tentando obter token com fluxo client_credentials
  async function testWithClientCredentials() {
    console.log('\nMétodo 2: Testando com fluxo client_credentials');
    
    try {
      const tokenResponse = await fetch('https://api.orulo.com.br/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET
        })
      });
      
      if (!tokenResponse.ok) {
        console.error(`Falha ao obter token: ${tokenResponse.status}`);
        const errorText = await tokenResponse.text();
        console.error(`Detalhes do erro: ${errorText}`);
        return false;
      }
      
      const tokenData = await tokenResponse.json();
      console.log('Token obtido com sucesso!');
      const tokenPreview = tokenData.access_token ? 
        `${tokenData.access_token.substring(0, 10)}...${tokenData.access_token.substring(tokenData.access_token.length - 5)}` : 
        'N/A';
      console.log(`Access Token: ${tokenPreview}`);
      
      // Testar acesso com o token
      const apiResponse = await fetch('https://api.orulo.com.br/buildings?page=1&page_size=5', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });
      
      if (!apiResponse.ok) {
        console.error(`Falha ao acessar API com token: ${apiResponse.status}`);
        const apiErrorText = await apiResponse.text();
        console.error(`Detalhes do erro: ${apiErrorText}`);
        return false;
      }
      
      const data = await apiResponse.json();
      console.log('\n=== RESULTADO ===');
      console.log(`Total de imóveis disponíveis: ${data.count || 'Não informado'}`);
      
      if (data.results && data.results.length > 0) {
        console.log('\nPrimeiros imóveis:');
        data.results.forEach((imovel, index) => {
          console.log(`${index + 1}. ${imovel.name || 'Sem nome'} (ID: ${imovel.id})`);
          console.log(`   Localização: ${imovel.address?.city || 'N/A'}, ${imovel.address?.state || 'N/A'}`);
        });
      }
      
      console.log('=================');
      return true;
    } catch (error) {
      console.error('Erro ao testar com client credentials:', error);
      return false;
    }
  }
  
  // Executar os testes
  const headersResult = await testWithHeaders();
  
  if (!headersResult) {
    console.log('\nO primeiro método falhou, tentando o segundo método...');
    const credentialsResult = await testWithClientCredentials();
    
    if (!credentialsResult) {
      console.log('\nTodos os métodos de autenticação falharam com as credenciais fornecidas.');
      console.log('Verifique se as credenciais estão corretas e se você tem acesso à API da Orulo.');
    }
  }
  
  console.log('\nTeste de integração concluído!');
}

// Executar o teste
testOruloApi();
