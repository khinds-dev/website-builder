/**
 * Project Registry & State Manager
 * 
 * Manages projects, session history, handoff state, and cross-machine portability.
 */

import { promises as fs } from 'fs';
import path from 'path';

export const DEFAULT_PROJECTS_DIR = 'projects';
export const DEFAULT_REGISTRY_FILE = 'projects/registry.json';

/**
 * Initializes or reads the project registry
 * @param {string} registryPath
 * @returns {Promise<object>}
 */
export async function loadRegistry(registryPath = DEFAULT_REGISTRY_FILE) {
  const fullPath = path.resolve(registryPath);
  try {
    const raw = await fs.readFile(fullPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      const initial = {
        version: '1.0.0',
        activeProject: null,
        projects: {}
      };
      await saveRegistry(initial, registryPath);
      return initial;
    }
    throw err;
  }
}

/**
 * Saves the project registry
 * @param {object} registry
 * @param {string} registryPath
 */
export async function saveRegistry(registry, registryPath = DEFAULT_REGISTRY_FILE) {
  const fullPath = path.resolve(registryPath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, JSON.stringify(registry, null, 2), 'utf8');
}

/**
 * Registers or updates a project in the registry
 * @param {string} slug
 * @param {object} details
 * @param {string} registryPath
 */
export async function registerProject(slug, details, registryPath = DEFAULT_REGISTRY_FILE) {
  const registry = await loadRegistry(registryPath);
  const now = new Date().toISOString();
  
  const existing = registry.projects[slug] || {};
  const project = {
    slug,
    name: details.name || existing.name || slug,
    status: details.status || existing.status || 'in_progress', // in_progress | completed | paused | archived
    type: details.type || existing.type || 'from_scratch', // from_scratch | redesign | showcase
    path: details.path || existing.path || `projects/${slug}`,
    sourceUrl: details.sourceUrl || existing.sourceUrl || null,
    createdAt: existing.createdAt || now,
    updatedAt: now,
    summary: details.summary || existing.summary || '',
    history: existing.history || []
  };

  if (details.historyEntry) {
    project.history.push({
      timestamp: now,
      action: details.historyEntry.action,
      note: details.historyEntry.note || '',
      pages: details.historyEntry.pages || []
    });
  }

  registry.projects[slug] = project;
  if (details.setActive !== false) {
    registry.activeProject = slug;
  }

  await saveRegistry(registry, registryPath);
  return project;
}

/**
 * Logs a task or milestone into a project's history
 * @param {string} slug
 * @param {object} logEntry
 * @param {string} registryPath
 */
export async function logProjectHistory(slug, logEntry, registryPath = DEFAULT_REGISTRY_FILE) {
  const registry = await loadRegistry(registryPath);
  if (!registry.projects[slug]) {
    throw new Error(`Project "${slug}" not found in registry.`);
  }

  const now = new Date().toISOString();
  registry.projects[slug].updatedAt = now;
  if (logEntry.status) {
    registry.projects[slug].status = logEntry.status;
  }
  if (logEntry.summary) {
    registry.projects[slug].summary = logEntry.summary;
  }

  registry.projects[slug].history.push({
    timestamp: now,
    action: logEntry.action || 'update',
    note: logEntry.note || '',
    pages: logEntry.pages || []
  });

  await saveRegistry(registry, registryPath);
  return registry.projects[slug];
}

/**
 * Sets the active working project
 * @param {string} slug
 * @param {string} registryPath
 */
export async function switchProject(slug, registryPath = DEFAULT_REGISTRY_FILE) {
  const registry = await loadRegistry(registryPath);
  if (!registry.projects[slug]) {
    throw new Error(`Project "${slug}" does not exist.`);
  }
  registry.activeProject = slug;
  await saveRegistry(registry, registryPath);
  return registry.projects[slug];
}

/**
 * Generates a clean handoff / resume snapshot for Bob or CLI
 * @param {string} [slug] Optional slug; if omitted uses active project
 * @param {string} registryPath
 */
export async function getProjectHandoff(slug, registryPath = DEFAULT_REGISTRY_FILE) {
  const registry = await loadRegistry(registryPath);
  const targetSlug = slug || registry.activeProject;
  
  if (!targetSlug || !registry.projects[targetSlug]) {
    return {
      activeProject: null,
      message: 'No active project found. List projects using `site-builder list`.'
    };
  }

  const project = registry.projects[targetSlug];
  return {
    project,
    totalHistoryEntries: project.history.length,
    lastActivity: project.updatedAt,
    quickResumePrompt: `Resume work on project "${project.name}" located at "${project.path}". Status: ${project.status}.`
  };
}
