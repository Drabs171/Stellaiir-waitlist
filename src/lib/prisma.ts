import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create a mock Prisma client for build time when DATABASE_URL is not available
const createPrismaClient = () => {
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not found. Using mock Prisma client for build.')
    // Return a mock client that won't actually connect to a database
    return new Proxy({} as PrismaClient, {
      get: () => {
        return () => Promise.resolve([])
      }
    })
  }
  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma