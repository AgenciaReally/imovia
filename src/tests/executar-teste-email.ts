// Script para executar o teste de email de redefinição de senha
import { testarEnvioEmailRedefinicao } from './teste-email-redefinicao';

// Executar o teste
(async () => {
  console.log('Iniciando teste de envio de email de redefinição de senha...');
  
  try {
    await testarEnvioEmailRedefinicao();
    console.log('Teste concluído com sucesso!');
    process.exit(0);
  } catch (erro) {
    console.error('Falha no teste:', erro);
    process.exit(1);
  }
})();
