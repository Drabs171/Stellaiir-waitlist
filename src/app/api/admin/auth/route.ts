import { NextRequest, NextResponse } from 'next/server'
import { validateCredentials, createSession, destroySession, checkLoginRateLimit, recordLoginAttempt } from '@/lib/auth'
import { getClientIP } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Check rate limiting
    const rateLimitResult = checkLoginRateLimit(ip)
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many login attempts. Please try again later.',
          lockoutUntil: rateLimitResult.lockoutUntil
        },
        { status: 429 }
      )
    }

    // Validate credentials
    const isValid = await validateCredentials(username, password)
    
    // Record the attempt
    recordLoginAttempt(ip, isValid)

    if (!isValid) {
      return NextResponse.json(
        { 
          error: 'Invalid credentials',
          remainingAttempts: rateLimitResult.remainingAttempts
        },
        { status: 401 }
      )
    }

    // Create session
    await createSession(username)

    return NextResponse.json({
      message: 'Login successful',
      user: { username }
    })

  } catch (error) {
    console.error('Admin auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    await destroySession()
    return NextResponse.json({ message: 'Logout successful' })
  } catch (error) {
    console.error('Admin logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}