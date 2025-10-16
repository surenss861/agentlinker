'use client'

import { motion } from 'framer-motion'
import { Eye, Users, Calendar, BarChart3 } from 'lucide-react'

interface ProgressRingProps {
  views: number
  requests: number
  bookings: number
  listings: number
}

export default function ProgressRings({ views, requests, bookings, listings }: ProgressRingProps) {
  // Calculate progress percentages (normalized to 0-100)
  const viewsProgress = Math.min((views / 50) * 100, 100) // Max 50 views = 100%
  const requestsProgress = Math.min((requests / 10) * 100, 100) // Max 10 requests = 100%
  const bookingsProgress = Math.min((bookings / 5) * 100, 100) // Max 5 bookings = 100%
  const listingsProgress = Math.min((listings / 20) * 100, 100) // Max 20 listings = 100%

  const rings = [
    { 
      progress: viewsProgress, 
      label: 'Views', 
      value: views, 
      icon: Eye, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/20'
    },
    { 
      progress: requestsProgress, 
      label: 'Requests', 
      value: requests, 
      icon: Users, 
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/20'
    },
    { 
      progress: bookingsProgress, 
      label: 'Bookings', 
      value: bookings, 
      icon: Calendar, 
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/20'
    },
    { 
      progress: listingsProgress, 
      label: 'Listings', 
      value: listings, 
      icon: BarChart3, 
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/20'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {rings.map((ring, index) => {
        const Icon = ring.icon
        const circumference = 2 * Math.PI * 45 // radius of 45
        const strokeDasharray = circumference
        const strokeDashoffset = circumference - (ring.progress / 100) * circumference

        return (
          <motion.div
            key={ring.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative"
          >
            <div className={`${ring.bgColor} rounded-2xl p-6 text-center border border-white/10 backdrop-blur-sm`}>
              {/* Progress Ring */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="8"
                    fill="none"
                  />
                  {/* Progress circle */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke={`url(#gradient-${index})`}
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={strokeDasharray}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 2, delay: index * 0.2, ease: "easeInOut" }}
                  />
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={ring.color.includes('blue') ? '#3b82f6' : 
                                                   ring.color.includes('green') ? '#10b981' :
                                                   ring.color.includes('purple') ? '#8b5cf6' : '#f59e0b'} />
                      <stop offset="100%" stopColor={ring.color.includes('blue') ? '#2563eb' : 
                                                     ring.color.includes('green') ? '#059669' :
                                                     ring.color.includes('purple') ? '#7c3aed' : '#d97706'} />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Icon className="w-6 h-6 text-white mb-1" />
                  <span className="text-lg font-bold text-white">{ring.value}</span>
                </div>
              </div>
              
              {/* Label and percentage */}
              <div>
                <p className="text-sm text-gray-300 font-medium">{ring.label}</p>
                <p className="text-xs text-gray-400">{Math.round(ring.progress)}% of goal</p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
