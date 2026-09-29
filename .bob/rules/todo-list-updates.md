# Rule: Todo List Update Rules

## Core Constraint

When calling `update_todo_list`, the entire checklist is replaced. The system enforces that:

1. **Never remove previously completed items**: Any task marked `[x]` in earlier updates must remain in all subsequent updates.
2. **Never reword completed items**: The text of completed `[x]` tasks must match exactly.
3. **In-progress status timing**: Only mark a task as `[-]` in-progress in the same update that marks the previous task `[x]` done — never as a standalone call ahead of time.

## Guidelines

- When discovering new tasks or starting a new phase, append the new pending `[ ]` tasks to the bottom of the list while retaining all prior `[x]` tasks.
- If a task is abandoned or no longer relevant, only delete it if explicitly requested by the user.
