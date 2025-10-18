import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
    try {
        const { email, type, redirectTo } = await request.json()

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        const supabase = await createServerSupabaseClient()

        let result

        if (type === 'confirmation') {
            // Send email confirmation
            result = await supabase.auth.resend({
                type: 'signup',
                email,
                options: {
                    emailRedirectTo: redirectTo || `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`
                }
            })
        } else if (type === 'reset') {
            // Send password reset
            result = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: redirectTo || `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`
            })
        } else {
            return NextResponse.json({ error: 'Invalid email type' }, { status: 400 })
        }

        if (result.error) {
            console.error('Email sending error:', result.error)
            return NextResponse.json({
                error: result.error.message,
                success: false
            }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            message: 'Email sent successfully'
        })

    } catch (error: any) {
        console.error('Email API error:', error)
        return NextResponse.json({
            error: 'Failed to send email',
            success: false
        }, { status: 500 })
    }
}
