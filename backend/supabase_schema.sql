-- Supabase Schema for Lantern Backend
-- Run this in the Supabase SQL Editor to set up your tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Users table (for NetLink ID authentication)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    netlink_id VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

-- Index for fast netlink_id lookups
CREATE INDEX IF NOT EXISTS idx_users_netlink_id ON users(netlink_id);

-- Enable RLS on users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy for users table (allow all for demo mode)
CREATE POLICY "Allow all operations on users" ON users
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================
-- Mood entries table
-- ============================================
CREATE TABLE IF NOT EXISTS mood_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mood TEXT NOT NULL CHECK (mood IN ('great', 'good', 'okay', 'low', 'struggling')),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_mood_entries_created_at ON mood_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_id ON mood_entries(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;

-- Policy to allow all operations (demo mode)
CREATE POLICY "Allow all operations on mood_entries" ON mood_entries
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================
-- Chat history table
-- ============================================
CREATE TABLE IF NOT EXISTS chat_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    mode TEXT DEFAULT 'default' CHECK (mode IN ('default', 'accessibility', 'international', 'wellness', 'navigator', 'social', 'mental_health', 'seasonal', 'resources')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_history_created_at ON chat_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);

ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on chat_history" ON chat_history
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================
-- Migration script (run if tables already exist)
-- ============================================
-- ALTER TABLE mood_entries ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;
-- ALTER TABLE chat_history ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;
-- CREATE INDEX IF NOT EXISTS idx_mood_entries_user_id ON mood_entries(user_id);
-- CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);
