import { NextResponse } from 'next/server';
import { enviarEmailBoasVindas } from '@/services/email-boas-vindas';

interface BoasVindasParams {
  nome: string;
  email: string;
  senha: string;
}

export async function POST(request: Request) {
  try {
    const { nome, email, senha } = await request.json() as BoasVindasParams;
    
    // Validar os parâmetros
    if (!nome || !email || !senha) {
      return NextResponse.json(
        { error: 'Parâmetros incompletos' },
        { status: 400 }
      );
    }
    
    // Usar o serviço de email para enviar o email de boas-vindas
    const enviado = await enviarEmailBoasVindas({ nome, email, senha });
    
    if (enviado) {
      console.log(`Email de boas-vindas enviado para ${email}`);
      
      return NextResponse.json({
        success: true,
        message: 'Email enviado com sucesso'
      });
    } else {
      console.error(`Falha ao enviar email para ${email}`);
      
      return NextResponse.json(
        { error: 'Falha ao enviar email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erro ao processar envio de email de boas-vindas:', error);
    return NextResponse.json(
      { error: 'Falha ao enviar email' },
      { status: 500 }
    );
  }
}
