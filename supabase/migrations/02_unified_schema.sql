-- ==============================================================================
-- BloodLink Unified Database Schema (2 Account Types: Normal User & Admin)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
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

-- 2. TABLES

-- 2.1 Unified Profiles Table (One record per registered user)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  profile_image TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
  country TEXT DEFAULT 'India',
  state TEXT DEFAULT 'Delhi',
  city TEXT NOT NULL DEFAULT 'New Delhi',
  locality TEXT,
  pincode TEXT,
  latitude NUMERIC(10, 6) DEFAULT 28.6139,
  longitude NUMERIC(10, 6) DEFAULT 77.2090,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.2 Optional Donor Profiles Table (Associated with a normal user)
CREATE TABLE IF NOT EXISTS public.donor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  blood_group blood_group_enum NOT NULL,
  rh_factor TEXT DEFAULT '+',
  availability BOOLEAN NOT NULL DEFAULT true,
  last_donation_date DATE,
  verification_status verification_status_enum NOT NULL DEFAULT 'pending',
  eligibility_status TEXT NOT NULL DEFAULT 'eligible', -- 'eligible', 'cooldown', 'deferred'
  next_eligible_date DATE,
  preferred_radius_km NUMERIC NOT NULL DEFAULT 25.0,
  total_donations INTEGER NOT NULL DEFAULT 0,
  lives_impacted INTEGER NOT NULL DEFAULT 0,
  badges TEXT[] DEFAULT ARRAY['New Lifesaver']::TEXT[],
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.3 Secret Admin Users Table (Protected: populated only through backend admin key validation)
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  granted_by TEXT NOT NULL DEFAULT 'secret_key'
);

-- 2.4 Blood Requests Table (Created by any authenticated normal user)
CREATE TABLE IF NOT EXISTS public.blood_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_identifier TEXT NOT NULL,
  blood_group blood_group_enum NOT NULL,
  component_type blood_component_enum NOT NULL DEFAULT 'Whole Blood',
  units_required INTEGER NOT NULL DEFAULT 1 CHECK (units_required > 0),
  units_fulfilled INTEGER NOT NULL DEFAULT 0 CHECK (units_fulfilled >= 0),
  hospital_name TEXT NOT NULL,
  hospital_address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'New Delhi',
  pincode TEXT,
  latitude NUMERIC(10, 6) DEFAULT 28.6139,
  longitude NUMERIC(10, 6) DEFAULT 77.2090,
  urgency_level urgency_level_enum NOT NULL DEFAULT 'Critical (Golden Hour)',
  required_by TEXT NOT NULL DEFAULT 'Immediate',
  status request_status_enum NOT NULL DEFAULT 'Pending',
  notes TEXT,
  contact_number TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.5 Donor Responses Table
CREATE TABLE IF NOT EXISTS public.donor_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES public.blood_requests(id) ON DELETE CASCADE,
  donor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  response_status TEXT NOT NULL CHECK (response_status IN ('Accepted', 'Declined', 'Completed', 'Cancelled')),
  notes TEXT,
  responded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(request_id, donor_id)
);

-- 2.6 Donations Table
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  request_id UUID REFERENCES public.blood_requests(id) ON DELETE SET NULL,
  donation_center TEXT NOT NULL,
  donation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  units_donated INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'Completed' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled')),
  verified_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.7 Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'emergency',
  is_read BOOLEAN NOT NULL DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.8 Blood Banks Table
CREATE TABLE IF NOT EXISTS public.blood_banks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  pincode TEXT,
  contact_information TEXT NOT NULL,
  latitude NUMERIC(10, 6),
  longitude NUMERIC(10, 6),
  verification_status verification_status_enum NOT NULL DEFAULT 'verified',
  operating_hours TEXT DEFAULT '24x7',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.9 Blood Inventory Table
CREATE TABLE IF NOT EXISTS public.blood_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blood_bank_id UUID NOT NULL REFERENCES public.blood_banks(id) ON DELETE CASCADE,
  blood_group blood_group_enum NOT NULL,
  component_type blood_component_enum NOT NULL DEFAULT 'Whole Blood',
  available_units INTEGER NOT NULL DEFAULT 0 CHECK (available_units >= 0),
  expiry_information TEXT,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(blood_bank_id, blood_group, component_type)
);

-- 2.10 Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. FUNCTIONS & PROCEDURES

-- Helper to check if a user has admin privileges
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  IF p_user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = p_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Secure Admin Key Verification Function
-- Protected on backend. If the supplied key matches the backend secret, grants admin privilege to auth.uid()
CREATE OR REPLACE FUNCTION public.verify_admin_key(p_key TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_expected_key TEXT;
  v_current_user UUID;
BEGIN
  v_current_user := auth.uid();
  IF v_current_user IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Default secure admin key for backend verification (overridable via server setting)
  v_expected_key := COALESCE(
    current_setting('app.settings.admin_secret_key', true),
    'BLOODLINK_SECURE_ADMIN_2026_ROOT'
  );

  IF p_key IS NULL OR p_key != v_expected_key THEN
    RETURN FALSE;
  END IF;

  -- Insert into protected admin_users table
  INSERT INTO public.admin_users (user_id, granted_at, granted_by)
  VALUES (v_current_user, NOW(), 'secret_key_rpc')
  ON CONFLICT (user_id) DO NOTHING;

  -- Log action
  INSERT INTO public.audit_logs (actor_id, action, resource_type, resource_id)
  VALUES (v_current_user, 'ADMIN_ACCESS_ACTIVATED', 'admin_users', v_current_user::text);

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- User Registration Trigger (Creates standard profiles record for EVERY user)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    phone,
    city,
    state,
    country
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'city', 'New Delhi'),
    COALESCE(NEW.raw_user_meta_data->>'state', 'Delhi'),
    COALESCE(NEW.raw_user_meta_data->>'country', 'India')
  );

  -- If user opted in as a donor during registration, create donor profile
  IF (NEW.raw_user_meta_data->>'is_donor')::boolean = true OR NEW.raw_user_meta_data->>'blood_group' IS NOT NULL THEN
    INSERT INTO public.donor_profiles (
      user_id,
      blood_group,
      availability,
      verification_status
    ) VALUES (
      NEW.id,
      COALESCE((NEW.raw_user_meta_data->>'blood_group')::blood_group_enum, 'O+'),
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

-- 4. ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can view basic info of users; users can update their own
CREATE POLICY "Profiles viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Donor Profiles: Viewable by all; manageable only by owner or admin
CREATE POLICY "Donor profiles viewable by everyone"
  ON public.donor_profiles FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can create own donor profile"
  ON public.donor_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own donor profile"
  ON public.donor_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

-- Admin Users: Read-only check for own status or admin
CREATE POLICY "Admin status viewable by self or admin"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

-- Blood Requests: Viewable by all authenticated users
CREATE POLICY "Requests viewable by authenticated users"
  ON public.blood_requests FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can insert own requests"
  ON public.blood_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update own requests or Admins can update"
  ON public.blood_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = requester_id OR public.is_admin());

-- Donor Responses:
CREATE POLICY "Responses viewable by requester, donor, or admin"
  ON public.donor_responses FOR SELECT
  TO authenticated
  USING (
    donor_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.blood_requests br WHERE br.id = request_id AND br.requester_id = auth.uid()) OR
    public.is_admin()
  );

CREATE POLICY "Donors can respond to requests"
  ON public.donor_responses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = donor_id);

CREATE POLICY "Donors can update own response"
  ON public.donor_responses FOR UPDATE
  TO authenticated
  USING (auth.uid() = donor_id OR public.is_admin());

-- Donations:
CREATE POLICY "Donations viewable by donor or admin"
  ON public.donations FOR SELECT
  TO authenticated
  USING (donor_id = auth.uid() OR public.is_admin());

-- Notifications:
CREATE POLICY "Notifications viewable only by owner"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Blood Banks & Inventory:
CREATE POLICY "Blood banks viewable by all"
  ON public.blood_banks FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Only admins can manage blood banks"
  ON public.blood_banks FOR ALL
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Inventory viewable by all"
  ON public.blood_inventory FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Only admins can manage inventory"
  ON public.blood_inventory FOR ALL
  TO authenticated
  USING (public.is_admin());

-- Audit Logs:
CREATE POLICY "Only admins can view audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "System can insert audit logs"
  ON public.audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 5. REALTIME REPLICATION
ALTER PUBLICATION supabase_realtime ADD TABLE public.blood_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.donor_responses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.donor_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
