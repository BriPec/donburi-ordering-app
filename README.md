# Donburi Ordering Website — Final

Free-to-host React + Vite + Supabase ordering site for Oyakodon, Butadon, Gyudon with add-ons.
Payment via **BDO / BPI / Maya / GCash** using QR + proof upload. Delivery booked by seller via **Lalamove**.

## Quickstart

```bash
npm install
cp .env.example .env   # fill SUPABASE values
npm run dev
```

## Environment

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_STORE_NAME="Ogata-ya San"
VITE_STORE_PHONE="+63 9XX XXX XXXX"
```

## Mermaid Flow

```mermaid
flowchart LR
  A[Customer] --> B[Website (React/Vite)]
  B --> C[(Supabase: Products/Addons)]
  B --> D{Pick Payment: BDO/BPI/Maya/GCash}
  D --> E[Scan QR]
  E --> F[Upload Proof Image]
  F --> G[(Supabase Storage: proofs/)]
  B --> H[Submit Order]
  H --> I[(Supabase: orders + items + proof_url)]
  I --> J[Seller Admin / Table View]
  J --> K[Lalamove Booking]
  K --> L[Rider Delivery]
  L --> M[Customer Receives Order & Pays Delivery Fee]
```

## SQL (run in Supabase SQL Editor)

See `supabase/migrations/001_init.sql` for schema and seeds.
Add RLS policies as needed (see project requirements doc).

## Deploy (Vercel)

- Import GitHub repo
- Add env vars
- Deploy
