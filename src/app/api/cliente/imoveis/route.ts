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
    
    // Buscar imóveis relacionados ao cliente
    // Primeiro, buscar as respostas do cliente para encontrar os imóveis recomendados
    const respostasCliente = await prisma.resposta.findMany({
      where: { userId: usuario.id },
      select: { imovelId: true }
    });
    
    // Extrair IDs dos imóveis
    const imovelIds = respostasCliente
      .filter(r => r.imovelId !== null)
      .map(r => r.imovelId as string);
    
    // Buscar detalhes dos imóveis
    const imoveis = await prisma.imovel.findMany({
      where: {
        id: { in: imovelIds }
      },
      include: {
        construtora: {
          select: {
            id: true,
            nome: true,
            telefone: true
          }
        },
        favoritos: {
          where: { userId: usuario.id }
        }
      }
    });
    
    // Formatar dados para o frontend
    const imoveisFormatados = imoveis.map(imovel => ({
      id: imovel.id,
      titulo: imovel.titulo,
      descricao: imovel.descricao,
      preco: imovel.preco,
      area: imovel.area,
      quartos: imovel.quartos,
      banheiros: imovel.banheiros,
      vagas: imovel.vagas,
      endereco: imovel.endereco,
      bairro: imovel.bairro,
      cidade: imovel.cidade,
      estado: imovel.estado,
      fotoPrincipal: imovel.fotoPrincipal,
      galeriaFotos: imovel.galeriaFotos,
      construtora: imovel.construtora,
      tipoImovel: imovel.tipoImovel,
      matchPercentage: Math.floor(Math.random() * 30) + 70, // Simulação de match
      favorito: imovel.favoritos.length > 0
    }));
    
    return NextResponse.json(imoveisFormatados);
  } catch (error) {
    console.error("Erro ao buscar imóveis do cliente:", error);
    return NextResponse.json(
      { error: "Erro ao buscar imóveis" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
