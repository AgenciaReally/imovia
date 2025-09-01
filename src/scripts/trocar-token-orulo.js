// Script para trocar o código de autorização por um token de acesso

// Credenciais e código
const CLIENT_ID = '5XiTt4QaH8zalFH-byzBw-bpRgxkxSFewly9pWdQeTQ';
const CLIENT_SECRET = 'KphfUnhkeUX_5-44XzuFF1KYTHoQq8ahGbqeBLu4J9o';
const AUTHORIZATION_CODE = 'dy8N9FHo2eu25rKAgbujXlkC8qlHjNPr55_de2w7kts';
const REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob'; // padrão para apps sem URL de callback

async function trocarCodigoPorToken() {
  console.log('Trocando código de autorização por token de acesso...');

  try {
    // Passo 1: Trocar o código de autorização por um token de acesso
    const tokenResponse = await fetch('https://www.orulo.com.br/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code: AUTHORIZATION_CODE,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error(`Erro ao trocar código por token: ${tokenResponse.status}`);
      console.error(`Detalhes: ${errorText}`);
      
      // Tentar método com form-urlencoded
      console.log('\nTentando método alternativo com x-www-form-urlencoded...');
      
      const formData = new URLSearchParams();
      formData.append('grant_type', 'authorization_code');
      formData.append('code', AUTHORIZATION_CODE);
      formData.append('redirect_uri', REDIRECT_URI);
      formData.append('client_id', CLIENT_ID);
      formData.append('client_secret', CLIENT_SECRET);
      
      const tokenResponse2 = await fetch('https://www.orulo.com.br/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
      
      if (!tokenResponse2.ok) {
        const errorText2 = await tokenResponse2.text();
        console.error(`Método alternativo falhou: ${tokenResponse2.status}`);
        console.error(`Detalhes: ${errorText2}`);
        
        // Tentar método de client credentials
        console.log('\nTentando método de client credentials...');
        
        const clientFormData = new URLSearchParams();
        clientFormData.append('grant_type', 'client_credentials');
        clientFormData.append('client_id', CLIENT_ID);
        clientFormData.append('client_secret', CLIENT_SECRET);
        
        const tokenResponse3 = await fetch('https://www.orulo.com.br/oauth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: clientFormData.toString(),
        });
        
        if (!tokenResponse3.ok) {
          const errorText3 = await tokenResponse3.text();
          console.error(`Método client credentials falhou: ${tokenResponse3.status}`);
          console.error(`Detalhes: ${errorText3}`);
          return null;
        }
        
        const tokenData3 = await tokenResponse3.json();
        console.log('Token obtido com client credentials!');
        console.log('TOKEN COMPLETO (copie todo o texto abaixo):');
        console.log(tokenData3.access_token);
        console.log(`Tipo: ${tokenData3.token_type}`);
        console.log(`Expiração: ${tokenData3.expires_in} segundos`);
        
        // Testar acesso com este token
        await testarAcessoAPI(tokenData3.access_token);
        return tokenData3.access_token;
      }
      
      const tokenData2 = await tokenResponse2.json();
      console.log('Token obtido com método alternativo!');
      console.log(`Access Token: ${tokenData2.access_token.substring(0, 10)}...`);
      console.log(`Tipo: ${tokenData2.token_type}`);
      console.log(`Expiração: ${tokenData2.expires_in} segundos`);
      
      // Testar acesso com este token
      await testarAcessoAPI(tokenData2.access_token);
      return tokenData2.access_token;
    }

    const tokenData = await tokenResponse.json();
    console.log('Token obtido com sucesso!');
    console.log(`Access Token: ${tokenData.access_token.substring(0, 10)}...`);
    console.log(`Tipo: ${tokenData.token_type}`);
    console.log(`Expiração: ${tokenData.expires_in} segundos`);

    // Testar o token
    await testarAcessoAPI(tokenData.access_token);
    return tokenData.access_token;
  } catch (error) {
    console.error(`Erro durante a operação: ${error.message}`);
    return null;
  }
}

async function testarAcessoAPI(accessToken) {
  console.log('\nTestando acesso à API com o token obtido...');
  
  try {
    // Tentando listar imóveis ativos
    const apiResponse = await fetch('https://www.orulo.com.br/api/v2/buildings/ids/active', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!apiResponse.ok) {
      console.error(`Falha ao acessar a API: ${apiResponse.status}`);
      const errorDetails = await apiResponse.text();
      console.error(`Detalhes: ${errorDetails}`);
      
      // Tentar endpoint alternativo
      console.log('\nTentando endpoint alternativo...');
      const altResponse = await fetch('https://api.orulo.com.br/buildings?page=1&page_size=5', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (!altResponse.ok) {
        console.error(`Falha no endpoint alternativo: ${altResponse.status}`);
        const altErrorDetails = await altResponse.text();
        console.error(`Detalhes: ${altErrorDetails}`);
        return false;
      }
      
      const altData = await altResponse.json();
      console.log('Acesso ao endpoint alternativo bem-sucedido!');
      console.log(`Total de imóveis: ${altData.count || 'N/A'}`);
      console.log(`Resultados obtidos: ${altData.results?.length || 0}`);
      
      if (altData.results?.length > 0) {
        console.log('\nPrimeiro imóvel:');
        const primeiroImovel = altData.results[0];
        console.log(`ID: ${primeiroImovel.id}`);
        console.log(`Nome: ${primeiroImovel.name}`);
        console.log(`Cidade: ${primeiroImovel.address?.city}, ${primeiroImovel.address?.state}`);
      }
      
      return true;
    }
    
    const buildings = await apiResponse.json();
    console.log('Acesso à API bem-sucedido!');
    console.log(`Total de imóveis ativos: ${buildings.length}`);
    
    if (buildings.length > 0) {
      console.log('\nPrimeiros 5 IDs:');
      buildings.slice(0, 5).forEach(id => {
        console.log(` - ${id}`);
      });
    }
    
    return true;
  } catch (error) {
    console.error(`Erro ao testar API: ${error.message}`);
    return false;
  }
}

// Executar a troca
trocarCodigoPorToken();
