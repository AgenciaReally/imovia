import { NextRequest, NextResponse } from 'next/server'

// GET: Buscar bairros usando API do IBGE
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const municipio = searchParams.get('municipio') // ID do município (obrigatório)
    const q = searchParams.get('q') // Query de busca (opcional)
    
    if (!municipio) {
      return NextResponse.json(
        { error: 'Parâmetro municipio é obrigatório' },
        { status: 400 }
      )
    }
    
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${municipio}/distritos`
    
    console.log('🏘️ Buscando bairros na API do IBGE:', url)
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'iMovia/1.0'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Erro na API do IBGE: ${response.status}`)
    }
    
    const distritos = await response.json()
    
    // Processar dados do IBGE
    let bairrosProcessados = distritos.map((distrito: any) => ({
      id: distrito.id,
      nome: distrito.nome,
      municipio: distrito.municipio?.nome || 'N/A',
      municipioId: distrito.municipio?.id || municipio
    }))
    
    console.log(`🏘️ Processados ${bairrosProcessados.length} bairros do IBGE`)
    
    // Filtrar por query se fornecida
    if (q && q.length >= 2) {
      const query = q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      bairrosProcessados = bairrosProcessados.filter((bairro: any) => 
        bairro.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(query)
      )
    }
    
    // Limitar resultados para performance
    const bairrosLimitados = bairrosProcessados.slice(0, 30)
    
    console.log(`✅ ${bairrosLimitados.length} bairros encontrados`)
    
    return NextResponse.json({
      success: true,
      total: bairrosLimitados.length,
      bairros: bairrosLimitados
    })
    
  } catch (error: any) {
    console.error('❌ Erro ao buscar bairros:', error)
    
    return NextResponse.json(
      { 
        error: 'Erro ao buscar bairros',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
