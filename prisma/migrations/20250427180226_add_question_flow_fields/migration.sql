/*
  Warnings:

  - Added the required column `categoria` to the `Pergunta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fluxo` to the `Pergunta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pergunta" ADD COLUMN     "ativa" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "categoria" TEXT NOT NULL,
ADD COLUMN     "fluxo" TEXT NOT NULL,
ADD COLUMN     "pontuacao" INTEGER NOT NULL DEFAULT 1;
