import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Buscar todos os administradores (role: ADMIN)
    const admins = await prisma.user.findMany({
      where: {
        role: "ADMIN"
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calcular estatísticas básicas
    const total = admins.length;
    
    // Últimos 5 cadastros
    const ultimosCadastros = admins.slice(0, 5).map(admin => ({
      id: admin.id,
      nome: admin.name,
      dataCriacao: admin.createdAt.toISOString()
    }));

    return NextResponse.json({
      total,
      ativos: total, // Consideramos todos ativos
      ultimosCadastros
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas de administradores:", error);
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas de administradores" },
      { status: 500 }
    );
  }
}
