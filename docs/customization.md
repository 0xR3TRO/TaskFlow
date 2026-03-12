# Customization Guide

## Changing Colors

All colors are defined as CSS custom properties in `styles.css` under `:root` (light theme) and `[data-theme="dark"]`.

```css
:root {
    --color-primary: #4f6ef7; /* Accent / buttons */
    --color-priority-low: #22c55e; /* Green */
    --color-priority-medium: #eab308; /* Yellow */
    --color-priority-high: #ef4444; /* Red */
    /* ... */
}
```

Update any value to match your brand.

## Adding or Renaming Priorities

1. **`script.js`** — In the `Filters` module, update the `PRIORITY_ORDER` map:
    ```js
    const PRIORITY_ORDER = { critical: 4, high: 3, medium: 2, low: 1 };
    ```
2. **`index.html`** — Add the new `<option>` to both the add-panel `<select>` and the edit-mode select generated in `UIRender.enterEditMode`.
3. **`styles.css`** — Add a `.priority-badge.critical` rule with the desired color.

## Changing the Task Data Shape

Each task object in `localStorage` has this shape:

```json
{
    "id": "m1abc123",
    "title": "My task",
    "description": "",
    "priority": "medium",
    "completed": false,
    "createdAt": "2026-03-12T10:00:00.000Z"
}
```

To add a field (e.g., `dueDate`):

1. Update `TaskManager.add()` to include the new field.
2. Update `UIRender.createCard()` to display it.
3. Update `UIRender.enterEditMode()` to allow editing.

## Changing Fonts

Replace the `font-family` in the `body` rule:

```css
body {
    font-family: "Inter", sans-serif;
}
```

Add a Google Fonts `<link>` to `index.html` if needed.

## Customizing Animations

Hover lift, fade-in, and delete slide are controlled by:

- `.task-card:hover` — hover transform
- `@keyframes fadeIn` — entry animation
- Delete button handler — inline `opacity` and `transform`

Adjust durations and easing in `--transition` or directly in keyframe definitions.

## Changing localStorage Keys

Storage keys are constants at the top of the `Storage` module:

```js
const TASKS_KEY = "taskflow_tasks";
const THEME_KEY = "taskflow_theme";
```

Rename them to avoid conflicts if you run multiple apps on the same origin.
