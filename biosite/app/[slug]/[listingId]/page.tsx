'use client'

import { useState, useEffect } from 'react'
import { notFound, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, MapPin, Calendar, Phone, Mail, Camera } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import LeadCaptureForm from '@/components/LeadCaptureForm'
import ShowingRequestForm from '@/components/ShowingRequestForm'

interface ListingPageProps {
  params: Promise<{
    slug: string
    listingId: string
  }>
}

export default function ListingPage({ params }: ListingPageProps) {
  const [agent, setAgent] = useState<any>(null)
  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { slug, listingId } = await params
        
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

        // Get listing data (public query - no auth required)
        const { data: listingData } = await supabase
          .from('listings')
          .select('*')
          .eq('id', listingId)
          .eq('user_id', agentData.id)
          .eq('status', 'active')
          .single()

        if (!listingData) {
          notFound()
          return
        }

        setAgent(agentData)
        setListing(listingData)
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!agent || !listing) {
    notFound()
  }

  return (
    <>
      <AnalyticsTracker userId={agent.id} source="listing_page" />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <Link
              href={`/${agent.slug}`}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {agent.full_name}'s Profile
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                {listing.images && listing.images.length > 0 ? (
                  <div className="aspect-video relative">
                    <Image
                      src={listing.images[0]}
                      alt={listing.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      priority={true}
                    />
                    {listing.images.length > 1 && (
                      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        +{listing.images.length - 1} more
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-[#912F40]/20 to-[#702632]/20 flex items-center justify-center">
                    <Camera className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Listing Details */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                <p className="text-4xl font-bold text-[#912F40] mb-4">
                  ${listing.price.toLocaleString()}
                </p>
                
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="w-5 h-5" />
                  <span>{listing.address}, {listing.city}, {listing.province}</span>
                </div>

                {listing.description && (
                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {listing.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Agent Info */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Listed by</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#912F40] to-[#702632] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {agent.full_name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{agent.full_name}</h4>
                    {agent.brokerage && (
                      <p className="text-gray-600 text-sm">{agent.brokerage}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                {/* Showing Request Form */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Request a Showing
                  </h3>
                  <LeadCaptureForm 
                    agentId={agent.id}
                  />
                </div>

                {/* Contact Info */}
                <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  
                  <div className="space-y-3">
                    {agent.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <a 
                          href={`mailto:${agent.email}`}
                          className="text-[#912F40] hover:underline"
                        >
                          {agent.email}
                        </a>
                      </div>
                    )}
                    
                    {agent.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <a 
                          href={`tel:${agent.phone}`}
                          className="text-[#912F40] hover:underline"
                        >
                          {agent.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Price:</span>
                      <p className="font-semibold text-gray-900">${listing.price.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Location:</span>
                      <p className="font-semibold text-gray-900">{listing.city}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Province:</span>
                      <p className="font-semibold text-gray-900">{listing.province}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <p className="font-semibold text-green-600">Active</p>
                    </div>
                  </div>
                </div>

                {/* Showing Request Form */}
                <div className="bg-gradient-to-b from-[#080705] to-[#1A0E10] rounded-xl shadow-lg p-6 mt-6 border border-white/10">
                  <ShowingRequestForm
                    agentId={agent.id}
                    listingId={listing.id}
                    agentName={agent.full_name}
                    listingAddress={listing.address}
                    source="listing_page"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
