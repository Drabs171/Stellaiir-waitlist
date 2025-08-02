import { NextRequest, NextResponse } from 'next/server'
import { emailService, createReferralUrl } from '@/lib/email'
import { emailTracker } from '@/lib/email-tracker'
import { getPrismaWaitlist } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { emailType, recipientEmail } = await request.json()

    if (!emailType || !recipientEmail) {
      return NextResponse.json(
        { error: 'emailType and recipientEmail are required' },
        { status: 400 }
      )
    }

    // Validate email type
    if (!['welcome', 'milestone', 'admin'].includes(emailType)) {
      return NextResponse.json(
        { error: 'Invalid emailType. Must be: welcome, milestone, or admin' },
        { status: 400 }
      )
    }

    let result

    const waitlist = await getPrismaWaitlist()
    if (!waitlist) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    switch (emailType) {
      case 'welcome':
        // Find user data for welcome email
        const user = await waitlist.findUnique({
          where: { email: recipientEmail }
        })

        if (!user) {
          return NextResponse.json(
            { error: 'User not found in waitlist' },
            { status: 404 }
          )
        }

        const referralUrl = createReferralUrl(user.referralCode)
        
        result = await emailService.sendWelcomeEmail({
          email: user.email,
          position: user.position,
          referralCode: user.referralCode,
          referralUrl: referralUrl,
          joinedAt: user.joinedAt.toISOString(),
        })

        // Log the email
        await emailTracker.logEmail({
          recipientEmail: user.email,
          emailType: 'welcome',
          success: true,
          waitlistId: user.id
        })
        break

      case 'milestone':
        // Send test milestone email
        const totalUsers = await waitlist.count()
        const testUser = await waitlist.findUnique({
          where: { email: recipientEmail }
        })

        if (!testUser) {
          return NextResponse.json(
            { error: 'User not found in waitlist' },
            { status: 404 }
          )
        }

        result = await emailService.sendMilestoneEmail({
          milestone: 1000, // Test milestone
          totalUsers: totalUsers,
          userPosition: testUser.position,
          email: recipientEmail
        })

        await emailTracker.logEmail({
          recipientEmail: recipientEmail,
          emailType: 'milestone',
          success: true,
          waitlistId: testUser.id
        })
        break

      case 'admin':
        // Send test admin notification
        const recentSignups = await emailTracker.getRecentSignups(7)
        const topReferrers = await emailTracker.getTopReferrers(5)
        const totalSignups = await waitlist.count()

        result = await emailService.sendAdminNotification([recipientEmail], {
          totalSignups,
          recentSignups,
          topReferrers,
          timeframe: '7 days'
        })

        await emailTracker.logEmail({
          recipientEmail: recipientEmail,
          emailType: 'admin',
          success: true
        })
        break
    }

    return NextResponse.json({
      message: `Test ${emailType} email sent successfully`,
      data: result
    })

  } catch (error) {
    console.error('Test email send error:', error)
    
    // Log the failed email attempt
    const { emailType, recipientEmail } = await request.json().catch(() => ({}))
    
    if (emailType && recipientEmail) {
      await emailTracker.logEmail({
        recipientEmail,
        emailType: emailType as 'welcome' | 'milestone' | 'admin',
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      }).catch(console.error)
    }

    return NextResponse.json(
      { 
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}