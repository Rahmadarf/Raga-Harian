-- =====================================================
-- Fix Chat Messages Table
-- Copy ONLY this section to Supabase SQL Editor
-- =====================================================

DROP TABLE IF EXISTS chat_messages CASCADE;

CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL,
    receiver_id UUID NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_sender ON chat_messages(sender_id);
CREATE INDEX idx_chat_receiver ON chat_messages(receiver_id);
CREATE INDEX idx_chat_created ON chat_messages(created_at DESC);

ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;

GRANT ALL ON chat_messages TO anon, authenticated, service_role;