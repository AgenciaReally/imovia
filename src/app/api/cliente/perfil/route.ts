import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { getServerSession } from "@/lib/session";

// GET - Buscar dados do perfil
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

    // Verificar se o usuário é um cliente
    const usuario = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        telefone: true,
        role: true,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    if (usuario.role !== "CLIENTE") {
      return NextResponse.json(
        { error: "Acesso permitido apenas para clientes" },
        { status: 403 }
      );
    }

    // Retornar os dados do perfil
    return NextResponse.json(usuario);
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dados do perfil" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT - Atualizar dados do perfil
export async function PUT(req: NextRequest) {
  try {
    const dadosPerfil = await req.json();
    
    // Verificar autenticação
    const session = await getServerSession();
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    // Verificar se o usuário é um cliente
    const usuario = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    if (usuario.role !== "CLIENTE") {
      return NextResponse.json(
        { error: "Acesso permitido apenas para clientes" },
        { status: 403 }
      );
    }

    // Preparar dados para atualização
    const dadosAtualizacao: any = {};

    // Atualizar apenas os campos fornecidos
    if (dadosPerfil.name) dadosAtualizacao.name = dadosPerfil.name;
    if (dadosPerfil.telefone) dadosAtualizacao.telefone = dadosPerfil.telefone;

    // Se uma nova senha foi fornecida, hash e atualiza
    if (dadosPerfil.senha) {
      // Verificar se a senha atual está correta
      if (!dadosPerfil.senhaAtual) {
        return NextResponse.json(
          { error: "Senha atual é obrigatória para alterar a senha" },
          { status: 400 }
        );
      }

      // Verificar se a senha atual está correta usando bcrypt
      const bcrypt = require('bcrypt');
      const senhaCorreta = await bcrypt.compare(dadosPerfil.senhaAtual, usuario.password);
      if (!senhaCorreta) {
        return NextResponse.json(
          { error: "Senha atual incorreta" },
          { status: 400 }
        );
      }

      // Hash da nova senha
      dadosAtualizacao.password = await hash(dadosPerfil.senha, 10);
    }

    // Atualizar o usuário
    const usuarioAtualizado = await prisma.user.update({
      where: {
        id: usuario.id,
      },
      data: dadosAtualizacao,
      select: {
        id: true,
        name: true,
        email: true,
        telefone: true,
        role: true,
      },
    });

    return NextResponse.json(usuarioAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar dados do perfil" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
