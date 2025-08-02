import { NextRequest, NextResponse } from 'next/server'
import { getReferralStats } from '@/lib/referral'
import { referralCodeSchema } from '@/lib/validations'
import { ZodError } from 'zod'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    
    // Validate referral code format
    const validatedCode = referralCodeSchema.parse({ code })
    
    const stats = await getReferralStats(validatedCode.code)
    
    if (!stats) {
      return NextResponse.json(
        { error: 'Referral code not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      data: {
        referralCode: stats.referralCode,
        totalReferrals: stats.totalReferrals,
        userPosition: stats.userPosition,
        joinedAt: stats.joinedAt,
        referrals: stats.referrals.map(referral => ({
          id: referral.id,
          email: referral.email.replace(/(.{2}).*(@.*)/, '$1***$2'), // Mask email for privacy
          joinedAt: referral.joinedAt,
          position: referral.position
        }))
      }
    })
    
  } catch (error) {
    console.error('Referral stats API error:', error)
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid referral code format' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}