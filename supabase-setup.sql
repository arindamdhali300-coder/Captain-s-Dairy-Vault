-- ============================================
-- Captain Diary - Supabase Database Setup
-- ============================================
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- 1. Create the diary_entries table
CREATE TABLE IF NOT EXISTS diary_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  mood TEXT NOT NULL DEFAULT '😊',
  is_favorite BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'Personal',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Add new columns (if they don't exist) and create performance indexes
-- Add tags column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diary_entries' AND column_name = 'tags') THEN
    ALTER TABLE diary_entries ADD COLUMN tags TEXT[] DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diary_entries' AND column_name = 'category') THEN
    ALTER TABLE diary_entries ADD COLUMN category TEXT DEFAULT 'Personal';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diary_entries' AND column_name = 'is_favorite') THEN
    ALTER TABLE diary_entries ADD COLUMN is_favorite BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_diary_entries_created_at ON diary_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_diary_entries_user_id ON diary_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_diary_entries_favorite ON diary_entries(is_favorite) WHERE is_favorite = TRUE;
CREATE INDEX IF NOT EXISTS idx_diary_entries_tags ON diary_entries USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_diary_entries_category ON diary_entries(category);

-- 3. Create user preferences table for customization
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  theme TEXT DEFAULT 'midnight-rose',
  font_family TEXT DEFAULT 'Caveat',
  font_size INTEGER DEFAULT 22,
  layout TEXT DEFAULT 'card',
  auto_save BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Enable Row Level Security
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- Policy: Users can only read their own entries
CREATE POLICY "Users can read own entries"
  ON diary_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can only insert their own entries
CREATE POLICY "Users can insert own entries"
  ON diary_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own entries
CREATE POLICY "Users can update own entries"
  ON diary_entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only delete their own entries
CREATE POLICY "Users can delete own entries"
  ON diary_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Admin can read all entries
CREATE POLICY "Admin can read all entries"
  ON diary_entries
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'dp7800549@gmail.com');

-- Policy: Admin can delete any entry
CREATE POLICY "Admin can delete any entry"
  ON diary_entries
  FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'dp7800549@gmail.com');

-- Enable RLS for user_preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- User preferences policies
CREATE POLICY "Users can manage own preferences"
  ON user_preferences
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- 6. Enable Realtime for the diary_entries table
-- Only add if not already in publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'diary_entries'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE diary_entries;
  END IF;
END $$;

-- 7. Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS update_diary_entries_updated_at ON diary_entries;

CREATE TRIGGER update_diary_entries_updated_at
BEFORE UPDATE ON diary_entries
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- ============================================
-- DONE! Your Captain Diary database is ready 📓
-- ============================================
