import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

// API para salvar respostas do cliente
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession();
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }
    
    // Buscar usuário pelo email
    const usuario = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });
    
    if (!usuario) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const userId = usuario.id;
    const body = await request.json();
    const { respostas } = body;

    if (!respostas || !Array.isArray(respostas) || respostas.length === 0) {
      return NextResponse.json(
        { error: "Dados de respostas inválidos" },
        { status: 400 }
      );
    }

    // Salvar cada resposta no banco
    const respostasSalvas = await Promise.all(
      respostas.map(async (resposta: any) => {
        return await prisma.respostasCliente.create({
          data: {
            pergunta: resposta.pergunta,
            resposta: resposta.resposta,
            score: resposta.score || 0,
            userId: userId,
          },
        });
      })
    );

    return NextResponse.json({ 
      success: true, 
      message: `${respostasSalvas.length} respostas salvas com sucesso!`,
      respostasSalvas 
    });
    
  } catch (error) {
    console.error("Erro ao salvar respostas do cliente:", error);
    return NextResponse.json(
      { error: "Erro ao salvar respostas do cliente" },
      { status: 500 }
    );
  }
}

// API para obter respostas salvas do cliente
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession();
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }
    
    // Buscar usuário pelo email
    const usuario = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });
    
    if (!usuario) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const userId = usuario.id;

    // Buscar respostas salvas do usuário
    const respostasSalvas = await prisma.respostasCliente.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ 
      success: true, 
      respostasSalvas 
    });
    
  } catch (error) {
    console.error("Erro ao buscar respostas salvas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar respostas salvas" },
      { status: 500 }
    );
  }
}
