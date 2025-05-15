import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../generated/prisma'

const prisma = new PrismaClient()

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    // Usar await para acessar params.id conforme recomendação do Next.js
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: 'ID da construtora não fornecido' }, { status: 400 })
    }
    
    const construtora = await prisma.construtora.findUnique({
      where: { id },
      include: {
        imoveis: true,
        usuarios: true,
      },
    })

    if (!construtora) {
      return NextResponse.json({ error: 'Construtora não encontrada' }, { status: 404 })
    }

    return NextResponse.json({
      id: construtora.id,
      nome: construtora.nome,
      email: construtora.email,
      telefone: construtora.telefone || '-',
      cnpj: construtora.cnpj || '-',
      endereco: construtora.endereco || '-',
      status: construtora.ativa ? 'ativa' : 'inativa',
      dataRegistro: construtora.createdAt.toLocaleDateString('pt-BR'),
      qtdImoveis: construtora.imoveis.length,
      qtdUsuarios: construtora.usuarios.length
    })
  } catch (error) {
    console.error('Erro ao buscar construtora:', error)
    return NextResponse.json({ error: 'Erro ao buscar construtora' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()
    
    if (!id) {
      return NextResponse.json({ error: 'ID da construtora não fornecido' }, { status: 400 })
    }
    
    // Verificar se a construtora existe
    const construtora = await prisma.construtora.findUnique({
      where: { id }
    })
    
    if (!construtora) {
      return NextResponse.json({ error: 'Construtora não encontrada' }, { status: 404 })
    }
    
    // Atualizar a construtora
    const construtorAtualizada = await prisma.construtora.update({
      where: { id },
      data: {
        nome: data.nome !== undefined ? data.nome : construtora.nome,
        email: data.email !== undefined ? data.email : construtora.email,
        cnpj: data.cnpj !== undefined ? data.cnpj : construtora.cnpj,
        telefone: data.telefone !== undefined ? data.telefone : construtora.telefone,
        endereco: data.endereco !== undefined ? data.endereco : construtora.endereco,
        ativa: data.ativa !== undefined ? data.ativa : construtora.ativa
      }
    })
    
    return NextResponse.json(construtorAtualizada)
  } catch (error) {
    console.error('Erro ao atualizar construtora:', error)
    return NextResponse.json({ error: 'Erro ao atualizar construtora' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    // Usar await para acessar params.id conforme recomendação do Next.js
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: 'ID da construtora não fornecido' }, { status: 400 })
    }
    
    // Verificar se a construtora existe
    const construtora = await prisma.construtora.findUnique({
      where: { id }
    })
    
    if (!construtora) {
      return NextResponse.json({ error: 'Construtora não encontrada' }, { status: 404 })
    }
    
    // Excluir permanentemente a construtora
    await prisma.construtora.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Construtora excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir construtora:', error)
    return NextResponse.json({ error: 'Erro ao excluir construtora' }, { status: 500 })
  }
}
