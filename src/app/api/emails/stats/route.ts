import { NextRequest, NextResponse } from 'next/server'
import { emailTracker } from '@/lib/email-tracker'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7')

    // Get email statistics
    const [stats, failedEmails, activeSubscribers] = await Promise.all([
      emailTracker.getEmailStats(days),
      emailTracker.getFailedEmails(10),
      emailTracker.getActiveSubscribers()
    ])

    // Process stats into a more readable format
    const processedStats = {
      welcome: { sent: 0, failed: 0 },
      milestone: { sent: 0, failed: 0 },
      admin: { sent: 0, failed: 0 }
    }

    stats.forEach(stat => {
      const type = stat.emailType as keyof typeof processedStats
      if (type in processedStats) {
        if (stat.success) {
          processedStats[type].sent = stat._count.id
        } else {
          processedStats[type].failed = stat._count.id
        }
      }
    })

    const totalSent = Object.values(processedStats).reduce((sum, type) => sum + type.sent, 0)
    const totalFailed = Object.values(processedStats).reduce((sum, type) => sum + type.failed, 0)
    const successRate = totalSent + totalFailed > 0 ? (totalSent / (totalSent + totalFailed) * 100).toFixed(2) : '0'

    return NextResponse.json({
      period: `${days} days`,
      summary: {
        totalSent,
        totalFailed,
        successRate: `${successRate}%`,
        activeSubscribers
      },
      byType: processedStats,
      recentFailures: failedEmails.map(email => ({
        id: email.id,
        recipientEmail: email.recipientEmail,
        emailType: email.emailType,
        sentAt: email.sentAt,
        errorMessage: email.errorMessage,
        waitlistPosition: email.waitlistEntry?.position
      }))
    })
  } catch (error) {
    console.error('Email stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch email statistics' },
      { status: 500 }
    )
  }
}