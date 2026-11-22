-- ==============================================================================
-- BloodLink Database Schema & Security Policies (Supabase / PostgreSQL)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & DOMAINS
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('donor', 'requester', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE blood_group_enum AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE blood_component_enum AS ENUM ('Whole Blood', 'Red Blood Cells', 'Platelets', 'Plasma', 'Cryoprecipitate');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE urgency_level_enum AS ENUM ('Critical (Golden Hour)', 'Within 6 Hours', 'Within 24 Hours', 'Normal');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE request_status_enum AS ENUM (
    'Pending',
    'Matching',
    'Donors Notified',
    'Donor Responded',
    'Hospital Confirmation Pending',
    'Fulfilled',
    'Cancelled',
    'Expired'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE verification_status_enum AS ENUM ('pending', 'verified', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. TABLES

-- 3.1 Profiles Table (linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'donor',
  profile_image TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.2 Donor Profiles Table
CREATE TABLE IF NOT EXISTS public.donor_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  blood_group blood_group_enum NOT NULL,
  city TEXT NOT NULL DEFAULT 'New Delhi',
  latitude NUMERIC(10, 6) DEFAULT 28.6139,
  longitude NUMERIC(10, 6) DEFAULT 77.2090,
  availability BOOLEAN NOT NULL DEFAULT true,
  verification_status verification_status_enum NOT NULL DEFAULT 'pending',
  last_donation_date DATE,
  eligibility_status TEXT NOT NULL DEFAULT 'eligible', -- 'eligible', 'cooldown', 'deferred'
  next_eligible_date DATE,
  total_donations INTEGER NOT NULL DEFAULT 0,
  lives_impacted INTEGER NOT NULL DEFAULT 0,
  badges TEXT[] DEFAULT ARRAY['New Lifesaver']::TEXT[],
  bio TEXT,
  preferred_radius_km NUMERIC NOT NULL DEFAULT 25.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.3 Blood Requests Table
CREATE TABLE IF NOT EXISTS public.blood_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  blood_group blood_group_enum NOT NULL,
  component_type blood_component_enum NOT NULL DEFAULT 'Whole Blood',
  units_required INTEGER NOT NULL DEFAULT 1 CHECK (units_required > 0),
  units_fulfilled INTEGER NOT NULL DEFAULT 0 CHECK (units_fulfilled >= 0),
  hospital_name TEXT NOT NULL,
  hospital_location TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'New Delhi',
  room_number TEXT,
  contact_number TEXT NOT NULL,
  latitude NUMERIC(10, 6) DEFAULT 28.6139,
  longitude NUMERIC(10, 6) DEFAULT 77.2090,
  urgency_level urgency_level_enum NOT NULL DEFAULT 'Critical (Golden Hour)',
  additional_information TEXT,
  request_status request_status_enum NOT NULL DEFAULT 'Pending',
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '48 hours'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.4 Donor Responses Table
CREATE TABLE IF NOT EXISTS public.donor_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES public.blood_requests(id) ON DELETE CASCADE,
  donor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  response_status TEXT NOT NULL CHECK (response_status IN ('Accepted', 'Declined', 'Completed', 'Cancelled')),
  notes TEXT,
  responded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(request_id, donor_id)
);

-- 3.5 Donations Table
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  request_id UUID REFERENCES public.blood_requests(id) ON DELETE SET NULL,
  donation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  donation_center TEXT NOT NULL,
  units_donated INTEGER NOT NULL DEFAULT 1,
  component_type blood_component_enum NOT NULL DEFAULT 'Whole Blood',
  donation_status TEXT NOT NULL DEFAULT 'Completed' CHECK (donation_status IN ('Scheduled', 'Completed', 'Cancelled')),
  certificate_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.6 Blood Banks Table
CREATE TABLE IF NOT EXISTS public.blood_banks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  contact_information TEXT NOT NULL,
  latitude NUMERIC(10, 6),
  longitude NUMERIC(10, 6),
  verification_status verification_status_enum NOT NULL DEFAULT 'verified',
  operating_hours TEXT DEFAULT '24x7',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.7 Blood Inventory Table
CREATE TABLE IF NOT EXISTS public.blood_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blood_bank_id UUID NOT NULL REFERENCES public.blood_banks(id) ON DELETE CASCADE,
  blood_group blood_group_enum NOT NULL,
  component_type blood_component_enum NOT NULL DEFAULT 'Whole Blood',
  available_units INTEGER NOT NULL DEFAULT 0 CHECK (available_units >= 0),
  reserved_units INTEGER NOT NULL DEFAULT 0 CHECK (reserved_units >= 0),
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expiry_information TEXT,
  UNIQUE(blood_bank_id, blood_group, component_type)
);

-- 3.8 Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT NOT NULL DEFAULT 'emergency', -- 'emergency', 'match', 'status', 'system', 'reminder'
  is_read BOOLEAN NOT NULL DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.9 Verification Documents Table
CREATE TABLE IF NOT EXISTS public.verification_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL DEFAULT 'Govt ID', -- 'Govt ID', 'Blood Report', 'Hospital Card'
  document_path TEXT NOT NULL,
  verification_status verification_status_enum NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.10 Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. INDEXES
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_donor_profiles_blood_city ON public.donor_profiles(blood_group, city);
CREATE INDEX IF NOT EXISTS idx_donor_profiles_availability ON public.donor_profiles(availability, verification_status);
CREATE INDEX IF NOT EXISTS idx_blood_requests_status ON public.blood_requests(request_status, urgency_level);
CREATE INDEX IF NOT EXISTS idx_blood_requests_blood ON public.blood_requests(blood_group);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_inventory_lookup ON public.blood_inventory(blood_bank_id, blood_group);

-- 5. HAVERSINE DISTANCE FUNCTION (PostgreSQL)
CREATE OR REPLACE FUNCTION public.calculate_haversine_distance(
  lat1 NUMERIC,
  lon1 NUMERIC,
  lat2 NUMERIC,
  lon2 NUMERIC
) RETURNS NUMERIC AS $$
DECLARE
  R CONSTANT NUMERIC := 6371; -- Earth radius in KM
  dLat NUMERIC;
  dLon NUMERIC;
  a NUMERIC;
  c NUMERIC;
BEGIN
  IF lat1 IS NULL OR lon1 IS NULL OR lat2 IS NULL OR lon2 IS NULL THEN
    RETURN 99999;
  END IF;

  dLat := RADIANS(lat2 - lat1);
  dLon := RADIANS(lon2 - lon1);
  
  a := SIN(dLat / 2) * SIN(dLat / 2) +
       COS(RADIANS(lat1)) * COS(RADIANS(lat2)) *
       SIN(dLon / 2) * SIN(dLon / 2);
  
  c := 2 * ATAN2(SQRT(a), SQRT(1 - a));
  
  RETURN ROUND(R * c, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 6. MATCHING ENGINE FUNCTION (PostgreSQL)
CREATE OR REPLACE FUNCTION public.find_compatible_donors(
  p_blood_group blood_group_enum,
  p_component_type blood_component_enum,
  p_req_lat NUMERIC,
  p_req_lon NUMERIC,
  p_max_distance_km NUMERIC DEFAULT 50.0
) RETURNS TABLE (
  donor_id UUID,
  full_name TEXT,
  blood_group blood_group_enum,
  city TEXT,
  distance_km NUMERIC,
  verification_status verification_status_enum,
  last_donation_date DATE,
  total_donations INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id AS donor_id,
    p.full_name,
    dp.blood_group,
    dp.city,
    public.calculate_haversine_distance(p_req_lat, p_req_lon, dp.latitude, dp.longitude) AS distance_km,
    dp.verification_status,
    dp.last_donation_date,
    dp.total_donations
  FROM public.donor_profiles dp
  JOIN public.profiles p ON p.id = dp.user_id
  WHERE dp.availability = true
    AND dp.verification_status = 'verified'
    AND dp.eligibility_status = 'eligible'
    -- Clinical Red Blood Cell / Whole Blood Compatibility rules
    AND (
      (p_blood_group = 'A+' AND dp.blood_group IN ('A+', 'A-', 'O+', 'O-')) OR
      (p_blood_group = 'A-' AND dp.blood_group IN ('A-', 'O-')) OR
      (p_blood_group = 'B+' AND dp.blood_group IN ('B+', 'B-', 'O+', 'O-')) OR
      (p_blood_group = 'B-' AND dp.blood_group IN ('B-', 'O-')) OR
      (p_blood_group = 'AB+' AND dp.blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')) OR
      (p_blood_group = 'AB-' AND dp.blood_group IN ('AB-', 'A-', 'B-', 'O-')) OR
      (p_blood_group = 'O+' AND dp.blood_group IN ('O+', 'O-')) OR
      (p_blood_group = 'O-' AND dp.blood_group = 'O-')
    )
    AND public.calculate_haversine_distance(p_req_lat, p_req_lon, dp.latitude, dp.longitude) <= p_max_distance_km
  ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- 7. AUTOMATIC USER PROFILE TRIGGER (Supabase Auth Hook)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role user_role;
  v_blood blood_group_enum;
  v_city TEXT;
BEGIN
  v_role := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'donor');
  
  INSERT INTO public.profiles (id, full_name, email, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'New User'),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    v_role
  );

  IF v_role = 'donor' THEN
    BEGIN
      v_blood := (NEW.raw_user_meta_data->>'blood_group')::blood_group_enum;
    EXCEPTION WHEN OTHERS THEN
      v_blood := 'O+';
    END;
    v_city := COALESCE(NEW.raw_user_meta_data->>'city', 'New Delhi');

    INSERT INTO public.donor_profiles (
      user_id,
      blood_group,
      city,
      availability,
      verification_status
    ) VALUES (
      NEW.id,
      v_blood,
      v_city,
      true,
      'pending'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Donor Profiles Policies
CREATE POLICY "Donors viewable by all authenticated users"
  ON public.donor_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Donors can update own donor profile"
  ON public.donor_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Donors can insert own donor profile"
  ON public.donor_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Blood Requests Policies
CREATE POLICY "Blood requests are viewable by all authenticated users"
  ON public.blood_requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Requesters can create blood requests"
  ON public.blood_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Requesters can update own requests or Admins can update"
  ON public.blood_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = requester_id OR public.is_admin());

-- Donor Responses Policies
CREATE POLICY "Responses viewable by requester, responder, or admin"
  ON public.donor_responses FOR SELECT
  TO authenticated
  USING (
    donor_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.blood_requests br WHERE br.id = request_id AND br.requester_id = auth.uid()) OR
    public.is_admin()
  );

CREATE POLICY "Donors can submit response"
  ON public.donor_responses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = donor_id);

CREATE POLICY "Donors can update own response"
  ON public.donor_responses FOR UPDATE
  TO authenticated
  USING (auth.uid() = donor_id OR public.is_admin());

-- Donations Policies
CREATE POLICY "Donations viewable by donor or admin"
  ON public.donations FOR SELECT
  TO authenticated
  USING (donor_id = auth.uid() OR public.is_admin());

CREATE POLICY "Admins or donors can insert donations"
  ON public.donations FOR INSERT
  TO authenticated
  WITH CHECK (donor_id = auth.uid() OR public.is_admin());

-- Blood Banks Policies
CREATE POLICY "Blood banks viewable by everyone"
  ON public.blood_banks FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Only admins can manage blood banks"
  ON public.blood_banks FOR ALL
  TO authenticated
  USING (public.is_admin());

-- Blood Inventory Policies
CREATE POLICY "Blood inventory viewable by everyone"
  ON public.blood_inventory FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Only admins can manage inventory"
  ON public.blood_inventory FOR ALL
  TO authenticated
  USING (public.is_admin());

-- Notifications Policies
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System/Authenticated can insert notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Verification Documents Policies
CREATE POLICY "Users can view own verification docs, admins view all"
  ON public.verification_documents FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can upload own verification documents"
  ON public.verification_documents FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update verification status"
  ON public.verification_documents FOR UPDATE
  TO authenticated
  USING (public.is_admin());

-- Audit Logs Policies
CREATE POLICY "Only admins can view audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Authenticated users can insert audit logs"
  ON public.audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 9. SUPABASE REALTIME REPLICATION SETUP
ALTER PUBLICATION supabase_realtime ADD TABLE public.blood_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.donor_responses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.donor_profiles;
