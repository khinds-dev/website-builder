# AGENTS.md

This file provides guidance to agents when working with code in this repository (`website-builder`).

---

## 🎯 Project Overview & Purpose

`website-builder` is a lightweight, zero-framework website generator and AI redesign toolkit. It enables:
1. **Creating new websites from scratch** with clean directory-based routing (`/about/index.html`, etc.), vanilla HTML5/CSS/JS, modern CSS custom properties (design tokens), accessible mobile navigation, and Docker/Nginx configs.
2. **Auditing and redesigning existing websites** by fetching remote URLs or local directories, evaluating SEO, typography, accessibility, and responsiveness, and producing an enhanced, ultra-fast static site.

---

## 🏗️ Architecture & Philosophy

- **Zero Heavy Frameworks**: Prefer semantic HTML5, modern CSS custom properties (`var(--color-...)`), and lightweight vanilla JavaScript. Do not introduce heavy frontend frameworks (React, Vue, Astro, Tailwind, Bootstrap) unless explicitly requested.
- **Routing**: Clean URLs via subdirectories containing `index.html` (e.g. `about/index.html` served at `/about/`). Never hardcode `.html` extensions in navigation links.
- **Shared Design Tokens**: All generated sites utilize `css/shared.css` with CSS variables for light & dark modes, layout max-width, spacing, and typography.
- **Fixed Navbar Standard**: Always adhere to `position: fixed` for `.navbar` with `padding-top: var(--nav-height)` on `body` and `scroll-padding-top: var(--nav-height)` on `html`. Never use `position: sticky` on a flex `body`.

---

## 🛠️ CLI & Toolkit Commands

- **Run Tests**:
  ```bash
  npm test
  # or: node --test test/*.test.js
  ```
- **Create New Website**:
  ```bash
  node bin/cli.js new ./sites/<site-dir> --name "<Site Name>" --desc "<Description>"
  ```
- **Analyze Website**:
  ```bash
  node bin/cli.js analyze <URL or local path>
  ```
- **Enhance & Redesign Website**:
  ```bash
  node bin/cli.js enhance <URL or local path> ./sites/<out-dir> --name "<Site Name>"
  ```

---

## 📁 Repository Structure

```
.
├── .bob/
│   ├── hooks/
│   │   └── inject-date.mjs     — UserPromptSubmit hook for date/time injection
│   ├── rules/
│   │   ├── css-fixed-navbar.md — Critical CSS rules for fixed navbar & flex body
│   │   └── design-tokens.md    — Design token standards & theme conventions
│   ├── settings.json           — Bob settings and hook registrations
│   └── skills/
│       ├── retro/SKILL.md      — Session retrospective and lesson capture
│       └── website-builder/SKILL.md — Workflow instructions for site generation & redesign
├── bin/
│   └── cli.js                  — Standalone CLI executable
├── src/
│   ├── analyzer.js             — Remote fetcher, SEO, accessibility & tech auditor
│   ├── builder.js              — Site builder & redesign generator
│   ├── index.js                — Module exports
│   └── templates.js            — Layout and component rendering helpers
├── templates/
│   └── assets/
│       ├── css/shared.css      — Shared design tokens, reset, navbar, card grid
│       ├── js/nav.js           — Accessible hamburger toggle with ESC & outside-click support
│       ├── Dockerfile          — Nginx Alpine production image
│       └── nginx.conf          — Nginx clean URL routing & static caching
├── test/
│   └── builder.test.js         — Unit test suite
├── package.json
└── README.md
```

---

## 🤖 Bob Skills & Capabilities

- **`website-builder`**: Auto-activates when creating websites from scratch or inspecting/redesigning URLs.
- **`retro`**: Run when the user asks for `/retro`, "retrospective", or "what did we learn" to analyze session effectiveness and capture improvements into rules, skills, or `AGENTS.md`.

---

## 📋 Coding Conventions & Guidelines

1. **Minimal, surgical changes**: Follow minimal diff discipline. Avoid unnecessary refactors.
2. **Accessible by default**: Ensure all forms have labels, images have meaningful `alt` attributes, interactive elements support keyboard navigation, and contrast meets WCAG AA standards.
3. **Always verify with tests**: Run `npm test` after modifying core builder or analyzer logic before marking work complete.
