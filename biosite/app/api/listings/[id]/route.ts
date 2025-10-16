import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, price, address, city, province, description, status, contact_pref, images } = body

    // Validate required fields
    if (!title || !price || !address || !city || !province) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { id } = await params

    // Update listing - ensure user owns this listing
    const { data: listing, error } = await supabase
      .from('listings')
      .update({
        title,
        price: parseFloat(price),
        address,
        city,
        province,
        description: description || '',
        status: status || 'active',
        contact_pref: contact_pref || 'email',
        images: images || [],
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user can only update their own listings
      .select()
      .single()

    if (error) {
      console.error('Supabase error updating listing:', error)
      return NextResponse.json(
        { error: 'Database error: ' + error.message },
        { status: 500 }
      )
    }

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found or you do not have permission to edit it' },
        { status: 404 }
      )
    }

    return NextResponse.json(listing, { status: 200 })
  } catch (generalError: any) {
    console.error('General error updating listing:', generalError)
    return NextResponse.json(
      { error: 'Internal server error: ' + generalError.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Delete listing - ensure user owns this listing
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user can only delete their own listings

    if (error) {
      console.error('Supabase error deleting listing:', error)
      return NextResponse.json(
        { error: 'Database error: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Listing deleted successfully' }, { status: 200 })
  } catch (generalError: any) {
    console.error('General error deleting listing:', generalError)
    return NextResponse.json(
      { error: 'Internal server error: ' + generalError.message },
      { status: 500 }
    )
  }
}
