# Rule: Google Maps Embed — Keyless Format

## Core Constraint

Only one embed format works without a caller-provided API key: the `?q=` query format.
**Always use this.** Never use the Maps Embed API `v1/place?key=` format or manually constructed `pb=` encoded URLs.

## The Correct Format

```html
<iframe
  title="[Business name] location map"
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"
  src="https://www.google.com/maps/embed?q=172+Fair+Oak+Rd,+Eastleigh+SO50+8HA&output=embed"
  allowfullscreen>
</iframe>
```

- `q=` accepts a plain address string (URL-encoded spaces as `+`)
- `output=embed` is required
- No API key needed — Google serves this with its own internal key
- Works on any static site, including Cloudflare Pages, Netlify, GitHub Pages

## What to Avoid

```html
<!-- ❌ WRONG — requires a valid caller API key, will show "API key invalid" error -->
<iframe src="https://www.google.com/maps/embed/v1/place?key=AIza...&q=..."></iframe>

<!-- ❌ WRONG — pb= parameters are opaque, machine-generated, and will produce wrong
     locations or errors if constructed by hand -->
<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!..."></iframe>
```

## Getting a Real pb= URL (when needed)

If a client specifically needs a `pb=` embed (e.g. a satellite view or custom zoom):
1. Go to [google.com/maps](https://www.google.com/maps) in a browser
2. Navigate to the address
3. Click **Share** → **Embed a map**
4. Copy the iframe `src` verbatim — do not construct it by hand
