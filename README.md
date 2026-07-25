# Revive Property Group — Services Website

A luxury-boutique, mobile-first marketing site that showcases the three core services of
Revive Property Group: **Property Management**, **Selling / Listing Homes**,
and **Buyer Representation**. Built as a fast, self-contained static site — no build
step, no backend, no dependencies to install.

The look is inspired by high-end boutique real estate firms: clean warm-white and
soft-neutral backgrounds, near-black charcoal typography, an elegant serif for large
display headings, and a single warm **orange** accent used for buttons, links, section
eyebrows, and small highlights. Lots of whitespace and breathing room.

- **Company:** Revive Property Group
- **Location:** Pinellas Park, FL (Tampa Bay area), serving Florida
- **Domain:** revivepropertygroup.biz
- **Contact:** heath@buyfloridaestate.com

---

## Files

| File | Purpose |
|------|---------|
| `index.html` | All page content and structure (semantic HTML). |
| `styles.css` | Luxury-boutique theme (white + charcoal + orange), layout, animations, responsive rules. |
| `script.js` | Mobile nav, scroll reveals, counters, hero "How can we help" bar, testimonials carousel, form validation + `mailto:`. |
| `README.md` | This file. |

Only external dependency: **Google Fonts** (`Cormorant Garamond` + `Manrope`) loaded via `<link>`.
Everything else — icons, illustrations, charts — is inline SVG / CSS. No external images
are hotlinked.

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
  band → three services as alternating image-text rows → "Why Revive" grid → charcoal
  stats/social-proof band → testimonials carousel → contact + form → multi-column footer.
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
