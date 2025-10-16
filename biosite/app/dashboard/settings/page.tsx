'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import NavBar from '@/components/NavBar'
import { Save, Upload, ExternalLink, User, Building, Hash, Globe, Instagram, Facebook, Linkedin, Twitter, CheckCircle, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { COUNTRIES, formatPhoneNumber } from '@/lib/utils/locations'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [agent, setAgent] = useState<any>(null)
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    bio: '',
    brokerage: '',
    license_number: '',
    slug: '',
    country: 'CA',
    template: 'dark',
    verified_badge: false,
    social_links: {
      instagram: '',
      facebook: '',
      linkedin: '',
      twitter: '',
    },
  })

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchAgent = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setAgent(data)
        setProfilePhotoUrl(data.profile_photo_url)
        setFormData({
          full_name: data.full_name || '',
          email: data.email || '',
          phone: data.phone || '',
          bio: data.bio || '',
          brokerage: data.brokerage || '',
          license_number: data.license_number || '',
          slug: data.slug || '',
          country: data.country || 'CA',
          template: data.template || 'dark',
          verified_badge: data.verified_badge || false,
          social_links: data.social_links || { instagram: '', facebook: '', linkedin: '', twitter: '' },
        })
      }
      setLoading(false)
    }

    fetchAgent()
  }, [router, supabase])

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !agent) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showMessage('error', 'Please upload an image file')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showMessage('error', 'Image must be less than 2MB')
      return
    }

    setUploading(true)

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${agent.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath)

      // Update user profile
      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_photo_url: publicUrl })
        .eq('id', agent.id)

      if (updateError) throw updateError

      setProfilePhotoUrl(publicUrl)
      showMessage('success', '✅ Profile photo updated!')
    } catch (error: any) {
      console.error('Upload error:', error)
      showMessage('error', error.message || 'Failed to upload photo')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Validation
      if (!formData.full_name.trim()) {
        throw new Error('Full name is required')
      }
      if (!formData.email.trim()) {
        throw new Error('Email is required')
      }
      if (!formData.slug.trim()) {
        throw new Error('AgentLinker URL is required')
      }

      // Phone validation (if provided)
      if (formData.phone && !/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
        throw new Error('Phone number must be at least 10 digits')
      }

      // URL validation for social links
      const urlRegex = /^https?:\/\/.+/
      for (const [platform, url] of Object.entries(formData.social_links)) {
        if (url && !urlRegex.test(url)) {
          throw new Error(`${platform} link must be a valid URL starting with http:// or https://`)
        }
      }

      const { error } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          bio: formData.bio,
          brokerage: formData.brokerage,
          license_number: formData.license_number,
          slug: formData.slug,
          template: formData.template,
          social_links: formData.social_links,
        })
        .eq('id', agent.id)

      if (error) throw error

      showMessage('success', '✅ Settings saved successfully!')
    } catch (error: any) {
      showMessage('error', error.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-white">Loading settings...</div>
        </div>
      </div>
    )
  }


  return (
    <>
      <NavBar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                ⚙️ Settings
                {formData.verified_badge && (
                  <span className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-500/30">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified Agent
                  </span>
                )}
              </h1>
              {formData.verified_badge && (
                <p className="text-blue-400 text-sm mt-2">
                  🎉 Your profile is verified! This badge shows on your public page.
                </p>
              )}
              <p className="text-gray-400">Manage your profile and preferences</p>
            </div>
          </div>
        </div>

        {/* Message Toast */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl backdrop-blur-md flex items-center gap-3 ${message.type === 'success'
              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
              : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        {/* Subscription Plan */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 p-8 mb-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
            <Building className="w-5 h-5 text-[#F3C77E]" />
            Subscription Plan
          </h2>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#912F40] to-[#702632] rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">
                  {agent?.subscription_tier === 'pro' ? 'Pro Plan' :
                    agent?.subscription_tier === 'business' ? 'Business Plan' : 'Free Plan'}
                </h3>
                <p className="text-gray-400 text-sm">
                  {agent?.subscription_tier === 'pro' ? '$20/month - Full access to all features' :
                    agent?.subscription_tier === 'business' ? '$25 one-time - Verified agent badge' :
                      'Free - Basic features only'}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-white font-semibold text-lg">
                {agent?.subscription_tier === 'pro' ? '$20' :
                  agent?.subscription_tier === 'business' ? '$25' : 'Free'}
              </div>
              <div className="text-gray-400 text-sm">
                {agent?.subscription_tier === 'pro' ? 'per month' :
                  agent?.subscription_tier === 'business' ? 'one-time' : 'forever'}
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => router.push('/dashboard/billing')}
              className="px-6 py-3 bg-[#912F40] text-white rounded-lg hover:bg-[#702632] transition-all font-medium flex items-center gap-2"
            >
              <Building className="w-4 h-4" />
              Manage Subscription
            </button>

            {agent?.subscription_tier === 'free' && (
              <button
                type="button"
                onClick={() => router.push('/dashboard/billing')}
                className="px-6 py-3 bg-gradient-to-r from-[#F3C77E] to-[#912F40] text-white rounded-lg hover:from-[#F3C77E]/80 hover:to-[#912F40]/80 transition-all font-medium flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Upgrade Plan
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Information */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 p-8">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
              <User className="w-5 h-5 text-[#F3C77E]" />
              Profile Information
            </h2>

            <div className="space-y-6">
              {/* Profile Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24">
                    {profilePhotoUrl ? (
                      <Image
                        src={profilePhotoUrl}
                        alt="Profile"
                        fill
                        sizes="128px"
                        className="rounded-full object-cover border-2 border-[#F3C77E]/30"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-[#912F40]/30 to-[#702632]/30 rounded-full border-2 border-[#F3C77E]/30 flex items-center justify-center">
                        <User className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-all text-sm font-medium border border-white/20 disabled:opacity-50"
                    >
                      <Upload className="h-4 w-4" />
                      {uploading ? 'Uploading...' : 'Upload Photo'}
                    </button>
                    <p className="text-xs text-gray-400 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#F3C77E] focus:border-[#F3C77E] text-white placeholder-gray-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#F3C77E] focus:border-[#F3C77E] text-white placeholder-gray-500 transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Country
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#F3C77E] focus:border-[#F3C77E] text-white transition-all"
                  >
                    {COUNTRIES.map(country => (
                      <option key={country.code} value={country.code} className="bg-[#080705]">
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#F3C77E] focus:border-[#F3C77E] text-white placeholder-gray-500 transition-all"
                    placeholder={formData.country === 'US' ? '(555) 123-4567' : '(555) 123-4567'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Building className="w-4 h-4 inline mr-1" />
                    Brokerage
                  </label>
                  <input
                    type="text"
                    value={formData.brokerage}
                    onChange={(e) => setFormData({ ...formData, brokerage: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#F3C77E] focus:border-[#F3C77E] text-white placeholder-gray-500 transition-all"
                    placeholder="XYZ Realty"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Hash className="w-4 h-4 inline mr-1" />
                    License Number
                  </label>
                  <input
                    type="text"
                    value={formData.license_number}
                    onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#F3C77E] focus:border-[#F3C77E] text-white placeholder-gray-500 transition-all"
                    placeholder="RE123456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Globe className="w-4 h-4 inline mr-1" />
                    AgentLinker URL *
                  </label>
                  <div className="flex items-center">
                    <span className="text-gray-400 bg-black/70 px-3 py-3 rounded-l-lg border border-r-0 border-white/10 text-sm">
                      agentlinker.ca/
                    </span>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                      className="flex-1 px-4 py-3 border border-white/10 rounded-r-lg focus:ring-2 focus:ring-[#F3C77E] focus:border-[#F3C77E] bg-black/50 text-white placeholder-gray-500 transition-all"
                      placeholder="john-doe"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#F3C77E] focus:border-[#F3C77E] text-white placeholder-gray-500 transition-all resize-none"
                  placeholder="Tell clients about your experience, expertise, and what makes you stand out..."
                />
              </div>
            </div>
          </div>


          {/* Social Links */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 p-8">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
              <Globe className="w-5 h-5 text-[#F3C77E]" />
              Social Links
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { key: 'instagram', icon: Instagram, color: 'text-pink-400', placeholder: 'https://instagram.com/yourprofile' },
                { key: 'facebook', icon: Facebook, color: 'text-blue-400', placeholder: 'https://facebook.com/yourprofile' },
                { key: 'linkedin', icon: Linkedin, color: 'text-blue-500', placeholder: 'https://linkedin.com/in/yourprofile' },
                { key: 'twitter', icon: Twitter, color: 'text-sky-400', placeholder: 'https://twitter.com/yourprofile' }
              ].map(({ key, icon: Icon, color, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-300 mb-2 capitalize flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${color}`} />
                    {key}
                  </label>
                  <input
                    type="url"
                    value={(formData.social_links as any)[key]}
                    onChange={(e) => setFormData({
                      ...formData,
                      social_links: { ...formData.social_links, [key]: e.target.value }
                    })}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#F3C77E] focus:border-[#F3C77E] text-white placeholder-gray-500 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <a
              href={`/${agent?.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm text-white rounded-xl hover:bg-white/10 transition-all font-medium border border-white/20"
            >
              <ExternalLink className="h-5 w-5" />
              Preview Page
            </a>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#F3C77E] to-[#FFD89C] text-[#080705] rounded-xl font-bold hover:shadow-[0_0_25px_rgba(243,199,126,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </main>
    </>
  )
}
