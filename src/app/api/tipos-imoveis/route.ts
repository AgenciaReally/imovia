import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/tipos-imoveis
 * Retorna todos os tipos de imóveis cadastrados
 */
export async function GET(
  request: NextRequest,
) {
  try {
    // Buscar todos os tipos de imóveis no banco
    const tiposImoveis = await prisma.tipoImovel.findMany({
      orderBy: {
        nome: 'asc'
      }
    })

    return NextResponse.json(tiposImoveis, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar tipos de imóveis:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar tipos de imóveis' },
      { status: 500 }
    )
  }
}
