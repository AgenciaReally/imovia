import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { subDays } from "date-fns";

export async function GET() {
  try {
    // Buscar todas as respostas com relacionamentos
    const respostas = await prisma.resposta.findMany({
      include: {
        pergunta: {
          select: {
            texto: true,
            categoria: true,
          },
        },
        usuario: {
          select: {
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calcular métricas
    // 1. Total de respostas
    const total = respostas.length;

    // 2. Contagem por dia nos últimos 30 dias
    const hoje = new Date();
    const diasAnalise = 30;
    const naDiaria: number[] = [];
    const naSemanal: number[] = [];

    // Inicializar arrays com zeros
    for (let i = 0; i < diasAnalise; i++) {
      naDiaria.push(0);
    }
    
    for (let i = 0; i < 12; i++) { // 12 semanas
      naSemanal.push(0);
    }

    // Preencher contagens
    respostas.forEach(resposta => {
      const dataResposta = new Date(resposta.createdAt);
      const diffDias = Math.floor((hoje.getTime() - dataResposta.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDias < diasAnalise) {
        naDiaria[diffDias]++;
      }
      
      const diffSemanas = Math.floor(diffDias / 7);
      if (diffSemanas < 12) {
        naSemanal[diffSemanas]++;
      }
    });

    // 3. Contagem por categoria
    const porCategoria: Record<string, number> = {};
    respostas.forEach(resposta => {
      const categoria = resposta.pergunta?.categoria || "Sem categoria";
      if (!porCategoria[categoria]) {
        porCategoria[categoria] = 0;
      }
      porCategoria[categoria]++;
    });

    // 4. Usuários completos vs. parciais
    // Consideramos "completo" um usuário que respondeu perguntas de todas as categorias
    const usuariosPorId = new Map<string, Set<string>>();
    const categorias = new Set<string>();

    respostas.forEach(resposta => {
      if (resposta.userId && resposta.pergunta?.categoria) {
        if (!usuariosPorId.has(resposta.userId)) {
          usuariosPorId.set(resposta.userId, new Set());
        }
        usuariosPorId.get(resposta.userId)?.add(resposta.pergunta.categoria);
        categorias.add(resposta.pergunta.categoria);
      }
    });

    // Contar usuários que completaram todas as categorias
    const totalCategorias = categorias.size;
    let usuariosCompletos = 0;
    let usuariosParciais = 0;

    usuariosPorId.forEach((categoriasRespondidas) => {
      if (categoriasRespondidas.size === totalCategorias) {
        usuariosCompletos++;
      } else {
        usuariosParciais++;
      }
    });

    // 5. Taxa de conversão - usuários que completaram / total de usuários
    const taxaDeConversao = usuariosPorId.size > 0 
      ? usuariosCompletos / usuariosPorId.size 
      : 0;

    // Construir objeto de métricas
    const metricas = {
      total,
      naDiaria,
      naSemanal,
      porCategoria,
      usuariosCompletos,
      usuariosParciais,
      taxaDeConversao,
    };

    return NextResponse.json({ 
      respostas,
      metricas,
    });
  } catch (error) {
    console.error("Erro ao buscar respostas:", error);
    return NextResponse.json(
      { erro: "Erro ao buscar respostas" },
      { status: 500 }
    );
  }
}
