# SL Cleaning Services website

React + Vite site, hosted on Vercel. Domain: slcleaningservices.online

## Run locally

```bash
npm install
npm run dev
npm run build
```

Create a `.env` file for the public form (not stored in the repo):

```
VITE_WEB3FORMS_KEY=your-key-here
```

## Where to edit things

- `src/config.js`: phone, email, Google review link, hero/about photos, cities, testimonials, static fallback before/after photos, FAQ
- `src/App.jsx`: homepage sections and quote form
- `src/pages/Area.jsx`: the `/cleaning/<city>` pages
- `public/`: photos (WebP), `sitemap.xml`, `robots.txt`

## Admin panel (photo management)

Private UI at `/admin` (and on the `admin.` subdomain once DNS is set).

### Generate secrets (run once on your machine)

```bash
npm install
npm run gen:auth
# or: node scripts/generate-auth.mjs "my-long-access-code"
```

This prints:

- `ACCESS_CODE_HASH` — scrypt hash of your access code
- `TOTP_SECRET` — for Google Authenticator
- `SESSION_SECRET` — signs the httpOnly session cookie
- A terminal QR code to scan with your authenticator app
- The plaintext access code (store offline; never commit it)

### Vercel environment variables

Create these in **Vercel → Project → Settings → Environment Variables** (Production + Preview):

| Name | Notes |
|------|--------|
| `ACCESS_CODE_HASH` | From `npm run gen:auth` |
| `TOTP_SECRET` | From `npm run gen:auth` |
| `SESSION_SECRET` | From `npm run gen:auth` (min 32 chars) |
| `TELEGRAM_BOT_TOKEN` | Your existing bot token |
| `TELEGRAM_CHAT_ID` | Chat that receives login alerts |
| `BLOB_READ_WRITE_TOKEN` | Auto-added when you enable **Vercel Blob** storage |

### Enable Vercel Blob

1. Vercel dashboard → your project → **Storage** → create a **Blob** store
2. Connect it to the project (token is injected as `BLOB_READ_WRITE_TOKEN`)

### Admin subdomain

1. Vercel → Project → **Settings → Domains** → Add `admin.slcleaningservices.online`
2. At your DNS provider, add a **CNAME**:
   - Name: `admin`
   - Value: `cname.vercel-dns.com` (or the target Vercel shows)
3. Wait for SSL. Open `https://admin.slcleaningservices.online/admin`

The same deployment serves the main site and the admin UI. Admin is protected by name + access code + TOTP, rate limiting, Telegram alerts, and a signed session cookie.

### API routes

| Route | Auth | Purpose |
|-------|------|---------|
| `POST /api/auth/login` | — | Login (Telegram notify) |
| `POST /api/auth/logout` | session | Logout |
| `GET /api/auth/me` | session | Session check |
| `GET /api/photos/list` | public | List photos (optional `?service=`) |
| `POST /api/photos/upload` | admin | Upload WebP (base64) |
| `POST /api/photos/delete` | admin | Delete entry or one side |
| `POST /api/photos/reorder` | admin | Drag-and-drop order |
| `POST /api/photos/update` | admin | Captions / pair before+after |

Public service pages load from the API and fall back to the static `work` list in `src/config.js` if the API is empty or fails.
