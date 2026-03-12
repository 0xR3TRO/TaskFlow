# Architecture

## Overview

TaskFlow's JavaScript is organized into self-contained **IIFE modules** inside a single `script.js` file. Each module exposes a public API through the [Revealing Module Pattern](https://www.patterns.dev/posts/classic-design-patterns/#revealingmodulepatternjavascript).

```
┌──────────────┐
│  DOMContentLoaded
│      │
│  UIRender.init()
│      │
│  ┌───┴────────────────────────────────────┐
│  │  ThemeSwitcher.init()                  │
│  │  bindEvents()                          │
│  │  render()                              │
│  └────────────────────────────────────────┘
│      │
│      ▼  (on every user action)
│  ┌────────────────────────────┐
│  │  TaskManager (CRUD)        │──▶ Storage (localStorage)
│  └────────────┬───────────────┘
│               │
│       ┌───────┴───────┐
│       │               │
│    Filters         Search
│       │               │
│       └───────┬───────┘
│               │
│          UIRender.render()
│               │
│           DOM update
└──────────────────────────────────────────
```

## Modules

### Utils

| Method         | Purpose                                          |
| -------------- | ------------------------------------------------ |
| `generateId()` | Returns a unique string (timestamp + random).    |
| `formatDate()` | Converts an ISO string to a human-readable date. |
| `sanitize()`   | Escapes HTML entities to prevent XSS.            |

### Storage

| Method        | Purpose                                 |
| ------------- | --------------------------------------- |
| `loadTasks()` | Reads tasks from `localStorage`.        |
| `saveTasks()` | Writes the full task array.             |
| `loadTheme()` | Reads the saved theme (`light`/`dark`). |
| `saveTheme()` | Persists the current theme.             |

### TaskManager

Manages the in-memory task array and delegates persistence to `Storage`.

| Method               | Purpose                                            |
| -------------------- | -------------------------------------------------- |
| `getAll()`           | Returns the task array.                            |
| `add()`              | Creates a new task and prepends it.                |
| `remove(id)`         | Deletes a task by ID.                              |
| `toggleComplete(id)` | Flips the `completed` boolean.                     |
| `update(id, fields)` | Partial update of title, description, or priority. |
| `clearCompleted()`   | Removes all completed tasks.                       |

### Filters

| Method       | Purpose                                                           |
| ------------ | ----------------------------------------------------------------- |
| `byStatus()` | Returns tasks matching a filter (`all` / `active` / `completed`). |
| `sort()`     | Sorts tasks by date or priority.                                  |

### Search

| Method    | Purpose                                                            |
| --------- | ------------------------------------------------------------------ |
| `match()` | Filters tasks whose title or description contain the query string. |

### ThemeSwitcher

| Method     | Purpose                               |
| ---------- | ------------------------------------- |
| `init()`   | Applies the saved theme on page load. |
| `toggle()` | Switches between light and dark mode. |

### UIRender

Orchestrates all DOM interaction.

| Method            | Purpose                                                        |
| ----------------- | -------------------------------------------------------------- |
| `init()`          | Entry point — binds events and renders.                        |
| `render()`        | Rebuilds the task list using current filter/sort/search state. |
| `createCard()`    | Returns a DOM `<li>` for a single task.                        |
| `enterEditMode()` | Swaps a card's content with editable fields.                   |
| `updateCounter()` | Updates the footer task/active/done counter.                   |

## Data Flow

1. **User action** (click, submit, input) triggers an event listener in `UIRender`.
2. The listener calls `TaskManager` to mutate data.
3. `TaskManager` calls `Storage.saveTasks()`.
4. `UIRender.render()` is called, which:
    - Retrieves all tasks from `TaskManager`.
    - Applies `Search.match()`.
    - Applies `Filters.byStatus()`.
    - Applies `Filters.sort()`.
    - Rebuilds the DOM.
