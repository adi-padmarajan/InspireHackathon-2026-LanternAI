-- Supabase Schema for Lantern Backend
-- Run this in the Supabase SQL Editor to set up your tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Mood entries table
CREATE TABLE IF NOT EXISTS mood_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mood TEXT NOT NULL CHECK (mood IN ('great', 'good', 'okay', 'low', 'struggling')),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries on created_at
CREATE INDEX IF NOT EXISTS idx_mood_entries_created_at ON mood_entries(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;

-- Policy to allow all operations (adjust as needed for authentication)
CREATE POLICY "Allow all operations on mood_entries" ON mood_entries
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Optional: Chat history table for future use
CREATE TABLE IF NOT EXISTS chat_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    mode TEXT DEFAULT 'default' CHECK (mode IN ('default', 'accessibility', 'international')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_history_created_at ON chat_history(created_at DESC);

ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on chat_history" ON chat_history
    FOR ALL
    USING (true)
    WITH CHECK (true);
