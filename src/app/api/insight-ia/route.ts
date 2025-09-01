import { NextRequest, NextResponse } from 'next/server'

// POST: Gerar insight IA dinâmico
export async function POST(request: NextRequest) {
  try {
    const { pergunta, valor, respostasProximas } = await request.json()
    
    if (!pergunta || !valor) {
      return NextResponse.json(
        { error: 'Pergunta e valor são obrigatórios' },
        { status: 400 }
      )
    }
    
    console.log('🧠 Gerando insight IA para:', { pergunta, valor })
    
    // Construir prompt para o Deepseek
    const prompt = `
Você é um especialista em análise imobiliária e consultoria financeira. 
Analise a resposta do cliente e forneça um insight útil e personalizado.

PERGUNTA: ${pergunta}
RESPOSTA DO CLIENTE: ${valor}
${respostasProximas ? `CONTEXTO ADICIONAL: ${JSON.stringify(respostasProximas)}` : ''}

Forneça um insight breve (máximo 2 frases) que seja:
1. Específico para a resposta dada
2. Útil para decisão imobiliária
3. Positivo e encorajador
4. Baseado em boas práticas do mercado

Responda apenas o insight, sem explicações adicionais.
    `.trim()
    
    // Chamar API do Deepseek
    const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    })
    
    if (!deepseekResponse.ok) {
      throw new Error(`Erro na API Deepseek: ${deepseekResponse.status}`)
    }
    
    const deepseekData = await deepseekResponse.json()
    const insight = deepseekData.choices?.[0]?.message?.content?.trim()
    
    if (!insight) {
      throw new Error('Resposta vazia do Deepseek')
    }
    
    console.log('✅ Insight gerado:', insight)
    
    return NextResponse.json({
      success: true,
      insight
    })
    
  } catch (error: any) {
    console.error('❌ Erro ao gerar insight:', error)
    
    // Fallback com insights pré-definidos
    const insightsFallback = [
      "Ótima escolha! Essa preferência pode ajudar a filtrar opções mais adequadas ao seu perfil.",
      "Interessante! Vamos considerar isso na busca pelos melhores imóveis para você.",
      "Perfeito! Essa informação é valiosa para encontrar o imóvel ideal.",
      "Excelente! Com essa resposta, podemos personalizar melhor suas recomendações."
    ]
    
    const insightAleatorio = insightsFallback[Math.floor(Math.random() * insightsFallback.length)]
    
    return NextResponse.json({
      success: true,
      insight: insightAleatorio,
      fallback: true
    })
  }
}
