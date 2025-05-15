import { NextRequest, NextResponse } from 'next/server';
import { logoutUser } from '@/lib/auth-api';

export async function POST(request: NextRequest) {
  try {
    // Realizar logout
    logoutUser();

    // Retornar resposta
    return NextResponse.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    console.error('Erro no endpoint de logout:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao realizar logout' },
      { status: 500 }
    );
  }
}
