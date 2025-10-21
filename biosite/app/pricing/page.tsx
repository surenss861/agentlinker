import { Check, Star } from 'lucide-react'
import Link from 'next/link'
import TiltedCard from '@/components/TiltedCard'

export default function PricingPage() {
  const features = [
    'Unlimited property listings',
    'Lead capture forms',
    'Showing request management',
    'Email notifications',
    'Analytics dashboard',
    'Mobile responsive design',
    'Custom branding',
    '24/7 support'
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "RE/MAX Agent",
      content: "AgentLinker increased my showing requests by 300% in just 2 months!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Keller Williams",
      content: "The lead capture forms are incredible. I'm booking 5-10 showings per week now.",
      rating: 5
    },
    {
      name: "Lisa Rodriguez",
      role: "Coldwell Banker",
      content: "Finally, a tool that actually converts visitors into real leads. Game changer!",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-red-900/20 to-black">
        <div className="absolute inset-0 bg-gradient-to-tl from-red-800/10 via-transparent to-red-600/5"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-900/5 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Simple, Transparent
              <span className="text-red-500"> Pricing</span>
            </h1>
            <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
              Start your 7-day free trial. No credit card required.
              Cancel anytime during your trial with no charges.
            </p>
          </div>
        </section>

        {/* Pricing Card */}
        <section className="pb-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-neutral-900/50 to-black/50 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-red-900/30 shadow-2xl">
              <div className="text-center mb-12">
                <div className="inline-flex items-center bg-red-600/20 text-red-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Star className="w-4 h-4 mr-2" />
                  Most Popular Choice
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">Pro Plan</h2>
                <div className="flex items-baseline justify-center mb-6">
                  <span className="text-6xl font-bold text-white">$20</span>
                  <span className="text-xl text-gray-400 ml-2">/month</span>
                </div>
                <p className="text-gray-400 text-lg">
                  Everything you need to turn website visitors into booked showings
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-6">What's Included</h3>
                  <ul className="space-y-4">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-300">
                        <Check className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-center">
                  <TiltedCard
                    imageSrc=""
                    altText="AgentLinker Dashboard"
                    captionText=""
                    containerHeight="300px"
                    containerWidth="100%"
                    imageHeight="300px"
                    imageWidth="100%"
                    rotateAmplitude={8}
                    scaleOnHover={1.05}
                    showMobileWarning={false}
                    showTooltip={false}
                    displayOverlayContent={true}
                    overlayContent={
                      <div className="w-full h-full bg-gradient-to-br from-red-900/20 to-black/40 rounded-2xl flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Star className="w-8 h-8" />
                          </div>
                          <h4 className="text-xl font-bold mb-2">Your Dashboard</h4>
                          <p className="text-sm opacity-80">Manage everything from one place</p>
                        </div>
                      </div>
                    }
                  />
                </div>
              </div>

              <div className="text-center">
                <Link
                  href="/signup"
                  className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg"
                >
                  Start 7-Day Free Trial
                </Link>
                <p className="text-gray-400 text-sm mt-4">
                  No credit card required • Cancel anytime
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-16">
              What Agents Are Saying
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-neutral-900/50 to-black/50 backdrop-blur-xl rounded-2xl p-6 border border-red-900/30"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-red-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-red-900/30 to-black/30 rounded-2xl p-12 border border-red-900/30">
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to 10x Your Showing Requests?
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Join hundreds of agents who are already using AgentLinker to book more showings
              </p>
              <Link
                href="/signup"
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg"
              >
                Start Your Free Trial Now
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
