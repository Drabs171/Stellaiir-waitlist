import { getPrismaClient } from './prisma'

// Characters that are easy to read and type (excluding confusing ones like 0, O, I, l, 1)
const REFERRAL_CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
const REFERRAL_CODE_LENGTH = 8
const MAX_COLLISION_RETRIES = 10

export function generateReferralCode(): string {
  let code = ''
  for (let i = 0; i < REFERRAL_CODE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * REFERRAL_CODE_CHARS.length)
    code += REFERRAL_CODE_CHARS[randomIndex]
  }
  return code
}

export async function generateUniqueReferralCode(): Promise<string> {
  let attempts = 0
  
  while (attempts < MAX_COLLISION_RETRIES) {
    const code = generateReferralCode()
    
    // Check if code already exists
    const prisma = await getPrismaClient()
    if (!prisma) {
      throw new Error('Database connection not available')
    }
    
    const existingEntry = await prisma.waitlist.findUnique({
      where: { referralCode: code }
    })
    
    if (!existingEntry) {
      return code
    }
    
    attempts++
  }
  
  // If we still have collisions after max retries, fall back to timestamp-based code
  const timestamp = Date.now().toString(36).toUpperCase()
  const randomSuffix = generateReferralCode().substring(0, 3)
  return `${timestamp}${randomSuffix}`.substring(0, REFERRAL_CODE_LENGTH)
}

export async function validateReferralCode(code: string): Promise<boolean> {
  if (!code || typeof code !== 'string') {
    return false
  }
  
  // Check format
  if (code.length !== REFERRAL_CODE_LENGTH) {
    return false
  }
  
  // Check if it contains only valid characters
  const validCodeRegex = new RegExp(`^[${REFERRAL_CODE_CHARS}]+$`)
  if (!validCodeRegex.test(code)) {
    return false
  }
  
  // Check if code exists in database
  const prisma = await getPrismaClient()
  if (!prisma) {
    throw new Error('Database connection not available')
  }
  
  const entry = await prisma.waitlist.findUnique({
    where: { referralCode: code }
  })
  
  return !!entry
}

export async function getReferralStats(referralCode: string) {
  const prisma = await getPrismaClient()
  if (!prisma) {
    throw new Error('Database connection not available')
  }
  
  const entry = await prisma.waitlist.findUnique({
    where: { referralCode },
    include: {
      referrals: {
        select: {
          id: true,
          email: true,
          joinedAt: true,
          position: true
        },
        orderBy: {
          joinedAt: 'desc'
        }
      }
    }
  })
  
  if (!entry) {
    return null
  }
  
  return {
    referralCode: entry.referralCode,
    totalReferrals: entry.referrals.length,
    referrals: entry.referrals,
    userPosition: entry.position,
    joinedAt: entry.joinedAt
  }
}

export async function getTopReferrers(limit: number = 10) {
  const prisma = await getPrismaClient()
  if (!prisma) {
    throw new Error('Database connection not available')
  }
  
  const topReferrers = await prisma.waitlist.findMany({
    include: {
      _count: {
        select: {
          referrals: true
        }
      }
    },
    orderBy: {
      referrals: {
        _count: 'desc'
      }
    },
    take: limit,
    where: {
      referrals: {
        some: {}
      }
    }
  })
  
  return topReferrers.map((entry: { referralCode: string; _count: { referrals: number }; position: number; joinedAt: Date }) => ({
    referralCode: entry.referralCode,
    referralCount: entry._count.referrals,
    position: entry.position,
    joinedAt: entry.joinedAt
  }))
}