import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const totalCount = await prisma.waitlist.count()
    
    // Get some additional stats
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    
    const todayCount = await prisma.waitlist.count({
      where: {
        joinedAt: {
          gte: todayStart
        }
      }
    })

    // Get referral stats
    const totalReferrals = await prisma.waitlist.count({
      where: {
        referredBy: {
          not: null
        }
      }
    })

    return NextResponse.json({
      data: {
        total: totalCount,
        today: todayCount,
        referrals: totalReferrals,
        referralRate: totalCount > 0 ? Math.round((totalReferrals / totalCount) * 100) : 0,
        lastUpdated: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Waitlist count API error:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch waitlist count' },
      { status: 500 }
    )
  }
}