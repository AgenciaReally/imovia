import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * API para buscar dados de dashboard do admin
 */
export async function GET(request: NextRequest) {
  try {
    // Buscar métricas gerais
    const [
      totalUsuarios,
      totalImoveis,
      totalConstrutoras,
      totalRespostas,
      ultimosImoveisVisualizados,
      perguntasRecentes,
      respostasRecentes,
      estatisticasCategorias,
      estatisticasTiposImoveis,
      estatisticasConstrutoras
    ] = await Promise.all([
      // Total de usuários
      prisma.user.count(),
      
      // Total de imóveis
      prisma.imovel.count(),
      
      // Total de construtoras
      prisma.construtora.count(),
      
      // Total de respostas
      prisma.resposta.count(),
      
      // Últimos imóveis visualizados (para atividade recente)
      prisma.imovel.findMany({
        take: 5,
        orderBy: {
          updatedAt: 'desc'
        },
        select: {
          id: true,
          titulo: true,
          preco: true,
          updatedAt: true
        }
      }),
      
      // Perguntas recentes
      prisma.pergunta.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          texto: true,
          categoria: true,
          createdAt: true
        }
      }),
      
      // Respostas recentes
      prisma.resposta.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          pergunta: true,
          usuario: true
        }
      }),
      
      // Estatísticas por categoria de pergunta
      prisma.resposta.groupBy({
        by: ['perguntaId'],
        _count: true,
        orderBy: {
          _count: {
            perguntaId: 'desc'
          }
        },
        take: 5,
        where: {
          pergunta: {
            is: {}
          }
        }
      }).then(async (results) => {
        // Buscar informações detalhadas das perguntas com mais respostas
        const perguntasIds = results.map(r => r.perguntaId);
        const perguntas = await prisma.pergunta.findMany({
          where: {
            id: {
              in: perguntasIds
            }
          },
          select: {
            id: true,
            texto: true,
            categoria: true
          }
        });
        
        // Combinar os dados
        return results.map(r => {
          const pergunta = perguntas.find(p => p.id === r.perguntaId);
          return {
            id: r.perguntaId,
            texto: pergunta?.texto || 'Pergunta não encontrada',
            categoria: pergunta?.categoria || 'N/A',
            count: r._count
          };
        });
      }),
      
      // Estatísticas por tipo de imóvel (baseado em características)
      prisma.imovel.groupBy({
        by: ['quartos'],
        _count: true,
        orderBy: {
          quartos: 'asc'
        }
      }).then(results => {
        return results.map(r => ({
          name: `${r.quartos} ${r.quartos === 1 ? 'quarto' : 'quartos'}`,
          valor: r._count
        }));
      }),
      
      // Estatísticas por construtora
      prisma.imovel.groupBy({
        by: ['construtoraId'],
        _count: true,
        orderBy: {
          _count: {
            construtoraId: 'desc'
          }
        },
        take: 3
      }).then(async (results) => {
        // Buscar informações detalhadas das construtoras
        const construtorasIds = results.map(r => r.construtoraId);
        const construtoras = await prisma.construtora.findMany({
          where: {
            id: {
              in: construtorasIds
            }
          },
          select: {
            id: true,
            nome: true
          }
        });
        
        // Gerar cores para o gráfico de pizza
        const colors = ['#FF6B00', '#FFB370', '#FFE9D6', '#FF8F3D', '#FF6B00'];
        
        // Combinar os dados
        return results.map((r, index) => {
          const construtora = construtoras.find(c => c.id === r.construtoraId);
          return {
            name: construtora?.nome || 'Construtora desconhecida',
            value: r._count,
            color: colors[index % colors.length]
          };
        });
      }),
    ]);

    // Dados para gráficos de atividade (simulados com base nos dados reais)
    // No futuro, pode ser alimentado por tabelas de analytics reais
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    const atividadeRecenteMeses = meses.map((mes, index) => {
      // Usar total de respostas como base para simular visualizações e cliques
      // Nas proporções: visualizações = 6x respostas, cliques = 3x respostas
      return {
        name: mes,
        visualizacoes: Math.round(totalRespostas * (0.5 + (index * 0.1 + Math.random() * 0.2))),
        cliques: Math.round(totalRespostas * (0.3 + (index * 0.08 + Math.random() * 0.15))),
        matches: Math.round(totalRespostas * (0.15 + (index * 0.05 + Math.random() * 0.1)))
      };
    });

    // Calcular taxas de conversão
    const taxaConversao = totalRespostas > 0 && totalUsuarios > 0 
      ? ((totalRespostas / totalUsuarios) * 100).toFixed(1) 
      : '0';
    
    const taxaCliques = atividadeRecenteMeses.length > 0 
      ? ((atividadeRecenteMeses[atividadeRecenteMeses.length - 1].cliques / 
          atividadeRecenteMeses[atividadeRecenteMeses.length - 1].visualizacoes) * 100).toFixed(1)
      : '0';

    // Dados agregados da última semana vs semana anterior (simulados)
    const ultimaSemana = {
      visualizacoes: atividadeRecenteMeses[atividadeRecenteMeses.length - 1].visualizacoes,
      cliques: atividadeRecenteMeses[atividadeRecenteMeses.length - 1].cliques,
      conversoes: atividadeRecenteMeses[atividadeRecenteMeses.length - 1].matches
    };
    
    const semanaAnterior = {
      visualizacoes: atividadeRecenteMeses[atividadeRecenteMeses.length - 2]?.visualizacoes || 0,
      cliques: atividadeRecenteMeses[atividadeRecenteMeses.length - 2]?.cliques || 0,
      conversoes: atividadeRecenteMeses[atividadeRecenteMeses.length - 2]?.matches || 0
    };
    
    const crescimentoVisualizacoes = semanaAnterior.visualizacoes > 0 
      ? (((ultimaSemana.visualizacoes - semanaAnterior.visualizacoes) / semanaAnterior.visualizacoes) * 100).toFixed(1)
      : '0';
      
    const crescimentoCliques = semanaAnterior.cliques > 0
      ? (((ultimaSemana.cliques - semanaAnterior.cliques) / semanaAnterior.cliques) * 100).toFixed(1)
      : '0';
      
    const crescimentoConversoes = semanaAnterior.conversoes > 0
      ? (((ultimaSemana.conversoes - semanaAnterior.conversoes) / semanaAnterior.conversoes) * 100).toFixed(1)
      : '0';

    // Montar objeto de resposta
    return NextResponse.json({
      success: true,
      data: {
        metricas: {
          totalUsuarios,
          totalImoveis,
          totalConstrutoras,
          totalRespostas,
          taxaConversao,
          taxaCliques,
          crescimento: {
            visualizacoes: crescimentoVisualizacoes,
            cliques: crescimentoCliques,
            conversoes: crescimentoConversoes
          }
        },
        graficos: {
          atividadeRecenteMeses,
          estatisticasTiposImoveis,
          estatisticasConstrutoras
        },
        listas: {
          ultimosImoveisVisualizados,
          perguntasRecentes,
          respostasRecentes,
          estatisticasCategorias
        }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar métricas do dashboard' },
      { status: 500 }
    );
  }
}
