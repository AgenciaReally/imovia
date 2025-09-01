import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const imovelId = params.id;
    const { favorito } = await req.json();
    
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
    
    // Verificar se o imóvel existe
    const imovel = await prisma.imovel.findUnique({
      where: { id: imovelId }
    });
    
    if (!imovel) {
      return NextResponse.json(
        { error: "Imóvel não encontrado" },
        { status: 404 }
      );
    }
    
    // Verificar se já existe um favorito
    const favoritoExistente = await prisma.favorito.findFirst({
      where: {
        userId: usuario.id,
        imovelId: imovelId
      }
    });
    
    if (favorito) {
      // Adicionar aos favoritos se não existir
      if (!favoritoExistente) {
        await prisma.favorito.create({
          data: {
            userId: usuario.id,
            imovelId: imovelId
          }
        });
      }
    } else {
      // Remover dos favoritos se existir
      if (favoritoExistente) {
        await prisma.favorito.delete({
          where: {
            id: favoritoExistente.id
          }
        });
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao atualizar favorito:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar favorito" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
