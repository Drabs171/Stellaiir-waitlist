import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🚀 Count API function started')
    console.log('🚀 Environment check:', {
      nodeEnv: process.env.NODE_ENV,
      hasDB: !!process.env.DATABASE_URL,
      dbPreview: process.env.DATABASE_URL?.substring(0, 20)
    })

    // Get current date for today's signups
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Fetch all required data
    const [
      totalCount,
      todayCount,
      totalReferrals,
    ] = await Promise.all([
      prisma.waitlist.count(),
      prisma.waitlist.count({
        where: {
          joinedAt: {
            gte: today,
            lt: tomorrow
          }
        }
      }),
      prisma.waitlist.count({
        where: {
          referredBy: {
            not: null
          }
        }
      })
    ])

    // Calculate referral rate
    const referralRate = totalCount > 0 ? Math.round((totalReferrals / totalCount) * 100) : 0

    const data = {
      total: totalCount,
      today: todayCount,
      referrals: totalReferrals,
      referralRate: referralRate,
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json({ data })

  } catch (error) {
    console.error('❌ Count API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch waitlist count' },
      { status: 500 }
    )
  }
}