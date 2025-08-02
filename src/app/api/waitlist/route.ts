import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { waitlistSchema } from '@/lib/validations'
import { checkRateLimit, getClientIP } from '@/lib/rate-limit'
import { generateUniqueReferralCode, validateReferralCode } from '@/lib/referral'
import { emailService, createReferralUrl } from '@/lib/email'
import { emailTracker } from '@/lib/email-tracker'
import { ZodError } from 'zod'

// CAPTCHA verification function
async function verifyCaptcha(token: string): Promise<boolean> {
  if (!token) return false
  
  const secretKey = process.env.HCAPTCHA_SECRET_KEY
  if (!secretKey) {
    console.error('HCAPTCHA_SECRET_KEY not configured')
    return false
  }

  try {
    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    })

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error('CAPTCHA verification error:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    
    // Check rate limiting with enhanced fingerprinting
    const rateLimitResult = checkRateLimit(ip, request)
    if (!rateLimitResult.allowed) {
      const headers: Record<string, string> = {}
      if (rateLimitResult.retryAfter) {
        headers['Retry-After'] = rateLimitResult.retryAfter.toString()
      }
      
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          retryAfter: rateLimitResult.retryAfter 
        },
        { status: 429, headers }
      )
    }

    const body = await request.json()
    
    // Verify CAPTCHA token
    const captchaToken = body.captchaToken
    if (!captchaToken) {
      return NextResponse.json(
        { error: 'CAPTCHA verification required.' },
        { status: 400 }
      )
    }

    const isCaptchaValid = await verifyCaptcha(captchaToken)
    if (!isCaptchaValid) {
      return NextResponse.json(
        { error: 'CAPTCHA verification failed. Please try again.' },
        { status: 400 }
      )
    }
    
    // Collect metadata
    const userAgent = request.headers.get('user-agent') || undefined
    const referer = request.headers.get('referer') || undefined
    const timestamp = new Date().toISOString()
    
    const requestData = {
      ...body,
      metadata: {
        ...body.metadata,
        userAgent,
        referrer: referer,
        timestamp,
        source: body.metadata?.source || 'landing_page'
      }
    }

    // Remove captchaToken from validation data
    const { captchaToken: _, ...validationData } = requestData
    const { email, referralCode, metadata } = waitlistSchema.parse(validationData)

    // Check if email already exists
    const existingEntry = await prisma.waitlist.findUnique({
      where: { email }
    })

    if (existingEntry) {
      return NextResponse.json(
        { 
          error: 'This email is already on the waitlist.',
          referralCode: existingEntry.referralCode,
          position: existingEntry.position
        },
        { status: 409 }
      )
    }

    // Validate referral code if provided
    let referrerId: string | null = null
    if (referralCode) {
      const isValidReferral = await validateReferralCode(referralCode)
      if (!isValidReferral) {
        return NextResponse.json(
          { error: 'Invalid referral code.' },
          { status: 400 }
        )
      }
      
      // Get referrer ID
      const referrer = await prisma.waitlist.findUnique({
        where: { referralCode },
        select: { id: true }
      })
      
      if (referrer) {
        referrerId = referrer.id
      }
    }

    // Generate unique referral code for new user
    const newReferralCode = await generateUniqueReferralCode()

    // Get the next position number
    const currentCount = await prisma.waitlist.count()
    const nextPosition = currentCount + 1

    // Create waitlist entry
    const entry = await prisma.waitlist.create({
      data: {
        email,
        referralCode: newReferralCode,
        referredBy: referrerId,
        position: nextPosition,
        metadata: JSON.stringify(metadata || {})
      },
      include: {
        referrer: {
          select: {
            referralCode: true,
            email: true
          }
        }
      }
    })

    const position = entry.position

    // Send welcome email asynchronously
    const referralUrl = createReferralUrl(entry.referralCode)
    
    // Don't wait for email sending to complete the response
    sendWelcomeEmailAsync(entry, referralUrl).catch(error => {
      console.error('Failed to send welcome email:', error)
    })

    // Check for milestones and admin notifications
    checkNotifications(position).catch(error => {
      console.error('Failed to check notifications:', error)
    })

    const response = {
      message: 'Successfully added to waitlist!',
      data: {
        id: entry.id,
        email: entry.email,
        referralCode: entry.referralCode,
        position: position,
        joinedAt: entry.joinedAt,
        referredBy: entry.referrer ? {
          referralCode: entry.referrer.referralCode,
          email: entry.referrer.email
        } : null
      }
    }

    const responseHeaders: Record<string, string> = {}
    if (rateLimitResult.remainingRequests !== undefined) {
      responseHeaders['X-RateLimit-Remaining'] = rateLimitResult.remainingRequests.toString()
    }
    if (rateLimitResult.resetTime) {
      responseHeaders['X-RateLimit-Reset'] = Math.ceil(rateLimitResult.resetTime / 1000).toString()
    }

    return NextResponse.json(response, { 
      status: 201,
      headers: responseHeaders
    })

  } catch (error) {
    console.error('Waitlist API error:', error)
    
    if (error instanceof ZodError) {
      const firstError = error.issues[0]
      return NextResponse.json(
        { 
          error: firstError.message,
          field: firstError.path.join('.')
        },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      // Handle Prisma unique constraint violations
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'This email is already on the waitlist.' },
          { status: 409 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

// GET endpoint to check waitlist status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const referralCode = searchParams.get('referralCode')

    if (!email && !referralCode) {
      return NextResponse.json(
        { error: 'Email or referral code is required' },
        { status: 400 }
      )
    }

    const whereClause = email 
      ? { email } 
      : { referralCode: referralCode! }

    const entry = await prisma.waitlist.findUnique({
      where: whereClause,
      include: {
        referrer: {
          select: {
            referralCode: true,
            email: true
          }
        },
        _count: {
          select: {
            referrals: true
          }
        }
      }
    })

    if (!entry) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      )
    }

    // Position is already stored in the entry
    const position = entry.position

    return NextResponse.json({
      data: {
        id: entry.id,
        email: entry.email,
        referralCode: entry.referralCode,
        position: position,
        joinedAt: entry.joinedAt,
        referralCount: entry._count.referrals,
        referredBy: entry.referrer ? {
          referralCode: entry.referrer.referralCode,
          email: entry.referrer.email
        } : null
      }
    })

  } catch (error) {
    console.error('Waitlist GET API error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

// Helper function to send welcome email asynchronously
async function sendWelcomeEmailAsync(entry: { id: string; email: string; position: number; referralCode: string; joinedAt: Date }, referralUrl: string) {
  try {
    await emailService.sendWelcomeEmail({
      email: entry.email,
      position: entry.position,
      referralCode: entry.referralCode,
      referralUrl: referralUrl,
      joinedAt: entry.joinedAt.toISOString(),
    })

    // Log successful email
    await emailTracker.logEmail({
      recipientEmail: entry.email,
      emailType: 'welcome',
      success: true,
      waitlistId: entry.id
    })

    console.log(`Welcome email sent to ${entry.email}`)
  } catch (error) {
    // Log failed email
    await emailTracker.logEmail({
      recipientEmail: entry.email,
      emailType: 'welcome',
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      waitlistId: entry.id
    })

    console.error(`Failed to send welcome email to ${entry.email}:`, error)
  }
}

// Helper function to check for milestone and admin notifications
async function checkNotifications(currentPosition: number) {
  try {
    // Check for milestone (every 1000 signups)
    const milestone = await emailTracker.checkMilestone(currentPosition)
    if (milestone) {
      await sendMilestoneEmails(milestone, currentPosition)
    }

    // Check for admin notification (every 100 signups)
    const adminThreshold = await emailTracker.checkAdminNotification(currentPosition)
    if (adminThreshold) {
      await sendAdminNotification(adminThreshold)
    }
  } catch (error) {
    console.error('Error checking notifications:', error)
  }
}

// Helper function to send milestone emails
async function sendMilestoneEmails(milestone: number, totalUsers: number) {
  try {
    console.log(`Sending milestone emails for ${milestone} members`)

    // Get all active subscribers (not unsubscribed)
    const subscribers = await prisma.waitlist.findMany({
      where: {
        unsubscribed: false,
        emailSent: true // Only send to users who have received welcome email
      },
      select: {
        id: true,
        email: true,
        position: true
      }
    })

    let emailsSent = 0
    let emailsFailed = 0

    // Send emails in batches to avoid overwhelming the email service
    const batchSize = 50
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize)
      
      const emailPromises = batch.map(async (subscriber) => {
        try {
          await emailService.sendMilestoneEmail({
            milestone,
            totalUsers,
            userPosition: subscriber.position,
            email: subscriber.email
          })

          await emailTracker.logEmail({
            recipientEmail: subscriber.email,
            emailType: 'milestone',
            success: true,
            waitlistId: subscriber.id
          })

          emailsSent++
        } catch (error) {
          await emailTracker.logEmail({
            recipientEmail: subscriber.email,
            emailType: 'milestone',
            success: false,
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
            waitlistId: subscriber.id
          })

          emailsFailed++
        }
      })

      await Promise.allSettled(emailPromises)
      
      // Small delay between batches
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    // Mark milestone as processed
    await emailTracker.markMilestoneProcessed(milestone, emailsSent, emailsFailed)
    
    console.log(`Milestone emails completed: ${emailsSent} sent, ${emailsFailed} failed`)
  } catch (error) {
    console.error('Error sending milestone emails:', error)
  }
}

// Helper function to send admin notifications
async function sendAdminNotification(threshold: number) {
  try {
    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || []
    
    if (adminEmails.length === 0) {
      console.log('No admin emails configured')
      return
    }

    // Get statistics for the notification
    const totalSignups = threshold
    const recentSignups = await emailTracker.getRecentSignups(7)
    const topReferrers = await emailTracker.getTopReferrers(10)

    console.log(`Sending admin notification for ${threshold} signups`)

    await emailService.sendAdminNotification(adminEmails, {
      totalSignups,
      recentSignups,
      topReferrers,
      timeframe: '7 days'
    })

    // Log admin notification
    await emailTracker.logAdminNotification(
      'signups_100',
      threshold,
      adminEmails,
      true
    )

    console.log(`Admin notification sent to ${adminEmails.length} recipients`)
  } catch (error) {
    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || []
    
    // Log failed admin notification
    await emailTracker.logAdminNotification(
      'signups_100',
      threshold,
      adminEmails,
      false,
      error instanceof Error ? error.message : 'Unknown error'
    )

    console.error('Error sending admin notification:', error)
  }
}