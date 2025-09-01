-- CreateTable
CREATE TABLE "MensagemContato" (
    "id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "resposta" TEXT,
    "usuarioNome" TEXT NOT NULL,
    "usuarioEmail" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MensagemContato_pkey" PRIMARY KEY ("id")
);
