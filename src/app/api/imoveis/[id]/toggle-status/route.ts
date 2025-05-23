import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH - Alternar o status do imóvel (ativo/inativo)
export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // No Next.js 15, precisamos usar await nos params
    const id = (await context.params).id;
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

    // Atualizar o status do imóvel apenas quando explicitamente solicitado pelo toggle
    // E forçar que ele continue ativo quando estiver editando
    const imovelAtualizado = await prisma.imovel.update({
      where: {
        id: id,
      },
      data: {
        // Se estamos editando via form de edição, sempre mantenha ativo
        // Caso contrário, use o valor recebido no toggle
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
