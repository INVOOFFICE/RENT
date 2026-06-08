-- Ajout des colonnes chauffeur aux réservations
-- Compatible rétrograde : les réservations existantes auront NULL

ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS chauffeur_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS chauffeur_type TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS chauffeur_price NUMERIC DEFAULT NULL;
