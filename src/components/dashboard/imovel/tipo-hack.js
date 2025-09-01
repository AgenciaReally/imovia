// Hack temporário para forçar o tipo de imóvel no banco de dados
// Este script deve ser executado diretamente no banco para corrigir todos os imóveis

/**
 * Função para definir manualmente o tipo de todos os imóveis como "Terreno"
 * Isso é um contorno temporário enquanto investigamos o problema
 */
export async function fixarTipoImoveis() {
  // Código para ser executado diretamente no prisma studio ou via API
  
  // Exemplo de como forçar todos os imóveis para um tipo específico:
  // await prisma.imovel.updateMany({
  //   data: {
  //     tipoImovel: "Terreno"
  //   }
  // });
  
  console.log("Executar esta função para corrigir os tipos");
}

/**
 * SOLUÇÃO DE CONTORNO TEMPORÁRIA:
 * 
 * 1. Para resolver o problema temporariamente, edite MANUALMENTE o banco via Prisma Studio:
 *    - Execute: npx prisma studio
 *    - Abra a tabela de imóveis
 *    - Defina explicitamente o campo tipoImovel para cada imóvel
 * 
 * 2. Ou use este comando direto no terminal para forçar todos para Terreno:
 *    - npx prisma db execute --stdin < update_tipos.sql
 * 
 * 3. Conteúdo para o arquivo update_tipos.sql:
 *    UPDATE "Imovel" SET "tipoImovel" = 'Terreno';
 */
