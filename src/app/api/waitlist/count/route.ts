import { NextResponse } from 'next/server'

export async function GET() {
  console.log('🚀 Count API function started - BASIC VERSION')
  console.log('🚀 Environment check:', {
    nodeEnv: process.env.NODE_ENV,
    hasDB: !!process.env.DATABASE_URL,
    dbPreview: process.env.DATABASE_URL?.substring(0, 20)
  })
  
  try {
    // Test basic functionality first
    return NextResponse.json({
      message: 'API is working',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV
    })
  } catch (error) {
    console.error('❌ Basic API error:', error)
    return NextResponse.json({ error: 'Basic error' }, { status: 500 })
  }
}