'use client'

import { useEffect } from 'react'

interface AnalyticsTrackerProps {
  userId: string
  source?: string
}

export default function AnalyticsTracker({ userId, source = 'bio_page' }: AnalyticsTrackerProps) {
  useEffect(() => {
    // Track page view
    const trackPageView = async () => {
      try {
        await fetch('/api/analytics/public', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            event_type: 'view',
            source: source,
          }),
        })
      } catch (error) {
        console.error('Error tracking page view:', error)
      }
    }

    trackPageView()
  }, [userId, source])

  // This component doesn't render anything, it just tracks analytics
  return null
}

