# Pixel Perfect Studio — Website

One-page marketing site for Pixel Perfect Studio, built with React + Vite,
plus a Node/Express + MongoDB backend for the contact form and an admin
panel. Supports 4 languages on the public site: English, Arabic (RTL),
Spanish, Russian — switchable from the header without a page reload.

## Project structure

```
/                → frontend (React + Vite)
/server          → backend API (Express + MongoDB) — see server/README.md
```

## Run the frontend

```bash
cp .env.example .env      # set VITE_API_URL if the backend isn't on :4000
npm install
npm run dev
```

`npm run build` outputs to `dist/` — deploy that folder to any static
host (Netlify, Vercel, etc.). The public site works even if the backend
is offline (the portfolio section falls back to built-in placeholder
content, and the contact form will just show an error until the API is
reachable).

## Run the backend

See `server/README.md` for full setup (env vars, seeding the first admin
account, endpoint list). Quick version:

```bash
cd server
cp .env.example .env      # set MONGODB_URI, JWT_SECRET, ADMIN_EMAIL/PASSWORD
npm install
npm run seed:admin
npm run dev
```

## Admin panel

Once the backend is running and you've seeded an admin account, log in at
`/admin/login` on the frontend. From there you can:
- Manage portfolio projects (add/edit/delete, upload images, per-language
  category & description text)
- View and manage contact form submissions (mark as read/replied/archived)

## Structure (frontend)

- `src/i18n/translations.js` — all public-site copy in en / ar / es / ru
- `src/context/LanguageContext.jsx` — active language + RTL/LTR switching
- `src/context/AdminAuthContext.jsx` — admin login/session state
- `src/api/client.js` — fetch wrapper for the backend API
- `src/components/` — one component per landing-page section (Header,
  Hero, Services, Benefits, WhyUs, Portfolio, Process, Audit, FinalCta,
  Footer, WhatsAppFloat, ContactForm)
- `src/pages/` — routed pages: `LandingPage`, `AdminLogin`,
  `AdminDashboard` (+ its `PortfolioManager` / `MessagesManager` panels)
- `src/index.css` — design tokens (colors, type) matching the studio's TOR
- `public/assets/` — logo and photography assets

## Notes / to finish before launch

- Replace every placeholder contact (the `wa.me/00000000000` WhatsApp
  links in `Footer.jsx` and `WhatsAppFloat.jsx`, and the Instagram/
  Facebook/LinkedIn/TikTok/Telegram URLs in `Footer.jsx`) with the real
  ones — including once the Meta WhatsApp Business connection is
  finished.
- Contact form submissions are saved to MongoDB and visible in the admin
  panel, but no email notification is sent yet — see "Not included yet"
  in `server/README.md`.
- Testimonials section intentionally omitted (per TOR — no fake
  reviews).
- SEO basics are in place (meta description, Open Graph/Twitter cards,
  JSON-LD, canonical, robots.txt, sitemap.xml) but they only describe the
  English version — this is a single-page app with in-page language
  switching, not per-language URLs, so true multilingual SEO would need
  routing per language later if that matters for search visibility.
- Portfolio starts empty until you add real projects through the admin
  panel — until then, the section shows the built-in placeholder
  (Viktoria Kotekh Bridal, MyGold App, Animal Joy) using the bridal-site
  mockup photo for all three.
- Deploying: the frontend (static) and backend (Node) are two separate
  deployments. Point the frontend's `VITE_API_URL` at wherever the
  backend ends up living, and update the backend's `CORS_ORIGIN` to the
  live frontend domain.
