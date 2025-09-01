import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";

// GET - Buscar configurações do usuário
export async function GET(req: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession();
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }
    
    // Buscar usuário pelo email
    const usuario = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    });
    
    if (!usuario || usuario.role !== "CLIENTE") {
      return NextResponse.json(
        { error: "Acesso permitido apenas para clientes" },
        { status: 403 }
      );
    }
    
    // Buscar configurações do usuário
    const configuracoes = await prisma.configuracaoUsuario.findUnique({
      where: { userId: usuario.id }
    });
    
    // Se não existir configuração, retornar valores padrão
    if (!configuracoes) {
      return NextResponse.json({
        temaEscuro: false,
        notificacoesEmail: true,
        notificacoesNovoImovel: true,
        notificacoesAtualizacoes: true
      });
    }
    
    return NextResponse.json({
      temaEscuro: configuracoes.temaEscuro,
      notificacoesEmail: configuracoes.notificacoesEmail,
      notificacoesNovoImovel: configuracoes.notificacoesNovoImovel,
      notificacoesAtualizacoes: configuracoes.notificacoesAtualizacoes
    });
  } catch (error) {
    console.error("Erro ao buscar configurações:", error);
    return NextResponse.json(
      { error: "Erro ao buscar configurações" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT - Atualizar configurações do usuário
export async function PUT(req: NextRequest) {
  try {
    const dadosConfiguracao = await req.json();
    
    // Verificar autenticação
    const session = await getServerSession();
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }
    
    // Buscar usuário pelo email
    const usuario = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    });
    
    if (!usuario || usuario.role !== "CLIENTE") {
      return NextResponse.json(
        { error: "Acesso permitido apenas para clientes" },
        { status: 403 }
      );
    }
    
    // Verificar se já existe configuração para o usuário
    const configuracaoExistente = await prisma.configuracaoUsuario.findUnique({
      where: { userId: usuario.id }
    });
    
    let configuracaoAtualizada;
    
    if (configuracaoExistente) {
      // Atualizar configuração existente
      configuracaoAtualizada = await prisma.configuracaoUsuario.update({
        where: { userId: usuario.id },
        data: dadosConfiguracao
      });
    } else {
      // Criar nova configuração
      configuracaoAtualizada = await prisma.configuracaoUsuario.create({
        data: {
          userId: usuario.id,
          ...dadosConfiguracao
        }
      });
    }
    
    return NextResponse.json({
      temaEscuro: configuracaoAtualizada.temaEscuro,
      notificacoesEmail: configuracaoAtualizada.notificacoesEmail,
      notificacoesNovoImovel: configuracaoAtualizada.notificacoesNovoImovel,
      notificacoesAtualizacoes: configuracaoAtualizada.notificacoesAtualizacoes
    });
  } catch (error) {
    console.error("Erro ao atualizar configurações:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar configurações" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
