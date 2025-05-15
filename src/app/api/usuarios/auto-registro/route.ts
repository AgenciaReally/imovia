import { NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { randomBytes, createHash } from 'crypto'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    // Obter dados do corpo da solicitação
    const data = await request.json()
    const { nome, email, telefone } = data
    
    // Validar campos obrigatórios
    if (!nome || !email) {
      return NextResponse.json(
        { error: 'Nome e email são obrigatórios' },
        { status: 400 }
      )
    }
    
    // Verificar se o usuário já existe
    const usuarioExistente = await prisma.user.findUnique({
      where: { email }
    })
    
    if (usuarioExistente) {
      // Retornar token de autenticação para o usuário existente
      const token = createHash('sha256')
        .update(usuarioExistente.id + Date.now().toString())
        .digest('hex')
      
      return NextResponse.json({
        success: true,
        message: 'Usuário já registrado',
        userId: usuarioExistente.id,
        token,
        isNew: false
      })
    }
    
    // Gerar senha aleatória
    const senhaGerada = randomBytes(8).toString('hex')
    const senha = createHash('sha256')
      .update(senhaGerada)
      .digest('hex')
    
    // Criar novo usuário
    const novoUsuario = await prisma.user.create({
      data: {
        name: nome,
        email,
        telefone,
        password: senha,
        role: 'CLIENTE'
      }
    })
    
    // Gerar token de autenticação
    const token = createHash('sha256')
      .update(novoUsuario.id + Date.now().toString())
      .digest('hex')
    
    console.log(`Usuário criado automaticamente: ${nome} (${email})`)
    
    return NextResponse.json({
      success: true,
      message: 'Usuário criado com sucesso',
      userId: novoUsuario.id,
      token,
      senhaGerada, // Senha em texto limpo para o usuário
      isNew: true
    })
  } catch (error) {
    console.error('Erro ao registrar usuário automaticamente:', error)
    return NextResponse.json(
      { error: 'Erro interno ao registrar usuário' },
      { status: 500 }
    )
  }
}
