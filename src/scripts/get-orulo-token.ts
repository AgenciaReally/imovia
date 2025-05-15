/**
 * Script para obter um token OAuth2 da API Orulo diretamente
 * Execução: ts-node src/scripts/get-orulo-token.ts
 */
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Carregar variáveis de ambiente
dotenv.config();

// Configurações Orulo - usar as mesmas do projeto
const CLIENT_ID = process.env.ORULO_CLIENT_ID || 'NVMeJ6c9nVZM3kMYhPBwU6CvL4CQbAgiZMLcuMgvfXA';
const CLIENT_SECRET = process.env.ORULO_CLIENT_SECRET || 'LFCtyXG3QP3V5o9pkXGjRJvKKf0gwozPiJ7TuDs8kmQ';

async function main() {
  console.log('Obtendo token OAuth2 da Orulo...');
  
  try {
    // Preparar parâmetros para OAuth2
    const params = new URLSearchParams({
      'grant_type': 'client_credentials',
      'client_id': CLIENT_ID,
      'client_secret': CLIENT_SECRET,
    });
    
    console.log('Enviando requisição OAuth2 para:', 'https://www.orulo.com.br/oauth/token');
    console.log('Parâmetros:', params.toString());
    
    // Fazer requisição para obter token
    const tokenResponse = await fetch('https://www.orulo.com.br/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: params
    });
    
    if (!tokenResponse.ok) {
      console.error('Erro ao obter token:', tokenResponse.status, tokenResponse.statusText);
      console.error(await tokenResponse.text());
      return;
    }
    
    const tokenData = await tokenResponse.json();
    console.log('Token obtido com sucesso!');
    console.log('access_token:', tokenData.access_token?.substring(0, 20) + '...');
    console.log('expires_in:', tokenData.expires_in);
    
    // Usar o token para buscar imóveis
    console.log('\nBuscando imóveis com o token...');
    
    const buildingsUrl = 'https://www.orulo.com.br/api/v2/buildings?page=1&per_page=32';
    const buildingsResponse = await fetch(buildingsUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/json',
      }
    });
    
    if (!buildingsResponse.ok) {
      console.error('Erro ao buscar imóveis:', buildingsResponse.status, buildingsResponse.statusText);
      console.error(await buildingsResponse.text());
      return;
    }
    
    const buildingsData = await buildingsResponse.json();
    console.log('Imóveis obtidos com sucesso!');
    console.log('Total de imóveis:', buildingsData.count);
    console.log('Imóveis na página:', buildingsData.results.length);
    
    // Salvar imóveis em um arquivo para uso posterior
    const outputDir = path.join(__dirname, '..', 'cache');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, 'orulo-buildings.json');
    fs.writeFileSync(outputPath, JSON.stringify(buildingsData, null, 2));
    console.log(`\nDados salvos em: ${outputPath}`);
    
    // Salvar também o token para uso pela aplicação
    const tokenPath = path.join(outputDir, 'orulo-token.json');
    fs.writeFileSync(tokenPath, JSON.stringify({
      ...tokenData,
      expires_at: Date.now() + (tokenData.expires_in * 1000),
    }));
    console.log(`Token salvo em: ${tokenPath}`);
    
  } catch (error) {
    console.error('Erro:', error);
  }
}

main();
