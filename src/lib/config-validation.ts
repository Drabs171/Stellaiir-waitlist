// Configuration validation utility to help identify missing APIs
export interface ConfigValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  status: 'ready' | 'needs-apis' | 'misconfigured'
}

export function validateConfiguration(): ConfigValidation {
  const errors: string[] = []
  const warnings: string[] = []

  // Check critical environment variables
  const requiredVars = {
    DATABASE_URL: process.env.DATABASE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_HCAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY,
    HCAPTCHA_SECRET_KEY: process.env.HCAPTCHA_SECRET_KEY,
  }

  // Check for missing critical variables
  if (!requiredVars.DATABASE_URL) {
    errors.push('DATABASE_URL is required for database connection')
  }

  if (!requiredVars.RESEND_API_KEY || requiredVars.RESEND_API_KEY.includes('your_resend_api_key_here')) {
    errors.push('RESEND_API_KEY is required for sending emails (get from resend.com)')
  }

  if (!requiredVars.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || requiredVars.NEXT_PUBLIC_HCAPTCHA_SITE_KEY.includes('10000000-ffff-ffff-ffff-000000000001')) {
    errors.push('NEXT_PUBLIC_HCAPTCHA_SITE_KEY is required for CAPTCHA (get from hcaptcha.com)')
  }

  if (!requiredVars.HCAPTCHA_SECRET_KEY || requiredVars.HCAPTCHA_SECRET_KEY.includes('0x000000000000000000000000000000000000000')) {
    errors.push('HCAPTCHA_SECRET_KEY is required for CAPTCHA verification (get from hcaptcha.com)')
  }

  // Check for recommended variables
  const recommendedVars = {
    ADMIN_EMAILS: process.env.ADMIN_EMAILS,
    FROM_EMAIL: process.env.FROM_EMAIL,
    JWT_SECRET: process.env.JWT_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  }

  if (!recommendedVars.ADMIN_EMAILS || recommendedVars.ADMIN_EMAILS.includes('admin@stellaiir.com')) {
    warnings.push('ADMIN_EMAILS should be updated with your real email addresses')
  }

  if (!recommendedVars.FROM_EMAIL || recommendedVars.FROM_EMAIL.includes('noreply@stellaiir.com')) {
    warnings.push('FROM_EMAIL should be updated with your domain email address')
  }

  if (!recommendedVars.JWT_SECRET || recommendedVars.JWT_SECRET.includes('your-super-secret-jwt-key')) {
    warnings.push('JWT_SECRET should be a secure random string for production')
  }

  if (!recommendedVars.NEXT_PUBLIC_APP_URL || recommendedVars.NEXT_PUBLIC_APP_URL.includes('localhost')) {
    warnings.push('NEXT_PUBLIC_APP_URL should be your production domain for deployment')
  }

  // Determine status
  let status: 'ready' | 'needs-apis' | 'misconfigured' = 'ready'
  if (errors.length > 0) {
    status = errors.some(error => 
      error.includes('RESEND_API_KEY') || 
      error.includes('HCAPTCHA')
    ) ? 'needs-apis' : 'misconfigured'
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    status
  }
}

// Log configuration status (useful for debugging)
export function logConfigurationStatus(): void {
  const validation = validateConfiguration()
  
  console.log('🔧 Stellaiir Waitlist Configuration Status:')
  console.log(`Status: ${validation.status.toUpperCase()}`)
  
  if (validation.errors.length > 0) {
    console.log('\n❌ ERRORS (Critical):')
    validation.errors.forEach(error => console.log(`  • ${error}`))
  }
  
  if (validation.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS (Recommended):')
    validation.warnings.forEach(warning => console.log(`  • ${warning}`))
  }
  
  if (validation.isValid) {
    console.log('\n✅ All critical APIs configured! Waitlist is ready to launch.')
  } else {
    console.log('\n📋 See API_SETUP_GUIDE.md for setup instructions.')
  }
}

// Helper to check if specific feature is available
export function isFeatureAvailable(feature: 'email' | 'captcha' | 'admin'): boolean {
  const validation = validateConfiguration()
  
  switch (feature) {
    case 'email':
      return !validation.errors.some(error => error.includes('RESEND_API_KEY'))
    case 'captcha':
      return !validation.errors.some(error => error.includes('HCAPTCHA'))
    case 'admin':
      return !validation.errors.some(error => error.includes('JWT_SECRET'))
    default:
      return false
  }
}