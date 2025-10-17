'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Home, Globe } from 'lucide-react'
import { COUNTRIES } from '@/lib/utils/locations'

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    full_name: '',
    slug: '',
    phone: '',
    brokerage: '',
    bio: '',
    country: 'CA',
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        // Pre-fill name from user metadata
        if (user.user_metadata?.full_name) {
          setFormData(prev => ({
            ...prev,
            full_name: user.user_metadata.full_name,
            slug: user.user_metadata.full_name.toLowerCase().replace(/\s+/g, '-'),
          }))
        }
      }
    }
    checkAuth()
  }, [router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create or update user profile
      const { error: insertError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email!,
          full_name: formData.full_name,
          slug: formData.slug,
          phone: formData.phone || null,
          brokerage: formData.brokerage || null,
          bio: formData.bio || null,
          goal_showings: 10, // Default goal
          updated_at: new Date().toISOString(),
        })

      if (insertError) throw insertError

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-red-900/20 to-black">
        <div className="absolute inset-0 bg-gradient-to-tl from-red-800/10 via-transparent to-red-600/5"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-900/5 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Home className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Complete Your Profile</h1>
            <p className="text-gray-400">Let's set up your lead machine</p>
          </div>

          {/* ROI Reminder */}
          <div className="bg-gradient-to-r from-red-900/30 to-black/30 rounded-xl p-6 mb-6 border border-red-900/30">
            <div className="text-center">
              <p className="text-lg font-semibold text-white mb-2">🎯 Your Goal: 5-10 Showing Requests/Month</p>
              <p className="text-sm text-gray-400">Complete your profile to start converting visitors into booked showings</p>
            </div>
          </div>

          <div className="bg-neutral-900 rounded-2xl shadow-xl p-8 border border-red-900/30">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  id="full_name"
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-red-900/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-2">
                  Your AgentLinker URL *
                </label>
                <div className="flex items-center">
                  <span className="text-gray-400 bg-black px-4 py-3 rounded-l-lg border border-r-0 border-red-900/30">
                    agentlinker.ca/
                  </span>
                  <input
                    id="slug"
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                    className="flex-1 px-4 py-3 bg-black border border-red-900/30 rounded-r-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-500"
                    placeholder="your-name"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Only lowercase letters, numbers, and hyphens</p>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-2">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Country
                </label>
                <select
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-red-900/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white"
                >
                  {COUNTRIES.map(country => (
                    <option key={country.code} value={country.code} className="bg-black">
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-red-900/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-500"
                  placeholder={formData.country === 'US' ? '(555) 123-4567' : '(555) 123-4567'}
                />
              </div>

              <div>
                <label htmlFor="brokerage" className="block text-sm font-medium text-gray-300 mb-2">
                  Brokerage
                </label>
                <input
                  id="brokerage"
                  type="text"
                  value={formData.brokerage}
                  onChange={(e) => setFormData({ ...formData, brokerage: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-red-900/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-500"
                  placeholder="e.g., RE/MAX, Keller Williams"
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-red-900/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-500"
                  placeholder="Tell potential clients about yourself..."
                />
              </div>


              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'Creating your AgentLinker...' : 'Complete Setup & Start Trial'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

