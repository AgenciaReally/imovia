// Script para verificar a contagem real de imóveis na Orulo (usando ESM)

// Usando as credenciais que você já forneceu
const CLIENT_ID = 'NVMeJ6c9nVZM3kMYhPBwU6CvL4CQbAgiZMLcuMgvfXA';
const CLIENT_SECRET = 'LFCtyXG3QP3V5o9pkXGjRJvKKf0gwozPiJ7TuDs8kmQ';

async function checkOruloCount() {
  console.log('Verificando contagem real de imóveis na Orulo...');
  
  // Configurar headers com as credenciais
  const headers = {
    'Content-Type': 'application/json',
    'X-Client-ID': CLIENT_ID,
    'X-Secret': CLIENT_SECRET
  };
  
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
    console.log('=================\n');
    
    return data.count;
  } catch (error) {
    console.error('Erro ao verificar contagem de imóveis:', error);
    return null;
  }
}

// Executar a função
checkOruloCount();
