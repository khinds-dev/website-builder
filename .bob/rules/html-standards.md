# HTML & Static Site Standards

Guidelines for robust HTML parsing, asset scaffolding, and static website verification.

## Guidelines

### 1. Robust HTML Attribute Extraction
When parsing HTML attributes via regex in Node.js (e.g. meta descriptions, titles, links), never use `["']` across both open and close boundaries interchangeably, as text with inner apostrophes (`'`) inside double quotes will prematurely terminate the match.
- Good: `tag.match(/content="([^"]*)"/i) || tag.match(/content='([^']*)'/i)`
- Avoid: `tag.match(/content=["']([^"']*)["']/i)`

### 2. Mandatory SEO & Search Discovery Files
Every generated or redesigned static website must include at the root:
- `robots.txt` with `User-agent: *`, `Allow: /`, and `Sitemap: <canonical-domain>/sitemap.xml`
- `sitemap.xml` listing all clean directory routes with priorities and change frequencies

### 3. Verification Before Completion
Before delivering or committing any website:
- Run `node bin/cli.js verify <targetDir>` or use the `verify-website` skill to ensure 0 broken links, 100% heading hierarchy compliance, and valid responsive CSS.
