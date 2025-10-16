import Link from 'next/link'
import { ArrowRight, Home, Calendar, TrendingUp, Star, Check } from 'lucide-react'
import DarkVeil from '@/components/DarkVeil'
import PillNav from '@/components/PillNav'

export default function HomePage() {
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
        
        {/* Pill Navigation */}
        <PillNav
          logo="/agentlinkerpfp.png"
          logoAlt="AgentLinker Logo"
          items={[
            { label: 'Sign In', href: '/login' },
            { label: 'Get Started', href: '/signup' }
          ]}
          activeHref="/"
          className="custom-nav centered-nav"
          ease="power2.easeOut"
          baseColor="#000000"
          pillColor="#ffffff"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#000000"
          initialLoadAnimation={true}
        />

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
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
              One extra deal = $10K+ commission. AgentLinker costs $600/year.
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
          <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-8 text-center text-white">
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
        </section>

        {/* Pricing Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-4 text-white">Simple, Transparent Pricing</h2>
          <p className="text-center text-gray-400 mb-12">One plan. Everything included. No hidden fees.</p>

          <div className="max-w-2xl mx-auto">
            {/* Single Pro Plan */}
            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl shadow-2xl p-12 text-white relative border-2 border-red-500">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-red-500 px-6 py-2 rounded-full text-sm font-bold border border-red-500">
                ⚡ EVERYTHING INCLUDED
              </div>

              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-4">AgentLinker Pro</h3>
                <div className="text-6xl font-bold mb-2">$20<span className="text-2xl opacity-90">/mo</span></div>
                <p className="text-red-100 text-lg">Your complete real estate growth platform</p>
              </div>

              <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 mb-10">
                <div className="flex items-start gap-3">
                  <Check className="h-6 w-6 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Unlimited Listings</p>
                    <p className="text-sm opacity-90">Showcase all your properties</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-6 w-6 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Premium Templates</p>
                    <p className="text-sm opacity-90">Luxury, Modern & Minimalist</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-6 w-6 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Booking Scheduler</p>
                    <p className="text-sm opacity-90">Automated showing bookings</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-6 w-6 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Lead Capture</p>
                    <p className="text-sm opacity-90">Instant email notifications</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-6 w-6 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Analytics Dashboard</p>
                    <p className="text-sm opacity-90">Track views, clicks & leads</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-6 w-6 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Custom Domain</p>
                    <p className="text-sm opacity-90">Use your own domain name</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-6 w-6 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">No Watermark</p>
                    <p className="text-sm opacity-90">100% your brand</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-6 w-6 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Priority Support</p>
                    <p className="text-sm opacity-90">Direct help when you need it</p>
                  </div>
                </div>
              </div>

              <Link
                href="/signup"
                className="block text-center bg-black text-red-500 px-8 py-4 rounded-full hover:bg-neutral-900 transition-all font-bold text-lg border-2 border-red-500 shadow-xl"
              >
                Get Started →
              </Link>

              <p className="text-center text-red-100 text-sm mt-4">
                No credit card required • Cancel anytime • Setup in 5 minutes
              </p>
            </div>
          </div>

          {/* Verification Badge Card */}
          <div className="mt-12 flex justify-center">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-xl p-6 text-white border border-blue-500 max-w-md w-full">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-bold text-lg">Verified Agent Badge</span>
                </div>

                <div className="text-3xl font-bold mb-2">$25</div>
                <p className="text-blue-100 text-sm mb-4">One-time verification fee</p>

                <div className="text-left space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">Blue checkmark on profile</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">Build trust with clients</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">Stand out from competition</span>
                  </div>
                </div>

                <Link
                  href="/signup"
                  className="block bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-all font-semibold text-sm border-2 border-white"
                >
                  Get Verified →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-4 text-white">Real Results from Real Agents</h2>
          <p className="text-center text-gray-400 mb-16">These numbers don't lie</p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-neutral-900 rounded-xl p-8 border border-red-900/30">
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

            <div className="bg-neutral-900 rounded-xl p-8 border border-red-900/30">
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

            <div className="bg-neutral-900 rounded-xl p-8 border border-red-900/30">
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
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20 border-y border-red-900/50">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-4xl font-bold mb-6">Ready to Turn Your Bio Into Booked Showings?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join agents who are already getting 5-10 showing requests monthly. One extra deal pays for AgentLinker for years.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="bg-black text-red-500 px-8 py-4 rounded-full hover:bg-neutral-900 transition-colors font-semibold text-lg border border-red-500 inline-flex items-center gap-2">
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
    </div>
  )
}
