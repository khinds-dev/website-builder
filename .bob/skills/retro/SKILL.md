---
name: retro
description: Use this skill when the user says "/retro", "run retro", "retrospective", "what did we learn", or "capture lessons". Reviews Bob's own behaviour in the session and identifies actionable improvements to rules, skills, and AGENTS.md files.
trigger_phrases:
  - /retro
  - run retro
  - retrospective
  - what did we learn
  - capture lessons
  - learn from this
---

# Retro Skill — Post-Session Retrospective

## Purpose

Perform a retrospective of the most recently completed work to:

1. Identify actionable improvements to Bob's rules, skills, and `AGENTS.md` files
2. Commit those improvements so future sessions start with the lessons already baked in

---

## Analysis Process

### Step 1: Present Your Findings

**IMPORTANT:** Before creating any todo list, present your analysis in plain conversational text.

Write a detailed summary covering:

**What went wrong:**
- Specific moments where Bob made a mistake or needed correcting
- Incorrect assumptions made about the project
- Rules that existed but were not followed
- Inefficient approaches taken
- Conventions violated

**Documentation sources consulted:**
- Which `AGENTS.md` sections were relevant
- Which rules or skills applied (or should have applied)
- What information was missing, unclear, or not discoverable in time

**Root causes identified:**
- Missing rules or `AGENTS.md` guidance that would have prevented each issue
- Unclear or incomplete existing documentation
- Skill descriptions that didn't trigger when they should have
- Information that exists but wasn't prominent enough

**Proposed improvements:**
- Explain what change would address each issue
- Why the change prevents the same mistake in future
- Where it belongs (rule, skill, `AGENTS.md`)

**IMPORTANT:** If there are no proposed improvements, stop here.

---

### Step 2: Create Implementation Plan

**ONLY AFTER** presenting the analysis above, use `update_todo_list` to create a checklist of changes in priority order.

**Priority order:**
1. High priority — prevents errors or rework
2. Medium priority — improves efficiency
3. Low priority — nice-to-have

Use plain file paths without markdown link syntax — the todo list does not support formatting.

---

### Step 3: Implement Changes

Work through the todo list systematically. For each item:

1. Mark it `[-]` in progress
2. Read the current file if updating an existing one
3. Apply the improvement using the appropriate tool
4. Mark it `[x]` complete
5. Move to the next item

**Files that can be modified:**
- `AGENTS.md` in this workspace — for project-level rules and context
- `.bob/skills/*/SKILL.md` — for skill trigger phrases and workflow steps
- `.bob/rules/*.md` — for always-on constraints and conventions

After all changes are made, commit and push:

```bash
git add -A
git commit -m "docs: retro improvements — <one-line summary>"
git push origin main
```

---

## Choosing Between Rules, Skills, and AGENTS.md

**Use `AGENTS.md` when:**
- The information is fundamental to understanding the project structure
- It is high-level context or a non-negotiable constraint that applies to every task
- Modifying existing instructions already in `AGENTS.md`

**Use a Rule (`.bob/rules/`) when:**
- Defining a preference, constraint, or standard that should always be active
- The guidance is short, focused, and doesn't need supporting files
- Examples: "PRs must always target `main`", "Fixed navbar styling rules"

**Use a Skill (`.bob/skills/`) when:**
- Defining a multi-step workflow that is only needed occasionally
- Supporting files are needed alongside the instructions
- The task is specialised enough that it shouldn't always be in context

**Priority:** Skills > Rules > `AGENTS.md` additions (rules are more modular than `AGENTS.md`)

---

## Rule Format

```markdown
# Rule Title

Brief explanation of why this rule exists.

## Guidelines
- Specific, actionable instruction
- Another clear guideline

## Examples
Good: [example]
Avoid: [counter-example]
```

---

## Scope

**In scope — changes that affect future task performance:**
- Documentation Bob receives at task start
- Skill trigger phrases and descriptions
- Project conventions and standards

**Out of scope:**
- Bob's core system prompt or capabilities
- Tool definitions or parameters
- Issues that cannot be addressed through documentation
