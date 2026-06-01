# Plan Migration Supabase — INVOLOCATION

## Objectif

- Remplacer Google Apps Script / Google Sheets par **Supabase**
- Ajouter un **dashboard admin** avec authentification
- Permettre à l'admin de gérer les réservations, les voitures et les tarifs

---

## Base de données

```sql
-- 1. Cars (catalogue)
CREATE TABLE cars (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL CHECK (category IN ('CAT A','CAT B','CAT C','CAT D')),
  price       NUMERIC NOT NULL,
  duration    TEXT DEFAULT 'jour',
  seats       INT NOT NULL,
  transmission TEXT NOT NULL,
  doors       INT NOT NULL,
  fuel        TEXT NOT NULL,
  image       TEXT NOT NULL,
  active      BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tariffs (grille saisonnière)
CREATE TABLE tariffs (
  id          SERIAL PRIMARY KEY,
  category    TEXT NOT NULL CHECK (category IN ('CAT A','CAT B','CAT C','CAT D')),
  min_days    INT NOT NULL,
  max_days    INT NOT NULL,
  normal_rate NUMERIC NOT NULL,
  haute_rate  NUMERIC NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Reservations
CREATE TABLE reservations (
  id               SERIAL PRIMARY KEY,
  name             TEXT NOT NULL,
  email            TEXT NOT NULL,
  phone            TEXT NOT NULL,
  car_name         TEXT NOT NULL,
  car_category     TEXT NOT NULL,
  car_price        NUMERIC NOT NULL,
  car_duration     TEXT DEFAULT 'jour',
  start_date       DATE NOT NULL,
  end_date         DATE NOT NULL,
  location         TEXT,
  transport_eur    NUMERIC DEFAULT 0,
  season           TEXT NOT NULL,
  duration_days    INT NOT NULL,
  daily_rate_eur   NUMERIC NOT NULL,
  rental_total_eur NUMERIC NOT NULL,
  total_eur        NUMERIC NOT NULL,
  status           TEXT DEFAULT 'new' CHECK (status IN ('new','contacted','confirmed','cancelled')),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Admin profiles
CREATE TABLE admin_profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id),
  name        TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

## RLS Policies

```sql
-- Cars
CREATE POLICY "cars_select_public" ON cars FOR SELECT USING (true);
CREATE POLICY "cars_all_admin" ON cars FOR ALL USING (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- Tariffs
CREATE POLICY "tariffs_select_public" ON tariffs FOR SELECT USING (true);
CREATE POLICY "tariffs_all_admin" ON tariffs FOR ALL USING (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- Reservations
CREATE POLICY "reservations_insert_public" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "reservations_select_admin" ON reservations FOR SELECT USING (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "reservations_update_admin" ON reservations FOR UPDATE USING (
  auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
```

## Phases

### P1 — Projet Supabase + SQL
- Créer le projet sur Supabase
- Exécuter les migrations SQL ci-dessus (SQL Editor)
- Ajouter `SUPABASE_SERVICE_ROLE_KEY` dans `.env` (Settings → API → service_role key)
- Lancer `node scripts/seed.mjs` — crée admin + 10 voitures + 16 tarifs

### P2 — Client SDK + Auth
- `src/lib/supabase.ts` — initialisation du client
- `src/components/admin/ProtectedRoute.tsx` — guard d'authentification
- `src/pages/admin/AdminLogin.tsx` — page de connexion

### P3 — Layout admin
- `src/pages/admin/AdminLayout.tsx` — sidebar + header
- Routage `/admin/*` dans `App.tsx`

### P4 — CRUD voitures
- `AdminCars.tsx` — liste + créer/modifier/supprimer
- `CarForm.tsx` — formulaire

### P5 — CRUD tarifs
- `AdminTariffs.tsx` — liste + modifier
- `TariffForm.tsx` — formulaire

### P6 — Réservations
- `AdminReservations.tsx` — tableau + filtres
- `ReservationTable.tsx` — composant tableau
- Changement de statut (new → contacted → confirmed → cancelled)

### P7 — Migration booking
- Modifier `CarRentals.tsx` : remplacer `sendReservationToSheet()` par envoi Supabase
- Conserver WhatsApp en parallèle

### P8 — Nettoyage
- Supprimer `VITE_BOOKING_WEB_APP_URL` / `VITE_BOOKING_WEB_APP_SECRET` de `.env`
- Supprimer `scripts/sync-cars.mjs`
- Supprimer `.github/workflows/update-cars.yml`
- Ajouter `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans `.env`

---

## Arborescence

```
scripts/
  seed.mjs                               ← Script de seed (admin + données)
src/
  lib/supabase.ts                        ← Client Supabase
  pages/admin/
    AdminLogin.tsx                       ← Connexion
    AdminLayout.tsx                      ← Layout sidebar
    AdminDashboard.tsx                   ← Accueil stats
    AdminCars.tsx                        ← CRUD voitures
    AdminTariffs.tsx                     ← CRUD tarifs
    AdminReservations.tsx                ← Liste réservations
  components/admin/
    ProtectedRoute.tsx                   ← Guard auth
    CarForm.tsx                          ← Formulaire voiture
    TariffForm.tsx                       ← Formulaire tarif
    ReservationTable.tsx                 ← Tableau résas
  sections/CarRentals.tsx                ← MODIFIÉ : Supabase
  App.tsx                                ← MODIFIÉ : routes admin
.env                                     ← MODIFIÉ : vars Supabase
```

## Ce qui reste inchangé

- WhatsApp booking (toujours ouvert en parallèle)
- GitHub Pages hosting + CI/CD (`pages.yml`)
- PWA, i18n, currency, GSAP, shadcn/ui
- ESLint / TypeScript config
