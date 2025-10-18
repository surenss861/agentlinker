'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { ArrowRight, CheckCircle, Eye, EyeOff } from 'lucide-react'
import DarkVeil from '@/components/DarkVeil'

function ResetPasswordForm() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const router = useRouter()
    const supabase = createClient()
    const searchParams = useSearchParams()
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')

    useEffect(() => {
        if (accessToken && refreshToken) {
            console.log('🔍 Setting session with tokens:', { accessToken: accessToken.substring(0, 20) + '...', refreshToken: refreshToken.substring(0, 20) + '...' })

            // Set the session with the tokens from the URL
            supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
            }).then(({ data, error }) => {
                if (error) {
                    console.error('❌ Error setting session:', error)
                    setError('Invalid or expired reset link. Please request a new password reset.')
                } else {
                    console.log('✅ Session set successfully:', data.user?.id)
                }
            })
        } else {
            console.log('❌ No tokens found in URL')
            setError('Invalid reset link. Please request a new password reset.')
        }
    }, [accessToken, refreshToken, supabase.auth])

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long')
            return
        }

        setLoading(true)
        setError('')

        try {
            // First check if we have a valid session
            const { data: { user }, error: userError } = await supabase.auth.getUser()

            if (userError || !user) {
                console.error('❌ No valid session found:', userError)
                setError('Session expired. Please request a new password reset link.')
                return
            }

            console.log('🔍 Updating password for user:', user.id)

            const { error } = await supabase.auth.updateUser({
                password: password
            })

            if (error) {
                console.error('❌ Password update error:', error)
                throw error
            }

            console.log('✅ Password updated successfully')
            setSuccess(true)

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                router.push('/dashboard')
            }, 2000)

        } catch (err: any) {
            console.error('❌ Password reset failed:', err)
            setError(err.message || 'Failed to reset password')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-black relative overflow-hidden">
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
                            <h1 className="text-4xl font-bold text-white mb-2">Password Reset Complete!</h1>
                            <p className="text-gray-300">Your password has been successfully updated</p>
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

                            <div className="relative bg-black/90 backdrop-blur-sm rounded-2xl border border-green-500/30 shadow-2xl p-8 text-center">
                                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                                <p className="text-green-200 mb-6">Redirecting you to your dashboard...</p>
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
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
                        <h1 className="text-4xl font-bold text-white mb-2">Reset Your Password</h1>
                        <p className="text-gray-300">Enter your new password below</p>
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

                            <form onSubmit={handleResetPassword} className="space-y-6">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3 pr-12 bg-black/50 border border-red-500/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-400 transition-all"
                                            placeholder="••••••••"
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full px-4 py-3 pr-12 bg-black/50 border border-red-500/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-400 transition-all"
                                            placeholder="••••••••"
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl"
                                >
                                    {loading ? 'Updating Password...' : 'Update Password'}
                                    {!loading && <ArrowRight className="h-4 w-4" />}
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-gray-400">
                                    Remember your password?{' '}
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

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black relative overflow-hidden">
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
                            <div className="relative bg-black/90 backdrop-blur-sm rounded-2xl border border-red-500/30 shadow-2xl p-8 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                                <p className="text-white mt-4">Loading...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    )
}