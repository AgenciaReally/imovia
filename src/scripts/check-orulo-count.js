// Script para verificar a contagem real de imóveis na Orulo

const CLIENT_ID = process.env.ORULO_CLIENT_ID || 'NVMeJ6c9nVZM3kMYhPBwU6CvL4CQbAgiZMLcuMgvfXA';
const CLIENT_SECRET = process.env.ORULO_CLIENT_SECRET || 'LFCtyXG3QP3V5o9pkXGjRJvKKf0gwozPiJ7TuDs8kmQ';
const API_KEY = process.env.ORULO_API_KEY;

async function checkOruloCount() {
  console.log('Verificando contagem real de imóveis na Orulo...');
  console.log('Credenciais:');
  console.log(`- Client ID: ${CLIENT_ID ? 'Configurado' : 'Não configurado'}`);
  console.log(`- Client Secret: ${CLIENT_SECRET ? 'Configurado' : 'Não configurado'}`);
  console.log(`- API Key: ${API_KEY ? 'Configurado' : 'Não configurado'}`);
  
  // Configurar headers baseado nas credenciais disponíveis
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (CLIENT_ID && CLIENT_SECRET) {
    headers['X-Client-ID'] = CLIENT_ID;
    headers['X-Secret'] = CLIENT_SECRET;
  }
  
  if (API_KEY) {
    headers['Authorization'] = `Token ${API_KEY}`;
  }
  
  try {
    // Faz requisição para obter apenas a primeira página com tamanho 1
    // para economizar banda e obter apenas a contagem total
    const response = await fetch('https://api.orulo.com.br/buildings?page=1&page_size=1', {
      method: 'GET',
      headers
    });
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('\n=== RESULTADO ===');
    console.log(`Total de imóveis disponíveis: ${data.count || 'Não informado'}`);
    console.log(`URL próxima página: ${data.next || 'Não disponível'}`);
    console.log('=================\n');
    
    // Mostrar dados do primeiro imóvel como exemplo
    if (data.results && data.results.length > 0) {
      const primeiroImovel = data.results[0];
      console.log('Exemplo de imóvel:');
      console.log(`- ID: ${primeiroImovel.id}`);
      console.log(`- Nome: ${primeiroImovel.name}`);
      console.log(`- Endereço: ${primeiroImovel.address.street}, ${primeiroImovel.address.neighborhood}`);
      console.log(`- Cidade: ${primeiroImovel.address.city}, ${primeiroImovel.address.state}`);
    }
    
    return data.count;
  } catch (error) {
    console.error('Erro ao verificar contagem de imóveis:', error);
    return null;
  }
}

// Executar a função
checkOruloCount();
