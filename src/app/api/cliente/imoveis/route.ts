import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";

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

    const url = new URL(req.url);
    const tipo = url.searchParams.get('tipo') || 'MATCH'; // MATCH, FAVORITO, VISITADO
    
    // Buscar imóveis salvos usando o novo modelo
    const imoveisSalvos = await prisma.clienteImovelSalvo.findMany({
      where: { 
        userId: usuario.id,
        ativo: true,
        ...(tipo !== 'ALL' && { tipo })
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Formatar dados para o frontend
    const imoveisFormatados = imoveisSalvos.map(imovel => ({
      id: imovel.imovelId,
      titulo: imovel.titulo,
      preco: imovel.preco,
      area: imovel.area,
      quartos: imovel.quartos,
      banheiros: imovel.banheiros,
      vagas: imovel.vagas,
      endereco: imovel.endereco,
      bairro: imovel.bairro,
      cidade: imovel.cidade,
      fotoPrincipal: imovel.fotoPrincipal,
      construtora: imovel.construtoraNome ? {
        id: imovel.construtoraId,
        nome: imovel.construtoraNome,
        telefone: imovel.telefoneContato || ''
      } : null,
      matchPercentage: imovel.matchPercentage,
      favorito: imovel.tipo === 'FAVORITO',
      motivos: imovel.motivos,
      tipo: imovel.tipo,
      dataSalvo: imovel.createdAt
    }));
    
    return NextResponse.json({
      success: true,
      data: imoveisFormatados
    });
  } catch (error) {
    console.error("Erro ao buscar imóveis do cliente:", error);
    return NextResponse.json(
      { error: "Erro ao buscar imóveis" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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

    const { imoveis } = await req.json();
    
    if (!imoveis || !Array.isArray(imoveis) || imoveis.length === 0) {
      return NextResponse.json(
        { error: "Lista de imóveis é obrigatória" },
        { status: 400 }
      );
    }

    // Salvar imóveis no banco usando upsert para evitar duplicatas
    const resultados = await Promise.allSettled(
      imoveis.map(async (imovel: any) => {
        return await prisma.clienteImovelSalvo.upsert({
          where: {
            userId_imovelId: {
              userId: usuario.id,
              imovelId: imovel.id
            }
          },
          create: {
            userId: usuario.id,
            imovelId: imovel.id,
            titulo: imovel.titulo,
            preco: imovel.preco || imovel.valor || 0,
            area: imovel.area,
            quartos: imovel.quartos,
            banheiros: imovel.banheiros,
            vagas: imovel.vagas,
            endereco: imovel.endereco,
            bairro: imovel.bairro,
            cidade: imovel.cidade,
            fotoPrincipal: imovel.fotoPrincipal || imovel.thumbnail,
            construtoraId: imovel.construtoraId,
            construtoraNome: imovel.construtoraNome || imovel.construtora,
            telefoneContato: imovel.telefoneContato,
            matchPercentage: imovel.matchPercentage || imovel.score,
            motivos: imovel.motivos || [],
            tipo: imovel.tipo || 'MATCH',
            ativo: true
          },
          update: {
            titulo: imovel.titulo,
            preco: imovel.preco || imovel.valor || 0,
            area: imovel.area,
            quartos: imovel.quartos,
            banheiros: imovel.banheiros,
            vagas: imovel.vagas,
            endereco: imovel.endereco,
            bairro: imovel.bairro,
            cidade: imovel.cidade,
            fotoPrincipal: imovel.fotoPrincipal || imovel.thumbnail,
            construtoraId: imovel.construtoraId,
            construtoraNome: imovel.construtoraNome || imovel.construtora,
            telefoneContato: imovel.telefoneContato,
            matchPercentage: imovel.matchPercentage || imovel.score,
            motivos: imovel.motivos || [],
            tipo: imovel.tipo || 'MATCH',
            ativo: true,
            updatedAt: new Date()
          }
        });
      })
    );

    const sucessos = resultados.filter(r => r.status === 'fulfilled').length;
    const erros = resultados.filter(r => r.status === 'rejected').length;

    return NextResponse.json({
      success: true,
      message: `${sucessos} imóveis salvos com sucesso`,
      ...(erros > 0 && { erros: `${erros} imóveis falharam` })
    });

  } catch (error) {
    console.error("Erro ao salvar imóveis:", error);
    return NextResponse.json(
      { error: "Erro ao salvar imóveis" },
      { status: 500 }
    );
  }
}
