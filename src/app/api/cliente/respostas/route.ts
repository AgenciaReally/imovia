import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession();
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }
    
    // Buscar usuário pelo email
    const usuario = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    });
    
    if (!usuario || usuario.role !== "CLIENTE") {
      return NextResponse.json(
        { error: "Acesso permitido apenas para clientes" },
        { status: 403 }
      );
    }
    
    // Buscar respostas do cliente com as perguntas relacionadas
    const respostas = await prisma.resposta.findMany({
      where: { 
        userId: usuario.id 
      },
      include: {
        pergunta: {
          select: {
            id: true,
            texto: true,
            tipo: true,
            categoria: true,
            fluxo: true
          }
        }
      },
      orderBy: {
        dataResposta: 'desc'
      }
    });
    
    return NextResponse.json(respostas);
  } catch (error) {
    console.error("Erro ao buscar respostas do cliente:", error);
    return NextResponse.json(
      { error: "Erro ao buscar respostas" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
