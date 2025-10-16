'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Mail, Phone, MessageSquare, CheckCircle, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface ShowingRequestFormProps {
  agentId: string
  listingId?: string
  agentName?: string
  listingAddress?: string
  source?: string // Track where the lead came from
}

export default function ShowingRequestForm({ 
  agentId, 
  listingId, 
  agentName = 'this agent',
  listingAddress = 'this property',
  source = 'direct'
}: ShowingRequestFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    preferredDate: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Insert lead into Supabase
      const { data, error: insertError } = await supabase
        .from('leads')
        .insert({
          user_id: agentId,
          listing_id: listingId || null,
          client_name: formData.name,
          client_email: formData.email,
          client_phone: formData.phone,
          message: formData.message + (formData.preferredDate ? `\n\nPreferred Date: ${formData.preferredDate}` : ''),
          source: source,
          status: 'pending',
          priority_score: 50, // Default medium priority
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (insertError) {
        throw new Error(insertError.message)
      }

      // Show success animation
      setSuccess(true)
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          preferredDate: ''
        })
        setSuccess(false)
      }, 3000)

    } catch (err: any) {
      console.error('Error submitting showing request:', err)
      setError(err.message || 'Failed to submit request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {!success ? (
          <motion.form
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                Request a Showing
              </h3>
              <p className="text-gray-400">
                {listingId ? `Schedule a viewing of ${listingAddress}` : `Connect with ${agentName}`}
              </p>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#F3C77E] focus:border-[#F3C77E] transition-all"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#F3C77E] focus:border-[#F3C77E] transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#F3C77E] focus:border-[#F3C77E] transition-all"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            {/* Preferred Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Preferred Viewing Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => handleChange('preferredDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-[#F3C77E] focus:border-[#F3C77E] transition-all"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Message (Optional)
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#F3C77E] focus:border-[#F3C77E] transition-all resize-none"
                  placeholder="Any specific questions or requirements..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading || !formData.name || !formData.email}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-[#912F40] to-[#702632] hover:from-[#702632] hover:to-[#912F40] text-white rounded-lg font-semibold transition-all shadow-[0_0_20px_rgba(145,47,64,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending Request...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Request Showing
                </span>
              )}
            </motion.button>

            {/* Privacy Notice */}
            <p className="text-xs text-gray-500 text-center">
              Your information will only be shared with the agent. We respect your privacy.
            </p>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500"
            >
              <CheckCircle className="w-10 h-10 text-green-400" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-white mb-2">Request Sent!</h3>
              <p className="text-gray-400 mb-4">
                {agentName} will get back to you within 24 hours.
              </p>
              <div className="flex items-center justify-center gap-2 text-[#F3C77E]">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">Check your email for confirmation</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
