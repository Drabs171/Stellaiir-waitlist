import { NextRequest, NextResponse } from 'next/server'
import { getPrismaClient } from '@/lib/prisma'
import { checkRateLimit, getClientIP } from '@/lib/rate-limit'
import { generateUniqueReferralCode, validateReferralCode } from '@/lib/referral'
import { emailService, createReferralUrl } from '@/lib/email'
import { emailTracker } from '@/lib/email-tracker'

// Server-side form submission handler for no-JS environments
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    
    // Check rate limiting
    const rateLimitResult = checkRateLimit(ip, request)
    if (!rateLimitResult.allowed) {
      // Redirect back with error for no-JS
      const url = new URL(request.url)
      url.pathname = '/'
      url.searchParams.set('error', 'Too many requests. Please try again later.')
      return NextResponse.redirect(url, 429)
    }

    // Parse form data
    const formData = await request.formData()
    const email = formData.get('email') as string
    const website = formData.get('website') as string // honeypot
    const referralCode = formData.get('referralCode') as string || undefined

    // Basic validation
    if (!email || typeof email !== 'string') {
      const url = new URL(request.url)
      url.pathname = '/'
      url.searchParams.set('error', 'Please enter a valid email address.')
      return NextResponse.redirect(url, 400)
    }

    // Check honeypot
    if (website && String(website).trim() !== '') {
      // Bot detected - redirect with generic error
      const url = new URL(request.url)
      url.pathname = '/'
      url.searchParams.set('error', 'Something went wrong. Please try again.')
      return NextResponse.redirect(url, 400)
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      const url = new URL(request.url)
      url.pathname = '/'
      url.searchParams.set('error', 'Please enter a valid email address.')
      return NextResponse.redirect(url, 400)
    }

    // Collect metadata
    const userAgent = request.headers.get('user-agent') || undefined
    const referer = request.headers.get('referer') || undefined
    const timestamp = new Date().toISOString()
    
    const metadata = {
      userAgent,
      referrer: referer,
      timestamp,
      source: 'no_js_form',
      formMethod: 'POST'
    }

    // Check if email already exists
    const prisma = await getPrismaClient()
    if (!prisma) {
      throw new Error('Database connection not available')
    }
    
    const existingEntry = await prisma.waitlist.findUnique({
      where: { email }
    })

    if (existingEntry) {
      const url = new URL(request.url)
      url.pathname = '/'
      url.searchParams.set('error', 'This email is already on the waitlist.')
      return NextResponse.redirect(url, 409)
    }

    // Validate referral code if provided
    let referrerId: string | null = null
    if (referralCode) {
      const isValidReferral = await validateReferralCode(referralCode)
      if (!isValidReferral) {
        const url = new URL(request.url)
        url.pathname = '/'
        url.searchParams.set('error', 'Invalid referral code.')
        return NextResponse.redirect(url, 400)
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

    // Send welcome email asynchronously
    const referralUrl = createReferralUrl(entry.referralCode)
    
    sendWelcomeEmailAsync(entry, referralUrl).catch(error => {
      console.error('Failed to send welcome email:', error)
    })

    // Check for milestones and admin notifications
    checkNotifications(nextPosition).catch(error => {
      console.error('Failed to check notifications:', error)
    })

    // Redirect back with success message
    const url = new URL(request.url)
    url.pathname = '/'
    url.searchParams.set('success', `Successfully joined the waitlist! You're #${nextPosition}. Check your email for confirmation.`)
    return NextResponse.redirect(url, 302)

  } catch (error) {
    console.error('No-JS waitlist API error:', error)
    
    // Redirect back with error
    const url = new URL(request.url)
    url.pathname = '/'
    
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      url.searchParams.set('error', 'This email is already on the waitlist.')
    } else {
      url.searchParams.set('error', 'Something went wrong. Please try again.')
    }
    
    return NextResponse.redirect(url, 500)
  }
}

// Helper functions (copied from main route)
async function sendWelcomeEmailAsync(entry: { id: string; email: string; position: number; referralCode: string; joinedAt: Date }, referralUrl: string) {
  try {
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

    console.log(`Welcome email sent to ${entry.email}`)
  } catch (error) {
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

async function checkNotifications(currentPosition: number) {
  try {
    const milestone = await emailTracker.checkMilestone(currentPosition)
    if (milestone) {
      // Milestone logic here
    }

    const adminThreshold = await emailTracker.checkAdminNotification(currentPosition)
    if (adminThreshold) {
      // Admin notification logic here
    }
  } catch (error) {
    console.error('Error checking notifications:', error)
  }
}