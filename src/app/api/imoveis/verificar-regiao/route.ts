import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { cidade, estado, cidadeCompleta } = await request.json()
    
    if (!cidade && !cidadeCompleta) {
      return NextResponse.json({ error: 'Cidade é obrigatória' }, { status: 400 })
    }

    // 🔍 Buscar imóveis usando comparação de string no campo endereco
    const searchTerms = []
    
    // Adicionar termos de busca
    if (cidade) searchTerms.push(cidade.toLowerCase())
    if (estado) searchTerms.push(estado.toLowerCase())
    if (cidadeCompleta) searchTerms.push(cidadeCompleta.toLowerCase())
    
    // Buscar apenas imóveis ativos
    const imoveis = await prisma.imovel.findMany({
      where: {
        AND: [
          { ativo: true },
          {
            OR: searchTerms.map(term => ({
              endereco: {
                contains: term,
                mode: 'insensitive'
              }
            }))
          }
        ]
      },
      select: {
        id: true,
        titulo: true,
        endereco: true,
        preco: true,
        cidade: true,
        estado: true,
        bairro: true,
        destaque: true
      }
    })

    // Contagem total
    const count = imoveis.length

    // Log para debug
    console.log(`🔍 Busca por: [${searchTerms.join(', ')}]`)
    console.log(`🏠 Encontrados: ${count} imóveis`)
    
    // Se encontrou imóveis, logar alguns exemplos
    if (count > 0) {
      console.log(`📍 Exemplos encontrados:`)
      imoveis.slice(0, 3).forEach(imovel => {
        console.log(`   - ${imovel.titulo} (${imovel.endereco})`)
      })
    }

    return NextResponse.json({
      success: true,
      count,
      encontrados: count > 0,
      cidade: cidadeCompleta || cidade,
      imoveis: imoveis.slice(0, 5), // Retornar apenas os primeiros 5 para preview
      searchTerms
    })

  } catch (error) {
    console.error('Erro ao verificar imóveis na região:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
