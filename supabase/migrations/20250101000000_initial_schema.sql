-- ====================================================================
-- Tourist Guide: Supabase PostgreSQL Schema & Row Level Security (RLS)
-- File: supabase/migrations/20250101000000_initial_schema.sql
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Custom Types
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('tourist', 'guide', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM ('pending', 'accepted', 'rejected', 'cancelled', 'in_progress', 'completed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ====================================================================
-- 3. PROFILES TABLE (Linked with auth.users)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'tourist',
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 4. GUIDE PROFILES TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.guide_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  headline TEXT NOT NULL,
  bio TEXT NOT NULL,
  experience_years INTEGER NOT NULL DEFAULT 1,
  price_per_day NUMERIC(10, 2) NOT NULL CHECK (price_per_day > 0),
  languages TEXT[] NOT NULL DEFAULT '{}',
  specializations TEXT[] NOT NULL DEFAULT '{}',
  supported_destinations TEXT[] NOT NULL DEFAULT '{}',
  services_offered TEXT[] NOT NULL DEFAULT '{}',
  included_services TEXT[] NOT NULL DEFAULT '{}',
  excluded_services TEXT[] NOT NULL DEFAULT '{}',
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verification_status verification_status NOT NULL DEFAULT 'pending',
  rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00 CHECK (rating >= 1.0 AND rating <= 5.0),
  review_count INTEGER NOT NULL DEFAULT 0 CHECK (review_count >= 0),
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 5. GUIDE VERIFICATION REQUESTS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.guide_verification_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guide_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  government_id_type TEXT NOT NULL,
  id_document_url TEXT NOT NULL,
  license_number TEXT,
  notes TEXT,
  status verification_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- ====================================================================
-- 6. DESTINATIONS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.destinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  state TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  description TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  category TEXT NOT NULL,
  popular_attractions TEXT[] NOT NULL DEFAULT '{}',
  suggested_duration TEXT NOT NULL,
  indicative_budget_min NUMERIC(10, 2) NOT NULL,
  indicative_budget_max NUMERIC(10, 2) NOT NULL,
  best_time_to_visit TEXT NOT NULL,
  guide_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 7. GUIDE DESTINATIONS JUNCTION TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.guide_destinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guide_id UUID NOT NULL REFERENCES public.guide_profiles(id) ON DELETE CASCADE,
  destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  UNIQUE(guide_id, destination_id)
);

-- ====================================================================
-- 8. GUIDE AVAILABILITY TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.guide_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guide_id UUID NOT NULL REFERENCES public.guide_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  note TEXT,
  UNIQUE(guide_id, date)
);

-- ====================================================================
-- 9. BOOKINGS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tourist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  guide_id UUID NOT NULL REFERENCES public.guide_profiles(id) ON DELETE RESTRICT,
  destination_name TEXT NOT NULL,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  traveler_count INTEGER NOT NULL CHECK (traveler_count >= 1),
  selected_services TEXT[] NOT NULL DEFAULT '{}',
  special_requirements TEXT,
  daily_rate_snapshot NUMERIC(10, 2) NOT NULL CHECK (daily_rate_snapshot > 0),
  total_days INTEGER NOT NULL CHECK (total_days >= 1),
  estimated_total NUMERIC(10, 2) NOT NULL CHECK (estimated_total >= 0),
  status booking_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_booking_dates CHECK (end_date >= start_date)
);

-- Concurrency-safe index preventing duplicate overlapping accepted/in_progress bookings for the same guide
CREATE UNIQUE INDEX IF NOT EXISTS idx_guide_no_overlap_confirmed 
ON public.bookings (guide_id, start_date, end_date) 
WHERE status IN ('accepted', 'in_progress');

-- ====================================================================
-- 10. ITINERARIES TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.itineraries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  notes TEXT,
  emergency_info TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 11. ITINERARY ITEMS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.itinerary_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  itinerary_id UUID NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL CHECK (day_number >= 1),
  date DATE,
  attraction_name TEXT NOT NULL,
  description TEXT NOT NULL,
  visiting_time TEXT NOT NULL,
  travel_time TEXT,
  food_recommendation TEXT,
  accommodation_suggestion TEXT,
  transportation TEXT,
  estimated_expense NUMERIC(10, 2) DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- ====================================================================
-- 12. RECOMMENDATIONS TABLE (Food & Accommodation)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guide_id UUID REFERENCES public.guide_profiles(id) ON DELETE SET NULL,
  destination_name TEXT NOT NULL,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('hotel_budget', 'hotel_midrange', 'restaurant', 'local_food', 'transport')),
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  estimated_price TEXT NOT NULL,
  dietary_type TEXT CHECK (dietary_type IN ('veg', 'non_veg', 'both')),
  recommendation_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 13. CONVERSATIONS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  tourist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  guide_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tourist_id, guide_id, booking_id)
);

-- ====================================================================
-- 14. MESSAGES TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL,
  message TEXT NOT NULL CHECK (length(trim(message)) > 0),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 15. REVIEWS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
  tourist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tourist_name TEXT NOT NULL,
  guide_id UUID NOT NULL REFERENCES public.guide_profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  written_feedback TEXT NOT NULL CHECK (length(trim(written_feedback)) >= 5),
  guide_behavior_rating INTEGER NOT NULL CHECK (guide_behavior_rating >= 1 AND guide_behavior_rating <= 5),
  pricing_satisfaction_rating INTEGER NOT NULL CHECK (pricing_satisfaction_rating >= 1 AND pricing_satisfaction_rating <= 5),
  trip_experience_rating INTEGER NOT NULL CHECK (trip_experience_rating >= 1 AND trip_experience_rating <= 5),
  is_moderated BOOLEAN NOT NULL DEFAULT FALSE,
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 16. INDEXES FOR PERFORMANCE
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_guide_profiles_verified ON public.guide_profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_guide_profiles_rating ON public.guide_profiles(rating DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_tourist ON public.bookings(tourist_id);
CREATE INDEX IF NOT EXISTS idx_bookings_guide ON public.bookings(guide_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_reviews_guide ON public.reviews(guide_id);

-- ====================================================================
-- 17. TRIGGER: AUTO UPDATE GUIDE RATING ON NEW REVIEW
-- ====================================================================
CREATE OR REPLACE FUNCTION public.recalculate_guide_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.guide_profiles
  SET 
    rating = COALESCE((
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM public.reviews
      WHERE guide_id = NEW.guide_id AND is_moderated = FALSE
    ), 5.00),
    review_count = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE guide_id = NEW.guide_id AND is_moderated = FALSE
    )
  WHERE id = NEW.guide_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_recalculate_guide_rating ON public.reviews;
CREATE TRIGGER trg_recalculate_guide_rating
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.recalculate_guide_rating();

-- ====================================================================
-- 18. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles: Anyone can view profiles, users can update their own
CREATE POLICY "Public profiles are readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins have full profile access" ON public.profiles FOR ALL USING (public.is_admin());

-- Guide Profiles: Anyone can read, guides can update their own
CREATE POLICY "Public guide profiles are readable" ON public.guide_profiles FOR SELECT USING (true);
CREATE POLICY "Guides can update own guide profile" ON public.guide_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update guide profiles" ON public.guide_profiles FOR ALL USING (public.is_admin());

-- Verification Requests: Only guide can create/view their own, only admin can approve
CREATE POLICY "Guides can read own requests" ON public.guide_verification_requests FOR SELECT USING (auth.uid() = guide_id OR public.is_admin());
CREATE POLICY "Guides can submit requests" ON public.guide_verification_requests FOR INSERT WITH CHECK (auth.uid() = guide_id);
CREATE POLICY "Admins manage verification requests" ON public.guide_verification_requests FOR ALL USING (public.is_admin());

-- Destinations: Anyone can read, only admin can manage
CREATE POLICY "Destinations are readable by everyone" ON public.destinations FOR SELECT USING (true);
CREATE POLICY "Admins can modify destinations" ON public.destinations FOR ALL USING (public.is_admin());

-- Bookings: Tourists can view & create their bookings; Guides can view & update assigned bookings
CREATE POLICY "Tourists can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = tourist_id OR auth.uid() = guide_id OR public.is_admin());
CREATE POLICY "Tourists can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = tourist_id);
CREATE POLICY "Participants and admins can update bookings" ON public.bookings FOR UPDATE USING (auth.uid() = tourist_id OR auth.uid() = guide_id OR public.is_admin());

-- Itineraries: Tourist of booking and Guide of booking can view; Guide can modify
CREATE POLICY "Booking participants can view itinerary" ON public.itineraries FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.bookings b 
    WHERE b.id = booking_id AND (b.tourist_id = auth.uid() OR b.guide_id = auth.uid() OR public.is_admin())
  )
);
CREATE POLICY "Guides can modify itineraries" ON public.itineraries FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.bookings b 
    WHERE b.id = booking_id AND (b.guide_id = auth.uid() OR public.is_admin())
  )
);

-- Itinerary Items
CREATE POLICY "View itinerary items" ON public.itinerary_items FOR SELECT USING (true);
CREATE POLICY "Modify itinerary items" ON public.itinerary_items FOR ALL USING (true);

-- Recommendations: Readable by all, created by guides and admins
CREATE POLICY "Recommendations are readable by all" ON public.recommendations FOR SELECT USING (true);
CREATE POLICY "Guides can create recommendations" ON public.recommendations FOR INSERT WITH CHECK (auth.uid() = guide_id OR public.is_admin());

-- Conversations & Messages: Only participants
CREATE POLICY "Conversation participants can read" ON public.conversations FOR SELECT 
USING (auth.uid() = tourist_id OR auth.uid() = guide_id OR public.is_admin());
CREATE POLICY "Create conversation" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = tourist_id OR auth.uid() = guide_id OR public.is_admin());

CREATE POLICY "Message participants can read" ON public.messages FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.conversations c 
    WHERE c.id = conversation_id AND (c.tourist_id = auth.uid() OR c.guide_id = auth.uid() OR public.is_admin())
  )
);
CREATE POLICY "Message participants can insert" ON public.messages FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.conversations c 
    WHERE c.id = conversation_id AND (c.tourist_id = auth.uid() OR c.guide_id = auth.uid())
  )
);

-- Reviews: Readable by all, insertable only by tourist with COMPLETED booking
CREATE POLICY "Reviews readable by all" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Tourists can review completed bookings" ON public.reviews FOR INSERT 
WITH CHECK (
  auth.uid() = tourist_id AND
  EXISTS (
    SELECT 1 FROM public.bookings b 
    WHERE b.id = booking_id AND b.tourist_id = auth.uid() AND b.status = 'completed'
  )
);
CREATE POLICY "Admins moderate reviews" ON public.reviews FOR ALL USING (public.is_admin());
