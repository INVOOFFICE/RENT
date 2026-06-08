-- Migration — Drivers / chauffeurs settings
-- Execute this in Supabase SQL Editor

-- 1. Drivers settings table (single-row config)
CREATE TABLE IF NOT EXISTS drivers_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enabled BOOLEAN NOT NULL DEFAULT true,
  price_per_hour NUMERIC NOT NULL DEFAULT 10,
  half_day_price NUMERIC NOT NULL DEFAULT 40,
  full_day_price NUMERIC NOT NULL DEFAULT 70,
  price_24h NUMERIC NOT NULL DEFAULT 120,
  airport_extra NUMERIC NOT NULL DEFAULT 15,
  night_extra NUMERIC NOT NULL DEFAULT 20,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Default row
INSERT INTO drivers_settings (enabled, price_per_hour, half_day_price, full_day_price, price_24h, airport_extra, night_extra)
VALUES (true, 10, 40, 70, 120, 15, 20)
ON CONFLICT (id) DO NOTHING;

-- 3. RLS policies (public read, admin write)
ALTER TABLE drivers_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "drivers_settings_select_public" ON drivers_settings FOR SELECT USING (true);

CREATE POLICY "drivers_settings_insert_admin" ON drivers_settings FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

CREATE POLICY "drivers_settings_update_admin" ON drivers_settings FOR UPDATE USING (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

CREATE POLICY "drivers_settings_delete_admin" ON drivers_settings FOR DELETE USING (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- 4. Permissions de base (nécessaires pour que RLS fonctionne)
GRANT ALL ON TABLE drivers_settings TO anon, authenticated, service_role;
