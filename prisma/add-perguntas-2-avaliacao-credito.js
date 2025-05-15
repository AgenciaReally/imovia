// Parte 2: Perguntas de AVALIACAO_CREDITO
const { PrismaClient } = require('../src/generated/prisma')
const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Adicionando perguntas de AVALIACAO_CREDITO...')

    const perguntas = [
      // COM APROVAÇÃO
      {
        id: 'seed-AVALIACAO_CREDITO-1',
        texto: 'Qual é o valor máximo do imóvel que pensa em comprar?',
        tipo: 'slider',
        opcoes: JSON.stringify({
          min: 200000,
          max: 3000000,
          step: 50000
        }),
        ordem: 1,
        categoria: 'AVALIACAO_CREDITO',
        fluxo: 'COM_APROVACAO',
        pontuacao: 8,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-AVALIACAO_CREDITO-2',
        texto: 'Informe seu CPF',
        tipo: 'text',
        opcoes: null,
        ordem: 2,
        categoria: 'AVALIACAO_CREDITO',
        fluxo: 'COM_APROVACAO',
        pontuacao: 5,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-AVALIACAO_CREDITO-3',
        texto: 'Possui comprovante de estado civil?',
        tipo: 'radio',
        opcoes: JSON.stringify([
          { label: 'Sim', value: 'sim' },
          { label: 'Não', value: 'nao' }
        ]),
        ordem: 3,
        categoria: 'AVALIACAO_CREDITO',
        fluxo: 'COM_APROVACAO',
        pontuacao: 3,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-AVALIACAO_CREDITO-4',
        texto: 'Possui comprovante de renda atualizado?',
        tipo: 'radio',
        opcoes: JSON.stringify([
          { label: 'Sim', value: 'sim' },
          { label: 'Não', value: 'nao' }
        ]),
        ordem: 4,
        categoria: 'AVALIACAO_CREDITO',
        fluxo: 'COM_APROVACAO',
        pontuacao: 7,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-AVALIACAO_CREDITO-5',
        texto: 'Possui comprovante de endereço atualizado?',
        tipo: 'radio',
        opcoes: JSON.stringify([
          { label: 'Sim', value: 'sim' },
          { label: 'Não', value: 'nao' }
        ]),
        ordem: 5,
        categoria: 'AVALIACAO_CREDITO',
        fluxo: 'COM_APROVACAO',
        pontuacao: 3,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-AVALIACAO_CREDITO-6',
        texto: 'Possui carteira de trabalho?',
        tipo: 'radio',
        opcoes: JSON.stringify([
          { label: 'Sim', value: 'sim' },
          { label: 'Não', value: 'nao' },
          { label: 'Não se aplica', value: 'nao_se_aplica' }
        ]),
        ordem: 6,
        categoria: 'AVALIACAO_CREDITO',
        fluxo: 'COM_APROVACAO',
        pontuacao: 2,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-AVALIACAO_CREDITO-7',
        texto: 'Possui declaração de IRPF do último ano?',
        tipo: 'radio',
        opcoes: JSON.stringify([
          { label: 'Sim', value: 'sim' },
          { label: 'Não', value: 'nao' },
          { label: 'Isento', value: 'isento' }
        ]),
        ordem: 7,
        categoria: 'AVALIACAO_CREDITO',
        fluxo: 'COM_APROVACAO',
        pontuacao: 5,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-AVALIACAO_CREDITO-8',
        texto: 'Qual seu grau de escolaridade?',
        tipo: 'select',
        opcoes: JSON.stringify([
          { label: 'Ensino Fundamental', value: 'fundamental' },
          { label: 'Ensino Médio', value: 'medio' },
          { label: 'Ensino Superior', value: 'superior' },
          { label: 'Pós-graduação', value: 'pos' },
          { label: 'Mestrado/Doutorado', value: 'mestrado_doutorado' }
        ]),
        ordem: 8,
        categoria: 'AVALIACAO_CREDITO',
        fluxo: 'COM_APROVACAO',
        pontuacao: 2,
        obrigatoria: false,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-AVALIACAO_CREDITO-9',
        texto: 'Haverá outros compradores no financiamento?',
        tipo: 'radio',
        opcoes: JSON.stringify([
          { label: 'Sim', value: 'sim' },
          { label: 'Não', value: 'nao' }
        ]),
        ordem: 9,
        categoria: 'AVALIACAO_CREDITO',
        fluxo: 'COM_APROVACAO',
        pontuacao: 3,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      },
      
      // SEM APROVAÇÃO
      {
        id: 'seed-AVALIACAO_CREDITO-10',
        texto: 'Qual é a sua renda mensal?',
        tipo: 'select',
        opcoes: JSON.stringify([
          { label: 'Até R$ 2.000', value: 'ate_2000' },
          { label: 'De R$ 2.001 a R$ 5.000', value: '2001_5000' },
          { label: 'De R$ 5.001 a R$ 10.000', value: '5001_10000' },
          { label: 'Acima de R$ 10.000', value: 'acima_10000' }
        ]),
        ordem: 1,
        categoria: 'AVALIACAO_CREDITO',
        fluxo: 'SEM_APROVACAO',
        pontuacao: 8,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-AVALIACAO_CREDITO-11',
        texto: 'Possui outros financiamentos ou empréstimos que comprometem sua renda?',
        tipo: 'radio',
        opcoes: JSON.stringify([
          { label: 'Sim', value: 'sim' },
          { label: 'Não', value: 'nao' }
        ]),
        ordem: 2,
        categoria: 'AVALIACAO_CREDITO',
        fluxo: 'SEM_APROVACAO',
        pontuacao: 6,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      },
      {
        id: 'seed-AVALIACAO_CREDITO-12',
        texto: 'Qual é a sua data de nascimento?',
        tipo: 'date',
        opcoes: null,
        ordem: 3,
        categoria: 'AVALIACAO_CREDITO',
        fluxo: 'SEM_APROVACAO',
        pontuacao: 2,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      }
    ]

    // Inserir perguntas
    console.log(`Criando ${perguntas.length} perguntas de AVALIACAO_CREDITO...`)
    
    for (const pergunta of perguntas) {
      await prisma.pergunta.upsert({
        where: { id: pergunta.id },
        update: pergunta,
        create: pergunta
      })
    }

    console.log('Perguntas de AVALIACAO_CREDITO criadas com sucesso!')
  } catch (error) {
    console.error('Erro durante a criação de perguntas:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
