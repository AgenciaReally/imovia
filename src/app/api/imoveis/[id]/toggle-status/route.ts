import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH - Alternar o status do imóvel (ativo/inativo)
export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Usar o id do param de forma segura
    const id = context.params.id;
    const { ativo } = await request.json();

    // Verificar se o imóvel existe
    const imovelExistente = await prisma.imovel.findUnique({
      where: {
        id: id,
      },
    });

    if (!imovelExistente) {
      return NextResponse.json(
        { success: false, error: 'Imóvel não encontrado' },
        { status: 404 }
      );
    }

    // Atualizar o status do imóvel
    const imovelAtualizado = await prisma.imovel.update({
      where: {
        id: id,
      },
      data: {
        ativo: ativo,
      },
    });

    return NextResponse.json({
      success: true,
      imovel: imovelAtualizado,
    });
  } catch (error) {
    console.error('Erro ao alterar status do imóvel:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao alterar status do imóvel' },
      { status: 500 }
    );
  }
}
