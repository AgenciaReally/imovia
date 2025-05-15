import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Iniciando seed de perguntas...')

    // Exemplo de perguntas para diferentes categorias
    const perguntas = [
      // CADASTRO
      {
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
      },
      
      // AVALIACAO_CREDITO
      {
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
        fluxo: 'COM_APROVACAO',
        pontuacao: 5,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      },
      {
        texto: 'Possui restrições no seu nome?',
        tipo: 'radio',
        opcoes: JSON.stringify([
          { label: 'Sim', value: 'sim' },
          { label: 'Não', value: 'nao' }
        ]),
        ordem: 2,
        categoria: 'AVALIACAO_CREDITO',
        fluxo: 'COM_APROVACAO',
        pontuacao: 10,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      },
      
      // PREFERENCIAS
      {
        texto: 'O que você prefere?',
        tipo: 'radio',
        opcoes: JSON.stringify([
          { label: 'Apartamento', value: 'apartamento' },
          { label: 'Casa', value: 'casa' },
          { label: 'Ambos', value: 'ambos' }
        ]),
        ordem: 1,
        categoria: 'PREFERENCIAS',
        fluxo: 'AMBOS',
        pontuacao: 8,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      },
      {
        texto: 'Quais características são importantes?',
        tipo: 'checkbox',
        opcoes: JSON.stringify([
          { label: 'Piscina', value: 'piscina' },
          { label: 'Academia', value: 'academia' },
          { label: 'Playground', value: 'playground' },
          { label: 'Churrasqueira', value: 'churrasqueira' },
          { label: 'Segurança 24h', value: 'seguranca' }
        ]),
        ordem: 2,
        categoria: 'PREFERENCIAS',
        fluxo: 'AMBOS',
        pontuacao: 3,
        obrigatoria: false,
        geradaPorIA: false,
        ativa: true
      },
      
      // IMOVEL_IDEAL
      {
        texto: 'Quantos quartos você deseja?',
        tipo: 'select',
        opcoes: JSON.stringify([
          { label: '1 quarto', value: '1' },
          { label: '2 quartos', value: '2' },
          { label: '3 quartos', value: '3' },
          { label: '4 ou mais quartos', value: '4' }
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
        texto: 'Qual o valor máximo que você pode pagar?',
        tipo: 'slider',
        opcoes: JSON.stringify({
          min: 100000,
          max: 2000000,
          step: 50000
        }),
        ordem: 2,
        categoria: 'IMOVEL_IDEAL',
        fluxo: 'AMBOS',
        pontuacao: 10,
        obrigatoria: true,
        geradaPorIA: false,
        ativa: true
      },
      
      // Pergunta inativa para teste
      {
        texto: 'Pergunta desativada (não deve aparecer)',
        tipo: 'text',
        opcoes: null,
        ordem: 99,
        categoria: 'CADASTRO',
        fluxo: 'AMBOS',
        pontuacao: 1,
        obrigatoria: false,
        geradaPorIA: false,
        ativa: false
      }
    ]

    // Inserir perguntas
    console.log(`Criando ${perguntas.length} perguntas...`)
    
    for (const pergunta of perguntas) {
      await prisma.pergunta.upsert({
        where: {
          id: `seed-${pergunta.categoria}-${pergunta.ordem}`
        },
        update: pergunta,
        create: {
          ...pergunta,
          id: `seed-${pergunta.categoria}-${pergunta.ordem}`
        }
      })
    }

    console.log('Seed de perguntas concluído com sucesso!')
  } catch (error) {
    console.error('Erro durante o seed de perguntas:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
