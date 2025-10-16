'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import AnimatedCounter from './AnimatedCounter'
import { Eye, Users, Calendar, BarChart3 } from 'lucide-react'

interface Stat {
  name: string
  value: number
  iconName: string
  growth: string
}

const iconMap: Record<string, any> = {
  Eye,
  Users,
  Calendar,
  BarChart3,
}

const getNavigationPath = (statName: string): string => {
  switch (statName) {
    case 'Total Views':
      return '/dashboard/analytics'
    case 'Showing Requests':
      return '/dashboard/leads'
    case 'Booked Showings':
      return '/dashboard/bookings'
    case 'Active Listings':
      return '/dashboard/listings'
    default:
      return '/dashboard'
  }
}

export default function DashboardMetrics({ stats }: { stats: Stat[] }) {
  const router = useRouter()

  const handleStatClick = (statName: string) => {
    const path = getNavigationPath(statName)
    router.push(path)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = iconMap[stat.iconName]
        return (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.02 }}
            className="group rounded-xl bg-white/5 backdrop-blur-md p-6 hover:bg-white/10 transition-all duration-300 border border-white/10 shadow-[0_0_20px_rgba(145,47,64,0.2)] hover:shadow-[0_0_30px_rgba(145,47,64,0.4)] cursor-pointer"
            onClick={() => handleStatClick(stat.name)}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Icon className="w-6 h-6 mx-auto text-[#F3C77E] mb-3 group-hover:drop-shadow-[0_0_8px_rgba(243,199,126,0.6)]" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-1">
              <AnimatedCounter value={stat.value} />
            </h2>
            <p className="text-sm text-gray-400 mb-1">{stat.name}</p>
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className={`text-xs font-medium ${
                stat.growth.startsWith('+') ? 'text-green-400' : 
                stat.growth.startsWith('-') ? 'text-red-400' : 
                'text-[#F3C77E]'
              }`}
            >
              {stat.growth} vs last week
            </motion.p>
          </motion.div>
        )
      })}
    </div>
  )
}

