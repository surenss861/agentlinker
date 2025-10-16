'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, ArrowRight, Crown, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ThankYouPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tier, setTier] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const tierParam = searchParams.get('tier')
    if (tierParam) {
      setTier(tierParam)
    }
    setLoading(false)
  }, [searchParams])

  const handleGoToDashboard = () => {
    router.push('/dashboard')
  }

  const getTierDisplayName = (tier: string) => {
    switch (tier) {
      case 'pro':
        return 'AgentLinker Pro'
      case 'business':
        return 'AgentLinker Business'
      default:
        return 'Premium Plan'
    }
  }

  const getTierFeatures = (tier: string) => {
    switch (tier) {
      case 'pro':
        return [
          'Unlimited listings',
          'Advanced analytics & ROI tracking',
          'Real-time booking scheduler',
          'Email notifications',
          'Priority support'
        ]
      case 'business':
        return [
          'Everything in Pro plan',
          'Verified agent badge',
          'Lifetime access',
          'No monthly fees',
          'Premium support'
        ]
      default:
        return ['Premium features unlocked']
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#F3C77E]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 max-w-2xl w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>

        {/* Success Message */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold text-white mb-4"
        >
          🎉 Upgrade Successful!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-300 mb-8"
        >
          Welcome to <span className="text-[#F3C77E] font-bold">{getTierDisplayName(tier)}</span>
        </motion.p>

        {/* Plan Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/10"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-[#F3C77E] to-[#912F40] rounded-full flex items-center justify-center">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Your New Features</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
            {getTierFeatures(tier).map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-2 text-gray-300"
              >
                <Zap className="w-4 h-4 text-[#F3C77E]" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={handleGoToDashboard}
          className="w-full py-4 bg-gradient-to-r from-[#F3C77E] to-[#912F40] text-white rounded-xl font-semibold hover:from-[#F3C77E]/80 hover:to-[#912F40]/80 transition-all flex items-center justify-center gap-3 text-lg"
        >
          Go to Dashboard
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        {/* Additional Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-gray-400 text-sm mt-6"
        >
          Your subscription is now active. You can manage your billing anytime from the dashboard.
        </motion.p>
      </motion.div>
    </div>
  )
}
