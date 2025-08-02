import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  console.log('🚀 Count API function started')
  
  try {
    console.log('📊 Count API: DATABASE_URL exists:', !!process.env.DATABASE_URL)
    console.log('📊 Count API: DATABASE_URL preview:', process.env.DATABASE_URL?.substring(0, 30) + '...')
    console.log('📊 Count API: Prisma client type:', typeof prisma)
    
    console.log('📊 About to call prisma.waitlist.count()')
    const totalCount = await prisma.waitlist.count()
    console.log('📊 Total count result:', totalCount)
    
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
    console.error('❌ Waitlist count API error:', error)
    console.error('❌ Error name:', error?.name)
    console.error('❌ Error message:', error?.message)
    console.error('❌ Error stack:', error?.stack)
    
    return NextResponse.json(
      { error: 'Failed to fetch waitlist count', details: error?.message },
      { status: 500 }
    )
  }
}