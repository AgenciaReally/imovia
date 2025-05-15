import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Buscar todas as perguntas
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const categoria = searchParams.get('categoria')
  const fluxo = searchParams.get('fluxo')
  const ativa = searchParams.get('ativa')

  try {
    let where: any = {}
    
    // Adicionar filtros se fornecidos
    if (categoria) {
      where = { ...where, categoria }
    }
    
    if (fluxo) {
      where = { ...where, fluxo }
    }
    
    if (ativa !== null && ativa !== undefined) {
      where = { ...where, ativa: ativa === 'true' }
    }
    
    // Verificar se há perguntas no banco de dados
    const countPerguntas = await prisma.pergunta.count()
    console.log(`Total de perguntas encontradas: ${countPerguntas}`)
    
    const perguntas = await prisma.pergunta.findMany({
      where,
      orderBy: [
        { categoria: 'asc' },
        { ordem: 'asc' }
      ]
    })
    
    return NextResponse.json(perguntas)
  } catch (error) {
    console.error('Erro ao buscar perguntas:', error)
    return NextResponse.json(
      { error: `Erro ao buscar perguntas: ${error instanceof Error ? error.message : 'Erro desconhecido'}` },
      { status: 500 }
    )
  }
}

// POST: Criar uma nova pergunta
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log('Dados recebidos para nova pergunta:', JSON.stringify(data, null, 2))
    
    // Validação básica
    if (!data.texto || !data.tipo || !data.categoria || !data.fluxo) {
      console.error('Dados incompletos para criar pergunta:', JSON.stringify(data, null, 2))
      return NextResponse.json(
        { error: 'Dados incompletos para criar pergunta', campos: { texto: !!data.texto, tipo: !!data.tipo, categoria: !!data.categoria, fluxo: !!data.fluxo } },
        { status: 400 }
      )
    }
    
    // Determinar a ordem (última ordem + 1 na mesma categoria)
    const ultimaPergunta = await prisma.pergunta.findFirst({
      where: { categoria: data.categoria },
      orderBy: { ordem: 'desc' }
    })
    
    const ordem = ultimaPergunta ? ultimaPergunta.ordem + 1 : 1
    console.log(`Nova ordem para a pergunta na categoria ${data.categoria}: ${ordem}`)
    
    // Preparar os dados para o banco
    const dadosParaInserir = {
      texto: data.texto,
      tipo: data.tipo,
      categoria: data.categoria,
      fluxo: data.fluxo,
      pontuacao: data.pontuacao || 1,
      obrigatoria: data.obrigatoria !== undefined ? data.obrigatoria : true,
      ativa: data.ativa !== undefined ? data.ativa : true,
      geradaPorIA: data.geradaPorIA !== undefined ? data.geradaPorIA : false,
      opcoes: data.opcoes || null,
      condicional: data.condicional || null,
      ordem
    }
    
    console.log('Dados para inserir no banco:', JSON.stringify(dadosParaInserir, null, 2))
    
    const novaPergunta = await prisma.pergunta.create({
      data: dadosParaInserir
    })
    
    console.log('Pergunta criada com sucesso:', JSON.stringify(novaPergunta, null, 2))
    return NextResponse.json(novaPergunta, { status: 201 })
  } catch (error: any) {
    console.error('Erro ao criar pergunta:', error)
    let mensagemErro = 'Erro ao criar pergunta';
    
    if (error.code === 'P2002') {
      mensagemErro = 'Erro de unicidade: um item com este valor já existe';
    } else if (error.code === 'P2000') {
      mensagemErro = 'Erro de tamanho de valor: um dos campos excede o tamanho máximo';
    } else if (error.message) {
      mensagemErro = error.message;
    }
    
    return NextResponse.json(
      { error: mensagemErro, details: error.message || String(error) },
      { status: 500 }
    )
  }
}
