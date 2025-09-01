import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  try {
    // Buscar todas as respostas deste usuário com relacionamentos
    const respostas = await prisma.resposta.findMany({
      where: {
        userId: userId,
      },
      include: {
        pergunta: {
          select: {
            texto: true,
            categoria: true,
            tipo: true,
            pontuacao: true,
          },
        },
        usuario: {
          select: {
            email: true,
            name: true,
          },
        },
      },
      orderBy: [
        {
          pergunta: {
            categoria: "asc",
          },
        },
        {
          createdAt: "asc",
        },
      ],
    });

    // Buscar imóveis recomendados
    // Em uma implementação real, poderíamos buscar pelo userId na tabela Match
    // ou fazer uma chamada ao DeepSeek para recomendar imóveis baseados nas respostas
    const imoveis = await prisma.imovel.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Simular um score de match para cada imóvel
    const imoveisComMatch = imoveis.map((imovel, index) => {
      // Cálculo simulado baseado no índice (puramente para demonstração)
      const matchScore = 95 - (index * 7);
      const posicaoRanking = index + 1;
      const destaque = index < 2;

      return {
        ...imovel,
        match: matchScore,
        posicaoRanking,
        destaque,
      };
    });

    return NextResponse.json({
      respostas,
      imoveis: imoveisComMatch,
    });
  } catch (error) {
    console.error("Erro ao buscar respostas do usuário:", error);
    return NextResponse.json(
      { erro: "Erro ao buscar respostas do usuário" },
      { status: 500 }
    );
  }
}
