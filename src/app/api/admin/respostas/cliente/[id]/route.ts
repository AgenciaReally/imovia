import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    // Buscar todas as respostas do cliente
    const respostas = await prisma.resposta.findMany({
      where: {
        userId: userId
      },
      include: {
        pergunta: {
          select: {
            id: true,
            texto: true,
            categoria: true,
            tipo: true
          }
        },
        usuario: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      respostas
    });

  } catch (error) {
    console.error("Erro ao buscar respostas do cliente:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
