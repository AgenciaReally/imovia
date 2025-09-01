import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Buscar todos os usuários que responderam ao menos uma pergunta
    const clientesComRespostas = await prisma.user.findMany({
      where: {
        respostas: {
          some: {}
        }
      },
      include: {
        respostas: {
          include: {
            pergunta: true
          }
        },
        _count: {
          select: {
            respostas: true
          }
        }
      }
    });

    // Processar dados dos clientes
    const clientes = clientesComRespostas.map((user: any) => {
      const totalRespostas = user._count.respostas;
      const ultimaResposta = user.respostas.length > 0 
        ? user.respostas.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].createdAt
        : new Date();

      // Calcular status baseado no número de respostas
      let status: 'completo' | 'parcial' | 'inicio';
      if (totalRespostas >= 15) {
        status = 'completo';
      } else if (totalRespostas >= 5) {
        status = 'parcial';
      } else {
        status = 'inicio';
      }

      // TODO: Implementar lógica real de imóveis sugeridos
      const imoveisSugeridos = status === 'completo' ? 3 : status === 'parcial' ? 2 : 0;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        totalRespostas,
        ultimaResposta: ultimaResposta.toISOString(),
        imoveisSugeridos,
        status
      };
    });

    // Calcular estatísticas
    const estatisticas = {
      totalClientes: clientes.length,
      totalRespostas: clientes.reduce((sum: number, cliente: any) => sum + cliente.totalRespostas, 0),
      clientesCompletos: clientes.filter((c: any) => c.status === 'completo').length,
      clientesParciais: clientes.filter((c: any) => c.status === 'parcial').length,
      mediaRespostasPorCliente: clientes.length > 0 
        ? clientes.reduce((sum: number, cliente: any) => sum + cliente.totalRespostas, 0) / clientes.length 
        : 0,
      imoveisSugeridos: clientes.reduce((sum: number, cliente: any) => sum + cliente.imoveisSugeridos, 0)
    };

    return NextResponse.json({
      clientes,
      estatisticas
    });

  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
