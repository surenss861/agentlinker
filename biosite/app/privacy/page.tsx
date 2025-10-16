'use client'

import Link from 'next/link'
import { ArrowLeft, Home, Shield, Mail, Phone } from 'lucide-react'
import DarkVeil from '@/components/DarkVeil'

export default function PrivacyPage() {
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
      <section className="pt-24 pb-12 relative overflow-hidden">
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
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-red-500 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Privacy Policy
            </h1>
          </div>
          <p className="text-xl text-gray-300 mb-8">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-gray-400">
            Last updated: January 2025
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <div className="prose prose-invert max-w-none">
                
                <h2 className="text-2xl font-bold mb-6 text-white">Information We Collect</h2>
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 text-red-400">Personal Information</h3>
                  <p className="text-gray-300 mb-4">
                    When you create an account with AgentLinker, we collect:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                    <li>Name and contact information (email, phone number)</li>
                    <li>Real estate license information</li>
                    <li>Brokerage affiliation</li>
                    <li>Profile photos and bio information</li>
                    <li>Property listings and associated data</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold mb-4 text-red-400">Usage Information</h3>
                  <p className="text-gray-300 mb-4">
                    We automatically collect information about how you use our service:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                    <li>Page views and interactions</li>
                    <li>Booking requests and lead data</li>
                    <li>Device and browser information</li>
                    <li>IP address and location data</li>
                    <li>Analytics and performance metrics</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold mb-6 text-white">How We Use Your Information</h2>
                <div className="mb-8">
                  <p className="text-gray-300 mb-4">
                    We use your information to:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                    <li>Provide and improve our real estate platform services</li>
                    <li>Process bookings and manage appointments</li>
                    <li>Send notifications and updates about your account</li>
                    <li>Generate analytics and insights for your business</li>
                    <li>Provide customer support and technical assistance</li>
                    <li>Ensure platform security and prevent fraud</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold mb-6 text-white">Information Sharing</h2>
                <div className="mb-8">
                  <p className="text-gray-300 mb-4">
                    We do not sell your personal information. We may share your information only in these circumstances:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                    <li><strong>With your consent:</strong> When you explicitly authorize sharing</li>
                    <li><strong>Service providers:</strong> Trusted third parties who help us operate our platform</li>
                    <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
                    <li><strong>Business transfers:</strong> In connection with mergers or acquisitions</li>
                    <li><strong>Public listings:</strong> Property information you choose to make public</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold mb-6 text-white">Data Security</h2>
                <div className="mb-8">
                  <p className="text-gray-300 mb-4">
                    We implement industry-standard security measures to protect your information:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                    <li>End-to-end encryption for sensitive data</li>
                    <li>Secure cloud infrastructure with regular security audits</li>
                    <li>Access controls and authentication protocols</li>
                    <li>Regular security updates and monitoring</li>
                    <li>Employee training on data protection practices</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold mb-6 text-white">Your Rights</h2>
                <div className="mb-8">
                  <p className="text-gray-300 mb-4">
                    You have the right to:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                    <li>Access and review your personal information</li>
                    <li>Correct inaccurate or incomplete data</li>
                    <li>Delete your account and associated data</li>
                    <li>Export your data in a portable format</li>
                    <li>Opt out of marketing communications</li>
                    <li>Withdraw consent for data processing</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold mb-6 text-white">Cookies and Tracking</h2>
                <div className="mb-8">
                  <p className="text-gray-300 mb-4">
                    We use cookies and similar technologies to:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                    <li>Remember your preferences and settings</li>
                    <li>Analyze website traffic and usage patterns</li>
                    <li>Provide personalized content and features</li>
                    <li>Improve our services and user experience</li>
                  </ul>
                  <p className="text-gray-300">
                    You can control cookie settings through your browser preferences.
                  </p>
                </div>

                <h2 className="text-2xl font-bold mb-6 text-white">Third-Party Services</h2>
                <div className="mb-8">
                  <p className="text-gray-300 mb-4">
                    Our platform integrates with third-party services:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                    <li><strong>Stripe:</strong> Payment processing (subject to Stripe's privacy policy)</li>
                    <li><strong>Supabase:</strong> Database and authentication services</li>
                    <li><strong>Vercel:</strong> Hosting and deployment platform</li>
                    <li><strong>Email services:</strong> For notifications and communications</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold mb-6 text-white">Children's Privacy</h2>
                <div className="mb-8">
                  <p className="text-gray-300">
                    AgentLinker is not intended for children under 13. We do not knowingly collect 
                    personal information from children under 13. If we become aware that we have 
                    collected such information, we will take steps to delete it promptly.
                  </p>
                </div>

                <h2 className="text-2xl font-bold mb-6 text-white">Changes to This Policy</h2>
                <div className="mb-8">
                  <p className="text-gray-300">
                    We may update this privacy policy from time to time. We will notify you of 
                    any material changes by posting the new policy on this page and updating the 
                    "Last updated" date. Your continued use of our service after such changes 
                    constitutes acceptance of the updated policy.
                  </p>
                </div>


              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
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
