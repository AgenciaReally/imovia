import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Buscar todos os administradores
export async function GET(request: NextRequest) {
  try {
    // Obter todos os usuários com role ADMIN
    const admins = await prisma.user.findMany({
      where: {
        role: "ADMIN"
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Mapear para o formato mais simples
    const adminsMapeados = admins.map(admin => ({
      id: admin.id,
      nome: admin.name,
      email: admin.email,
      telefone: admin.telefone || "",
      dataCriacao: admin.createdAt.toISOString(),
      ultimoAcesso: admin.updatedAt.toISOString()
    }));

    return NextResponse.json(adminsMapeados);
  } catch (error) {
    console.error("Erro ao buscar administradores:", error);
    return NextResponse.json(
      { error: "Erro ao buscar administradores" },
      { status: 500 }
    );
  }
}

// POST - Criar um novo administrador
export async function POST(request: NextRequest) {
  try {
    // Obter dados do corpo da requisição
    const data = await request.json();
    
    // Verificar se o e-mail já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: "Este e-mail já está em uso" },
        { status: 400 }
      );
    }
    
    // Hash padrão Argon2id para senha
    const senhaPadrao = "$argon2id$v=19$m=65536,t=3,p=4$Mk5hkfoOqUHb5/NxDuaNSQ$krdC9ZkUsW8TCErH+K0qanJadZxxKJSfKDo80LP9lxg";
    
    // Criar usuário sempre com a senha padrão
    const novoAdmin = await prisma.user.create({
      data: {
        name: data.nome,
        email: data.email,
        password: senhaPadrao, // Sempre usar a senha padrão
        telefone: data.telefone,
        role: "ADMIN"
      }
    });
    
    return NextResponse.json({
      id: novoAdmin.id,
      nome: novoAdmin.name,
      email: novoAdmin.email
    });
    
  } catch (error) {
    console.error("Erro ao criar administrador:", error);
    return NextResponse.json(
      { error: "Erro ao criar administrador" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar um administrador existente
export async function PUT(request: NextRequest) {
  try {
    // Obter dados do corpo da requisição
    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json(
        { error: "ID do administrador não fornecido" },
        { status: 400 }
      );
    }
    
    // Verificar se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id: data.id }
    });
    
    if (!existingUser) {
      return NextResponse.json(
        { error: "Administrador não encontrado" },
        { status: 404 }
      );
    }
    
    // Hash padrão Argon2id para senha
    const senhaPadrao = "$argon2id$v=19$m=65536,t=3,p=4$Mk5hkfoOqUHb5/NxDuaNSQ$krdC9ZkUsW8TCErH+K0qanJadZxxKJSfKDo80LP9lxg";
    
    // Preparar os dados para atualização
    const updateData = {
      name: data.nome,
      email: data.email,
      telefone: data.telefone
    };
    
    // Se uma senha for solicitada, usar sempre a padrão
    if (data.senha) {
      Object.assign(updateData, { password: senhaPadrao });
    }
    
    // Atualizar usuário
    const adminAtualizado = await prisma.user.update({
      where: { id: data.id },
      data: updateData
    });
    
    return NextResponse.json({
      id: adminAtualizado.id,
      nome: adminAtualizado.name,
      email: adminAtualizado.email
    });
    
  } catch (error) {
    console.error("Erro ao atualizar administrador:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar administrador" },
      { status: 500 }
    );
  }
}

// DELETE - Excluir um administrador
export async function DELETE(request: NextRequest) {
  try {
    // Obter ID da query
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: "ID do administrador não fornecido" },
        { status: 400 }
      );
    }
    
    // Verificar se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });
    
    if (!existingUser) {
      return NextResponse.json(
        { error: "Administrador não encontrado" },
        { status: 404 }
      );
    }
    
    // Excluir usuário
    await prisma.user.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("Erro ao excluir administrador:", error);
    return NextResponse.json(
      { error: "Erro ao excluir administrador" },
      { status: 500 }
    );
  }
}
