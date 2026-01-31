-- User Preferences Table (with personalization fields)
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    vibe TEXT CHECK (vibe IN ('jokester', 'cozy', 'balanced')),
    coping_style TEXT CHECK (coping_style IN ('talking', 'planning', 'grounding')),
    routines TEXT[] DEFAULT '{}',
    last_helpful_routine_id TEXT,
    last_helpful_playbook_id TEXT,
    last_feedback_rating INTEGER CHECK (last_feedback_rating >= 1 AND last_feedback_rating <= 5),
    last_check_in_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Memory Table
CREATE TABLE IF NOT EXISTS user_memory (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    last_goal TEXT,
    last_checkin TIMESTAMPTZ,
    playbook_state JSONB DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Feedback Table (with routine tracking)
CREATE TABLE IF NOT EXISTS user_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    note TEXT,
    context JSONB DEFAULT '{}',
    routine_id TEXT,
    playbook_id TEXT,
    action_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- App Events Table
CREATE TABLE IF NOT EXISTS app_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,
    payload JSONB DEFAULT '{}',
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_coping_style ON user_preferences(coping_style);
CREATE INDEX IF NOT EXISTS idx_user_memory_user_id ON user_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id ON user_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_routine_id ON user_feedback(routine_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_playbook_id ON user_feedback(playbook_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_created_at ON user_feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_app_events_event_type ON app_events(event_type);
CREATE INDEX IF NOT EXISTS idx_app_events_created_at ON app_events(created_at);
CREATE INDEX IF NOT EXISTS idx_app_events_user_id ON app_events(user_id);

-- Row Level Security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_events ENABLE ROW LEVEL SECURITY;

-- Policies for user_preferences
DROP POLICY IF EXISTS "Users can view own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can delete own preferences" ON user_preferences;

CREATE POLICY "Users can view own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own preferences" ON user_preferences
    FOR DELETE USING (auth.uid() = user_id);

-- Policies for user_memory
DROP POLICY IF EXISTS "Users can view own memory" ON user_memory;
DROP POLICY IF EXISTS "Users can insert own memory" ON user_memory;
DROP POLICY IF EXISTS "Users can update own memory" ON user_memory;
DROP POLICY IF EXISTS "Users can delete own memory" ON user_memory;

CREATE POLICY "Users can view own memory" ON user_memory
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own memory" ON user_memory
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own memory" ON user_memory
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own memory" ON user_memory
    FOR DELETE USING (auth.uid() = user_id);

-- Policies for user_feedback
DROP POLICY IF EXISTS "Users can insert feedback" ON user_feedback;
DROP POLICY IF EXISTS "Users can view own feedback" ON user_feedback;
DROP POLICY IF EXISTS "Anyone can insert feedback" ON user_feedback;

CREATE POLICY "Anyone can insert feedback" ON user_feedback
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own feedback" ON user_feedback
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Policies for app_events
DROP POLICY IF EXISTS "Users can insert events" ON app_events;
DROP POLICY IF EXISTS "Anyone can insert events" ON app_events;

CREATE POLICY "Anyone can insert events" ON app_events
    FOR INSERT WITH CHECK (true);
