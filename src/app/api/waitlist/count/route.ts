import { NextResponse } from 'next/server'
import { getPrismaWaitlist } from '@/lib/prisma'

// Simple in-memory cache
interface CountData {
  total: number
  today: number
  referrals: number
  referralRate: number
  lastUpdated: string
  status: string
}

interface CacheEntry {
  data: CountData
  timestamp: number
}

const cache = new Map<string, CacheEntry>()
const CACHE_TTL = 30 * 1000 // 30 seconds

function getCachedData(key: string) {
  const entry = cache.get(key)
  if (!entry) return null
  
  const now = Date.now()
  if (now - entry.timestamp > CACHE_TTL) {
    cache.delete(key)
    return null
  }
  
  return entry.data
}

function setCachedData(key: string, data: CountData) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  })
}

export async function GET() {
  console.log('🚀 Count API function started')
  
  try {
    // Check cache first
    const cacheKey = 'waitlist_count'
    const cachedData = getCachedData(cacheKey)
    if (cachedData) {
      console.log('⚡ Returning cached data')
      return NextResponse.json({ data: cachedData })
    }
    
    console.log('📊 DATABASE_URL exists:', !!process.env.DATABASE_URL)
    console.log('📊 Getting Prisma waitlist client...')
    
    const waitlist = await getPrismaWaitlist()
    
    if (!waitlist) {
      console.log('⚠️ Database not available - returning placeholder data')
      return NextResponse.json({
        data: {
          total: 0,
          today: 0,
          referrals: 0,
          referralRate: 0,
          lastUpdated: new Date().toISOString(),
          status: 'database_unavailable'
        }
      })
    }

    console.log('✅ Prisma client ready - querying database with single aggregation...')
    
    // Get today's start timestamp
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    
    // Single aggregation query to get all stats at once
    const [totalStats, todayStats, referralStats] = await Promise.all([
      // Total count
      waitlist.count(),
      // Today's signups
      waitlist.count({
        where: {
          joinedAt: {
            gte: todayStart
          }
        }
      }),
      // Referral count
      waitlist.count({
        where: {
          referredBy: {
            not: null
          }
        }
      })
    ])

    console.log('📊 Query results - Total:', totalStats, 'Today:', todayStats, 'Referrals:', referralStats)
    console.log('✅ All database queries completed successfully')

    const responseData = {
      total: totalStats,
      today: todayStats,
      referrals: referralStats,
      referralRate: totalStats > 0 ? Math.round((referralStats / totalStats) * 100) : 0,
      lastUpdated: new Date().toISOString(),
      status: 'database_connected'
    }

    // Cache the response
    setCachedData(cacheKey, responseData)
    console.log('💾 Data cached for 30 seconds')

    return NextResponse.json({ data: responseData })
  } catch (error) {
    console.error('❌ Waitlist count API error:', error)
    const err = error as Error
    console.error('❌ Error name:', err?.name)
    console.error('❌ Error message:', err?.message)
    console.error('❌ Error stack:', err?.stack)
    
    return NextResponse.json(
      { error: 'Failed to fetch waitlist count', details: err?.message },
      { status: 500 }
    )
  }
}