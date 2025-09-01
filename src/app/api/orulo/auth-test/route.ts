import { NextResponse } from 'next/server';

// Endpoint para testar autenticação Orulo conforme documentação
export async function GET(request: Request) {
  try {
    // Primeiro passo: obter um token de acesso usando Client ID e Secret
    const CLIENT_ID = process.env.ORULO_CLIENT_ID || 'NVMeJ6c9nVZM3kMYhPBwU6CvL4CQbAgiZMLcuMgvfXA';
    const CLIENT_SECRET = process.env.ORULO_CLIENT_SECRET || 'LFCtyXG3QP3V5o9pkXGjRJvKKf0gwozPiJ7TuDs8kmQ';
    
    console.log('Obtendo token de acesso usando Client ID e Secret...');
    
    // Fazer solicitação para obter o token (método OAuth2)
    const tokenResponse = await fetch('https://api.orulo.com.br/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'client_credentials'
      })
    });
    
    if (!tokenResponse.ok) {
      console.error(`Erro ao obter token: ${tokenResponse.status} ${tokenResponse.statusText}`);
      
      // Tentar método alternativo com headers X-Client-ID e X-Secret
      console.log('Tentando autenticação alternativa com X-Client-ID e X-Secret...');
      
      const altResponse = await fetch('https://api.orulo.com.br/buildings?page=1&page_size=1', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-ID': CLIENT_ID,
          'X-Secret': CLIENT_SECRET
        }
      });
      
      if (!altResponse.ok) {
        return NextResponse.json({ 
          error: 'Falha em ambos os métodos de autenticação',
          oauth_status: tokenResponse.status,
          oauth_statusText: tokenResponse.statusText,
          alt_status: altResponse.status,
          alt_statusText: altResponse.statusText,
          message: 'Verifique se as credenciais estão corretas e se você tem acesso à API'
        }, { status: 403 });
      }
      
      const altData = await altResponse.json();
      return NextResponse.json({
        method: 'X-Client-ID e X-Secret',
        count: altData.count,
        message: 'Autenticação bem-sucedida usando headers X-Client-ID e X-Secret'
      });
    }
    
    // Token obtido com sucesso
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    if (!accessToken) {
      return NextResponse.json({ 
        error: 'Token não encontrado na resposta',
        response: tokenData
      }, { status: 500 });
    }
    
    // Usar o token para fazer uma solicitação autenticada
    const buildingsResponse = await fetch('https://api.orulo.com.br/buildings?page=1&page_size=1', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!buildingsResponse.ok) {
      return NextResponse.json({ 
        error: 'Falha ao acessar API com token',
        status: buildingsResponse.status,
        statusText: buildingsResponse.statusText,
        token_info: {
          token_type: tokenData.token_type,
          expires_in: tokenData.expires_in
        }
      }, { status: buildingsResponse.status });
    }
    
    const buildingsData = await buildingsResponse.json();
    
    return NextResponse.json({
      success: true,
      auth_method: 'OAuth2 token',
      token_info: {
        token_type: tokenData.token_type,
        expires_in: tokenData.expires_in
      },
      buildings_count: buildingsData.count,
      first_building: buildingsData.results && buildingsData.results.length > 0 ? {
        id: buildingsData.results[0].id,
        name: buildingsData.results[0].name
      } : null
    });
    
  } catch (error) {
    console.error('Erro ao testar autenticação:', error);
    return NextResponse.json({ 
      error: 'Erro interno ao testar autenticação', 
      message: (error as Error).message 
    }, { status: 500 });
  }
}
