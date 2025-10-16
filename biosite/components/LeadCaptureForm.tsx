'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface LeadCaptureFormProps {
  agentId: string
}

export default function LeadCaptureForm({ agentId }: LeadCaptureFormProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          user_id: agentId,
          source: 'biopage',
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({ full_name: '', email: '', phone: '', message: '' })
        
        // Track analytics
        await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: agentId,
            event_type: 'lead_form',
          }),
        })
      }
    } catch (error) {
      console.error('Error submitting lead:', error)
    } finally {
      setLoading(false)
    }
  }

  // Dark theme styling
  const buttonClass = 'bg-[#912F40] text-white hover:bg-[#702632]'

  if (submitted) {
    return (
      <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6 text-center">
        <p className="text-green-300 font-medium text-lg">Thank you for reaching out!</p>
        <p className="text-green-400 mt-2">I'll get back to you as soon as possible.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium mb-1 text-gray-300">
          Full Name *
        </label>
        <input
          type="text"
          id="full_name"
          required
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          className="w-full px-4 py-2 bg-black/50 border border-[#702632]/40 rounded-lg focus:ring-2 focus:ring-[#912F40] focus:border-[#912F40] text-white placeholder-gray-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-300">
          Email *
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 bg-black/50 border border-[#702632]/40 rounded-lg focus:ring-2 focus:ring-[#912F40] focus:border-[#912F40] text-white placeholder-gray-500"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1 text-gray-300">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-2 bg-black/50 border border-[#702632]/40 rounded-lg focus:ring-2 focus:ring-[#912F40] focus:border-[#912F40] text-white placeholder-gray-500"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1 text-gray-300">
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-500 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full ${buttonClass} px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50`}
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}

