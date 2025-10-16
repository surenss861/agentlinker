// Response time tracking utilities

export function calculateResponseTime(createdAt: string, updatedAt: string): number {
  const created = new Date(createdAt)
  const updated = new Date(updatedAt)
  return (updated.getTime() - created.getTime()) / (1000 * 60 * 60) // hours
}

export function formatResponseTime(hours: number): string {
  if (hours < 1) {
    const minutes = Math.round(hours * 60)
    return `${minutes}m`
  } else if (hours < 24) {
    return `${Math.round(hours * 10) / 10}h`
  } else {
    const days = Math.round(hours / 24 * 10) / 10
    return `${days}d`
  }
}

export function getResponseTimeColor(hours: number): string {
  if (hours <= 1) return 'text-green-400 bg-green-500/20 border-green-500/30'
  if (hours <= 4) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
  if (hours <= 24) return 'text-orange-400 bg-orange-500/20 border-orange-500/30'
  return 'text-red-400 bg-red-500/20 border-red-500/30'
}

export function getResponseTimeRating(hours: number): { rating: string; description: string } {
  if (hours <= 1) {
    return { rating: 'Excellent', description: 'Lightning fast!' }
  } else if (hours <= 2) {
    return { rating: 'Great', description: 'Above average' }
  } else if (hours <= 4) {
    return { rating: 'Good', description: 'Industry standard' }
  } else if (hours <= 24) {
    return { rating: 'Fair', description: 'Room for improvement' }
  } else {
    return { rating: 'Poor', description: 'Too slow' }
  }
}

// Hook for tracking response times in real-time
export function useResponseTimeTracking() {
  const trackResponseTime = async (
    leadId: string,
    createdAt: string,
    newStatus: string,
    supabase: any
  ) => {
    // Only track when lead moves from pending to contacted
    if (newStatus === 'confirmed') {
      const responseTime = calculateResponseTime(createdAt, new Date().toISOString())
      
      // Update the lead with response time
      const { error } = await supabase
        .from('leads')
        .update({ 
          response_time: responseTime,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId)
      
      if (error) {
        console.error('Error tracking response time:', error)
      }
      
      return responseTime
    }
    
    return null
  }

  return { trackResponseTime }
}
