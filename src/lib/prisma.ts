import { PrismaClient } from '../generated/prisma'

// PrismaClient é anexado ao namespace `global` para evitar múltiplas instâncias
// do Prisma Client em ambientes de desenvolvimento e hot-reloading

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
