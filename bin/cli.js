#!/usr/bin/env node

/**
 * CLI interface for website builder and enhancer
 */

import {
  createWebsite,
  enhanceWebsite,
  analyzeWebsite,
  fetchSource,
  auditDirectory,
  loadRegistry,
  registerProject,
  switchProject,
  logProjectHistory,
  getProjectHandoff
} from '../src/index.js';

const args = process.argv.slice(2);
const command = args[0];

function printHelp() {
  console.log(`
🌐 Website Builder CLI & Multi-Project Manager

Project Lifecycle & Cross-Machine Portability:
  site-builder list                        List all tracked projects and active state
  site-builder use <slug>                  Switch active project
  site-builder info [slug]                 Show status, history & handoff prompt for a project
  site-builder handoff [slug]              Generate copy-paste AI resume prompt for Bob
  site-builder log <slug> --action <act>   Append milestone note to project history

Site Generation & QA:
  site-builder new <dir> [options]         Create a new website from scratch & register
  site-builder analyze <url|dir>           Analyze an existing website / page
  site-builder enhance <url|dir> <outDir>  Fetch, audit, redesign & register project
  site-builder verify <dir>                Run multi-page verification & QA audit on a directory

Options:
  --name <site-name>      Name of the website
  --desc <description>    Site meta description
  --action <action>       History action name (e.g. "redesign", "bugfix")
  --note <note>           Milestone or task notes
  --status <status>       Project status (in_progress | completed | paused | archived)
  --help                  Show this help message

Examples:
  site-builder list
  site-builder use the-barbers-at-number-two
  site-builder info
  site-builder new ./projects/tech-blog --name "Tech Pulse"
  site-builder enhance https://example.com ./projects/example-v2 --name "Example Modern"
  site-builder verify ./projects/the-barbers-at-number-two
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
    if (command === 'list' || command === 'projects' || command === 'ls') {
      const reg = await loadRegistry();
      const keys = Object.keys(reg.projects);
      console.log(`\n📁 Tracked Projects (${keys.length} total):`);
      if (keys.length === 0) {
        console.log('  No projects registered yet.');
      } else {
        keys.forEach(k => {
          const p = reg.projects[k];
          const activeMarker = reg.activeProject === k ? '👉 (ACTIVE)' : '  ';
          console.log(`${activeMarker} [${p.status.toUpperCase()}] ${p.name} (${k})`);
          console.log(`     Path: ${p.path} | Type: ${p.type} | History: ${p.history.length} events | Updated: ${p.updatedAt}`);
        });
      }
    } else if (command === 'use' || command === 'switch') {
      const slug = args[1];
      if (!slug) {
        console.error('Error: Please specify the project slug to switch to.');
        process.exit(1);
      }
      const p = await switchProject(slug);
      console.log(`\n✅ Switched active project to: ${p.name} (${slug})`);
      console.log(`   Path: ${p.path}`);
      console.log(`   Status: ${p.status}`);
    } else if (command === 'handoff') {
      const slug = args[1];
      const handoff = await getProjectHandoff(slug);
      if (!handoff.project) {
        console.log(`\n⚠️  ${handoff.message}`);
        process.exit(0);
      }
      const p = handoff.project;
      console.log(`\n======================================================================`);
      console.log(`🤖 COPY-PASTE CONTINUATION PROMPT FOR BOB`);
      console.log(`======================================================================\n`);
      console.log(`Resume work on the website project "${p.name}".`);
      console.log(`- Project Slug: ${p.slug}`);
      console.log(`- Directory Path: ${p.path}`);
      console.log(`- Current Status: ${p.status}`);
      if (p.sourceUrl) console.log(`- Original Source: ${p.sourceUrl}`);
      console.log(`- Summary: ${p.summary}`);
      console.log(`\nRecent Timeline & Completed Milestones:`);
      p.history.slice(-5).forEach(h => {
        console.log(`  • [${h.timestamp.split('T')[0]}] ${h.action}: ${h.note}`);
      });
      console.log(`\nPlease read ${p.path}/PROGRESS.md (if present) and continue the next tasks.\n`);
      console.log(`======================================================================\n`);
    } else if (command === 'info' || command === 'status' || command === 'resume') {
      const slug = args[1];
      const handoff = await getProjectHandoff(slug);
      if (!handoff.project) {
        console.log(`\n⚠️  ${handoff.message}`);
        process.exit(0);
      }
      const p = handoff.project;
      console.log(`\n========================================`);
      console.log(`📌 Project: ${p.name} [${p.slug}]`);
      console.log(`========================================`);
      console.log(`Status:       ${p.status}`);
      console.log(`Type:         ${p.type}`);
      console.log(`Path:         ${p.path}`);
      console.log(`Source URL:   ${p.sourceUrl || 'N/A'}`);
      console.log(`Created:      ${p.createdAt}`);
      console.log(`Last Updated: ${p.updatedAt}`);
      console.log(`Summary:      ${p.summary || 'N/A'}`);
      console.log(`\n📜 History Log (${p.history.length} entries):`);
      p.history.forEach((h, idx) => {
        console.log(`  ${idx + 1}. [${h.timestamp}] ${h.action.toUpperCase()}: ${h.note}`);
        if (h.pages && h.pages.length > 0) {
          console.log(`     Affected pages: ${h.pages.join(', ')}`);
        }
      });
      console.log(`\n💡 Quick Resume Prompt for Bob:`);
      console.log(`"${handoff.quickResumePrompt}"\n`);
    } else if (command === 'log') {
      const slug = args[1];
      if (!slug || slug.startsWith('--')) {
        console.error('Error: Please specify project slug to log history.');
        process.exit(1);
      }
      const action = flags.action || 'update';
      const note = flags.note || args.slice(2).filter(a => !a.startsWith('--')).join(' ') || 'General progress update';
      const p = await logProjectHistory(slug, {
        action,
        note,
        status: flags.status
      });
      console.log(`✅ Logged history event to ${p.name} (${slug}): [${action}] ${note}`);
    } else if (command === 'new') {
      const targetDir = args[1];
      if (!targetDir || targetDir.startsWith('--')) {
        console.error('Error: Please specify target directory for new site.');
        process.exit(1);
      }
      const siteName = flags.name || 'Modern Site';
      const description = flags.desc || 'A clean, modern static website.';
      console.log(`🚀 Creating new website at ${targetDir}...`);
      const res = await createWebsite(targetDir, {
        siteName,
        description
      });
      const slug = path.basename(targetDir);
      await registerProject(slug, {
        name: siteName,
        status: 'in_progress',
        type: 'from_scratch',
        path: targetDir,
        summary: description,
        historyEntry: {
          action: 'created',
          note: `Initial website scaffolded at ${targetDir}`
        }
      });
      console.log(`✅ Website successfully created & registered at: ${res.targetDir}`);
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
      const siteName = flags.name || 'Enhanced Site';
      const description = flags.desc || `Modern redesign of ${source}`;
      console.log(`✨ Redesigning ${source} into ${outDir}...`);
      const res = await enhanceWebsite(source, outDir, {
        siteName,
        description
      });
      const slug = path.basename(outDir);
      await registerProject(slug, {
        name: siteName,
        status: 'in_progress',
        type: 'redesign',
        path: outDir,
        sourceUrl: source.startsWith('http') ? source : null,
        summary: description,
        historyEntry: {
          action: 'redesign_generated',
          note: `Scaffolded enhanced redesign from ${source}`
        }
      });
      console.log(`✅ Redesign complete & registered! Output written to: ${res.outputDir}`);
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
