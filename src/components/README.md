# Donburi Ordering Website — Final

Free-to-host React + Vite + Supabase ordering site for Oyakodon, Butadon, Gyudon with add-ons.
Payment via **BDO / BPI / Maya / GCash** using QR + proof upload. Delivery booked by seller via **Lalamove**.

## Quickstart

```bash
npm install
cp .env.build .env
npm run dev
```

## Environment

Use `.env.build` as a template, copy to `.env`, then fill real values locally:

```
VITE_SUPABASE_URL=https://pbkpfdzxfqkoigvylyhy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBia3BmZHp4ZnFrb2lndnlseWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5OTU1NDMsImV4cCI6MjA3NzU3MTU0M30.QuNFmagCTSthjGfarxcQa3XD0r9G6QUrH4Yg9aEzQgE
VITE_STORE_PHONE="+639985890423"
VITE_STORE_NAME="Ogata Ya San"
RESEND_API_KEY=re_JwgB52BL_dtJuaHqwnTuQ54Vhresv4GA8
```

> Keep secrets only in your local `.env` and in Vercel project settings. Ensure `.env` is in `.gitignore`.

## Mermaid Flow

```mermaid
flowchart LR
  A[Customer]
  B[Website: React + Vite]
  C[(Supabase: Products & Add-ons)]
  D{Pick Payment}
  E[Scan QR]
  F[Upload Proof]
  G[(Storage: proofs)]
  H[Submit Order]
  I[(Supabase: orders/items)]
  J[Seller Admin]
  K[Lalamove Booking]
  L[Rider Delivery]
  M[Customer Receives Order]

  A --> B
  B --> C
  B --> D
  D --> E
  E --> F
  F --> G
  B --> H
  H --> I
  I --> J
  J --> K
  K --> L
  L --> M
```

## SQL (run in Supabase SQL Editor)

See `supabase/migrations/001_init.sql` for schema and seeds.
Add RLS policies as needed (see project requirements doc).

## Deploy (Vercel)

- Import GitHub repo
- Add env vars
- Deploy
