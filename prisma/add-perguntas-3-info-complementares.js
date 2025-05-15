// Parte 3: Perguntas de INFORMACOES_COMPLEMENTARES
const { PrismaClient } = require('../src/generated/prisma')
const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Adicionando perguntas de INFORMACOES_COMPLEMENTARES...')

    const perguntas = [
      {
        id: 'seed-INFORMACOES_COMPLEMENTARES-1',
        texto: 'Qual valor você tem disponível para dar de entrada à vista?',
        tipo: 'number',
        opcoes: null,
        ordem: 1,
        categoria: 'INFORMACOES_COMPLEMENTARES',
        fluxo: 'AMBOS',
        pontuacao: 8,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-INFORMACOES_COMPLEMENTARES-2',
        texto: 'Qual valor você pode pagar mensalmente (parcelas)?',
        tipo: 'number',
        opcoes: null,
        ordem: 2,
        categoria: 'INFORMACOES_COMPLEMENTARES',
        fluxo: 'AMBOS',
        pontuacao: 7,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-INFORMACOES_COMPLEMENTARES-3',
        texto: 'Por quantos meses você pode pagar essas parcelas?',
        tipo: 'select',
        opcoes: JSON.stringify([
          { label: '12 meses (1 ano)', value: '12' },
          { label: '24 meses (2 anos)', value: '24' },
          { label: '36 meses (3 anos)', value: '36' },
          { label: '48 meses (4 anos)', value: '48' },
          { label: '60 meses (5 anos)', value: '60' }
        ]),
        ordem: 3,
        categoria: 'INFORMACOES_COMPLEMENTARES',
        fluxo: 'AMBOS',
        pontuacao: 6,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-INFORMACOES_COMPLEMENTARES-4',
        texto: 'Quanto você pode reservar para custos de transferência (aprox. 5,5% do valor)?',
        tipo: 'number',
        opcoes: null,
        ordem: 4,
        categoria: 'INFORMACOES_COMPLEMENTARES',
        fluxo: 'AMBOS',
        pontuacao: 5,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-INFORMACOES_COMPLEMENTARES-5',
        texto: 'Qual valor você planeja separar para mobiliar o imóvel (opcional)?',
        tipo: 'number',
        opcoes: null,
        ordem: 5,
        categoria: 'INFORMACOES_COMPLEMENTARES',
        fluxo: 'AMBOS',
        pontuacao: 3,
        obrigatoria: false,
        geradaPorIA: false,
        ativa: true
      }
    ]

    // Inserir perguntas
    console.log(`Criando ${perguntas.length} perguntas de INFORMACOES_COMPLEMENTARES...`)
    
    for (const pergunta of perguntas) {
      await prisma.pergunta.upsert({
        where: { id: pergunta.id },
        update: pergunta,
        create: pergunta
      })
    }

    console.log('Perguntas de INFORMACOES_COMPLEMENTARES criadas com sucesso!')
  } catch (error) {
    console.error('Erro durante a criação de perguntas:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
