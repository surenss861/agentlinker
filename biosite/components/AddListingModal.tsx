'use client'

import { useState, useEffect } from 'react'
import { X, Camera, MapPin, DollarSign, Calendar, Eye } from 'lucide-react'

interface AddListingModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  userId: string
}

interface ListingFormData {
  title: string
  price: string
  address: string
  city: string
  province: string
  description: string
  status: 'active' | 'draft' | 'sold'
  availability_start?: string
  availability_end?: string
  contact_pref: 'email' | 'phone' | 'both'
  images: File[]
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

export default function AddListingModal({ isOpen, onClose, onSuccess, userId }: AddListingModalProps) {
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
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('unsaved')

  // Auto-save functionality
  useEffect(() => {
    // Only auto-save if we have all required fields
    if (!formData.title || !formData.price || !formData.address || !formData.city) return

    const timeoutId = setTimeout(async () => {
      setAutoSaveStatus('saving')
      try {
        await fetch('/api/listings/draft', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, user_id: userId, status: 'draft' })
        })
        setAutoSaveStatus('saved')
      } catch (error) {
        setAutoSaveStatus('unsaved')
      }
    }, 2000)

    return () => clearTimeout(timeoutId)
  }, [formData, userId])

  const handleInputChange = (field: keyof ListingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setAutoSaveStatus('unsaved')
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('user_id', userId)
      formDataToSend.append('title', formData.title)
      formDataToSend.append('price', formData.price)
      formDataToSend.append('address', formData.address)
      formDataToSend.append('city', formData.city)
      formDataToSend.append('province', formData.province)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('status', formData.status)
      formDataToSend.append('contact_pref', formData.contact_pref)
      
      // Upload images first
      const imageUrls = []
      for (const image of formData.images) {
        const imageFormData = new FormData()
        imageFormData.append('file', image)
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData
        })
        const { url } = await uploadResponse.json()
        imageUrls.push(url)
      }
      
      formDataToSend.append('images', JSON.stringify(imageUrls))

      const response = await fetch('/api/listings', {
        method: 'POST',
        body: formDataToSend
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        throw new Error(errorData.error || `Failed to create listing (${response.status})`)
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start md:items-center justify-center p-0 md:p-4 overflow-y-auto">
      <div className="bg-gradient-to-b from-[#080705] to-[#1A0E10] rounded-none md:rounded-2xl shadow-2xl w-full max-w-6xl min-h-screen md:min-h-0 md:my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#080705] z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">Add New Listing</h2>
            <p className="text-gray-400 text-sm md:text-base">Create your property listing to attract buyers</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400 hidden md:block">
              {autoSaveStatus === 'saving' && '💾 Saving...'}
              {autoSaveStatus === 'saved' && '✅ Saved'}
              {autoSaveStatus === 'unsaved' && '⚠️ Unsaved changes'}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Form Section */}
          <div className="flex-1 p-6">
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
                  placeholder="e.g., Beautiful 2-Bedroom Condo in Downtown"
                  aria-label="Property title"
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
                    placeholder="e.g., 750000"
                    aria-label="Property price"
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
                    placeholder="e.g., 123 Main Street"
                    aria-label="Property street address"
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

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Property Images
                </label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer text-[#F3C77E] hover:text-[#FFD89C] font-medium"
                  >
                    Upload Images
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.images.length} images selected
                  </p>
                </div>
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
                  {loading ? 'Creating...' : 'Create Listing'}
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview */}
          <div className="w-full md:w-96 bg-white/5 border-t md:border-t-0 md:border-l border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#F3C77E]" />
              Live Preview
            </h3>
            
            <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 overflow-hidden">
              {formData.images.length > 0 ? (
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
