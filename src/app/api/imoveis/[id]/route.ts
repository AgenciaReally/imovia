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
    // No Next.js 15, precisamos usar await nos params
    const id = (await params).id;
    const data = await request.json();

    // Log completo dos dados recebidos para depuração
    console.log('Dados completos recebidos no PUT:', data);
    console.log('Dados importantes para debug:', {
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
    
    // Garantir que os dados sejam preservados explicitamente
    // Se o dado vier como undefined ou null, manter o valor existente
    const telefoneParaSalvar = data.telefoneContato !== undefined ? data.telefoneContato : (imovelExistente.telefoneContato || '');
    
    // FORÇAR O TIPO DE IMÓVEL PARA 'TERRENO' OU O VALOR ENVIADO
    // NUNCA USAR 'APARTAMENTO' COMO PADRÃO
    let tipoImovelParaSalvar = 'Terreno'; // Padrão fixo para TERRENO
    
    // Se enviou um tipo, usar esse
    if (data.tipoImovel && data.tipoImovel.trim() !== '') {
      tipoImovelParaSalvar = data.tipoImovel;
      console.log('USANDO TIPO ENVIADO:', tipoImovelParaSalvar);
    }
    // Se já existir um tipo no banco que não seja Apartamento, manter
    else if (imovelExistente.tipoImovel && 
             imovelExistente.tipoImovel.trim() !== '' && 
             imovelExistente.tipoImovel !== 'Apartamento') {
      tipoImovelParaSalvar = imovelExistente.tipoImovel;
      console.log('MANTENDO TIPO EXISTENTE:', tipoImovelParaSalvar);
    }
    // Caso contrário, usar TERRENO como padrão
    else {
      console.log('USANDO TIPO PADRÃO TERRENO');
    }
    
    console.log('Dados que serão realmente atualizados:', {
      telefoneContato: telefoneParaSalvar,
      tipoImovel: tipoImovelParaSalvar
    });

    // Atualizar o imóvel com todos os dados
    // Montamos um objeto com apenas os campos que existem no payload
    const updateData: any = {};
    
    // Campos básicos - só incluir se existirem no payload
    if (data.titulo !== undefined) updateData.titulo = data.titulo;
    if (data.descricao !== undefined) updateData.descricao = data.descricao;
    if (data.preco !== undefined) updateData.preco = data.preco;
    if (data.area !== undefined) updateData.area = data.area;
    if (data.quartos !== undefined) updateData.quartos = data.quartos;
    if (data.banheiros !== undefined) updateData.banheiros = data.banheiros;
    if (data.vagas !== undefined) updateData.vagas = data.vagas;
    if (data.latitude !== undefined) updateData.latitude = data.latitude;
    if (data.longitude !== undefined) updateData.longitude = data.longitude;
    if (data.endereco !== undefined) updateData.endereco = data.endereco;
    if (data.fotoPrincipal !== undefined) updateData.fotoPrincipal = data.fotoPrincipal;
    if (data.galeriaFotos !== undefined) updateData.galeriaFotos = data.galeriaFotos;
    if (data.caracteristicas !== undefined) updateData.caracteristicas = data.caracteristicas;
    if (data.caracteristicasArray !== undefined) updateData.caracteristicasArray = data.caracteristicasArray;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.destaque !== undefined) updateData.destaque = data.destaque;
    if (data.ativo !== undefined) updateData.ativo = data.ativo;
    if (data.construtoraId !== undefined) updateData.construtoraId = data.construtoraId;
    
    // Usar SEMPRE os valores tratados para garantir que sejam atualizados corretamente
    updateData.telefoneContato = telefoneParaSalvar;
    updateData.tipoImovel = tipoImovelParaSalvar;
    
    console.log('Objeto final para update:', updateData);

    const imovelAtualizado = await prisma.imovel.update({
      where: {
        id: id,
      },
      data: updateData,
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
