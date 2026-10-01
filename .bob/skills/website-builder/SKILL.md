---
name: website-builder
description: Use when the user wants to create a new website from scratch or review, fetch, audit, and redesign an existing website URL to make it far better.
---

# Website Builder & Redesign Skill

This skill guides Bob through creating new websites or auditing, fetching, and redesigning existing websites using a clean, resilient, high-performance vanilla architecture (inspired by the Keith-Website design system).

---

## 🛠️ Core Capabilities

1. **Create New Website From Scratch**
   - Clean, lightweight vanilla HTML5/CSS3/JS architecture.
   - Design tokens (`--color-bg`, `--color-surface`, `--color-border`, `--color-text`, `--color-accent`, etc.).
   - Dark mode support (`prefers-color-scheme`).
   - Fixed, jump-safe navbar (`scroll-padding-top`) with responsive accessible mobile drawer (`aria-expanded`, ESC key, click-outside).
   - Clean URL routing (`/about/index.html`, `/work/index.html`, etc.) served via Nginx.
   - Nginx & Dockerfile production deployment templates.

2. **Point at a Remote URL & Redesign ("Make it Far Better")**
   - **Step 1: Fetch & Inspect**: Fetch the remote URL (via `web_fetch` or `node bin/cli.js analyze <url>`).
   - **Step 2: Comprehensive Audit**:
     - *Typography & Hierarchy*: Check heading sequences (`h1`, `h2`, `h3`), font readability, and spacing.
     - *Responsive & Layout*: Check viewport meta tags, flexbox/grid containers, and mobile navigation.
     - *SEO & Social*: Check title length, meta description, canonical URLs, and Open Graph tags.
     - *Accessibility (a11y)*: Check image alt tags, ARIA labels, color contrast, and keyboard navigation.
     - *Performance & Bloat*: Identify bloated CSS frameworks/inline styles to replace with lightweight tokens.
   - **Step 3: Redesign & Generate**:
     - Extract core brand copy, headings, and value propositions.
     - Restructure into semantic modern sections (Hero, Feature Cards, Highlights, Clean Nav, Accessible Footer).
     - Output the refined website into the destination folder.

---

## 📑 Required Response Format for Every Redesign

Whenever reviewing or redesigning an existing website, ALWAYS structure your output with these standard sections:

### 1. Analysis of the Original Site
- Crawl/fetch all available pages (Home, Services/Prices, About/Team, Contact, FAQs, etc.).
- Detail specific issues:
  - Framework bloat & performance bottlenecks (e.g. Wix, WordPress, heavy scripts)
  - Broken URLs or messy slugs (e.g. duplicate pages, missing 404s)
  - Buried critical information (e.g. opening times, pricing, walk-in vs appointment policies, payment methods)
  - Mobile layout & readability deficiencies
  - Visual hierarchy, typography, and contrast issues

### 2. What Has Been Built (The Redesign)
- Detail the chosen visual identity, color palette tokens, and typography.
- Break down each generated page file by file (e.g. `index.html`, `price-list/`, `find-us/`, `team/`, `faq/`, `contact/`), explaining what was improved on each page.
- Highlight zero-dependency performance, accessibility improvements, and responsive navigation.

### 3. Hosting & Showcase Recommendations
- Provide one-click / fast deployment recommendations (Cloudflare Pages or Netlify Drop) and local preview instructions.

---

## 🚀 Execution Workflow

### Step 0: Establish Intent — Showcase or Live?

**Before doing anything else**, determine whether the site is a **showcase/pitch** or a **live replacement**.

> "Is this site for showing a client what their new site could look like, or will it be deployed as their actual live website?"

| Intent | Behaviour |
|---|---|
| **Showcase / pitch** | Replace ALL external SaaS links (ordering platforms, booking widgets, third-party forms) with in-site dummy equivalents (e.g. `/order/`, `/book/`). The goal is to demonstrate a fully self-contained, superior experience. |
| **Live replacement** | Preserve functional external links. Only replace if the client has confirmed a new provider. |

If the user has not made this clear, **default to showcase mode** for any redesign of an existing business website.

---

### A. When Creating a Website from Scratch
1. Determine the site topic, name, primary pages (e.g., Home, About, Projects/Work, Contact).
2. Run the generator script or use the `website-builder` CLI:
   ```bash
   node bin/cli.js new ./projects/<site-name> --name "<Site Name>" --desc "<Description>"
   ```
   > ⚠️ Known issue: `cli.js new` may error with `path is not defined`. If so, create the directory and files manually instead.
3. Customize page copy, sections, and tokens to match the user's specific theme and personality.
4. Check `templates/themes/` for an existing palette that matches the industry — use it as a starting point rather than creating tokens from scratch.

### B. When Enhancing / Redesigning an Existing Website URL
1. **Establish showcase vs live intent** (see Step 0 above).
2. Fetch and analyze the target URL:
   ```bash
   node bin/cli.js analyze <URL>
   ```
   Or use the `web_fetch` tool to inspect the raw HTML. Fetch all available pages, not just the homepage.
3. **Preserve Original External Links**: Always preserve original external links, social media URLs (Facebook, Instagram, WhatsApp, Twitter/X, TikTok, LinkedIn, YouTube), phone numbers, email addresses, and physical addresses exactly as discovered from the original website. Do not invent, alter, or rename external profile handles.
4. Present a concise diagnostic summary to the user.
5. Generate the enhanced redesign into `./projects/<slug>/`:
   ```bash
   node bin/cli.js enhance <URL> ./projects/<redesigned-site> --name "<Site Name>"
   ```
6. **Clean up stale scaffold pages**: Delete any CLI-generated pages that don't belong (e.g. `about/index.html`, `404.html`, `/work/`) before running verify. These contain placeholder links that will fail the audit.
7. Ensure `robots.txt` and `sitemap.xml` are populated and present at the root.
8. **In showcase mode**: replace any external SaaS ordering/booking links with branded in-site dummy pages. Copy `templates/components/order-page/` as a starting point for food businesses.
9. **Use keyless Google Maps embed** for any location map — see `.bob/rules/google-maps-embed.md`.
10. Review the generated HTML and refine the content, cards, and styling to make the site look polished, modern, and ultra-fast.
11. Run verification before delivery:
    ```bash
    node bin/cli.js verify ./projects/<redesigned-site>
    ```
12. **Save theme to library**: Copy the project's CSS and JS into `templates/themes/<industry>/` and update `templates/README.md`.
