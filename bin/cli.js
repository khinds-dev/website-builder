#!/usr/bin/env node

/**
 * CLI interface for website builder and enhancer
 */

import { createWebsite, enhanceWebsite, analyzeWebsite, fetchSource, auditDirectory } from '../src/index.js';

const args = process.argv.slice(2);
const command = args[0];

function printHelp() {
  console.log(`
🌐 Website Builder CLI

Usage:
  site-builder new <dir> [options]         Create a new website from scratch
  site-builder analyze <url|dir>           Analyze an existing website / page
  site-builder enhance <url|dir> <outDir>  Fetch, audit, and generate a redesigned version
  site-builder verify <dir>                Run multi-page verification & QA audit on a directory

Options:
  --name <site-name>      Name of the website
  --desc <description>    Site meta description
  --help                  Show this help message

Examples:
  site-builder new ./my-new-site --name "Acme Studio"
  site-builder analyze https://example.com
  site-builder enhance https://example.com ./redesigned-example
  site-builder verify ./showcase/the-barbers-at-number-one
`);
}

function parseFlags(rawArgs) {
  const flags = {};
  for (let i = 0; i < rawArgs.length; i++) {
    if (rawArgs[i].startsWith('--')) {
      const key = rawArgs[i].slice(2);
      const val = rawArgs[i + 1] && !rawArgs[i + 1].startsWith('--') ? rawArgs[i + 1] : true;
      flags[key] = val;
      if (val !== true) i++;
    }
  }
  return flags;
}

async function main() {
  if (!command || command === '--help' || command === 'help') {
    printHelp();
    process.exit(0);
  }

  const flags = parseFlags(args.slice(1));

  try {
    if (command === 'new') {
      const targetDir = args[1];
      if (!targetDir || targetDir.startsWith('--')) {
        console.error('Error: Please specify target directory for new site.');
        process.exit(1);
      }
      console.log(`🚀 Creating new website at ${targetDir}...`);
      const res = await createWebsite(targetDir, {
        siteName: flags.name || 'Modern Site',
        description: flags.desc || 'A clean, modern static website.'
      });
      console.log(`✅ Website successfully created at: ${res.targetDir}`);
      console.log(`   - index.html, /about, /contact, /404.html`);
      console.log(`   - css/shared.css (tokens, reset, responsive navbar)`);
      console.log(`   - js/nav.js (accessible mobile hamburger menu)`);
      console.log(`   - nginx.conf & Dockerfile ready for production deployment`);
    } else if (command === 'analyze') {
      const source = args[1];
      if (!source) {
        console.error('Error: Please specify URL or local directory to analyze.');
        process.exit(1);
      }
      console.log(`🔍 Fetching and analyzing ${source}...`);
      const { html, url } = await fetchSource(source);
      const analysis = analyzeWebsite(html, url);
      console.log('\n--- Analysis Results ---');
      console.log(`Title: ${analysis.metadata.title}`);
      console.log(`Description: ${analysis.metadata.description || '(None)'}`);
      console.log(`Viewport: ${analysis.metadata.hasViewport ? '✓ Present' : '✗ Missing'}`);
      console.log(`H1 Headings: ${JSON.stringify(analysis.structure.headings.h1)}`);
      console.log(`H2 Headings: ${JSON.stringify(analysis.structure.headings.h2)}`);
      console.log(`Detected Frameworks: ${analysis.techAudit.detectedFrameworks.join(', ') || 'None (Vanilla/Custom)'}`);
      
      if (analysis.issues.length > 0) {
        console.log('\n⚠️  Issues Detected:');
        analysis.issues.forEach(iss => console.log(`  [${iss.severity.toUpperCase()}] (${iss.category}) ${iss.message}`));
      }
      if (analysis.suggestions.length > 0) {
        console.log('\n💡 Redesign Suggestions:');
        analysis.suggestions.forEach(s => console.log(`  - (${s.category}) ${s.message}`));
      }
    } else if (command === 'enhance') {
      const source = args[1];
      const outDir = args[2];
      if (!source || !outDir) {
        console.error('Error: Usage: site-builder enhance <url|dir> <outDir>');
        process.exit(1);
      }
      console.log(`✨ Redesigning ${source} into ${outDir}...`);
      const res = await enhanceWebsite(source, outDir, {
        siteName: flags.name,
        description: flags.desc
      });
      console.log(`✅ Redesign complete! Output written to: ${res.outputDir}`);
      console.log(`   - Enhanced typography & semantic HTML5`);
      console.log(`   - Shared design token system`);
      console.log(`   - Production docker & nginx configuration`);
    } else if (command === 'verify' || command === 'audit') {
      const targetDir = args[1] || '.';
      console.log(`🔎 Auditing static website at ${targetDir}...`);
      const report = await auditDirectory(targetDir);
      
      console.log(`\n📋 Audit Report (${report.totalPages} pages checked):`);
      console.log(`Status: ${report.status === 'PASSED' ? '✅ ALL CHECKS PASSED' : '⚠️  ISSUES FOUND'}`);
      
      if (report.cssRulesPassed.length > 0) {
        console.log('\n🎨 CSS Architecture:');
        report.cssRulesPassed.forEach(p => console.log(`  ✓ ${p}`));
      }
      
      if (report.cssIssues.length > 0) {
        console.log('\n❌ CSS Issues:');
        report.cssIssues.forEach(i => console.log(`  [${i.severity.toUpperCase()}] ${i.file}: ${i.message}`));
      }

      if (report.metaPassed && report.metaPassed.length > 0) {
        console.log('\n🤖 Crawler & Discovery:');
        report.metaPassed.forEach(p => console.log(`  ✓ ${p}`));
      }

      if (report.metaIssues && report.metaIssues.length > 0) {
        console.log('\n⚠️  Discovery Issues:');
        report.metaIssues.forEach(i => console.log(`  [${i.severity.toUpperCase()}] ${i.file}: ${i.message}`));
      }

      console.log('\n📄 Page Details:');
      for (const page of report.pageResults) {
        if (page.issues.length === 0) {
          console.log(`  ✓ ${page.page} (${page.passes.length} checks passed)`);
        } else {
          console.log(`  ⚠️  ${page.page}:`);
          page.issues.forEach(iss => console.log(`     - [${iss.severity.toUpperCase()}] (${iss.category}) ${iss.message}`));
        }
      }

      if (report.totalIssues > 0) {
        console.log(`\n❌ Total issues found: ${report.totalIssues}`);
        process.exit(1);
      } else {
        console.log(`\n🎉 Site verified! Zero layout, link, SEO, or accessibility errors.`);
      }
    } else {
      console.error(`Unknown command: ${command}`);
      printHelp();
      process.exit(1);
    }
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    process.exit(1);
  }
}

main();
