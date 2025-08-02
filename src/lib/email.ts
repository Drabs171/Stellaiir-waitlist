import { Resend } from 'resend'
import { render } from '@react-email/render'

// Initialize Resend with fallback for build time
const createResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || apiKey === 'undefined') {
    console.warn('RESEND_API_KEY not configured. Email sending will be disabled.')
    return null
  }
  return new Resend(apiKey)
}

const resend = createResendClient()

export interface EmailOptions {
  to: string | string[]
  subject: string
  react: React.ReactElement
  from?: string
}

export interface WelcomeEmailData {
  email: string
  position: number
  referralCode: string
  referralUrl: string
  joinedAt: string
}

export interface MilestoneEmailData {
  milestone: number
  totalUsers: number
  userPosition: number
  email: string
}

export interface AdminNotificationData {
  totalSignups: number
  recentSignups: number
  topReferrers: Array<{
    email: string
    referralCount: number
  }>
  timeframe: string
}

class EmailService {
  private defaultFrom = process.env.FROM_EMAIL || 'Stellaiir <noreply@stellaiir.com>'

  async sendEmail({ to, subject, react, from }: EmailOptions) {
    try {
      // Check if Resend is configured
      if (!resend) {
        console.warn('Email service not configured. Skipping email send.')
        return { success: true, data: { id: 'demo-mode', message: 'Email service not configured' } }
      }

      // Convert React component to HTML
      const html = await render(react)
      
      // Send email using Resend
      const { data, error } = await resend.emails.send({
        from: from || this.defaultFrom,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      })

      if (error) {
        console.error('Email sending error:', error)
        throw new Error(`Failed to send email: ${error.message}`)
      }

      console.log('Email sent successfully:', data)
      return { success: true, data }
    } catch (error) {
      console.error('Email service error:', error)
      throw error
    }
  }

  async sendWelcomeEmail(emailData: WelcomeEmailData) {
    // Dynamic import to avoid build issues
    const { WelcomeEmail } = await import('../../emails/WelcomeEmail')
    
    return this.sendEmail({
      to: emailData.email,
      subject: '🧬 Welcome to Stellaiir - You\'re on the waitlist!',
      react: WelcomeEmail({
        email: emailData.email,
        position: emailData.position,
        referralCode: emailData.referralCode,
        referralUrl: emailData.referralUrl,
        joinedAt: emailData.joinedAt,
      })
    })
  }

  async sendMilestoneEmail(emailData: MilestoneEmailData) {
    const { MilestoneEmail } = await import('../../emails/MilestoneEmail')
    
    return this.sendEmail({
      to: emailData.email,
      subject: `🎉 Stellaiir hits ${emailData.milestone.toLocaleString()} members!`,
      react: MilestoneEmail(emailData)
    })
  }

  async sendAdminNotification(adminEmails: string[], data: AdminNotificationData) {
    const { AdminNotificationEmail } = await import('../../emails/AdminNotificationEmail')
    
    return this.sendEmail({
      to: adminEmails,
      subject: `📊 Stellaiir Waitlist Update: ${data.totalSignups} total signups`,
      react: AdminNotificationEmail(data)
    })
  }

  async sendBatchEmails(emails: EmailOptions[], batchSize = 10) {
    const results = []
    
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize)
      
      try {
        // Process batch with small delay to respect rate limits
        const batchPromises = batch.map(async (email, index) => {
          // Small delay between each email in batch
          await new Promise(resolve => setTimeout(resolve, index * 100))
          return this.sendEmail(email)
        })
        
        const batchResults = await Promise.allSettled(batchPromises)
        results.push(...batchResults)
        
        // Delay between batches
        if (i + batchSize < emails.length) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      } catch (error) {
        console.error(`Batch ${Math.floor(i / batchSize) + 1} failed:`, error)
        results.push({ status: 'rejected', reason: error })
      }
    }
    
    return results
  }
}

// Export singleton instance
export const emailService = new EmailService()

// Helper function to create referral URL
export function createReferralUrl(referralCode: string, baseUrl?: string): string {
  const domain = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${domain}?ref=${referralCode}`
}

// Helper function to format date for emails
export function formatEmailDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}