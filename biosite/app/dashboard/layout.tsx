import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import DarkVeil from '@/components/DarkVeil'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
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
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

