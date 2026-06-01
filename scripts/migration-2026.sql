-- Migration 2026 — Transport prices, settings, franchises
-- Execute this in Supabase SQL Editor, then run `node scripts/seed.mjs`

-- 1. Transport prices between cities
CREATE TABLE IF NOT EXISTS transport_prices (
  id SERIAL PRIMARY KEY,
  from_location TEXT NOT NULL,
  to_location TEXT NOT NULL,
  price_eur NUMERIC NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(from_location, to_location)
);

-- 2. Settings (key-value for global config)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Insurance franchises per category
CREATE TABLE IF NOT EXISTS franchises (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('CAT A','CAT B','CAT C','CAT D')),
  amount_eur NUMERIC NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category)
);

-- 4. RLS policies (public read, admin write — WITH CHECK for INSERT)
ALTER TABLE transport_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE franchises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transport_prices_select_public" ON transport_prices FOR SELECT USING (true);
CREATE POLICY "transport_prices_insert_admin" ON transport_prices FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "transport_prices_update_admin" ON transport_prices FOR UPDATE USING (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "transport_prices_delete_admin" ON transport_prices FOR DELETE USING (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

CREATE POLICY "settings_select_public" ON settings FOR SELECT USING (true);
CREATE POLICY "settings_insert_admin" ON settings FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "settings_update_admin" ON settings FOR UPDATE USING (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "settings_delete_admin" ON settings FOR DELETE USING (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

CREATE POLICY "franchises_select_public" ON franchises FOR SELECT USING (true);
CREATE POLICY "franchises_insert_admin" ON franchises FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "franchises_update_admin" ON franchises FOR UPDATE USING (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "franchises_delete_admin" ON franchises FOR DELETE USING (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
