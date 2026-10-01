# Templates & Shared Assets

Reusable CSS themes, JS components, and page templates accumulated from completed showcase projects.
Pick the closest theme, copy it into a new project, then adjust tokens to match the client's brand.

---

## Directory Structure

```
templates/
├── assets/               — Generic base used by the CLI for every new project
│   ├── css/shared.css    — Neutral blue/grey design tokens, reset, navbar, footer
│   ├── js/nav.js         — Hamburger toggle (ESC, click-outside, aria-expanded)
│   ├── Dockerfile        — Nginx Alpine production image
│   ├── nginx.conf        — Clean URL routing & static caching
│   ├── robots.txt        — Default allow-all + sitemap pointer
│   └── sitemap.xml       — Placeholder sitemap
│
├── themes/               — Per-industry design token sets from real projects
│   ├── indian-takeaway/  — Warm espresso/cream/red/gold palette (Touch of Spice)
│   │   ├── shared.css
│   │   └── nav.js
│   └── barbershop/       — Dark amber/slate palette (The Barbers at Number Two)
│       ├── shared.css
│       └── nav.js
│
└── components/           — Drop-in page templates & interactive modules
    └── order-page/       — Full dummy ordering experience (basket, checkout, confirmation)
        └── index.html
```

---

## Themes

### `themes/indian-takeaway/`
**Source:** Touch of Spice, Eastleigh (`projects/touch-of-spice/`)

| Token | Value | Notes |
|---|---|---|
| `--color-bg` | `#fdfaf5` | Warm off-white parchment |
| `--color-surface` | `#fff8ee` | Slightly warmer surface |
| `--color-accent` | `#c0392b` | Deep red — heat & spice |
| `--color-gold` | `#b8860b` | Dark gold — premium feel |
| `--color-nav-bg` | `#1c1209` | Deep espresso brown |
| `--font-display` | Georgia, serif | Restaurant-class heading weight |

**Good for:** Indian / South Asian restaurants, curry houses, takeaways, any warm food brand.

---

### `themes/barbershop/`
**Source:** The Barbers at Number Two (`projects/the-barbers-at-number-two/`)

**Good for:** Barbershops, hair salons, grooming studios, men's lifestyle brands.

---

## Components

### `components/order-page/`
**Source:** `projects/touch-of-spice/order/index.html`

A fully self-contained dummy ordering page. No backend required — all client-side JS.

**Features:**
- Two-column layout: category-tabbed menu browser (left) + live basket (right)
- Delivery / Collection toggle with dynamic fee calculation
- Add/remove items, quantity controls, running subtotal & total
- Customer details form (name, phone, address, notes)
- Dummy order confirmation overlay with generated reference number & ETA
- Fully responsive — basket moves above menu on mobile

**To reuse:**
1. Copy `order/index.html` into the new project
2. Replace the `MENU` array in the `<script>` block with the new restaurant's dishes
3. Update design tokens in `<style>` to match the project theme
4. Point all "Order Online" links in the site to `/order/`

---

## Usage Guide

### Starting a new restaurant/food project
```bash
# 1. Scaffold the project
node bin/cli.js new ./projects/<slug> --name "<Name>" --desc "<Description>"

# 2. Replace the generated css/shared.css with the indian-takeaway theme
cp templates/themes/indian-takeaway/shared.css projects/<slug>/css/shared.css

# 3. Copy in the order page component
mkdir -p projects/<slug>/order
cp templates/components/order-page/index.html projects/<slug>/order/index.html

# 4. Edit the MENU array and tokens to match the new client
# 5. Verify
node bin/cli.js verify ./projects/<slug>
```

### Starting a barbershop/salon project
```bash
node bin/cli.js new ./projects/<slug> --name "<Name>" --desc "<Description>"
cp templates/themes/barbershop/shared.css projects/<slug>/css/shared.css
```

---

## Adding a New Theme

When completing a new showcase project, save its theme here:
```bash
cp projects/<slug>/css/shared.css templates/themes/<industry>/shared.css
cp projects/<slug>/js/nav.js templates/themes/<industry>/nav.js
```

Then document it in this README under the Themes section.
