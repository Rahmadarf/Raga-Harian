-- ============================================
-- SCHEMA: Quick Actions Tables
-- ============================================
-- Tabel untuk fitur Quick Actions:
-- 1. meals - Log makanan
-- 2. exercises - Log olahraga
-- 3. health_notes - Catatan kesehatan harian

-- ============================================
-- TABLE: meals
-- ============================================
CREATE TABLE IF NOT EXISTS public.meals (
    -- Primary Key
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- Foreign Key ke auth.users
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Data Makanan
    meal_name VARCHAR(255) NOT NULL,
    calories INTEGER DEFAULT 0,
    protein DECIMAL(5, 2) DEFAULT 0,
    carbs DECIMAL(5, 2) DEFAULT 0,
    fats DECIMAL(5, 2) DEFAULT 0,
    meal_type VARCHAR(50) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    notes TEXT,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================
-- TABLE: exercises
-- ============================================
CREATE TABLE IF NOT EXISTS public.exercises (
    -- Primary Key
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- Foreign Key ke auth.users
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Data Olahraga
    exercise_name VARCHAR(255) NOT NULL,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    calories_burned INTEGER DEFAULT 0,
    intensity VARCHAR(50) NOT NULL CHECK (intensity IN ('low', 'moderate', 'high')),
    notes TEXT,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================
-- TABLE: health_notes
-- ============================================
CREATE TABLE IF NOT EXISTS public.health_notes (
    -- Primary Key
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- Foreign Key ke auth.users
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Data Catatan
    note_text TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('general', 'symptom', 'mood', 'medication')),
    mood VARCHAR(50) CHECK (mood IN ('happy', 'neutral', 'sad', 'stressed')),

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================
-- INDEXES
-- ============================================

-- Indexes untuk meals
CREATE INDEX IF NOT EXISTS idx_meals_user_date
ON public.meals(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_meals_user_type
ON public.meals(user_id, meal_type);

-- Indexes untuk exercises
CREATE INDEX IF NOT EXISTS idx_exercises_user_date
ON public.exercises(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_exercises_user_intensity
ON public.exercises(user_id, intensity);

-- Indexes untuk health_notes
CREATE INDEX IF NOT EXISTS idx_health_notes_user_date
ON public.health_notes(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_health_notes_user_category
ON public.health_notes(user_id, category);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS untuk semua tabel
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_notes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES: meals
-- ============================================

-- Policy: User hanya bisa melihat data mereka sendiri
CREATE POLICY "Users can view their own meals"
ON public.meals
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: User hanya bisa insert data mereka sendiri
CREATE POLICY "Users can insert their own meals"
ON public.meals
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: User hanya bisa update data mereka sendiri
CREATE POLICY "Users can update their own meals"
ON public.meals
FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: User hanya bisa delete data mereka sendiri
CREATE POLICY "Users can delete their own meals"
ON public.meals
FOR DELETE
USING (auth.uid() = user_id);

-- Policy: Dokter bisa melihat semua data meals
CREATE POLICY "Doctors can view all meals"
ON public.meals
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'dokter'
    )
);

-- ============================================
-- RLS POLICIES: exercises
-- ============================================

-- Policy: User hanya bisa melihat data mereka sendiri
CREATE POLICY "Users can view their own exercises"
ON public.exercises
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: User hanya bisa insert data mereka sendiri
CREATE POLICY "Users can insert their own exercises"
ON public.exercises
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: User hanya bisa update data mereka sendiri
CREATE POLICY "Users can update their own exercises"
ON public.exercises
FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: User hanya bisa delete data mereka sendiri
CREATE POLICY "Users can delete their own exercises"
ON public.exercises
FOR DELETE
USING (auth.uid() = user_id);

-- Policy: Dokter bisa melihat semua data exercises
CREATE POLICY "Doctors can view all exercises"
ON public.exercises
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'dokter'
    )
);

-- ============================================
-- RLS POLICIES: health_notes
-- ============================================

-- Policy: User hanya bisa melihat data mereka sendiri
CREATE POLICY "Users can view their own notes"
ON public.health_notes
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: User hanya bisa insert data mereka sendiri
CREATE POLICY "Users can insert their own notes"
ON public.health_notes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: User hanya bisa update data mereka sendiri
CREATE POLICY "Users can update their own notes"
ON public.health_notes
FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: User hanya bisa delete data mereka sendiri
CREATE POLICY "Users can delete their own notes"
ON public.health_notes
FOR DELETE
USING (auth.uid() = user_id);

-- Policy: Dokter bisa melihat semua data health_notes
CREATE POLICY "Doctors can view all notes"
ON public.health_notes
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'dokter'
    )
);

-- ============================================
-- TRIGGER: Auto-update updated_at
-- ============================================

-- Function untuk auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk meals
CREATE TRIGGER trigger_update_meals_updated_at
BEFORE UPDATE ON public.meals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger untuk exercises
CREATE TRIGGER trigger_update_exercises_updated_at
BEFORE UPDATE ON public.exercises
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger untuk health_notes
CREATE TRIGGER trigger_update_health_notes_updated_at
BEFORE UPDATE ON public.health_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- SEED DATA (Optional - untuk testing)
-- ============================================
-- Uncomment jika ingin insert dummy data untuk testing
-- Ganti 'YOUR_USER_ID' dengan user_id yang valid dari auth.users

/*
-- Dummy data untuk meals
INSERT INTO public.meals (user_id, meal_name, calories, protein, carbs, fats, meal_type, notes, created_at) VALUES
('YOUR_USER_ID', 'Nasi Goreng', 450, 12, 65, 15, 'lunch', 'Dengan telur dan ayam', NOW() - INTERVAL '2 hours'),
('YOUR_USER_ID', 'Salad Sayur', 150, 5, 20, 8, 'dinner', 'Dressing olive oil', NOW() - INTERVAL '1 hour');

-- Dummy data untuk exercises
INSERT INTO public.exercises (user_id, exercise_name, duration_minutes, calories_burned, intensity, notes, created_at) VALUES
('YOUR_USER_ID', 'Jogging', 30, 250, 'moderate', 'Di taman pagi hari', NOW() - INTERVAL '3 hours'),
('YOUR_USER_ID', 'Push-up', 15, 80, 'high', '3 set x 15 reps', NOW() - INTERVAL '2 hours');

-- Dummy data untuk health_notes
INSERT INTO public.health_notes (user_id, note_text, category, mood, created_at) VALUES
('YOUR_USER_ID', 'Tidur 7 jam, merasa segar', 'general', 'happy', NOW() - INTERVAL '1 hour'),
('YOUR_USER_ID', 'Sakit kepala ringan setelah makan siang', 'symptom', 'neutral', NOW() - INTERVAL '30 minutes');
*/

-- ============================================
-- NOTES
-- ============================================
-- 1. Semua tabel sudah dilengkapi dengan RLS untuk keamanan data
-- 2. User hanya bisa CRUD data mereka sendiri
-- 3. Dokter bisa melihat semua data (read-only)
-- 4. Trigger auto-update updated_at sudah diaktifkan
-- 5. Indexes dibuat untuk performa query yang optimal
-- 6. Constraint CHECK memastikan data valid (meal_type, intensity, category, mood)
