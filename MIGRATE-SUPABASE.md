# Changer de compte Supabase — Procédure

## 1. Fichiers à modifier

### `src/lib/supabase.ts`
Remplacer les variables d'env par vos nouvelles clés (ou modifier le `.env`).

### `src/lib/email.ts` (ligne 1)
```ts
const SUPABASE_EDGE_URL = 'https://NOUVEAU_REF.supabase.co/functions/v1/send-email';
```

### `vite.config.ts` (ligne 72-75)
```ts
proxy: {
  '/api/send-email': {
    target: 'https://NOUVEAU_REF.supabase.co/functions/v1/send-email',
    changeOrigin: true,
    rewrite: () => '',
  },
},
```

## 2. Base de données — Tables à créer

Exécuter dans l'éditeur SQL Supabase (SQL Editor) :

```sql
-- Settings (SMTP, saisons, devise par défaut)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Franchises assurance
CREATE TABLE IF NOT EXISTS franchises (
  category TEXT PRIMARY KEY,
  amount_eur NUMERIC NOT NULL DEFAULT 0
);

-- Voitures
CREATE TABLE IF NOT EXISTS cars (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  duration TEXT DEFAULT 'jour',
  seats INTEGER DEFAULT 5,
  transmission TEXT DEFAULT 'Manuelle',
  doors INTEGER DEFAULT 4,
  fuel TEXT DEFAULT 'Essence',
  image TEXT DEFAULT '',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tarifs
CREATE TABLE IF NOT EXISTS tariffs (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  min_days INTEGER NOT NULL,
  max_days INTEGER NOT NULL,
  normal_rate NUMERIC NOT NULL,
  haute_rate NUMERIC NOT NULL
);

-- Réservations
CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  car_name TEXT,
  start_date TEXT,
  end_date TEXT,
  total_eur NUMERIC,
  location TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Prix transport
CREATE TABLE IF NOT EXISTS transport_prices (
  id SERIAL PRIMARY KEY,
  from_location TEXT NOT NULL,
  to_location TEXT NOT NULL,
  price_eur NUMERIC NOT NULL,
  UNIQUE(from_location, to_location)
);

-- Profils admin (optionnel, géré par Supabase Auth)
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## 3. Déployer l'Edge Function email

```bash
supabase link --project-ref NOUVEAU_REF
supabase functions deploy send-email --no-verify-jwt
```

## 4. GitHub Actions — Secrets

Dans votre dépôt GitHub → Settings → Secrets and variables → Actions :

| Secret | Valeur |
|--------|--------|
| `VITE_SUPABASE_URL` | `https://NOUVEAU_REF.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Votre clé anon Supabase |

## 5. Seed des données (optionnel)

```bash
node scripts/seed.mjs
```
Nécessite `SUPABASE_SERVICE_ROLE_KEY` dans `.env`.

---

**Références :** `AGENTS.md`, `plan-supabase.md`, `scripts/migration-2026.sql`
