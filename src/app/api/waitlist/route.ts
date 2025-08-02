import { NextRequest, NextResponse } from 'next/server'
import { waitlistSchema } from '@/lib/validations'
import { checkRateLimit, getClientIP } from '@/lib/rate-limit'
import { getPrismaClient } from '@/lib/prisma'
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
  console.log('🚀 Waitlist API started - Full Database Version')
  
  try {
    const ip = getClientIP(request)
    
    // Check rate limiting
    const rateLimitResult = checkRateLimit(ip, request)
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { captchaToken, referralCode } = body
    
    console.log('📊 Verifying captcha...')
    
    // Verify CAPTCHA token
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
    
    console.log('✅ Captcha verified successfully')

    // Remove captchaToken from validation data
    const { captchaToken: _, ...validationData } = body
    const { email } = waitlistSchema.parse(validationData)
    
    console.log('✅ Email validated:', email)

    // Get database connection
    const prisma = await getPrismaClient()
    if (!prisma) {
      throw new Error('Database connection not available')
    }

    // Collect metadata
    const userAgent = request.headers.get('user-agent') || undefined
    const referer = request.headers.get('referer') || undefined
    const timestamp = new Date().toISOString()
    
    const metadata = {
      userAgent,
      referrer: referer,
      timestamp,
      source: 'api_form',
      formMethod: 'POST'
    }

    // Check if email already exists
    const existingEntry = await prisma.waitlist.findUnique({
      where: { email }
    })

    if (existingEntry) {
      return NextResponse.json(
        { error: 'This email is already on the waitlist.' },
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
        metadata: JSON.stringify(metadata)
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

    console.log('✅ User added to waitlist:', entry.email, 'Position:', entry.position)

    // Send welcome email asynchronously
    const referralUrl = createReferralUrl(entry.referralCode)
    
    console.log('🚀 Starting async email send for:', entry.email)
    console.log('🚀 Referral URL:', referralUrl)
    console.log('🚀 Has RESEND_API_KEY:', !!process.env.RESEND_API_KEY)
    
    sendWelcomeEmailAsync(entry, referralUrl).catch(error => {
      console.error('❌ Failed to send welcome email:', error)
    })

    // Check for milestones and admin notifications
    checkNotifications(nextPosition).catch(error => {
      console.error('Failed to check notifications:', error)
    })

    // Return success response
    const response = {
      success: true,
      message: 'Successfully added to waitlist!',
      data: {
        email: entry.email,
        position: entry.position,
        referralCode: entry.referralCode,
        referralUrl: referralUrl,
        joinedAt: entry.joinedAt.toISOString()
      }
    }

    console.log('✅ Returning success response')

    return NextResponse.json(response, { status: 201 })

  } catch (error) {
    console.error('❌ Waitlist API error:', error)
    
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

    const err = error as Error
    if (err.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'This email is already on the waitlist.' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Something went wrong. Please try again.', details: err?.message },
      { status: 500 }
    )
  }
}

// Helper functions
async function sendWelcomeEmailAsync(entry: { id: string; email: string; position: number; referralCode: string; joinedAt: Date }, referralUrl: string) {
  try {
    console.log(`📧 Attempting to send welcome email to ${entry.email}`)
    
    await emailService.sendWelcomeEmail({
      email: entry.email,
      position: entry.position,
      referralCode: entry.referralCode,
      referralUrl: referralUrl,
      joinedAt: entry.joinedAt.toISOString(),
    })

    await emailTracker.logEmail({
      recipientEmail: entry.email,
      emailType: 'welcome',
      success: true,
      waitlistId: entry.id
    })

    console.log(`✅ Welcome email sent to ${entry.email}`)
  } catch (error) {
    await emailTracker.logEmail({
      recipientEmail: entry.email,
      emailType: 'welcome',
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      waitlistId: entry.id
    })

    console.error(`❌ Failed to send welcome email to ${entry.email}:`, error)
  }
}

async function checkNotifications(currentPosition: number) {
  try {
    const milestone = await emailTracker.checkMilestone(currentPosition)
    if (milestone) {
      console.log(`🎯 Milestone reached: ${milestone}`)
      // Milestone logic here
    }

    const adminThreshold = await emailTracker.checkAdminNotification(currentPosition)
    if (adminThreshold) {
      console.log(`📊 Admin threshold reached: ${adminThreshold}`)
      // Admin notification logic here
    }
  } catch (error) {
    console.error('Error checking notifications:', error)
  }
}