'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { ArrowRight, Check, Mail } from 'lucide-react'
import DarkVeil from '@/components/DarkVeil'
import { useAuthEmail } from '@/lib/hooks/useAuthEmail'

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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) throw error

      if (data.user) {
        // Redirect to onboarding to create agent profile
        router.push('/onboarding')
      }
    } catch (err: any) {
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
                  <div className="text-lg font-bold text-red-500">$20</div>
                  <div className="text-xs text-gray-400">Per Month</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-500">$10K+</div>
                  <div className="text-xs text-gray-400">Per Deal</div>
                </div>
              </div>
              <p className="text-center text-xs text-gray-300">
                ✓ No credit card required • Setup in 5 minutes
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
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-400 transition-all"
                    placeholder="you@example.com"
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
                  <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                </div>

                {/* Terms and Privacy Agreement */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center h-5">
                      <input
                        id="agreeToTerms"
                        type="checkbox"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-black/50 border-red-500/30 rounded focus:ring-red-500 focus:ring-2"
                      />
                    </div>
                    <label htmlFor="agreeToTerms" className="text-sm text-gray-300 leading-relaxed">
                      I agree to the{' '}
                      <Link href="/terms" className="text-red-500 hover:text-red-400 underline transition-colors">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-red-500 hover:text-red-400 underline transition-colors">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !agreeToTerms}
                  className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl"
                >
                  {loading ? 'Creating account...' : 'Get Started →'}
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

