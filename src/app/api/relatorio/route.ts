import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, nome, telefone } = await request.json();

    if (!email) {
      return NextResponse.json(
        { erro: 'Email é obrigatório para solicitar um relatório' },
        { status: 400 }
      );
    }

    // Criar ou buscar usuário pelo email ou telefone
    let usuario = await prisma.usuario.findFirst({
      where: { email },
    });

    if (!usuario) {
      usuario = await prisma.usuario.create({
        data: {
          nome: nome || 'Anônimo',
          email,
          telefone,
        },
      });
    }

    // Registrar a solicitação de relatório
    const solicitacao = await prisma.solicitacaoRelatorio.create({
      data: {
        usuarioId: usuario.id,
        status: 'PENDENTE',
      },
    });

    // Aqui poderia ter uma integração com um serviço de email
    // para enviar o relatório automaticamente

    return NextResponse.json({
      sucesso: true,
      mensagem: 'Solicitação de relatório registrada com sucesso',
      solicitacaoId: solicitacao.id,
    });
  } catch (error) {
    console.error('Erro ao processar solicitação de relatório:', error);
    return NextResponse.json(
      { erro: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
