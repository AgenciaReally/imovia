import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET para buscar um cliente específico por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json(
        { error: "ID do cliente é obrigatório" },
        { status: 400 }
      )
    }

    // Buscar cliente no banco
    const cliente = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        respostas: {
          include: {
            pergunta: true // Incluir as informações da pergunta associada
          }
        },
      },
    })

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      )
    }

    // Extrair informações adicionais do cliente (como preferências) que podem estar em outros campos
    // Estes dados podem ser adicionados posteriormente quando houver estas tabelas no schema

    // Tentar extrair interesses das respostas
    const interesses: string[] = [];
    if (cliente.respostas.length > 0) {
      // Verificar respostas que possam indicar interesses
      const respostasInteresse = cliente.respostas.filter(r => 
        r.pergunta && (r.pergunta.categoria === 'PREFERENCIAS' || r.pergunta.categoria === 'IMOVEL_IDEAL')
      );
      
      // Adicionar valores únicos aos interesses
      respostasInteresse.forEach(resposta => {
        if (resposta.valor && !interesses.includes(resposta.valor)) {
          interesses.push(resposta.valor);
        }
      });
    }
    
    // Retornar os dados do cliente com campos virtuais para manter consistência com a API principal
    return NextResponse.json({
      cliente: {
        id: cliente.id,
        name: cliente.name,
        email: cliente.email,
        telefone: cliente.telefone || "",
        role: cliente.role,
        createdAt: cliente.createdAt.toISOString(),
        updatedAt: cliente.updatedAt.toISOString(),
        status: 'ativo', // Por padrão consideramos ativos
        origem: cliente.respostas.length > 0 ? 'Site Externo' : 'Cadastro Local',
        interesses: interesses.length > 0 ? interesses : ['Não especificado'],
        totalRespostas: cliente.respostas?.length || 0,
        construtoraId: cliente.construtoraId,
      },
    })
  } catch (error) {
    console.error("Erro ao buscar cliente:", error)
    return NextResponse.json(
      { error: "Erro ao processar a solicitação" },
      { status: 500 }
    )
  }
}

// PUT para atualizar um cliente
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: "ID do cliente é obrigatório" },
        { status: 400 }
      )
    }

    // Verificar se o cliente existe
    const clienteExistente = await prisma.user.findUnique({
      where: {
        id: id,
      },
    })

    if (!clienteExistente) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      )
    }

    // Preparar dados para atualização - apenas com campos válidos do modelo User
    const dadosAtualizacao = {
      name: body.name,
      email: body.email,
      telefone: body.telefone || null,
      updatedAt: new Date(),
    }

    // Atualizar cliente
    const clienteAtualizado = await prisma.user.update({
      where: {
        id: id,
      },
      data: dadosAtualizacao,
    })

    // Retornar sucesso
    return NextResponse.json({
      success: true,
      cliente: {
        id: clienteAtualizado.id,
        name: clienteAtualizado.name,
        email: clienteAtualizado.email,
        role: clienteAtualizado.role,
      },
    })
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error)
    return NextResponse.json(
      { error: "Erro ao processar a solicitação" },
      { status: 500 }
    )
  }
}

// PATCH para atualizar parcialmente um cliente (ex: apenas status)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: "ID do cliente é obrigatório" },
        { status: 400 }
      )
    }

    // Verificar se o cliente existe
    const clienteExistente = await prisma.user.findUnique({
      where: {
        id: id,
      },
    })

    if (!clienteExistente) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      )
    }

    // Preparar dados para atualização (apenas os campos fornecidos e válidos)
    const dadosAtualizacao: any = {
      updatedAt: new Date(),
    }

    // Adicionar apenas os campos presentes no body e que existem no modelo User
    if (body.name) dadosAtualizacao.name = body.name
    if (body.email) dadosAtualizacao.email = body.email
    if (body.telefone !== undefined) dadosAtualizacao.telefone = body.telefone || null
    if (body.role) dadosAtualizacao.role = body.role

    // Atualizar cliente
    const clienteAtualizado = await prisma.user.update({
      where: {
        id: id,
      },
      data: dadosAtualizacao,
    })

    // Retornar sucesso
    return NextResponse.json({
      success: true,
      cliente: {
        id: clienteAtualizado.id,
        name: clienteAtualizado.name,
        role: clienteAtualizado.role,
      },
    })
  } catch (error) {
    console.error("Erro ao atualizar status do cliente:", error)
    return NextResponse.json(
      { error: "Erro ao processar a solicitação" },
      { status: 500 }
    )
  }
}

// DELETE para excluir um cliente
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json(
        { error: "ID do cliente é obrigatório" },
        { status: 400 }
      )
    }

    // Verificar se o cliente existe
    const clienteExistente = await prisma.user.findUnique({
      where: {
        id: id,
      },
    })

    if (!clienteExistente) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      )
    }

    // Excluir cliente
    await prisma.user.delete({
      where: {
        id: id,
      },
    })

    // Retornar sucesso
    return NextResponse.json({
      success: true,
      message: "Cliente excluído com sucesso",
    })
  } catch (error) {
    console.error("Erro ao excluir cliente:", error)
    return NextResponse.json(
      { error: "Erro ao processar a solicitação" },
      { status: 500 }
    )
  }
}
