'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import NavBar from '@/components/NavBar'
import { Check, Crown, Zap, Star } from 'lucide-react'

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
      tier: 'business',
      name: 'AgentLinker Business',
      price: 25,
      billing: 'one-time verification',
      description: 'Get verified + unlock premium features',
      icon: Star,
      popular: false,
      features: [
        'Verified agent badge',
        'All Pro features included',
        'Premium listing placement',
        'Priority in search results',
        'Advanced analytics',
        'Team collaboration tools',
        'White-label options',
        'Dedicated account manager',
        'Custom integrations',
        'API access',
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
                  onClick={() => handleUpgrade('business')}
                  className="px-6 py-3 bg-[#912F40] text-white rounded-xl hover:bg-[#702632] transition-all font-medium"
                >
                  Upgrade to Business
                </button>
              </div>
            </div>
          </div>
        )}

        {agent?.subscription_tier === 'business' && (
          <div className="bg-gradient-to-r from-[#F3C77E]/20 to-[#912F40]/20 backdrop-blur-md rounded-2xl p-8 mb-8 border border-[#F3C77E]/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  ✓ Verified Agent: AgentLinker Business ($25 one-time)
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


        {/* Premium Add-on - Side by Side with Pricing */}
        <div className="grid md:grid-cols-2 gap-8">
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

          {/* Business Plan */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-[#F3C77E] overflow-hidden">
            <div className="bg-gradient-to-r from-[#F3C77E] to-[#912F40] text-white text-center py-3 text-sm font-bold">
              ⚡ EVERYTHING INCLUDED
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#F3C77E] to-[#912F40] rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">AgentLinker Business</h3>
                  <p className="text-gray-400 text-sm">Verified agent badge + all Pro features</p>
                </div>
              </div>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-white mb-2">
                  $25
                  <span className="text-lg text-gray-400"> one-time</span>
                </div>
                <span className="inline-block bg-[#F3C77E] text-[#080705] px-3 py-1 rounded-full text-sm font-semibold">
                  Verified Badge
                </span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#F3C77E] flex-shrink-0" />
                  <span className="text-gray-300 text-sm">Everything in Pro plan</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#F3C77E] flex-shrink-0" />
                  <span className="text-gray-300 text-sm">Verified agent badge</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#F3C77E] flex-shrink-0" />
                  <span className="text-gray-300 text-sm">Lifetime access</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#F3C77E] flex-shrink-0" />
                  <span className="text-gray-300 text-sm">No monthly fees</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#F3C77E] flex-shrink-0" />
                  <span className="text-gray-300 text-sm">Premium support</span>
                </li>
              </ul>
              <button
                onClick={() => handleUpgrade('business')}
                disabled={agent?.subscription_tier === 'business' || processingUpgrade === 'business'}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${agent?.subscription_tier === 'business'
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : processingUpgrade === 'business'
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#F3C77E] to-[#912F40] text-white hover:from-[#F3C77E]/80 hover:to-[#912F40]/80 hover:scale-105 shadow-[0_0_20px_rgba(243,199,126,0.3)]'
                  }`}
              >
                {agent?.subscription_tier === 'business' ? 'Current Plan' : processingUpgrade === 'business' ? 'Processing...' : 'Get Started - $25 one-time'}
              </button>
              <p className="text-center text-gray-400 text-xs mt-3">
                One-time payment • Lifetime access
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

