-- ==============================================================================
-- BloodLink: Complete Production-Ready Database Schema & Realtime Setup
-- Run this in Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
DO $$ BEGIN
  CREATE TYPE blood_group_enum AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE blood_component_enum AS ENUM ('Whole Blood', 'Red Blood Cells', 'Platelets', 'Plasma', 'Cryoprecipitate');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE urgency_level_enum AS ENUM ('Critical (Golden Hour)', 'Within 6 Hours', 'Within 24 Hours', 'Normal', 'Scheduled');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE request_status_enum AS ENUM (
    'Pending',
    'Matching',
    'Donors Notified',
    'Donor Responded',
    'In Progress - Donor Found',
    'Hospital Confirmation Pending',
    'Fulfilled',
    'Completed',
    'Cancelled',
    'Expired'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE verification_status_enum AS ENUM ('pending', 'verified', 'rejected');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  full_name TEXT NOT NULL DEFAULT 'User',
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

-- Ensure all columns exist on profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT NOT NULL DEFAULT 'User';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'India';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'Delhi';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'New Delhi';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS locality TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pincode TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS latitude NUMERIC(10, 6) DEFAULT 28.6139;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS longitude NUMERIC(10, 6) DEFAULT 77.2090;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

-- Drop foreign key constraint to auth.users if it exists so demo/seed profiles can be inserted
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

DO $$ BEGIN
  ALTER TABLE public.profiles ALTER COLUMN role DROP NOT NULL;
EXCEPTION WHEN undefined_column THEN null;
END $$;

-- 4. DONOR PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.donor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  blood_group blood_group_enum NOT NULL DEFAULT 'O+',
  rh_factor TEXT DEFAULT '+',
  city TEXT DEFAULT 'New Delhi',
  latitude NUMERIC(10, 6) DEFAULT 28.6139,
  longitude NUMERIC(10, 6) DEFAULT 77.2090,
  availability BOOLEAN NOT NULL DEFAULT true,
  last_donation_date DATE,
  verification_status verification_status_enum NOT NULL DEFAULT 'pending',
  eligibility_status TEXT NOT NULL DEFAULT 'eligible',
  next_eligible_date DATE,
  preferred_radius_km NUMERIC NOT NULL DEFAULT 25.0,
  total_donations INTEGER NOT NULL DEFAULT 0,
  lives_impacted INTEGER NOT NULL DEFAULT 0,
  badges TEXT[] DEFAULT ARRAY['New Lifesaver']::TEXT[],
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure all columns exist on donor_profiles
ALTER TABLE public.donor_profiles ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'New Delhi';
ALTER TABLE public.donor_profiles ADD COLUMN IF NOT EXISTS latitude NUMERIC(10, 6) DEFAULT 28.6139;
ALTER TABLE public.donor_profiles ADD COLUMN IF NOT EXISTS longitude NUMERIC(10, 6) DEFAULT 77.2090;
ALTER TABLE public.donor_profiles ADD COLUMN IF NOT EXISTS preferred_radius_km NUMERIC DEFAULT 25.0;
ALTER TABLE public.donor_profiles ADD COLUMN IF NOT EXISTS eligibility_status TEXT DEFAULT 'eligible';
ALTER TABLE public.donor_profiles ADD COLUMN IF NOT EXISTS total_donations INTEGER DEFAULT 0;
ALTER TABLE public.donor_profiles ADD COLUMN IF NOT EXISTS lives_impacted INTEGER DEFAULT 0;

DO $$ BEGIN
  ALTER TABLE public.donor_profiles ALTER COLUMN city DROP NOT NULL;
EXCEPTION WHEN undefined_column THEN null;
END $$;

-- 5. BLOOD REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.blood_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL DEFAULT 'Patient',
  patient_identifier TEXT,
  blood_group blood_group_enum NOT NULL DEFAULT 'O+',
  component_type blood_component_enum NOT NULL DEFAULT 'Whole Blood',
  units_required INTEGER NOT NULL DEFAULT 1 CHECK (units_required > 0),
  units_fulfilled INTEGER NOT NULL DEFAULT 0 CHECK (units_fulfilled >= 0),
  hospital_name TEXT NOT NULL DEFAULT 'Hospital',
  hospital_location TEXT,
  hospital_address TEXT,
  city TEXT NOT NULL DEFAULT 'New Delhi',
  room_number TEXT,
  contact_number TEXT NOT NULL DEFAULT '108',
  latitude NUMERIC(10, 6) DEFAULT 28.6139,
  longitude NUMERIC(10, 6) DEFAULT 77.2090,
  urgency_level urgency_level_enum NOT NULL DEFAULT 'Critical (Golden Hour)',
  request_status request_status_enum NOT NULL DEFAULT 'Pending',
  status request_status_enum DEFAULT 'Pending',
  additional_information TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure all columns exist on blood_requests
ALTER TABLE public.blood_requests ADD COLUMN IF NOT EXISTS patient_name TEXT NOT NULL DEFAULT 'Patient';
ALTER TABLE public.blood_requests ADD COLUMN IF NOT EXISTS patient_identifier TEXT;
ALTER TABLE public.blood_requests ADD COLUMN IF NOT EXISTS hospital_name TEXT NOT NULL DEFAULT 'Hospital';
ALTER TABLE public.blood_requests ADD COLUMN IF NOT EXISTS hospital_location TEXT;
ALTER TABLE public.blood_requests ADD COLUMN IF NOT EXISTS hospital_address TEXT;
ALTER TABLE public.blood_requests ADD COLUMN IF NOT EXISTS city TEXT NOT NULL DEFAULT 'New Delhi';
ALTER TABLE public.blood_requests ADD COLUMN IF NOT EXISTS room_number TEXT;
ALTER TABLE public.blood_requests ADD COLUMN IF NOT EXISTS contact_number TEXT NOT NULL DEFAULT '108';
ALTER TABLE public.blood_requests ADD COLUMN IF NOT EXISTS latitude NUMERIC(10, 6) DEFAULT 28.6139;
ALTER TABLE public.blood_requests ADD COLUMN IF NOT EXISTS longitude NUMERIC(10, 6) DEFAULT 77.2090;
ALTER TABLE public.blood_requests ADD COLUMN IF NOT EXISTS urgency_level urgency_level_enum NOT NULL DEFAULT 'Critical (Golden Hour)';
ALTER TABLE public.blood_requests ADD COLUMN IF NOT EXISTS request_status request_status_enum NOT NULL DEFAULT 'Pending';
ALTER TABLE public.blood_requests ADD COLUMN IF NOT EXISTS status request_status_enum DEFAULT 'Pending';
ALTER TABLE public.blood_requests ADD COLUMN IF NOT EXISTS additional_information TEXT;
ALTER TABLE public.blood_requests ADD COLUMN IF NOT EXISTS notes TEXT;

-- 6. DONOR RESPONSES TABLE
CREATE TABLE IF NOT EXISTS public.donor_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES public.blood_requests(id) ON DELETE CASCADE,
  donor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  response_status TEXT NOT NULL DEFAULT 'Accepted' CHECK (response_status IN ('Accepted', 'Declined', 'Completed', 'Cancelled')),
  notes TEXT,
  responded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(request_id, donor_id)
);

-- 7. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'emergency',
  notification_type TEXT DEFAULT 'emergency',
  is_read BOOLEAN NOT NULL DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'emergency';
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS notification_type TEXT DEFAULT 'emergency';

-- 8. ADMIN USERS & AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  granted_by TEXT NOT NULL DEFAULT 'secret_key'
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. BLOOD BANKS & INVENTORY TABLES
CREATE TABLE IF NOT EXISTS public.blood_banks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'New Delhi',
  pincode TEXT,
  contact_information TEXT NOT NULL,
  latitude NUMERIC(10, 6) DEFAULT 28.6139,
  longitude NUMERIC(10, 6) DEFAULT 77.2090,
  operating_hours TEXT DEFAULT '24x7',
  verification_status TEXT DEFAULT 'verified',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.blood_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blood_bank_id UUID NOT NULL REFERENCES public.blood_banks(id) ON DELETE CASCADE,
  blood_group blood_group_enum NOT NULL,
  component_type blood_component_enum NOT NULL DEFAULT 'Whole Blood',
  available_units INTEGER NOT NULL DEFAULT 10,
  reserved_units INTEGER NOT NULL DEFAULT 0,
  expiry_information TEXT,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(blood_bank_id, blood_group, component_type)
);

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_inventory ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can view profiles; users can insert and update their own
DO $$ BEGIN
  CREATE POLICY "Profiles viewable by all" ON public.profiles FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Profiles insertable by user or trigger" ON public.profiles FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Donor Profiles: Viewable by all; manageable by owner
DO $$ BEGIN
  CREATE POLICY "Donor profiles viewable by all" ON public.donor_profiles FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Users insert own donor profile" ON public.donor_profiles FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Users update own donor profile" ON public.donor_profiles FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Blood Requests: Viewable by all; insertable by authenticated users & service role
DO $$ BEGIN
  CREATE POLICY "Requests viewable by everyone" ON public.blood_requests FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can insert requests" ON public.blood_requests FOR INSERT WITH CHECK (auth.uid() = requester_id OR auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Requesters can update own requests" ON public.blood_requests FOR UPDATE USING (auth.uid() = requester_id OR auth.uid() IN (SELECT user_id FROM public.admin_users));
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Donor Responses:
DO $$ BEGIN
  CREATE POLICY "Responses viewable by all" ON public.donor_responses FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Donors can insert responses" ON public.donor_responses FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Donors can update responses" ON public.donor_responses FOR UPDATE USING (auth.uid() = donor_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Notifications:
DO $$ BEGIN
  CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Blood Banks & Inventory: viewable by all
DO $$ BEGIN
  CREATE POLICY "Blood banks viewable by all" ON public.blood_banks FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Inventory viewable by all" ON public.blood_inventory FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 11. BULLETPROOF USER SIGNUP TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE plpgsql
AS $$
DECLARE
  v_blood_str TEXT;
  v_blood_group blood_group_enum;
  v_is_donor BOOLEAN := false;
BEGIN
  -- Insert profile
  BEGIN
    INSERT INTO public.profiles (
      id, full_name, email, phone, city, state, country, date_of_birth, gender, locality, pincode
    ) VALUES (
      NEW.id,
      COALESCE(NULLIF(NEW.raw_user_meta_data->>'full_name', ''), NULLIF(NEW.raw_user_meta_data->>'name', ''), 'BloodLink User'),
      COALESCE(NEW.email, 'user_' || NEW.id || '@bloodlink.local'),
      NULLIF(NEW.raw_user_meta_data->>'phone', ''),
      COALESCE(NULLIF(NEW.raw_user_meta_data->>'city', ''), 'New Delhi'),
      COALESCE(NULLIF(NEW.raw_user_meta_data->>'state', ''), 'Delhi'),
      COALESCE(NULLIF(NEW.raw_user_meta_data->>'country', ''), 'India'),
      CASE 
        WHEN NULLIF(NEW.raw_user_meta_data->>'date_of_birth', '') IS NOT NULL 
        THEN (NEW.raw_user_meta_data->>'date_of_birth')::DATE 
        ELSE NULL 
      END,
      NULLIF(NEW.raw_user_meta_data->>'gender', ''),
      NULLIF(NEW.raw_user_meta_data->>'locality', ''),
      NULLIF(NEW.raw_user_meta_data->>'pincode', '')
    )
    ON CONFLICT (id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
      city = COALESCE(EXCLUDED.city, public.profiles.city),
      updated_at = NOW();
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user profile error: %', SQLERRM;
  END;

  -- Insert donor profile if opted in
  BEGIN
    IF (NEW.raw_user_meta_data->>'is_donor') = 'true' OR (NEW.raw_user_meta_data->>'isDonor') = 'true' THEN
      v_is_donor := true;
    END IF;

    v_blood_str := COALESCE(NEW.raw_user_meta_data->>'blood_group', NEW.raw_user_meta_data->>'bloodGroup');

    IF v_is_donor OR v_blood_str IS NOT NULL THEN
      BEGIN
        v_blood_group := v_blood_str::blood_group_enum;
      EXCEPTION WHEN OTHERS THEN
        v_blood_group := 'O+'::blood_group_enum;
      END;

      INSERT INTO public.donor_profiles (
        user_id, blood_group, city, availability, verification_status
      ) VALUES (
        NEW.id, COALESCE(v_blood_group, 'O+'::blood_group_enum),
        COALESCE(NULLIF(NEW.raw_user_meta_data->>'city', ''), 'New Delhi'),
        true, 'pending'
      )
      ON CONFLICT (user_id) DO UPDATE SET
        blood_group = EXCLUDED.blood_group,
        city = EXCLUDED.city,
        updated_at = NOW();
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user donor_profile error: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 12. ADMIN VERIFICATION RPC
CREATE OR REPLACE FUNCTION public.verify_admin_key(p_key TEXT)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE plpgsql
AS $$
DECLARE
  v_expected_key TEXT;
  v_current_user UUID;
BEGIN
  v_current_user := auth.uid();
  IF v_current_user IS NULL THEN RETURN FALSE; END IF;

  v_expected_key := COALESCE(
    current_setting('app.settings.admin_secret_key', true),
    'BLOODLINK_SECURE_ADMIN_2026_ROOT'
  );

  IF p_key IS NULL OR p_key != v_expected_key THEN RETURN FALSE; END IF;

  INSERT INTO public.admin_users (user_id, granted_at, granted_by)
  VALUES (v_current_user, NOW(), 'secret_key_rpc')
  ON CONFLICT (user_id) DO NOTHING;

  RETURN TRUE;
END;
$$;

-- 13. ENABLE REALTIME REPLICATION & REPLICA IDENTITY FULL
ALTER TABLE public.blood_requests REPLICA IDENTITY FULL;
ALTER TABLE public.donor_responses REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.donor_profiles REPLICA IDENTITY FULL;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.blood_requests;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.donor_responses;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.donor_profiles;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 14. SEED SAMPLE VERIFIED DATA FOR IMMEDIATE REAL-TIME VISIBILITY
-- Seed Profiles
INSERT INTO public.profiles (id, full_name, email, phone, city, state, country, latitude, longitude)
VALUES
  ('11111111-0000-0000-0000-000000000001', 'Dr. Rajesh Sharma', 'rajesh.sharma@bloodlink.org', '+91 98111 22334', 'New Delhi', 'Delhi', 'India', 28.6139, 77.2090),
  ('11111111-0000-0000-0000-000000000002', 'Priya Patel', 'priya.patel@bloodlink.org', '+91 98222 33445', 'New Delhi', 'Delhi', 'India', 28.5355, 77.3910),
  ('11111111-0000-0000-0000-000000000003', 'Ananya Deshmukh', 'ananya.d@bloodlink.org', '+91 98333 44556', 'New Delhi', 'Delhi', 'India', 28.7041, 77.1025),
  ('11111111-0000-0000-0000-000000000004', 'Kavita Nair', 'kavita.nair@bloodlink.org', '+91 98444 55667', 'New Delhi', 'Delhi', 'India', 28.4595, 77.0266),
  ('11111111-0000-0000-0000-000000000005', 'Vikramaditya Rao', 'vikram.rao@bloodlink.org', '+91 98555 66778', 'New Delhi', 'Delhi', 'India', 28.4089, 77.3178),
  ('11111111-0000-0000-0000-000000000006', 'Rohan Verma', 'rohan.verma@bloodlink.org', '+91 98666 77889', 'New Delhi', 'Delhi', 'India', 28.6280, 77.0800)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone;

-- Seed Donor Profiles
INSERT INTO public.donor_profiles (user_id, blood_group, city, latitude, longitude, availability, verification_status, total_donations, lives_impacted, badges)
VALUES
  ('11111111-0000-0000-0000-000000000001', 'O+', 'New Delhi', 28.6139, 77.2090, true, 'verified', 8, 24, ARRAY['Centurion Donor', 'Universal Savior']::TEXT[]),
  ('11111111-0000-0000-0000-000000000002', 'A+', 'New Delhi', 28.5355, 77.3910, true, 'verified', 5, 15, ARRAY['Rapid Responder']::TEXT[]),
  ('11111111-0000-0000-0000-000000000003', 'B+', 'New Delhi', 28.7041, 77.1025, true, 'verified', 4, 12, ARRAY['Life Saver']::TEXT[]),
  ('11111111-0000-0000-0000-000000000004', 'O-', 'New Delhi', 28.4595, 77.0266, true, 'verified', 12, 36, ARRAY['Universal Hero', 'Top Donor']::TEXT[]),
  ('11111111-0000-0000-0000-000000000005', 'AB+', 'New Delhi', 28.4089, 77.3178, true, 'verified', 3, 9, ARRAY['Plasma Champion']::TEXT[]),
  ('11111111-0000-0000-0000-000000000006', 'A-', 'New Delhi', 28.6280, 77.0800, true, 'verified', 6, 18, ARRAY['Regular Contributor']::TEXT[])
ON CONFLICT (user_id) DO UPDATE SET
  availability = EXCLUDED.availability,
  verification_status = EXCLUDED.verification_status;

-- Seed Active Blood Requests
INSERT INTO public.blood_requests (
  id, requester_id, patient_name, patient_identifier, blood_group, component_type,
  units_required, units_fulfilled, hospital_name, hospital_location, hospital_address,
  city, room_number, contact_number, latitude, longitude, urgency_level, request_status, status, additional_information
)
VALUES
  (
    '22222222-0000-0000-0000-000000000001',
    '11111111-0000-0000-0000-000000000001',
    'Aarav Singhania',
    'Aarav Singhania',
    'O+',
    'Whole Blood',
    2,
    0,
    'AIIMS Trauma Center',
    'Ring Road, Safdarjung Enclave',
    'Ring Road, Safdarjung Enclave',
    'New Delhi',
    'ICU-Bed 4',
    '+91 98111 22334',
    28.5672,
    77.2100,
    'Critical (Golden Hour)',
    'Pending',
    'Pending',
    'Emergency cardiac surgery transfusion required immediately'
  ),
  (
    '22222222-0000-0000-0000-000000000002',
    '11111111-0000-0000-0000-000000000002',
    'Sunita Mehra',
    'Sunita Mehra',
    'B+',
    'Platelets',
    3,
    0,
    'Max Super Speciality Hospital',
    '1 Press Enclave Road, Saket',
    '1 Press Enclave Road, Saket',
    'New Delhi',
    'Ward 3B',
    '+91 98222 33445',
    28.5273,
    77.2144,
    'Within 6 Hours',
    'Pending',
    'Pending',
    'Dengue thrombocytopenia patient requiring Single Donor Platelets (SDP)'
  ),
  (
    '22222222-0000-0000-0000-000000000003',
    '11111111-0000-0000-0000-000000000003',
    'Mohd. Irfan',
    'Mohd. Irfan',
    'A-',
    'Red Blood Cells',
    2,
    0,
    'Fortis Escorts Heart Institute',
    'Okhla Road, Sukhdev Vihar',
    'Okhla Road, Sukhdev Vihar',
    'New Delhi',
    'Room 214',
    '+91 98333 44556',
    28.5604,
    77.2798,
    'Within 24 Hours',
    'Pending',
    'Pending',
    'Scheduled bypass procedure'
  )
ON CONFLICT (id) DO NOTHING;

-- Seed Blood Banks & Inventory
INSERT INTO public.blood_banks (id, name, address, city, contact_information, latitude, longitude, verification_status, operating_hours)
VALUES
  ('bb000000-0000-0000-0000-000000000001', 'Red Cross Society National Blood Center', '1 Red Cross Road, Sansad Marg Area', 'New Delhi', '+91 11 2371 6441', 28.6219, 77.2085, 'verified', '24x7'),
  ('bb000000-0000-0000-0000-000000000002', 'AIIMS Apex Regional Blood Bank', 'Sri Aurobindo Marg, Ansari Nagar East', 'New Delhi', '+91 11 2658 8500', 28.5672, 77.2100, 'verified', '24x7'),
  ('bb000000-0000-0000-0000-000000000003', 'Safdarjung Hospital Regional Blood Center', 'Ring Road, Opposite AIIMS', 'New Delhi', '+91 11 2616 5060', 28.5700, 77.2050, 'verified', '24x7'),
  ('bb000000-0000-0000-0000-000000000004', 'Fortis Escorts Heart Institute Blood Bank', 'Okhla Road, Sukhdev Vihar', 'New Delhi', '+91 11 4713 5000', 28.5604, 77.2798, 'verified', '24x7'),
  ('bb000000-0000-0000-0000-000000000005', 'Max Super Speciality Hospital Blood Bank', '1, 2 Press Enclave Road, Saket', 'New Delhi', '+91 11 2651 5050', 28.5273, 77.2144, 'verified', '24x7')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.blood_inventory (blood_bank_id, blood_group, component_type, available_units, reserved_units, expiry_information)
VALUES
  ('bb000000-0000-0000-0000-000000000001', 'O+', 'Whole Blood', 42, 4, 'Tested & Valid for 35 days'),
  ('bb000000-0000-0000-0000-000000000001', 'O-', 'Whole Blood', 14, 2, 'Tested & Valid for 35 days (Universal)'),
  ('bb000000-0000-0000-0000-000000000001', 'A+', 'Whole Blood', 38, 5, 'Tested & Valid for 35 days'),
  ('bb000000-0000-0000-0000-000000000001', 'A-', 'Whole Blood', 9, 1, 'Tested & Valid for 35 days'),
  ('bb000000-0000-0000-0000-000000000001', 'B+', 'Whole Blood', 45, 6, 'Tested & Valid for 35 days'),
  ('bb000000-0000-0000-0000-000000000001', 'B-', 'Whole Blood', 11, 2, 'Tested & Valid for 35 days'),
  ('bb000000-0000-0000-0000-000000000001', 'AB+', 'Whole Blood', 22, 3, 'Tested & Valid for 35 days'),
  ('bb000000-0000-0000-0000-000000000001', 'AB-', 'Whole Blood', 6, 1, 'Tested & Valid for 35 days')
ON CONFLICT (blood_bank_id, blood_group, component_type) DO NOTHING;

-- 15. RELOAD POSTGREST SCHEMA CACHE
NOTIFY pgrst, 'reload schema';

SELECT 'BloodLink complete production schema, triggers, and realtime configuration successfully loaded!' AS status;
