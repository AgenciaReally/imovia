// Teste da API de envio de relatório
const fetch = require('node-fetch');

async function testarAPI() {
  try {
    console.log('Testando API de envio de relatório...');
    
    const dados = {
      nome: 'Cliente Teste',
      email: 'suporte@vyzer.com.br',
      telefone: '11999998888',
      valorMaximoImovel: 500000,
      tipoImovel: 'Apartamento',
      imoveisRecomendados: [
        {
          id: 1,
          titulo: 'Apartamento Teste',
          preco: 450000,
          quartos: 2,
          banheiros: 1,
          area: 65,
          imagem: 'https://placehold.co/600x400',
          matchPercentage: 90
        }
      ]
    };
    
    // Chamar a API diretamente com curl para ver erros detalhados
    const { exec } = require('child_process');
    const jsonData = JSON.stringify(dados).replace(/"/g, '\"');
    
    exec(`curl -X POST http://localhost:3000/api/enviar-relatorio \
         -H "Content-Type: application/json" \
         -d "${jsonData}" \
         -v`, (error, stdout, stderr) => {
      console.log('\n== RESULTADO ==');
      if (error) {
        console.error(`Erro: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`Log detalhado: ${stderr}`);
      }
      console.log(`Resposta: ${stdout}`);
    });
  } catch (error) {
    console.error('Erro no teste:', error);
  }
}

testarAPI();
