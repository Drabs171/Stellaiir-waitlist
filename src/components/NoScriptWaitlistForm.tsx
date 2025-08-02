// Server-side form component for no-JS fallback
import { Brain, Mail, Shield, Zap } from 'lucide-react'

interface NoScriptWaitlistFormProps {
  message?: string
  error?: string
  className?: string
}

const NoScriptWaitlistForm = ({ message, error, className = '' }: NoScriptWaitlistFormProps) => {
  return (
    <div className={`max-w-md mx-auto px-4 ${className}`}>
      <noscript>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <form method="POST" action="/api/waitlist/no-js" className="space-y-6">
            {/* CSRF protection */}
            <input type="hidden" name="_token" value={process.env.CSRF_TOKEN || 'fallback'} />
            
            {/* Honeypot field */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              style={{
                position: 'absolute',
                left: '-9999px',
                width: '1px',
                height: '1px',
                opacity: 0,
                overflow: 'hidden'
              }}
              aria-hidden="true"
            />

            {/* Email input */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                autoComplete="email"
                inputMode="email"
              />
            </div>

            {/* Messages */}
            {error && (
              <div className="text-red-400 text-sm flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <span>⚠️</span>
                {error}
              </div>
            )}

            {message && (
              <div className="text-green-400 text-sm flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <span>✅</span>
                {message}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Join the Waitlist
            </button>

            {/* Privacy notice */}
            <p className="text-gray-400 text-xs text-center">
              🔒 We respect your privacy. No spam, ever.
            </p>
          </form>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400 mt-6">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span>99.9% Accuracy</span>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span>AI-Powered Analysis</span>
          </div>
        </div>

        {/* No-JS specific instructions */}
        <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <h3 className="text-yellow-300 font-semibold mb-2">📱 Enhanced Experience Available</h3>
          <p className="text-gray-300 text-sm">
            For the full interactive experience with real-time updates, countdown timer, and visual effects, 
            please enable JavaScript in your browser.
          </p>
        </div>
      </noscript>
    </div>
  )
}

export default NoScriptWaitlistForm