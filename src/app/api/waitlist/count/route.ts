import { NextResponse } from 'next/server'

export async function GET() {
  console.log('🚀 BASIC COUNT API - NO PRISMA')
  console.log('📊 Environment check - NODE_ENV:', process.env.NODE_ENV)
  console.log('📊 DATABASE_URL exists:', !!process.env.DATABASE_URL)
  
  try {
    // Return fake data without touching Prisma at all
    const fakeData = {
      total: 0,
      today: 0,
      referrals: 0,
      referralRate: 0,
      lastUpdated: new Date().toISOString(),
      message: "Database temporarily unavailable - showing placeholder data"
    }
    
    console.log('✅ Returning fake data successfully')
    
    return NextResponse.json({
      data: fakeData
    })
  } catch (error) {
    console.error('❌ Even basic API failed:', error)
    
    return NextResponse.json(
      { error: 'Basic API error', details: String(error) },
      { status: 500 }
    )
  }
}