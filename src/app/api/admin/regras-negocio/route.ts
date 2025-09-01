import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";

export async function GET() {
  try {
    // Verificar autenticação de admin
    const session = await getServerSession();
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }
    
    const usuario = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    });
    
    if (!usuario || usuario.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Acesso permitido apenas para administradores" },
        { status: 403 }
      );
    }

    // Buscar todas as regras de negócio
    const regras = await prisma.regraNegocio.findMany({
      orderBy: [
        { ordem: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({
      success: true,
      regras,
      total: regras.length
    });

  } catch (error) {
    console.error("Erro ao buscar regras de negócio:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticação de admin
    const session = await getServerSession();
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }
    
    const usuario = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    });
    
    if (!usuario || usuario.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Acesso permitido apenas para administradores" },
        { status: 403 }
      );
    }

    const dados = await req.json();
    
    // Validações básicas
    if (!dados.nome || !dados.tipo || !dados.acao) {
      return NextResponse.json(
        { error: "Campos obrigatórios: nome, tipo, acao" },
        { status: 400 }
      );
    }

    // Criar nova regra
    const novaRegra = await prisma.regraNegocio.create({
      data: {
        nome: dados.nome,
        descricao: dados.descricao,
        tipo: dados.tipo,
        ativa: dados.ativa ?? true,
        condicao: dados.condicao || {},
        acao: dados.acao,
        valorMinimo: dados.valorMinimo,
        valorMaximo: dados.valorMaximo,
        percentualMinimo: dados.percentualMinimo,
        percentualMaximo: dados.percentualMaximo,
        taxaJuros: dados.taxaJuros,
        taxaAprovacao: dados.taxaAprovacao,
        custoAdicionalITBI: dados.custoAdicionalITBI ?? 0.03,
        custoEscrituraReg: dados.custoEscrituraReg ?? 0.015,
        taxaAvaliacaoImovel: dados.taxaAvaliacaoImovel ?? 2500,
        custoSegurosTaxas: dados.custoSegurosTaxas ?? 15000,
        mensagemEncerramento: dados.mensagemEncerramento,
        perguntasCriar: dados.perguntasCriar,
        perguntasOcultar: dados.perguntasOcultar || [],
        ordem: dados.ordem ?? 0
      }
    });

    return NextResponse.json({
      success: true,
      regra: novaRegra,
      message: "Regra criada com sucesso"
    });

  } catch (error) {
    console.error("Erro ao criar regra de negócio:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Verificar autenticação de admin
    const session = await getServerSession();
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }
    
    const usuario = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    });
    
    if (!usuario || usuario.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Acesso permitido apenas para administradores" },
        { status: 403 }
      );
    }

    const dados = await req.json();
    
    if (!dados.id) {
      return NextResponse.json(
        { error: "ID da regra é obrigatório" },
        { status: 400 }
      );
    }

    // Atualizar regra existente
    const regraAtualizada = await prisma.regraNegocio.update({
      where: { id: dados.id },
      data: {
        nome: dados.nome,
        descricao: dados.descricao,
        tipo: dados.tipo,
        ativa: dados.ativa,
        condicao: dados.condicao || {},
        acao: dados.acao,
        valorMinimo: dados.valorMinimo,
        valorMaximo: dados.valorMaximo,
        percentualMinimo: dados.percentualMinimo,
        percentualMaximo: dados.percentualMaximo,
        taxaJuros: dados.taxaJuros,
        taxaAprovacao: dados.taxaAprovacao,
        custoAdicionalITBI: dados.custoAdicionalITBI,
        custoEscrituraReg: dados.custoEscrituraReg,
        taxaAvaliacaoImovel: dados.taxaAvaliacaoImovel,
        custoSegurosTaxas: dados.custoSegurosTaxas,
        mensagemEncerramento: dados.mensagemEncerramento,
        perguntasCriar: dados.perguntasCriar,
        perguntasOcultar: dados.perguntasOcultar || [],
        ordem: dados.ordem,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      regra: regraAtualizada,
      message: "Regra atualizada com sucesso"
    });

  } catch (error) {
    console.error("Erro ao atualizar regra de negócio:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
