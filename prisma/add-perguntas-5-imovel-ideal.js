// Parte 5: Perguntas de IMOVEL_IDEAL
const { PrismaClient } = require('../src/generated/prisma')
const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Adicionando perguntas de IMOVEL_IDEAL...')

    const perguntas = [
      {
        id: 'seed-IMOVEL_IDEAL-1',
        texto: 'Quando você quer se mudar?',
        tipo: 'priority',
        opcoes: JSON.stringify([
          { label: '3 meses (imóvel pronto)', value: '3_meses' },
          { label: '1 ano', value: '1_ano' },
          { label: 'Até 2 anos', value: '2_anos' },
          { label: 'Até 3+ anos', value: '3_mais_anos' }
        ]),
        ordem: 1,
        categoria: 'IMOVEL_IDEAL',
        fluxo: 'AMBOS',
        pontuacao: 7,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-IMOVEL_IDEAL-2',
        texto: 'Selecione seu tipo de imóvel ideal',
        tipo: 'priority',
        opcoes: JSON.stringify([
          { label: 'Casa de rua', value: 'casa_rua' },
          { label: 'Sobrado', value: 'sobrado' },
          { label: 'Apartamento', value: 'apartamento' },
          { label: 'Apartamento Garden', value: 'ap_garden' },
          { label: 'Cobertura', value: 'cobertura' }
        ]),
        ordem: 2,
        categoria: 'IMOVEL_IDEAL',
        fluxo: 'AMBOS',
        pontuacao: 9,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-IMOVEL_IDEAL-3',
        texto: 'Quantidade mínima de quartos',
        tipo: 'select',
        opcoes: JSON.stringify([
          { label: '1 quarto', value: '1' },
          { label: '2 quartos', value: '2' },
          { label: '3 quartos', value: '3' },
          { label: '4 ou mais quartos', value: '4_mais' }
        ]),
        ordem: 3,
        categoria: 'IMOVEL_IDEAL',
        fluxo: 'AMBOS',
        pontuacao: 8,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-IMOVEL_IDEAL-4',
        texto: 'É necessário ter suítes?',
        tipo: 'select',
        opcoes: JSON.stringify([
          { label: 'Não é necessário', value: 'nao' },
          { label: '1 suíte', value: '1' },
          { label: '2 ou mais suítes', value: '2_mais' }
        ]),
        ordem: 4,
        categoria: 'IMOVEL_IDEAL',
        fluxo: 'AMBOS',
        pontuacao: 7,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-IMOVEL_IDEAL-5',
        texto: 'Quantidade mínima de vagas de garagem',
        tipo: 'select',
        opcoes: JSON.stringify([
          { label: 'Não preciso de garagem', value: '0' },
          { label: '1 vaga', value: '1' },
          { label: '2 vagas', value: '2' },
          { label: '3 ou mais vagas', value: '3_mais' }
        ]),
        ordem: 5,
        categoria: 'IMOVEL_IDEAL',
        fluxo: 'AMBOS',
        pontuacao: 6,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-IMOVEL_IDEAL-6',
        texto: 'Metragem útil mínima desejada (m²)',
        tipo: 'slider',
        opcoes: JSON.stringify({
          min: 40,
          max: 300,
          step: 10
        }),
        ordem: 6,
        categoria: 'IMOVEL_IDEAL',
        fluxo: 'AMBOS',
        pontuacao: 5,
        obrigatoria: false,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-IMOVEL_IDEAL-7',
        texto: 'Qual a importância de ter churrasqueira particular?',
        tipo: 'slider',
        opcoes: JSON.stringify({
          min: 0,
          max: 100,
          step: 5
        }),
        ordem: 7,
        categoria: 'IMOVEL_IDEAL',
        fluxo: 'AMBOS',
        pontuacao: 3,
        obrigatoria: false,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-IMOVEL_IDEAL-8',
        texto: 'Ar condicionado é imprescindível?',
        tipo: 'radio',
        opcoes: JSON.stringify([
          { label: 'Sim', value: 'sim' },
          { label: 'Não', value: 'nao' }
        ]),
        ordem: 8,
        categoria: 'IMOVEL_IDEAL',
        fluxo: 'AMBOS',
        pontuacao: 4,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-IMOVEL_IDEAL-9',
        texto: 'Qual a importância de ter varanda/sacada?',
        tipo: 'slider',
        opcoes: JSON.stringify({
          min: 0,
          max: 100,
          step: 5
        }),
        ordem: 9,
        categoria: 'IMOVEL_IDEAL',
        fluxo: 'AMBOS',
        pontuacao: 4,
        obrigatoria: false,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-IMOVEL_IDEAL-10',
        texto: 'Qual sua sensibilidade a barulho?',
        tipo: 'select',
        opcoes: JSON.stringify([
          { label: 'Muito sensível', value: 'muito_sensivel' },
          { label: 'Sensível', value: 'sensivel' },
          { label: 'Normal', value: 'normal' },
          { label: 'Pouco sensível', value: 'pouco_sensivel' }
        ]),
        ordem: 10,
        categoria: 'IMOVEL_IDEAL',
        fluxo: 'AMBOS',
        pontuacao: 3,
        obrigatoria: false,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-IMOVEL_IDEAL-11',
        texto: 'Face solar de preferência',
        tipo: 'checkbox',
        opcoes: JSON.stringify([
          { label: 'Norte', value: 'norte' },
          { label: 'Leste', value: 'leste' },
          { label: 'Oeste', value: 'oeste' },
          { label: 'Sul', value: 'sul' }
        ]),
        ordem: 11,
        categoria: 'IMOVEL_IDEAL',
        fluxo: 'AMBOS',
        pontuacao: 2,
        obrigatoria: false,
        geradaPorIA: false,
        ativa: true
      }
    ]

    // Inserir perguntas
    console.log(`Criando ${perguntas.length} perguntas de IMOVEL_IDEAL...`)
    
    for (const pergunta of perguntas) {
      await prisma.pergunta.upsert({
        where: { id: pergunta.id },
        update: pergunta,
        create: pergunta
      })
    }

    console.log('Perguntas de IMOVEL_IDEAL criadas com sucesso!')
  } catch (error) {
    console.error('Erro durante a criação de perguntas:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
