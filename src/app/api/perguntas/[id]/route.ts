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
    const { id } = await params
    const pergunta = await prisma.pergunta.findUnique({
      where: { id }
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
    const { id } = await params
    const data = await request.json()
    
    console.log('=== PATCH PERGUNTA DEBUG ===')
    console.log('ID:', id)
    console.log('Dados recebidos:', JSON.stringify(data, null, 2))
    
    // Verificar se a pergunta existe
    const pergunta = await prisma.pergunta.findUnique({
      where: { id }
    })
    
    if (!pergunta) {
      return NextResponse.json(
        { error: 'Pergunta não encontrada' },
        { status: 404 }
      )
    }
    
    // Atualizar a pergunta
    const perguntaAtualizada = await prisma.pergunta.update({
      where: { id },
      data
    })
    
    console.log('Pergunta atualizada:', JSON.stringify(perguntaAtualizada, null, 2))
    return NextResponse.json(perguntaAtualizada)
  } catch (error) {
    console.error(`Erro ao atualizar pergunta:`, error)
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
    const { id } = await params
    console.log(`=== API DELETE PERGUNTA ===`)
    console.log(`ID recebido: ${id}`)
    
    // Verificar se a pergunta existe
    const pergunta = await prisma.pergunta.findUnique({
      where: { id }
    })
    
    console.log(`Pergunta encontrada:`, pergunta ? { id: pergunta.id, texto: pergunta.texto } : 'null')
    
    if (!pergunta) {
      console.log(`Pergunta ${id} não encontrada no banco`)
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
      where: { id }
    })
    
    return NextResponse.json(
      { success: true, message: 'Pergunta excluída com sucesso' }
    )
  } catch (error) {
    console.error(`Erro ao excluir pergunta:`, error)
    return NextResponse.json(
      { error: 'Erro ao excluir pergunta' },
      { status: 500 }
    )
  }
}
