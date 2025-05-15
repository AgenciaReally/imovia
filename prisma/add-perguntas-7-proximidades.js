// Parte 7: Perguntas de PROXIMIDADES
const { PrismaClient } = require('../src/generated/prisma')
const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Adicionando perguntas de PROXIMIDADES...')

    const perguntas = [
      {
        id: 'seed-PROXIMIDADES-1',
        texto: 'Qual a importância de estar perto de parques?',
        tipo: 'slider',
        opcoes: JSON.stringify({
          min: 0,
          max: 100,
          step: 5
        }),
        ordem: 1,
        categoria: 'PROXIMIDADES',
        fluxo: 'AMBOS',
        pontuacao: 5,
        obrigatoria: false,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-PROXIMIDADES-2',
        texto: 'Qual a importância de estar perto de shoppings?',
        tipo: 'slider',
        opcoes: JSON.stringify({
          min: 0,
          max: 100,
          step: 5
        }),
        ordem: 2,
        categoria: 'PROXIMIDADES',
        fluxo: 'AMBOS',
        pontuacao: 4,
        obrigatoria: false,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-PROXIMIDADES-3',
        texto: 'Qual a importância de estar perto de restaurantes e bares?',
        tipo: 'slider',
        opcoes: JSON.stringify({
          min: 0,
          max: 100,
          step: 5
        }),
        ordem: 3,
        categoria: 'PROXIMIDADES',
        fluxo: 'AMBOS',
        pontuacao: 4,
        obrigatoria: false,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-PROXIMIDADES-4',
        texto: 'Qual a importância de poder fazer coisas a pé (caminhabilidade)?',
        tipo: 'slider',
        opcoes: JSON.stringify({
          min: 0,
          max: 100,
          step: 5
        }),
        ordem: 4,
        categoria: 'PROXIMIDADES',
        fluxo: 'AMBOS',
        pontuacao: 6,
        obrigatoria: false,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-PROXIMIDADES-5',
        texto: 'Você tem pet?',
        tipo: 'radio',
        opcoes: JSON.stringify([
          { label: 'Sim', value: 'sim' },
          { label: 'Não', value: 'nao' }
        ]),
        ordem: 5,
        categoria: 'PROXIMIDADES',
        fluxo: 'AMBOS',
        pontuacao: 3,
        obrigatoria: false,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-PROXIMIDADES-6',
        texto: 'Qual a importância de estar perto de escolas?',
        tipo: 'slider',
        opcoes: JSON.stringify({
          min: 0,
          max: 100,
          step: 5
        }),
        ordem: 6,
        categoria: 'PROXIMIDADES',
        fluxo: 'AMBOS',
        pontuacao: 5,
        obrigatoria: false,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-PROXIMIDADES-7',
        texto: 'Qual a importância de estar perto de transporte público?',
        tipo: 'slider',
        opcoes: JSON.stringify({
          min: 0,
          max: 100,
          step: 5
        }),
        ordem: 7,
        categoria: 'PROXIMIDADES',
        fluxo: 'AMBOS',
        pontuacao: 5,
        obrigatoria: false,
        geradaPorIA: false,
        ativa: true
      }
    ]

    // Inserir perguntas
    console.log(`Criando ${perguntas.length} perguntas de PROXIMIDADES...`)
    
    for (const pergunta of perguntas) {
      await prisma.pergunta.upsert({
        where: { id: pergunta.id },
        update: pergunta,
        create: pergunta
      })
    }

    console.log('Perguntas de PROXIMIDADES criadas com sucesso!')
  } catch (error) {
    console.error('Erro durante a criação de perguntas:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
