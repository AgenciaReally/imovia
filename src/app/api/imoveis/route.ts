import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Busca todos os imóveis cadastrados no banco de dados
export async function GET() {
  try {
    // Buscar todos os imóveis do banco de dados com suas construtoras
    const imoveis = await prisma.imovel.findMany({
      include: {
        construtora: true
      },
      orderBy: {
        createdAt: 'desc'
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
      status: imovel.status || 'Disponível',
      dataAtualizacao: imovel.updatedAt.toLocaleDateString('pt-BR'),
      caracteristicas: imovel.caracteristicasArray || [],
      destaque: imovel.destaque,
      ativo: imovel.ativo
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
      tipoImovel,
      status,
      destaque,
      construtoraId,
      caracteristicas
    } = body
    
    // Criar o imóvel no banco de dados
    const novoImovel = await prisma.imovel.create({
      data: {
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
        tipoImovel,
        status,
        destaque: destaque || false,
        construtoraId,
        caracteristicas
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
