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
    const respostasCliente = await prisma.resposta.findMany({
      where: { userId: usuario.id },
      select: { imovelId: true }
    });
    
    // Extrair IDs dos imóveis
    const imovelIds = respostasCliente
      .filter(r => r.imovelId !== null)
      .map(r => r.imovelId as string);
    
    // Buscar construtoras relacionadas aos imóveis do cliente
    const imoveis = await prisma.imovel.findMany({
      where: {
        id: { in: imovelIds }
      },
      select: {
        construtoraId: true
      }
    });
    
    // Extrair IDs das construtoras
    const construtoraIds = imoveis
      .filter(i => i.construtoraId !== null)
      .map(i => i.construtoraId as string);
    
    // Buscar detalhes das construtoras
    const construtoras = await prisma.construtora.findMany({
      where: {
        id: { in: construtoraIds }
      },
      include: {
        imoveis: {
          where: {
            id: { in: imovelIds }
          },
          select: {
            id: true
          }
        }
      }
    });
    
    // Formatar dados para o frontend
    const construtorasFormatadas = construtoras.map(construtora => ({
      id: construtora.id,
      nome: construtora.nome,
      cnpj: construtora.cnpj,
      telefone: construtora.telefone,
      email: construtora.email,
      endereco: construtora.endereco,
      ativa: construtora.ativa,
      imoveisCount: construtora.imoveis.length,
      logo: construtora.logo
    }));
    
    return NextResponse.json(construtorasFormatadas);
  } catch (error) {
    console.error("Erro ao buscar construtoras do cliente:", error);
    return NextResponse.json(
      { error: "Erro ao buscar construtoras" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
