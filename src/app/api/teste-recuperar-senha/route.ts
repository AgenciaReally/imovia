import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const emailTeste = 'suporte@vyzer.com.br';
    console.log('Testando endpoint de recuperação de senha com:', emailTeste);
    
    // Fazer uma requisição para o endpoint de recuperação de senha
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/recuperar-senha`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailTeste
      }),
    });
    
    const resultado = await response.json();
    
    // Log detalhado da resposta
    console.log('Resposta do endpoint recuperar-senha:', {
      status: response.status,
      ok: response.ok,
      resultado
    });
    
    return NextResponse.json({
      success: true,
      message: `Teste de recuperação de senha para ${emailTeste}`,
      resultado,
      status: response.status,
      ok: response.ok
    });
    
  } catch (error: any) {
    console.error('Erro ao testar recuperação de senha:', error);
    
    return NextResponse.json({
      success: false,
      message: `Erro: ${error.message || 'Erro desconhecido'}`,
      error: String(error)
    }, { status: 500 });
  }
}
