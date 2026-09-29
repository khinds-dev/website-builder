/**
 * Website Builder Core Pipeline
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchSource, analyzeWebsite } from './analyzer.js';
import { renderPage, generateRedesignedSite } from './templates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ASSETS_DIR = path.resolve(__dirname, '../templates/assets');

/**
 * Creates a brand new website from scratch
 * @param {string} targetDir
 * @param {object} options
 */
export async function createWebsite(targetDir, options = {}) {
  const siteName = options.siteName || 'New Website';
  const description = options.description || 'A fast, modern static website.';
  
  const resolvedTarget = path.resolve(targetDir);
  await fs.mkdir(resolvedTarget, { recursive: true });

  // 1. Copy shared CSS, JS, Nginx, Dockerfile
  await copySharedAssets(resolvedTarget);

  // 2. Build index.html
  const homeContent = `    <section class="hero">
      <h1>${siteName}</h1>
      <p class="lead">${description}</p>
      <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem;">
        <a href="/about/" class="btn">Learn More</a>
        <a href="/contact/" class="btn btn-secondary">Contact Us</a>
      </div>
    </section>

    <section>
      <h2>What We Do</h2>
      <div class="card-grid">
        <div class="card">
          <h3>Fast & Lightweight</h3>
          <p>Zero heavy frameworks. Pure vanilla HTML5, CSS custom properties, and instant load times.</p>
        </div>
        <div class="card">
          <h3>Accessible & Responsive</h3>
          <p>Carefully crafted typography, color contrast, keyboard navigation, and mobile drawer support.</p>
        </div>
        <div class="card">
          <h3>Production Ready</h3>
          <p>Includes Nginx configuration, Docker packaging, and clean URL routing out of the box.</p>
        </div>
      </div>
    </section>`;

  const homeHtml = renderPage({
    title: `${siteName} — Home`,
    description,
    siteName,
    activeNav: 'home',
    content: homeContent
  });
  await fs.writeFile(path.join(resolvedTarget, 'index.html'), homeHtml, 'utf8');

  // 3. Build /about/index.html
  const aboutDir = path.join(resolvedTarget, 'about');
  await fs.mkdir(aboutDir, { recursive: true });
  const aboutContent = `    <section>
      <h1>About Us</h1>
      <p class="lead">Building clean, robust, and accessible digital solutions.</p>
      <p>We believe in high-performance web engineering, modern standards, and resilient architectures.</p>
    </section>`;
  const aboutHtml = renderPage({
    title: `About — ${siteName}`,
    description: `About ${siteName}`,
    siteName,
    activeNav: 'about',
    content: aboutContent
  });
  await fs.writeFile(path.join(aboutDir, 'index.html'), aboutHtml, 'utf8');

  // 4. Build /contact/index.html
  const contactDir = path.join(resolvedTarget, 'contact');
  await fs.mkdir(contactDir, { recursive: true });
  const contactContent = `    <section>
      <h1>Contact Us</h1>
      <p class="lead">Have a question or want to work together? Send us a message.</p>
      <form style="max-width: 500px; margin-top: 1.5rem;" onsubmit="event.preventDefault(); alert('Message sent!');">
        <div style="margin-bottom: 1rem;">
          <label style="display:block; margin-bottom: 0.35rem; font-weight: 500;" for="name">Name</label>
          <input id="name" type="text" required style="width: 100%; padding: 0.5rem; border: 1px solid var(--color-border); border-radius: var(--radius); background: var(--color-surface); color: var(--color-text);">
        </div>
        <div style="margin-bottom: 1rem;">
          <label style="display:block; margin-bottom: 0.35rem; font-weight: 500;" for="email">Email</label>
          <input id="email" type="email" required style="width: 100%; padding: 0.5rem; border: 1px solid var(--color-border); border-radius: var(--radius); background: var(--color-surface); color: var(--color-text);">
        </div>
        <div style="margin-bottom: 1.25rem;">
          <label style="display:block; margin-bottom: 0.35rem; font-weight: 500;" for="message">Message</label>
          <textarea id="message" rows="4" required style="width: 100%; padding: 0.5rem; border: 1px solid var(--color-border); border-radius: var(--radius); background: var(--color-surface); color: var(--color-text);"></textarea>
        </div>
        <button type="submit" class="btn">Send Message</button>
      </form>
    </section>`;
  const contactHtml = renderPage({
    title: `Contact — ${siteName}`,
    description: `Contact ${siteName}`,
    siteName,
    activeNav: 'contact',
    content: contactContent
  });
  await fs.writeFile(path.join(contactDir, 'index.html'), contactHtml, 'utf8');

  // 5. 404.html
  const errorHtml = renderPage({
    title: `404 — Page Not Found`,
    description: 'The requested page could not be found.',
    siteName,
    activeNav: '',
    content: `    <section style="text-align: center; padding: 4rem 1rem;">
      <h1 style="font-size: 3.5rem; color: var(--color-accent); margin-bottom: 0.5rem;">404</h1>
      <h2>Page Not Found</h2>
      <p style="color: var(--color-muted); margin-top: 0.5rem;">The page you are looking for doesn't exist or has been moved.</p>
      <div style="margin-top: 1.5rem;">
        <a href="/" class="btn">Back to Home</a>
      </div>
    </section>`
  });
  await fs.writeFile(path.join(resolvedTarget, '404.html'), errorHtml, 'utf8');

  // 6. robots.txt & sitemap.xml
  await fs.writeFile(path.join(resolvedTarget, 'robots.txt'), 'User-agent: *\nAllow: /\n', 'utf8');

  return { success: true, targetDir: resolvedTarget };
}

/**
 * Enhances/redesigns a website from a URL or source folder
 * @param {string} source - URL or directory path
 * @param {string} outputDir - Directory to write enhanced site
 * @param {object} options
 */
export async function enhanceWebsite(source, outputDir, options = {}) {
  const { html, url } = await fetchSource(source);
  const analysis = analyzeWebsite(html, url);

  const resolvedOutput = path.resolve(outputDir);
  await fs.mkdir(resolvedOutput, { recursive: true });

  // 1. Copy shared assets
  await copySharedAssets(resolvedOutput);

  // 2. Generate redesigned homepage
  const enhancedHtml = generateRedesignedSite(analysis, options);
  await fs.writeFile(path.join(resolvedOutput, 'index.html'), enhancedHtml, 'utf8');

  // 3. 404.html
  const errorHtml = renderPage({
    title: `404 — Page Not Found`,
    description: 'The requested page could not be found.',
    siteName: options.siteName || 'Modern Site',
    activeNav: '',
    content: `    <section style="text-align: center; padding: 4rem 1rem;">
      <h1 style="font-size: 3.5rem; color: var(--color-accent); margin-bottom: 0.5rem;">404</h1>
      <h2>Page Not Found</h2>
      <div style="margin-top: 1.5rem;"><a href="/" class="btn">Back to Home</a></div>
    </section>`
  });
  await fs.writeFile(path.join(resolvedOutput, '404.html'), errorHtml, 'utf8');

  return {
    success: true,
    source,
    analysis,
    outputDir: resolvedOutput
  };
}

async function copySharedAssets(targetDir) {
  // CSS
  const cssDir = path.join(targetDir, 'css');
  await fs.mkdir(cssDir, { recursive: true });
  await fs.copyFile(path.join(ASSETS_DIR, 'css/shared.css'), path.join(cssDir, 'shared.css'));

  // JS
  const jsDir = path.join(targetDir, 'js');
  await fs.mkdir(jsDir, { recursive: true });
  await fs.copyFile(path.join(ASSETS_DIR, 'js/nav.js'), path.join(jsDir, 'nav.js'));

  // Nginx & Dockerfile
  await fs.copyFile(path.join(ASSETS_DIR, 'nginx.conf'), path.join(targetDir, 'nginx.conf'));
  await fs.copyFile(path.join(ASSETS_DIR, 'Dockerfile'), path.join(targetDir, 'Dockerfile'));
}
