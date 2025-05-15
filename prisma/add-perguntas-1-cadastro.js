// Parte 1: Perguntas de CADASTRO
const { PrismaClient } = require('../src/generated/prisma')
const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Adicionando perguntas de CADASTRO...')

    const perguntas = [
      {
        id: 'seed-CADASTRO-1',
        texto: 'Qual é o seu nome completo?',
        tipo: 'text',
        opcoes: null,
        ordem: 1,
        categoria: 'CADASTRO',
        fluxo: 'AMBOS',
        pontuacao: 1,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-CADASTRO-2',
        texto: 'Qual é o seu e-mail?',
        tipo: 'email',
        opcoes: null,
        ordem: 2,
        categoria: 'CADASTRO',
        fluxo: 'AMBOS',
        pontuacao: 1,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-CADASTRO-3',
        texto: 'Qual é o seu telefone?',
        tipo: 'tel',
        opcoes: null,
        ordem: 3,
        categoria: 'CADASTRO',
        fluxo: 'AMBOS',
        pontuacao: 1,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      }
    ]

    // Inserir perguntas
    console.log(`Criando ${perguntas.length} perguntas de CADASTRO...`)
    
    for (const pergunta of perguntas) {
      await prisma.pergunta.upsert({
        where: { id: pergunta.id },
        update: pergunta,
        create: pergunta
      })
    }

    console.log('Perguntas de CADASTRO criadas com sucesso!')
  } catch (error) {
    console.error('Erro durante a criação de perguntas:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
