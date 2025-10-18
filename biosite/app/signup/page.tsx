'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { ArrowRight, Check, Mail, RefreshCw } from 'lucide-react'
import DarkVeil from '@/components/DarkVeil'
import { useAuthEmail } from '@/lib/hooks/useAuthEmail'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { resendConfirmation, resendLoading } = useAuthEmail()

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
        // Show confirmation screen instead of redirecting
        setSuccess(true)
        setShowConfirmation(true)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    const result = await resendConfirmation(email)
    if (result.success) {
      setError('')
    } else {
      setError(result.error || 'Failed to resend confirmation email')
    }
  }

  const handleCheckConfirmation = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) throw error
      
      if (user?.email_confirmed_at) {
        // Email confirmed, redirect to onboarding
        router.push('/onboarding')
      } else {
        setError('Email not confirmed yet. Please check your inbox and click the confirmation link.')
      }
    } catch (err: any) {
      setError('Failed to check confirmation status')
    }
  }

  // Show confirmation screen
  if (showConfirmation) {
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
              <h1 className="text-4xl font-bold text-white mb-2">Check Your Email</h1>
              <p className="text-gray-300">We've sent a confirmation link to your inbox</p>
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

              <div className="relative bg-black/90 backdrop-blur-sm rounded-2xl border border-green-500/30 shadow-2xl p-8">
                <div className="text-center mb-6">
                  <Mail className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-4">Confirmation Email Sent!</h2>
                  <p className="text-gray-300 mb-4">
                    We've sent a confirmation link to <strong className="text-white">{email}</strong>
                  </p>
                  <p className="text-sm text-gray-400 mb-6">
                    Please check your inbox and spam folder, then click the confirmation link to continue.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-500/20 text-red-200 p-4 rounded-lg mb-6 text-sm border border-red-500/30">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <button
                    onClick={handleCheckConfirmation}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all font-medium flex items-center justify-center gap-2 shadow-xl"
                  >
                    <Check className="h-4 w-4" />
                    I've Confirmed My Email
                  </button>

                  <button
                    onClick={handleResendConfirmation}
                    disabled={resendLoading}
                    className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${resendLoading ? 'animate-spin' : ''}`} />
                    {resendLoading ? 'Sending...' : 'Resend Confirmation Email'}
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-gray-400">
                    Wrong email?{' '}
                    <button
                      onClick={() => setShowConfirmation(false)}
                      className="text-red-500 hover:text-red-400 font-medium transition-colors"
                    >
                      Go back and change it
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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