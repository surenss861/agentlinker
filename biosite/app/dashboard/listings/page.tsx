'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import NavBar from '@/components/NavBar'
import AddListingModal from '@/components/AddListingModal'
import EditListingModal from '@/components/EditListingModal'
import { Plus, Edit, Trash, Eye, BarChart3, Users, ExternalLink, Lock, Crown } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useSubscription } from '@/lib/hooks/useSubscription'
import ProSoftwall, { UpgradeModal } from '@/components/ProSoftwall'

interface Listing {
  id: string
  title: string
  price: number
  address: string
  city: string
  province: string
  description: string
  images: string[]
  status: 'active' | 'draft' | 'sold'
  contact_pref?: 'email' | 'phone' | 'both'
  created_at: string
  // Analytics will be added later
  views?: number
  requests?: number
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingListing, setEditingListing] = useState<Listing | null>(null)
  const [userId, setUserId] = useState<string>('')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { subscription, hasFeature, canCreateListing, getUpgradeText } = useSubscription()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
          console.error('Auth error:', authError)
          router.push('/login')
          return
        }

        setUserId(user.id)

        const { data: listingsData, error: listingsError } = await supabase
          .from('listings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        if (listingsError) {
          console.error('Error fetching listings:', listingsError)
        }

        setListings(listingsData || [])
      } catch (error) {
        console.error('Error in fetchData:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Set up real-time subscription for listings
    if (userId) {
      const channel = supabase
        .channel('realtime-listings')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'listings',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            console.log('Listings change received:', payload)
            
            try {
              if (payload.eventType === 'INSERT') {
                const newListing = payload.new as Listing
                console.log('Adding new listing:', newListing.title)
                setListings(prev => [newListing, ...prev])
              } else if (payload.eventType === 'UPDATE') {
                const updatedListing = payload.new as Listing
                console.log('Updating listing:', updatedListing.title)
                setListings(prev => 
                  prev.map(listing => 
                    listing.id === updatedListing.id ? updatedListing : listing
                  )
                )
              } else if (payload.eventType === 'DELETE') {
                const deletedListing = payload.old as Listing
                console.log('Deleting listing:', deletedListing.title)
                setListings(prev => 
                  prev.filter(listing => listing.id !== deletedListing.id)
                )
              }
            } catch (error) {
              console.error('Error processing real-time update:', error)
            }
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [router, supabase, userId])

  const handleListingCreated = async () => {
    console.log('Listing created successfully! Real-time subscription will handle the UI update.')
    // The real-time subscription will automatically update the UI
    // No need to manually refetch since we have real-time updates
  }

  const handleDelete = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return

    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId)
      
      if (error) {
        console.error('Error deleting listing:', error)
        alert(`Failed to delete listing: ${error.message}`)
      }
      // Real-time subscription will handle UI update
    } catch (error) {
      console.error('Error deleting listing:', error)
      alert(`Failed to delete listing: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleEdit = (listing: Listing) => {
    setEditingListing(listing)
    setShowEditModal(true)
  }

  const handleEditSuccess = () => {
    console.log('Listing updated successfully! Real-time subscription will handle the UI update.')
    // The real-time subscription will automatically update the UI
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-white">Loading listings...</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <NavBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">My Listings</h1>
                {subscription && (
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    subscription.tier === 'free' 
                      ? 'bg-gray-600 text-gray-300' 
                      : subscription.tier === 'pro'
                      ? 'bg-[#912F40] text-white'
                      : 'bg-[#F3C77E] text-black'
                  }`}>
                    {subscription.tier === 'free' ? 'Free' : 
                     subscription.tier === 'pro' ? 'Pro' : 'Business'}
                    {subscription.tier !== 'free' && <Crown className="w-3 h-3 inline ml-1" />}
                  </div>
                )}
              </div>
              <p className="text-gray-400">
                {listings.length} listing{listings.length !== 1 ? 's' : ''}
                {subscription?.tier === 'free' && (
                  <span className="text-yellow-400 ml-2">
                    ({subscription.limits.maxListings - listings.length} remaining)
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={() => {
                if (!canCreateListing(listings.length)) {
                  setShowUpgradeModal(true)
                  return
                }
                setShowModal(true)
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-[#912F40] to-[#702632] text-white hover:from-[#702632] hover:to-[#912F40] shadow-[0_0_20px_rgba(145,47,64,0.3)] hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              Add Listing
              {!canCreateListing(listings.length) && (
                <Lock className="h-4 w-4" />
              )}
            </button>
          </div>

          {listings.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing, index) => (
                <motion.div 
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  className="relative bg-black/90 backdrop-blur-sm rounded-xl shadow-xl border border-red-500/30 overflow-hidden hover:bg-black/95 transition-all duration-200 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] group"
                >
                  {/* Image */}
                  {listing.images && listing.images.length > 0 ? (
                    <div className="relative h-48 bg-gray-200">
                      <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-[#912F40]/20 to-[#702632]/20 flex items-center justify-center border-b border-white/10">
                      <Eye className="h-12 w-12 text-[#F3C77E]" />
                    </div>
                  )}
                  
                  <div className="relative p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white flex-1 line-clamp-2">{listing.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ml-2 ${
                        listing.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        listing.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {listing.status}
                      </span>
                    </div>
                    
                    {/* Location */}
                    <p className="text-gray-400 text-sm mb-2">
                      {listing.address}, {listing.city}, {listing.province}
                    </p>
                    
                    {/* Price */}
                    <p className="text-2xl font-bold text-[#F3C77E] mb-4">
                      ${listing.price.toLocaleString()}
                    </p>
                    
                    {/* Analytics Mini-Metrics */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1 text-gray-400">
                          <BarChart3 className="w-3 h-3" />
                          <span>{listing.views || 0} views</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Users className="w-3 h-3" />
                          <span>{listing.requests || 0} requests</span>
                        </div>
                      </div>
                      
                      {/* Conversion Rate */}
                      <div className="text-xs text-[#F3C77E] font-medium">
                        {listing.views && listing.views > 0 
                          ? `${Math.round(((listing.requests || 0) / listing.views) * 100)}% conv`
                          : '0% conv'
                        }
                      </div>
                    </div>
                    
                    {/* Hover Actions - Slide up from bottom */}
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-all duration-200"
                    >
                      <div className="flex gap-2">
                        <button
                          onClick={() => window.open(`/${userId}/${listing.id}`, '_blank')}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#F3C77E] text-[#080705] rounded-lg hover:bg-[#FFD89C] transition-all text-sm font-medium"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View Public
                        </button>
                        <button
                          onClick={() => handleEdit(listing)}
                          className="flex items-center justify-center px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(listing.id)}
                          className="flex items-center justify-center px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                    
                    {/* Regular Actions */}
                    <div className="flex gap-2 mt-4 group-hover:opacity-0 transition-opacity duration-200">
                      <button
                        onClick={() => window.open(`/${userId}/${listing.id}`, '_blank')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-all text-sm font-medium border border-white/20"
                      >
                        <Eye className="h-4 w-4" />
                        View Public
                      </button>
                      <button
                        onClick={() => handleEdit(listing)}
                        className="flex items-center justify-center px-4 py-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 transition-all border border-white/20"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(listing.id)}
                        className="flex items-center justify-center px-4 py-2 bg-[#912F40]/20 text-red-400 rounded-lg hover:bg-[#912F40]/30 transition-all border border-red-400/30"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative bg-black/90 backdrop-blur-sm rounded-2xl shadow-xl border border-red-500/30 p-16 text-center"
            >
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#912F40]/20 to-[#702632]/20 flex items-center justify-center border border-[#912F40]/30"
              >
                <Eye className="h-12 w-12 text-[#F3C77E]" />
              </motion.div>
              <h3 className="text-2xl font-semibold text-white mb-3">No listings yet</h3>
              <p className="text-gray-400 mb-2">Start showcasing your properties by adding your first listing</p>
              <p className="text-xs text-gray-500 mb-8">Your listings appear on your public AgentLinker page</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#912F40] to-[#702632] hover:from-[#702632] hover:to-[#912F40] text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(145,47,64,0.3)]"
              >
                <Plus className="h-5 w-5" />
                Add Your First Listing
              </motion.button>
            </motion.div>
          )}
      </main>

      {/* Add Listing Modal */}
      <AddListingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleListingCreated}
        userId={userId}
      />

      {/* Edit Listing Modal */}
      {editingListing && (
        <EditListingModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setEditingListing(null)
          }}
          onSuccess={handleEditSuccess}
          listing={editingListing}
        />
      )}

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="Unlimited Listings"
        description="Free users can create up to 3 listings. Upgrade to Pro for unlimited listings and advanced features."
        requiredTier="pro"
      />
    </>
  )
}

