# Integration Guide

## Embedding TaskFlow as a Widget

TaskFlow can be embedded inside any web page using an `<iframe>` or by inlining its source files.

### Option A: Iframe

The simplest approach. Place the TaskFlow folder on your server and embed it:

```html
<iframe
    src="/taskflow/index.html"
    title="TaskFlow"
    style="width: 100%; max-width: 680px; height: 600px; border: none; border-radius: 12px;"
></iframe>
```

Each iframe instance maintains its own `localStorage` scope (same origin) so multiple embeds on the same domain share the same data.

### Option B: Inline Integration

1. Copy the contents of `styles.css` into your page's `<style>` block (or `<link>` it).
2. Copy the HTML from `<main class="app-main">…</main>` into your page.
3. Include `script.js` at the bottom of `<body>`.

Make sure element IDs (`task-form`, `task-list`, etc.) don't conflict with your existing markup.

### Option C: Shadow DOM (Advanced)

Wrap TaskFlow in a Web Component to fully isolate styles and DOM:

```js
class TaskFlowWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
        // Load styles and HTML into this.shadowRoot
    }
}
customElements.define("task-flow", TaskFlowWidget);
```

Then use `<task-flow></task-flow>` anywhere on the page.

## Namespacing localStorage

To avoid key collisions when multiple apps share the same origin, change the storage keys in `script.js`:

```js
const TASKS_KEY = "myapp_taskflow_tasks";
const THEME_KEY = "myapp_taskflow_theme";
```

## Disabling Features

- **Theme toggle** — Remove the `#theme-toggle` button from HTML and the event listener from `UIRender.bindEvents`.
- **Search** — Remove the `.search-box` element and the `searchInput` listeners.
- **Sorting** — Remove the `.sort-group` element.

## Communicating with a Parent Page

If embedded via iframe, use `postMessage` to send events to the host page:

```js
// Inside TaskFlow script.js — after a task is added:
window.parent.postMessage({ type: "taskflow:task-added", task }, "*");
```

The parent listens with:

```js
window.addEventListener("message", (e) => {
    if (e.data.type === "taskflow:task-added") {
        console.log("New task:", e.data.task);
    }
});
```

> **Security note:** Always validate the `origin` of incoming messages in production.
