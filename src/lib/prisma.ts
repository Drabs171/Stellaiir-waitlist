import { PrismaClient } from '@prisma/client'

// Global variable to store the client
let cachedPrisma: PrismaClient | null = null

// Safe Prisma client initialization with detailed error logging
export async function getPrismaClient(): Promise<PrismaClient | null> {
  console.log('🔍 Getting Prisma client...')
  
  // Return cached client if available
  if (cachedPrisma) {
    console.log('✅ Using cached Prisma client')
    return cachedPrisma
  }

  // Check for DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.warn('❌ DATABASE_URL not found - database operations will fail')
    return null
  }

  console.log('📊 DATABASE_URL found:', process.env.DATABASE_URL?.substring(0, 30) + '...')

  try {
    console.log('🔄 Creating new Prisma client...')
    
    const client = new PrismaClient({
      log: ['error', 'warn'],
      errorFormat: 'pretty'
    })

    console.log('✅ Prisma client created successfully')

    // Test the connection
    console.log('🔄 Testing database connection...')
    await client.$connect()
    console.log('✅ Database connection successful')

    // Cache the client
    cachedPrisma = client
    return client

  } catch (error) {
    console.error('❌ Prisma client initialization failed:', error)
    const err = error as Error
    console.error('❌ Error name:', err?.name)
    console.error('❌ Error message:', err?.message)
    console.error('❌ Error stack:', err?.stack)
    return null
  }
}

// Wrapper functions for common operations
export async function getPrismaWaitlist() {
  const client = await getPrismaClient()
  return client?.waitlist || null
}

// Legacy export for compatibility (but this is what was causing crashes)
export const prisma = new Proxy({} as any, {
  get(target, prop) {
    throw new Error(`Direct prisma access not allowed. Use getPrismaClient() instead. Attempted to access: ${String(prop)}`)
  }
})