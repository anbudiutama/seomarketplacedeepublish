-- ============================================
-- Deeppro SEO v2.0 — Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Table: seo_history
CREATE TABLE IF NOT EXISTS seo_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  marketplace TEXT NOT NULL DEFAULT 'shopee',
  input JSONB NOT NULL DEFAULT '{}',
  result JSONB NOT NULL DEFAULT '{}',
  seo_title TEXT,
  seo_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast ordering
CREATE INDEX IF NOT EXISTS idx_seo_history_created 
  ON seo_history (created_at DESC);

-- Index for filtering by marketplace
CREATE INDEX IF NOT EXISTS idx_seo_history_marketplace 
  ON seo_history (marketplace);

-- Enable Row Level Security
ALTER TABLE seo_history ENABLE ROW LEVEL SECURITY;

-- Policy: allow all operations for authenticated and anon users
-- (untuk internal tool, tidak perlu auth granular)
-- Ganti dengan policy lebih ketat jika perlu membatasi per user
CREATE POLICY "Allow all access to seo_history"
  ON seo_history
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Grant access to anon role (Supabase default for public access)
GRANT ALL ON seo_history TO anon;
GRANT ALL ON seo_history TO authenticated;
