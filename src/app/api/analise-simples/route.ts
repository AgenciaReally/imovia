import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId, respostas } = await request.json()
    
    console.log('🚀 Análise SIMPLES (rápida) iniciada para:', userId)
    console.log('📝 Respostas recebidas:', respostas.length)

    // Extrair valor máximo e cidade das respostas
    let valorMaximo = 300000 // ✅ Valor padrão compatível com teste rápido
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

    // Buscar imóveis com filtros básicos - VALOR EXATO SEM TOLERÂNCIA
    const whereClause: any = {
      ativo: true,
      preco: {
        lte: valorMaximo, // ✅ VALOR EXATO - SEM TOLERÂNCIA
      },
      quartos: {
        gte: quartos - 1, // Aceitar 1 quarto a menos
      }
    }

    // Aplicar filtro de cidade se especificada
    if (cidadeDesejada) {
      whereClause.cidade = {
        contains: cidadeDesejada,
        mode: 'insensitive'
      }
      console.log(`🏙️ Filtro de cidade aplicado: ${cidadeDesejada}`)
    }

    const imoveis = await prisma.imovel.findMany({
      where: whereClause,
      include: {
        construtora: true,
        tipoImovel: true
      },
      orderBy: {
        preco: 'asc'
      },
      take: 10 // Pegar 10 para escolher os 3 melhores
    })

    console.log('🏠 Imóveis encontrados:', imoveis.length)

    if (imoveis.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Nenhum imóvel encontrado com os critérios informados'
      })
    }

    // Calcular score simples baseado na proximidade do valor ideal
    const valorIdeal = valorMaximo * 0.85 // 85% do valor máximo é o ideal
    
    const top3 = imoveis
      .map(imovel => {
        // Score baseado na proximidade do valor ideal
        const diferencaPreco = Math.abs(imovel.preco - valorIdeal)
        const scorePreco = Math.max(0, 100 - (diferencaPreco / valorIdeal * 100))
        
        // Bonus por ter mais quartos
        const bonusQuartos = (imovel.quartos >= quartos) ? 10 : 0
        
        // Score final
        const score = Math.min(98, Math.round(scorePreco + bonusQuartos))
        
        return {
          id: imovel.id,
          titulo: imovel.titulo,
          preco: Number(imovel.preco) || 0,
          valor: Number(imovel.preco) || 0, // Adicionar campo valor explicitamente
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
            `${imovel.quartos} quartos - atende sua necessidade`,
            `Área de ${imovel.area}m² - espaço adequado`,
            `Localização: ${imovel.endereco}`
          ]
        }
      })
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
        valorIdeal
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
