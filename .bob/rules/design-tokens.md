# Rule: Design Tokens & Vanilla Architecture

## Core Principles

1. **Lightweight & Dependency-Free**:
   - Avoid pulling heavy CSS libraries (Tailwind, Bootstrap, Bulma) unless explicitly instructed.
   - Use CSS custom properties (`:root { --color-bg: ...; }`) for global theme tokens.

2. **Semantic HTML Structure**:
   - Every page should include `<header>`, `<main class="container">`, and `<footer>`.
   - Exactly one `<h1>` per page representing the core subject.
   - All `<img>` tags must include explicit `alt` attributes.
   - External links should include `rel="noopener noreferrer"` where appropriate.

3. **Color Contrast & Accessibility**:
   - Primary text (`--color-text`) must have at least 4.5:1 contrast against `--color-bg`.
   - Secondary text (`--color-muted`) must meet minimum 4.5:1 against surfaces.
   - Always support `prefers-color-scheme: dark` overrides.
