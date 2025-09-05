import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId, respostas, limiteCredito } = await request.json()
    
    console.log('🚀 Análise SIMPLES (rápida) iniciada para:', userId)
    console.log('📝 Respostas recebidas:', respostas.length)
    console.log('💳 Limite de crédito recebido:', limiteCredito ? `R$ ${limiteCredito.toLocaleString('pt-BR')}` : 'Não informado')

    // Priorizar limite de crédito aprovado pela IA sobre valores das respostas
    let valorMaximo = limiteCredito || 600000 // ✅ Usar limite aprovado ou padrão
    let quartos = 2 // Padrão
    let cidadeDesejada: string | null = null
    
    console.log('🔍 Analisando respostas para extrair valor máximo e cidade...')
    
    for (const resposta of respostas) {
      const pergunta = resposta.pergunta?.texto?.toLowerCase() || ''
      const valor = String(resposta.resposta || '').toLowerCase()
      
      console.log(`📝 Pergunta: "${pergunta}" | Resposta: "${valor}"`)
      
      // Procurar por valor/orçamento/preço - expandindo busca
      if (pergunta.includes('valor') || pergunta.includes('orçamento') || pergunta.includes('investir') || pergunta.includes('preço') || pergunta.includes('máximo')) {
        console.log('💰 Pergunta sobre valor encontrada!')
        
        // Extrair números da resposta, incluindo formatação brasileira
        const numeroString = valor.replace(/[^\d.,]/g, '').replace(',', '.')
        const numero = parseFloat(numeroString)
        
        if (!isNaN(numero) && numero > 0) {
          // Se o número for menor que 10000, assumir que está em milhares
          valorMaximo = numero < 10000 ? numero * 1000 : numero
          console.log(`✅ Valor máximo extraído: R$ ${valorMaximo.toLocaleString('pt-BR')} (original: "${valor}")`)
        }
      }
      
      // Procurar por cidade desejada
      if (pergunta.includes('cidade') || pergunta.includes('localização') || pergunta.includes('onde')) {
        const cidadeStr = String(resposta.resposta || '').trim()
        if (cidadeStr && cidadeStr.length > 2) {
          cidadeDesejada = cidadeStr
          console.log(`🏙️ Cidade desejada extraída: ${cidadeDesejada}`)
        }
      }
      
      // Procurar por quartos
      if (pergunta.includes('quarto') || valor.includes('quarto')) {
        const num = valor.match(/\d+/)
        if (num) quartos = parseInt(num[0])
      }
    }

    console.log('💰 Valor máximo identificado:', valorMaximo.toLocaleString('pt-BR'))
    console.log('🏠 Quartos desejados:', quartos)
    console.log('🏙️ Cidade desejada:', cidadeDesejada || 'Qualquer cidade')

    // Buscar imóveis respeitando limite de crédito aprovado
    const whereClause: any = {
      ativo: true,
      preco: {
        lte: valorMaximo, // ✅ Respeitar limite de crédito aprovado
      },
      quartos: {
        gte: quartos - 1, // Aceitar 1 quarto a menos
      }
    }
    
    // Se não há limite de crédito (teste rápido), filtrar apenas acima de R$ 400k
    if (!limiteCredito) {
      whereClause.preco.gt = 400000; // Apenas para testes rápidos
    }

    // Aplicar filtro de cidade se especificada
    if (cidadeDesejada) {
      whereClause.cidade = {
        contains: cidadeDesejada,
        mode: 'insensitive'
      }
      console.log(`🏙️ Filtro de cidade aplicado: ${cidadeDesejada}`)
    }

    // Adicionar aleatoriedade na consulta para variar resultados
    const ordenacoes = [
      { preco: 'asc' as const },
      { preco: 'desc' as const },
      { area: 'desc' as const },
      { quartos: 'desc' as const },
      { updatedAt: 'desc' as const }
    ];
    
    const ordenacaoAleatoria = ordenacoes[Math.floor(Math.random() * ordenacoes.length)];
    console.log('🎲 Ordenação selecionada:', Object.keys(ordenacaoAleatoria)[0]);

    const imoveis = await prisma.imovel.findMany({
      where: whereClause,
      include: {
        construtora: true,
        tipoImovel: true
      },
      orderBy: ordenacaoAleatoria,
      take: 15 // Pegar mais imóveis para ter mais variação
    })

    console.log('🏠 Imóveis encontrados:', imoveis.length)

    if (imoveis.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Nenhum imóvel encontrado com os critérios informados'
      })
    }

    // Adicionar variação no algoritmo de seleção
    const estrategias = [
      'valor_ideal',      // Foca no valor ideal (85% do máximo)
      'melhor_custo',     // Foca no menor preço
      'maior_area',       // Foca na maior área
      'mais_quartos',     // Foca em mais quartos
      'equilibrado'       // Mix de critérios
    ];
    
    const estrategia = estrategias[Math.floor(Math.random() * estrategias.length)];
    console.log('🎯 Estratégia selecionada:', estrategia);
    
    const imoveisComScore = imoveis.map(imovel => {
      let score = 50; // Base score
      
      // Aplicar estratégia selecionada
      switch(estrategia) {
        case 'valor_ideal':
          const valorIdeal = valorMaximo * 0.85;
          const diferencaPreco = Math.abs(Number(imovel.preco) - valorIdeal);
          score += Math.max(0, 40 - (diferencaPreco / valorIdeal * 40));
          break;
          
        case 'melhor_custo':
          const percentualPreco = Number(imovel.preco) / valorMaximo;
          score += (1 - percentualPreco) * 40; // Quanto menor o preço, maior o score
          break;
          
        case 'maior_area':
          score += Math.min(40, Number(imovel.area) / 5); // Bonus por área
          break;
          
        case 'mais_quartos':
          score += Number(imovel.quartos) * 8; // 8 pontos por quarto
          break;
          
        case 'equilibrado':
          score += Number(imovel.quartos) * 5; // Quartos
          score += Math.min(15, Number(imovel.area) / 8); // Área
          score += (1 - Number(imovel.preco) / valorMaximo) * 20; // Preço
          break;
      }
      
      // Bonus aleatório para criar mais variação (0-10 pontos)
      const bonusAleatorio = Math.floor(Math.random() * 11);
      score += bonusAleatorio;
      
      // Garantir score entre 70-98%
      score = Math.min(98, Math.max(70, Math.round(score)));
      
      return {
        id: imovel.id,
        titulo: imovel.titulo,
        preco: Number(imovel.preco) || 0,
        valor: Number(imovel.preco) || 0,
        area: Number(imovel.area) || 0,
        quartos: Number(imovel.quartos) || 0,
        banheiros: Number(imovel.banheiros) || 0,
        vagas: Number(imovel.vagas) || 0,
        endereco: imovel.endereco || '',
        latitude: Number(imovel.latitude) || 0,
        longitude: Number(imovel.longitude) || 0,
        fotoPrincipal: imovel.fotoPrincipal,
        galeriaFotos: imovel.galeriaFotos,
        telefoneContato: imovel.telefoneContato,
        construtora: imovel.construtora?.nome || 'Construtora',
        score: score,
        matchPercentage: score,
        thumbnail: imovel.fotoPrincipal || '/placeholder-image.jpg',
        caracteristicas: imovel.caracteristicasArray || [],
        motivos: [
          `Preço dentro do orçamento: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(imovel.preco) || 300000)}`,
          `${imovel.quartos} quartos - ${estrategia === 'mais_quartos' ? 'prioridade na seleção' : 'atende necessidade'}`,
          `Área de ${imovel.area}m² - ${estrategia === 'maior_area' ? 'destaque por espaço' : 'espaço adequado'}`,
          `Estratégia: ${estrategia.replace('_', ' ')}`
        ]
      };
    });
    
    // Embaralhar array antes de ordenar para adicionar mais aleatoriedade
    const embaralhado = imoveisComScore.sort(() => Math.random() - 0.5);
    
    // Ordenar por score e pegar top 3
    const top3 = embaralhado
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)

    console.log('🎯 Top 3 selecionados com scores:', top3.map(i => `${i.score}%`))

    return NextResponse.json({
      success: true,
      analise: `Baseado no seu orçamento de até ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorMaximo)} e necessidade de ${quartos} quartos, encontramos ${top3.length} opções ideais que combinam valor, localização e características desejadas.`,
      top3: top3,
      totalImoveis: imoveis.length,
      criterios: {
        valorMaximo,
        quartos,
        estrategia
      }
    })

  } catch (error) {
    console.error('❌ Erro na análise simples:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}
