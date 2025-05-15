import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Rotas que não precisam de autenticação
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/cadastro',
  '/api/integracao/novo-cliente',
  '/mapa-interativo', // Adicionado para permitir acesso ao mapa sem login
];

// Função que verifica se uma rota é pública
const isPublicRoute = (path: string) => {
  return publicRoutes.some(route => 
    path === route || 
    path.startsWith('/api/') ||
    path.startsWith('/_next/') || 
    path.includes('.') // Arquivos estáticos
  );
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Permitir rotas públicas
  if (isPublicRoute(path)) {
    return NextResponse.next();
  }

  // Verificar token de autenticação
  const token = request.cookies.get('auth-token')?.value;
  
  // Se não tiver token, redirecionar para login
  if (!token) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', encodeURIComponent(request.url));
    return NextResponse.redirect(url);
  }

  try {
    // Verificar e decodificar o token diretamente no middleware
    // usando apenas jose (compatível com Edge Runtime)
    const jwtSecret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'seu_segredo_super_secreto_aqui_pelo_menos_32_caracteres'
    );
    
    const { payload } = await jwtVerify(token, jwtSecret);
    
    if (!payload) {
      // Token inválido, redirecionar para login
      const url = new URL('/auth/login', request.url);
      return NextResponse.redirect(url);
    }

    // Verificar permissões com base na role
    const userRole = payload.role as string;
    
    // Permissões para painel de admin
    if (path.startsWith('/painel/admin') && userRole !== 'ADMIN') {
      // Usuário não é admin, redirecionar para página de acesso negado
      const url = new URL('/acesso-negado', request.url);
      return NextResponse.redirect(url);
    }

    // Permissões para painel de construtora
    if (path.startsWith('/painel/construtora') && userRole !== 'CONSTRUTORA') {
      // Usuário não é construtora, redirecionar para página de acesso negado
      const url = new URL('/acesso-negado', request.url);
      return NextResponse.redirect(url);
    }

    // Continuar com a requisição
    return NextResponse.next();
  } catch (error) {
    console.error('Erro ao verificar permissões:', error);
    const url = new URL('/auth/login', request.url);
    return NextResponse.redirect(url);
  }
}

// Configurar rotas para aplicar o middleware
export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes that should be public
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!_next|_static|favicon.png).*)',
  ],
};
