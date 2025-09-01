-- AlterTable
ALTER TABLE "Imovel" ADD COLUMN     "caracteristicasArray" TEXT[],
ADD COLUMN     "destaque" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fotoPrincipal" TEXT,
ADD COLUMN     "galeriaFotos" TEXT[],
ADD COLUMN     "status" TEXT,
ADD COLUMN     "tipoImovel" TEXT;
