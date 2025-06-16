import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

// Chave secreta para JWT - em produção, isso deveria vir de variáveis de ambiente
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'seu_segredo_super_secreto_aqui_pelo_menos_32_caracteres');

/**
 * Endpoint para verificar a sessão do usuário atual
 */
export async function GET(request: NextRequest) {
  try {
    // Obter o token do cookie
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ 
        authenticated: false, 
        message: 'Não autenticado' 
      }, { status: 401 });
    }

    // Verificar o token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Verificar se o token expirou
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return NextResponse.json({ 
        authenticated: false, 
        message: 'Sessão expirada' 
      }, { status: 401 });
    }

    // Retornar os dados do usuário
    return NextResponse.json({
      authenticated: true,
      user: {
        id: payload.id || payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role,
        exp: payload.exp
      }
    });
  } catch (error) {
    console.error('Erro ao verificar sessão:', error);
    return NextResponse.json({ 
      authenticated: false, 
      message: 'Erro ao verificar autenticação' 
    }, { status: 401 });
  }
}
