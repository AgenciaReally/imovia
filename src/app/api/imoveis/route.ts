import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Busca imóveis cadastrados no banco de dados com filtros opcionais
export async function GET(request: Request) {
  try {
    // Obter parâmetros de URL para filtrar imóveis
    const { searchParams } = new URL(request.url);
    
    // Construir objeto de filtros para o Prisma
    const where: any = {};
    
    // Filtrar por imóveis ativos (se o parâmetro existir)
    if (searchParams.has('ativo')) {
      where.ativo = searchParams.get('ativo') === 'true';
    }
    
    // Filtros baseados em parâmetros da URL
    if (searchParams.has('quartos')) {
      const quartos = parseInt(searchParams.get('quartos') || '0', 10);
      where.quartos = quartos > 0 ? quartos : undefined;
    }
    
    if (searchParams.has('banheiros')) {
      const banheiros = parseInt(searchParams.get('banheiros') || '0', 10);
      where.banheiros = banheiros > 0 ? banheiros : undefined;
    }
    
    if (searchParams.has('valorMinimo')) {
      const valorMinimo = parseFloat(searchParams.get('valorMinimo') || '0');
      where.preco = { ...(where.preco || {}), gte: valorMinimo };
    }
    
    if (searchParams.has('valorMaximo')) {
      const valorMaximo = parseFloat(searchParams.get('valorMaximo') || '0');
      where.preco = { ...(where.preco || {}), lte: valorMaximo };
    }
    
    if (searchParams.has('area')) {
      const area = parseFloat(searchParams.get('area') || '0');
      where.area = { gte: area * 0.8 }; // 20% de margem para baixo
    }
    
    if (searchParams.has('bairro')) {
      const bairro = searchParams.get('bairro');
      where.endereco = { contains: bairro, mode: 'insensitive' };
    }
    
    if (searchParams.has('tipoImovel')) {
      const tipoImovelSlug = searchParams.get('tipoImovel');
      // Buscar o tipo de imóvel pelo slug
      if (tipoImovelSlug) {
        const tipoImovel = await prisma.tipoImovel.findFirst({
          where: { slug: { equals: tipoImovelSlug, mode: 'insensitive' } }
        });
        
        if (tipoImovel) {
          where.tipoImovelId = tipoImovel.id;
        }
      }
    }
    
    console.log('Filtros aplicados:', where);
    
    // Buscar imóveis do banco de dados com seus relacionamentos e filtros
    const imoveis = await prisma.imovel.findMany({
      where,
      include: {
        construtora: true,
        tipoImovel: true
      },
      orderBy: {
        destaque: 'desc' // Ordenar por destaque primeiro
      }
    })
    
    // Transformar dados para o formato esperado pelo front-end
    const imoveisFormatados = imoveis.map(imovel => ({
      id: imovel.id,
      idExterno: imovel.idExternoAPI || null,
      titulo: imovel.titulo,
      descricao: imovel.descricao,
      preco: imovel.preco,
      area: imovel.area,
      quartos: imovel.quartos,
      banheiros: imovel.banheiros,
      vagas: imovel.vagas,
      endereco: imovel.endereco,
      bairro: imovel.endereco.split(',')[1]?.trim() || '',
      cidade: imovel.endereco.split(',')[2]?.trim() || '',
      estado: imovel.endereco.split(',')[3]?.trim() || '',
      cep: '',
      latitude: imovel.latitude,
      longitude: imovel.longitude,
      imagens: imovel.galeriaFotos.length > 0 ? imovel.galeriaFotos : [imovel.fotoPrincipal].filter(Boolean),
      fotoPrincipal: imovel.fotoPrincipal,
      construtora: imovel.construtora?.nome || 'Não informada',
      construtoraId: imovel.construtoraId,
      tipoImovel: imovel.tipoImovel?.nome || 'Apartamento', // Usar o nome do tipo de imóvel da relação
      tipoImovelId: imovel.tipoImovelId, // Incluir também o ID do tipo de imóvel
      status: imovel.status || 'Disponível',
      dataAtualizacao: imovel.updatedAt.toLocaleDateString('pt-BR'),
      caracteristicas: imovel.caracteristicasArray || [],
      destaque: imovel.destaque,
      ativo: imovel.ativo,
      telefoneContato: imovel.telefoneContato // Incluir o telefone de contato do imóvel
    }))
    
    return NextResponse.json(imoveisFormatados)
  } catch (error: any) {
    console.error('Erro ao buscar imóveis:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar imóveis', details: error.message || String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Garantir que todos os campos necessários estejam presentes
    const {
      titulo,
      descricao,
      preco,
      area,
      quartos,
      banheiros,
      vagas,
      latitude,
      longitude,
      telefoneContato,
      endereco,
      fotoPrincipal,
      galeriaFotos,
      caracteristicasArray,
      tipoImovelId, // Agora usamos o ID da relação
      status,
      destaque,
      construtoraId,
      caracteristicas
    } = body
    
    // Preparar os dados para criar o imóvel
    const imovelData: any = {
      titulo,
      descricao,
      preco,
      area,
      quartos,
      banheiros,
      vagas,
      latitude,
      longitude,
      telefoneContato,
      endereco,
      fotoPrincipal,
      galeriaFotos: galeriaFotos || [],
      caracteristicasArray: caracteristicasArray || [],
      tipoImovelId, // Usar o ID da relação com TipoImovel
      status,
      destaque: destaque || false,
      caracteristicas
    }
    
    // Adicionar construtoraId apenas se foi fornecido
    if (construtoraId) {
      imovelData.construtoraId = construtoraId
    }
    
    // Criar o imóvel no banco de dados
    const novoImovel = await prisma.imovel.create({
      data: imovelData,
      include: {
        tipoImovel: true // Incluir o tipo de imóvel na resposta
      }
    })
    
    return NextResponse.json(novoImovel, { status: 201 })
  } catch (error: any) {
    console.error('Erro ao criar imóvel:', error)
    return NextResponse.json(
      { error: 'Erro ao criar imóvel', details: error.message || String(error) },
      { status: 500 }
    )
  }
}
