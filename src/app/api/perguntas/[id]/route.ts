import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

// GET: Buscar uma pergunta específica
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const pergunta = await prisma.pergunta.findUnique({
      where: { id: params.id }
    })
    
    if (!pergunta) {
      return NextResponse.json(
        { error: 'Pergunta não encontrada' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(pergunta)
  } catch (error) {
    console.error(`Erro ao buscar pergunta ${params.id}:`, error)
    return NextResponse.json(
      { error: 'Erro ao buscar pergunta' },
      { status: 500 }
    )
  }
}

// PATCH: Atualizar uma pergunta
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const data = await request.json()
    
    // Verificar se a pergunta existe
    const pergunta = await prisma.pergunta.findUnique({
      where: { id: params.id }
    })
    
    if (!pergunta) {
      return NextResponse.json(
        { error: 'Pergunta não encontrada' },
        { status: 404 }
      )
    }
    
    // Atualizar a pergunta
    const perguntaAtualizada = await prisma.pergunta.update({
      where: { id: params.id },
      data
    })
    
    return NextResponse.json(perguntaAtualizada)
  } catch (error) {
    console.error(`Erro ao atualizar pergunta ${params.id}:`, error)
    return NextResponse.json(
      { error: 'Erro ao atualizar pergunta' },
      { status: 500 }
    )
  }
}

// DELETE: Excluir uma pergunta
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Verificar se a pergunta existe
    const pergunta = await prisma.pergunta.findUnique({
      where: { id: params.id }
    })
    
    if (!pergunta) {
      return NextResponse.json(
        { error: 'Pergunta não encontrada' },
        { status: 404 }
      )
    }
    
    // Atualizar ordens de perguntas subsequentes
    await prisma.pergunta.updateMany({
      where: {
        categoria: pergunta.categoria,
        ordem: { gt: pergunta.ordem }
      },
      data: {
        ordem: { decrement: 1 }
      }
    })
    
    // Excluir a pergunta
    await prisma.pergunta.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json(
      { success: true, message: 'Pergunta excluída com sucesso' }
    )
  } catch (error) {
    console.error(`Erro ao excluir pergunta ${params.id}:`, error)
    return NextResponse.json(
      { error: 'Erro ao excluir pergunta' },
      { status: 500 }
    )
  }
}
