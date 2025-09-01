const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function cleanupDuplicates() {
  console.log('🧹 Iniciando limpeza de duplicatas...');
  
  try {
    // 1. Buscar todas as duplicatas
    const duplicates = await prisma.$queryRaw`
      SELECT "userId", "perguntaId", COUNT(*) as count
      FROM "Resposta"
      GROUP BY "userId", "perguntaId"
      HAVING COUNT(*) > 1
    `;
    
    console.log(`🔍 Encontradas ${duplicates.length} combinações com duplicatas`);
    
    let totalRemoved = 0;
    
    // 2. Para cada grupo de duplicatas, manter apenas a mais recente
    for (const duplicate of duplicates) {
      const { userId, perguntaId, count } = duplicate;
      
      console.log(`📝 Processando userId: ${userId}, perguntaId: ${perguntaId} (${count} duplicatas)`);
      
      // Buscar todas as respostas deste grupo, ordenadas pela mais recente
      const respostas = await prisma.resposta.findMany({
        where: {
          userId: userId,
          perguntaId: perguntaId
        },
        orderBy: {
          updatedAt: 'desc' // Mais recente primeiro
        }
      });
      
      // Remover todas exceto a primeira (mais recente)
      const toRemove = respostas.slice(1);
      
      for (const resposta of toRemove) {
        await prisma.resposta.delete({
          where: { id: resposta.id }
        });
        totalRemoved++;
        console.log(`🗑️ Removida resposta ${resposta.id}`);
      }
    }
    
    console.log(`✅ Limpeza concluída! ${totalRemoved} duplicatas removidas`);
    
    // 3. Verificar se ainda há duplicatas
    const remainingDuplicates = await prisma.$queryRaw`
      SELECT "userId", "perguntaId", COUNT(*) as count
      FROM "Resposta"
      GROUP BY "userId", "perguntaId"
      HAVING COUNT(*) > 1
    `;
    
    if (remainingDuplicates.length === 0) {
      console.log('🎉 Banco limpo! Agora você pode executar: pnpm prisma db push');
    } else {
      console.log(`❌ Ainda restam ${remainingDuplicates.length} duplicatas`);
    }
    
  } catch (error) {
    console.error('❌ Erro na limpeza:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDuplicates();
