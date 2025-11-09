# Donburi Ordering Website — Final

Free-to-host React + Vite + Supabase ordering site for Oyakodon, Butadon, Gyudon with add-ons.
Payment via **BDO / BPI / Maya / GCash** using QR + proof upload. Delivery booked by seller via **Lalamove**.

## Quickstart

```bash
npm install
cp .env.build .env   # create local env file
# edit .env and fill real values
npm run dev
```

## Environment

```
VITE_SUPABASE_URL="https://pbkpfdzxfqkoigvylyhy.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBia3BmZHp4ZnFrb2lndnlseWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5OTU1NDMsImV4cCI6MjA3NzU3MTU0M30.QuNFmagCTSthjGfarxcQa3XD0r9G6QUrH4Yg9aEzQgE"
VITE_STORE_PHONE=+"639985890423"
VITE_STORE_NAME="Ogata Ya San"
RESEND_API_KEY="re_JwgB52BL_dtJuaHqwnTuQ54Vhresv4GA8"
```

> Never commit real keys to README. Keep secrets in `.env` (gitignored) and in Vercel project settings.

## Mermaid Flow

```mermaid
flowchart LR
  A[Customer] --> B[Website (React + Vite)]
  B --> C[(Supabase: Products and Add-ons)]
  B --> D{Pick Payment}
  D -->|BDO| E[Scan QR]
  D -->|BPI| E
  D -->|Maya| E
  D -->|GCash| E
  E --> F[Upload Proof Image]
  F --> G[(Supabase Storage: proofs)]
  B --> H[Submit Order]
  H --> I[(Supabase: orders, items, proof_url)]
  I --> J[Seller Admin - Table View]
  J --> K[Lalamove Booking]
  K --> L[Rider Delivery]
  L --> M[Customer receives order]
```

## SQL (run in Supabase SQL Editor)

See `supabase/migrations/001_init.sql` for schema and seeds.
Add RLS policies as needed (see project requirements doc).

## Deploy (Vercel)

- Import GitHub repo
- Add env vars
- Deploy
