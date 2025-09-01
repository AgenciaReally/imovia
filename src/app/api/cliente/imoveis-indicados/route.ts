import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from "@/lib/session";

export async function GET() {
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
      select: { id: true, role: true, name: true, email: true }
    });
    
    if (!usuario || usuario.role !== "CLIENTE") {
      return NextResponse.json(
        { error: "Acesso permitido apenas para clientes" },
        { status: 403 }
      );
    }

    // 🎯 USAR OS MESMOS IMÓVEIS DO PAINEL - ClienteImovelSalvo
    const imoveisSalvos = await prisma.clienteImovelSalvo.findMany({
      where: { 
        userId: usuario.id,
        ativo: true,
        tipo: 'MATCH' // Apenas imóveis recomendados
      },
      orderBy: [
        { matchPercentage: 'desc' }, // Ordenar por melhor match primeiro
        { createdAt: 'desc' }
      ]
    });

    console.log(`🏠 Encontrados ${imoveisSalvos.length} imóveis indicados para usuário ${usuario.id}`);

    // Formatar dados para o frontend (compatível com o formato esperado)
    const imoveisIndicados = imoveisSalvos.map((imovel, index) => ({
      id: index + 1, // ID sequencial para o frontend
      imovelId: imovel.imovelId, // ID real do imóvel
      titulo: imovel.titulo,
      endereco: imovel.endereco,
      bairro: imovel.bairro,
      cidade: imovel.cidade,
      preco: imovel.preco,
      area: imovel.area,
      quartos: imovel.quartos,
      banheiros: imovel.banheiros,
      vagas: imovel.vagas,
      tipo: "Apartamento", // Padrão
      construtora: imovel.construtoraNome || "Construtora",
      imagem: imovel.fotoPrincipal || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
      compatibilidade: Math.round(imovel.matchPercentage || 85),
      motivo: imovel.motivos && imovel.motivos.length > 0 
        ? imovel.motivos[0] 
        : "Baseado no seu perfil e preferências informadas"
    }));

    return NextResponse.json({
      success: true,
      data: imoveisIndicados,
      total: imoveisIndicados.length,
      usuario: {
        nome: usuario.name || 'Cliente',
        email: usuario.email,
        totalImoveisIndicados: imoveisIndicados.length
      }
    });

  } catch (error) {
    console.error('Erro ao buscar imóveis indicados:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
