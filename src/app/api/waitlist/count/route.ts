import { NextResponse } from 'next/server'

export async function GET() {
  console.log('🚀 Count API function started')
  console.log('📊 DATABASE_URL exists:', !!process.env.DATABASE_URL)
  console.log('📊 DATABASE_URL preview:', process.env.DATABASE_URL?.substring(0, 30) + '...')
  
  try {
    console.log('📊 About to import Prisma...')
    const { prisma } = await import('@/lib/prisma')
    console.log('📊 Prisma imported successfully!')
    
    console.log('📊 About to call prisma.waitlist.count()')
    const totalCount = await prisma.waitlist.count()
    console.log('📊 Total count result:', totalCount)
    
    return NextResponse.json({
      data: {
        total: totalCount,
        lastUpdated: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('❌ Waitlist count API error:', error)
    const err = error as Error
    console.error('❌ Error name:', err?.name)
    console.error('❌ Error message:', err?.message)
    console.error('❌ Error stack:', err?.stack)
    
    return NextResponse.json(
      { error: 'Failed to fetch waitlist count', details: err?.message },
      { status: 500 }
    )
  }
}