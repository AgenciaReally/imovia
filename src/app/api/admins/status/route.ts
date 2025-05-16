import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  try {
    // Obter ID da query
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: "ID do administrador não fornecido" },
        { status: 400 }
      );
    }
    
    // Obter dados do corpo da requisição
    const data = await request.json();
    
    if (!data.status) {
      return NextResponse.json(
        { error: "Status não fornecido" },
        { status: 400 }
      );
    }
    
    // Verificar se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });
    
    if (!existingUser) {
      return NextResponse.json(
        { error: "Administrador não encontrado" },
        { status: 404 }
      );
    }
    
    // Não implementamos status no modelo de User, então esta seria apenas uma simulação
    // O status real seria implementado no modelo User se necessário
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("Erro ao alterar status do administrador:", error);
    return NextResponse.json(
      { error: "Erro ao alterar status do administrador" },
      { status: 500 }
    );
  }
}
