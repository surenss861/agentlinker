import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const price = parseFloat(formData.get('price') as string)
    const address = formData.get('address') as string
    const city = formData.get('city') as string
    const province = formData.get('province') as string || formData.get('state') as string
    const description = formData.get('description') as string
    const status = formData.get('status') as string
    const contact_pref = formData.get('contact_pref') as string
    const imagesString = formData.get('images') as string || '[]'
    
    console.log('Creating listing with data:', {
      user_id: user.id,
      title,
      price,
      address,
      city,
      province,
      status,
      images: imagesString,
      description,
      contact_pref
    })
    
    // Validate required fields
    console.log('Validation check:', {
      hasTitle: !!title,
      hasPrice: !isNaN(price) && price > 0,
      hasAddress: !!address,
      hasCity: !!city,
      hasProvince: !!province
    })
    
    let images = []
    try {
      images = JSON.parse(imagesString)
    } catch (e) {
      console.error('Error parsing images:', e)
      images = []
    }

    if (!title || !price || !address || !city || !province) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Insert listing - handle both state and province columns
    const insertData: any = {
      user_id: user.id,
      title,
      price,
      address,
      city,
      description,
      images,
      status: status || 'active',
      // Provide defaults for all commonly required columns
      zip_code: 'N/A',
      contact_pref: contact_pref || 'email',
      property_type: 'Residential',  // Default property type
      listing_type: 'For Sale',  // Default listing type
      bedrooms: null,  // Optional
      bathrooms: null,  // Optional
      square_feet: null,  // Optional
      lot_size: null,  // Optional
      year_built: null,  // Optional
      mls_number: null,  // Optional
    }
    
    // Add both state and province to handle different database schemas
    if (province) {
      insertData.province = province
      insertData.state = province  // Some databases use 'state' instead of 'province'
    }

    const { data: listing, error } = await supabase
      .from('listings')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Supabase error creating listing:', error)
      return NextResponse.json(
        { error: 'Database error: ' + error.message },
        { status: 500 }
      )
    }

    // Track analytics event
    await supabase
      .from('analytics')
      .insert({
        user_id: user.id,
        event_type: 'listing_created',
        source: 'dashboard',
        value: 1
      })

    return NextResponse.json({ success: true, listing })
  } catch (error) {
    console.error('Error creating listing:', error)
    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = supabase
      .from('listings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data: listings, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({ listings })
  } catch (error) {
    console.error('Error fetching listings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    )
  }
}
