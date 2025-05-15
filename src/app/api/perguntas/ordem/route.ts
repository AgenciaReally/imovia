import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH: Reordenar perguntas
export async function PATCH(request: NextRequest) {
  try {
    const { perguntaId, novaOrdem, categoria } = await request.json()
    
    if (!perguntaId || !categoria || novaOrdem === undefined) {
      return NextResponse.json(
        { error: 'Dados incompletos para reordenar pergunta' },
        { status: 400 }
      )
    }
    
    // Buscar a pergunta a ser movida
    const perguntaAtual = await prisma.pergunta.findUnique({
      where: { id: perguntaId }
    })
    
    if (!perguntaAtual) {
      return NextResponse.json(
        { error: 'Pergunta não encontrada' },
        { status: 404 }
      )
    }
    
    const ordemAtual = perguntaAtual.ordem
    
    // Verificar se a ordem realmente mudou
    if (ordemAtual === novaOrdem) {
      return NextResponse.json({ success: true, message: 'Ordem não alterada' })
    }
    
    // Atualizar as ordens das outras perguntas
    if (ordemAtual < novaOrdem) {
      // Mover para baixo: diminuir a ordem das perguntas entre a antiga posição+1 e a nova posição
      await prisma.pergunta.updateMany({
        where: {
          categoria,
          ordem: {
            gt: ordemAtual,
            lte: novaOrdem
          }
        },
        data: {
          ordem: { decrement: 1 }
        }
      })
    } else {
      // Mover para cima: aumentar a ordem das perguntas entre a nova posição e a antiga posição-1
      await prisma.pergunta.updateMany({
        where: {
          categoria,
          ordem: {
            gte: novaOrdem,
            lt: ordemAtual
          }
        },
        data: {
          ordem: { increment: 1 }
        }
      })
    }
    
    // Atualizar a ordem da pergunta movida
    await prisma.pergunta.update({
      where: { id: perguntaId },
      data: { ordem: novaOrdem }
    })
    
    return NextResponse.json({ success: true, message: 'Ordem atualizada com sucesso' })
  } catch (error) {
    console.error('Erro ao reordenar pergunta:', error)
    return NextResponse.json(
      { error: 'Erro ao reordenar pergunta' },
      { status: 500 }
    )
  }
}
