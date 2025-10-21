'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import NavBar from '@/components/NavBar'
import { Check, Crown, Zap, Star, Users } from 'lucide-react'

export default function BillingPage() {
  const [loading, setLoading] = useState(true)
  const [agent, setAgent] = useState<any>(null)
  const [processingUpgrade, setProcessingUpgrade] = useState<string | null>(null)

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
      }
      setLoading(false)
    }

    fetchAgent()
  }, [router, supabase])

  // Handle success/cancel redirects
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const canceled = urlParams.get('canceled')

    if (canceled === 'true') {
      console.log('❌ Checkout canceled')
      alert('Checkout was canceled. You can try again anytime.')
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])



  const handleUpgrade = async (tier: string) => {
    console.log('🚀 Starting upgrade process for tier:', tier)
    setProcessingUpgrade(tier)

    try {
      console.log('📡 Calling /api/stripe/checkout with tier:', tier)
      // Create Stripe Checkout Session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tier }),
      })

      console.log('📡 API Response status:', response.status)
      const data = await response.json()
      console.log('📡 API Response data:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        console.log('🔄 Redirecting to:', data.url)
        window.location.href = data.url
      } else {
        console.error('❌ No URL returned from API')
        alert('No checkout URL received. Please try again.')
      }
    } catch (error) {
      console.error('❌ Upgrade error:', error)
      alert('Upgrade failed. Please try again.')
    } finally {
      setProcessingUpgrade(null)
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-white">Loading billing...</div>
        </div>
      </div>
    )
  }

  const plans = [
    {
      tier: 'pro',
      name: 'AgentLinker Pro',
      price: 20,
      billing: 'per month',
      description: 'Everything you need to grow your real estate business',
      icon: Crown,
      popular: true,
      features: [
        'Unlimited listings',
        'All premium templates (Luxury, Modern, Minimalist)',
        'Booking scheduler integration',
        'Lead capture with instant notifications',
        'Analytics dashboard',
        'Custom domain support',
        'No watermark',
        'Priority support',
        'CRM-ready integration',
        'Mobile-optimized pages',
      ],
    },
    {
      tier: 'verified',
      name: 'Verified Badge',
      price: 25,
      billing: 'one-time',
      description: 'Get the blue checkmark verified badge',
      icon: Star,
      popular: false,
      features: [
        'Verified agent badge (✓)',
        'Increases trust & credibility',
        'Stand out from other agents',
        'Shows on your public profile',
        'Shows next to your name',
        'Lifetime verified status',
        'One-time payment only',
        'Does NOT include Pro features',
      ],
    },
    {
      tier: 'help',
      name: 'Personal Help Pack',
      price: 50,
      billing: 'per month',
      description: 'Personal assistance with listings and website setup',
      icon: Users,
      popular: false,
      features: [
        'Personal 1-on-1 consultation',
        'Help updating your listings',
        'Website setup assistance',
        'Troubleshooting support',
        'Custom listing optimization',
        'Photo organization help',
        'SEO guidance for listings',
        'Mobile optimization tips',
        'Lead generation strategies',
        'Priority email support',
      ],
    },
  ]

  return (
    <>
      <NavBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Billing & Subscription</h1>
          <p className="text-gray-400 mt-2">
            Current plan: <span className="font-semibold capitalize text-[#F3C77E]">{agent?.subscription_tier || 'Free'}</span>
          </p>
        </div>



        {agent?.subscription_tier === 'pro' && (
          <div className="bg-gradient-to-r from-[#F3C77E]/20 to-[#912F40]/20 backdrop-blur-md rounded-2xl p-8 mb-8 border border-[#F3C77E]/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  ✓ Active Subscription: AgentLinker Pro ($20/month)
                </h3>
                <p className="text-gray-300">
                  Next billing date: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => window.open('https://billing.stripe.com/p/login/test_123', '_blank')}
                  className="px-6 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-all font-medium border border-white/20"
                >
                  Manage Billing
                </button>
                <button
                  onClick={() => handleUpgrade('verified')}
                  className="px-6 py-3 bg-[#912F40] text-white rounded-xl hover:bg-[#702632] transition-all font-medium"
                >
                  Get Verified Badge
                </button>
              </div>
            </div>
          </div>
        )}

        {agent?.verified_badge && (
          <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 backdrop-blur-md rounded-2xl p-8 mb-8 border border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-3">
                  <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified Badge Active ($25 one-time)
                </h3>
                <p className="text-gray-300">
                  Verification completed: Lifetime access to all features
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => window.open('https://billing.stripe.com/p/login/test_123', '_blank')}
                  className="px-6 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-all font-medium border border-white/20"
                >
                  View Invoice
                </button>
                <button
                  onClick={() => handleUpgrade('pro')}
                  className="px-6 py-3 bg-[#F3C77E] text-[#080705] rounded-xl hover:bg-[#FFD89C] transition-all font-medium"
                >
                  Add Pro Features
                </button>
              </div>
            </div>
          </div>
        )}

        {agent?.subscription_tier === 'help' && (
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-8 mb-8 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  ✓ Active Subscription: Personal Help Pack ($50/month)
                </h3>
                <p className="text-gray-300">
                  Personal assistance service active - Next billing: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => window.open('https://billing.stripe.com/p/login/test_123', '_blank')}
                  className="px-6 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-all font-medium border border-white/20"
                >
                  Manage Billing
                </button>
                <button
                  onClick={() => window.open('mailto:contact@agentlinker.ca?subject=Personal Help Pack - Schedule Consultation', '_blank')}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-medium"
                >
                  Schedule Consultation
                </button>
              </div>
            </div>
          </div>
        )}

        {agent?.subscription_tier === 'free' && (
          <div className="bg-gradient-to-r from-gray-500/20 to-gray-600/20 backdrop-blur-md rounded-2xl p-8 mb-8 border border-gray-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Free Plan: Basic Features
                </h3>
                <p className="text-gray-300">
                  Upgrade to unlock unlimited bookings, analytics, and premium features
                </p>
              </div>
              <button
                onClick={() => handleUpgrade('pro')}
                className="px-6 py-3 bg-[#F3C77E] text-[#080705] rounded-xl hover:bg-[#FFD89C] transition-all font-medium"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        )}


        {/* Premium Add-on - Three Column Pricing */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Pro Plan */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-[#912F40] overflow-hidden">
            <div className="bg-gradient-to-r from-[#912F40] to-[#702632] text-white text-center py-3 text-sm font-bold">
              ⚡ EVERYTHING INCLUDED
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#F3C77E] to-[#912F40] rounded-xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">AgentLinker Pro</h3>
                  <p className="text-gray-400 text-sm">Everything you need to grow your real estate business</p>
                </div>
              </div>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-white mb-2">
                  $20
                  <span className="text-lg text-gray-400">/month</span>
                </div>
                <span className="inline-block bg-[#F3C77E] text-[#080705] px-3 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#F3C77E] flex-shrink-0" />
                  <span className="text-gray-300 text-sm">Unlimited listings</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#F3C77E] flex-shrink-0" />
                  <span className="text-gray-300 text-sm">Advanced analytics & ROI tracking</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#F3C77E] flex-shrink-0" />
                  <span className="text-gray-300 text-sm">Real-time booking scheduler</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#F3C77E] flex-shrink-0" />
                  <span className="text-gray-300 text-sm">Email notifications</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#F3C77E] flex-shrink-0" />
                  <span className="text-gray-300 text-sm">Priority support</span>
                </li>
              </ul>
              <button
                onClick={() => handleUpgrade('pro')}
                disabled={agent?.subscription_tier === 'pro' || processingUpgrade === 'pro'}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${agent?.subscription_tier === 'pro'
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : processingUpgrade === 'pro'
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#F3C77E] to-[#912F40] text-white hover:from-[#F3C77E]/80 hover:to-[#912F40]/80 hover:scale-105 shadow-[0_0_20px_rgba(243,199,126,0.3)]'
                  }`}
              >
                {agent?.subscription_tier === 'pro' ? 'Current Plan' : processingUpgrade === 'pro' ? 'Processing...' : 'Get Started - $20/month'}
              </button>
              <p className="text-center text-gray-400 text-xs mt-3">
                No credit card required • Cancel anytime
              </p>
            </div>
          </div>

          {/* Verified Badge */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-blue-400/50 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-3 text-sm font-bold">
              ✓ VERIFIED BADGE ONLY
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Verified Badge</h3>
                  <p className="text-gray-400 text-sm">Get the blue checkmark - No Pro features</p>
                </div>
              </div>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-white mb-2">
                  $25
                  <span className="text-lg text-gray-400"> one-time</span>
                </div>
                <span className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Badge Only
                </span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">Verified agent badge (✓)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">Shows on public profile</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">Increases trust & credibility</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">Lifetime verified status</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">One-time payment only</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-400 text-sm line-through">Does NOT include Pro features</span>
                </li>
              </ul>
              <button
                onClick={() => handleUpgrade('verified')}
                disabled={agent?.verified_badge || processingUpgrade === 'verified'}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${agent?.verified_badge
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : processingUpgrade === 'verified'
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:scale-105 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                  }`}
              >
                {agent?.verified_badge ? 'Already Verified ✓' : processingUpgrade === 'verified' ? 'Processing...' : 'Get Verified - $25 one-time'}
              </button>
              <p className="text-center text-gray-400 text-xs mt-3">
                One-time payment • Badge only • No Pro access
              </p>
            </div>
          </div>

          {/* Personal Help Pack */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-purple-400/50 overflow-hidden relative group">
            {/* Premium Badge */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-1 rounded-full text-xs font-bold border border-purple-400/50 z-10">
              👨‍💼 PERSONAL ASSISTANCE
            </div>

            <div className="bg-gradient-to-r from-purple-600/20 to-pink-500/20 text-white text-center py-4 text-sm font-bold border-b border-purple-400/30">
              ⚡ EVERYTHING INCLUDED
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Personal Help Pack</h3>
                  <p className="text-purple-200 text-sm font-medium">Personal assistance with listings and setup</p>
                </div>
              </div>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  $50
                  <span className="text-lg text-gray-300">/month</span>
                </div>
                <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                  Personal Help
                </span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-200 text-sm">Personal 1-on-1 consultation</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-200 text-sm">Help updating your listings</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-200 text-sm">Website setup assistance</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-200 text-sm">Troubleshooting support</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-200 text-sm">Priority email support</span>
                </li>
              </ul>
              <button
                onClick={() => handleUpgrade('help')}
                disabled={agent?.subscription_tier === 'help' || processingUpgrade === 'help'}
                className={`w-full py-3 rounded-xl font-semibold transition-all transform duration-200 ${agent?.subscription_tier === 'help'
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : processingUpgrade === 'help'
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:scale-105 shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.6)]'
                  }`}
              >
                {agent?.subscription_tier === 'help' ? 'Current Plan' : processingUpgrade === 'help' ? 'Processing...' : 'Get Personal Help - $50/month'}
              </button>
              <p className="text-center text-purple-300 text-xs mt-3 font-medium">
                Monthly subscription • Personal assistance
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

