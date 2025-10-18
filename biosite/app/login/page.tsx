'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { ArrowRight, Mail, CheckCircle } from 'lucide-react'
import DarkVeil from '@/components/DarkVeil'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetMessage, setResetMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address first')
      return
    }

    setResetLoading(true)
    setError('')
    setResetMessage('')

    try {
      console.log('🔍 Starting password reset for:', email)
      console.log('🔍 Redirect URL:', `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/reset-password`)

      // Use Supabase's password reset but with custom redirect
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/reset-password`,
      })

      if (error) {
        console.error('❌ Password reset error:', error)
        console.error('❌ Error details:', {
          message: error.message,
          status: error.status
        })
        throw error
      }

      console.log('✅ Password reset email sent successfully')
      setResetMessage('Password reset email sent! Check your inbox and spam folder.')
    } catch (err: any) {
      console.error('❌ Password reset failed:', err)
      setError(err.message || 'Failed to send reset email')
    } finally {
      setResetLoading(false)
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
            <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-300">Sign in to your AgentLinker account</p>
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

              {resetMessage && (
                <div className="bg-green-500/20 text-green-200 p-4 rounded-lg mb-6 text-sm border border-green-500/30">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    {resetMessage}
                  </div>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
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
                  />
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={handlePasswordReset}
                      disabled={resetLoading}
                      className="text-sm text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                    >
                      {resetLoading ? 'Sending...' : 'Forgot password?'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  Don't have an account?{' '}
                  <Link href="/signup" className="text-red-500 hover:text-red-400 font-medium transition-colors">
                    Sign up
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