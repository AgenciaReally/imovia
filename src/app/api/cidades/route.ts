import { NextRequest, NextResponse } from 'next/server'

// GET: Buscar cidades usando API do IBGE
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const uf = searchParams.get('uf') // Estado (opcional)
    const q = searchParams.get('q') // Query de busca (opcional)
    
    let url = 'https://servicodados.ibge.gov.br/api/v1/localidades/municipios'
    
    // Se especificar UF, filtrar por estado
    if (uf) {
      url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
    }
    
    console.log('🏙️ Buscando cidades na API do IBGE:', url)
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'iMovia/1.0'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Erro na API do IBGE: ${response.status}`)
    }
    
    const cidades = await response.json()
    
    // Processar dados do IBGE
    let cidadesProcessadas = cidades.map((cidade: any) => ({
      id: cidade.id,
      nome: cidade.nome,
      uf: cidade.microrregiao?.mesorregiao?.UF?.sigla || uf || 'BR',
      estado: cidade.microrregiao?.mesorregiao?.UF?.nome || 'Brasil',
      regiao: cidade.microrregiao?.mesorregiao?.UF?.regiao?.nome || 'Brasil'
    }))
    
    console.log(`📊 Processadas ${cidadesProcessadas.length} cidades do IBGE`)
    
    // Filtrar por query se fornecida
    if (q && q.length >= 2) {
      const query = q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      cidadesProcessadas = cidadesProcessadas.filter((cidade: any) => 
        cidade.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(query)
      )
    }
    
    // Limitar resultados para performance
    const cidadesLimitadas = cidadesProcessadas.slice(0, 50)
    
    console.log(`✅ ${cidadesLimitadas.length} cidades encontradas`)
    
    return NextResponse.json({
      success: true,
      total: cidadesLimitadas.length,
      cidades: cidadesLimitadas
    })
    
  } catch (error: any) {
    console.error('❌ Erro ao buscar cidades:', error)
    
    return NextResponse.json(
      { 
        error: 'Erro ao buscar cidades',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
