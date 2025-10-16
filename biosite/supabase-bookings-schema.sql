-- =====================================================
-- AgentLinker Bookings System Schema
-- Purpose: Full appointment scheduler + tracking hub
-- =====================================================

-- Drop existing bookings table if it exists (clean slate)
drop table if exists booking_events cascade;
drop table if exists bookings cascade;
drop table if exists availability cascade;

-- 1. BOOKINGS TABLE
-- Stores every showing appointment
create table bookings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  lead_id uuid,
  listing_id uuid,
  
  -- Appointment details
  scheduled_at timestamptz not null,
  duration int default 30, -- minutes
  status text default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  
  -- Client info (denormalized for quick access)
  client_name text not null,
  client_email text not null,
  client_phone text,
  
  -- Location & notes
  location text,
  notes text,
  
  -- Metadata
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add foreign key constraints (only if tables exist)
-- Note: These will fail silently if leads/listings tables don't exist yet

-- Try to add leads foreign key
do $$ 
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'leads') then
    alter table bookings add constraint bookings_lead_id_fkey 
      foreign key (lead_id) references leads(id) on delete set null;
    raise notice '✅ Added foreign key constraint to leads table';
  else
    raise notice '⚠️  Leads table not found - you can add the foreign key later with:';
    raise notice '   ALTER TABLE bookings ADD CONSTRAINT bookings_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL;';
  end if;
exception
  when others then
    raise notice '⚠️  Could not add leads foreign key (table may not exist yet)';
end $$;

-- Try to add listings foreign key
do $$ 
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'listings') then
    alter table bookings add constraint bookings_listing_id_fkey 
      foreign key (listing_id) references listings(id) on delete set null;
    raise notice '✅ Added foreign key constraint to listings table';
  else
    raise notice '⚠️  Listings table not found - you can add the foreign key later with:';
    raise notice '   ALTER TABLE bookings ADD CONSTRAINT bookings_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE SET NULL;';
  end if;
exception
  when others then
    raise notice '⚠️  Could not add listings foreign key (table may not exist yet)';
end $$;

-- Indexes for performance
create index bookings_user_id_idx on bookings(user_id);
create index bookings_scheduled_at_idx on bookings(scheduled_at);
create index bookings_status_idx on bookings(status);
create index bookings_lead_id_idx on bookings(lead_id);
create index bookings_listing_id_idx on bookings(listing_id);

-- 2. AVAILABILITY TABLE
-- Defines agent's available time slots
create table availability (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  weekday int not null check (weekday >= 0 and weekday <= 6), -- 0 = Sunday, 6 = Saturday
  start_time time not null,
  end_time time not null,
  created_at timestamptz default now()
);

-- Indexes
create index availability_user_id_idx on availability(user_id);
create index availability_weekday_idx on availability(weekday);

-- 3. BOOKING EVENTS TABLE
-- Logs all updates to bookings (timeline)
create table booking_events (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid references bookings(id) on delete cascade not null,
  action text not null, -- created, confirmed, completed, cancelled, rescheduled
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Index
create index booking_events_booking_id_idx on booking_events(booking_id);

-- 4. ROW LEVEL SECURITY POLICIES

-- Enable RLS
alter table bookings enable row level security;
alter table availability enable row level security;
alter table booking_events enable row level security;

-- Bookings policies
create policy "Users can view their own bookings"
  on bookings for select
  using (auth.uid() = user_id);

create policy "Users can insert their own bookings"
  on bookings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own bookings"
  on bookings for update
  using (auth.uid() = user_id);

create policy "Users can delete their own bookings"
  on bookings for delete
  using (auth.uid() = user_id);

-- Public can insert bookings (for public booking form)
create policy "Public can insert bookings"
  on bookings for insert
  to anon
  with check (true);

-- Availability policies
create policy "Users can manage their own availability"
  on availability for all
  using (auth.uid() = user_id);

create policy "Public can view availability"
  on availability for select
  to anon
  using (true);

-- Booking events policies
create policy "Users can view events for their bookings"
  on booking_events for select
  using (
    exists (
      select 1 from bookings
      where bookings.id = booking_events.booking_id
      and bookings.user_id = auth.uid()
    )
  );

create policy "Users can insert events for their bookings"
  on booking_events for insert
  with check (
    exists (
      select 1 from bookings
      where bookings.id = booking_events.booking_id
      and bookings.user_id = auth.uid()
    )
  );

-- 5. TRIGGERS

-- Update updated_at timestamp on bookings
create or replace function update_bookings_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger bookings_updated_at
  before update on bookings
  for each row
  execute function update_bookings_updated_at();

-- Auto-create booking event on status change
create or replace function log_booking_status_change()
returns trigger as $$
begin
  if old.status is distinct from new.status then
    insert into booking_events (booking_id, action, metadata)
    values (
      new.id,
      new.status,
      jsonb_build_object(
        'old_status', old.status,
        'new_status', new.status,
        'changed_at', now()
      )
    );
  end if;
  return new;
end;
$$ language plpgsql;

create trigger booking_status_change
  after update on bookings
  for each row
  execute function log_booking_status_change();

-- Auto-create initial booking event on insert
create or replace function log_booking_creation()
returns trigger as $$
begin
  insert into booking_events (booking_id, action, metadata)
  values (
    new.id,
    'created',
      jsonb_build_object(
        'status', new.status,
        'scheduled_at', new.scheduled_at,
        'created_at', now()
      )
  );
  return new;
end;
$$ language plpgsql;

create trigger booking_creation
  after insert on bookings
  for each row
  execute function log_booking_creation();

-- 6. DEFAULT AVAILABILITY (Optional)
-- Insert default 9-5 Monday-Friday availability for existing users
-- You can run this manually or skip it

-- insert into availability (user_id, weekday, start_time, end_time)
-- select 
--   id as user_id,
--   unnest(array[1,2,3,4,5]) as weekday,
--   '09:00'::time as start_time,
--   '17:00'::time as end_time
-- from auth.users
-- where not exists (
--   select 1 from availability where availability.user_id = auth.users.id
-- );

-- =====================================================
-- DONE! Now you have:
-- ✅ bookings table with full appointment data
-- ✅ availability table for time slots
-- ✅ booking_events for timeline tracking
-- ✅ RLS policies for security
-- ✅ Triggers for auto-logging events
-- ✅ Conditional foreign keys (only if leads/listings exist)
-- =====================================================

-- Success message
do $$
begin
  raise notice '✅ Bookings system installed successfully!';
  raise notice 'Tables created: bookings, availability, booking_events';
  raise notice 'Navigate to /dashboard/bookings to see your new appointment scheduler!';
end $$;
