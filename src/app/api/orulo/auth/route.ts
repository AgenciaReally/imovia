import { NextResponse } from 'next/server';
import { ORULO_CONFIG } from '@/config/orulo';

export async function POST(request: Request) {
  // Usando as credenciais definidas na configuração
  const CLIENT_ID = ORULO_CONFIG.CLIENT_ID;
  const CLIENT_SECRET = ORULO_CONFIG.CLIENT_SECRET;
  
  if (!CLIENT_ID || !CLIENT_SECRET) {
    return NextResponse.json(
      { error: 'Credenciais Orulo não configuradas' },
      { status: 500 }
    );
  }

  console.log('Solicitando token Orulo com credenciais:', {
    clientIdLength: CLIENT_ID.length,
    clientSecretLength: CLIENT_SECRET.length
  });

  try {
    // Preparar body para requisição OAuth2
    const bodyParams = new URLSearchParams({
      'grant_type': 'client_credentials',
      'client_id': CLIENT_ID,
      'client_secret': CLIENT_SECRET,
    });
    
    console.log('Enviando requisição OAuth2 para Orulo com parâmetros:', bodyParams.toString());

    // Usando Client Credentials para obter token OAuth2
    const response = await fetch('https://www.orulo.com.br/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: bodyParams,
      cache: 'no-store', // Garantir que não usará cache
      next: { revalidate: 0 } // Evitar cache no Next.js
    });

    if (response.ok) {
      const tokenData = await response.json();
      console.log('Token Orulo obtido com sucesso, expira em:', tokenData.expires_in, 'segundos');
      return NextResponse.json(tokenData);
    } else {
      const errorData = await response.text();
      console.error('Erro ao obter token Orulo:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      return NextResponse.json(
        { 
          error: 'Falha ao obter token de autenticação',
          details: errorData,
          status: response.status 
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Erro ao processar solicitação de token:', error);
    return NextResponse.json(
      { error: 'Erro ao processar solicitação de token' },
      { status: 500 }
    );
  }
}
