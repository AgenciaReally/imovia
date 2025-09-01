-- AlterTable
ALTER TABLE "ImovelMetadata" ADD COLUMN     "construtoraId" TEXT;

-- AddForeignKey
ALTER TABLE "ImovelMetadata" ADD CONSTRAINT "ImovelMetadata_construtoraId_fkey" FOREIGN KEY ("construtoraId") REFERENCES "Construtora"("id") ON DELETE SET NULL ON UPDATE CASCADE;
