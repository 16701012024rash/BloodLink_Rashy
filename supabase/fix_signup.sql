-- 1. Ensure extensions and enums exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
  CREATE TYPE blood_group_enum AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE verification_status_enum AS ENUM ('pending', 'verified', 'rejected');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 2. Ensure public.profiles has all unified columns
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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

DO $$ BEGIN
  ALTER TABLE public.profiles ALTER COLUMN role DROP NOT NULL;
EXCEPTION WHEN undefined_column THEN null;
END $$;

-- 3. Ensure public.donor_profiles exists with relaxed constraints
CREATE TABLE IF NOT EXISTS public.donor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  blood_group blood_group_enum NOT NULL DEFAULT 'O+',
  rh_factor TEXT DEFAULT '+',
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

DO $$ BEGIN
  ALTER TABLE public.donor_profiles ALTER COLUMN city DROP NOT NULL;
EXCEPTION WHEN undefined_column THEN null;
END $$;

-- 4. Ensure admin_users & audit_logs exist
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

-- 5. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Profiles viewable by authenticated users"
    ON public.profiles FOR SELECT TO authenticated, anon USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Donor profiles viewable by everyone"
    ON public.donor_profiles FOR SELECT TO authenticated, anon USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert own donor profile"
    ON public.donor_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own donor profile"
    ON public.donor_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 6. Bulletproof handle_new_user() trigger function
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
    RAISE WARNING 'handle_new_user profiles insert warning: %', SQLERRM;
  END;

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
        user_id, blood_group, availability, verification_status
      ) VALUES (
        NEW.id, COALESCE(v_blood_group, 'O+'::blood_group_enum), true, 'pending'
      )
      ON CONFLICT (user_id) DO UPDATE SET
        blood_group = EXCLUDED.blood_group,
        updated_at = NOW();
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user donor_profiles insert warning: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$;

-- 7. Rebind Trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Admin Verification RPC
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
  IF v_current_user IS NULL THEN
    RETURN FALSE;
  END IF;

  v_expected_key := COALESCE(
    current_setting('app.settings.admin_secret_key', true),
    'BLOODLINK_SECURE_ADMIN_2026_ROOT'
  );

  IF p_key IS NULL OR p_key != v_expected_key THEN
    RETURN FALSE;
  END IF;

  INSERT INTO public.admin_users (user_id, granted_at, granted_by)
  VALUES (v_current_user, NOW(), 'secret_key_rpc')
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.audit_logs (actor_id, action, resource_type, resource_id)
  VALUES (v_current_user, 'ADMIN_ACCESS_ACTIVATED', 'admin_users', v_current_user::text);

  RETURN TRUE;
END;
$$;