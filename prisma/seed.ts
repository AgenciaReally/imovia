// Importar o PrismaClient
import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed para tipos de imóveis...')
  
  // Criar os tipos de imóveis padrão
  const tiposImoveis = [
    { nome: 'Apartamento', slug: 'apartamento', descricao: 'Unidade residencial em prédio' },
    { nome: 'Casa', slug: 'casa', descricao: 'Residência unifamiliar' },
    { nome: 'Terreno', slug: 'terreno', descricao: 'Área de terra sem construção' },
    { nome: 'Imóvel Comercial', slug: 'imovel-comercial', descricao: 'Espaço para uso comercial' },
    { nome: 'Imóvel Rural', slug: 'imovel-rural', descricao: 'Propriedade em zona rural' }
  ]

  for (const tipo of tiposImoveis) {
    await prisma.tipoImovel.upsert({
      where: { slug: tipo.slug },
      update: tipo,
      create: tipo
    })
    console.log(`Tipo de imóvel "${tipo.nome}" criado ou atualizado`)
  }
  
  // Atualizar todos os imóveis que têm tipoImovelNome mas não tipoImovelId
  const imoveis = await prisma.imovel.findMany({
    where: {
      tipoImovelId: null,
      tipoImovelNome: { not: null }
    }
  })
  
  for (const imovel of imoveis) {
    // Buscar o tipo correspondente
    let tipoNome = imovel.tipoImovelNome || 'Terreno'
    
    // Normalizar o nome para buscar (remover acentos, colocar em minúsculas)
    const normalizado = tipoNome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    
    // Buscar tipo por slug ou similar
    let tipo
    if (normalizado.includes('apartamento')) {
      tipo = await prisma.tipoImovel.findUnique({ where: { slug: 'apartamento' } })
    } else if (normalizado.includes('casa')) {
      tipo = await prisma.tipoImovel.findUnique({ where: { slug: 'casa' } })
    } else if (normalizado.includes('terreno')) {
      tipo = await prisma.tipoImovel.findUnique({ where: { slug: 'terreno' } })
    } else if (normalizado.includes('comercial')) {
      tipo = await prisma.tipoImovel.findUnique({ where: { slug: 'imovel-comercial' } })
    } else if (normalizado.includes('rural')) {
      tipo = await prisma.tipoImovel.findUnique({ where: { slug: 'imovel-rural' } })
    } else {
      // Default para Terreno se não encontrar
      tipo = await prisma.tipoImovel.findUnique({ where: { slug: 'terreno' } })
    }
    
    if (tipo) {
      await prisma.imovel.update({
        where: { id: imovel.id },
        data: { 
          tipoImovelId: tipo.id,
          tipoImovelNome: tipo.nome
        }
      })
      console.log(`Imóvel ${imovel.id} atualizado para tipo ${tipo.nome}`)
    }
  }
  
  console.log('Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
