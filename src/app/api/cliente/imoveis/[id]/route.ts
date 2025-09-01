import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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

    const imovelId = params.id;
    
    // Buscar o imóvel salvo específico
    const imovelSalvo = await prisma.clienteImovelSalvo.findFirst({
      where: { 
        userId: usuario.id,
        imovelId: imovelId,
        ativo: true
      }
    });

    if (!imovelSalvo) {
      return NextResponse.json(
        { error: "Imóvel não encontrado" },
        { status: 404 }
      );
    }
    
    // Formatar dados para o frontend
    const imovelFormatado = {
      id: imovelSalvo.imovelId,
      titulo: imovelSalvo.titulo,
      preco: imovelSalvo.preco,
      area: imovelSalvo.area,
      quartos: imovelSalvo.quartos,
      banheiros: imovelSalvo.banheiros,
      vagas: imovelSalvo.vagas,
      endereco: imovelSalvo.endereco,
      bairro: imovelSalvo.bairro,
      cidade: imovelSalvo.cidade,
      fotoPrincipal: imovelSalvo.fotoPrincipal,
      construtora: imovelSalvo.construtoraNome ? {
        id: imovelSalvo.construtoraId,
        nome: imovelSalvo.construtoraNome,
        telefone: imovelSalvo.telefoneContato || ''
      } : null,
      matchPercentage: imovelSalvo.matchPercentage,
      favorito: imovelSalvo.tipo === 'FAVORITO',
      motivos: imovelSalvo.motivos,
      tipo: imovelSalvo.tipo,
      dataSalvo: imovelSalvo.createdAt
    };
    
    return NextResponse.json({
      success: true,
      data: imovelFormatado
    });
  } catch (error) {
    console.error("Erro ao buscar imóvel:", error);
    return NextResponse.json(
      { error: "Erro ao buscar imóvel" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

    const { favorito } = await req.json();
    const imovelId = params.id;
    
    // Atualizar o tipo do imóvel salvo
    const imovelAtualizado = await prisma.clienteImovelSalvo.updateMany({
      where: { 
        userId: usuario.id,
        imovelId: imovelId,
        ativo: true
      },
      data: {
        tipo: favorito ? 'FAVORITO' : 'MATCH',
        updatedAt: new Date()
      }
    });

    if (imovelAtualizado.count === 0) {
      return NextResponse.json(
        { error: "Imóvel não encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: favorito ? "Imóvel adicionado aos favoritos" : "Imóvel removido dos favoritos"
    });
  } catch (error) {
    console.error("Erro ao atualizar favorito:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar favorito" },
      { status: 500 }
    );
  }
}
