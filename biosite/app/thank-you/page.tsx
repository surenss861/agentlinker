'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, Crown, Zap, Star, Users, ArrowRight, Home, Calendar } from 'lucide-react'
import Link from 'next/link'

function ThankYouContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [tier, setTier] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const tierParam = searchParams.get('tier')
    if (tierParam) {
      setTier(tierParam)
    }
    setLoading(false)
  }, [searchParams])

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'pro':
        return {
          name: 'Pro Plan',
          price: '$20/month',
          icon: Crown,
          color: 'from-blue-500 to-purple-600',
          features: [
            'Unlimited listings',
            'Advanced analytics',
            'Booking scheduler',
            'Real-time leads',
            'Priority support',
            'Custom domain'
          ],
          nextSteps: [
            'Access your dashboard',
            'Add your first listing',
            'Set up your booking calendar',
            'Share your AgentLinker profile'
          ]
        }
      case 'business':
        return {
          name: 'Business Plan',
          price: '$25/month',
          icon: Star,
          color: 'from-green-500 to-blue-600',
          features: [
            'Everything in Pro',
            'Verified badge',
            'Advanced templates',
            'Email notifications',
            'Google Calendar sync',
            'Priority support'
          ],
          nextSteps: [
            'Access your dashboard',
            'Enable verified badge',
            'Set up email notifications',
            'Connect Google Calendar'
          ]
        }
      case 'help':
        return {
          name: 'Personal Help Pack',
          price: '$50/month',
          icon: Users,
          color: 'from-purple-500 to-pink-600',
          features: [
            'Everything in Pro & Business',
            'Personal 1-on-1 consultation',
            'Help updating listings',
            'Website setup assistance',
            'Troubleshooting support',
            'Priority email support'
          ],
          nextSteps: [
            'Access your dashboard',
            'Schedule your consultation',
            'Get personal assistance',
            'Optimize your listings'
          ]
        }
      default:
        return {
          name: 'Subscription',
          price: 'Active',
          icon: CheckCircle,
          color: 'from-gray-500 to-gray-600',
          features: ['Your subscription is now active'],
          nextSteps: ['Access your dashboard']
        }
    }
  }

  const tierInfo = getTierInfo(tier)

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-red-900/20 to-black">
        <div className="absolute inset-0 bg-gradient-to-tl from-red-800/10 via-transparent to-red-600/5"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-900/5 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Success Animation */}
          <div className="mb-8">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-full blur-xl animate-ping"></div>
            </div>
          </div>

          {/* Main Message */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              🎉 Payment Successful!
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4">
              Welcome to <span className="text-red-400 font-semibold">AgentLinker</span>
            </p>
            <p className="text-lg text-gray-400">
              Your {tierInfo.name} subscription is now active
            </p>
          </div>

          {/* Subscription Card */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 mb-12 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className={`w-16 h-16 bg-gradient-to-r ${tierInfo.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <tierInfo.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-3xl font-bold text-white">{tierInfo.name}</h2>
                <p className="text-xl text-gray-300">{tierInfo.price}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">✅ What's Included:</h3>
                <ul className="space-y-2 text-left">
                  {tierInfo.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">🚀 Next Steps:</h3>
                <ul className="space-y-2 text-left">
                  {tierInfo.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-300">
                      <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105 transform duration-200"
            >
              <Home className="w-5 h-5" />
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>

            {tier === 'help' && (
              <Link
                href="mailto:contact@agentlinker.ca?subject=Personal Help Pack - Schedule Consultation"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105 transform duration-200"
              >
                <Calendar className="w-5 h-5" />
                Schedule Consultation
              </Link>
            )}
          </div>

          {/* Additional Info */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">📧 What happens next?</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Subscription activated instantly</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Receipt sent to your email</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Full access to all features</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              Need help? Contact us at{' '}
              <a href="mailto:contact@agentlinker.ca" className="text-red-400 hover:text-red-300">
                contact@agentlinker.ca
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  )
}