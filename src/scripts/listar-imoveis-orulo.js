// Script para listar imóveis da API Orulo usando o token obtido

// Token válido obtido pelo client_credentials
const ACCESS_TOKEN = '7ixDtDZPeQNDDoY9-PYeCCsVKPDcmf2GRecomKOXX40';

async function listarImoveisOrulo() {
  console.log('Tentando listar imóveis da Orulo com o token de acesso...');
  
  // Array de endpoints para testar
  const endpoints = [
    'https://api.orulo.com.br/buildings',
    'https://api.orulo.com.br/v2/buildings',
    'https://www.orulo.com.br/api/v2/buildings',
    'https://www.orulo.com.br/api/v2/buildings/ids/active'
  ];
  
  // Para cada endpoint, tentar fazer a requisição
  let sucessoEmAlgum = false;
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\nTestando endpoint: ${endpoint}`);
      
      // Fazer a requisição
      const response = await fetch(`${endpoint}?page=1&page_size=5`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.log(`Erro ${response.status} em ${endpoint}`);
        const errorText = await response.text();
        console.log(`Detalhes: ${errorText || 'Sem detalhes'}`);
        continue;
      }
      
      // Tentar parsing do JSON
      const data = await response.json();
      sucessoEmAlgum = true;
      
      console.log(`\n=== SUCESSO em ${endpoint} ===`);
      
      if (Array.isArray(data)) {
        console.log(`Total de itens: ${data.length}`);
        if (data.length > 0) {
          console.log('Primeiros itens:');
          data.slice(0, 3).forEach((item, idx) => {
            console.log(`Item ${idx + 1}:`, JSON.stringify(item, null, 2));
          });
        } else {
          console.log('Array vazio retornado');
        }
      } else if (data && typeof data === 'object') {
        // Verificar se é formato paginado
        if (data.count !== undefined && data.results) {
          console.log(`Total de registros: ${data.count}`);
          console.log(`Registros na página: ${data.results.length}`);
          
          if (data.results.length > 0) {
            console.log('\nDetalhes dos primeiros imóveis:');
            data.results.slice(0, 3).forEach((imovel, idx) => {
              console.log(`\n--- Imóvel ${idx + 1} ---`);
              console.log(`ID: ${imovel.id}`);
              console.log(`Nome: ${imovel.name || 'N/A'}`);
              
              if (imovel.address) {
                console.log(`Endereço: ${imovel.address.street || ''}, ${imovel.address.neighborhood || ''}`);
                console.log(`Cidade: ${imovel.address.city || ''}, ${imovel.address.state || ''}`);
              }
              
              console.log(`Preço: ${imovel.min_price || 'N/A'} - ${imovel.max_price || 'N/A'}`);
              
              if (imovel.builder) {
                console.log(`Construtora: ${imovel.builder.name || 'N/A'}`);
              }
            });
          } else {
            console.log('Nenhum imóvel encontrado nesta página');
          }
        } else {
          // Outro formato de objeto
          console.log('Estrutura de dados:', Object.keys(data));
          console.log('Amostra de dados:', JSON.stringify(data, null, 2).substring(0, 500) + '...');
        }
      } else {
        console.log('Tipo de resposta inesperado:', typeof data);
        console.log('Amostra de dados:', JSON.stringify(data).substring(0, 500) + '...');
      }
    } catch (error) {
      console.error(`Erro ao acessar ${endpoint}:`, error.message);
    }
  }
  
  if (!sucessoEmAlgum) {
    console.log('\nNenhum dos endpoints testados retornou dados com sucesso.');
    console.log('Pode ser necessário verificar as permissões da sua chave de API ou a disponibilidade do serviço.');
  }
  
  // Tentativa adicional - verificar endpoints disponíveis
  try {
    console.log('\nVerificando endpoints disponíveis (documentação da API)...');
    const infoResponse = await fetch('https://api.orulo.com.br/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (infoResponse.ok) {
      const infoData = await infoResponse.json();
      console.log('Informações da API:');
      console.log(JSON.stringify(infoData, null, 2));
    } else {
      console.log(`Erro ${infoResponse.status} ao verificar documentação da API`);
    }
  } catch (error) {
    console.error('Erro ao verificar documentação da API:', error.message);
  }
}

// Executar
listarImoveisOrulo();
