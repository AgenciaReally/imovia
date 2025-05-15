// Script para adicionar todas as perguntas de todas as categorias
const { PrismaClient } = require('../src/generated/prisma')
const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Iniciando criação de todas as perguntas...')
    
    // Executar cada script individualmente
    console.log('Executando scripts para cada categoria...')
    
    require('./add-perguntas-1-cadastro')
    require('./add-perguntas-2-avaliacao-credito')
    require('./add-perguntas-3-info-complementares')
    require('./add-perguntas-4-preferencias') 
    require('./add-perguntas-5-imovel-ideal')
    require('./add-perguntas-6-empreendimento')
    require('./add-perguntas-7-proximidades')
    
    console.log('Todas as perguntas foram criadas com sucesso!')
  } catch (error) {
    console.error('Erro durante a execução:', error)
  }
}

main()
