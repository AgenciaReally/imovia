-- CreateTable
CREATE TABLE "ImovelMetadata" (
    "id" TEXT NOT NULL,
    "imovelIdExterno" TEXT NOT NULL,
    "telefone" TEXT NOT NULL DEFAULT '',
    "observacoes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImovelMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ImovelMetadata_imovelIdExterno_key" ON "ImovelMetadata"("imovelIdExterno");
