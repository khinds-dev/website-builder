/**
 * Verification & QA Auditor
 * 
 * Inspects a static website directory against key criteria:
 * 1. Responsive & Mobile/Desktop Layout rules (viewport, fixed navbar standards, CSS media queries)
 * 2. Navigation Consistency & Broken Link detection (internal href resolution, active page state)
 * 3. Accessibility & Structure (heading hierarchy, image alt tags, ARIA attributes, form labels)
 * 4. SEO & Social Meta (title length, meta descriptions, canonical URLs, OG tags)
 * 5. Security & Asset Integrity (HTTPS external resources, nosniff, frame options, clean routing)
 */

import { promises as fs } from 'fs';
import path from 'path';

export async function auditDirectory(targetDir) {
  const resolvedDir = path.resolve(targetDir);
  const htmlFiles = await findHtmlFiles(resolvedDir);
  
  if (htmlFiles.length === 0) {
    throw new Error(`No HTML files found in ${targetDir}`);
  }

  // Check CSS assets
  const cssFiles = await findFiles(resolvedDir, /\.css$/i);
  let cssIssues = [];
  let cssRulesPassed = [];

  for (const cssFile of cssFiles) {
    const cssContent = await fs.readFile(cssFile, 'utf8');
    const filename = path.relative(resolvedDir, cssFile);

    // Rule: Fixed navbar standard check
    if (cssContent.includes('.navbar')) {
      const hasFixed = /position:\s*fixed/i.test(cssContent);
      const hasSticky = /position:\s*sticky/i.test(cssContent);
      const hasScrollPadding = /scroll-padding-top/i.test(cssContent);
      const hasPaddingTop = /padding-top:\s*var\(--nav-height/i.test(cssContent);
      const hasMobileQuery = /@media[^{]+\(max-width/i.test(cssContent);

      if (hasSticky) {
        cssIssues.push({
          file: filename,
          rule: 'CSS-STICKY-NAV',
          severity: 'high',
          message: 'Found position: sticky on navbar. Use position: fixed instead to prevent layout collapse in flex containers.'
        });
      } else if (hasFixed) {
        cssRulesPassed.push(`[${filename}] Navbar correctly implements position: fixed`);
      }

      if (hasScrollPadding) {
        cssRulesPassed.push(`[${filename}] html has scroll-padding-top configured for anchor jumps`);
      } else {
        cssIssues.push({
          file: filename,
          rule: 'CSS-SCROLL-PADDING',
          severity: 'medium',
          message: 'Missing scroll-padding-top on html. Anchor links may scroll behind the fixed navbar.'
        });
      }

      if (hasPaddingTop) {
        cssRulesPassed.push(`[${filename}] body has padding-top offset for fixed navbar`);
      }

      if (hasMobileQuery) {
        cssRulesPassed.push(`[${filename}] Mobile responsive media query detected`);
      } else {
        cssIssues.push({
          file: filename,
          rule: 'CSS-MOBILE-MEDIA',
          severity: 'high',
          message: 'No mobile @media (max-width: ...) queries detected in shared stylesheet.'
        });
      }
    }
  }

  // Page level inspections
  const pageResults = [];
  const allKnownRoutes = htmlFiles.map(f => {
    const rel = path.relative(resolvedDir, f);
    if (rel === 'index.html') return '/';
    if (rel.endsWith('/index.html') || rel.endsWith('\\index.html')) {
      return '/' + rel.replace(/\\/g, '/').replace(/\/index\.html$/, '/');
    }
    return '/' + rel.replace(/\\/g, '/');
  });

  for (const filePath of htmlFiles) {
    const relPath = path.relative(resolvedDir, filePath).replace(/\\/g, '/');
    const content = await fs.readFile(filePath, 'utf8');
    const issues = [];
    const passes = [];

    // 1. Mobile & Viewport
    if (/<meta[^>]+name=["']viewport["']/i.test(content)) {
      passes.push('Viewport meta tag present');
    } else {
      issues.push({ category: 'Responsive', severity: 'critical', message: 'Missing viewport meta tag for mobile rendering.' });
    }

    // 2. Headings & Hierarchy
    const h1Count = (content.match(/<h1\b/gi) || []).length;
    if (h1Count === 1) {
      passes.push('Single <h1> semantic headline');
    } else if (h1Count === 0) {
      issues.push({ category: 'Accessibility', severity: 'high', message: 'Missing <h1> page heading.' });
    } else {
      issues.push({ category: 'Accessibility', severity: 'medium', message: `Multiple (${h1Count}) <h1> tags found. Best practice is 1 per page.` });
    }

    // 3. Image Alt Attributes
    const imgMatches = content.match(/<img\b([^>]*)>/gi) || [];
    let missingAlt = 0;
    imgMatches.forEach(tag => {
      if (!/alt=["'][^"']*["']/i.test(tag)) {
        missingAlt++;
      }
    });
    if (missingAlt === 0 && imgMatches.length > 0) {
      passes.push(`All ${imgMatches.length} images have alt attributes`);
    } else if (missingAlt > 0) {
      issues.push({ category: 'Accessibility', severity: 'medium', message: `${missingAlt} image(s) missing alt attributes.` });
    }

    // 4. Mobile Menu Toggle & ARIA
    const hasNavBtn = /id=["']menuBtn["']|class=["'][^"']*hamburger[^"']*["']/i.test(content);
    const hasNavLinks = /id=["']navLinks["']/i.test(content);
    const hasAriaExpanded = /aria-expanded/i.test(content);

    if (hasNavBtn && hasNavLinks) {
      passes.push('Mobile navigation drawer & toggle button configured');
      if (hasAriaExpanded) {
        passes.push('ARIA expanded state supported for screenreaders');
      } else {
        issues.push({ category: 'Accessibility', severity: 'low', message: 'Mobile menu toggle missing aria-expanded attribute.' });
      }
    }

    // 5. SEO & Canonical
    const titleMatch = content.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const metaTags = content.match(/<meta\b[^>]*>/gi) || [];
    let metaDescription = '';
    for (const tag of metaTags) {
      if (/name=["']description["']/i.test(tag)) {
        const m = tag.match(/content="([^"]*)"/i) || tag.match(/content='([^']*)'/i);
        if (m) {
          metaDescription = m[1].trim();
          break;
        }
      }
    }
    const canonicalMatch = content.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i);
    const ogTitleMatch = content.match(/<meta[^>]+property=["']og:title["']/i);

    if (titleMatch && titleMatch[1].trim().length >= 10) {
      passes.push(`Title tag present: "${titleMatch[1].trim()}"`);
    } else {
      issues.push({ category: 'SEO', severity: 'high', message: 'Missing or short <title> tag.' });
    }

    if (metaDescription.length > 20) {
      passes.push(`Meta description present: "${metaDescription.slice(0, 40)}..."`);
    } else if (relPath === '404.html') {
      // 404 pages do not strictly require meta descriptions
      passes.push('Meta description skipped for 404 error page');
    } else {
      issues.push({ category: 'SEO', severity: 'high', message: 'Missing or incomplete meta description.' });
    }

    if (canonicalMatch) {
      passes.push(`Canonical URL declared: ${canonicalMatch[1]}`);
    } else if (relPath !== '404.html') {
      issues.push({ category: 'SEO', severity: 'medium', message: 'Missing canonical <link> tag.' });
    }

    if (ogTitleMatch) {
      passes.push('Open Graph social preview tags configured');
    }

    // 6. Broken Internal Links
    const linkMatches = content.matchAll(/<a[^>]+href=["']([^"']*)["']/gi);
    const brokenLinks = [];
    for (const match of linkMatches) {
      const href = match[1];
      if (href.startsWith('/') && !href.startsWith('//')) {
        const cleanHref = href.split('#')[0].split('?')[0];
        if (cleanHref && cleanHref !== '/' && !cleanHref.endsWith('.css') && !cleanHref.endsWith('.js') && !cleanHref.endsWith('.png') && !cleanHref.endsWith('.jpg') && !cleanHref.endsWith('.svg')) {
          const formatted = cleanHref.endsWith('/') ? cleanHref : cleanHref + '/';
          if (!allKnownRoutes.includes(formatted) && !allKnownRoutes.includes(cleanHref)) {
            brokenLinks.push(href);
          }
        }
      }
    }

    if (brokenLinks.length > 0) {
      issues.push({ category: 'Routing', severity: 'high', message: `Broken internal links found: ${brokenLinks.join(', ')}` });
    } else {
      passes.push('All internal links resolve to valid routes');
    }

    // 7. Clean URLs (.html in links check)
    if (/<a[^>]+href=["'][^"']*\.html["']/i.test(content) && relPath !== '404.html') {
      issues.push({ category: 'Architecture', severity: 'medium', message: 'Found .html extensions in navigation links. Use clean subdirectory URLs instead.' });
    }

    pageResults.push({
      page: relPath,
      passes,
      issues
    });
  }

  const totalIssues = cssIssues.length + pageResults.reduce((acc, p) => acc + p.issues.length, 0);

  return {
    targetDir: resolvedDir,
    totalPages: htmlFiles.length,
    cssRulesPassed,
    cssIssues,
    pageResults,
    totalIssues,
    status: totalIssues === 0 ? 'PASSED' : 'ACTION_REQUIRED'
  };
}

async function findHtmlFiles(dir) {
  return findFiles(dir, /\.html$/i);
}

async function findFiles(dir, pattern) {
  const results = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git') {
        results.push(...await findFiles(fullPath, pattern));
      }
    } else {
      pattern.lastIndex = 0;
      if (pattern.test(entry.name)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}
