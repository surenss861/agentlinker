'use client'

import Link from 'next/link'
import { ArrowRight, Home, Calendar, TrendingUp, Star, Check } from 'lucide-react'
import DarkVeil from '@/components/DarkVeil'
import CardNav from '@/components/CardNav'
import TiltedCard from '@/components/TiltedCard'
import { useState } from 'react'

export default function HomePage() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [contactLoading, setContactLoading] = useState(false)
  const [contactMessage, setContactMessage] = useState('')

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setContactLoading(true)
    setContactMessage('')

    try {
      const response = await fetch('https://surens.app.n8n.cloud/webhook/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: contactForm.name,
          email: contactForm.email,
          subject: contactForm.subject,
          message: contactForm.message
        }),
      })

      if (response.ok) {
        setContactMessage('Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.')
        setContactForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setContactMessage('Sorry, there was an error sending your message. Please try again.')
      }
    } catch (error) {
      setContactMessage('Sorry, there was an error sending your message. Please try again.')
    } finally {
      setContactLoading(false)
    }
  }

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setContactForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }
  return (
    <div className="min-h-screen bg-black relative">
      {/* Dark Veil Background for entire page */}
      <div className="fixed inset-0 z-0">
        <DarkVeil
          speed={0.5}
          hueShift={237}
          noiseIntensity={0}
          scanlineIntensity={0}
          scanlineFrequency={0}
          warpAmount={0}
        />
      </div>

      {/* Page Content */}
      <div className="relative z-20">
        {/* Subtle overlay for better text readability */}
        <div className="fixed inset-0 bg-black/20 pointer-events-none z-10"></div>

        {/* Card Navigation */}
        <CardNav
          logo="/agentlinkerpfp.png"
          logoAlt="AgentLinker Logo"
          items={[]}
          baseColor="#000000"
          menuColor="#ffffff"
          buttonBgColor="#ef4444"
          buttonTextColor="#ffffff"
          ease="power3.out"
        />

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              Turn Your Bio Into a{' '}
              <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                24/7 Lead Machine
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              <strong>One link replaces 4 tools.</strong> Get 5-10 showing requests monthly — automatically.
            </p>
            <p className="text-lg text-red-400 mb-8 font-semibold">
              One extra deal = $10K+ commission. AgentLinker costs $20/month.
            </p>

            {/* ROI Stats */}
            <div className="bg-gradient-to-r from-red-900/50 to-black/50 rounded-xl p-6 mb-8 border border-red-900/30 max-w-2xl mx-auto">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-red-500">128</div>
                  <div className="text-sm text-gray-400">Monthly Views</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-500">9</div>
                  <div className="text-sm text-gray-400">Showing Requests</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-500">2</div>
                  <div className="text-sm text-gray-400">New Clients</div>
                </div>
              </div>
              <p className="text-center text-sm text-gray-300 mt-3">
                📈 Average AgentLinker results
              </p>
            </div>

            <div className="flex gap-4 justify-center items-center flex-wrap">
              <Link href="/signup" className="bg-red-600 text-white px-8 py-4 rounded-full hover:bg-red-700 transition-colors font-semibold text-lg inline-flex items-center gap-2">
                Get Started →
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/demo" className="border-2 border-red-600 text-red-500 px-8 py-4 rounded-full hover:bg-red-950 transition-colors font-semibold text-lg">
                See Live Demo
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">Setup in 5 minutes · One extra deal pays for 6 months</p>
          </div>

          {/* Hero Image/Demo */}
          <div className="mt-16 relative">
            <div className="relative rounded-2xl p-8 shadow-2xl border border-red-900/30 overflow-hidden">
              {/* Dark Veil Background */}
              <div className="absolute inset-0 z-0">
                <DarkVeil
                  speed={1.1}
                  hueShift={237}
                  noiseIntensity={0}
                  scanlineIntensity={0}
                  scanlineFrequency={0}
                  warpAmount={0}
                />
              </div>

              {/* Demo Content */}
              <div className="relative z-10 bg-neutral-900/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-red-900/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-600"></div>
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  </div>
                  <div className="flex-1 bg-black rounded-md px-4 py-2 text-sm text-gray-400 border border-red-900/30">
                    agentlinker.ca/john-doe
                  </div>
                </div>
                <div className="py-8 px-6 space-y-6">
                  {/* Agent Profile Card */}
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-4 border-red-600 shadow-lg shadow-red-900/50">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces&q=80"
                        alt="John Doe"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">John Doe</h2>
                    <p className="text-red-500 font-medium mb-2">XYZ Realty</p>
                    <p className="text-xs text-gray-400 mb-3 max-w-sm mx-auto">
                      Award-winning agent with 10+ years helping families find their dream homes in the GTA.
                    </p>
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                      <span>📧 john@realestate.com</span>
                      <span>📱 (555) 123-4567</span>
                    </div>
                  </div>

                  {/* Featured Listings Grid */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-white">Featured Listings</h3>

                    {/* Listing 1 */}
                    <div className="bg-black rounded-lg overflow-hidden border border-red-900/40 hover:border-red-600/60 transition-colors">
                      <div className="relative h-32 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=500&fit=crop&crop=center&q=80"
                          alt="Modern house"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                          $599K
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="text-sm font-semibold text-white mb-1">Beautiful 3BR Modern Home</h4>
                        <p className="text-xs text-gray-500 mb-2">123 Main St, Toronto, ON</p>
                        <div className="flex gap-3 text-xs text-gray-400">
                          <span>🛏️ 3</span>
                          <span>🛁 2</span>
                          <span>📐 1,850 sqft</span>
                        </div>
                      </div>
                    </div>

                    {/* Listing 2 */}
                    <div className="bg-black rounded-lg overflow-hidden border border-red-900/40 hover:border-red-600/60 transition-colors">
                      <div className="relative h-32 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&h=500&fit=crop&crop=center&q=80"
                          alt="Luxury house"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                          $1.2M
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="text-sm font-semibold text-white mb-1">Luxury Executive Home</h4>
                        <p className="text-xs text-gray-500 mb-2">456 Oak Ave, Oakville, ON</p>
                        <div className="flex gap-3 text-xs text-gray-400">
                          <span>🛏️ 5</span>
                          <span>🛁 4</span>
                          <span>📐 3,500 sqft</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-2">
                    <button className="flex-1 bg-red-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-red-700 transition-all shadow-lg shadow-red-900/30">
                      📅 Book Showing
                    </button>
                    <button className="flex-1 bg-neutral-800 text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-neutral-700 transition-all border border-red-900/30">
                      💬 Contact
                    </button>
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-2 justify-center pt-2">
                    <div className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center text-xs border border-red-900/30 hover:border-red-600 transition-colors cursor-pointer">
                      📘
                    </div>
                    <div className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center text-xs border border-red-900/30 hover:border-red-600 transition-colors cursor-pointer">
                      📸
                    </div>
                    <div className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center text-xs border border-red-900/30 hover:border-red-600 transition-colors cursor-pointer">
                      💼
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-4 text-white">The 4 Tools AgentLinker Replaces</h2>
          <p className="text-center text-gray-400 mb-16">One clean page. More booked showings.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-neutral-900 rounded-xl p-6 border border-red-900/30 text-center">
              <div className="text-4xl mb-3">🔗</div>
              <h3 className="text-lg font-semibold text-white mb-2">Linktree</h3>
              <p className="text-gray-400 text-sm">Generic, unbranded link list</p>
              <div className="mt-3 text-red-500 text-xs">❌ REPLACED</div>
            </div>

            <div className="bg-neutral-900 rounded-xl p-6 border border-red-900/30 text-center">
              <div className="text-4xl mb-3">📅</div>
              <h3 className="text-lg font-semibold text-white mb-2">Calendly</h3>
              <p className="text-gray-400 text-sm">Extra step, separate tool</p>
              <div className="mt-3 text-red-500 text-xs">❌ REPLACED</div>
            </div>

            <div className="bg-neutral-900 rounded-xl p-6 border border-red-900/30 text-center">
              <div className="text-4xl mb-3">🏠</div>
              <h3 className="text-lg font-semibold text-white mb-2">MLS Pages</h3>
              <p className="text-gray-400 text-sm">Out of your control</p>
              <div className="mt-3 text-red-500 text-xs">❌ REPLACED</div>
            </div>

            <div className="bg-neutral-900 rounded-xl p-6 border border-red-900/30 text-center">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="text-lg font-semibold text-white mb-2">Google Forms</h3>
              <p className="text-gray-400 text-sm">Ugly and clunky</p>
              <div className="mt-3 text-red-500 text-xs">❌ REPLACED</div>
            </div>
          </div>

          {/* What You Get Instead */}
          <div className="relative">
            {/* Dark Veil Background */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <DarkVeil
                speed={0.8}
                hueShift={237}
                noiseIntensity={0.1}
                scanlineIntensity={0.05}
                scanlineFrequency={0.5}
                warpAmount={0.02}
              />
            </div>

            {/* Card Content */}
            <div className="relative bg-black/90 backdrop-blur-sm rounded-2xl border border-red-500/30 p-8 text-center text-white shadow-2xl">
              <h3 className="text-2xl font-bold mb-6">Instead, You Get:</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl mb-2">🎯</div>
                  <h4 className="font-semibold mb-2">Lead-Optimized Pages</h4>
                  <p className="text-red-100 text-sm">Every element designed to convert visitors into booked showings</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">📊</div>
                  <h4 className="font-semibold mb-2">Real ROI Tracking</h4>
                  <p className="text-red-100 text-sm">See exactly: views → requests → closed deals</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">⚡</div>
                  <h4 className="font-semibold mb-2">Automated Follow-up</h4>
                  <p className="text-red-100 text-sm">Instant notifications, SMS reminders, calendar sync</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-4 text-white">Simple, Transparent Pricing</h2>
          <p className="text-center text-gray-400 mb-12">One plan. Everything included. No hidden fees.</p>

          <div className="flex justify-center">
            <div className="relative">
              {/* Dark Veil Background */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <DarkVeil
                  speed={0.8}
                  hueShift={237}
                  noiseIntensity={0.1}
                  scanlineIntensity={0.05}
                  scanlineFrequency={0.5}
                  warpAmount={0.02}
                />
              </div>

              {/* Pricing Card Content */}
              <div className="relative bg-black/90 backdrop-blur-sm rounded-2xl border border-red-500/30 p-8 text-white shadow-2xl">
                <div className="text-center">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-red-500 px-6 py-2 rounded-full text-sm font-bold border border-red-500">
                    ⚡ EVERYTHING INCLUDED
                  </div>

                  <h3 className="text-3xl font-bold mb-4 mt-4">AgentLinker Pro</h3>
                  <div className="text-6xl font-bold mb-2">$20<span className="text-2xl opacity-90">/mo</span></div>
                  <p className="text-red-100 text-lg mb-8">Your complete real estate growth platform</p>

                  <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 flex-shrink-0" />
                      <span>Unlimited Listings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 flex-shrink-0" />
                      <span>Premium Templates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 flex-shrink-0" />
                      <span>Booking Scheduler</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 flex-shrink-0" />
                      <span>Lead Capture</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 flex-shrink-0" />
                      <span>Analytics Dashboard</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 flex-shrink-0" />
                      <span>Custom Domain</span>
                    </div>
                  </div>

                  <Link
                    href="/signup"
                    className="block text-center bg-red-600 text-white px-8 py-4 rounded-full hover:bg-red-700 transition-all font-bold text-lg shadow-xl mb-4"
                  >
                    Get Started →
                  </Link>

                  <p className="text-center text-red-100 text-sm">
                    No credit card required • Cancel anytime • Setup in 5 minutes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Services Cards */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-20">
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Verification Badge Card */}
            <div className="relative h-full">
              {/* Dark Veil Background */}
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <DarkVeil
                  speed={0.8}
                  hueShift={200}
                  noiseIntensity={0.1}
                  scanlineIntensity={0.05}
                  scanlineFrequency={0.5}
                  warpAmount={0.02}
                />
              </div>

              {/* Card Content */}
              <div className="relative bg-black/90 backdrop-blur-sm rounded-xl border border-blue-500/30 p-6 text-white shadow-xl h-full flex flex-col">
                <div className="text-center flex-grow flex flex-col">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-bold text-lg">Verified Agent Badge</span>
                  </div>

                  <div className="text-3xl font-bold mb-2">$25</div>
                  <p className="text-blue-100 text-sm mb-6">One-time verification fee</p>

                  <div className="text-left space-y-3 mb-6 flex-grow">
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                      <span className="text-sm">Blue checkmark on profile</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                      <span className="text-sm">Build trust with clients</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                      <span className="text-sm">Stand out from competition</span>
                    </div>
                  </div>

                  <Link
                    href="/signup"
                    className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold text-sm shadow-xl mt-auto"
                  >
                    Get Verified →
                  </Link>
                </div>
              </div>
            </div>

            {/* Personal Help Pack Card */}
            <div className="relative h-full">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

              {/* Dark Veil Background */}
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <DarkVeil
                  speed={0.8}
                  hueShift={250}
                  noiseIntensity={0.1}
                  scanlineIntensity={0.05}
                  scanlineFrequency={0.5}
                  warpAmount={0.02}
                />
              </div>

              {/* Card Content */}
              <div className="relative bg-black/95 backdrop-blur-sm rounded-xl border border-purple-400/40 p-6 text-white shadow-2xl h-full flex flex-col">
                <div className="text-center flex-grow flex flex-col">
                  {/* Premium Badge */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-1 rounded-full text-xs font-bold border border-purple-400/50 z-10">
                    👨‍💼 PERSONAL ASSISTANCE
                  </div>

                  {/* Icon and Title */}
                  <div className="flex items-center justify-center gap-3 mb-4 mt-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                    </div>
                    <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Personal Help Pack</span>
                  </div>

                  {/* Price */}
                  <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    $50<span className="text-lg opacity-90">/mo</span>
                  </div>
                  <p className="text-purple-200 text-sm mb-6 font-medium">Personal assistance with listings and setup</p>

                  {/* Features */}
                  <div className="text-left space-y-3 mb-6 flex-grow">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm text-gray-200">Personal 1-on-1 consultation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm text-gray-200">Help updating your listings</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm text-gray-200">Website setup assistance</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm text-gray-200">Priority email support</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-auto">
                    <Link
                      href="/signup"
                      className="block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-105 transform duration-200"
                    >
                      Get Personal Help →
                    </Link>
                    <p className="text-purple-300 text-xs mt-3 font-medium">
                      Monthly subscription • Personal assistance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-4 text-white">Real Results from Real Agents</h2>
          <p className="text-center text-gray-400 mb-16">These numbers don't lie</p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              {/* Dark Veil Background */}
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <DarkVeil
                  speed={0.8}
                  hueShift={237}
                  noiseIntensity={0.1}
                  scanlineIntensity={0.05}
                  scanlineFrequency={0.5}
                  warpAmount={0.02}
                />
              </div>

              {/* Card Content */}
              <div className="relative bg-black/90 backdrop-blur-sm rounded-xl border border-red-500/30 p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=faces&q=80" alt="Sarah" className="w-12 h-12 rounded-full" />
                  <div>
                    <h4 className="font-semibold text-white">Sarah Chen</h4>
                    <p className="text-sm text-gray-400">Toronto, ON</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">"My AgentLinker generated 312 views and 7 booked calls in just 2 weeks. That's 3x more than my old setup."</p>
                <div className="flex gap-4 text-sm">
                  <span className="text-red-500 font-bold">312 views</span>
                  <span className="text-red-500 font-bold">7 calls</span>
                  <span className="text-red-500 font-bold">2 clients</span>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Dark Veil Background */}
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <DarkVeil
                  speed={0.8}
                  hueShift={237}
                  noiseIntensity={0.1}
                  scanlineIntensity={0.05}
                  scanlineFrequency={0.5}
                  warpAmount={0.02}
                />
              </div>

              {/* Card Content */}
              <div className="relative bg-black/90 backdrop-blur-sm rounded-xl border border-red-500/30 p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces&q=80" alt="Mike" className="w-12 h-12 rounded-full" />
                  <div>
                    <h4 className="font-semibold text-white">Mike Rodriguez</h4>
                    <p className="text-sm text-gray-400">Vancouver, BC</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">"Finally, a professional page that matches my brand. Closed 2 deals in my first month using AgentLinker."</p>
                <div className="flex gap-4 text-sm">
                  <span className="text-red-500 font-bold">156 views</span>
                  <span className="text-red-500 font-bold">4 calls</span>
                  <span className="text-red-500 font-bold">2 deals</span>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Dark Veil Background */}
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <DarkVeil
                  speed={0.8}
                  hueShift={237}
                  noiseIntensity={0.1}
                  scanlineIntensity={0.05}
                  scanlineFrequency={0.5}
                  warpAmount={0.02}
                />
              </div>

              {/* Card Content */}
              <div className="relative bg-black/90 backdrop-blur-sm rounded-xl border border-red-500/30 p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces&q=80" alt="Lisa" className="w-12 h-12 rounded-full" />
                  <div>
                    <h4 className="font-semibold text-white">Lisa Thompson</h4>
                    <p className="text-sm text-gray-400">Calgary, AB</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">"The analytics show exactly what's working. My conversion rate doubled since switching to AgentLinker."</p>
                <div className="flex gap-4 text-sm">
                  <span className="text-red-500 font-bold">89 views</span>
                  <span className="text-red-500 font-bold">3 calls</span>
                  <span className="text-red-500 font-bold">1 deal</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="relative text-white py-20 overflow-hidden">
          {/* Dark Veil Background */}
          <div className="absolute inset-0">
            <DarkVeil
              speed={0.8}
              hueShift={237}
              noiseIntensity={0.1}
              scanlineIntensity={0.05}
              scanlineFrequency={0.5}
              warpAmount={0.02}
            />
          </div>

          {/* Content */}
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Get in Touch</h2>
              <p className="text-xl text-gray-300 mb-8">
                Have questions? Need help getting started? We're here to help you succeed.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-red-500">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold">Email</p>
                        <p className="text-gray-400">contact@agentlinker.ca</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold">Response Time</p>
                        <p className="text-gray-400">Within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold">Location</p>
                        <p className="text-gray-400">Canada</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-4">Why Contact Us?</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-red-500" />
                      <span>Get personalized setup assistance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-red-500" />
                      <span>Learn best practices for lead generation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-red-500" />
                      <span>Discuss custom features for your market</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-red-500" />
                      <span>Get help with integration questions</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Contact Form */}
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <DarkVeil
                    speed={0.8}
                    hueShift={200}
                    noiseIntensity={0.1}
                    scanlineIntensity={0.05}
                    scanlineFrequency={0.5}
                    warpAmount={0.02}
                  />
                </div>
                <div className="relative bg-black/90 backdrop-blur-sm rounded-2xl border border-red-500/30 shadow-2xl p-8">
                  <h3 className="text-2xl font-bold mb-6 text-red-500">Send us a Message</h3>

                  {contactMessage && (
                    <div className={`p-4 rounded-lg mb-6 text-sm border ${contactMessage.includes('Thank you')
                      ? 'bg-green-500/20 text-green-200 border-green-500/30'
                      : 'bg-red-500/20 text-red-200 border-red-500/30'
                      }`}>
                      {contactMessage}
                    </div>
                  )}

                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={contactForm.name}
                        onChange={handleContactChange}
                        required
                        className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-400 transition-all"
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        required
                        className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-400 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={contactForm.subject}
                        onChange={handleContactChange}
                        required
                        className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white transition-all"
                      >
                        <option value="">Select a topic</option>
                        <option value="general">General Question</option>
                        <option value="setup">Setup Assistance</option>
                        <option value="features">Feature Request</option>
                        <option value="billing">Billing Question</option>
                        <option value="technical">Technical Support</option>
                        <option value="partnership">Partnership Inquiry</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={contactForm.message}
                        onChange={handleContactChange}
                        rows={5}
                        required
                        className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-400 transition-all resize-none"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={contactLoading}
                      className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-all font-medium flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
                    >
                      {contactLoading ? 'Sending...' : 'Send Message'}
                      {!contactLoading && <ArrowRight className="h-4 w-4" />}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="relative text-white py-20 border-y border-red-900/50 overflow-hidden">
          {/* Dark Veil Background */}
          <div className="absolute inset-0">
            <DarkVeil
              speed={0.8}
              hueShift={237}
              noiseIntensity={0.1}
              scanlineIntensity={0.05}
              scanlineFrequency={0.5}
              warpAmount={0.02}
            />
          </div>

          {/* Content */}
          <div className="relative max-w-4xl mx-auto text-center px-4">
            <h2 className="text-4xl font-bold mb-6">Ready to Turn Your Bio Into Booked Showings?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join agents who are already getting 5-10 showing requests monthly. One extra deal pays for AgentLinker for years.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="bg-black text-red-500 px-8 py-4 rounded-full hover:bg-neutral-900 transition-colors font-semibold text-lg border border-red-500 inline-flex items-center gap-2 shadow-xl">
                Get Started →
                <ArrowRight className="h-5 w-5" />
              </Link>
              <div className="text-sm opacity-80 self-center">
                No credit card • Setup in 5 minutes • Cancel anytime
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black text-white py-12 border-t border-red-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <Home className="h-6 w-6 text-red-600" />
                  <span className="ml-2 text-xl font-bold text-red-500">AgentLinker</span>
                </div>
                <p className="text-gray-500 text-sm">
                  The smart growth hub for real estate agents.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-red-500">Product</h4>
                <ul className="space-y-2 text-gray-500 text-sm">
                  <li><Link href="/features" className="hover:text-red-500">Features</Link></li>
                  <li><Link href="/pricing" className="hover:text-red-500">Pricing</Link></li>
                  <li><Link href="/demo" className="hover:text-red-500">Demo</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-red-500">Company</h4>
                <ul className="space-y-2 text-gray-500 text-sm">
                  <li><Link href="/about" className="hover:text-red-500">About</Link></li>
                  <li><Link href="/blog" className="hover:text-red-500">Blog</Link></li>
                  <li><Link href="/contact" className="hover:text-red-500">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-red-500">Legal</h4>
                <ul className="space-y-2 text-gray-500 text-sm">
                  <li><Link href="/privacy" className="hover:text-red-500">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:text-red-500">Terms</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-red-900/30 mt-8 pt-8 text-center text-gray-600 text-sm">
              © 2025 AgentLinker. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div >
  )
}
