-- ============================================
-- SCHEMA: health_metrics_history
-- ============================================
-- Tabel untuk menyimpan riwayat data kesehatan user
-- Setiap kali user update berat/tinggi badan, data akan disimpan di sini
-- Digunakan untuk menampilkan chart tracking BMI dan berat badan

CREATE TABLE IF NOT EXISTS public.health_metrics_history (
    -- Primary Key
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- Foreign Key ke auth.users
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Data Kesehatan
    weight_kg DECIMAL(5, 2) NOT NULL,           -- Berat badan dalam kg (contoh: 65.50)
    height_cm INTEGER NOT NULL,                  -- Tinggi badan dalam cm (contoh: 170)
    bmi DECIMAL(4, 2) NOT NULL,                 -- BMI (Body Mass Index) - dihitung otomatis

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    -- Indexes untuk performa query
    CONSTRAINT health_metrics_history_weight_check CHECK (weight_kg > 0 AND weight_kg < 500),
    CONSTRAINT health_metrics_history_height_check CHECK (height_cm > 0 AND height_cm < 300),
    CONSTRAINT health_metrics_history_bmi_check CHECK (bmi > 0 AND bmi < 100)
);

-- ============================================
-- INDEXES
-- ============================================
-- Index untuk query berdasarkan user_id dan created_at (untuk chart)
CREATE INDEX IF NOT EXISTS idx_health_metrics_history_user_date
ON public.health_metrics_history(user_id, created_at DESC);

-- Index untuk query berdasarkan user_id saja
CREATE INDEX IF NOT EXISTS idx_health_metrics_history_user
ON public.health_metrics_history(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS
ALTER TABLE public.health_metrics_history ENABLE ROW LEVEL SECURITY;

-- Policy: User hanya bisa melihat data mereka sendiri
CREATE POLICY "Users can view their own health history"
ON public.health_metrics_history
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: User hanya bisa insert data mereka sendiri
CREATE POLICY "Users can insert their own health history"
ON public.health_metrics_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Dokter bisa melihat semua data (optional, sesuaikan dengan kebutuhan)
CREATE POLICY "Doctors can view all health history"
ON public.health_metrics_history
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'dokter'
    )
);

-- ============================================
-- TRIGGER: Auto-insert ke history saat health_metrics di-update
-- ============================================
-- Function untuk auto-insert ke health_metrics_history
CREATE OR REPLACE FUNCTION public.log_health_metrics_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert data baru ke health_metrics_history
    INSERT INTO public.health_metrics_history (user_id, weight_kg, height_cm, bmi, created_at)
    VALUES (NEW.user_id, NEW.weight_kg, NEW.height_cm, NEW.bmi, NOW());

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger yang akan dijalankan setiap kali health_metrics di-update
CREATE TRIGGER trigger_log_health_metrics_change
AFTER UPDATE OF weight_kg, height_cm, bmi ON public.health_metrics
FOR EACH ROW
WHEN (OLD.weight_kg IS DISTINCT FROM NEW.weight_kg
      OR OLD.height_cm IS DISTINCT FROM NEW.height_cm
      OR OLD.bmi IS DISTINCT FROM NEW.bmi)
EXECUTE FUNCTION public.log_health_metrics_change();

-- ============================================
-- SEED DATA (Optio- untuk testing)
-- =========================================
-- Uncomment jika ingin insert dummy data untuk testing
-- Ganti 'YOUR_USER_ID' dengan user_id yang valid dari auth.users

/*
INSERT INTO public.health_metrics_history (user_id, weight_kg, height_cm, bmi, created_at) VALUES
('YOUR_USER_ID', 70.5, 170, 24.4, NOW() - INTERVAL '30 days'),
('YOUR_USER_ID', 71.0, 170, 24.6, NOW() - INTERVAL '25 days'),
('YOUR_USER_ID', 70.8, 170, 24.5, NOW() - INTERVAL '20 days'),
('YOUR_USER_ID', 70.2, 170, 24.3, NOW() - INTERVAL '15 days'),
('YOUR_USER_ID', 69.5, 170, 24.0, NOW() - INTERVAL '10 days'),
('YOUR_USER_ID', 69.0, 170, 23.9, NOW() - INTERVAL '5 days'),
('YOUR_USER_ID', 68.5, 170, 23.7, NOW());
*/

-- ============================================
-- NOTES
-- ============================================
-- 1. Tabel ini akan otomatis terisi setiap kali user update data di health_metrics
-- 2. Data disimpan dengan timestamp untuk tracking perubahan dari waktu ke waktu
-- 3. RLS memastikan user hanya bisa lihat data mereka sendiri
-- 4. Dokter bisa lihat semua data (sesuaikan policy jika perlu)
-- 5. Index dibuat untuk performa query yang optimal
