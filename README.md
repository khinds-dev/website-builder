# Website Builder & Redesign Engine

A fast, lightweight website generator and AI-powered website redesign engine inspired by the architecture and design tokens of [`keith-website`](/Users/keithhinds/personal/personal_git/keith-website).

## ✨ Features

- **Create Websites from Scratch**: Scaffolds full, accessible, vanilla HTML5 websites with clean directory routing (`/about/`, `/contact/`, `404.html`), shared design tokens, dark mode support, and an accessible mobile hamburger drawer.
- **Analyze & Redesign Remote Sites**: Fetches any live URL (or local directory), audits typography, responsiveness, SEO, Open Graph tags, accessibility (a11y), and performance, then generates an enhanced, modern version.
- **Production Ready**: Bundles Nginx configuration (`nginx.conf`) and `Dockerfile` ready for deployment on Docker, Synology NAS, or any cloud host.
- **Integrated Bob Skills & Rules**: Includes native Bob Skills (`website-builder`, `retro`), lifecycle hooks (`inject-date`), and rules (`css-fixed-navbar.md`, `design-tokens.md`) in `.bob/`.

---

## 🚀 Quick Start (CLI)

### 1. Multi-Project Management & Handoff (Cross-Machine)
```bash
# List all registered projects
node bin/cli.js list

# Switch active workspace
node bin/cli.js use the-barbers-at-number-two

# View status, timeline history, and AI resume prompt
node bin/cli.js info

# Log milestone or task completion
node bin/cli.js log the-barbers-at-number-two --action "completed_pricing" --note "Updated prices table"
```

### 2. Create a New Website
```bash
node bin/cli.js new ./projects/my-awesome-site --name "Acme Studio" --desc "Design & Engineering"
```

### 3. Analyze a Website
```bash
node bin/cli.js analyze https://example.com
```

### 4. Enhance & Redesign a Website
```bash
node bin/cli.js enhance https://example.com ./projects/example-redesign --name "Example Reimagined"
```

---

## 🤖 Using with Bob

You can ask Bob directly in chat:
- *"Create a personal portfolio website from scratch for an electronic engineer."*
- *"Look at https://example.com and make it far better."*
- *"Audit the design and SEO of https://mysite.com and generate a modern redesign."*

---

## 📁 Project Structure & Agent Guidelines

See [`AGENTS.md`](AGENTS.md) for full project conventions, agent workflow rules, design token architecture, and retro instructions.

---

## 🧪 Testing

```bash
npm test
```
