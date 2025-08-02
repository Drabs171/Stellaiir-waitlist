import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

export interface AdminSession {
  isAuthenticated: boolean
  username?: string
  expiresAt?: number
}

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password123'
const SESSION_DURATION = 30 * 60 * 1000 // 30 minutes

export async function validateCredentials(username: string, password: string): Promise<boolean> {
  try {
    if (username !== ADMIN_USERNAME) {
      return false
    }

    // For development, you can use plain text comparison
    // In production, you should hash the password in your environment variable
    if (process.env.NODE_ENV === 'production') {
      // If using hashed password in production
      return await bcrypt.compare(password, ADMIN_PASSWORD)
    } else {
      // Plain text comparison for development
      return password === ADMIN_PASSWORD
    }
  } catch (error) {
    console.error('Error validating credentials:', error)
    return false
  }
}

export async function createSession(username: string): Promise<void> {
  const expiresAt = Date.now() + SESSION_DURATION
  const sessionData = {
    username,
    expiresAt
  }

  const cookieStore = await cookies()
  cookieStore.set('admin-session', JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_DURATION / 1000,
    path: '/'
  })
}

export async function getSession(): Promise<AdminSession> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin-session')

    if (!sessionCookie) {
      return { isAuthenticated: false }
    }

    const sessionData = JSON.parse(sessionCookie.value)
    
    if (Date.now() > sessionData.expiresAt) {
      await destroySession()
      return { isAuthenticated: false }
    }

    return {
      isAuthenticated: true,
      username: sessionData.username,
      expiresAt: sessionData.expiresAt
    }
  } catch (error) {
    console.error('Error getting session:', error)
    return { isAuthenticated: false }
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('admin-session')
}

export async function requireAuth(): Promise<AdminSession> {
  const session = await getSession()
  if (!session.isAuthenticated) {
    throw new Error('Authentication required')
  }
  return session
}

// Rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

export function checkLoginRateLimit(ip: string): { allowed: boolean; remainingAttempts?: number; lockoutUntil?: number } {
  const now = Date.now()
  const attempts = loginAttempts.get(ip)

  if (!attempts) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 }
  }

  // Reset attempts if lockout period has passed
  if (now - attempts.lastAttempt > LOCKOUT_DURATION) {
    loginAttempts.delete(ip)
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 }
  }

  if (attempts.count >= MAX_ATTEMPTS) {
    return { 
      allowed: false, 
      lockoutUntil: attempts.lastAttempt + LOCKOUT_DURATION 
    }
  }

  return { 
    allowed: true, 
    remainingAttempts: MAX_ATTEMPTS - attempts.count - 1 
  }
}

export function recordLoginAttempt(ip: string, success: boolean): void {
  const now = Date.now()
  const attempts = loginAttempts.get(ip)

  if (success) {
    // Clear attempts on successful login
    loginAttempts.delete(ip)
    return
  }

  if (!attempts) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now })
  } else {
    attempts.count++
    attempts.lastAttempt = now
  }
}