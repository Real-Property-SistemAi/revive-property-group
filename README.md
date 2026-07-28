# Revive Realty and Property Group — Services Website

A luxury-boutique, mobile-first marketing site that showcases the three core services of
Revive Realty and Property Group: **Property Management**, **Selling / Listing Homes**,
and **Buyer Representation**. Built as a fast, self-contained static site — no build
step, no backend, no dependencies to install.

The look is inspired by high-end boutique real estate firms: clean warm-white and
soft-neutral backgrounds, near-black charcoal typography, an elegant serif for large
display headings, and a single warm **orange** accent used for buttons, links, section
eyebrows, and small highlights. Lots of whitespace and breathing room.

- **Company:** Revive Realty and Property Group
- **Location:** Pinellas Park, FL (Tampa Bay area), serving Florida
- **Domain:** revivepropertygroup.biz
- **Contact:** heath@buyfloridaestate.com

---

## Pages (multi-page site)

Every page shares the same `styles.css`, `script.js`, header nav, and navy + gold footer,
and links with **relative** paths (works on GitHub Pages / any static host, or opened directly).

| Page | Purpose |
|------|---------|
| `index.html` | Home — hero, four-pillar overview, Why Choose Revive, live rentals (TenantTurner), testimonials, CTA. |
| `property-management.html` | Full-service PM: screening, rent collection, maintenance, 24/7 response, inspections, renewals, evictions, reporting, HOA, vacation rentals. |
| `buy-sell.html` | Buyer & seller representation, investment properties, first-time buyers, CMA, home valuation. |
| `investment.html` | Investment services + **two live calculators** (mortgage and investment/cash-flow), client-side vanilla JS. |
| `retirement.html` | **Retire in Brazil — Florianópolis.** Lifestyle/market page aimed at North American / expat retirees considering retiring abroad. Covers the pros of Florianópolis (cost of living, coastline, quality of life, climate, culture, healthcare access, attainable coastal real estate, expat community), how Revive helps, and a prominent honest disclaimer (not immigration/tax/legal/financial advice). Bridges into the `florianopolis.html` international page. CTA prefills the contact form with `?service=Retire in Brazil`. |
| `florianopolis.html` | **International Investment — Florianópolis, Brazil.** Showcases Revive's international opportunities: a **flagship luxury home in Jurêrê Internacional** (R$12,000,000 BRL) with an embedded **HTML5 video tour**, a "Why Florianópolis" investment-context grid (no promised returns), a **local partnership** section with a second embedded partnership video, a prominent honest disclaimer (foreign-ownership rules, currency, taxes, legal — not legal/tax/immigration/financial advice), and a CTA. Videos are local files in `assets/videos/`. Several details flagged `<!-- REPLACE -->` for real specs/description/partner name. CTA prefills the contact form with `?service=Florianopolis`. |
| `contact.html` | Contact form (validate → `mailto:`), phone/email/address, office hours, and an OpenStreetMap embed. Service select includes a **Retire in Brazil (Florianópolis)** option and a **Florianópolis / Brazil investment** option (matching the `?service=Florianopolis` prefill). |
| `about.html` | About Us — the Revive story, mission, "what we stand for" values grid, licensing/credentials (Thomas Heath Shewmaker · FL License #SL3279668) + Equal Housing, community blurb, headshot placeholder. |
| `service-areas.html` | Local SEO hub — intro + grid of city cards, each linking to its own area page. |
| `clearwater.html`, `st-petersburg.html`, `largo.html`, `seminole.html`, `pinellas-park.html`, `dunedin.html`, `palm-harbor.html`, `safety-harbor.html`, `tampa.html` | Nine city landing pages for local SEO. Each has **genuinely unique** area context (no thin/duplicate copy), a "How Revive helps in [City]" section linking the service pages, and a city-specific CTA. |

The shared nav includes **Owner Login** and **Tenant Login** buttons that open TenantCloud
in a new tab. Order: Home · Property Management · Buy & Sell · Investment · **Retirement** ·
**Florianópolis** · Rentals · **Service Areas** · **About** · Contact. The current page is marked
`aria-current="page"` (city pages mark **Service Areas** as current). The footer carries a fourth
**Service Areas** column linking key cities, and the **Company** column links **Retire in Brazil**
(`retirement.html`) and **Florianópolis, Brazil** (`florianopolis.html`).
Nav collapses to a hamburger under **1400px** (raised because the menu is longer).

## Files

| File | Purpose |
|------|---------|
| `*.html` | The 18 pages above (semantic HTML, identical shared header/footer). |
| `assets/videos/` | Local MP4 files embedded on `florianopolis.html` (`jurere-casa-12mi.mp4` flagship tour, `parceria-jucy-heath.mp4` partnership intro). No external hotlinking. |
| `styles.css` | Navy + gold luxury-boutique theme, layout, animations, calculators, responsive rules. |
| `script.js` | The editable **LISTINGS** array (top of file) plus mobile nav, scroll reveals, counters, hero "How can we help" bar, listings render, testimonials carousel, **investment calculators**, `?service=` prefill, and form validation + `mailto:`. |
| `README.md` | This file. |

Only external dependencies: **Google Fonts** (`Cormorant Garamond` + `Manrope`) via `<link>`,
the **TenantTurner** rentals widget (home page), and the **OpenStreetMap** map embed (contact page,
no API key). Everything else — icons, illustrations — is inline SVG / CSS. No external images are hotlinked.

## Investment calculators

`investment.html` includes two client-side calculators (no libraries, results update live on input):

- **Mortgage** — home price, down payment %, interest rate %, term → monthly principal & interest + total.
- **Investment / cash-flow** — purchase price, down payment %, rate, term, monthly rent, monthly expenses
  → monthly mortgage, monthly cash flow, cap rate, cash-on-cash return.

Both handle empty/zero inputs gracefully (no divide-by-zero) and carry an "estimates only, not
financial advice" disclaimer. The math lives in the guarded `initCalculators()` block in `script.js`.

---

## Preview locally

Because it is plain HTML/CSS/JS, you can just open it:

1. Double-click `index.html`, **or**
2. Run a tiny local server (recommended, so fonts and relative paths behave):

```bash
# Python 3
cd website-services
python -m http.server 8080
# then open http://localhost:8080
```

```bash
# Or with Node (if you have it)
npx serve .
```

---

## What to customize before publishing

Every spot that needs real data is flagged in the HTML with an
`<!-- REPLACE: ... -->` comment. Search the project for `REPLACE:` and update:

- **Real photos** — the site ships with elegant neutral gradient placeholders (marked "Photo"
  with a `photo-tag` label). Add real photography: the **hero** background (`.hero-media`) and
  each **service** image frame (`.photo-frame`). Keep images optimized (WebP/AVIF) for speed.
- **FL real estate license number** — placeholder in the footer (`FL License #———`). Add the licensed agent/broker number.
- **Social links** — Facebook / Instagram / LinkedIn buttons in the contact section and footer point to `#`. Add real URLs or remove.
- **Stats band** — the four numbers (100%, 3, 24/7, 1) are illustrative. Confirm or replace.
- **Testimonials** — the four carousel quotes are clearly-labelled placeholders (each flagged
  `<!-- REPLACE: real client testimonial -->`). Swap for real client quotes + names when available.
- **Open Graph** — add an `og:image` once a real photo exists (`og:url` is already the live domain).

### Featured Listings — how to add a property (no HTML needed)

The **Listings** section (nav link "Listings", `id="listings"`) shows homes **for sale and for
rent**. It is data-driven: you edit **one array** and the cards build themselves.

1. Open `script.js`.
2. At the very **top of the file** you'll see the big `★ PROPERTY LISTINGS — EDIT HERE ★`
   comment and a `var LISTINGS = [ ... ];` list (the file ships with **3 clearly-labelled
   sample listings** to replace).
3. To **add** a listing: copy one existing `{ ... }` block, paste it inside the `[ ]`,
   and change the fields. To **remove** one, delete its `{ ... }` block. Save the file.

Each listing has these fields (text in `"quotes"`, numbers without):

| Field | Example | Notes |
|-------|---------|-------|
| `id` | `"mls-12345"` | any unique short text |
| `status` | `"For Sale"` | must be `"For Sale"`, `"For Rent"`, `"Pending"`, or `"Sold"` |
| `price` | `"$450,000"` or `"$2,400/mo"` | free text |
| `address` | `"123 Palm Avenue"` | street |
| `city` | `"Pinellas Park, FL"` | |
| `beds` / `baths` / `sqft` | `3` / `2` / `1450` | numbers (commas added automatically) |
| `blurb` | `"Updated block home…"` | one short sentence, or `""` to hide |
| `featured` | `true` / `false` | `true` adds a "Featured" tag + accent border |
| `link` | `"https://…"` | link to an MLS/details page, or `""` for no link (card stays static, no dead link) |
| `photo` | `""` | leave empty for the elegant placeholder; or a real image URL. Prefer your **own hosted** image — don't hotlink someone else's. |

- **Status badges are color-coded** (For Sale = orange, For Rent = teal, Pending = amber,
  Sold = gray) **and** always show the text, so meaning is never color-only.
- **Empty state:** if you make the list empty (`var LISTINGS = [];`), the section shows a
  tasteful "New listings coming soon — call (727) 755-1662" card instead of a blank grid.

Phone `(727) 755-1662` and email `heath@buyfloridaestate.com` are the real business details and
are already wired into the hero, contact section, form (`mailto:`), and footer — no flags needed.

The contact email (`heath@buyfloridaestate.com`) is already wired into the form,
the contact list, and the footer.

---

## Contact form: how it works

The form is **client-side only** — there is no backend.

1. It validates name, email, phone (optional), service, and message.
2. On success it opens a prefilled `mailto:` to `heath@buyfloridaestate.com` with the
   inquiry details in the body. The visitor's email app sends it.

### Adding a no-code endpoint later (optional)

When you want submissions to arrive without relying on the visitor's mail client, you
can wire in a no-code form backend (e.g. Formspree, Basin, Getform, Netlify Forms) with
**one attribute — no code changes and no secrets in the markup**:

```html
<!-- in index.html, on the <form id="contact-form"> -->
<form class="contact-form" id="contact-form" novalidate data-endpoint="https://formspree.io/f/XXXXXXX">
```

When `data-endpoint` is set, the script POSTs the form as JSON to that URL. If the
request fails, it automatically falls back to the `mailto:` flow so no lead is lost.

> Security note: the endpoint URL is a public form-provider URL, not a secret. Never put
> API keys, tokens, or passwords in these files — they are shipped to every visitor.

---

## Deploy

This is a static site, so any static host works. Point the host at the
`website-services/` folder.

### Netlify (drag & drop)
1. Go to app.netlify.com → **Add new site → Deploy manually**.
2. Drag the `website-services` folder onto the page.
3. (Optional) Set your custom domain `revivepropertygroup.biz` under Domain settings.

### Vercel
```bash
cd website-services
npx vercel        # follow prompts; framework preset = "Other"
npx vercel --prod # promote to production
```

### GitHub Pages
1. Push the folder contents to a repo (e.g. `main` branch, `/` or `/docs`).
2. Repo **Settings → Pages** → Source: your branch/folder.
3. Site publishes at `https://<user>.github.io/<repo>/` — then map the custom domain.

---

## Design & tech notes

- **Theme:** luxury-boutique — warm-white / soft-neutral backgrounds, near-black charcoal
  type, and a single warm **orange** accent (`#d9662a`). Restrained, premium, lots of
  whitespace. An orange eyebrow-line motif labels each section.
- **Type:** `Cormorant Garamond` (elegant display serif) for large headings, `Manrope`
  for body/UI.
- **Page rhythm:** full-bleed hero with a "How can we help?" selector bar → value-proposition
  band → three services as alternating image-text rows → "Why Revive" grid → **Featured
  Listings** grid (for sale + for rent, data-driven) → charcoal stats/social-proof band →
  testimonials carousel → contact + form → multi-column footer.
- **Signature elements:** the hero **How can we help** bar (dropdown → "Get started" scrolls to
  the contact form and pre-selects the chosen service) and the **testimonials carousel**.
- **Performance:** no framework, deferred script, CSS transitions, `IntersectionObserver`
  for reveals/counters. Fonts are the only network dependency; imagery is CSS gradients/SVG.
- **Accessibility:** semantic landmarks, skip link, labelled fields with inline error
  messaging, visible orange focus rings, ARIA live status on the form, and full
  `prefers-reduced-motion` support. The carousel is keyboard-accessible (arrow keys, focusable
  dots), pauses on hover/focus/tab-hidden, and has an explicit play/pause control.
- **Responsive:** mobile-first; breakpoints at 960px and 600px, hamburger nav under 960px.

---

## Compliance

The footer includes a marketing/informational disclaimer (not legal, tax, or financial
advice) and an **Equal Housing Opportunity** statement. Keep these on the live site and
add your license number as noted above.
