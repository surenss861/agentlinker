export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      agents: {
        Row: {
          id: string
          user_id: string
          slug: string
          full_name: string
          email: string
          phone: string | null
          photo_url: string | null
          bio: string | null
          brokerage: string | null
          license_number: string | null
          social_links: Json | null
          template: 'luxury' | 'modern' | 'minimalist'
          subscription_tier: 'free' | 'pro' | 'business'
          custom_domain: string | null
          verified_badge: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          slug: string
          full_name: string
          email: string
          phone?: string | null
          photo_url?: string | null
          bio?: string | null
          brokerage?: string | null
          license_number?: string | null
          social_links?: Json | null
          template?: 'luxury' | 'modern' | 'minimalist'
          subscription_tier?: 'free' | 'pro' | 'business'
          custom_domain?: string | null
          verified_badge?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          slug?: string
          full_name?: string
          email?: string
          phone?: string | null
          photo_url?: string | null
          bio?: string | null
          brokerage?: string | null
          license_number?: string | null
          social_links?: Json | null
          template?: 'luxury' | 'modern' | 'minimalist'
          subscription_tier?: 'free' | 'pro' | 'business'
          custom_domain?: string | null
          verified_badge?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      listings: {
        Row: {
          id: string
          agent_id: string
          title: string
          description: string | null
          address: string
          city: string
          state: string
          zip_code: string
          price: number
          bedrooms: number | null
          bathrooms: number | null
          square_feet: number | null
          property_type: string
          status: 'active' | 'pending' | 'sold'
          image_urls: string[]
          mls_number: string | null
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          title: string
          description?: string | null
          address: string
          city: string
          state: string
          zip_code: string
          price: number
          bedrooms?: number | null
          bathrooms?: number | null
          square_feet?: number | null
          property_type: string
          status?: 'active' | 'pending' | 'sold'
          image_urls?: string[]
          mls_number?: string | null
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          title?: string
          description?: string | null
          address?: string
          city?: string
          state?: string
          zip_code?: string
          price?: number
          bedrooms?: number | null
          bathrooms?: number | null
          square_feet?: number | null
          property_type?: string
          status?: 'active' | 'pending' | 'sold'
          image_urls?: string[]
          mls_number?: string | null
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          agent_id: string
          full_name: string
          email: string
          phone: string | null
          message: string | null
          source: string
          listing_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          full_name: string
          email: string
          phone?: string | null
          message?: string | null
          source: string
          listing_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          full_name?: string
          email?: string
          phone?: string | null
          message?: string | null
          source?: string
          listing_id?: string | null
          created_at?: string
        }
      }
      analytics: {
        Row: {
          id: string
          agent_id: string
          event_type: 'page_view' | 'link_click' | 'lead_form' | 'listing_view' | 'booking_click'
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          event_type: 'page_view' | 'link_click' | 'lead_form' | 'listing_view' | 'booking_click'
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          event_type?: 'page_view' | 'link_click' | 'lead_form' | 'listing_view' | 'booking_click'
          metadata?: Json | null
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          agent_id: string
          client_name: string
          client_email: string
          client_phone: string | null
          booking_type: 'showing' | 'consultation' | 'call'
          scheduled_at: string
          listing_id: string | null
          status: 'scheduled' | 'completed' | 'cancelled'
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          client_name: string
          client_email: string
          client_phone?: string | null
          booking_type: 'showing' | 'consultation' | 'call'
          scheduled_at: string
          listing_id?: string | null
          status?: 'scheduled' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          client_name?: string
          client_email?: string
          client_phone?: string | null
          booking_type?: 'showing' | 'consultation' | 'call'
          scheduled_at?: string
          listing_id?: string | null
          status?: 'scheduled' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

