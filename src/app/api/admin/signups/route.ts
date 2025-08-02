import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getPrismaWaitlist } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const hasReferrals = searchParams.get('hasReferrals')
    const isReferred = searchParams.get('isReferred')
    const emailSent = searchParams.get('emailSent')
    const unsubscribed = searchParams.get('unsubscribed')

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: Record<string, any> = {}

    // Search by email
    if (search) {
      whereClause.email = {
        contains: search,
        mode: 'insensitive'
      }
    }

    // Date range filter
    if (startDate || endDate) {
      whereClause.joinedAt = {}
      if (startDate) {
        whereClause.joinedAt.gte = new Date(startDate)
      }
      if (endDate) {
        whereClause.joinedAt.lte = new Date(endDate + 'T23:59:59.999Z')
      }
    }

    // Filter by referral status
    if (hasReferrals === 'true') {
      whereClause.referrals = {
        some: {}
      }
    } else if (hasReferrals === 'false') {
      whereClause.referrals = {
        none: {}
      }
    }

    // Filter by referred status
    if (isReferred === 'true') {
      whereClause.referredBy = {
        not: null
      }
    } else if (isReferred === 'false') {
      whereClause.referredBy = null
    }

    // Filter by email sent status
    if (emailSent === 'true') {
      whereClause.emailSent = true
    } else if (emailSent === 'false') {
      whereClause.emailSent = false
    }

    // Filter by unsubscribed status
    if (unsubscribed === 'true') {
      whereClause.unsubscribed = true
    } else if (unsubscribed === 'false') {
      whereClause.unsubscribed = false
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get data and total count
    const waitlist = await getPrismaWaitlist()
    if (!waitlist) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }
    
    const [signups, totalCount] = await Promise.all([
      waitlist.findMany({
        where: whereClause,
        include: {
          referrer: {
            select: {
              email: true,
              referralCode: true
            }
          },
          _count: {
            select: {
              referrals: true
            }
          }
        },
        orderBy: {
          joinedAt: 'desc'
        },
        skip,
        take: limit
      }),
      waitlist.count({
        where: whereClause
      })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      data: signups.map(entry => ({
        id: entry.id,
        email: entry.email,
        position: entry.position,
        referralCode: entry.referralCode,
        referralCount: entry._count.referrals,
        referredBy: entry.referrer ? {
          email: entry.referrer.email,
          referralCode: entry.referrer.referralCode
        } : null,
        joinedAt: entry.joinedAt.toISOString(),
        emailSent: entry.emailSent,
        lastEmailSent: entry.lastEmailSent?.toISOString() || null,
        emailFailures: entry.emailFailures,
        unsubscribed: entry.unsubscribed,
        metadata: entry.metadata ? JSON.parse(entry.metadata) : null
      })),
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      filters: {
        search,
        startDate,
        endDate,
        hasReferrals,
        isReferred,
        emailSent,
        unsubscribed
      }
    })

  } catch (error) {
    console.error('Admin signups error:', error)
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch signups' },
      { status: 500 }
    )
  }
}