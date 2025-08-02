import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getPrismaWaitlist } from '@/lib/prisma'
import { emailTracker } from '@/lib/email-tracker'

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth()

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    // Calculate date ranges
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thisWeek = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000))
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Get basic statistics
    const [
      totalSignups,
      signupsToday,
      signupsThisWeek,
      signupsThisMonth,
      topReferrers,
      emailStats,
      activeSubscribers,
      unsubscribeCount
    ] = await Promise.all([
      (async () => {
        const waitlist = await getPrismaWaitlist()
        return waitlist ? waitlist.count() : 0
      })(),
      (async () => {
        const waitlist = await getPrismaWaitlist()
        return waitlist ? waitlist.count({ where: { joinedAt: { gte: today } } }) : 0
      })(),
      (async () => {
        const waitlist = await getPrismaWaitlist()
        return waitlist ? waitlist.count({ where: { joinedAt: { gte: thisWeek } } }) : 0
      })(),
      (async () => {
        const waitlist = await getPrismaWaitlist()
        return waitlist ? waitlist.count({ where: { joinedAt: { gte: thisMonth } } }) : 0
      })(),
      emailTracker.getTopReferrers(10, days),
      emailTracker.getEmailStats(days),
      emailTracker.getActiveSubscribers(),
      (async () => {
        const waitlist = await getPrismaWaitlist()
        return waitlist ? waitlist.count({ where: { unsubscribed: true } }) : 0
      })()
    ])

    // Get signup trend data for chart
    const signupTrend = await getSignupTrend(days)

    // Process email stats
    const processedEmailStats = {
      welcome: { sent: 0, failed: 0 },
      milestone: { sent: 0, failed: 0 },
      admin: { sent: 0, failed: 0 }
    }

    emailStats.forEach(stat => {
      const type = stat.emailType as keyof typeof processedEmailStats
      if (type in processedEmailStats) {
        if (stat.success) {
          processedEmailStats[type].sent = stat._count.id
        } else {
          processedEmailStats[type].failed = stat._count.id
        }
      }
    })

    const totalEmailsSent = Object.values(processedEmailStats).reduce((sum, type) => sum + type.sent, 0)
    const totalEmailsFailed = Object.values(processedEmailStats).reduce((sum, type) => sum + type.failed, 0)
    const emailSuccessRate = totalEmailsSent + totalEmailsFailed > 0 
      ? ((totalEmailsSent / (totalEmailsSent + totalEmailsFailed)) * 100).toFixed(2)
      : '0'

    // Get referral statistics
    const referralStats = await getReferralStats()

    return NextResponse.json({
      overview: {
        totalSignups,
        signupsToday,
        signupsThisWeek,
        signupsThisMonth,
        activeSubscribers,
        unsubscribeCount,
        unsubscribeRate: totalSignups > 0 ? ((unsubscribeCount / totalSignups) * 100).toFixed(2) + '%' : '0%'
      },
      emails: {
        totalSent: totalEmailsSent,
        totalFailed: totalEmailsFailed,
        successRate: emailSuccessRate + '%',
        byType: processedEmailStats
      },
      referrals: referralStats,
      topReferrers,
      signupTrend,
      period: `Last ${days} days`
    })

  } catch (error) {
    console.error('Admin stats error:', error)
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}

async function getSignupTrend(days: number) {
  const now = new Date()
  const trend = []

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000))
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const endOfDay = new Date(startOfDay.getTime() + (24 * 60 * 60 * 1000))

    const count = await prisma.waitlist.count({
      where: {
        joinedAt: {
          gte: startOfDay,
          lt: endOfDay
        }
      }
    })

    trend.push({
      date: startOfDay.toISOString().split('T')[0],
      signups: count
    })
  }

  return trend
}

async function getReferralStats() {
  const [
    totalReferrals,
    usersWithReferrals,
    avgReferralsPerUser
  ] = await Promise.all([
    prisma.waitlist.count({
      where: { referredBy: { not: null } }
    }),
    prisma.waitlist.count({
      where: {
        referrals: {
          some: {}
        }
      }
    }),
    prisma.waitlist.aggregate({
      _avg: {
        position: true
      },
      where: {
        referrals: {
          some: {}
        }
      }
    })
  ])

  // Get referral conversion rate (users who referred others vs total users)
  const totalUsers = await prisma.waitlist.count()
  const conversionRate = totalUsers > 0 ? ((usersWithReferrals / totalUsers) * 100).toFixed(2) + '%' : '0%'

  return {
    totalReferrals,
    usersWithReferrals,
    conversionRate,
    avgReferralsPerUser: avgReferralsPerUser._avg.position?.toFixed(1) || '0'
  }
}