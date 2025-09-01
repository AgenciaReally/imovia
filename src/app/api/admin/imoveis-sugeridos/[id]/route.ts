import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    // Por enquanto, vamos retornar imóveis mock baseados no perfil do cliente
    // TODO: Implementar lógica real de IA para sugestão de imóveis
    
    const cliente = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        respostas: {
          include: {
            pergunta: true
          }
        }
      }
    });

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    // Gerar imóveis mock baseados nas respostas do cliente
    const totalRespostas = cliente.respostas.length;
    let imoveisCount = 0;
    
    if (totalRespostas >= 15) imoveisCount = 3;
    else if (totalRespostas >= 5) imoveisCount = 2;
    else imoveisCount = 0;

    const imoveisMock = [];
    
    for (let i = 0; i < imoveisCount; i++) {
      imoveisMock.push({
        id: `imovel_${userId}_${i + 1}`,
        titulo: `Apartamento ${i === 0 ? 'Premium' : i === 1 ? 'Executivo' : 'Econômico'} - ${i + 1}`,
        endereco: `Rua das Flores, ${100 + i * 50}, São Paulo - SP`,
        preco: 850000 - (i * 150000),
        quartos: 3 - i,
        banheiros: 2,
        vagas: 2 - i,
        area: 120 - (i * 20),
        score: 9.2 - (i * 0.8),
        construtora: {
          nome: `Construtora ${i === 0 ? 'Alpha' : i === 1 ? 'Beta' : 'Gamma'}`,
          logo: null
        },
        imagens: [],
        descricao: `Excelente apartamento ${i === 0 ? 'de alto padrão' : 'bem localizado'} com acabamento ${i === 0 ? 'premium' : 'de qualidade'}.`
      });
    }

    return NextResponse.json({
      imoveis: imoveisMock
    });

  } catch (error) {
    console.error("Erro ao buscar imóveis sugeridos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
