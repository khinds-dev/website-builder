# External Link and Contact Data Preservation

When analyzing, redesigning, or creating showcase iterations of existing websites, never modify or synthesize external links, social media handles, or contact information.

## Guidelines
- **Verbatim External URLs**: Social media links (`facebook.com`, `instagram.com`, `twitter.com`/`x.com`, `linkedin.com`, `youtube.com`, `tiktok.com`, `chat.whatsapp.com`), external booking platforms, and third-party services MUST retain their exact original URLs and query parameters.
- **No Synthetic Account Names**: Never invent, alter, or "rebrand" social media slugs to match a test folder name, demonstration alias, or modified site title. If the original account is `@thebarbersatnumberone`, keep it exactly as `@thebarbersatnumberone`.
- **Authentic Contact Info**: Phone numbers, email addresses, WhatsApp invite links, and physical postal addresses must remain identical to the source website so that the redesign works as an authentic, production-grade drop-in replacement.
- **Relative Internal Links vs Absolute External Links**:
  - Internal page routes must be relative clean directory paths (e.g. `/about/`, `/price-list/`, `/contact/`).
  - External links must always have `target="_blank"` and `rel="noopener noreferrer"`.

## Examples
Good:
```html
<a href="https://www.facebook.com/thebarbersatnumberone/" target="_blank" rel="noopener noreferrer">Facebook</a>
<a href="https://chat.whatsapp.com/HwWr54WxRVL1imflFNINXU" target="_blank" rel="noopener noreferrer">WhatsApp</a>
```

Avoid:
```html
<!-- INCORRECT: Guessing or modifying the social slug to match a showcase folder name -->
<a href="https://www.facebook.com/thebarbersatnumbertwo/" target="_blank" rel="noopener noreferrer">Facebook</a>
```
