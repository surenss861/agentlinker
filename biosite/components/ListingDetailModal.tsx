'use client'

import { X, MapPin, Home, Bed, Bath, Maximize, Calendar, Phone, Mail } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface Listing {
  id: string
  title: string
  price: number
  address: string
  city: string
  province: string
  description?: string
  bedrooms?: number
  bathrooms?: number
  square_feet?: number
  images?: string[]
  created_at?: string
}

interface Agent {
  full_name: string
  email?: string
  phone?: string
}

interface ListingDetailModalProps {
  listing: Listing
  agent: Agent
  onClose: () => void
}

export default function ListingDetailModal({ listing, agent, onClose }: ListingDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const images = listing.images || []

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only navigate if not clicking on navigation buttons
    if ((e.target as HTMLElement).tagName !== 'BUTTON') {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const width = rect.width
      
      // Click on left half = previous, right half = next
      if (x < width / 2) {
        prevImage()
      } else {
        nextImage()
      }
    }
  }

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50
    
    if (isLeftSwipe) {
      nextImage()
    } else if (isRightSwipe) {
      prevImage()
    }
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevImage()
    } else if (e.key === 'ArrowRight') {
      nextImage()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  const handleRequestShowing = () => {
    onClose()
    setTimeout(() => {
      document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div 
        className="relative bg-[#1A1A1A] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#702632]/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Image Gallery */}
        {images.length > 0 && (
          <div 
            className="relative w-full h-96 bg-black cursor-pointer select-none touch-pan-x"
            onClick={handleImageClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={images[currentImageIndex]}
              alt={listing.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
              className="object-contain pointer-events-none"
              draggable={false}
            />
            {images.length > 1 && (
              <>
                {/* Visual hint zones - left and right halves */}
                <div className="absolute inset-y-0 left-0 w-1/2 hover:bg-white/5 transition-colors pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-1/2 hover:bg-white/5 transition-colors pointer-events-none" />
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    prevImage()
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition z-10 text-xl"
                >
                  ←
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    nextImage()
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition z-10 text-xl"
                >
                  →
                </button>
                
                {/* Image counter */}
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
                
                {/* Navigation dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 px-3 py-2 rounded-full">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentImageIndex(index)
                      }}
                      className={`w-2.5 h-2.5 rounded-full transition ${
                        index === currentImageIndex ? 'bg-[#912F40] scale-125' : 'bg-gray-400 hover:bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                {/* Navigation hint */}
                <div className="absolute bottom-4 left-4 text-white/50 text-xs bg-black/50 px-2 py-1 rounded hidden sm:block">
                  Click, Arrow Keys, or Swipe
                </div>
                <div className="absolute bottom-4 left-4 text-white/50 text-xs bg-black/50 px-2 py-1 rounded sm:hidden">
                  Swipe or Tap
                </div>
              </>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-8">
          {/* Price */}
          <div className="text-4xl font-bold text-[#912F40] mb-4">
            ${listing.price.toLocaleString()}
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-white mb-2">{listing.title}</h2>

          {/* Address */}
          <div className="flex items-center gap-2 text-gray-400 mb-6">
            <MapPin className="h-5 w-5" />
            <span className="text-lg">{listing.address}, {listing.city}, {listing.province}</span>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {listing.bedrooms !== null && listing.bedrooms !== undefined && (
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <Bed className="h-6 w-6 text-[#912F40] mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{listing.bedrooms}</div>
                <div className="text-sm text-gray-400">Bedrooms</div>
              </div>
            )}
            {listing.bathrooms !== null && listing.bathrooms !== undefined && (
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <Bath className="h-6 w-6 text-[#912F40] mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{listing.bathrooms}</div>
                <div className="text-sm text-gray-400">Bathrooms</div>
              </div>
            )}
            {listing.square_feet && (
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <Maximize className="h-6 w-6 text-[#912F40] mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{listing.square_feet.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Sq Ft</div>
              </div>
            )}
          </div>

          {/* Description */}
          {listing.description && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-3">Description</h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
            </div>
          )}

          {/* Contact Agent */}
          <div className="border-t border-[#702632]/40 pt-6">
            <h3 className="text-xl font-bold text-white mb-4">Contact Agent</h3>
            <div className="bg-black/30 rounded-lg p-6">
              <div className="text-lg font-bold text-white mb-3">{agent.full_name}</div>
              <div className="space-y-3">
                {agent.email && (
                  <a
                    href={`mailto:${agent.email}?subject=Inquiry about ${listing.title}`}
                    className="flex items-center gap-3 text-gray-300 hover:text-[#912F40] transition"
                  >
                    <Mail className="h-5 w-5" />
                    {agent.email}
                  </a>
                )}
                {agent.phone && (
                  <a
                    href={`tel:${agent.phone}`}
                    className="flex items-center gap-3 text-gray-300 hover:text-[#912F40] transition"
                  >
                    <Phone className="h-5 w-5" />
                    {agent.phone}
                  </a>
                )}
              </div>
              <div className="mt-4 flex gap-3">
                <a
                  href={`mailto:${agent.email}?subject=Inquiry about ${listing.title}`}
                  className="flex-1 bg-[#912F40] hover:bg-[#702632] text-white px-6 py-3 rounded-lg font-medium text-center transition"
                >
                  Send Email
                </a>
                <button
                  onClick={handleRequestShowing}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition"
                >
                  Request Showing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

