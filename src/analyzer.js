/**
 * Website Fetcher & Analyzer
 * Fetches HTML from remote URLs or local directories and analyzes structure, SEO, design issues, and content.
 */

import { promises as fs } from 'fs';
import path from 'path';

/**
 * Fetch HTML content from either a remote URL or a local file path
 * @param {string} source - URL or local file/dir path
 * @returns {Promise<{ html: string, url: string, isLocal: boolean }>}
 */
export async function fetchSource(source) {
  const isUrl = /^https?:\/\//i.test(source);
  
  if (isUrl) {
    const res = await fetch(source, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 BobWebsiteAnalyzer/1.0'
      }
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch URL ${source}: ${res.status} ${res.statusText}`);
    }
    const html = await res.text();
    return { html, url: source, isLocal: false };
  } else {
    // Local file path
    const resolvedPath = path.resolve(source);
    const stats = await fs.stat(resolvedPath);
    let filePath = resolvedPath;
    if (stats.isDirectory()) {
      filePath = path.join(resolvedPath, 'index.html');
    }
    const html = await fs.readFile(filePath, 'utf8');
    return { html, url: filePath, isLocal: true };
  }
}

/**
 * Helper to extract tag text or attribute via regex
 */
function extractMatches(html, regex) {
  const matches = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    matches.push(match[1] ? match[1].trim() : match[0].trim());
  }
  return matches;
}

/**
 * Analyzes HTML content for design, typography, SEO, accessibility, and structure
 * @param {string} html 
 * @param {string} sourceUrl
 */
export function analyzeWebsite(html, sourceUrl = '') {
  // Title
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  // Meta description
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
                    html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  const description = descMatch ? descMatch[1].trim() : '';

  // Viewport
  const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html);

  // Open Graph
  const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i);
  const ogDescMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i);
  const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i);

  // Headings
  const h1s = extractMatches(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi).map(s => s.replace(/<[^>]+>/g, '').trim());
  const h2s = extractMatches(html, /<h2[^>]*>([\s\S]*?)<\/h2>/gi).map(s => s.replace(/<[^>]+>/g, '').trim());
  const h3s = extractMatches(html, /<h3[^>]*>([\s\S]*?)<\/h3>/gi).map(s => s.replace(/<[^>]+>/g, '').trim());

  // Links & Navigation
  const navMatch = html.match(/<nav[^>]*>([\s\S]*?)<\/nav>/i);
  const navLinks = [];
  if (navMatch) {
    const linkRegex = /<a[^>]+href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let lMatch;
    while ((lMatch = linkRegex.exec(navMatch[1])) !== null) {
      navLinks.push({ href: lMatch[1], label: lMatch[2].replace(/<[^>]+>/g, '').trim() });
    }
  }

  // Images and missing alt tags
  const images = [];
  const imgRegex = /<img\b([^>]*)>/gi;
  let imgMatch;
  let missingAltCount = 0;
  while ((imgMatch = imgRegex.exec(html)) !== null) {
    const imgAttrs = imgMatch[1];
    const src = (imgAttrs.match(/src=["']([^"']*)["']/i) || [])[1] || '';
    const altMatch = imgAttrs.match(/alt=["']([^"']*)["']/i);
    const alt = altMatch ? altMatch[1] : null;
    if (alt === null || alt.trim() === '') {
      missingAltCount++;
    }
    images.push({ src, alt });
  }

  // Styles & CSS frameworks detection
  const usesTailwind = /tailwindcss|tailwind/i.test(html);
  const usesBootstrap = /bootstrap/i.test(html);
  const hasInlineStyles = (html.match(/style=["'][^"']+["']/gi) || []).length;
  const stylesheetHrefs = extractMatches(html, /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']*)["']/gi);

  // Text content extraction / Paragraphs
  const paragraphs = extractMatches(html, /<p[^>]*>([\s\S]*?)<\/p>/gi)
    .map(p => p.replace(/<[^>]+>/g, '').trim())
    .filter(p => p.length > 0);

  // Issues and Improvement Opportunities
  const issues = [];
  const suggestions = [];

  if (!title) {
    issues.push({ category: 'SEO', severity: 'high', message: 'Missing <title> tag.' });
  } else if (title.length < 15 || title.length > 70) {
    issues.push({ category: 'SEO', severity: 'medium', message: `Title length (${title.length} chars) is suboptimal (recommended: 30-60 chars).` });
  }

  if (!description) {
    issues.push({ category: 'SEO', severity: 'high', message: 'Missing meta description.' });
  }

  if (!hasViewport) {
    issues.push({ category: 'Responsive', severity: 'critical', message: 'Missing responsive viewport meta tag.' });
  }

  if (!ogTitleMatch || !ogDescMatch) {
    issues.push({ category: 'Social / SEO', severity: 'medium', message: 'Missing Open Graph (og:title, og:description) social preview tags.' });
  }

  if (h1s.length === 0) {
    issues.push({ category: 'Typography', severity: 'high', message: 'Missing <h1> main headline.' });
  } else if (h1s.length > 1) {
    issues.push({ category: 'Typography', severity: 'medium', message: `Multiple <h1> tags found (${h1s.length}). Prefer a single <h1> for the primary topic.` });
  }

  if (missingAltCount > 0) {
    issues.push({ category: 'Accessibility', severity: 'medium', message: `${missingAltCount} image(s) missing alt attributes.` });
  }

  if (hasInlineStyles > 5) {
    suggestions.push({ category: 'Architecture', message: `Found ${hasInlineStyles} inline style attributes. Migrate to tokenized design classes (shared.css).` });
  }

  if (usesBootstrap || usesTailwind) {
    suggestions.push({ category: 'Performance', message: 'Heavy external CSS detected. Can be replaced with vanilla custom-property design tokens for lightning performance.' });
  }

  return {
    sourceUrl,
    metadata: {
      title,
      description,
      hasViewport,
      openGraph: {
        title: ogTitleMatch ? ogTitleMatch[1] : null,
        description: ogDescMatch ? ogDescMatch[1] : null,
        image: ogImageMatch ? ogImageMatch[1] : null,
      }
    },
    structure: {
      headings: { h1: h1s, h2: h2s, h3: h3s },
      navLinks,
      imageCount: images.length,
      missingAltCount,
      paragraphCount: paragraphs.length
    },
    contentSummary: {
      paragraphs: paragraphs.slice(0, 10),
      headings: [...h1s, ...h2s].slice(0, 8)
    },
    techAudit: {
      hasInlineStyles,
      stylesheetHrefs,
      detectedFrameworks: [
        usesTailwind ? 'Tailwind' : null,
        usesBootstrap ? 'Bootstrap' : null
      ].filter(Boolean)
    },
    issues,
    suggestions
  };
}
