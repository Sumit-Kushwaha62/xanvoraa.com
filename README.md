# Xanvoraa Technologies

Production-ready React/Vite frontend and Express backend.

## Local checks

```powershell
cd frontend
npm ci
npm run lint
npm run build

cd ../backend
npm ci
npm audit --omit=dev
npm start
```

## Database setup

1. Create a Supabase project.
2. Run `backend/supabase/schema.sql` in the Supabase SQL editor. This creates the tables and the private `career-resumes` bucket.
3. Configure `SUPABASE_URL` and the server-only `SUPABASE_SERVICE_ROLE_KEY` on the backend host. Never expose the service-role key in Vite variables or commit it.
4. Configure `ADMIN_EMAIL` and a strong `ADMIN_INITIAL_PASSWORD`, then run `npm run seed:admin` once from the backend service shell. Remove those two seed variables afterward.

## Backend deployment (Render)

The root `render.yaml` creates the Node API. Configure all values marked `sync: false` in Render. Set `FRONTEND_URL` to the exact deployed frontend origin, without a trailing slash. For more than one trusted origin use `FRONTEND_URLS` as a comma-separated list.

Google Sheets is optional. If used, add `GOOGLE_SHEET_ID` and make the service-account credential available as a Render secret file, then set `GOOGLE_APPLICATION_CREDENTIALS` to that file path. Form submissions remain in Supabase if Sheets or email delivery is unavailable.

## Frontend deployment (Vercel)

Import this repository in Vercel and set the Root Directory to `frontend`. The included `vercel.json` preserves React routes on refresh. Set:

```text
VITE_API_BASE_URL=https://your-render-api.example.com
```

After Vercel assigns the final domain, update the backend `FRONTEND_URL` and redeploy the backend.

## Required production verification

- `GET /api/health` returns 200.
- Contact, career and newsletter forms save successfully.
- The chatbot reports unavailable when the backend or Gemini is unavailable; it does not fabricate a local response.
- `/admin/login` works and unauthenticated `/api/admin/*` requests return 401.
- Uploaded resumes open only from the authenticated admin dashboard.
- Privacy Policy and Terms links work on direct refresh.

Local `.env` files, credentials, uploads, archives, dependencies and build output are excluded by `.gitignore`.