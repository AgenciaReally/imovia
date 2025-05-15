// Parte 6: Perguntas de EMPREENDIMENTO
const { PrismaClient } = require('../src/generated/prisma')
const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Adicionando perguntas de EMPREENDIMENTO...')

    const perguntas = [
      {
        id: 'seed-EMPREENDIMENTO-1',
        texto: 'Qual a importância de ter piso nos quartos?',
        tipo: 'slider',
        opcoes: JSON.stringify({
          min: 0,
          max: 100,
          step: 5
        }),
        ordem: 1,
        categoria: 'EMPREENDIMENTO',
        fluxo: 'AMBOS',
        pontuacao: 3,
        obrigatoria: false,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-EMPREENDIMENTO-2',
        texto: 'Qual a importância de ter academia no condomínio?',
        tipo: 'slider',
        opcoes: JSON.stringify({
          min: 0,
          max: 100,
          step: 5
        }),
        ordem: 2,
        categoria: 'EMPREENDIMENTO',
        fluxo: 'AMBOS',
        pontuacao: 5,
        obrigatoria: false,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-EMPREENDIMENTO-3',
        texto: 'Qual a importância de ter piscina no condomínio?',
        tipo: 'slider',
        opcoes: JSON.stringify({
          min: 0,
          max: 100,
          step: 5
        }),
        ordem: 3,
        categoria: 'EMPREENDIMENTO',
        fluxo: 'AMBOS',
        pontuacao: 5,
        obrigatoria: false,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-EMPREENDIMENTO-4',
        texto: 'Qual tipo de portaria você prefere?',
        tipo: 'radio',
        opcoes: JSON.stringify([
          { label: 'Portaria 24h', value: 'portaria_24h' },
          { label: 'Portaria remota', value: 'portaria_remota' },
          { label: 'Não é importante', value: 'nao_importante' }
        ]),
        ordem: 4,
        categoria: 'EMPREENDIMENTO',
        fluxo: 'AMBOS',
        pontuacao: 6,
        obrigatoria: false,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-EMPREENDIMENTO-5',
        texto: 'Qual a importância de ter salão de festas?',
        tipo: 'slider',
        opcoes: JSON.stringify({
          min: 0,
          max: 100,
          step: 5
        }),
        ordem: 5,
        categoria: 'EMPREENDIMENTO',
        fluxo: 'AMBOS',
        pontuacao: 4,
        obrigatoria: false,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-EMPREENDIMENTO-6',
        texto: 'Qual a importância de ter playground/área infantil?',
        tipo: 'slider',
        opcoes: JSON.stringify({
          min: 0,
          max: 100,
          step: 5
        }),
        ordem: 6,
        categoria: 'EMPREENDIMENTO',
        fluxo: 'AMBOS',
        pontuacao: 4,
        obrigatoria: false,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-EMPREENDIMENTO-7',
        texto: 'Qual a importância de ter espaço pet?',
        tipo: 'slider',
        opcoes: JSON.stringify({
          min: 0,
          max: 100,
          step: 5
        }),
        ordem: 7,
        categoria: 'EMPREENDIMENTO',
        fluxo: 'AMBOS',
        pontuacao: 3,
        obrigatoria: false,
        geradaPorIA: false,
        ativa: true
      }
    ]

    // Inserir perguntas
    console.log(`Criando ${perguntas.length} perguntas de EMPREENDIMENTO...`)
    
    for (const pergunta of perguntas) {
      await prisma.pergunta.upsert({
        where: { id: pergunta.id },
        update: pergunta,
        create: pergunta
      })
    }

    console.log('Perguntas de EMPREENDIMENTO criadas com sucesso!')
  } catch (error) {
    console.error('Erro durante a criação de perguntas:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
