import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obter um imóvel específico pelo ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const imovel = await prisma.imovel.findUnique({
      where: {
        id: id,
      },
      include: {
        construtora: true,
      },
    });
    
    // Buscar os metadados do imóvel separadamente
    const metadata = await prisma.imovelMetadata.findFirst({
      where: {
        imovelIdExterno: id,
      },
    });

    if (!imovel) {
      return NextResponse.json(
        { success: false, error: 'Imóvel não encontrado' },
        { status: 404 }
      );
    }
    
    // Log para depuração
    console.log('Imóvel encontrado:', {
      id: imovel.id,
      telefoneContato: imovel.telefoneContato,
      tipoImovel: imovel.tipoImovel,
      // Outros campos importantes
    });

    return NextResponse.json({
      success: true,
      imovel: {
        ...imovel,
        // Garantir que esses campos estão presentes e não são nulos
        telefoneContato: imovel.telefoneContato || '',
        tipoImovel: imovel.tipoImovel || 'Apartamento'
      },
    });
  } catch (error) {
    console.error('Erro ao buscar imóvel:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar imóvel' },
      { status: 500 }
    );
  }
}

// PUT - Atualização completa de um imóvel
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();

    // Log dos dados recebidos para depuração
    console.log('Dados recebidos no PUT:', {
      telefoneContato: data.telefoneContato,
      tipoImovel: data.tipoImovel
    });

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
    
    // Garantir que o telefone e o tipo de imóvel sejam preservados se existirem
    const telefoneParaSalvar = data.telefoneContato || imovelExistente.telefoneContato || '';
    const tipoImovelParaSalvar = data.tipoImovel || imovelExistente.tipoImovel || 'Terreno';
    
    console.log('Dados que serão atualizados:', {
      telefone: telefoneParaSalvar,
      tipo: tipoImovelParaSalvar
    });

    // Atualizar o imóvel com todos os dados
    const imovelAtualizado = await prisma.imovel.update({
      where: {
        id: id,
      },
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        preco: data.preco,
        area: data.area,
        quartos: data.quartos,
        banheiros: data.banheiros,
        vagas: data.vagas,
        latitude: data.latitude,
        longitude: data.longitude,
        // Usar explicitamente os valores determinados acima
        telefoneContato: telefoneParaSalvar,
        endereco: data.endereco,
        fotoPrincipal: data.fotoPrincipal,
        galeriaFotos: data.galeriaFotos,
        caracteristicas: data.caracteristicas,
        caracteristicasArray: data.caracteristicasArray,
        // Usar explicitamente o valor determinado acima
        tipoImovel: tipoImovelParaSalvar,
        status: data.status,
        destaque: data.destaque,
        ativo: data.ativo,
        construtoraId: data.construtoraId
      },
    });

    return NextResponse.json({
      success: true,
      imovel: imovelAtualizado,
    });
  } catch (error) {
    console.error('Erro ao atualizar imóvel:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar imóvel' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir um imóvel pelo ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

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

    // Excluir os metadados associados ao imóvel (se existirem)
    await prisma.imovelMetadata.deleteMany({
      where: {
        imovelIdExterno: id,
      },
    });

    // Excluir o imóvel
    await prisma.imovel.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Imóvel excluído com sucesso',
    });
  } catch (error) {
    console.error('Erro ao excluir imóvel:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao excluir imóvel' },
      { status: 500 }
    );
  }
}

// PATCH - Atualizar campos específicos de um imóvel
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();

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

    // Atualizar o imóvel
    const imovelAtualizado = await prisma.imovel.update({
      where: {
        id: id,
      },
      data: data,
    });

    return NextResponse.json({
      success: true,
      imovel: imovelAtualizado,
    });
  } catch (error) {
    console.error('Erro ao atualizar imóvel:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar imóvel' },
      { status: 500 }
    );
  }
}
