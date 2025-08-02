import { NextResponse } from 'next/server'
import { getPrismaWaitlist } from '@/lib/prisma'

export async function GET() {
  console.log('🚀 Count API function started')
  
  try {
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

    console.log('✅ Prisma client ready - querying database...')
    
    const totalCount = await waitlist.count()
    console.log('📊 Total count result:', totalCount)
    
    // Get some additional stats
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    
    const todayCount = await waitlist.count({
      where: {
        joinedAt: {
          gte: todayStart
        }
      }
    })

    // Get referral stats
    const totalReferrals = await waitlist.count({
      where: {
        referredBy: {
          not: null
        }
      }
    })

    console.log('✅ All database queries completed successfully')

    return NextResponse.json({
      data: {
        total: totalCount,
        today: todayCount,
        referrals: totalReferrals,
        referralRate: totalCount > 0 ? Math.round((totalReferrals / totalCount) * 100) : 0,
        lastUpdated: new Date().toISOString(),
        status: 'database_connected'
      }
    })
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