'use client'

interface ProgressGoals {
  views: number
  requests: number
  bookings: number
  listings: number
}

interface Stats {
  views: number
  requests: number
  bookings: number
  listings: number
}

interface Goals {
  views: number
  requests: number
  bookings: number
  listings: number
}

export const useProgressGoals = (stats: Stats, goals: Goals = {
  views: 50,    // 50 views = 100% progress
  requests: 10, // 10 requests = 100% progress  
  bookings: 5,  // 5 bookings = 100% progress
  listings: 20  // 20 listings = 100% progress
}): ProgressGoals => {
  const { views, requests, bookings, listings } = stats

  return {
    views: Math.min((views / goals.views) * 100, 100),
    requests: Math.min((requests / goals.requests) * 100, 100),
    bookings: Math.min((bookings / goals.bookings) * 100, 100),
    listings: Math.min((listings / goals.listings) * 100, 100)
  }
}
