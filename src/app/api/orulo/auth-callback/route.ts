import { NextRequest, NextResponse } from 'next/server';
import { ORULO_CONFIG } from '@/config/orulo';

// Endpoint que recebe o callback da Orulo após login
export async function GET(request: NextRequest) {
  try {
    // Extrair o código de autorização da URL
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    
    if (!code) {
      return NextResponse.redirect(new URL('/painel/admin/imoveis?error=no_code', request.url));
    }
    
    // Trocar o código por um token
    const tokenResponse = await fetch('https://www.orulo.com.br/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': `${url.origin}/api/orulo/auth-callback`,
        'client_id': ORULO_CONFIG.CLIENT_ID || '',
        'client_secret': ORULO_CONFIG.CLIENT_SECRET || '',
      }),
    });
    
    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('Erro ao obter token:', error);
      return NextResponse.redirect(new URL('/painel/admin/imoveis?error=token_exchange_failed', request.url));
    }
    
    const tokenData = await tokenResponse.json();
    
    // Salvar token na sessão (para uso em server-side)
    // No cliente, podemos buscar o token chamando a API orulo/auth
    
    // Redirecionar de volta para a página de imóveis
    return NextResponse.redirect(new URL('/painel/admin/imoveis?auth=success', request.url));
    
  } catch (error) {
    console.error('Erro no callback de autenticação Orulo:', error);
    return NextResponse.redirect(new URL('/painel/admin/imoveis?error=auth_error', request.url));
  }
}
