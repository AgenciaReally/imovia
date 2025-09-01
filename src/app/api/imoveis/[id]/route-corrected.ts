import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obter um imóvel específico pelo ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // No Next.js 15, precisamos usar await com params
    const id = (await Promise.resolve(params)).id;

    const imovel = await prisma.imovel.findUnique({
      where: {
        id: id,
      },
      include: {
        construtora: true,
        tipoImovel: true, // Incluir o relacionamento com TipoImovel
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
      tipoImovel: imovel.tipoImovel?.nome, // Agora é um objeto relacionado
      tipoImovelId: imovel.tipoImovelId,
      // Outros campos importantes
    });

    return NextResponse.json({
      success: true,
      imovel: {
        ...imovel,
        // Garantir que esses campos estão presentes e não são nulos
        telefoneContato: imovel.telefoneContato || '',
        tipoImovelNome: imovel.tipoImovel?.nome || 'Apartamento', // Nome do tipo de imóvel da relação
        tipoImovelId: imovel.tipoImovelId // ID do tipo de imóvel para referência
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
  { params }: { params: { id: string } },
) {
  try {
    // No Next.js 15, precisamos usar await com params
    const id = (await Promise.resolve(params)).id;
    const data = await request.json();

    // Log completo dos dados recebidos para depuração
    console.log('Dados completos recebidos no PUT:', data);
    console.log('Dados importantes para debug:', {
      telefoneContato: data.telefoneContato,
      tipoImovelId: data.tipoImovelId // Agora usamos o ID do tipo de imóvel
    });

    // Verificar se o imóvel existe
    const imovelExistente = await prisma.imovel.findUnique({
      where: {
        id: id,
      },
      include: {
        tipoImovel: true
      }
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
    
    // Buscar o tipo default caso necessário
    let tipoImovelIdParaSalvar: string | null = null;
    
    // Se enviou um ID de tipo, usar esse
    if (data.tipoImovelId) {
      tipoImovelIdParaSalvar = data.tipoImovelId;
      console.log('USANDO TIPO ENVIADO COM ID:', tipoImovelIdParaSalvar);
    }
    // Se já existir um tipo no banco, manter
    else if (imovelExistente.tipoImovelId) {
      tipoImovelIdParaSalvar = imovelExistente.tipoImovelId;
      console.log('MANTENDO TIPO EXISTENTE COM ID:', tipoImovelIdParaSalvar);
    }
    // Caso contrário, buscar o ID do tipo 'Terreno' como padrão
    else {
      // Vamos buscar o ID do tipo "Terreno" no banco
      const tipoTerreno = await prisma.tipoImovel.findFirst({
        where: {
          nome: 'Terreno'
        }
      });
      
      if (tipoTerreno) {
        tipoImovelIdParaSalvar = tipoTerreno.id;
        console.log('USANDO TIPO PADRÃO TERRENO COM ID:', tipoImovelIdParaSalvar);
      } else {
        console.log('TIPO TERRENO NÃO ENCONTRADO, USANDO NULL');
      }
    }
    
    console.log('Dados que serão realmente atualizados:', {
      telefoneContato: telefoneParaSalvar,
      tipoImovelId: tipoImovelIdParaSalvar
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
    // SOLUÇÃO: Sempre definir como ativo quando estamos editando, ignorando o valor recebido no payload
    // if (data.ativo !== undefined) updateData.ativo = data.ativo;
    updateData.ativo = true; // Forçar o imóvel a sempre ficar ativo na edição
    if (data.construtoraId !== undefined) updateData.construtoraId = data.construtoraId;
    
    // Usar SEMPRE os valores tratados para garantir que sejam atualizados corretamente
    updateData.telefoneContato = telefoneParaSalvar;
    updateData.tipoImovelId = tipoImovelIdParaSalvar;
    
    console.log('Objeto final para update:', updateData);

    const imovelAtualizado = await prisma.imovel.update({
      where: {
        id: id,
      },
      data: updateData,
      include: {
        tipoImovel: true // Incluir o tipo de imóvel na resposta
      }
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
    // No Next.js 15, precisamos usar await com params
    const id = (await Promise.resolve(params)).id;

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
    // No Next.js 15, precisamos usar await com params
    const id = (await Promise.resolve(params)).id;
    const data = await request.json();

    // Verificar se o imóvel existe
    const imovelExistente = await prisma.imovel.findUnique({
      where: {
        id: id,
      },
      include: {
        tipoImovel: true
      }
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
      include: {
        tipoImovel: true
      }
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
