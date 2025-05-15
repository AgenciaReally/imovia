import { NextResponse } from 'next/server';
import { ORULO_CONFIG } from '@/config/orulo';

export async function POST() {
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
    // Requisição para obter token OAuth usando a URL definida na configuração
    const response = await fetch(ORULO_CONFIG.OAUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { raw: errorText };
      }
      
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

    const tokenData = await response.json();
    console.log('Token Orulo obtido com sucesso, expira em:', tokenData.expires_in, 'segundos');
    return NextResponse.json(tokenData);
  } catch (error) {
    console.error('Erro ao processar autenticação Orulo:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar autenticação', details: (error as Error).message },
      { status: 500 }
    );
  }
}
