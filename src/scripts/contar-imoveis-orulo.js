// Script para contar o total de imóveis na API da Orulo

// Token válido obtido pelo client_credentials
const ACCESS_TOKEN = '7ixDtDZPeQNDDoY9-PYeCCsVKPDcmf2GRecomKOXX40';

async function contarImoveisOrulo() {
  console.log('Verificando total de imóveis na API da Orulo...');
  
  try {
    // Usando o endpoint que funcionou nos testes anteriores
    const response = await fetch('https://www.orulo.com.br/api/v2/buildings?page=1&page_size=1', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('\n=== RESULTADO DA CONTAGEM ===');
    console.log(`Total de imóveis: ${data.total || 'Não informado'}`);
    
    if (data.total) {
      console.log(`Total de páginas: ${data.total_pages || 'Não informado'}`);
      console.log(`Limite de resultados excedido: ${data.results_limit_exceeded ? 'Sim' : 'Não'}`);
    }
    
    // Verificando detalhes adicionais
    if (data.buildings && data.buildings.length > 0) {
      const primeiroImovel = data.buildings[0];
      console.log('\nExemplo de imóvel disponível:');
      console.log(`ID: ${primeiroImovel.id}`);
      console.log(`Nome: ${primeiroImovel.name}`);
      console.log(`Preço mínimo: R$ ${primeiroImovel.min_price?.toLocaleString('pt-BR') || 'Não informado'}`);
      console.log(`Dormitórios: ${primeiroImovel.min_bedrooms || 'N/A'} - ${primeiroImovel.max_bedrooms || 'N/A'}`);
      
      if (primeiroImovel.address) {
        console.log(`Cidade: ${primeiroImovel.address.city || 'N/A'}`);
        console.log(`Estado: ${primeiroImovel.address.state || 'N/A'}`);
      }
    }
    
    return data.total;
  } catch (error) {
    console.error('Erro ao contar imóveis:', error.message);
    return null;
  }
}

// Executar
contarImoveisOrulo();
