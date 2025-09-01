-- AlterTable
ALTER TABLE "Pergunta" ADD COLUMN     "configuracaoId" TEXT;

-- CreateTable
CREATE TABLE "ConfiguracaoPergunta" (
    "id" TEXT NOT NULL,
    "limitePergunta" INTEGER NOT NULL DEFAULT 10,
    "intensidade" INTEGER NOT NULL DEFAULT 70,
    "instrucoesAvancadas" TEXT,
    "modeloIA" TEXT NOT NULL DEFAULT 'deepseek-r1',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConfiguracaoPergunta_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pergunta" ADD CONSTRAINT "Pergunta_configuracaoId_fkey" FOREIGN KEY ("configuracaoId") REFERENCES "ConfiguracaoPergunta"("id") ON DELETE SET NULL ON UPDATE CASCADE;
