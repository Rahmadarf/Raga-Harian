-- ============================================
-- SCHEMA: Goals & Achievements Tables
-- ============================================
-- Tabel untuk fitur Goal Setting & Badges:
-- 1. goals - Target kesehatan user
-- 2. user_achievements - Badge/achievement yang sudah didapat

-- ============================================
-- TABLE: goals
-- ============================================
CREATE TABLE IF NOT EXISTS public.goals (
    -- Primary Key
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- Foreign Key ke auth.users
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Data Goal
    goal_type VARCHAR(50) NOT NULL CHECK (goal_type IN ('weight', 'steps', 'water', 'bmi')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_value DECIMAL(10, 2) NOT NULL,
    current_value DECIMAL(10, 2) DEFAULT 0,
    target_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================
-- TABLE: user_achievements
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_achievements (
    -- Primary Key
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- Foreign Key ke auth.users
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Achievement ID (hardcoded di frontend)
    achievement_id VARCHAR(100) NOT NULL,

    -- Metadata
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    -- Unique constraint: user tidak bisa dapat achievement yang sama 2x
    UNIQUE(user_id, achievement_id)
);

-- ============================================
-- INDEXES
-- ============================================

-- Indexes untuk goals
CREATE INDEX IF NOT EXISTS idx_goals_user_status
ON public.goals(user_id, status);

CREATE INDEX IF NOT EXISTS idx_goals_user_type
ON public.goals(user_id, goal_type);

CREATE INDEX IF NOT EXISTS idx_goals_target_date
ON public.goals(target_date);

-- Indexes untuk user_achievements
CREATE INDEX IF NOT EXISTS idx_user_achievements_user
ON public.user_achievements(user_id);

CREATE INDEX IF NOT EXISTS idx_user_achievements_earned_at
ON public.user_achievements(user_id, earned_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS untuk semua tabel
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES: goals
-- ============================================

-- Policy: User hanya bisa melihat goal mereka sendiri
CREATE POLICY "Users can view their own goals"
ON public.goals
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: User hanya bisa insert goal mereka sendiri
CREATE POLICY "Users can insert their own goals"
ON public.goals
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: User hanya bisa update goal mereka sendiri
CREATE POLICY "Users can update their own goals"
ON public.goals
FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: User hanya bisa delete goal mereka sendiri
CREATE POLICY "Users can delete their own goals"
ON public.goals
FOR DELETE
USING (auth.uid() = user_id);

-- Policy: Dokter bisa melihat semua goals
CREATE POLICY "Doctors can view all goals"
ON public.goals
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'dokter'
    )
);

-- ============================================
-- RLS POLICIES: user_achievements
-- ============================================

-- Policy: User hanya bisa melihat achievement mereka sendiri
CREATE POLICY "Users can view their own achievements"
ON public.user_achievements
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: User hanya bisa insert achievement mereka sendiri
CREATE POLICY "Users can insert their own achievements"
ON public.user_achievements
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Dokter bisa melihat semua achievements
CREATE POLICY "Doctors can view all achievements"
ON public.user_achievements
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'dokter'
    )
);

-- ============================================
-- TRIGGER: Auto-update updated_at untuk goals
-- ============================================

CREATE TRIGGER trigger_update_goals_updated_at
BEFORE UPDATE ON public.goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- SEED DATA (Optional - untuk testing)
-- ============================================
-- Uncomment jika ingin insert dummy data untuk testing
-- Ganti 'YOUR_USER_ID' dengan user_id yang valid dari auth.users

/*
-- Dummy data untuk goals
INSERT INTO public.goals (user_id, goal_type, title, description, target_value, current_value, target_date, status) VALUES
('YOUR_USER_ID', 'weight', 'Turun Berat Badan 5kg', 'Target berat badan ideal sebelum liburan', 65, 70, '2026-07-01', 'active'),
('YOUR_USER_ID', 'steps', '10.000 Langkah Setiap Hari', 'Jalan kaki minimal 10k langkah per hari', 10000, 7240, '2026-06-30', 'active'),
('YOUR_USER_ID', 'water', 'Hidrasi 2.5L Per Hari', 'Minum air putih 2.5 liter setiap hari', 2500, 1800, '2026-06-15', 'active');

-- Dummy data untuk user_achievements
INSERT INTO public.user_achievements (user_id, achievement_id) VALUES
('YOUR_USER_ID', 'hydration_7days'),
('YOUR_USER_ID', 'bmi_ideal');
*/

-- ======================================
-- NOTES
-- ============================================
-- 1. Tabel goals menyimpan target kesehatan user (berat, langkah, air, BMI)
-- 2. Tabel user_achievements menyimpan badge yang sudah didapat
-- 3. Achievement ID hardcoded di frontend (tidak ada tabel master achievements)
-- 4. RLS memastikan user hanya bisa CRUD data mereka sendiri
-- 5. Dokter bisa melihat semua data (read-only)
-- 6. Unique constraint pada user_achievements mencegah duplikasi badge
