'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Home, Calendar, TrendingUp, Star, Check, Mail, Phone, MapPin, Bed, Bath, Square, User, Eye, MessageSquare } from 'lucide-react'
import Image from 'next/image'

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [dashboardTab, setDashboardTab] = useState('overview')

  const demoListings = [
    {
      id: 1,
      title: "Modern Downtown Condo",
      price: "$750,000",
      address: "123 King Street, Toronto",
      bedrooms: 2,
      bathrooms: 2,
      sqft: "1,200",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop&crop=center",
      status: "active"
    },
    {
      id: 2,
      title: "Luxury Family Home",
      price: "$1,200,000",
      address: "456 Oak Avenue, Toronto",
      bedrooms: 4,
      bathrooms: 3,
      sqft: "2,800",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop&crop=center",
      status: "active"
    }
  ]

  const demoLeads = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "(555) 123-4567",
      message: "Interested in viewing the downtown condo tomorrow afternoon",
      status: "new",
      created_at: "2 hours ago"
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike.chen@email.com",
      phone: "(555) 987-6543",
      message: "Would like to schedule a showing for the luxury home",
      status: "contacted",
      created_at: "1 day ago"
    }
  ]

  const demoBookings = [
    {
      id: 1,
      client_name: "Sarah Johnson",
      listing_title: "Modern Downtown Condo",
      scheduled_at: "Tomorrow, 2:00 PM",
      status: "confirmed"
    },
    {
      id: 2,
      client_name: "Mike Chen",
      listing_title: "Luxury Family Home", 
      scheduled_at: "Friday, 10:00 AM",
      status: "pending"
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="border-b border-red-900/30 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-red-600" />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                AgentLinker
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-300 hover:text-red-500 font-medium">
                Home
              </Link>
              <Link href="/signup" className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors font-medium">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            See AgentLinker in{' '}
            <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
              Action
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Experience the complete agent dashboard and public profile in this interactive demo
          </p>
        </div>
      </section>

      {/* Demo Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === 'profile'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Public Profile
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Agent Dashboard
            </button>
          </div>
        </div>

        {/* Public Profile Demo */}
        {activeTab === 'profile' && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-b from-[#0A0A0A] to-[#1A0E10] rounded-2xl border border-red-900/30 overflow-hidden">
              {/* Red Stripe */}
              <div className="w-3 h-full bg-gradient-to-b from-red-500 to-red-600 absolute left-0 top-0 z-50"></div>
              
              <div className="ml-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#912F40]/30">
                  <div className="flex items-center">
                    <Home className="h-5 w-5 text-white" />
                    <span className="text-2xl font-bold text-[#912F40] ml-2">AgentLinker</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700 transition">Share</button>
                    <button className="px-4 py-2 bg-[#912F40] hover:bg-[#702632] text-white rounded-lg text-sm transition">Get Started</button>
                  </div>
                </div>

                {/* Agent Profile Hero Section */}
                <section className="w-full text-center py-16 border-b border-[#912F40]/30">
                  <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-[#912F40] shadow-xl">
                    <Image
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
                      alt="Sarah Williams"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                    Sarah Williams
                    <span className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/30">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  </h1>
                  
                  <p className="text-[#912F40] text-xl font-medium mb-4">XYZ Realty</p>
                  
                  <p className="text-gray-400 max-w-2xl mx-auto mb-6">
                    Toronto's premier real estate agent with 8+ years of experience. Specializing in luxury condos and family homes in downtown Toronto.
                  </p>

                  <div className="flex justify-center gap-4 text-sm text-gray-300">
                    <a href="mailto:sarah@example.com" className="hover:text-white flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      sarah@example.com
                    </a>
                    <a href="tel:+14165551234" className="hover:text-white flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      (416) 555-1234
                    </a>
                  </div>
                </section>

                {/* Featured Listings */}
                <section className="px-6 py-16">
                  <h2 className="text-3xl font-bold text-white mb-8 text-center">Featured Listings</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    {demoListings.map((listing) => (
                      <div key={listing.id} className="bg-black/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#912F40]/30 hover:border-[#912F40]/50 transition-all duration-300 shadow-xl">
                        <div className="relative h-64">
                          <Image
                            src={listing.image}
                            alt={listing.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                          />
                          <div className="absolute top-4 left-4 bg-[#912F40] text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                            {listing.price}
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-white mb-3">{listing.title}</h3>
                          <p className="text-gray-400 text-sm mb-4 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-[#912F40]" />
                            {listing.address}
                          </p>
                          <div className="flex gap-6 text-sm text-gray-300 mb-6">
                            <span className="flex items-center gap-2">
                              <Bed className="h-4 w-4 text-[#912F40]" />
                              {listing.bedrooms} bed
                            </span>
                            <span className="flex items-center gap-2">
                              <Bath className="h-4 w-4 text-[#912F40]" />
                              {listing.bathrooms} bath
                            </span>
                            <span className="flex items-center gap-2">
                              <Square className="h-4 w-4 text-[#912F40]" />
                              {listing.sqft} sqft
                            </span>
                          </div>
                          <button className="w-full bg-[#912F40] hover:bg-[#702632] text-white py-3 rounded-lg font-semibold transition-colors duration-200">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Contact Form Section */}
                <section className="px-6 py-16">
                  <div className="max-w-2xl mx-auto bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-[#912F40]/30">
                    <h3 className="text-2xl font-bold text-white mb-6 text-center">Request a Showing</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Your Name"
                        className="bg-black/50 border border-[#702632]/40 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#912F40] focus:border-[#912F40]"
                      />
                      <input
                        type="email"
                        placeholder="Your Email"
                        className="bg-black/50 border border-[#702632]/40 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#912F40] focus:border-[#912F40]"
                      />
                      <input
                        type="tel"
                        placeholder="Your Phone"
                        className="bg-black/50 border border-[#702632]/40 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#912F40] focus:border-[#912F40]"
                      />
                      <select className="bg-black/50 border border-[#702632]/40 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#912F40] focus:border-[#912F40]">
                        <option>Select Property</option>
                        <option>Modern Downtown Condo</option>
                        <option>Luxury Family Home</option>
                      </select>
                    </div>
                    <textarea
                      placeholder="Tell me about your requirements..."
                      rows={4}
                      className="w-full bg-black/50 border border-[#702632]/40 rounded-lg px-4 py-3 text-white placeholder-gray-500 mt-4 focus:ring-2 focus:ring-[#912F40] focus:border-[#912F40]"
                    />
                    <button className="w-full bg-[#912F40] text-white py-3 rounded-lg hover:bg-[#702632] transition-colors mt-6 font-semibold">
                      Send Request
                    </button>
                  </div>
                </section>
              </div>

              {/* Sticky CTA */}
              <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-red-900/30 p-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Ready to get started?</p>
                    <p className="text-gray-400 text-sm">Join 500+ agents already using AgentLinker</p>
                  </div>
                  <Link
                    href="/signup"
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Get Started Free
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Demo */}
        {activeTab === 'dashboard' && (
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-b from-[#080705] to-[#1A0E10] rounded-2xl border border-red-900/30 overflow-hidden">
              {/* Dashboard Header */}
              <div className="bg-gray-800/50 p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-white">Agent Dashboard</h1>
                    <p className="text-gray-400">Welcome back, Sarah Williams</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                      ✓ Verified Agent
                    </div>
                    <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                      ✓ Pro Plan Active
                    </div>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Total Leads</p>
                        <p className="text-3xl font-bold text-white">127</p>
                        <p className="text-green-400 text-xs">+23% this month</p>
                      </div>
                      <MessageSquare className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-green-500/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Active Listings</p>
                        <p className="text-3xl font-bold text-white">24</p>
                        <p className="text-green-400 text-xs">3 new this week</p>
                      </div>
                      <Home className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Bookings</p>
                        <p className="text-3xl font-bold text-white">18</p>
                        <p className="text-green-400 text-xs">5 this week</p>
                      </div>
                      <Calendar className="h-8 w-8 text-purple-500" />
                    </div>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-red-500/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Conversion Rate</p>
                        <p className="text-3xl font-bold text-white">21%</p>
                        <p className="text-green-400 text-xs">+4% improvement</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-red-500" />
                    </div>
                  </div>
                </div>

                {/* Dashboard Tabs */}
                <div className="flex justify-center mb-8">
                  <div className="bg-gray-800/50 rounded-lg p-1">
                    <button 
                      onClick={() => setDashboardTab('overview')}
                      className={`px-6 py-2 rounded-md font-medium transition-all text-sm ${
                        dashboardTab === 'overview' 
                          ? 'bg-red-600 text-white' 
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      Overview
                    </button>
                    <button 
                      onClick={() => setDashboardTab('analytics')}
                      className={`px-6 py-2 rounded-md font-medium transition-all text-sm ${
                        dashboardTab === 'analytics' 
                          ? 'bg-red-600 text-white' 
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      Analytics
                    </button>
                    <button 
                      onClick={() => setDashboardTab('settings')}
                      className={`px-6 py-2 rounded-md font-medium transition-all text-sm ${
                        dashboardTab === 'settings' 
                          ? 'bg-red-600 text-white' 
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      Settings
                    </button>
                  </div>
                </div>

                {/* Dashboard Content Based on Active Tab */}
                {dashboardTab === 'overview' && (
                  <>
                    {/* Main Dashboard Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  {/* Recent Leads */}
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white">Recent Leads</h3>
                      <span className="text-xs text-gray-400">Last 7 days</span>
                    </div>
                    <div className="space-y-3">
                      {demoLeads.map((lead) => (
                        <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {lead.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-white text-sm">{lead.name}</p>
                              <p className="text-xs text-gray-400">{lead.created_at}</p>
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs ${
                            lead.status === 'new' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                          }`}>
                            {lead.status}
                          </div>
                        </div>
                      ))}
                      <button className="w-full text-center text-sm text-gray-400 hover:text-white py-2">
                        View All Leads →
                      </button>
                    </div>
                  </div>

                  {/* Upcoming Bookings */}
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white">Upcoming Bookings</h3>
                      <span className="text-xs text-gray-400">Next 7 days</span>
                    </div>
                    <div className="space-y-3">
                      {demoBookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {booking.client_name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-white text-sm">{booking.client_name}</p>
                              <p className="text-xs text-gray-400">{booking.scheduled_at}</p>
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs ${
                            booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {booking.status}
                          </div>
                        </div>
                      ))}
                      <button className="w-full text-center text-sm text-gray-400 hover:text-white py-2">
                        View All Bookings →
                      </button>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors">
                        + Add New Listing
                      </button>
                      <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors">
                        📊 View Analytics
                      </button>
                      <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors">
                        ⚙️ Account Settings
                      </button>
                      <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors">
                        📧 Export Leads
                      </button>
                    </div>
                  </div>
                </div>

                {/* Analytics Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Performance Chart */}
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-white mb-4">Performance Overview</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Page Views</span>
                        <span className="text-white font-bold">2,847</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '75%'}}></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Lead Forms</span>
                        <span className="text-white font-bold">127</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '45%'}}></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Bookings</span>
                        <span className="text-white font-bold">18</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{width: '21%'}}></div>
                      </div>
                    </div>
                  </div>

                  {/* Top Performing Listings */}
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-white mb-4">Top Performing Listings</h3>
                    <div className="space-y-3">
                      {demoListings.map((listing, index) => (
                        <div key={listing.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-white text-sm">{listing.title}</p>
                              <p className="text-xs text-gray-400">{listing.price}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white text-sm font-bold">47 views</p>
                            <p className="text-xs text-gray-400">3 leads</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                  </>
                )}

                {/* Analytics Tab Content */}
                {dashboardTab === 'analytics' && (
                  <div className="space-y-8">
                    {/* Analytics Header */}
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-white mb-2">📊 Analytics Dashboard</h2>
                      <p className="text-gray-400">Track your performance and optimize your listings</p>
                    </div>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-blue-200 text-sm">Total Page Views</p>
                            <p className="text-3xl font-bold">2,847</p>
                            <p className="text-blue-200 text-xs">+15% vs last month</p>
                          </div>
                          <Eye className="h-8 w-8 text-blue-200" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-green-200 text-sm">Lead Forms</p>
                            <p className="text-3xl font-bold">127</p>
                            <p className="text-green-200 text-xs">+23% vs last month</p>
                          </div>
                          <MessageSquare className="h-8 w-8 text-green-200" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-purple-200 text-sm">Bookings</p>
                            <p className="text-3xl font-bold">18</p>
                            <p className="text-purple-200 text-xs">+12% vs last month</p>
                          </div>
                          <Calendar className="h-8 w-8 text-purple-200" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-red-200 text-sm">Conversion Rate</p>
                            <p className="text-3xl font-bold">21%</p>
                            <p className="text-red-200 text-xs">+4% vs last month</p>
                          </div>
                          <TrendingUp className="h-8 w-8 text-red-200" />
                        </div>
                      </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Traffic Sources */}
                      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                        <h3 className="text-lg font-bold text-white mb-4">Traffic Sources</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Direct Traffic</span>
                            <span className="text-white font-bold">45%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-3">
                            <div className="bg-blue-500 h-3 rounded-full" style={{width: '45%'}}></div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Social Media</span>
                            <span className="text-white font-bold">30%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-3">
                            <div className="bg-green-500 h-3 rounded-full" style={{width: '30%'}}></div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Google Search</span>
                            <span className="text-white font-bold">25%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-3">
                            <div className="bg-purple-500 h-3 rounded-full" style={{width: '25%'}}></div>
                          </div>
                        </div>
                      </div>

                      {/* Monthly Trends */}
                      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                        <h3 className="text-lg font-bold text-white mb-4">Monthly Trends</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">September</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-700 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{width: '60%'}}></div>
                              </div>
                              <span className="text-white text-sm">847 views</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">October</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-700 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{width: '75%'}}></div>
                              </div>
                              <span className="text-white text-sm">1,247 views</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">November</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-700 rounded-full h-2">
                                <div className="bg-purple-500 h-2 rounded-full" style={{width: '85%'}}></div>
                              </div>
                              <span className="text-white text-sm">1,847 views</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Top Performing Listings */}
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                      <h3 className="text-lg font-bold text-white mb-4">Top Performing Listings</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-gray-400 border-b border-gray-700">
                              <th className="text-left py-3">Listing</th>
                              <th className="text-left py-3">Price</th>
                              <th className="text-left py-3">Views</th>
                              <th className="text-left py-3">Leads</th>
                              <th className="text-left py-3">Conversion</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-700/50">
                              <td className="py-3 text-white">Modern Downtown Condo</td>
                              <td className="py-3 text-gray-400">$750,000</td>
                              <td className="py-3 text-white">247</td>
                              <td className="py-3 text-white">12</td>
                              <td className="py-3 text-green-400">4.9%</td>
                            </tr>
                            <tr className="border-b border-gray-700/50">
                              <td className="py-3 text-white">Luxury Family Home</td>
                              <td className="py-3 text-gray-400">$1,200,000</td>
                              <td className="py-3 text-white">189</td>
                              <td className="py-3 text-white">8</td>
                              <td className="py-3 text-green-400">4.2%</td>
                            </tr>
                            <tr>
                              <td className="py-3 text-white">Downtown Loft</td>
                              <td className="py-3 text-gray-400">$650,000</td>
                              <td className="py-3 text-white">156</td>
                              <td className="py-3 text-white">6</td>
                              <td className="py-3 text-green-400">3.8%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Settings Tab Content */}
                {dashboardTab === 'settings' && (
                  <div className="space-y-8">
                    {/* Settings Header */}
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-white mb-2">⚙️ Account Settings</h2>
                      <p className="text-gray-400">Manage your profile and preferences</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Profile Settings */}
                      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                        <h3 className="text-lg font-bold text-white mb-4">Profile Information</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                            <input 
                              type="text" 
                              defaultValue="Sarah Williams"
                              className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Email</label>
                            <input 
                              type="email" 
                              defaultValue="sarah@example.com"
                              className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Phone</label>
                            <input 
                              type="tel" 
                              defaultValue="(416) 555-1234"
                              className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Brokerage</label>
                            <input 
                              type="text" 
                              defaultValue="XYZ Realty"
                              className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white"
                            />
                          </div>
                          <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors">
                            Save Changes
                          </button>
                        </div>
                      </div>

                      {/* Account Status */}
                      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                        <h3 className="text-lg font-bold text-white mb-4">Account Status</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <div>
                              <p className="text-white font-medium">Pro Plan</p>
                              <p className="text-green-400 text-sm">Active • $20/month</p>
                            </div>
                            <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                              ✓ Active
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <div>
                              <p className="text-white font-medium">Verified Badge</p>
                              <p className="text-blue-400 text-sm">One-time verification</p>
                            </div>
                            <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                              ✓ Verified
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-gray-500/10 border border-gray-500/30 rounded-lg">
                            <div>
                              <p className="text-white font-medium">Custom Domain</p>
                              <p className="text-gray-400 text-sm">Not configured</p>
                            </div>
                            <button className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm">
                              Setup
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Notification Settings */}
                      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                        <h3 className="text-lg font-bold text-white mb-4">Notifications</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white">New Lead Notifications</p>
                              <p className="text-gray-400 text-sm">Get notified when someone submits a lead</p>
                            </div>
                            <input type="checkbox" defaultChecked className="w-4 h-4 text-red-600" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white">Booking Reminders</p>
                              <p className="text-gray-400 text-sm">Reminders before scheduled showings</p>
                            </div>
                            <input type="checkbox" defaultChecked className="w-4 h-4 text-red-600" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white">Weekly Reports</p>
                              <p className="text-gray-400 text-sm">Performance summaries via email</p>
                            </div>
                            <input type="checkbox" className="w-4 h-4 text-red-600" />
                          </div>
                        </div>
                      </div>

                      {/* Security Settings */}
                      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                        <h3 className="text-lg font-bold text-white mb-4">Security</h3>
                        <div className="space-y-4">
                          <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors">
                            Change Password
                          </button>
                          <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors">
                            Enable Two-Factor Auth
                          </button>
                          <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors">
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8">Join 500+ agents already using AgentLinker to grow their business</p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/signup" 
              className="bg-red-600 text-white px-8 py-4 rounded-full hover:bg-red-700 transition-colors font-medium text-lg"
            >
              Get Started
            </Link>
            <Link 
              href="/" 
              className="bg-gray-800 text-white px-8 py-4 rounded-full hover:bg-gray-700 transition-colors font-medium text-lg border border-gray-600"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
