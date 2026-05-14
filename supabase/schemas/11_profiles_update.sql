-- =====================================================
-- Updated Profiles Table Schema
-- TechSprint Health Monitoring App
-- =====================================================

-- Drop existing table if needed (careful with production data!)
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create enum types if not exists
DO $$ BEGIN
    CREATE TYPE public.gender_type AS ENUM ('male', 'female', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.role_type AS ENUM ('dokter', 'pasien', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT,
    birth_date DATE,
    gender public.gender_type DEFAULT 'other',
    blood_type TEXT CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    age BIGINT,
    role public.role_type DEFAULT 'pasien',

    -- Doctor-specific fields
    specialty TEXT,                    -- Specialty (e.g., "Sp. Gizi Klinik")
    hospital TEXT,                     -- Hospital affiliation
    license_number TEXT,               -- STR/SIP number
    experience_years INTEGER,          -- Years of experience
    is_available BOOLEAN DEFAULT true, -- Online status for doctors

    -- Profile fields
    avatar_url TEXT,
    phone TEXT,
    address TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_available ON public.profiles(is_available) WHERE is_available = true;

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "profiles_select_own" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "profiles_insert_own" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Doctors can be read by everyone (for consultation list)
CREATE POLICY "profiles_select_dokters" ON public.profiles
    FOR SELECT USING (role = 'dokter' AND is_available = true);

-- =====================================================
-- Auto-update updated_at trigger
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- Sample Data (Optional - for testing)
-- =====================================================

-- Insert sample doctor (replace with actual user_id from auth.users)
-- First, create a user in Supabase Auth, then get the user_id

-- INSERT INTO public.profiles (user_id, email, first_name, last_name, full_name, role, specialty, hospital, is_available)
-- VALUES (
--     'your-user-uuid-here',
--     'dr.reza@ragahariann.com',
--     'Reza',
--     'Pratama',
--     'Dr. Reza Pratama',
--     'dokter',
--     'Sp. Gizi Klinik',
--     'RSU Bunda',
--     true
-- );

-- =====================================================
-- Grant permissions
-- =====================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.profiles TO service_role;

-- =====================================================
-- Notes for migration
-- =====================================================

-- To add new columns to existing table:
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS specialty TEXT;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hospital TEXT;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- To create enum type first:
-- CREATE TYPE public.gender_type AS ENUM ('male', 'female', 'other');
-- CREATE TYPE public.role_type AS ENUM ('dokter', 'pasien', 'admin');