import { NextRequest, NextResponse } from 'next/server'

// Defina as interfaces para os dados retornados pela Orulo
interface OruloConstrutora {
  id: number
  name: string
  description: string
  logo_url: string
  site_url: string
  phone: string
  email: string
  properties_count: number
  city: string
  state: string
  status: string
  address: string
  creci: string
  verified: boolean
}

interface OruloConstrutoraPaginatedResponse {
  count: number
  next: string | null
  previous: string | null
  results: OruloConstrutora[]
}

export async function GET(request: NextRequest) {
  // Na produção, você utilizaria a chave API real e buscaria os dados da Orulo
  // const API_KEY = process.env.ORULO_API_KEY
  
  try {
    // Versão de mock para desenvolvimento
    const mockResponse = mockOruloConstrutoras()
    
    return NextResponse.json(mockResponse, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar construtoras da Orulo:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar construtoras da Orulo' },
      { status: 500 }
    )
  }
}

// Mock para desenvolvimento que retorna construtoras simuladas
function mockOruloConstrutoras(): OruloConstrutoraPaginatedResponse {
  const nomesConstrutorasReais = [
    'MRV Engenharia',
    'Cyrela Brazil Realty',
    'Even Construtora e Incorporadora',
    'Tecnisa',
    'Eztec',
    'Direcional Engenharia',
    'Helbor Empreendimentos',
    'Gafisa',
    'Trisul',
    'Mitre Realty',
    'Moura Dubeux Engenharia',
    'RNI Negócios Imobiliários',
    'Kallas Incorporações e Construções',
    'Cury Construtora',
    'PlanoEPlano',
    'Rossi Residencial',
    'Patrimar Engenharia',
    'Tenda Construtora',
    'JHSF Incorporações',
    'Melnick Desenvolvimento Imobiliário',
    'You Inc Incorporadora e Participações',
    'EZ TEC Empreendimentos e Participações',
    'MAC Construtora',
    'PDG Realty',
    'CR2 Empreendimentos Imobiliários',
    'Construtora Adolpho Lindenberg',
    'Inter Construtora e Incorporadora',
    'Lavvi Incorporadora',
    'Tegra Incorporadora',
    'Construtora Tenda',
    'Incorporadora Alphaville Urbanismo'
  ]
  
  const cidades = [
    'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília',
    'Salvador', 'Fortaleza', 'Curitiba', 'Recife', 'Porto Alegre',
    'Manaus', 'Goiânia', 'Belém', 'Florianópolis', 'Campinas'
  ]

  const estados = [
    'SP', 'RJ', 'MG', 'DF', 'BA', 'CE', 'PR', 'PE', 'RS', 'AM', 'GO', 'PA', 'SC'
  ]
  
  const construtoras: OruloConstrutora[] = nomesConstrutorasReais.map((nome, index) => {
    const id = 1000 + index
    const estadoIndex = index % estados.length
    const cidadeIndex = index % cidades.length
    
    return {
      id,
      name: nome,
      description: `${nome} é uma incorporadora e construtora de destaque no mercado imobiliário brasileiro, com foco em empreendimentos residenciais e comerciais de alta qualidade.`,
      logo_url: `https://via.placeholder.com/150?text=${encodeURIComponent(nome.split(' ')[0])}`,
      site_url: `https://${nome.toLowerCase().replace(/\s+/g, '-')}.com.br`,
      phone: `(11) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
      email: `contato@${nome.toLowerCase().replace(/\s+/g, '')}.com.br`,
      properties_count: Math.floor(Math.random() * 50) + 5,
      city: cidades[cidadeIndex],
      state: estados[estadoIndex],
      status: 'active',
      address: `Av. Paulista, ${1000 + index}, ${cidades[cidadeIndex]} - ${estados[estadoIndex]}`,
      creci: `${Math.floor(Math.random() * 90000) + 10000}J`,
      verified: Math.random() > 0.3 // 70% de chance de ser verificada
    }
  })

  return {
    count: construtoras.length,
    next: null,
    previous: null,
    results: construtoras
  }
}
