'use client'

import { useState, useEffect } from 'react'
import { X, Camera, MapPin, DollarSign, Eye } from 'lucide-react'

interface EditListingModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  listing: {
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
  }
}

interface ListingFormData {
  title: string
  price: string
  address: string
  city: string
  province: string
  description: string
  status: 'active' | 'draft' | 'sold'
  contact_pref: 'email' | 'phone' | 'both'
  images: string[]
}

const CANADIAN_CITIES = [
  'Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Edmonton', 'Ottawa',
  'Mississauga', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener',
  'London', 'Victoria', 'Halifax', 'Oshawa', 'Windsor', 'Saskatoon',
  'Regina', 'Sherbrooke', 'Barrie', 'Kelowna', 'Abbotsford', 'Kingston',
  'Guelph', 'Kamloops', 'Thunder Bay', 'Nanaimo', 'Sudbury', 'Red Deer'
]

const PROVINCES = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
  'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
  'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon'
]

export default function EditListingModal({ isOpen, onClose, onSuccess, listing }: EditListingModalProps) {
  const [formData, setFormData] = useState<ListingFormData>({
    title: '',
    price: '',
    address: '',
    city: '',
    province: 'Ontario',
    description: '',
    status: 'active',
    contact_pref: 'both',
    images: []
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Initialize form data when listing changes
  useEffect(() => {
    if (listing) {
      setFormData({
        title: listing.title || '',
        price: listing.price?.toString() || '',
        address: listing.address || '',
        city: listing.city || '',
        province: listing.province || 'Ontario',
        description: listing.description || '',
        status: listing.status || 'active',
        contact_pref: listing.contact_pref || 'both',
        images: listing.images || []
      })
    }
  }, [listing])

  const handleInputChange = (field: keyof ListingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/listings/${listing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          price: parseFloat(formData.price),
          address: formData.address,
          city: formData.city,
          province: formData.province,
          description: formData.description,
          status: formData.status,
          contact_pref: formData.contact_pref,
          images: formData.images
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update listing')
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-[#080705] to-[#1A0E10] rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white">Edit Listing</h2>
            <p className="text-gray-400">Update your property listing details</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Form Section */}
          <div className="flex-1 p-6 overflow-y-auto">
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Property Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#F3C77E] focus:border-[#F3C77E] text-white placeholder-gray-500"
                  placeholder="e.g., 2BR Condo at 123 Main St"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#F3C77E] focus:border-[#F3C77E] text-white placeholder-gray-500"
                    placeholder="750000"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#F3C77E] focus:border-[#F3C77E] text-white placeholder-gray-500"
                    placeholder="123 Main Street"
                  />
                </div>
              </div>

              {/* City & Province */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    City *
                  </label>
                  <select
                    required
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#F3C77E] focus:border-[#F3C77E] text-white"
                  >
                    <option value="">Select City</option>
                    {CANADIAN_CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Province *
                  </label>
                  <select
                    required
                    value={formData.province}
                    onChange={(e) => handleInputChange('province', e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#F3C77E] focus:border-[#F3C77E] text-white"
                  >
                    {PROVINCES.map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#F3C77E] focus:border-[#F3C77E] text-white placeholder-gray-500"
                  placeholder="Describe the property features, neighborhood, amenities..."
                />
              </div>

              {/* Status & Contact Preference */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#F3C77E] focus:border-[#F3C77E] text-white"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contact Preference
                  </label>
                  <select
                    value={formData.contact_pref}
                    onChange={(e) => handleInputChange('contact_pref', e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#F3C77E] focus:border-[#F3C77E] text-white"
                  >
                    <option value="email">Email Only</option>
                    <option value="phone">Phone Only</option>
                    <option value="both">Both Email & Phone</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.title || !formData.price || !formData.address}
                  className="px-8 py-3 bg-gradient-to-r from-[#912F40] to-[#702632] hover:from-[#702632] hover:to-[#912F40] text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Listing'}
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview */}
          <div className="w-96 bg-white/5 border-l border-white/10 p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#F3C77E]" />
              Live Preview
            </h3>
            
            <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 overflow-hidden">
              {formData.images && formData.images.length > 0 ? (
                <div className="aspect-video bg-gradient-to-br from-[#912F40]/20 to-[#702632]/20 flex items-center justify-center">
                  <span className="text-white text-sm">Image Preview</span>
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-[#912F40]/20 to-[#702632]/20 flex items-center justify-center">
                  <Camera className="w-12 h-12 text-gray-400" />
                </div>
              )}
              
              <div className="p-4">
                <h4 className="text-white font-semibold text-lg mb-2">
                  {formData.title || 'Property Title'}
                </h4>
                <p className="text-[#F3C77E] text-xl font-bold mb-2">
                  {formData.price ? `$${Number(formData.price).toLocaleString()}` : 'Price'}
                </p>
                <p className="text-gray-400 text-sm mb-3">
                  {formData.address && formData.city && formData.province 
                    ? `${formData.address}, ${formData.city}, ${formData.province}`
                    : 'Address, City, Province'
                  }
                </p>
                {formData.description && (
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {formData.description.substring(0, 100)}
                    {formData.description.length > 100 && '...'}
                  </p>
                )}
                
                <div className="flex items-center justify-between mt-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    formData.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    formData.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {formData.status?.charAt(0).toUpperCase() + formData.status?.slice(1)}
                  </span>
                  <button className="bg-gradient-to-r from-[#912F40] to-[#702632] text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Request Showing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
