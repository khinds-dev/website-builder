/**
 * Page & Layout Templates
 * Generates clean, accessible vanilla HTML pages matching the Keith-Website design system.
 */

export function renderPage({
  title,
  description = '',
  canonicalUrl = '',
  siteName = 'My Website',
  activeNav = 'home',
  navLinks = [
    { href: '/', label: 'Home', id: 'home' },
    { href: '/about/', label: 'About', id: 'about' },
    { href: '/work/', label: 'Work', id: 'work' },
    { href: '/contact/', label: 'Contact', id: 'contact' }
  ],
  content = '',
  cssPath = '/css/shared.css',
  jsPath = '/js/nav.js'
}) {
  const navHtml = navLinks
    .map(link => {
      const isActive = link.id === activeNav || link.href === activeNav;
      return `      <li><a href="${link.href}"${isActive ? ' class="active" aria-current="page"' : ''}>${link.label}</a></li>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  ${description ? `<meta name="description" content="${escapeHtml(description)}">` : ''}
  ${canonicalUrl ? `<link rel="canonical" href="${escapeHtml(canonicalUrl)}">` : ''}
  
  <!-- Open Graph / Social Media -->
  <meta property="og:title" content="${escapeHtml(title)}">
  ${description ? `<meta property="og:description" content="${escapeHtml(description)}">` : ''}
  <meta property="og:type" content="website">
  ${canonicalUrl ? `<meta property="og:url" content="${escapeHtml(canonicalUrl)}">` : ''}

  <!-- Stylesheet -->
  <link rel="stylesheet" href="${cssPath}">
</head>
<body>
  <!-- Header / Navigation -->
  <header>
    <nav class="navbar" aria-label="Main Navigation">
      <a href="/" class="site-name">${escapeHtml(siteName)}</a>
      <button class="hamburger" id="menuBtn" aria-label="Toggle navigation menu" aria-expanded="false">
        <svg viewBox="0 0 24 24">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      <ul class="nav-links" id="navLinks">
${navHtml}
      </ul>
    </nav>
  </header>

  <!-- Main Content -->
  <main class="container">
${content}
  </main>

  <!-- Footer -->
  <footer>
    <div class="footer-links">
      <a href="/">Home</a>
      <a href="/about/">About</a>
      <a href="/contact/">Contact</a>
    </div>
    <p>&copy; ${new Date().getFullYear()} ${escapeHtml(siteName)}. All rights reserved.</p>
  </footer>

  <script src="${jsPath}"></script>
</body>
</html>
`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generates an enhanced redesign of analyzed website content
 * @param {object} analysis - Result from analyzeWebsite
 * @param {object} options
 */
export function generateRedesignedSite(analysis, options = {}) {
  const siteName = options.siteName || analysis.metadata.title.split(/[-|–:]/)[0].trim() || 'Modern Site';
  const title = options.title || analysis.metadata.title || siteName;
  const description = options.description || analysis.metadata.description || 'Welcome to our modern, responsive website.';

  const mainH1 = analysis.structure.headings.h1[0] || siteName;
  const paragraphs = analysis.contentSummary.paragraphs;

  // Build hero section
  const leadP = paragraphs[0] || 'Clean, fast, and accessible digital experiences built with precision.';
  const restPs = paragraphs.slice(1, 4);

  // Build feature/content cards from remaining headings or topics
  const secondaryHeadings = analysis.structure.headings.h2.length > 0 
    ? analysis.structure.headings.h2 
    : ['High Performance', 'Modern Architecture', 'Accessible Design'];

  const cardsHtml = secondaryHeadings.slice(0, 6).map((h2, idx) => `
      <div class="card">
        <h3>${escapeHtml(h2)}</h3>
        <p>${escapeHtml(paragraphs[idx + 1] || 'Optimized for speed, modern typography tokens, and resilient structure.')}</p>
      </div>`).join('');

  const bodyContent = `    <section class="hero">
      <h1>${escapeHtml(mainH1)}</h1>
      <p class="lead">${escapeHtml(leadP)}</p>
      <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem;">
        <a href="/about/" class="btn">Learn More</a>
        <a href="/contact/" class="btn btn-secondary">Get in Touch</a>
      </div>
    </section>

    <section>
      <h2>Highlights & Focus</h2>
      <div class="card-grid">
${cardsHtml}
      </div>
    </section>

    ${restPs.length > 0 ? `
    <section style="margin-top: 2.5rem;">
      <h2>Overview</h2>
      ${restPs.map(p => `<p>${escapeHtml(p)}</p>`).join('\n      ')}
    </section>` : ''}`;

  return renderPage({
    title,
    description,
    siteName,
    activeNav: 'home',
    content: bodyContent
  });
}
