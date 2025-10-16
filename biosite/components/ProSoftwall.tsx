'use client'

import { useState } from 'react'
import { Lock, Crown, Zap, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ProSoftwallProps {
  feature: string
  description: string
  children: React.ReactNode
  requiredTier?: 'pro' | 'business'
  className?: string
}

export default function ProSoftwall({ 
  feature, 
  description, 
  children, 
  requiredTier = 'pro',
  className = '' 
}: ProSoftwallProps) {
  const [showUpgrade, setShowUpgrade] = useState(false)
  const router = useRouter()

  const handleUpgrade = () => {
    router.push('/dashboard/billing')
  }

  return (
    <div className={`relative ${className}`}>
      {children}
      
      {/* Subtle upgrade indicator - only shows on hover */}
      <div 
        className="absolute top-4 right-4 bg-gradient-to-r from-[#F3C77E] to-[#912F40] text-white px-3 py-1 rounded-full text-xs font-medium opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer flex items-center gap-1"
        onClick={() => setShowUpgrade(true)}
      >
        <Lock className="w-3 h-3" />
        <span>Upgrade</span>
      </div>
    </div>
  )
}

// Modal for upgrade prompt
export function UpgradeModal({ 
  isOpen, 
  onClose, 
  feature, 
  description, 
  requiredTier = 'pro' 
}: {
  isOpen: boolean
  onClose: () => void
  feature: string
  description: string
  requiredTier?: 'pro' | 'business'
}) {
  const router = useRouter()

  const handleUpgrade = () => {
    router.push('/dashboard/billing')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 max-w-md w-full">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#F3C77E] to-[#912F40] rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">
            Unlock {feature}
          </h2>
          
          <p className="text-gray-300 mb-6">
            {description}
          </p>
          
          <div className="space-y-3">
            <button
              onClick={handleUpgrade}
              className="w-full py-3 bg-gradient-to-r from-[#F3C77E] to-[#912F40] text-white rounded-xl font-semibold hover:from-[#F3C77E]/80 hover:to-[#912F40]/80 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Upgrade to {requiredTier === 'business' ? 'Business' : 'Pro'}
            </button>
            
            <button
              onClick={onClose}
              className="w-full py-2 text-gray-400 hover:text-white transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
