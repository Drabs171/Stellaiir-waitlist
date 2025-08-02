import { NextRequest, NextResponse } from 'next/server'
import { emailService } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    console.log('🧪 Debug: Testing email service...')
    console.log('🧪 Debug: RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY)
    console.log('🧪 Debug: FROM_EMAIL:', process.env.FROM_EMAIL || 'not set')
    console.log('🧪 Debug: Target email:', email)

    // Test email data
    const testEmailData = {
      email: email,
      position: 1,
      referralCode: 'DEBUG123',
      referralUrl: 'https://stellaiir-waitlist.vercel.app?ref=DEBUG123',
      joinedAt: new Date().toISOString()
    }

    console.log('🧪 Debug: Attempting to send test welcome email...')
    
    const result = await emailService.sendWelcomeEmail(testEmailData)
    
    console.log('🧪 Debug: Email service result:', result)

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      data: result,
      config: {
        hasApiKey: !!process.env.RESEND_API_KEY,
        fromEmail: process.env.FROM_EMAIL || 'not set',
        appUrl: process.env.NEXT_PUBLIC_APP_URL || 'not set'
      }
    })

  } catch (error) {
    console.error('🧪 Debug: Email test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      config: {
        hasApiKey: !!process.env.RESEND_API_KEY,
        fromEmail: process.env.FROM_EMAIL || 'not set',
        appUrl: process.env.NEXT_PUBLIC_APP_URL || 'not set'
      }
    }, { status: 500 })
  }
}