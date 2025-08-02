import { z } from 'zod'

// Common disposable email domains to block
const DISPOSABLE_EMAIL_DOMAINS = [
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'tempmail.org',
  'yopmail.com',
  'temp-mail.org',
  'throwaway.email'
]

const utmParametersSchema = z.object({
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
}).optional()

const metadataSchema = z.object({
  utm: utmParametersSchema,
  userAgent: z.string().optional(),
  referrer: z.string().url().optional(),
  source: z.string().optional(),
  timestamp: z.string().datetime().optional(),
}).optional()

export const waitlistSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(5, 'Email address is too short')
    .max(254, 'Email address is too long')
    .refine((email) => {
      // Check against disposable email domains
      const domain = email.split('@')[1]?.toLowerCase()
      return domain && !DISPOSABLE_EMAIL_DOMAINS.includes(domain)
    }, 'Disposable email addresses are not allowed')
    .refine((email) => {
      // Basic format validation beyond Zod's default
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      return emailRegex.test(email)
    }, 'Please enter a valid email address'),
  
  referralCode: z
    .string()
    .length(8, 'Referral code must be exactly 8 characters')
    .regex(/^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]+$/, 'Invalid referral code format')
    .optional(),
    
  metadata: metadataSchema
})

export const referralCodeSchema = z.object({
  code: z
    .string()
    .length(8, 'Referral code must be exactly 8 characters')
    .regex(/^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]+$/, 'Invalid referral code format')
})

export type WaitlistFormData = z.infer<typeof waitlistSchema>
export type ReferralCodeData = z.infer<typeof referralCodeSchema>
export type MetadataType = z.infer<typeof metadataSchema>