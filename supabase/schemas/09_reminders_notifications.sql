-- =====================================================
-- Reminders & Notifications Database Schema
-- TechSprint Health Monitoring App
-- =====================================================

-- 1. Reminders Table
-- Menyimpan jadwal pengingat untuk berbagai aktivitas kesehatan

CREATE TABLE IF NOT EXISTS reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reminder_type VARCHAR(50) NOT NULL, -- 'water', 'medicine', 'exercise', 'meal', 'sleep', 'custom'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    time TIME NOT NULL,                -- Waktu pengingat
    days_of_week VARCHAR(20)[] DEFAULT ARRAY['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], -- Hari aktif
    is_active BOOLEAN DEFAULT true,
    notification_enabled BOOLEAN DEFAULT true,
    sound_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk query cepat berdasarkan user
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_type ON reminders(reminder_type);
CREATE INDEX IF NOT EXISTS idx_reminders_active ON reminders(is_active);

-- 2. Notifications Table
-- Menyimpan history notifikasi yang sudah dikirim

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL, -- 'reminder', 'achievement', 'goal', 'system', 'water', 'meal', 'exercise'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    is_dismissed BOOLEAN DEFAULT false,
    data JSONB,                          -- Data tambahan (goal_id, exercise_id, dll)
    action_url VARCHAR(255),             -- URL untuk action saat diklik
    created_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ
);

-- Index untuk query cepat
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- 3. Water Tracking untuk reminder
-- Track history intake air untuk analytics

CREATE TABLE IF NOT EXISTS water_reminder_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount_ml INTEGER NOT NULL,
    source VARCHAR(50) DEFAULT 'manual',   -- 'manual', 'reminder', 'auto'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_water_logs_user ON water_reminder_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_water_logs_created ON water_reminder_logs(created_at DESC);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_reminder_logs ENABLE ROW LEVEL SECURITY;

-- Reminders: User hanya bisa akses data sendiri
CREATE POLICY "Users can view their own reminders" ON reminders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reminders" ON reminders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders" ON reminders
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders" ON reminders
    FOR DELETE USING (auth.uid() = user_id);

-- Notifications: User hanya bisa akses data sendiri
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notifications" ON notifications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" ON notifications
    FOR DELETE USING (auth.uid() = user_id);

-- Water logs: User hanya bisa akses data sendiri
CREATE POLICY "Users can view their own water logs" ON water_reminder_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own water logs" ON water_reminder_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- Sample Data (Optional - untuk development)
-- =====================================================

-- INSERT INTO reminders (user_id, reminder_type, title, description, time, days_of_week)
-- VALUES
--     ('YOUR_USER_ID', 'water', 'Waktunya Minum Air!', 'Jangan lupa minum air putih untuk menjaga hidrasi tubuh', '08:00:00', ARRAY['Mon','Tue','Wed','Thu','Fri','Sat','Sun']),
--     ('YOUR_USER_ID', 'water', 'Minum Air Siang', 'Sudah 2 jam tidak minum air, ayo konsumsi sekarang!', '10:00:00', ARRAY['Mon','Tue','Wed','Thu','Fri','Sat','Sun']),
--     ('YOUR_USER_ID', 'water', 'Minum Air Sore', 'Sore hari, minimal 2 liter air sudah terpenuhi?', '15:00:00', ARRAY['Mon','Tue','Wed','Thu','Fri','Sat','Sun']),
--     ('YOUR_USER_ID', 'meal', 'Waktunya Sarapan', 'Jangan lewatkan sarapan untuk energi seharian', '07:00:00', ARRAY['Mon','Tue','Wed','Thu','Fri','Sat','Sun']),
--     ('YOUR_USER_ID', 'meal', 'Waktunya Makan Siang', 'Seimbangkan nutrisi, hindari makanan berminyak', '12:00:00', ARRAY['Mon','Tue','Wed','Thu','Fri','Sat','Sun']),
--     ('YOUR_USER_ID', 'exercise', 'Waktunya Olahraga!', '30 menit aktivitas fisik untuk kesehatan optimal', '17:00:00', ARRAY['Mon','Wed','Fri']),
--     ('YOUR_USER_ID', 'sleep', 'Waktunya Tidur', 'Tidur cukup 7-8 jam untuk pemulihan tubuh', '22:00:00', ARRAY['Mon','Tue','Wed','Thu','Fri','Sat','Sun']);