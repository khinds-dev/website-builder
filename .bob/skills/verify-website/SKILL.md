---
name: verify-website
description: Use when the user wants to run a thorough verification pass, pre-commit audit, link check, or QA scan on a website directory or codebase.
---

# Pre-Commit & Website QA Verification Workflow

Follow these steps to perform a thorough multi-point QA audit on any static website or website generator directory.

## Step 1 — Check File Integrity & Completeness
- Inspect the target directory to verify all necessary files exist:
  - Routing pages: `index.html`, `/about/index.html` (or subdirectories), `404.html`
  - Shared assets: `css/shared.css`, `js/nav.js`
  - Deployment configs: `Dockerfile`, `nginx.conf`
  - Discovery & Search: `robots.txt`, `sitemap.xml`
- Confirm there are no unfinished placeholders (e.g. `TODO`, `TBD`, placeholder hrefs like `#`) in public facing templates.

## Step 2 — Cross-File Architecture & Design Consistency
- **Navbar & Navigation**:
  - Verify every page shares the same header and footer structure.
  - Check that the active page navigation link has `class="active"` and `aria-current="page"`.
  - Ensure `position: fixed` is used for `.navbar` (never `position: sticky` on flex body).
  - Ensure `body` has `padding-top: var(--nav-height)` and `html` has `scroll-padding-top: var(--nav-height)`.
- **Design Tokens**:
  - Verify light and dark mode CSS variables are defined in `:root` and `@media (prefers-color-scheme: dark)`.

## Step 3 — Link & Routing Audit
- Scan all `<a href="...">` links:
  - Ensure internal links use clean directory paths (e.g. `/price-list/`, `/contact/`) rather than `.html` files (`/price-list.html`).
  - Verify all destination folders and `index.html` targets exist.
  - Verify all image assets (`<img>` src attributes) resolve to valid URLs or local static paths.

## Step 4 — SEO & Search Metadata
- Every page must have:
  - `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
  - Unique, descriptive `<title>` (minimum 10 characters).
  - `<meta name="description" content="...">` (minimum 20 characters, except 404).
  - `<link rel="canonical" href="...">` declaring the canonical URL.
  - Open Graph tags (`og:title`, `og:description`, `og:type`).
- Verify `robots.txt` points to `sitemap.xml` and `sitemap.xml` lists all site routes.

## Step 5 — Run Automated Audit & Unit Tests
Use `execute_command` to run the built-in verification suite:
```bash
node bin/cli.js verify <targetDir>
npm test
```

## Step 6 — Present Results & Apply Fixes
- Report the status across all 6 audit areas:
  1. File integrity & structure
  2. Cross-file consistency & active states
  3. Link & routing audit (0 broken links)
  4. Build & container configuration (Dockerfile, nginx.conf)
  5. Search & metadata (SEO, canonicals, robots, sitemap)
  6. Code & style conventions & test suite passes
- If any discrepancy is found, apply targeted fixes with `apply_diff` and re-verify.
