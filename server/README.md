# Pixel Perfect Studio — Backend API

Node.js + Express + MongoDB API for the contact form and the admin panel
(portfolio management + viewing contact submissions).

## Setup

1. Copy the env file and fill in real values:
   ```bash
   cp .env.example .env
   ```
   - `MONGODB_URI` — a local MongoDB (`mongodb://127.0.0.1:27017/pixel-perfect-studio`)
     or a free MongoDB Atlas cluster connection string.
   - `JWT_SECRET` — any long random string (used to sign admin login tokens).
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — the first admin account's login. Used
     only by the seed script below.
   - `CORS_ORIGIN` — the frontend's URL(s), comma-separated. Defaults to the
     Vite dev server (`http://localhost:5173`); add your production domain
     when you deploy.

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the first admin account (run once, or again later to reset the
   password):
   ```bash
   npm run seed:admin
   ```

4. Start the API:
   ```bash
   npm run dev     # auto-restarts on changes
   # or
   npm start
   ```
   The API runs on `http://localhost:4000` by default.

## Endpoints

**Public**
- `GET  /api/health` — health check
- `GET  /api/portfolio` — published portfolio items
- `POST /api/contact` — submit the contact form `{ name, email, message, language }`

**Admin** (send `Authorization: Bearer <token>` from `/api/auth/login`)
- `POST /api/auth/login` — `{ email, password }` → `{ token }`
- `GET  /api/auth/me` — current admin info
- `GET  /api/portfolio/admin` — every portfolio item (published + hidden)
- `POST /api/portfolio` — create an item
- `PUT  /api/portfolio/:id` — update an item
- `DELETE /api/portfolio/:id` — delete an item
- `POST /api/portfolio/upload` — upload an image (`multipart/form-data`, field
  name `image`) → `{ url }`, then use that URL in the item's `image` field
- `GET  /api/contact` — list contact submissions (optional `?status=new`)
- `PATCH /api/contact/:id` — update a submission's status
- `DELETE /api/contact/:id` — delete a submission

## Portfolio item shape

```json
{
  "title": "Viktoria Kotekh Bridal",
  "category": { "en": "...", "ar": "...", "es": "...", "ru": "..." },
  "description": { "en": "...", "ar": "...", "es": "...", "ru": "..." },
  "image": "/uploads/169...-123.jpg",
  "projectUrl": "https://example.com",
  "order": 1,
  "published": true
}
```

## Deploying

Any Node host works (Railway, Render, a VPS, etc.). Set the same env vars
there, point `MONGODB_URI` at your production database (Atlas is the
easiest), and update `CORS_ORIGIN` to your live frontend domain. Uploaded
images are stored on disk under `uploads/` — if your host wipes the
filesystem on redeploy (e.g. some serverless platforms), switch to a
persistent volume or an object store (S3, Cloudinary) instead; the
`portfolio/upload` route is the only place that would need to change.

## Not included yet

- **Sending an email** when the contact form is submitted — right now
  submissions are only saved to MongoDB and visible in the admin panel.
  Wiring up an email (e.g. with `nodemailer` + Gmail/SendGrid) is a small
  addition once you have SMTP credentials you want to use — say the word
  and it can be added.
- **Rate limiting** on the public `/api/contact` endpoint (to reduce spam).
