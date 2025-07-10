import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

// API para salvar imóveis destacados do cliente
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession();
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }
    
    // Buscar usuário pelo email
    const usuario = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });
    
    if (!usuario) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const userId = usuario.id;
    const body = await request.json();
    const { imoveis } = body;

    if (!imoveis || !Array.isArray(imoveis) || imoveis.length === 0) {
      return NextResponse.json(
        { error: "Dados de imóveis inválidos" },
        { status: 400 }
      );
    }

    // Salvar cada imóvel
    const imoveisSalvos = await Promise.all(
      imoveis.map(async (imovel) => {
        // Criar o imóvel salvo
        const novoImovelSalvo = await prisma.imoveisCliente.create({
          data: {
            titulo: imovel.titulo,
            preco: imovel.preco,
            local: imovel.endereco || imovel.local || "Localização não especificada",
            quartos: imovel.quartos || imovel.caracteristicas?.quartos || 0,
            banheiros: imovel.banheiros || imovel.caracteristicas?.banheiros || 0,
            area: imovel.area || imovel.caracteristicas?.area || 0,
            vagas: imovel.vagas || imovel.caracteristicas?.vagas || 0,
            foto: imovel.thumbnail || imovel.foto || null,
            userId: userId,
          },
        });

        // Se o imóvel tem construtoras, salvar relações
        if (imovel.construtoras && Array.isArray(imovel.construtoras) && imovel.construtoras.length > 0) {
          await Promise.all(
            imovel.construtoras.map((construtora: any) => 
              prisma.construtoraSalva.create({
                data: {
                  nome: construtora.nome || construtora,
                  imovelClienteId: novoImovelSalvo.id
                }
              })
            )
          );
        }

        return novoImovelSalvo;
      })
    );

    return NextResponse.json({ 
      success: true, 
      message: `${imoveisSalvos.length} imóveis salvos com sucesso!`,
      imoveisSalvos 
    });
    
  } catch (error) {
    console.error("Erro ao salvar imóveis do cliente:", error);
    return NextResponse.json(
      { error: "Erro ao salvar imóveis do cliente" },
      { status: 500 }
    );
  }
}

// API para obter imóveis salvos do cliente
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession();
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }
    
    // Buscar usuário pelo email
    const usuario = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });
    
    if (!usuario) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const userId = usuario.id;

    // Buscar imóveis salvos com suas construtoras
    const imoveisSalvos = await prisma.imoveisCliente.findMany({
      where: {
        userId: userId
      },
      include: {
        construtoras: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ 
      success: true, 
      imoveisSalvos 
    });
    
  } catch (error) {
    console.error("Erro ao buscar imóveis salvos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar imóveis salvos" },
      { status: 500 }
    );
  }
}
