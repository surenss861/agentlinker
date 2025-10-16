import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import NavBar from '@/components/NavBar'
import DashboardWithHooks from '@/components/DashboardWithHooks'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get user profile from users table
  const { data: agent } = await supabase
    .from('users')
    .select('id, full_name, email, slug, goal_showings')
    .eq('id', user.id)
    .single()

  if (!agent) {
    redirect('/onboarding')
  }

  return (
    <>
      <NavBar />
      <DashboardWithHooks userId={user.id} agentSlug={agent.slug} />
    </>
  )
}

