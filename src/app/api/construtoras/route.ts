import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export interface ConstrutoraDashboard {
  id: string
  nome: string
  email: string
  telefone?: string
  cnpj: string
  endereco?: string
  status: 'ativa' | 'inativa' | 'pendente'
  dataRegistro: string
  qtdImoveis: number
  qtdUsuarios: number
}

export async function GET() {
  try {
    const construtoras = await prisma.construtora.findMany({
      include: {
        imoveis: true,
        usuarios: true,
      },
    })
    
    const construtoraMapeada = construtoras.map(construtora => ({
      id: construtora.id,
      nome: construtora.nome,
      email: construtora.email,
      telefone: construtora.telefone || '-',
      cnpj: construtora.cnpj || '-',
      endereco: construtora.endereco || '-',
      status: construtora.ativa ? 'ativa' : 'inativa' as 'ativa' | 'inativa' | 'pendente',
      dataRegistro: construtora.createdAt.toLocaleDateString('pt-BR'),
      qtdImoveis: construtora.imoveis.length,
      qtdUsuarios: construtora.usuarios.length
    }))
    
    // Além do formato completo para o dashboard admin, também retornar uma versão simplificada
    // para ser usada em selects (como no modal de detalhes do imóvel)
    const construtoraSimplesArray = construtoras.map(c => ({
      id: c.id,
      nome: c.nome
    }))
    
    return NextResponse.json({
      success: true,
      construtoras: construtoraSimplesArray, // Formato simples para selects
      construtoraMapeada // Formato completo para tabelas/dashboards
    })
  } catch (error) {
    console.error('Erro ao buscar construtoras:', error)
    return NextResponse.json({ error: 'Erro ao buscar construtoras' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const novaConstrutora = await prisma.construtora.create({
      data: {
        nome: data.nome,
        email: data.email,
        cnpj: data.cnpj,
        telefone: data.telefone,
        endereco: data.endereco,
        ativa: data.ativa !== undefined ? data.ativa : true
      }
    })
    
    return NextResponse.json(novaConstrutora, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar construtora:', error)
    return NextResponse.json({ error: 'Erro ao criar construtora' }, { status: 500 })
  }
}
