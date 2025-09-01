import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../generated/prisma'

const prisma = new PrismaClient()

// Interface para o ranking de construtoras
interface RankingConstrutora {
  id: string
  nome: string
  _count: {
    imoveis: number
    usuarios: number
  }
}

export async function GET() {
  try {
    const total = await prisma.construtora.count()
    const ativas = await prisma.construtora.count({
      where: { ativa: true }
    })
    const inativas = await prisma.construtora.count({
      where: { ativa: false }
    })
    
    // Os pendentes seriam construtoras em processo de aprovação
    // Como todas as construtoras estão ativas, não temos nenhuma pendente
    const pendentes = 0

    // Calculando imóveis e usuários totais
    const totalImoveis = await prisma.imovel.count()
    const estatisticasAvancadas = await prisma.construtora.findMany({
      select: {
        id: true,
        _count: {
          select: {
            imoveis: true,
            usuarios: true
          }
        }
      }
    })

    // Calculando médias
    const mediaImoveisPorConstrutora = total > 0 
      ? estatisticasAvancadas.reduce((acc, curr) => acc + curr._count.imoveis, 0) / total
      : 0
    
    const mediaUsuariosPorConstrutora = total > 0
      ? estatisticasAvancadas.reduce((acc, curr) => acc + curr._count.usuarios, 0) / total
      : 0

    // Identificando construtoras com mais imóveis e usuários
    const rankingConstrutoras = await prisma.construtora.findMany({
      select: {
        id: true,
        nome: true,
        _count: {
          select: {
            imoveis: true,
            usuarios: true
          }
        }
      },
      orderBy: {
        imoveis: {
          _count: 'desc'
        }
      },
      take: 5
    })

    return NextResponse.json({
      total,
      ativas,
      inativas,
      pendentes,
      totalImoveis,
      mediaImoveisPorConstrutora,
      mediaUsuariosPorConstrutora,
      rankingConstrutoras
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas de construtoras:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao buscar estatísticas de construtoras',
        total: 0,
        ativas: 0,
        inativas: 0,
        pendentes: 0,
        totalImoveis: 0,
        mediaImoveisPorConstrutora: 0,
        mediaUsuariosPorConstrutora: 0,
        rankingConstrutoras: []
      }, 
      { status: 500 }
    )
  }
}
