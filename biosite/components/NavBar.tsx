'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, LayoutDashboard, FileText, Calendar, TrendingUp, Settings, LogOut, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useSubscription } from '@/lib/hooks/useSubscription'
import { useState } from 'react'
import { UpgradeModal } from '@/components/ProSoftwall'

export default function NavBar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { subscription, hasFeature } = useSubscription()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeFeature, setUpgradeFeature] = useState('')

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, requiresPro: false },
    { name: 'Listings', href: '/dashboard/listings', icon: FileText, requiresPro: false },
    { name: 'Leads', href: '/dashboard/leads', icon: Home, requiresPro: true },
    { name: 'Bookings', href: '/dashboard/bookings', icon: Calendar, requiresPro: true },
    { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp, requiresPro: true },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings, requiresPro: false },
  ]

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleNavClick = (item: any, e: React.MouseEvent) => {
    // Allow navigation but show upgrade modal for pro features
    if (item.requiresPro && !hasFeature('analytics')) {
      setUpgradeFeature(item.name)
      setShowUpgradeModal(true)
    }
  }

  return (
    <nav className="bg-black/95 backdrop-blur-sm border-b border-red-900/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/dashboard" className="flex items-center">
              <img 
                src="/agentlinkerpfp.png" 
                alt="AgentLinker" 
                className="h-8 w-8 rounded-full"
              />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                AgentLinker
              </span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                const isRestricted = item.requiresPro && !hasFeature('analytics')
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleNavClick(item, e)}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'text-red-500 bg-red-950/30'
                        : isRestricted
                        ? 'text-gray-500 hover:text-gray-400 hover:bg-neutral-900'
                        : 'text-gray-400 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                    {isRestricted && <Lock className="h-3 w-3 ml-1" />}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleSignOut}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 hover:text-red-500 rounded-lg transition-all duration-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature={upgradeFeature}
        description={`Upgrade to Pro to access ${upgradeFeature.toLowerCase()} and unlock advanced features for your real estate business.`}
        requiredTier="pro"
      />
    </nav>
  )
}

