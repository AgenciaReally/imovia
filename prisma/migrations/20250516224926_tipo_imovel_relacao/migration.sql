/*
  Warnings:

  - You are about to drop the column `tipoImovel` on the `Imovel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Imovel" DROP COLUMN "tipoImovel",
ADD COLUMN     "tipoImovelId" TEXT,
ADD COLUMN     "tipoImovelNome" TEXT;

-- CreateTable
CREATE TABLE "TipoImovel" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descricao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TipoImovel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TipoImovel_nome_key" ON "TipoImovel"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "TipoImovel_slug_key" ON "TipoImovel"("slug");

-- AddForeignKey
ALTER TABLE "Imovel" ADD CONSTRAINT "Imovel_tipoImovelId_fkey" FOREIGN KEY ("tipoImovelId") REFERENCES "TipoImovel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
