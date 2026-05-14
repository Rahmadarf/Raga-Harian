-- ============================================
-- SEED DATA: health_metrics_history
-- ============================================
-- Script untuk insert data dummy riwayat kesehatan
-- Ganti 'YOUR_USER_ID_HERE' dengan user_id yang valid

-- CARA MENDAPATKAN USER_ID:
-- 1. Buka Supabase Dashboard → Authentication → Users
-- 2. Copy UUID dari user yang ingin diberi data dummy
-- 3. Ganti 'YOUR_USER_ID_HERE' di bawah dengan UUID tersebut

-- ATAU jalankan query ini untuk melihat semua user_id:
-- SELECT id, email FROM auth.users;

-- ============================================
-- INSERT DATA DUMMY (30 hari terakhir)
-- ============================================

-- Data 30 hari yang lalu (berat 72 kg, BMI 24.9)
INSERT INTO public.health_metrics_history (user_id, weight_kg, height_cm, bmi, created_at) VALUES
('YOUR_USER_ID_HERE', 72.0, 170, 24.9, NOW() - INTERVAL '30 days');

-- Data 27 hari yang lalu (berat 71.8 kg, BMI 24.8)
INSERT INTO public.health_metrics_history (user_id, weight_kg, height_cm, bmi, created_at) VALUES
('YOUR_USER_ID_HERE', 71.8, 170, 24.8, NOW() - INTERVAL '27 days');

-- Data 24 hari yang lalu (berat 71.5 kg, BMI 24.7)
INSERT INTO public.health_metrics_history (user_id, weight_kg, height_cm, bmi, created_at) VALUES
('YOUR_USER_ID_HERE', 71.5, 170, 24.7, NOW() - INTERVAL '24 days');

-- Data 21 hari yang lalu (berat 71.2 kg, BMI 24.6)
INSERT INTO public.health_metrics_history (user_id, weight_kg, height_cm, bmi, created_at) VALUES
('YOUR_USER_ID_HERE', 71.2, 170, 24.6, NOW() - INTERVAL '21 days');

-- Data 18 hari yang lalu (berat 71.0 kg, BMI 24.6)
INSERT INTO public.health_metrics_history (user_id, weight_kg, height_cm, bmi, created_at) VALUES
('YOUR_USER_ID_HERE', 71.0, 170, 24.6, NOW() - INTERVAL '18 days');

-- Data 15 hari yang lalu (berat 70.5 kg, BMI 24.4)
INSERT INTO public.health_metrics_history (user_id, weight_kg, height_cm, bmi, created_at) VALUES
('YOUR_USER_ID_HERE', 70.5, 170, 24.4, NOW() - INTERVAL '15 days');

-- Data 12 hari yang lalu (berat 70.2 kg, BMI 24.3)
INSERT INTO public.health_metrics_history (user_id, weight_kg, height_cm, bmi, created_at) VALUES
('YOUR_USER_ID_HERE', 70.2, 170, 24.3, NOW() - INTERVAL '12 days');

-- Data 9 hari yang lalu (berat 70.0 kg, BMI 24.2)
INSERT INTO public.health_metrics_history (user_id, weight_kg, height_cm, bmi, created_at) VALUES
('YOUR_USER_ID_HERE', 70.0, 170, 24.2, NOW() - INTERVAL '9 days');

-- Data 6 hari yang lalu (berat 69.5 kg, BMI 24.0)
INSERT INTO public.health_metrics_history (user_id, weight_kg, height_cm, bmi, created_at) VALUES
('YOUR_USER_ID_HERE', 69.5, 170, 24.0, NOW() - INTERVAL '6 days');

-- Data 3 hari yang lalu (berat 69.0 kg, BMI 23.9)
INSERT INTO public.health_metrics_history (user_id, weight_kg, height_cm, bmi, created_at) VALUES
('YOUR_USER_ID_HERE', 69.0, 170, 23.9, NOW() - INTERVAL '3 days');

-- Data hari ini (berat 68.5 kg, BMI 23.7)
INSERT INTO public.health_metrics_history (user_id, weight_kg, height_cm, bmi, created_at) VALUES
('YOUR_USER_ID_HERE', 68.5, 170, 23.7, NOW());

-- ============================================
-- VERIFIKASI DATA
-- ============================================
-- Jalankan query ini untuk memastikan data sudah masuk:
-- SELECT * FROM public.health_metrics_history
-- WHERE user_id = 'YOUR_USER_ID_HERE'
-- ORDER BY created_at DESC;

-- ============================================
-- NOTES
-- ============================================
-- Data dummy ini menunjukkan trend penurunan berat badan dari 72kg ke 68.5kg
-- dalam 30 hari (turun 3.5kg)
-- BMI turun dari 24.9 (Normal) ke 23.7 (Normal/Ideal)
-- Tinggi badan tetap 170cm
