# Rule: Fixed Navbar — CSS Implementation

## Core constraint

`body` on websites built with this generator uses `display: flex; flex-direction: column`.

**`position: sticky` does not work on a direct child of a flex container.** The sticky element's scroll container must be an ancestor that itself scrolls — but with a flex body, scrolling happens on the `<html>`/viewport, not on `body`. The sticky constraint is never satisfied, so the bar scrolls away with the page.

**Always use `position: fixed` for the navbar, never `position: sticky`.**

## What a correct fixed-navbar implementation requires

All five of these must be present together — missing any one causes a visible layout bug:

| Property | Where | Why |
|---|---|---|
| `position: fixed; top: 0; left: 0; right: 0` | `.navbar` | Pins the bar to the viewport |
| `z-index: 1000` | `.navbar` | Keeps it above all page content stacking contexts |
| `padding-top: var(--nav-height)` | `body` | Prevents page content loading hidden under the fixed bar |
| `scroll-padding-top: var(--nav-height)` | `html` | Prevents anchor-jump targets (`#id`) landing behind the bar |
| `position: fixed; top: var(--nav-height); max-height: calc(100vh - var(--nav-height)); overflow-y: auto` | `.nav-links` (mobile `@media`) | Mobile dropdown must also be fixed, not absolute, so it tracks the fixed bar |

## Per-page `.navbar` override caution

When adjusting `.navbar { padding: ... }` at breakpoints:
The padding shorthand **must use `0` for top and bottom**:

```css
/* ✅ correct */
.navbar { padding: 0 1.25rem; }

/* ❌ wrong — adds vertical padding, fighting the fixed height */
.navbar { padding: 0.75rem 1.25rem; }
```
