import { NextRequest, NextResponse } from 'next/server'
import { waitlistSchema } from '@/lib/validations'
import { checkRateLimit, getClientIP } from '@/lib/rate-limit'
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
  console.log('🚀 Waitlist API started - TEMPORARY NO DATABASE VERSION')
  
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
    const { captchaToken } = body
    
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

    // Return success response (temporary - not saving to database)
    const response = {
      success: true,
      message: 'Successfully added to waitlist! (Database temporarily disabled)',
      data: {
        email: email,
        position: 1, // Fake position
        referralCode: 'TEMP123', // Fake referral code
        referralUrl: `https://stellaiir.com?ref=TEMP123`,
        joinedAt: new Date().toISOString()
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
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.', details: err?.message },
      { status: 500 }
    )
  }
}