'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { ArrowRight, Check } from 'lucide-react'
import DarkVeil from '@/components/DarkVeil'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreeToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy to continue.')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Sign up without email confirmation to avoid rate limits
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined, // Disable email confirmation
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        // Handle specific rate limit error
        if (error.message.includes('rate limit') || error.message.includes('too many')) {
          setError('Too many signup attempts. Please wait a few minutes and try again.')
        } else {
          throw error
        }
        return
      }

      if (data.user) {
        // Redirect directly to onboarding since we're skipping email confirmation
        router.push('/onboarding')
      }
    } catch (err: any) {
      console.error('Signup error:', err)
      setError(err.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Dark Veil Background */}
      <div className="absolute inset-0">
        <DarkVeil
          speed={0.8}
          hueShift={237}
          noiseIntensity={0.1}
          scanlineIntensity={0.05}
          scanlineFrequency={0.5}
          warpAmount={0.02}
        />
      </div>

      <div className="relative flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center mb-6">
              <img
                src="/agentlinkerpfp.png"
                alt="AgentLinker"
                className="h-20 w-20 rounded-full"
              />
            </Link>
            <h1 className="text-4xl font-bold text-white mb-2">Get Started with AgentLinker</h1>
            <p className="text-gray-300">Turn your bio into a 24/7 lead machine</p>
          </div>

          {/* Value Props */}
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-xl overflow-hidden">
              <DarkVeil
                speed={0.8}
                hueShift={200}
                noiseIntensity={0.1}
                scanlineIntensity={0.05}
                scanlineFrequency={0.5}
                warpAmount={0.02}
              />
            </div>
            <div className="relative bg-black/90 backdrop-blur-sm rounded-xl border border-red-500/30 p-6 shadow-xl">
              <div className="grid grid-cols-3 gap-4 text-center mb-3">
                <div>
                  <div className="text-lg font-bold text-red-500">5-10</div>
                  <div className="text-xs text-gray-400">Monthly Requests</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-500">$10K+</div>
                  <div className="text-xs text-gray-400">Extra Commission</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-500">24/7</div>
                  <div className="text-xs text-gray-400">Lead Capture</div>
                </div>
              </div>
              <p className="text-center text-sm text-gray-300">
                <span className="text-red-500 font-semibold">Join 500+ agents</span> already growing with AgentLinker
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <DarkVeil
                speed={0.8}
                hueShift={237}
                noiseIntensity={0.1}
                scanlineIntensity={0.05}
                scanlineFrequency={0.5}
                warpAmount={0.02}
              />
            </div>

            <div className="relative bg-black/90 backdrop-blur-sm rounded-2xl border border-red-500/30 shadow-2xl p-8">
              {error && (
                <div className="bg-red-500/20 text-red-200 p-4 rounded-lg mb-6 text-sm border border-red-500/30">
                  {error}
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-400 transition-all"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-400 transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-400 transition-all"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    id="agreeToTerms"
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-red-600 bg-black border-red-500/30 rounded focus:ring-red-500 focus:ring-2"
                  />
                  <label htmlFor="agreeToTerms" className="text-sm text-gray-300">
                    I agree to the{' '}
                    <Link href="/terms" className="text-red-500 hover:text-red-400 font-medium transition-colors">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-red-500 hover:text-red-400 font-medium transition-colors">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <Link href="/login" className="text-red-500 hover:text-red-400 font-medium transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}