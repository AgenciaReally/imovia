import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Iniciando teste da API da Orulo')
    
    // Credenciais da Orulo
    const CLIENT_ID = 'NVMeJ6c9nVZM3kMYhPBwU6CvL4CQbAgiZMLcuMgvfXA'
    const CLIENT_SECRET = 'LFCtyXG3QP3V5o9pkXGjRJvKKf0gwozPiJ7TuDs8kmQ'
    
    // Headers com a autenticação da API Orulo
    const headers = {
      'X-Client-ID': CLIENT_ID,
      'X-Secret': CLIENT_SECRET,
      'Content-Type': 'application/json'
    }

    // Tentar fazer a requisição
    console.log('Enviando requisição para API da Orulo...')
    const response = await fetch('https://api.orulo.com.br/buildings?page=1&page_size=10', { 
      headers,
      method: 'GET'
    })
    
    console.log(`Status da resposta: ${response.status}`)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erro na requisição:', errorText)
      return NextResponse.json({ 
        success: false, 
        status: response.status,
        statusText: response.statusText,
        errorDetails: errorText
      })
    }
    
    const data = await response.json()
    console.log('Requisição bem-sucedida!')
    
    return NextResponse.json({ 
      success: true,
      count: data.count || 0,
      results: data.results || [],
      sampleData: data.results?.[0] || null
    })
  } catch (error) {
    console.error('Erro ao testar API da Orulo:', error)
    return NextResponse.json({ 
      success: false, 
      error: String(error)
    }, { status: 500 })
  }
}
