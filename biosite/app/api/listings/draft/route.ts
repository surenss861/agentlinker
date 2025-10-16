import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, price, address, city, province, state, description } = body
    const stateOrProvince = province || state

    // Only save if we have at least title, price, and address
    if (!title || !price || !address) {
      return NextResponse.json({ error: 'Insufficient data for draft' }, { status: 400 })
    }

    // Check if user already has a draft
    const { data: existingDraft } = await supabase
      .from('listings')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'draft')
      .single()

    if (existingDraft) {
      // Update existing draft
      const updateData: any = {
        title,
        price: parseFloat(price),
        address,
        city,
        description,
        // Provide defaults for all commonly required columns
        zip_code: 'N/A',
        contact_pref: 'email',
        property_type: 'Residential',
        listing_type: 'For Sale',
        updated_at: new Date().toISOString()
      }
      
      // Add both state and province to handle different database schemas
      if (stateOrProvince) {
        updateData.province = stateOrProvince
        updateData.state = stateOrProvince
      }

      const { error } = await supabase
        .from('listings')
        .update(updateData)
        .eq('id', existingDraft.id)

      if (error) {
        console.error('Error updating draft:', error)
        return NextResponse.json({ error: 'Failed to update draft' }, { status: 500 })
      }
    } else {
      // Create new draft
      const insertData: any = {
        user_id: user.id,
        title,
        price: parseFloat(price),
        address,
        city,
        description,
        status: 'draft',
        // Provide defaults for all commonly required columns
        zip_code: 'N/A',
        contact_pref: 'email',
        property_type: 'Residential',
        listing_type: 'For Sale',
        bedrooms: null,
        bathrooms: null,
        square_feet: null,
        lot_size: null,
        year_built: null,
        mls_number: null,
        updated_at: new Date().toISOString()
      }
      
      // Add both state and province to handle different database schemas
      if (stateOrProvince) {
        insertData.province = stateOrProvince
        insertData.state = stateOrProvince
      }

      const { error } = await supabase
        .from('listings')
        .insert(insertData)

      if (error) {
        console.error('Error creating draft:', error)
        return NextResponse.json({ error: 'Failed to create draft' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving draft:', error)
    return NextResponse.json(
      { error: 'Failed to save draft' },
      { status: 500 }
    )
  }
}
