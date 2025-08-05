import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  // Obter o email da URL
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  
  if (!email) {
    return NextResponse.json({
      success: false,
      message: 'Email não fornecido. Use ?email=seuEmail@exemplo.com'
    }, { status: 400 });
  }
  
  try {
    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
      }
    });
    
    if (user) {
      return NextResponse.json({
        success: true,
        exists: true,
        message: `O email ${email} existe no banco de dados`,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    } else {
      return NextResponse.json({
        success: true,
        exists: false,
        message: `O email ${email} NÃO existe no banco de dados`
      });
    }
  } catch (error: any) {
    console.error('Erro ao verificar email:', error);
    
    return NextResponse.json({
      success: false,
      message: `Erro: ${error.message || 'Erro desconhecido'}`,
      error: String(error)
    }, { status: 500 });
  }
}
