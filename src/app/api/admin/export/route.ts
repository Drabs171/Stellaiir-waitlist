import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getPrismaWaitlist } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth()

    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'csv'
    const includeUnsubscribed = searchParams.get('includeUnsubscribed') === 'true'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: Record<string, any> = {}
    
    if (!includeUnsubscribed) {
      whereClause.unsubscribed = false
    }

    if (startDate || endDate) {
      whereClause.joinedAt = {}
      if (startDate) {
        whereClause.joinedAt.gte = new Date(startDate)
      }
      if (endDate) {
        whereClause.joinedAt.lte = new Date(endDate)
      }
    }

    // Get waitlist data
    const waitlist = await getPrismaWaitlist()
    if (!waitlist) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }
    
    const waitlistData = await waitlist.findMany({
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
        position: 'asc'
      }
    })

    if (format === 'json') {
      return NextResponse.json({
        data: waitlistData.map(entry => ({
          id: entry.id,
          email: entry.email,
          position: entry.position,
          referralCode: entry.referralCode,
          referralCount: entry._count.referrals,
          referredBy: entry.referrer?.email || null,
          referredByCode: entry.referrer?.referralCode || null,
          joinedAt: entry.joinedAt.toISOString(),
          emailSent: entry.emailSent,
          lastEmailSent: entry.lastEmailSent?.toISOString() || null,
          emailFailures: entry.emailFailures,
          unsubscribed: entry.unsubscribed,
          metadata: entry.metadata
        })),
        total: waitlistData.length,
        exportedAt: new Date().toISOString()
      })
    }

    // CSV format
    const csvHeader = [
      'Position',
      'Email',
      'Referral Code',
      'Referral Count',
      'Referred By Email',
      'Referred By Code',
      'Joined At',
      'Email Sent',
      'Last Email Sent',
      'Email Failures',
      'Unsubscribed',
      'Metadata'
    ].join(',')

    const csvRows = waitlistData.map(entry => [
      entry.position,
      entry.email,
      entry.referralCode,
      entry._count.referrals,
      entry.referrer?.email || '',
      entry.referrer?.referralCode || '',
      entry.joinedAt.toISOString(),
      entry.emailSent,
      entry.lastEmailSent?.toISOString() || '',
      entry.emailFailures,
      entry.unsubscribed,
      entry.metadata || ''
    ].map(field => {
      // Escape CSV fields that contain commas or quotes
      const stringField = String(field)
      if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
        return `"${stringField.replace(/"/g, '""')}"`
      }
      return stringField
    }).join(','))

    const csvContent = [csvHeader, ...csvRows].join('\n')

    const filename = `waitlist-export-${new Date().toISOString().split('T')[0]}.csv`

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })

  } catch (error) {
    console.error('Admin export error:', error)
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}