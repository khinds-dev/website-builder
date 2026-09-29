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

### A. When Creating a Website from Scratch
1. Determine the site topic, name, primary pages (e.g., Home, About, Projects/Work, Contact).
2. Run the generator script or use the `website-builder` CLI:
   ```bash
   node bin/cli.js new ./sites/<site-name> --name "<Site Name>" --desc "<Description>"
   ```
3. Customize page copy, sections, and tokens to match the user's specific theme and personality.

### B. When Enhancing / Redesigning an Existing Website URL
1. Fetch and analyze the target URL:
   ```bash
   node bin/cli.js analyze <URL>
   ```
   Or use the `web_fetch` tool to inspect the raw HTML.
2. **Preserve Original External Links**: Always preserve original external links, social media URLs (Facebook, Instagram, WhatsApp, Twitter/X, TikTok, LinkedIn, YouTube), phone numbers, email addresses, and physical addresses exactly as discovered from the original website. Do not invent, alter, or rename external profile handles.
3. Present a concise diagnostic summary to the user:
   - What's working well vs. what is suboptimal (SEO, accessibility, visual hierarchy, mobile readiness).
   - Proposed improvements.
4. Generate the enhanced redesign:
   ```bash
   node bin/cli.js enhance <URL> ./sites/<redesigned-site> --name "<Site Name>"
   ```
5. Ensure `robots.txt` and `sitemap.xml` are populated and present at the root.
6. Review the generated HTML and refine the content, cards, and styling to make the site look polished, modern, and ultra-fast.
7. Run verification before delivery:
   ```bash
   node bin/cli.js verify ./sites/<redesigned-site>
   ```
