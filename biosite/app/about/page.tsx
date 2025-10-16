'use client'

import Link from 'next/link'
import { ArrowRight, Check, Home, Star, Users, Calendar, BarChart3, Zap, Shield, Globe, Phone, Mail, Clock } from 'lucide-react'
import DarkVeil from '@/components/DarkVeil'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-red-900/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center space-x-2">
                            <Home className="h-8 w-8 text-red-600" />
                            <span className="text-xl font-bold text-red-500">AgentLinker</span>
                        </Link>
                        <div className="flex items-center space-x-4">
                            <Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
                            <Link href="/signup" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-24 pb-20 relative overflow-hidden">
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

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        About <span className="text-red-500">AgentLinker</span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                        The complete real estate growth platform designed to transform your bio into booked showings.
                        Built by agents, for agents.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/signup" className="bg-red-600 text-white px-8 py-4 rounded-full hover:bg-red-700 transition-colors font-semibold text-lg inline-flex items-center gap-2">
                            Start Your Free Trial
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link href="/demo" className="bg-transparent border border-red-500 text-red-500 px-8 py-4 rounded-full hover:bg-red-500 hover:text-white transition-colors font-semibold text-lg">
                            View Demo
                        </Link>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                        <div className="relative bg-black/90 backdrop-blur-sm rounded-2xl border border-red-500/30 p-12 text-center shadow-2xl">
                            <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
                            <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto">
                                We believe every real estate agent deserves a professional, lead-generating online presence.
                                AgentLinker eliminates the technical barriers, expensive developers, and time-consuming setup
                                that prevent agents from growing their business online.
                            </p>
                            <div className="grid md:grid-cols-3 gap-8 mt-12">
                                <div>
                                    <div className="text-4xl mb-4">🎯</div>
                                    <h3 className="text-xl font-semibold mb-2">Lead-First Design</h3>
                                    <p className="text-gray-400">Every element optimized to convert visitors into booked showings</p>
                                </div>
                                <div>
                                    <div className="text-4xl mb-4">⚡</div>
                                    <h3 className="text-xl font-semibold mb-2">Instant Setup</h3>
                                    <p className="text-gray-400">Professional pages live in minutes, not months</p>
                                </div>
                                <div>
                                    <div className="text-4xl mb-4">📊</div>
                                    <h3 className="text-xl font-semibold mb-2">Real ROI Tracking</h3>
                                    <p className="text-gray-400">See exactly how your online presence drives business</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Complete Service Suite</h2>
                        <p className="text-xl text-gray-400">Everything you need to grow your real estate business online</p>
                    </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Professional Bio Pages */}
            <div className="relative h-[400px]">
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
              
              <div className="relative bg-black/90 backdrop-blur-sm rounded-xl border border-red-500/30 p-8 shadow-xl h-full flex flex-col">
                <div className="text-4xl mb-4">👤</div>
                <h3 className="text-2xl font-bold mb-4">Professional Bio Pages</h3>
                <p className="text-gray-300 mb-6 flex-grow">
                  Customizable agent profiles with premium templates, high-quality photos, and lead-optimized layouts.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span>Premium templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span>Custom branding</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span>Mobile optimized</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span>SEO friendly</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Listing Management */}
            <div className="relative h-[400px]">
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
              
              <div className="relative bg-black/90 backdrop-blur-sm rounded-xl border border-red-500/30 p-8 shadow-xl h-full flex flex-col">
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="text-2xl font-bold mb-4">Listing Management</h3>
                <p className="text-gray-300 mb-6 flex-grow">
                  Unlimited property listings with drag-and-drop management, high-res photos, and public pages.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span>Unlimited listings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span>Drag-and-drop editor</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span>Public listing pages</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span>Image galleries</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Booking Scheduler */}
            <div className="relative h-[400px]">
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
              
              <div className="relative bg-black/90 backdrop-blur-sm rounded-xl border border-red-500/30 p-8 shadow-xl h-full flex flex-col">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-2xl font-bold mb-4">Booking Scheduler</h3>
                <p className="text-gray-300 mb-6 flex-grow">
                  Real-time appointment booking with status workflows, automated reminders, and calendar sync.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span>Real-time booking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span>Status workflows</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span>Automated reminders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span>Calendar integration</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Lead Management */}
            <div className="relative h-[400px]">
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
              
              <div className="relative bg-black/90 backdrop-blur-sm rounded-xl border border-red-500/30 p-8 shadow-xl h-full flex flex-col">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold mb-4">Lead Management</h3>
                <p className="text-gray-300 mb-6 flex-grow">
                  Real-time lead capture with status tracking, contact management, and automated follow-up.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span>Real-time capture</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span>Status tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span>Contact management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span>Automated follow-up</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Analytics Dashboard */}
            <div className="relative h-[400px]">
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
              
              <div className="relative bg-black/90 backdrop-blur-sm rounded-xl border border-red-500/30 p-8 shadow-xl h-full flex flex-col">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-2xl font-bold mb-4">Analytics Dashboard</h3>
                <p className="text-gray-300 mb-6 flex-grow">
                  Comprehensive tracking of views, leads, bookings, and ROI with real-time insights.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span>View tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span>Lead analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span>ROI reporting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span>Real-time updates</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Custom Domain */}
            <div className="relative h-[400px]">
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
              
              <div className="relative bg-black/90 backdrop-blur-sm rounded-xl border border-red-500/30 p-8 shadow-xl h-full flex flex-col">
                <div className="text-4xl mb-4">🌐</div>
                <h3 className="text-2xl font-bold mb-4">Custom Domain</h3>
                <p className="text-gray-300 mb-6 flex-grow">
                  Professional custom domain setup with SSL certificates and seamless integration.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span>Custom domain</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span>SSL certificates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span>Easy setup</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span>Professional branding</span>
                  </li>
                </ul>
              </div>
            </div>
                    </div>
                </div>
            </section>

            {/* Technology Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

                        <div className="relative bg-black/90 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-12 shadow-2xl">
                            <div className="text-center mb-12">
                                <h2 className="text-4xl font-bold mb-4">Built on Modern Technology</h2>
                                <p className="text-xl text-gray-300">
                                    Powered by enterprise-grade infrastructure for reliability, security, and performance
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <div className="text-center">
                                    <div className="text-3xl mb-3">⚡</div>
                                    <h3 className="text-lg font-semibold mb-2">Real-time Updates</h3>
                                    <p className="text-sm text-gray-400">Instant synchronization across all devices</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl mb-3">🔒</div>
                                    <h3 className="text-lg font-semibold mb-2">Enterprise Security</h3>
                                    <p className="text-sm text-gray-400">Bank-level encryption and security</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl mb-3">📱</div>
                                    <h3 className="text-lg font-semibold mb-2">Mobile Optimized</h3>
                                    <p className="text-sm text-gray-400">Perfect experience on all devices</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl mb-3">🚀</div>
                                    <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
                                    <p className="text-sm text-gray-400">Optimized for speed and performance</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-xl text-gray-400">One plan. Everything included. No hidden fees.</p>
                    </div>

                    <div className="flex justify-center">
                        <div className="relative max-w-md w-full">
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

                            <div className="relative bg-black/90 backdrop-blur-sm rounded-2xl border border-red-500/30 p-8 text-white shadow-2xl">
                                <div className="text-center">
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-red-500 px-6 py-2 rounded-full text-sm font-bold border border-red-500">
                                        ⚡ EVERYTHING INCLUDED
                                    </div>

                                    <h3 className="text-3xl font-bold mb-4 mt-4">AgentLinker Pro</h3>
                                    <div className="text-6xl font-bold mb-2">$20<span className="text-2xl opacity-90">/mo</span></div>
                                    <p className="text-red-100 text-lg mb-8">Your complete real estate growth platform</p>

                                    <div className="space-y-3 mb-8 text-sm">
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
                                            <span>Lead Management</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check className="h-4 w-4 flex-shrink-0" />
                                            <span>Analytics Dashboard</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check className="h-4 w-4 flex-shrink-0" />
                                            <span>Custom Domain</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check className="h-4 w-4 flex-shrink-0" />
                                            <span>Real-time Updates</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check className="h-4 w-4 flex-shrink-0" />
                                            <span>Priority Support</span>
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
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative overflow-hidden">
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

                <div className="relative max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
                    <p className="text-xl mb-8 opacity-90">
                        Join hundreds of agents who are already getting 5-10 showing requests monthly.
                        One extra deal pays for AgentLinker for years.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/signup" className="bg-red-600 text-white px-8 py-4 rounded-full hover:bg-red-700 transition-colors font-semibold text-lg inline-flex items-center gap-2 shadow-xl">
                            Start Your Free Trial
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
                                <li><Link href="/about" className="hover:text-red-500">About</Link></li>
                                <li><Link href="/demo" className="hover:text-red-500">Demo</Link></li>
                                <li><Link href="/signup" className="hover:text-red-500">Sign Up</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-red-500">Support</h4>
                            <ul className="space-y-2 text-gray-500 text-sm">
                                <li><Link href="/contact" className="hover:text-red-500">Contact</Link></li>
                                <li><Link href="/help" className="hover:text-red-500">Help Center</Link></li>
                                <li><Link href="/status" className="hover:text-red-500">Status</Link></li>
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
    )
}
