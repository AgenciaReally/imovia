// Script para consumir a API da Orulo usando o token já obtido

// Token de acesso gerado pela autenticação
const ACCESS_TOKEN = 'bBDU3Q6hHIAfef5s_HRzfQEoXC-3nRb_krDCHRvkrDM';

// Função para buscar empreendimentos da Orulo
async function buscarEmpreendimentos() {
  console.log('Consultando empreendimentos da API Orulo com o token fornecido...');
  
  try {
    // Buscando listagem de empreendimentos (com paginação)
    const response = await fetch('https://api.orulo.com.br/v2/buildings?page=1&page_size=10', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('\n=== RESULTADO DA CONSULTA ===');
    console.log(`Total de empreendimentos disponíveis: ${data.count || 'Não informado'}`);
    
    if (data.results && data.results.length > 0) {
      console.log('\nDetalhes dos primeiros empreendimentos:');
      data.results.forEach((imovel, index) => {
        console.log(`\n--- Empreendimento ${index + 1} ---`);
        console.log(`Nome: ${imovel.name || 'Sem nome'}`);
        console.log(`ID: ${imovel.id}`);
        console.log(`Cidade: ${imovel.address?.city || 'N/A'}`);
        console.log(`Estado: ${imovel.address?.state || 'N/A'}`);
        console.log(`Bairro: ${imovel.address?.neighborhood || 'N/A'}`);
        console.log(`Preço mínimo: ${imovel.min_price || 'N/A'}`);
        console.log(`Preço máximo: ${imovel.max_price || 'N/A'}`);
        console.log(`Construtor: ${imovel.builder?.name || 'N/A'}`);
      });
    } else {
      console.log('Nenhum empreendimento encontrado.');
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao consultar empreendimentos:', error);
    return null;
  }
}

// Função para buscar endpoints disponíveis
async function verificarEndpoints() {
  console.log('\nVerificando endpoints disponíveis na API Orulo...');
  
  try {
    const response = await fetch('https://api.orulo.com.br/v2/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('\n=== ENDPOINTS DISPONÍVEIS ===');
    console.log(JSON.stringify(data, null, 2));
    
    return true;
  } catch (error) {
    console.error('Erro ao verificar endpoints:', error);
    return false;
  }
}

// Executar as funções
async function main() {
  console.log('Iniciando consumo da API da Orulo com token...');
  
  // Buscar empreendimentos
  const empreendimentos = await buscarEmpreendimentos();
  
  if (empreendimentos) {
    // Verificar endpoints disponíveis
    await verificarEndpoints();
  }
  
  console.log('\nProcesso concluído!');
}

// Iniciar
main();
