# Usage Guide

## Getting Started

Open `index.html` in any modern web browser — no build step or server required.

## Adding a Task

1. Type a task title in the **"What needs to be done?"** input field.
2. (Optional) Add a description in the field below.
3. Choose a priority: **Low**, **Medium**, or **High**.
4. Click **Add** or press <kbd>Enter</kbd>.

The task appears at the top of the list.

## Editing a Task

Click the **✏️ edit** button on any task card. The card switches to edit mode where you can modify:

- Title
- Description
- Priority

Click **Save** to apply changes or **Cancel** to discard.

## Deleting a Task

Click the **🗑️ delete** button. The task fades out and is permanently removed.

## Completing a Task

Click the circular **checkbox** on the left side of a task card. The title gets a strike-through and the card visually dims. Click again to revert.

## Filtering Tasks

Use the filter bar to switch between:

| Filter        | Shows                   |
| ------------- | ----------------------- |
| **All**       | Every task              |
| **Active**    | Tasks not yet completed |
| **Completed** | Finished tasks only     |

## Sorting Tasks

Use the **Sort by** dropdown to reorder the list:

- **Newest first** (default)
- **Oldest first**
- **Priority ↓** (High → Low)
- **Priority ↑** (Low → High)

## Searching

Type in the search box to instantly filter tasks by title or description. The search is case-insensitive and updates as you type.

## Clearing Completed Tasks

Click **Clear completed** in the footer to remove all finished tasks at once.

## Dark / Light Mode

Click the **sun/moon** icon in the header to toggle themes. Your preference is saved automatically.

## Persistence

All tasks and the theme preference are saved in your browser's `localStorage`. Data persists across page reloads but is scoped to the current browser/device.
