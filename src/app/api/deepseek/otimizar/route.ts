// API route para otimização de formulário com Deepseek AI

import { NextRequest, NextResponse } from 'next/server'
import { deepseekService, DeepseekRequest } from '@/services/deepseek-service'
import { logger } from '@/utils/logger'

export async function POST(request: NextRequest) {
  try {
    const body: DeepseekRequest = await request.json()
    
    // Validar dados obrigatórios
    if (!body.respostasAtuais || !body.perguntasDisponiveis) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      )
    }

    logger.logDeepseek('Requisição de otimização recebida', {
      respostasCount: Object.keys(body.respostasAtuais).length,
      perguntasCount: body.perguntasDisponiveis.length,
      step: body.contexto?.step
    })

    // Chamar serviço Deepseek
    const resultado = await deepseekService.otimizarFormulario(body)

    logger.logDeepseek('Otimização concluída', {
      perguntasSugeridas: resultado.perguntasSugeridas.length,
      confianca: resultado.confianca,
      proximaPergunta: resultado.proximaPergunta
    })

    return NextResponse.json(resultado)
    
  } catch (error: any) {
    console.error('Erro na API de otimização:', error)
    
    logger.logDeepseek('Erro na otimização', { 
      error: error.message,
      stack: error.stack 
    })

    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

// Endpoint para análise de compatibilidade
export async function PUT(request: NextRequest) {
  try {
    const { respostasUsuario, imoveis, tipo } = await request.json()

    if (!respostasUsuario || !Array.isArray(respostasUsuario)) {
      return NextResponse.json(
        { error: 'Respostas do usuário são obrigatórias' },
        { status: 400 }
      )
    }

    // Se tipo for compatibilidade, fazer análise de matches
    if (tipo === 'compatibilidade') {
      const compatibilidade = await deepseekService.analisarCompatibilidade(
        respostasUsuario, 
        imoveis || []
      )

      logger.logDeepseek('compatibility', 'Análise de compatibilidade realizada', JSON.stringify({
        totalRespostas: respostasUsuario.length,
        totalImoveis: imoveis?.length || 0,
        matches: Array.isArray(compatibilidade) ? compatibilidade.length : compatibilidade.matches?.length || 0
      }))

      return NextResponse.json(compatibilidade)
    }

    // Análise padrão de compatibilidade (backward compatibility)
    const compatibilidade = await deepseekService.analisarCompatibilidade(
      respostasUsuario, 
      imoveis || []
    )

    logger.logDeepseek('compatibility', 'Análise de compatibilidade realizada', JSON.stringify({
      totalRespostas: respostasUsuario.length,
      totalImoveis: imoveis?.length || 0,
      matches: Array.isArray(compatibilidade) ? compatibilidade.length : (compatibilidade as any).matches?.length || 0
    }))

    return NextResponse.json(compatibilidade)

  } catch (error) {
    console.error('Erro na análise de compatibilidade:', error)
    logger.logDeepseek('compatibility_error', 'Erro na análise', 
      error instanceof Error ? error.message : 'Erro desconhecido'
    )

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
