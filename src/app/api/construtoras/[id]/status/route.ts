import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../../generated/prisma'

const prisma = new PrismaClient()

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { status } = await request.json()
    
    if (!id) {
      return NextResponse.json({ error: 'ID da construtora não fornecido' }, { status: 400 })
    }
    
    if (!status || !['ativa', 'inativa'].includes(status)) {
      return NextResponse.json({ error: 'Status inválido. Use "ativa" ou "inativa"' }, { status: 400 })
    }
    
    // Verificar se a construtora existe
    const construtora = await prisma.construtora.findUnique({
      where: { id }
    })
    
    if (!construtora) {
      return NextResponse.json({ error: 'Construtora não encontrada' }, { status: 404 })
    }
    
    // Atualizar o status da construtora
    const ativa = status === 'ativa'
    const construtoraAtualizada = await prisma.construtora.update({
      where: { id },
      data: { ativa }
    })
    
    return NextResponse.json({
      id: construtoraAtualizada.id,
      nome: construtoraAtualizada.nome,
      status: ativa ? 'ativa' : 'inativa',
      message: `Construtora ${ativa ? 'ativada' : 'desativada'} com sucesso`
    })
  } catch (error) {
    console.error('Erro ao atualizar status da construtora:', error)
    return NextResponse.json({ error: 'Erro ao atualizar status da construtora' }, { status: 500 })
  }
}
