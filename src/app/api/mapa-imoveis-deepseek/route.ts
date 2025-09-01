import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validarPreco } from '@/utils/preco-utils'

export async function POST(request: Request) {
  try {
    const { respostas } = await request.json()

    console.log('🗺️ Iniciando busca de imóveis para mapa interativo')
    console.log('📝 Respostas recebidas:', respostas?.length || 0)

    // 1. Chamar a análise do Deepseek
    const analiseResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/analise-deepseek`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: 'mapa-interativo',
        respostas
      })
    })

    if (!analiseResponse.ok) {
      throw new Error('Erro na análise Deepseek')
    }

    const analiseData = await analiseResponse.json()
    
    if (!analiseData.success) {
      throw new Error(analiseData.error || 'Erro na análise')
    }

    console.log('✅ Análise Deepseek concluída:', analiseData.top3?.length || 0, 'imóveis selecionados')

    // 2. Buscar alguns imóveis adicionais para completar o mapa (pins cinzas)
    const idsTop3 = analiseData.top3?.map((item: any) => item.id) || []
    
    const imoveisAdicionais = await prisma.imovel.findMany({
      where: {
        ativo: true,
        id: {
          notIn: idsTop3
        }
      },
      include: {
        construtora: true
      },
      take: 15 // Mais alguns imóveis para os pins cinzas
    })

    console.log('🏠 Imóveis adicionais encontrados:', imoveisAdicionais.length)

    // 3. Gerar posições aleatórias para os pins
    const gerarPosicaoAleatoria = () => ({
      left: Math.floor(Math.random() * 80) + 10 + "%",
      top: Math.floor(Math.random() * 80) + 10 + "%"
    })

    // 4. Formatar dados para o mapa interativo
    const pinsLaranja = analiseData.top3?.map((imovel: any, index: number) => ({
      id: imovel.id,
      titulo: imovel.titulo || 'Imóvel sem título',
      preco: validarPreco(imovel.preco),
      destaque: true,
      matchPercentage: Math.min(Math.max(imovel.score || 75, 50), 98), // Garantir entre 50-98%
      telefoneContato: imovel.telefoneContato || imovel.construtora?.telefone || '',
      thumbnail: imovel.fotoPrincipal || imovel.galeriaFotos?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop",
      caracteristicas: {
        quartos: imovel.quartos || 2,
        banheiros: imovel.banheiros || 1,
        area: imovel.area || 70,
        vagas: imovel.vagas || 1
      },
      position: gerarPosicaoAleatoria(),
      endereco: imovel.endereco || 'Endereço não informado',
      construtora: imovel.construtora?.nome || 'Construtora não informada',
      motivos: imovel.motivos || [],
      latitude: imovel.latitude,
      longitude: imovel.longitude
    })) || []

    // 5. Formatar imóveis adicionais (pins cinzas)
    const pinsCinzas = imoveisAdicionais.map((imovel, index) => ({
      id: imovel.id,
      titulo: imovel.titulo || 'Imóvel sem título',
      preco: validarPreco(imovel.preco),
      destaque: false,
      matchPercentage: Math.floor(Math.random() * 30) + 40, // Score baixo para pins cinzas
      telefoneContato: imovel.telefoneContato || imovel.construtora?.telefone || '',
      thumbnail: imovel.fotoPrincipal || imovel.galeriaFotos?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop",
      caracteristicas: {
        quartos: imovel.quartos || 2,
        banheiros: imovel.banheiros || 1,
        area: imovel.area || 70,
        vagas: imovel.vagas || 1
      },
      position: gerarPosicaoAleatoria(),
      endereco: imovel.endereco || 'Endereço não informado',
      construtora: imovel.construtora.nome || 'Construtora não informada',
      indisponivel: true // Marcar como pins cinzas
    }))

    // 6. Combinar todos os pins
    const todosPins = [...pinsLaranja, ...pinsCinzas]

    console.log('📍 Total de pins gerados:', todosPins.length)
    console.log('🟠 Pins laranja (destaques):', pinsLaranja.length)
    console.log('⚫ Pins cinzas:', pinsCinzas.length)

    return NextResponse.json({
      success: true,
      pins: todosPins,
      analise: analiseData.analise,
      totalPins: todosPins.length,
      pinsDestaque: pinsLaranja.length,
      metodoAnalise: analiseData.metodo || 'deepseek'
    })

  } catch (error) {
    console.error('❌ Erro na API do mapa:', error)
    
    // Fallback: retornar dados mock se houver erro
    const pinsMock = [
      {
        id: "mock-1",
        titulo: "Apartamento Premium Vista Mar",
        preco: 750000,
        destaque: true,
        matchPercentage: 95,
        telefoneContato: "(11) 99999-9999",
        thumbnail: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop",
        caracteristicas: {
          quartos: 3,
          banheiros: 2,
          area: 95,
          vagas: 2
        },
        position: { left: "25%", top: "35%" },
        endereco: "Rua das Flores, 123 - Copacabana, RJ",
        construtora: "Cyrela",
        motivos: ["Dentro do orçamento", "Localização premium", "Vista para o mar"]
      },
      {
        id: "mock-2",
        titulo: "Cobertura Duplex Moderna",
        preco: 980000,
        destaque: true,
        matchPercentage: 88,
        telefoneContato: "(11) 88888-8888",
        thumbnail: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&h=200&fit=crop",
        caracteristicas: {
          quartos: 4,
          banheiros: 3,
          area: 140,
          vagas: 3
        },
        position: { left: "65%", top: "45%" },
        endereco: "Av. Atlântica, 456 - Ipanema, RJ",
        construtora: "Gafisa",
        motivos: ["Espaçoso", "Boa localização", "Cobertura duplex"]
      },
      {
        id: "mock-3",
        titulo: "Apartamento Familiar Centro",
        preco: 420000,
        destaque: true,
        matchPercentage: 82,
        telefoneContato: "(11) 77777-7777",
        thumbnail: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&h=200&fit=crop",
        caracteristicas: {
          quartos: 2,
          banheiros: 1,
          area: 65,
          vagas: 1
        },
        position: { left: "45%", top: "65%" },
        endereco: "Rua do Catete, 789 - Catete, RJ",
        construtora: "MRV",
        motivos: ["Preço acessível", "Boa localização", "Ideal para família"]
      }
    ]

    return NextResponse.json({
      success: true,
      pins: pinsMock,
      analise: "Análise mock devido a erro no servidor",
      totalPins: pinsMock.length,
      pinsDestaque: 3,
      metodoAnalise: 'mock',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    })
  }
}
