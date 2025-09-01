import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imovelIdExterno = searchParams.get('imovelIdExterno');

    if (!imovelIdExterno) {
      return NextResponse.json({ error: 'ID do imóvel é obrigatório' }, { status: 400 });
    }

    // Buscar metadados pelo ID externo
    const metadata = await prisma.imovelMetadata.findUnique({
      where: { imovelIdExterno },
      include: {
        construtora: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    });

    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Erro ao buscar metadados:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, imovelIdExterno, telefone, observacoes, construtoraId } = data;

    if (!imovelIdExterno) {
      return NextResponse.json({ error: 'ID do imóvel é obrigatório' }, { status: 400 });
    }

    // Verificar se já existem metadados para este imóvel
    const existingMetadata = await prisma.imovelMetadata.findUnique({
      where: { imovelIdExterno }
    });

    let result;

    // Se já existe, atualizar
    if (existingMetadata || id) {
      result = await prisma.imovelMetadata.update({
        where: { id: id || existingMetadata?.id },
        data: {
          telefone,
          observacoes,
          construtoraId: construtoraId || null
        }
      });
    } else {
      // Se não existe, criar novo
      result = await prisma.imovelMetadata.create({
        data: {
          imovelIdExterno,
          telefone,
          observacoes,
          construtoraId: construtoraId || null
        }
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao salvar metadados:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
