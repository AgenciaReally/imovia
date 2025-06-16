import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, createSessionToken } from '@/lib/auth-api';

export async function POST(request: NextRequest) {
  try {
    // Extrair dados da requisição
    const body = await request.json();
    const { email, password, lembrarMe } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Autenticar usuário
    const user = await authenticateUser(email, password);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Email ou senha inválidos' },
        { status: 401 }
      );
    }

    // Criar token de sessão com duração baseada na opção "lembrar-me"
    // Se lembrarMe for true, o token dura 30 dias, caso contrário, 12 horas (padrão)
    const tokenDuration = lembrarMe ? 30 * 24 * 60 * 60 : undefined; // 30 dias em segundos
    await createSessionToken(user.id, user.email, user.role, tokenDuration);

    // Retornar usuário autenticado
    return NextResponse.json({
      success: true,
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error('Erro no endpoint de login:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
