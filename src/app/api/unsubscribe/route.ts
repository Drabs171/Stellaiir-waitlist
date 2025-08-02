import { NextRequest, NextResponse } from 'next/server'
import { emailTracker } from '@/lib/email-tracker'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Mark the email as unsubscribed
    await emailTracker.markUnsubscribed(email)

    return NextResponse.json({
      message: 'Successfully unsubscribed from email notifications'
    })
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json(
      { error: 'Failed to unsubscribe. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Unsubscribe - Stellaiir</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: Inter, -apple-system, sans-serif; 
              background: #0f0f0f; 
              color: #fff; 
              margin: 0; 
              padding: 2rem;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }
            .container { 
              max-width: 500px; 
              background: rgba(255,255,255,0.05); 
              border: 1px solid rgba(255,255,255,0.1);
              border-radius: 16px; 
              padding: 2rem; 
              text-align: center;
            }
            .error { color: #ef4444; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🧬 Stellaiir</h1>
            <p class="error">Invalid unsubscribe link. Email parameter is required.</p>
          </div>
        </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      })
    }

    try {
      await emailTracker.markUnsubscribed(email)
      
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Unsubscribed - Stellaiir</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: Inter, -apple-system, sans-serif; 
              background: #0f0f0f; 
              color: #fff; 
              margin: 0; 
              padding: 2rem;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }
            .container { 
              max-width: 500px; 
              background: rgba(255,255,255,0.05); 
              border: 1px solid rgba(255,255,255,0.1);
              border-radius: 16px; 
              padding: 2rem; 
              text-align: center;
            }
            .success { color: #10b981; }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #6366f1 0%, #22d3ee 100%);
              color: white;
              padding: 12px 24px;
              border-radius: 8px;
              text-decoration: none;
              margin-top: 1rem;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🧬 Stellaiir</h1>
            <div class="success">
              <h2>✅ Successfully Unsubscribed</h2>
              <p>You have been unsubscribed from Stellaiir email notifications.</p>
              <p>You will no longer receive milestone updates or promotional emails.</p>
              <p><strong>Note:</strong> You will still remain on the waitlist and receive your launch notification when it's your turn.</p>
            </div>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" class="button">
              Return to Stellaiir
            </a>
          </div>
        </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      })
    } catch {
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Unsubscribe Error - Stellaiir</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: Inter, -apple-system, sans-serif; 
              background: #0f0f0f; 
              color: #fff; 
              margin: 0; 
              padding: 2rem;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }
            .container { 
              max-width: 500px; 
              background: rgba(255,255,255,0.05); 
              border: 1px solid rgba(255,255,255,0.1);
              border-radius: 16px; 
              padding: 2rem; 
              text-align: center;
            }
            .error { color: #ef4444; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🧬 Stellaiir</h1>
            <div class="error">
              <h2>❌ Unsubscribe Failed</h2>
              <p>We couldn't process your unsubscribe request. Please try again later or contact support.</p>
            </div>
          </div>
        </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      })
    }
  } catch (error) {
    console.error('Unsubscribe GET error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}