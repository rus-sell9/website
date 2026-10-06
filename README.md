# SL Cleaning Services

Professional residential and commercial cleaning website for **Los Angeles County** and **Orange County**.

**Live site:** [https://slcleaningservices.online](https://slcleaningservices.online)  
**Admin:** [https://admin.slcleaningservices.online](https://admin.slcleaningservices.online) (private — not for public use)

---

## Features

- Marketing site with services, areas, FAQs, and quote form
- **Bilingual** English / Spanish
- **Light / dark** mode
- Service pages with before/after photo sliders
- **Admin panel** to upload, pair, caption, reorder, and delete work photos
- Photos stored on **Vercel Blob** (not in this repo)
- Secure admin login: access code + TOTP (Google Authenticator) + Telegram alerts

---

## Stack

| Layer | Tech |
|--------|------|
| Frontend | Vite, React 19, React Router |
| Hosting | Vercel |
| Images | Vercel Blob |
| Auth | scrypt access-code hash, TOTP (`otplib`), signed session cookie (`jose`) |
| i18n | Custom (`src/i18n.jsx` + `src/es.js`) |

---

## Project structure

```
├── api/                    # Vercel serverless functions
│   ├── auth/               # login, logout, me
│   ├── photos/             # list, upload, delete, update, reorder
│   └── lib/                # auth + photos helpers
├── public/                 # Static assets (favicon, hero/about images, sitemap)
├── scripts/
│   └── generate-auth.mjs   # Generate access-code hash + TOTP secret/QR
├── src/
│   ├── components/         # UI pieces (Pair slider, Controls, …)
│   ├── pages/
│   │   ├── admin/          # Admin panel
│   │   ├── Service.jsx     # Service work galleries (from Blob API)
│   │   ├── Area.jsx        # Area pages
│   │   └── NotFound.jsx
│   ├── config.js           # Business info, services, areas (no gallery photos)
│   ├── i18n.jsx / es.js    # Translations
│   └── main.jsx            # Routes + admin subdomain detection
├── vercel.json
└── package.json
```

**Gallery photos are not stored in Git.** They are managed in the admin panel and saved to Vercel Blob.

---

## Local development

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

> API routes (`/api/*`) and Blob uploads need a Vercel deployment (or `vercel dev`) with env vars set. Local Vite alone will not run the serverless functions.

```bash
# Optional: Vercel CLI with env + API routes
npx vercel dev
```

---

## Environment variables (Vercel)

Set these in **Vercel → Project → Settings → Environment Variables** (Production, and Preview if needed). **Never commit secrets.**

| Variable | Purpose |
|----------|---------|
| `ACCESS_CODE_HASH` | scrypt hash of your admin access code |
| `TOTP_SECRET` | Authenticator app secret |
| `SESSION_SECRET` | Random string, **min 32 characters** (signs session cookies) |
| `BLOB_READ_WRITE_TOKEN` | Auto-added when you connect a Vercel Blob store |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token (login alerts) |
| `TELEGRAM_CHAT_ID` | Your Telegram chat id |

### Generate auth secrets

```bash
npm run gen:auth
```

Follow the script output:

1. Copy **ACCESS_CODE_HASH** into Vercel  
2. Copy **TOTP_SECRET** into Vercel  
3. Scan the **QR code** with Google Authenticator (or similar)  
4. Set a long random **SESSION_SECRET** (e.g. `openssl rand -hex 32`)

### Telegram

1. Talk to [@BotFather](https://t.me/BotFather) → create a bot → copy the token  
2. Message your bot, then call `https://api.telegram.org/bot<TOKEN>/getUpdates` to find your `chat.id`  
3. Set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in Vercel  

### Blob storage

1. Vercel → **Storage** → create a **Blob** store  
2. **Connect** it to this project  
3. Confirm `BLOB_READ_WRITE_TOKEN` is present  
4. **Redeploy** after connecting  

---

## Admin panel

- URL: `https://admin.slcleaningservices.online` (same Vercel project, subdomain)
- Login: **name** + **access code** + **6-digit TOTP**
- Session length: **30 minutes** (visible countdown in the header)
- Lockout after several failed attempts; every attempt notifies Telegram
- Upload flow: pick images → Before/After → service → optional EN/ES captions → client-side WebP compress → Blob
- Manage: view, pair before/after, edit captions, drag to reorder, delete

The admin UI is `noindex` and only intended on the admin subdomain.

### DNS / subdomain

1. Vercel → Project → **Domains** → add `admin.slcleaningservices.online`  
2. At your DNS provider, point the `admin` host to Vercel (CNAME as Vercel instructs)  

`src/main.jsx` detects the admin host and serves the admin app at `/` on that subdomain.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run gen:auth` | Generate access-code hash + TOTP secret/QR |
| `npm run lint` | Lint |

---

## Deploy

Connected to Vercel (Git push or CLI):

```bash
npx vercel --prod
```

After changing env vars or Blob connection, **redeploy** so the new values apply.

---

## Security notes

- Do not put real access codes, TOTP secrets, or tokens in the repo  
- Admin APIs require a valid session cookie  
- Rate limiting + lockout on login  
- Prefer HTTPS only in production  

---

## License

Private business site. All rights reserved.
