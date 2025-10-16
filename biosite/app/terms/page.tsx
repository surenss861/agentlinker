'use client'

import Link from 'next/link'
import { ArrowLeft, Home, FileText, Mail, Phone } from 'lucide-react'
import DarkVeil from '@/components/DarkVeil'

export default function TermsPage() {
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
            <FileText className="h-12 w-12 text-red-500 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Terms of Service
            </h1>
          </div>
          <p className="text-xl text-gray-300 mb-8">
            Please read these terms carefully before using AgentLinker. By using our service, you agree to these terms.
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
                
                <h2 className="text-2xl font-bold mb-6 text-white">Acceptance of Terms</h2>
                <div className="mb-8">
                  <p className="text-gray-300 mb-4">
                    By accessing and using AgentLinker ("the Service"), you accept and agree to be bound by the terms 
                    and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </div>

                <h2 className="text-2xl font-bold mb-6 text-white">Description of Service</h2>
                <div className="mb-8">
                  <p className="text-gray-300 mb-4">
                    AgentLinker is a comprehensive real estate platform that provides:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                    <li>Professional bio page creation and management</li>
                    <li>Property listing management and display</li>
                    <li>Booking and appointment scheduling</li>
                    <li>Lead capture and management tools</li>
                    <li>Analytics and reporting dashboard</li>
                    <li>Custom domain integration</li>
                    <li>Real-time notifications and updates</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold mb-6 text-white">User Accounts</h2>
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 text-red-400">Account Creation</h3>
                  <p className="text-gray-300 mb-4">
                    To use our service, you must:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                    <li>Provide accurate and complete information</li>
                    <li>Maintain the security of your password</li>
                    <li>Be at least 18 years of age</li>
                    <li>Have a valid real estate license (where applicable)</li>
                    <li>Accept responsibility for all activities under your account</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold mb-4 text-red-400">Account Termination</h3>
                  <p className="text-gray-300 mb-4">
                    We reserve the right to terminate accounts that:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                    <li>Violate these terms of service</li>
                    <li>Engage in fraudulent or illegal activities</li>
                    <li>Provide false or misleading information</li>
                    <li>Fail to pay subscription fees</li>
                    <li>Misuse the platform or its features</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold mb-6 text-white">Subscription and Payment</h2>
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 text-red-400">Pricing</h3>
                  <p className="text-gray-300 mb-4">
                    Our current pricing is $20/month for the AgentLinker Pro plan, which includes all features. 
                    Pricing may change with 30 days notice to existing subscribers.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-4 text-red-400">Payment Terms</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                    <li>Subscriptions are billed monthly in advance</li>
                    <li><strong>NO REFUNDS:</strong> All fees are non-refundable and non-transferable</li>
                    <li>Failed payments may result in service suspension</li>
                    <li>You are responsible for all applicable taxes</li>
                    <li>We accept major credit cards and other payment methods</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold mb-4 text-red-400">Cancellation</h3>
                  <p className="text-gray-300 mb-4">
                    You may cancel your subscription at any time. Cancellation takes effect at the end of your 
                    current billing period. <strong>NO REFUNDS</strong> are provided for unused time or cancelled subscriptions.
                  </p>
                </div>

                <h2 className="text-2xl font-bold mb-6 text-white">User Content and Conduct</h2>
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 text-red-400">Content Ownership</h3>
                  <p className="text-gray-300 mb-4">
                    You retain ownership of all content you upload to AgentLinker, including:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                    <li>Profile information and photos</li>
                    <li>Property listings and descriptions</li>
                    <li>Contact information and communications</li>
                    <li>Any other materials you provide</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold mb-4 text-red-400">Content License</h3>
                  <p className="text-gray-300 mb-4">
                    By uploading content, you grant AgentLinker a non-exclusive, royalty-free license to:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                    <li>Display and distribute your content on our platform</li>
                    <li>Process and store your content for service delivery</li>
                    <li>Create backups and ensure data security</li>
                    <li>Improve our services using aggregated, anonymized data</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold mb-4 text-red-400">Prohibited Content</h3>
                  <p className="text-gray-300 mb-4">
                    You may not upload content that:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                    <li>Is illegal, harmful, or violates any laws</li>
                    <li>Infringes on intellectual property rights</li>
                    <li>Contains false or misleading information</li>
                    <li>Is spam, abusive, or harassing</li>
                    <li>Contains malware or malicious code</li>
                    <li>Violates fair housing or discrimination laws</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold mb-6 text-white">Intellectual Property</h2>
                <div className="mb-8">
                  <p className="text-gray-300 mb-4">
                    AgentLinker and its original content, features, and functionality are owned by AgentLinker Inc. 
                    and are protected by international copyright, trademark, patent, trade secret, and other 
                    intellectual property laws.
                  </p>
                  <p className="text-gray-300 mb-4">
                    You may not:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                    <li>Copy, modify, or distribute our software or content</li>
                    <li>Reverse engineer or attempt to extract source code</li>
                    <li>Use our trademarks or branding without permission</li>
                    <li>Create derivative works based on our platform</li>
                    <li>Remove or alter copyright notices</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold mb-6 text-white">Service Availability</h2>
                <div className="mb-8">
                  <p className="text-gray-300 mb-4">
                    We strive to maintain high service availability but cannot guarantee uninterrupted access. 
                    We may:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                    <li>Perform scheduled maintenance with advance notice</li>
                    <li>Implement emergency updates as needed</li>
                    <li>Suspend service for security or legal reasons</li>
                    <li>Modify or discontinue features with notice</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold mb-6 text-white">Limitation of Liability</h2>
                <div className="mb-8">
                  <p className="text-gray-300 mb-4">
                    To the maximum extent permitted by law, AgentLinker shall not be liable for:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                    <li>Indirect, incidental, or consequential damages</li>
                    <li>Loss of profits, data, or business opportunities</li>
                    <li>Service interruptions or technical issues</li>
                    <li>Third-party actions or content</li>
                    <li>Damages exceeding the amount paid for the service</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold mb-6 text-white">Indemnification</h2>
                <div className="mb-8">
                  <p className="text-gray-300">
                    You agree to indemnify and hold harmless AgentLinker from any claims, damages, or expenses 
                    arising from your use of the service, violation of these terms, or infringement of any 
                    third-party rights.
                  </p>
                </div>

                <h2 className="text-2xl font-bold mb-6 text-white">Dispute Resolution</h2>
                <div className="mb-8">
                  <p className="text-gray-300 mb-4">
                    Any disputes arising from these terms or your use of the service shall be resolved through:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                    <li>Good faith negotiations first</li>
                    <li>Binding arbitration if negotiations fail</li>
                    <li>Individual claims only (no class actions)</li>
                    <li>Governing law of the jurisdiction where AgentLinker is incorporated</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold mb-6 text-white">Changes to Terms</h2>
                <div className="mb-8">
                  <p className="text-gray-300">
                    We may modify these terms at any time. Material changes will be communicated with 30 days 
                    notice. Your continued use of the service after changes constitutes acceptance of the new terms. 
                    If you disagree with changes, you may terminate your account.
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
