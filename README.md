# TaskFlow

> A modern, lightweight To-Do List application built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools, no dependencies.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

---

## Features

- **Add tasks** with a title, optional description, and priority level
- **Edit** any task inline (title, description, priority)
- **Delete** tasks with a smooth fade-out animation
- **Mark as completed** with a single click
- **Priority system** — Low (green), Medium (yellow), High (red)
- **Filter** — All / Active / Completed
- **Sort** — by date (newest/oldest) or by priority (high→low / low→high)
- **Search** — real-time, case-insensitive filtering by title or description
- **Dark / Light mode** with one-click toggle (saved in localStorage)
- **Persistent storage** — tasks and theme preference survive page reloads via `localStorage`
- **Responsive** — mobile-first design that works on any screen size
- **Accessible** — semantic HTML, ARIA labels, focus-visible outlines, keyboard support

## Repository Structure

```
TaskFlow/
├── index.html          # Main application page
├── styles.css          # All styles (light/dark themes, responsive)
├── script.js           # Application logic (modular vanilla JS)
├── assets/
│   ├── logo.svg        # App logo
│   ├── favicon.svg     # Browser favicon
│   └── screenshot-placeholder.svg
├── data/
│   └── tasks.json      # Example task data (for reference)
├── docs/
│   ├── usage.md        # How to use TaskFlow
│   ├── customization.md # Changing styles, colors, priorities
│   ├── architecture.md # JS module overview & data flow
│   └── integration.md  # Embedding TaskFlow in other pages
└── README.md           # This file
```

## Getting Started

No installation, build step, or server required.

1. Clone the repository:
    ```bash
    git clone https://github.com/0xR3TRO/TaskFlow.git
    ```
2. Open `index.html` in any modern browser.

That's it — start adding tasks.

## Priority System

| Priority | Color  | Badge    |
| -------- | ------ | -------- |
| Low      | Green  | `low`    |
| Medium   | Yellow | `medium` |
| High     | Red    | `high`   |

Priorities are displayed as colored badges on each task card and can be used for sorting.

## JavaScript Modules

The application logic in `script.js` is split into focused modules using the Revealing Module Pattern:

| Module            | Responsibility                                    |
| ----------------- | ------------------------------------------------- |
| **Utils**         | ID generation, date formatting, HTML sanitization |
| **Storage**       | Read/write tasks and theme to `localStorage`      |
| **TaskManager**   | CRUD operations on the in-memory task array       |
| **Filters**       | Filter by status, sort by date or priority        |
| **Search**        | Case-insensitive substring matching               |
| **ThemeSwitcher** | Toggle and persist light/dark mode                |
| **UIRender**      | DOM rendering, event binding, edit mode           |

See [docs/architecture.md](docs/architecture.md) for a detailed breakdown and data-flow diagram.

## Customization

- **Colors & themes** — edit CSS custom properties in `:root` / `[data-theme="dark"]`
- **Priorities** — add or rename levels in the JS `PRIORITY_ORDER` map and corresponding CSS badges
- **Fonts** — swap the `font-family` in `styles.css`
- **Storage keys** — rename `TASKS_KEY` / `THEME_KEY` to avoid collisions

Full guide: [docs/customization.md](docs/customization.md)

## Future Improvements

- [ ] **Categories / Tags** — group tasks by project or label
- [ ] **Due dates & deadline reminders** — optional date picker with browser notifications
- [ ] **Drag-and-drop sorting** — reorder tasks manually
- [ ] **PWA offline mode** — Service Worker + manifest for installable offline use
- [ ] **Export / Import** — download tasks as JSON; import from file
- [ ] **Subtasks** — nestable checklist items within a task
- [ ] **Keyboard shortcuts** — quick-add, navigate, and complete without a mouse
- [ ] **Backend sync** — optional REST API integration for multi-device access

## License

This project is released under the [MIT License](https://opensource.org/licenses/MIT).

```
MIT License

Copyright (c) 2026 0xR3TRO

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
