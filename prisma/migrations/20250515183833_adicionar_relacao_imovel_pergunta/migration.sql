-- CreateTable
CREATE TABLE "ImovelPergunta" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imovelId" TEXT NOT NULL,
    "perguntaId" TEXT NOT NULL,

    CONSTRAINT "ImovelPergunta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ImovelPergunta_imovelId_perguntaId_key" ON "ImovelPergunta"("imovelId", "perguntaId");

-- AddForeignKey
ALTER TABLE "ImovelPergunta" ADD CONSTRAINT "ImovelPergunta_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImovelPergunta" ADD CONSTRAINT "ImovelPergunta_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "Pergunta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
