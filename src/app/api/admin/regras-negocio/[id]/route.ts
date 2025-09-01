import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar autenticação de admin
    const session = await getServerSession();
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }
    
    const usuario = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    });
    
    if (!usuario || usuario.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Acesso permitido apenas para administradores" },
        { status: 403 }
      );
    }

    const regraId = params.id;
    
    // Verificar se a regra existe
    const regraExistente = await prisma.regraNegocio.findUnique({
      where: { id: regraId }
    });

    if (!regraExistente) {
      return NextResponse.json(
        { error: "Regra não encontrada" },
        { status: 404 }
      );
    }

    // Excluir a regra
    await prisma.regraNegocio.delete({
      where: { id: regraId }
    });

    return NextResponse.json({
      success: true,
      message: "Regra excluída com sucesso"
    });

  } catch (error) {
    console.error("Erro ao excluir regra de negócio:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
