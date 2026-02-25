-- SEAMUNs Dashboard: Chair data, Delegate data, User config, Global config
-- Run in Supabase SQL Editor or via Supabase CLI

-- Chair data (one row per user)
CREATE TABLE IF NOT EXISTS chair_data (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Delegate data (one row per user)
CREATE TABLE IF NOT EXISTS delegate_data (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User config (committee options etc)
CREATE TABLE IF NOT EXISTS user_config (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  committee_options JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Global config (read-only for clients)
CREATE TABLE IF NOT EXISTS config (
  key TEXT PRIMARY KEY,
  options JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Users can only read/write their own chair_data, delegate_data, user_config
ALTER TABLE chair_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE delegate_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chair_data_select" ON chair_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "chair_data_insert" ON chair_data FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "chair_data_update" ON chair_data FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "delegate_data_select" ON delegate_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "delegate_data_insert" ON delegate_data FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delegate_data_update" ON delegate_data FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "user_config_select" ON user_config FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_config_insert" ON user_config FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_config_update" ON user_config FOR UPDATE USING (auth.uid() = user_id);

-- Config: public read (no write from client)
CREATE POLICY "config_select" ON config FOR SELECT USING (true);
