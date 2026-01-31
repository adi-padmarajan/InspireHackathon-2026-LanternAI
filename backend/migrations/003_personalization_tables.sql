-- User Preferences Table (with personalization fields)
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
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
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    last_goal TEXT,
    last_checkin TIMESTAMPTZ,
    playbook_state JSONB DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Feedback Table (with routine tracking)
CREATE TABLE IF NOT EXISTS user_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
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
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
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

-- Policies for demo mode (allow all operations)
DROP POLICY IF EXISTS "Allow all operations on user_preferences" ON user_preferences;
CREATE POLICY "Allow all operations on user_preferences" ON user_preferences
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on user_memory" ON user_memory;
CREATE POLICY "Allow all operations on user_memory" ON user_memory
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on user_feedback" ON user_feedback;
CREATE POLICY "Allow all operations on user_feedback" ON user_feedback
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on app_events" ON app_events;
CREATE POLICY "Allow all operations on app_events" ON app_events
    FOR ALL USING (true) WITH CHECK (true);
