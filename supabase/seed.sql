-- ==============================================================================
-- BloodLink Database Seed Data
-- ==============================================================================

-- 1. Insert Initial Blood Banks
INSERT INTO public.blood_banks (id, name, address, city, contact_information, latitude, longitude, verification_status, operating_hours)
VALUES
  ('bb000000-0000-0000-0000-000000000001', 'Red Cross Society National Blood Center', '1 Red Cross Road, Sansad Marg Area', 'New Delhi', '+91 11 2371 6441', 28.6219, 77.2085, 'verified', '24x7'),
  ('bb000000-0000-0000-0000-000000000002', 'AIIMS Apex Regional Blood Bank', 'Sri Aurobindo Marg, Ansari Nagar East', 'New Delhi', '+91 11 2658 8500', 28.5672, 77.2100, 'verified', '24x7'),
  ('bb000000-0000-0000-0000-000000000003', 'Safdarjung Hospital Regional Blood Center', 'Ring Road, Opposite AIIMS', 'New Delhi', '+91 11 2616 5060', 28.5700, 77.2050, 'verified', '24x7'),
  ('bb000000-0000-0000-0000-000000000004', 'Fortis Escorts Heart Institute Blood Bank', 'Okhla Road, Sukhdev Vihar', 'New Delhi', '+91 11 4713 5000', 28.5604, 77.2798, 'verified', '24x7'),
  ('bb000000-0000-0000-0000-000000000005', 'Max Super Speciality Hospital Blood Bank', '1, 2 Press Enclave Road, Saket', 'New Delhi', '+91 11 2651 5050', 28.5273, 77.2144, 'verified', '24x7')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Blood Bank Inventory
INSERT INTO public.blood_inventory (blood_bank_id, blood_group, component_type, available_units, reserved_units, expiry_information)
VALUES
  ('bb000000-0000-0000-0000-000000000001', 'O+', 'Whole Blood', 42, 4, 'Tested & Valid for 35 days'),
  ('bb000000-0000-0000-0000-000000000001', 'O-', 'Whole Blood', 14, 2, 'Tested & Valid for 35 days (Universal)'),
  ('bb000000-0000-0000-0000-000000000001', 'A+', 'Whole Blood', 38, 5, 'Tested & Valid for 35 days'),
  ('bb000000-0000-0000-0000-000000000001', 'A-', 'Whole Blood', 9, 1, 'Tested & Valid for 35 days'),
  ('bb000000-0000-0000-0000-000000000001', 'B+', 'Whole Blood', 45, 6, 'Tested & Valid for 35 days'),
  ('bb000000-0000-0000-0000-000000000001', 'B-', 'Whole Blood', 11, 2, 'Tested & Valid for 35 days'),
  ('bb000000-0000-0000-0000-000000000001', 'AB+', 'Whole Blood', 22, 3, 'Tested & Valid for 35 days'),
  ('bb000000-0000-0000-0000-000000000001', 'AB-', 'Whole Blood', 6, 1, 'Tested & Valid for 35 days'),
  ('bb000000-0000-0000-0000-000000000001', 'O+', 'Platelets', 18, 2, 'Single Donor Platelets (Valid 5 days)'),
  ('bb000000-0000-0000-0000-000000000001', 'A+', 'Platelets', 12, 1, 'Single Donor Platelets (Valid 5 days)'),
  ('bb000000-0000-0000-0000-000000000002', 'O+', 'Whole Blood', 55, 8, 'Tested & Valid for 35 days'),
  ('bb000000-0000-0000-0000-000000000002', 'O-', 'Whole Blood', 16, 4, 'Tested & Valid for 35 days'),
  ('bb000000-0000-0000-0000-000000000002', 'B+', 'Whole Blood', 62, 5, 'Tested & Valid for 35 days'),
  ('bb000000-0000-0000-0000-000000000002', 'AB+', 'Plasma', 30, 2, 'Fresh Frozen Plasma (-18°C)')
ON CONFLICT (blood_bank_id, blood_group, component_type) DO NOTHING;

-- 3. Mock/Seed Accounts for Development (Profiles & Donor Profiles)
-- Note: When users sign up via Supabase Auth, auth.users IDs will be generated.
-- The seed data below provides mock references for immediate UI display or seed migrations.
