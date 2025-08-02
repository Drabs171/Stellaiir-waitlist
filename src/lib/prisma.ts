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
      get: (target, prop) => {
        if (prop === 'waitlist') {
          return {
            count: () => Promise.resolve(0),
            findUnique: () => Promise.resolve(null),
            findMany: () => Promise.resolve([]),
            create: () => Promise.reject(new Error('Database not connected')),
            update: () => Promise.reject(new Error('Database not connected')),
            delete: () => Promise.reject(new Error('Database not connected'))
          }
        }
        return () => Promise.resolve(null)
      }
    })
  }
  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma