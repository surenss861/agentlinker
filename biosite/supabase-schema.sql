-- BioPage Database Schema
-- This file contains the SQL schema for the Supabase database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create agents table
CREATE TABLE agents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  photo_url TEXT,
  bio TEXT,
  brokerage TEXT,
  license_number TEXT,
  social_links JSONB DEFAULT '{}',
  template TEXT DEFAULT 'modern' CHECK (template IN ('luxury', 'modern', 'minimalist')),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'business')),
  custom_domain TEXT UNIQUE,
  verified_badge BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create listings table
CREATE TABLE listings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  bedrooms INTEGER,
  bathrooms DECIMAL(3, 1),
  square_feet INTEGER,
  property_type TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'sold')),
  image_urls TEXT[] DEFAULT '{}',
  mls_number TEXT,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leads table
CREATE TABLE leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  source TEXT NOT NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics table
CREATE TABLE analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'link_click', 'lead_form', 'listing_view', 'booking_click')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  booking_type TEXT NOT NULL CHECK (booking_type IN ('showing', 'consultation', 'call')),
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_agents_user_id ON agents(user_id);
CREATE INDEX idx_agents_slug ON agents(slug);
CREATE INDEX idx_listings_agent_id ON listings(agent_id);
CREATE INDEX idx_listings_featured ON listings(featured);
CREATE INDEX idx_leads_agent_id ON leads(agent_id);
CREATE INDEX idx_analytics_agent_id ON analytics(agent_id);
CREATE INDEX idx_analytics_created_at ON analytics(created_at);
CREATE INDEX idx_bookings_agent_id ON bookings(agent_id);
CREATE INDEX idx_bookings_scheduled_at ON bookings(scheduled_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to tables
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Agents policies
CREATE POLICY "Agents are viewable by everyone" ON agents FOR SELECT USING (true);
CREATE POLICY "Users can insert their own agent profile" ON agents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own agent profile" ON agents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own agent profile" ON agents FOR DELETE USING (auth.uid() = user_id);

-- Listings policies
CREATE POLICY "Listings are viewable by everyone" ON listings FOR SELECT USING (true);
CREATE POLICY "Agents can insert their own listings" ON listings FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM agents WHERE agents.id = agent_id AND agents.user_id = auth.uid())
);
CREATE POLICY "Agents can update their own listings" ON listings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM agents WHERE agents.id = agent_id AND agents.user_id = auth.uid())
);
CREATE POLICY "Agents can delete their own listings" ON listings FOR DELETE USING (
  EXISTS (SELECT 1 FROM agents WHERE agents.id = agent_id AND agents.user_id = auth.uid())
);

-- Leads policies
CREATE POLICY "Leads are viewable by their agent" ON leads FOR SELECT USING (
  EXISTS (SELECT 1 FROM agents WHERE agents.id = agent_id AND agents.user_id = auth.uid())
);
CREATE POLICY "Anyone can insert leads" ON leads FOR INSERT WITH CHECK (true);

-- Analytics policies
CREATE POLICY "Analytics are viewable by their agent" ON analytics FOR SELECT USING (
  EXISTS (SELECT 1 FROM agents WHERE agents.id = agent_id AND agents.user_id = auth.uid())
);
CREATE POLICY "Anyone can insert analytics" ON analytics FOR INSERT WITH CHECK (true);

-- Bookings policies
CREATE POLICY "Bookings are viewable by their agent" ON bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM agents WHERE agents.id = agent_id AND agents.user_id = auth.uid())
);
CREATE POLICY "Anyone can insert bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Agents can update their bookings" ON bookings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM agents WHERE agents.id = agent_id AND agents.user_id = auth.uid())
);

