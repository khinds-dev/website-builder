import { describe, it } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import { analyzeWebsite } from '../src/analyzer.js';
import { renderPage, generateRedesignedSite } from '../src/templates.js';
import { auditDirectory } from '../src/verifier.js';
import { loadRegistry, registerProject, switchProject, logProjectHistory, getProjectHandoff } from '../src/registry.js';
import { promises as fs } from 'fs';

describe('Website Builder & Analyzer Tests', () => {
  const sampleHtml = `<!DOCTYPE html>
<html>
<head>
  <title>Legacy Demo Page</title>
</head>
<body style="background: #fff;">
  <h1>Welcome to Legacy Demo</h1>
  <p>This is a legacy page that lacks modern design tokens and viewport meta.</p>
  <h2>Our Core Services</h2>
  <p>We provide ultra reliable systems and tools.</p>
  <img src="logo.png">
</body>
</html>`;

  it('should accurately analyze HTML issues and metadata', () => {
    const analysis = analyzeWebsite(sampleHtml, 'https://example.com/test');
    assert.strictEqual(analysis.metadata.title, 'Legacy Demo Page');
    assert.strictEqual(analysis.metadata.hasViewport, false);
    assert.strictEqual(analysis.structure.headings.h1[0], 'Welcome to Legacy Demo');
    assert.strictEqual(analysis.structure.missingAltCount, 1);
    
    // Check detected issues
    const issueCategories = analysis.issues.map(i => i.category);
    assert.ok(issueCategories.includes('Responsive'));
    assert.ok(issueCategories.includes('Accessibility'));
  });

  it('should render clean semantic page HTML with design tokens', () => {
    const pageHtml = renderPage({
      title: 'Modern Portfolio',
      siteName: 'Keith Dev',
      content: '<p>Hello world</p>'
    });
    assert.ok(pageHtml.includes('<!DOCTYPE html>'));
    assert.ok(pageHtml.includes('class="navbar"'));
    assert.ok(pageHtml.includes('css/shared.css'));
    assert.ok(pageHtml.includes('js/nav.js'));
  });

  it('should produce an enhanced redesign from analysis', () => {
    const analysis = analyzeWebsite(sampleHtml, 'https://example.com/test');
    const redesigned = generateRedesignedSite(analysis, { siteName: 'Legacy Demo Reimagined' });
    assert.ok(redesigned.includes('Legacy Demo Reimagined'));
    assert.ok(redesigned.includes('class="card-grid"'));
    assert.ok(redesigned.includes('class="hero"'));
  });

  it('should run auditDirectory and verify the showcase website passes all checks', async () => {
    const showcaseDir = path.resolve('./showcase/the-barbers-at-number-two');
    const report = await auditDirectory(showcaseDir);
    
    assert.strictEqual(report.status, 'PASSED');
    assert.strictEqual(report.totalIssues, 0);
    assert.strictEqual(report.totalPages, 8);
    assert.ok(report.cssRulesPassed.length >= 3);
    assert.strictEqual(report.metaPassed.length, 2);
  });

  it('should manage multi-project registry, history logs, and handoff state', async () => {
    const testRegPath = path.resolve('./test/test-registry.json');
    try {
      await fs.unlink(testRegPath).catch(() => {});
      
      // 1. Initial register
      const p1 = await registerProject('alpha-site', {
        name: 'Alpha Site',
        summary: 'First alpha project'
      }, testRegPath);
      assert.strictEqual(p1.slug, 'alpha-site');
      assert.strictEqual(p1.status, 'in_progress');

      // 2. Register second project
      const p2 = await registerProject('beta-site', {
        name: 'Beta Site',
        summary: 'Second beta project'
      }, testRegPath);
      assert.strictEqual(p2.slug, 'beta-site');

      // 3. Switch project
      await switchProject('alpha-site', testRegPath);
      const reg = await loadRegistry(testRegPath);
      assert.strictEqual(reg.activeProject, 'alpha-site');

      // 4. Log history
      await logProjectHistory('alpha-site', {
        action: 'added_contact_page',
        note: 'Added new contact form'
      }, testRegPath);

      // 5. Get handoff
      const handoff = await getProjectHandoff('alpha-site', testRegPath);
      assert.strictEqual(handoff.project.name, 'Alpha Site');
      assert.strictEqual(handoff.totalHistoryEntries, 1);
      assert.ok(handoff.quickResumePrompt.includes('Alpha Site'));
    } finally {
      await fs.unlink(testRegPath).catch(() => {});
    }
  });
});
