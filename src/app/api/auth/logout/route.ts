import { NextRequest, NextResponse } from 'next/server';
import { logoutUser } from '@/lib/auth-service';

export async function POST(request: NextRequest) {
  try {
    // Realizar logout
    await logoutUser();

    // Criar resposta com cookie removido explicitamente
    const response = NextResponse.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });

    // Garantir que o cookie seja removido na resposta
    response.cookies.set({
      name: 'auth-token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0, // Expirar imediatamente
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Erro no endpoint de logout:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao realizar logout' },
      { status: 500 }
    );
  }
}
