// Parte 4: Perguntas de PREFERENCIAS
const { PrismaClient } = require('../src/generated/prisma')
const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Adicionando perguntas de PREFERENCIAS...')

    const perguntas = [
      {
        id: 'seed-PREFERENCIAS-1',
        texto: 'Em qual cidade você deseja comprar um imóvel?',
        tipo: 'select',
        opcoes: JSON.stringify([
          { label: 'Curitiba', value: 'curitiba' },
          { label: 'Região Metropolitana', value: 'regiao_metropolitana' }
        ]),
        ordem: 1,
        categoria: 'PREFERENCIAS',
        fluxo: 'AMBOS',
        pontuacao: 10,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-PREFERENCIAS-2',
        texto: 'Quais bairros você prefere?',
        tipo: 'checkbox',
        opcoes: JSON.stringify([
          { label: 'Centro', value: 'centro' },
          { label: 'Batel', value: 'batel' },
          { label: 'Água Verde', value: 'agua_verde' },
          { label: 'Portão', value: 'portao' },
          { label: 'Ecoville', value: 'ecoville' },
          { label: 'Santa Felicidade', value: 'santa_felicidade' },
          { label: 'Cabral', value: 'cabral' },
          { label: 'Juvevê', value: 'juveve' },
          { label: 'Bairro Alto', value: 'bairro_alto' },
          { label: 'Outros', value: 'outros' }
        ]),
        ordem: 2,
        categoria: 'PREFERENCIAS',
        fluxo: 'AMBOS',
        pontuacao: 8,
        obrigatoria: false,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-PREFERENCIAS-3',
        texto: 'Onde você trabalha? (Endereço ou bairro)',
        tipo: 'text',
        opcoes: null,
        ordem: 3,
        categoria: 'PREFERENCIAS',
        fluxo: 'AMBOS',
        pontuacao: 6,
        obrigatoria: false,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-PREFERENCIAS-4',
        texto: 'Onde seus filhos estudam? (Colégio ou bairro)',
        tipo: 'text',
        opcoes: null,
        ordem: 4,
        categoria: 'PREFERENCIAS',
        fluxo: 'AMBOS',
        pontuacao: 5,
        obrigatoria: false,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-PREFERENCIAS-5',
        texto: 'Endereço de algum familiar ou rede de apoio próximo?',
        tipo: 'text',
        opcoes: null,
        ordem: 5,
        categoria: 'PREFERENCIAS',
        fluxo: 'AMBOS',
        pontuacao: 4,
        obrigatoria: false,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-PREFERENCIAS-6',
        texto: 'Qual valor máximo deseja gastar no imóvel (total)?',
        tipo: 'slider',
        opcoes: JSON.stringify({
          min: 200000,
          max: 3000000,
          step: 50000
        }),
        ordem: 6,
        categoria: 'PREFERENCIAS',
        fluxo: 'AMBOS',
        pontuacao: 9,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-PREFERENCIAS-7',
        texto: 'O que você prefere?',
        tipo: 'priority',
        opcoes: JSON.stringify([
          { label: 'Apartamento', value: 'apartamento' },
          { label: 'Casa', value: 'casa' },
          { label: 'Sobrado', value: 'sobrado' },
          { label: 'Cobertura', value: 'cobertura' }
        ]),
        ordem: 7,
        categoria: 'PREFERENCIAS',
        fluxo: 'AMBOS',
        pontuacao: 8,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      }
    ]

    // Inserir perguntas
    console.log(`Criando ${perguntas.length} perguntas de PREFERENCIAS...`)
    
    for (const pergunta of perguntas) {
      await prisma.pergunta.upsert({
        where: { id: pergunta.id },
        update: pergunta,
        create: pergunta
      })
    }

    console.log('Perguntas de PREFERENCIAS criadas com sucesso!')
  } catch (error) {
    console.error('Erro durante a criação de perguntas:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
