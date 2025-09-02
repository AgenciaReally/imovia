import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      evento,
      pagina,
      elemento,
      propriedades,
      sessaoId,
      userId
    } = body

    // Validar campos obrigatórios
    if (!evento || !pagina) {
      return NextResponse.json(
        { error: 'Evento e página são obrigatórios' },
        { status: 400 }
      )
    }

    // Obter informações da requisição
    const userAgent = request.headers.get('user-agent') || undefined
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : 
               request.headers.get('x-real-ip') || 
               undefined

    // Salvar evento no banco
    const analytic = await prisma.analytics.create({
      data: {
        evento,
        pagina,
        elemento,
        propriedades,
        userAgent,
        ip,
        sessaoId,
        userId: userId || undefined
      }
    })

    return NextResponse.json({ 
      success: true, 
      id: analytic.id 
    })

  } catch (error) {
    console.error('Erro ao salvar analytics:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Endpoint para buscar dados de analytics (para relatórios)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const evento = searchParams.get('evento')
    const pagina = searchParams.get('pagina')
    const dataInicio = searchParams.get('dataInicio')
    const dataFim = searchParams.get('dataFim')
    const limit = parseInt(searchParams.get('limit') || '100')

    const where: any = {}

    if (evento) where.evento = evento
    if (pagina) where.pagina = pagina
    if (dataInicio || dataFim) {
      where.timestamp = {}
      if (dataInicio) where.timestamp.gte = new Date(dataInicio)
      if (dataFim) where.timestamp.lte = new Date(dataFim)
    }

    const analytics = await prisma.analytics.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit,
      include: {
        usuario: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })

    return NextResponse.json(analytics)

  } catch (error) {
    console.error('Erro ao buscar analytics:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
