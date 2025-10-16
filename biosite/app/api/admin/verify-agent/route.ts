import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

/**
 * Admin endpoint to toggle agent verification status
 * POST /api/admin/verify-agent
 * 
 * Body: { userId: string, verified: boolean }
 * 
 * Note: In production, add proper admin authentication check
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Add admin role check here
    // For now, only allow if user is admin (you can add an is_admin column to users table)
    // const { data: adminCheck } = await supabase
    //   .from('users')
    //   .select('is_admin')
    //   .eq('id', user.id)
    //   .single()
    // 
    // if (!adminCheck?.is_admin) {
    //   return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 })
    // }

    const body = await request.json()
    const { userId, verified } = body

    if (!userId || typeof verified !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required fields: userId and verified (boolean)' },
        { status: 400 }
      )
    }

    // Update user's verified_badge status
    const { data, error } = await supabase
      .from('users')
      .update({ verified_badge: verified })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating verification status:', error)
      return NextResponse.json(
        { error: 'Failed to update verification status', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Agent ${verified ? 'verified' : 'unverified'} successfully`,
      data
    })
  } catch (error) {
    console.error('Error in verify-agent endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Get list of all agents with their verification status
 * GET /api/admin/verify-agent
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Add admin role check here

    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, email, slug, verified_badge, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching agents:', error)
      return NextResponse.json(
        { error: 'Failed to fetch agents' },
        { status: 500 }
      )
    }

    return NextResponse.json({ agents: data })
  } catch (error) {
    console.error('Error in verify-agent GET endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

