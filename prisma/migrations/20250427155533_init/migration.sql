-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'CONSTRUTORA', 'CLIENTE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CLIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "construtoraId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Construtora" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Construtora_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Imovel" (
    "id" TEXT NOT NULL,
    "idExternoAPI" TEXT,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "area" DOUBLE PRECISION NOT NULL,
    "quartos" INTEGER NOT NULL,
    "banheiros" INTEGER NOT NULL,
    "vagas" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "telefoneContato" TEXT,
    "endereco" TEXT NOT NULL,
    "caracteristicas" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "construtoraId" TEXT NOT NULL,

    CONSTRAINT "Imovel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pergunta" (
    "id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "opcoes" JSONB,
    "ordem" INTEGER NOT NULL,
    "obrigatoria" BOOLEAN NOT NULL DEFAULT true,
    "condicional" JSONB,
    "geradaPorIA" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pergunta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resposta" (
    "id" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "perguntaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Resposta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "porcentagem" DOUBLE PRECISION NOT NULL,
    "posicaoRanking" INTEGER NOT NULL,
    "destaque" BOOLEAN NOT NULL DEFAULT false,
    "criterios" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imovelId" TEXT NOT NULL,
    "relatorioId" TEXT,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relatorio" (
    "id" TEXT NOT NULL,
    "resumo" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Relatorio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Configuracao" (
    "id" TEXT NOT NULL,
    "chave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "descricao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Configuracao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogIntegracao" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "request" JSONB,
    "response" JSONB,
    "erro" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LogIntegracao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Construtora_cnpj_key" ON "Construtora"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Construtora_email_key" ON "Construtora"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Imovel_idExternoAPI_key" ON "Imovel"("idExternoAPI");

-- CreateIndex
CREATE UNIQUE INDEX "Configuracao_chave_key" ON "Configuracao"("chave");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_construtoraId_fkey" FOREIGN KEY ("construtoraId") REFERENCES "Construtora"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imovel" ADD CONSTRAINT "Imovel_construtoraId_fkey" FOREIGN KEY ("construtoraId") REFERENCES "Construtora"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resposta" ADD CONSTRAINT "Resposta_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "Pergunta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resposta" ADD CONSTRAINT "Resposta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_relatorioId_fkey" FOREIGN KEY ("relatorioId") REFERENCES "Relatorio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relatorio" ADD CONSTRAINT "Relatorio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
