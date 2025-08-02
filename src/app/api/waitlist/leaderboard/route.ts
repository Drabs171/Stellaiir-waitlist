import { NextRequest, NextResponse } from 'next/server'
import { getTopReferrers } from '@/lib/referral'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? Math.min(parseInt(limitParam, 10), 100) : 10 // Max 100, default 10
    
    if (isNaN(limit) || limit < 1) {
      return NextResponse.json(
        { error: 'Limit must be a positive number' },
        { status: 400 }
      )
    }
    
    const topReferrers = await getTopReferrers(limit)
    
    return NextResponse.json({
      data: {
        leaderboard: topReferrers,
        total: topReferrers.length,
        limit: limit
      }
    })
    
  } catch (error) {
    console.error('Leaderboard API error:', error)
    
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}