'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Mail, Phone, Home, Calendar, MessageSquare, Star, MapPin, Bed, Bath, Square, User } from 'lucide-react'
import Image from 'next/image'
import LeadCaptureForm from '@/components/LeadCaptureForm'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import ListingDetailModal from '@/components/ListingDetailModal'
import BookShowingModal from '@/components/BookShowingModal'
import VerifiedBadge from '@/components/VerifiedBadge'

interface AgentPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function AgentPage({ params }: AgentPageProps) {
  const [agent, setAgent] = useState<any>(null)
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedListing, setSelectedListing] = useState<any>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { slug } = await params

        // Get user data (public query - no auth required)
        const { data: agentData } = await supabase
          .from('users')
          .select('*')
          .eq('slug', slug)
          .single()

        if (!agentData) {
          notFound()
          return
        }

        // Get featured listings (public query - no auth required)
        const { data: listingsData } = await supabase
          .from('listings')
          .select('*')
          .eq('user_id', agentData.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(6)

        console.log('Agent data:', agentData) // Debug: see what fields are available
        setAgent(agentData)
        setListings(listingsData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!agent) {
    notFound()
  }

  const socialLinks = agent.social_links as Record<string, string> || {}

  // Dark theme with red accents (single template)
  const styles = {
    bg: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white',
    accent: 'text-red-500',
    button: 'bg-red-500 text-white hover:bg-red-600',
    card: 'bg-gray-800 border-gray-700',
    secondaryButton: 'bg-gray-600 text-white hover:bg-gray-700',
  }

  return (
    <>
      <AnalyticsTracker userId={agent.id} />
      
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-[#912F40]/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#912F40] rounded-lg flex items-center justify-center">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#912F40]">AgentLinker</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/login" className="text-white hover:text-gray-300">Sign In</a>
            <a href="/signup" className="bg-[#912F40] hover:bg-[#702632] text-white px-6 py-2 rounded-lg font-medium transition">Get Started</a>
          </div>
        </div>

        {/* Agent Profile Hero Section */}
        <section className="w-full max-w-5xl mx-auto text-center py-16 border-b border-[#912F40]/30">
          <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-[#912F40] shadow-xl">
            {(agent.photo_url || agent.profile_photo_url || agent.profile_photo) ? (
              <Image
                src={agent.photo_url || agent.profile_photo_url || agent.profile_photo}
                alt={agent.full_name}
                fill
                sizes="128px"
                className="object-cover"
                priority={true}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                <User className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            {agent.full_name}
            {agent.verified_badge && <VerifiedBadge size="md" />}
          </h1>
          
          {agent.brokerage && (
            <p className="text-[#912F40] text-xl font-medium mb-4">{agent.brokerage}</p>
          )}
          
          {agent.bio && (
            <p className="text-gray-400 max-w-2xl mx-auto mb-6">{agent.bio}</p>
          )}

          {/* Contact Info */}
          <div className="flex justify-center gap-4 text-sm text-gray-300">
            {agent.email && (
              <a href={`mailto:${agent.email}`} className="hover:text-white flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {agent.email}
              </a>
            )}
            {agent.email && agent.phone && <span>•</span>}
            {agent.phone && (
              <a href={`tel:${agent.phone}`} className="hover:text-white flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {agent.phone}
              </a>
            )}
          </div>
        </section>

        {/* Featured Listings Section */}
        <section className="w-full max-w-5xl mx-auto py-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Featured Listings</h2>
          <div className="space-y-6">
            {listings && listings.length > 0 ? (
              listings.map((listing, index) => (
                <div 
                  key={listing.id} 
                  className="relative bg-[#1A1A1A] rounded-lg overflow-hidden shadow-lg border border-[#702632]/40 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex">
                    {listing.images && listing.images.length > 0 ? (
                      <div className="relative w-80 h-64 flex-shrink-0">
                        <Image
                          src={listing.images[0]}
                          alt={listing.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                          priority={index === 0}
                        />
                        <div className="absolute top-4 right-4 bg-[#912F40] text-white px-3 py-1 text-sm rounded font-bold">
                          ${listing.price.toLocaleString()}
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-80 h-64 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center flex-shrink-0">
                        <Home className="h-16 w-16 text-gray-400" />
                        <div className="absolute top-4 right-4 bg-[#912F40] text-white px-3 py-1 text-sm rounded font-bold">
                          ${listing.price.toLocaleString()}
                        </div>
                      </div>
                    )}
                    <div className="p-8 flex-1">
                      <h3 className="text-2xl font-bold text-white mb-3">{listing.title}</h3>
                      <div className="flex items-center gap-2 text-gray-400 mb-4">
                        <MapPin className="h-4 w-4" />
                        <span>{listing.address}, {listing.city}, {listing.province}</span>
                      </div>
                      <div className="flex gap-6 text-sm text-gray-400 mb-4">
                        <span className="flex items-center gap-1">
                          🛏️ {listing.bedrooms || 0} beds
                        </span>
                        <span className="flex items-center gap-1">
                          🛁 {listing.bathrooms || 0} baths
                        </span>
                        <span className="flex items-center gap-1">
                          📐 {listing.square_feet?.toLocaleString() || 'N/A'} sqft
                        </span>
                      </div>
                      {listing.description && (
                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{listing.description}</p>
                      )}
                      <button 
                        onClick={() => setSelectedListing(listing)}
                        className="bg-[#912F40] hover:bg-[#702632] text-white px-6 py-2 rounded-md font-medium transition"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <Home className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No active listings yet.</p>
                <p className="text-gray-600 text-sm">Check back soon for featured properties.</p>
              </div>
            )}
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contact-form" className="w-full max-w-5xl mx-auto py-16 border-t border-[#912F40]/30">
          <div className="bg-[#1A1A1A] rounded-lg shadow-lg border border-[#702632]/40 p-8">
            <h2 className="text-2xl font-bold mb-4 text-white text-center">Get in Touch</h2>
            <p className="text-gray-400 mb-8 text-center">
              Have questions? Fill out the form below and I'll get back to you as soon as possible.
            </p>
            <LeadCaptureForm agentId={agent.id} />
          </div>
        </section>

        {/* Add bottom padding to account for sticky bar */}
        <div className="h-20"></div>

        {/* Watermark for free tier */}
        {(agent.subscription_tier === 'trial' || agent.subscription_tier === 'free') && (
          <div className="text-center mt-12 opacity-60">
            <a href="/" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline text-gray-400">
              Powered by AgentLinker
            </a>
          </div>
        )}
      </div>

      {/* Sticky Bottom CTA Bar - Outside main container */}
      <div className="fixed bottom-0 left-0 w-full bg-[#1A1A1A]/95 backdrop-blur-md border-t border-[#702632]/40 py-4 z-50">
        <div className="max-w-5xl mx-auto flex justify-center gap-6">
          <button
            onClick={() => setShowBookingModal(true)}
            className="bg-[#912F40] hover:bg-[#702632] text-white px-8 py-3 rounded-md font-medium transition flex items-center gap-2"
          >
            <Calendar className="h-5 w-5" />
            📅 Book Showing
          </button>
          <button
            onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-md font-medium transition flex items-center gap-2"
          >
            <MessageSquare className="h-5 w-5" />
            💬 Contact
          </button>
        </div>
      </div>

      {/* Listing Detail Modal */}
      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          agent={agent}
          onClose={() => setSelectedListing(null)}
        />
      )}

      {/* Book Showing Modal */}
      {showBookingModal && (
        <BookShowingModal
          agentId={agent.id}
          agentName={agent.full_name}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </>
  )
}

