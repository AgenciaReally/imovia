import { NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { randomBytes } from 'crypto'
import { enviarEmailBoasVindas } from '@/services/email-boas-vindas'
import { SignJWT } from 'jose'
import * as argon2 from 'argon2'

// Chave secreta para JWT - deve ser a mesma usada na rota de session
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'seu_segredo_super_secreto_aqui_pelo_menos_32_caracteres')

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
      // Criar um JWT válido para o usuário existente
      const token = await new SignJWT({
        id: usuarioExistente.id,
        email: usuarioExistente.email,
        name: usuarioExistente.name,
        role: usuarioExistente.role
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(JWT_SECRET)
      
      // Preparar response com cookie
      const response = NextResponse.json({
        success: true,
        message: 'Usuário já registrado',
        userId: usuarioExistente.id,
        isNew: false,
        usuario: {
          id: usuarioExistente.id,
          email: usuarioExistente.email,
          nome: usuarioExistente.name,
          role: usuarioExistente.role
        }
      })
      
      // Definir cookie de autenticação
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 dias
        path: '/'
      })
      
      return response
    }
    
    // Gerar senha aleatória
    const senhaGerada = randomBytes(8).toString('hex')
    // Usar argon2 para hash da senha em vez de SHA-256
    const senha = await argon2.hash(senhaGerada)
    
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
    
    // Gerar token JWT de autenticação
    const token = await new SignJWT({
      id: novoUsuario.id,
      email: novoUsuario.email,
      name: novoUsuario.name,
      role: novoUsuario.role
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET)
    
    console.log(`Usuário criado automaticamente: ${nome} (${email})`)
    console.log(`Token JWT gerado com sucesso`)
    
    // Preparar response com cookie
    const response = NextResponse.json({
      success: true,
      message: 'Usuário criado com sucesso',
      userId: novoUsuario.id,
      token,
      senhaGerada, // Senha em texto limpo para o usuário
      isNew: true
    })
    
    // Definir cookie de autenticação
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/'
    })
    
    // Enviar email de boas-vindas com a senha diretamente usando o serviço
    try {
      const emailEnviado = await enviarEmailBoasVindas({
        nome,
        email,
        senha: senhaGerada
      });
      
      if (emailEnviado) {
        console.log('Email de boas-vindas enviado com sucesso');
      } else {
        console.error('Falha ao enviar email de boas-vindas');
      }
    } catch (emailError) {
      console.error('Erro ao enviar email de boas-vindas:', emailError);
    }
    
    return response
  } catch (error) {
    console.error('Erro ao registrar usuário automaticamente:', error)
    return NextResponse.json(
      { error: 'Erro interno ao registrar usuário' },
      { status: 500 }
    )
  }
}
