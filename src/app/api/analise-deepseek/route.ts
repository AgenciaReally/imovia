import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { userId, respostas, limiteCredito } = await request.json()

    console.log('🤖 Iniciando análise Deepseek para usuário:', userId)
    console.log('📝 Respostas recebidas:', respostas?.length || 0)
    console.log('💳 Limite de crédito aprovado:', limiteCredito ? `R$ ${limiteCredito.toLocaleString('pt-BR')}` : 'Não informado')

    // 1. Buscar imóveis do banco de dados com filtro de preço
    
    // Extrair valor máximo e cidade das respostas
    let valorMaximo: number | null = null;
    let cidadeDesejada: string | null = null;
    
    if (respostas && Array.isArray(respostas)) {
      for (const resposta of respostas) {
        const texto = resposta.pergunta?.texto || resposta.texto || '';
        const valor = resposta.resposta || resposta.valor || '';
        
        // Extrair valor máximo
        if (texto.toLowerCase().includes('valor') || texto.toLowerCase().includes('preço') || texto.toLowerCase().includes('orçamento')) {
          const valorNumerico = parseFloat(String(valor).replace(/[^\d.,]/g, '').replace(',', '.'));
          if (!isNaN(valorNumerico) && valorNumerico > 0) {
            valorMaximo = valorNumerico;
            console.log('💰 Valor máximo extraído das respostas:', valorMaximo);
          }
        }
        
        // Extrair cidade desejada
        if (texto.toLowerCase().includes('cidade') || texto.toLowerCase().includes('localização') || texto.toLowerCase().includes('onde')) {
          const cidadeStr = String(valor).trim();
          if (cidadeStr && cidadeStr.length > 2) {
            cidadeDesejada = cidadeStr;
            console.log('🏙️ Cidade desejada extraída das respostas:', cidadeDesejada);
          }
        }
      }
    }
    
    const whereClause: any = { ativo: true };
    
    // Priorizar limite de crédito aprovado sobre valor das respostas
    const valorFinalMaximo = limiteCredito || valorMaximo;
    
    if (valorFinalMaximo) {
      whereClause.preco = { lte: valorFinalMaximo };
      console.log(`🔍 Filtro de preço aplicado: até R$ ${valorFinalMaximo.toLocaleString('pt-BR')} ${limiteCredito ? '(LIMITE APROVADO)' : '(valor das respostas)'}`);
    } else {
      // Se não há limite, usar um valor conservador baseado na renda média
      whereClause.preco = { lte: 300000 };
      console.log('⚠️ Sem limite definido - usando valor conservador: R$ 300.000');
    }
    
    // Aplicar filtro de cidade se especificada - mais rigoroso
    if (cidadeDesejada) {
      whereClause.OR = [
        { cidade: { contains: cidadeDesejada, mode: 'insensitive' } },
        { endereco: { contains: `, ${cidadeDesejada},`, mode: 'insensitive' } },
        { endereco: { contains: `, ${cidadeDesejada}.`, mode: 'insensitive' } },
        { endereco: { contains: ` - ${cidadeDesejada}`, mode: 'insensitive' } },
        { endereco: { endsWith: `, ${cidadeDesejada}`, mode: 'insensitive' } }
      ];
      console.log(`🏙️ Filtro de cidade aplicado (rigoroso): ${cidadeDesejada}`);
    }
    
    const imoveis = await prisma.imovel.findMany({
      where: whereClause,
      include: {
        construtora: true,
        tipoImovel: true
      },
      take: 50 // Limitar para não sobrecarregar a API
    })

    console.log('🏠 Imóveis encontrados no banco:', imoveis.length)

    if (imoveis.length === 0) {
      // Verificar se o problema é falta de imóveis na cidade específica
      if (cidadeDesejada) {
        return NextResponse.json({
          success: false,
          error: 'cidade_sem_imoveis',
          message: `Infelizmente, não temos imóveis disponíveis em ${cidadeDesejada} no momento.`,
          suggestion: 'Por favor, escolha outra cidade ou entre em contato conosco via WhatsApp para mais opções.',
          cidadeConsultada: cidadeDesejada
        })
      }
      
      return NextResponse.json({
        success: false,
        error: 'sem_imoveis_disponiveis',
        message: 'Nenhum imóvel ativo encontrado no banco de dados com os critérios especificados.'
      })
    }

    // 2. Preparar dados das respostas para análise
    const perfilUsuario = respostas?.map((r: any) => ({
      pergunta: r.pergunta?.texto || r.texto,
      resposta: r.resposta || r.valor,
      categoria: r.pergunta?.categoria || r.categoria
    })) || []

    console.log('👤 Perfil do usuário preparado:', perfilUsuario.length, 'respostas')

    // 3. Preparar dados dos imóveis para análise
    const dadosImoveis = imoveis.map(imovel => ({
      id: imovel.id,
      titulo: imovel.titulo,
      preco: imovel.preco,
      area: imovel.area,
      quartos: imovel.quartos,
      banheiros: imovel.banheiros,
      vagas: imovel.vagas,
      endereco: imovel.endereco,
      caracteristicas: imovel.caracteristicasArray || [],
      construtora: imovel.construtora.nome,
      tipoImovel: imovel.tipoImovelNome || 'Apartamento'
    }))

    // 4. Fazer chamada para o Deepseek
    const promptDeepseek = `
Você é um especialista em análise imobiliária. Analise o perfil do cliente baseado nas respostas dele e encontre os 3 imóveis que melhor atendem às suas necessidades.

PERFIL DO CLIENTE:
${perfilUsuario.map((p: any) => `- ${p.pergunta}: ${p.resposta} (${p.categoria})`).join('\n')}

IMÓVEIS DISPONÍVEIS:
${dadosImoveis.map(i => 
  `ID: ${i.id}
  Título: ${i.titulo}
  Preço: R$ ${i.preco.toLocaleString('pt-BR')}
  Área: ${i.area}m²
  Quartos: ${i.quartos}
  Banheiros: ${i.banheiros}
  Vagas: ${i.vagas}
  Endereço: ${i.endereco}
  Construtora: ${i.construtora}
  Tipo: ${i.tipoImovel}
  Características: ${i.caracteristicas.join(', ')}
  ---`
).join('\n')}

TAREFA:
Analise cada imóvel e calcule um score de compatibilidade (0-100) baseado em:
1. Adequação ao orçamento do cliente
2. Número de quartos/banheiros desejados
3. Localização preferida
4. Características específicas mencionadas
5. Tipo de imóvel desejado
6. Área adequada às necessidades

Retorne APENAS um JSON válido no formato:
{
  "analise": "Resumo da análise do perfil do cliente",
  "top3": [
    {
      "id": "id_do_imovel",
      "score": 95,
      "motivos": ["Motivo 1", "Motivo 2", "Motivo 3"]
    },
    {
      "id": "id_do_imovel",
      "score": 88,
      "motivos": ["Motivo 1", "Motivo 2"]
    },
    {
      "id": "id_do_imovel", 
      "score": 82,
      "motivos": ["Motivo 1", "Motivo 2"]
    }
  ]
}
`

    // 5. Chamar API do Deepseek com timeout
    console.log('🔄 Iniciando chamada para API Deepseek...')
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 segundos timeout
    
    let deepseekResponse: Response
    
    try {
      deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-reasoner",
          messages: [
            {
              role: "user",
              content: promptDeepseek
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        }),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      console.log('✅ Resposta da API Deepseek recebida')
      
    } catch (error: any) {
      clearTimeout(timeoutId)
      console.error('❌ Erro na chamada Deepseek:', error.message)
      
      if (error.name === 'AbortError') {
        console.log('⏰ Timeout na API Deepseek - usando fallback')
      } else {
        console.log('🔄 Erro de conexão Deepseek - usando fallback')
      }
      
      // Usar fallback imediatamente em caso de erro ou timeout
      return gerarAnaliseSimples(dadosImoveis, perfilUsuario)
    }

    if (!deepseekResponse.ok) {
      console.error('❌ Erro na API Deepseek:', deepseekResponse.statusText)
      
      // Fallback: análise simples baseada em regras
      return gerarAnaliseSimples(dadosImoveis, perfilUsuario)
    }

    let deepseekData: any
    let conteudoResposta: string
    
    try {
      deepseekData = await deepseekResponse.json()
      conteudoResposta = deepseekData.choices[0]?.message?.content
      
      console.log('🤖 Resposta bruta do Deepseek:', conteudoResposta?.substring(0, 500) + '...')
      
      if (!conteudoResposta) {
        throw new Error('Resposta vazia do Deepseek')
      }
      
    } catch (error) {
      console.error('❌ Erro ao processar resposta do Deepseek:', error)
      return gerarAnaliseSimples(dadosImoveis, perfilUsuario)
    }

    try {
      // Tentar extrair JSON da resposta
      const jsonMatch = conteudoResposta.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('JSON não encontrado na resposta')
      }

      const analiseDeepseek = JSON.parse(jsonMatch[0])
      console.log('✅ Análise Deepseek parseada:', analiseDeepseek)

      // 6. Buscar dados completos dos imóveis selecionados
      const idsTop3 = analiseDeepseek.top3.map((item: any) => item.id)
      const imoveisCompletos = await prisma.imovel.findMany({
        where: {
          id: {
            in: idsTop3
          }
        },
        include: {
          construtora: true,
          tipoImovel: true
        }
      })

      // 7. Montar resposta final
      const top3Completo = analiseDeepseek.top3.map((analise: any) => {
        const imovel = imoveisCompletos.find(i => i.id === analise.id)
        if (!imovel) return null

        return {
          id: imovel.id,
          titulo: imovel.titulo,
          preco: imovel.preco,
          area: imovel.area,
          quartos: imovel.quartos,
          banheiros: imovel.banheiros,
          vagas: imovel.vagas,
          endereco: imovel.endereco,
          latitude: imovel.latitude,
          longitude: imovel.longitude,
          fotoPrincipal: imovel.fotoPrincipal,
          galeriaFotos: imovel.galeriaFotos,
          telefoneContato: imovel.telefoneContato,
          construtora: imovel.construtora.nome, // Apenas o nome como string
          score: analise.score,
          motivos: analise.motivos,
          caracteristicas: imovel.caracteristicasArray || [],
          matchPercentage: analise.score, // Para compatibilidade com o modal
          thumbnail: imovel.fotoPrincipal || '/placeholder-image.jpg'
        }
      }).filter(Boolean)

      console.log('🎯 Top 3 imóveis selecionados:', top3Completo.length)

      return NextResponse.json({
        success: true,
        analise: analiseDeepseek.analise,
        top3: top3Completo,
        totalImoveis: imoveis.length,
        perfilAnalisado: perfilUsuario.length
      })

    } catch (parseError) {
      console.error('❌ Erro ao parsear resposta do Deepseek:', parseError)
      
      // Fallback para análise simples
      return gerarAnaliseSimples(dadosImoveis, perfilUsuario)
    }

  } catch (error) {
    console.error('❌ Erro na análise Deepseek:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// Função de fallback para análise simples baseada em regras
async function gerarAnaliseSimples(dadosImoveis: any[], perfilUsuario: any[]) {
  console.log('🔄 Executando análise de fallback (sem Deepseek)')

  // Extrair preferências do perfil - usar valores mais conservadores
  let orcamentoMax = 300000 // Valor padrão mais realista (era 1 milhão!)
  let quartosDesejados = 2
  let banheirosDesejados = 1
  let areaMinima = 50
  
  perfilUsuario.forEach((p: any) => {
    if (p.pergunta?.toLowerCase().includes('orçamento') || p.pergunta?.toLowerCase().includes('valor')) {
      const valor = parseFloat(p.resposta.toString().replace(/[^\d,]/g, '').replace(',', '.'))
      if (!isNaN(valor)) orcamentoMax = valor
    }
    if (p.pergunta?.toLowerCase().includes('quartos')) {
      const quartos = parseInt(p.resposta.toString())
      if (!isNaN(quartos)) quartosDesejados = quartos
    }
    if (p.pergunta?.toLowerCase().includes('banheiro')) {
      const banheiros = parseInt(p.resposta.toString())
      if (!isNaN(banheiros)) banheirosDesejados = banheiros
    }
    if (p.pergunta?.toLowerCase().includes('área') || p.pergunta?.toLowerCase().includes('tamanho')) {
      const area = parseInt(p.resposta.toString())
      if (!isNaN(area)) areaMinima = area
    }
  })

  // Calcular score para cada imóvel
  const imoveisComScore = dadosImoveis.map(imovel => {
    let score = 50 // Score base

    // Pontuação por preço (30 pontos)
    if (imovel.preco <= orcamentoMax) {
      score += 30
    } else if (imovel.preco <= orcamentoMax * 1.1) {
      score += 20
    } else if (imovel.preco <= orcamentoMax * 1.2) {
      score += 10
    }

    // Pontuação por quartos (20 pontos)
    if (imovel.quartos === quartosDesejados) {
      score += 20
    } else if (Math.abs(imovel.quartos - quartosDesejados) === 1) {
      score += 10
    }

    // Pontuação por banheiros (15 pontos)
    if (imovel.banheiros >= banheirosDesejados) {
      score += 15
    } else if (imovel.banheiros === banheirosDesejados - 1) {
      score += 8
    }

    // Pontuação por área (15 pontos)
    if (imovel.area >= areaMinima) {
      score += 15
    } else if (imovel.area >= areaMinima * 0.8) {
      score += 10
    }

    // Pontuação adicional por características premium (10 pontos)
    const caracteristicasPremium = ['piscina', 'academia', 'churrasqueira', 'playground', 'salão de festas']
    const temPremium = imovel.caracteristicas.some((c: string) => 
      caracteristicasPremium.some(p => c.toLowerCase().includes(p))
    )
    if (temPremium) score += 10

    return {
      ...imovel,
      score: Math.min(score, 100)
    }
  })

  // Ordenar por score e pegar top 3
  imoveisComScore.sort((a, b) => b.score - a.score)
  const top3 = imoveisComScore.slice(0, 3)

  // Buscar dados completos dos top 3
  const idsTop3 = top3.map(i => i.id)
  const imoveisCompletos = await prisma.imovel.findMany({
    where: {
      id: {
        in: idsTop3
      }
    },
    include: {
      construtora: true,
      tipoImovel: true
    }
  })

  const top3Completo = top3.map(analise => {
    const imovel = imoveisCompletos.find(i => i.id === analise.id)
    if (!imovel) return null

    const motivos = []
    if (imovel.preco <= orcamentoMax) motivos.push('Dentro do orçamento')
    if (imovel.quartos === quartosDesejados) motivos.push('Número ideal de quartos')
    if (imovel.banheiros >= banheirosDesejados) motivos.push('Banheiros adequados')
    if (imovel.area >= areaMinima) motivos.push('Área suficiente')

    return {
      id: imovel.id,
      titulo: imovel.titulo,
      preco: imovel.preco,
      area: imovel.area,
      quartos: imovel.quartos,
      banheiros: imovel.banheiros,
      vagas: imovel.vagas,
      endereco: imovel.endereco,
      latitude: imovel.latitude,
      longitude: imovel.longitude,
      fotoPrincipal: imovel.fotoPrincipal,
      galeriaFotos: imovel.galeriaFotos,
      telefoneContato: imovel.telefoneContato,
      construtora: {
        nome: imovel.construtora.nome,
        telefone: imovel.construtora.telefone,
        email: imovel.construtora.email
      },
      score: analise.score,
      motivos: motivos,
      caracteristicas: imovel.caracteristicasArray || []
    }
  }).filter(Boolean)

  return NextResponse.json({
    success: true,
    analise: `Análise baseada em regras: Orçamento até R$ ${orcamentoMax.toLocaleString('pt-BR')}, ${quartosDesejados} quartos, ${banheirosDesejados} banheiros, área mínima ${areaMinima}m²`,
    top3: top3Completo,
    totalImoveis: dadosImoveis.length,
    perfilAnalisado: perfilUsuario.length,
    metodo: 'fallback'
  })
}
