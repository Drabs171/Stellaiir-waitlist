import { NextResponse } from 'next/server'
import { validateConfiguration } from '@/lib/config-validation'

// GET /api/config/status - Check configuration status
export async function GET() {
  try {
    const validation = validateConfiguration()
    
    // Return configuration status without exposing sensitive data
    return NextResponse.json({
      status: validation.status,
      isValid: validation.isValid,
      errors: validation.errors,
      warnings: validation.warnings,
      features: {
        email: !validation.errors.some(error => error.includes('RESEND_API_KEY')),
        captcha: !validation.errors.some(error => error.includes('HCAPTCHA')),
        database: !validation.errors.some(error => error.includes('DATABASE_URL')),
      },
      message: validation.isValid 
        ? 'All critical APIs configured! Waitlist is ready to launch.' 
        : 'Some APIs need to be configured. See API_SETUP_GUIDE.md for instructions.',
      setupGuide: '/API_SETUP_GUIDE.md'
    })
  } catch (error) {
    console.error('Config validation error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to validate configuration',
        status: 'error'
      },
      { status: 500 }
    )
  }
}