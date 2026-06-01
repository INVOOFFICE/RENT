-- Fix RLS policies — FOR ALL USING ne couvre pas INSERT
-- Execute this in Supabase SQL Editor

-- 1. Cars
DROP POLICY IF EXISTS "cars_all_admin" ON cars;
CREATE POLICY "cars_select_admin" ON cars FOR SELECT USING (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "cars_insert_admin" ON cars FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "cars_update_admin" ON cars FOR UPDATE USING (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "cars_delete_admin" ON cars FOR DELETE USING (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- 2. Tariffs
DROP POLICY IF EXISTS "tariffs_all_admin" ON tariffs;
CREATE POLICY "tariffs_select_admin" ON tariffs FOR SELECT USING (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "tariffs_insert_admin" ON tariffs FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "tariffs_update_admin" ON tariffs FOR UPDATE USING (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "tariffs_delete_admin" ON tariffs FOR DELETE USING (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- 3. Transport prices
DROP POLICY IF EXISTS "transport_prices_all_admin" ON transport_prices;
CREATE POLICY "transport_prices_select_admin" ON transport_prices FOR SELECT USING (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "transport_prices_insert_admin" ON transport_prices FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "transport_prices_update_admin" ON transport_prices FOR UPDATE USING (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "transport_prices_delete_admin" ON transport_prices FOR DELETE USING (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- 4. Settings
DROP POLICY IF EXISTS "settings_all_admin" ON settings;
CREATE POLICY "settings_select_admin" ON settings FOR SELECT USING (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "settings_insert_admin" ON settings FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "settings_update_admin" ON settings FOR UPDATE USING (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "settings_delete_admin" ON settings FOR DELETE USING (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- 5. Franchises
DROP POLICY IF EXISTS "franchises_all_admin" ON franchises;
CREATE POLICY "franchises_select_admin" ON franchises FOR SELECT USING (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "franchises_insert_admin" ON franchises FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "franchises_update_admin" ON franchises FOR UPDATE USING (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "franchises_delete_admin" ON franchises FOR DELETE USING (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
