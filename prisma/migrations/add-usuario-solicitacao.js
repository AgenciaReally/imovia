// Script para criar migração do Prisma
// Modelos Usuario e SolicitacaoRelatorio

// Essas alterações devem ser feitas diretamente no schema.prisma
// Adicionar antes do modelo MensagemContato:

/*
// Modelo para usuários do site (diferentes dos administradores)
model Usuario {
  id                 String               @id @default(cuid())
  nome               String?
  email              String?
  telefone           String?
  createdAt          DateTime             @default(now())
  updatedAt          DateTime             @updatedAt
  
  // Relações
  respostas          Resposta[]
  solicitacoesRelatorio SolicitacaoRelatorio[]
}

// Modelo para solicitações de relatório
model SolicitacaoRelatorio {
  id                 String               @id @default(cuid())
  status             String               @default("PENDENTE") // "PENDENTE", "ENVIADO", "FALHA"
  createdAt          DateTime             @default(now())
  updatedAt          DateTime             @updatedAt
  
  // Relações
  usuarioId          String
  usuario            Usuario              @relation(fields: [usuarioId], references: [id])
}
*/

console.log(`
Para adicionar os modelos Usuario e SolicitacaoRelatorio ao seu schema:

1. Abra o arquivo prisma/schema.prisma
2. Adicione os seguintes modelos antes do modelo MensagemContato:

// Modelo para usuários do site (diferentes dos administradores)
model Usuario {
  id                 String               @id @default(cuid())
  nome               String?
  email              String?
  telefone           String?
  createdAt          DateTime             @default(now())
  updatedAt          DateTime             @updatedAt
  
  // Relações
  respostas          Resposta[]
  solicitacoesRelatorio SolicitacaoRelatorio[]
}

// Modelo para solicitações de relatório
model SolicitacaoRelatorio {
  id                 String               @id @default(cuid())
  status             String               @default("PENDENTE") // "PENDENTE", "ENVIADO", "FALHA"
  createdAt          DateTime             @default(now())
  updatedAt          DateTime             @updatedAt
  
  // Relações
  usuarioId          String
  usuario            Usuario              @relation(fields: [usuarioId], references: [id])
}

3. Execute o comando: yarn prisma migrate dev --name add_usuario_solicitacao
4. Execute o comando: yarn prisma generate

Isso criará os novos modelos e atualizará o cliente Prisma.
`);
