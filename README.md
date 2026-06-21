# IRONCORE

Premium strength and conditioning website built from `spec.md`.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and add Supabase and Resend credentials. Without credentials, forms run in safe demo mode: validation and success states work, but submissions are not persisted or emailed.

Apply `supabase/migrations/001_initial_schema.sql` in the Supabase SQL editor before enabling live submissions.

## Verification

```bash
npm run lint
npm run typecheck
npm run build
```

## Before launch

- Replace placeholder gym address, hours, phone, and email.
- Replace stock trainer and transformation imagery with consented assets.
- Confirm membership pricing, class schedule, and trainer credentials.
- Replace placeholder privacy and terms copy with reviewed legal text.
- Set the production site URL and analytics ID.
# IRONCORE
