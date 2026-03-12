/* ===================================================================
   TaskFlow — Application Logic
   Modular vanilla JS: task-manager, storage, filters, search,
   ui-render, theme-switcher, utils
   =================================================================== */

// ===================== Utils Module =====================
const Utils = (() => {
    const generateId = () =>
        Date.now().toString(36) + Math.random().toString(36).substring(2, 8);

    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const sanitize = (str) => {
        const el = document.createElement("div");
        el.textContent = str;
        return el.innerHTML;
    };

    return { generateId, formatDate, sanitize };
})();

// ===================== Storage Module =====================
const Storage = (() => {
    const TASKS_KEY = "taskflow_tasks";
    const THEME_KEY = "taskflow_theme";

    const loadTasks = () => {
        try {
            const raw = localStorage.getItem(TASKS_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    };

    const saveTasks = (tasks) => {
        localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    };

    const loadTheme = () => localStorage.getItem(THEME_KEY) || "light";

    const saveTheme = (theme) => localStorage.setItem(THEME_KEY, theme);

    return { loadTasks, saveTasks, loadTheme, saveTheme };
})();

// ===================== Task Manager Module =====================
const TaskManager = (() => {
    let tasks = Storage.loadTasks();

    const getAll = () => tasks;

    const add = (title, description, priority) => {
        const task = {
            id: Utils.generateId(),
            title: title.trim(),
            description: description.trim(),
            priority, // 'low' | 'medium' | 'high'
            completed: false,
            createdAt: new Date().toISOString(),
        };
        tasks.unshift(task);
        Storage.saveTasks(tasks);
        return task;
    };

    const remove = (id) => {
        tasks = tasks.filter((t) => t.id !== id);
        Storage.saveTasks(tasks);
    };

    const toggleComplete = (id) => {
        const task = tasks.find((t) => t.id === id);
        if (task) {
            task.completed = !task.completed;
            Storage.saveTasks(tasks);
        }
    };

    const update = (id, fields) => {
        const task = tasks.find((t) => t.id === id);
        if (task) {
            if (fields.title !== undefined) task.title = fields.title.trim();
            if (fields.description !== undefined)
                task.description = fields.description.trim();
            if (fields.priority !== undefined) task.priority = fields.priority;
            Storage.saveTasks(tasks);
        }
    };

    const clearCompleted = () => {
        tasks = tasks.filter((t) => !t.completed);
        Storage.saveTasks(tasks);
    };

    return { getAll, add, remove, toggleComplete, update, clearCompleted };
})();

// ===================== Filters Module =====================
const Filters = (() => {
    const PRIORITY_ORDER = { high: 3, medium: 2, low: 1 };

    const byStatus = (tasks, filter) => {
        if (filter === "active") return tasks.filter((t) => !t.completed);
        if (filter === "completed") return tasks.filter((t) => t.completed);
        return tasks;
    };

    const sort = (tasks, mode) => {
        const sorted = [...tasks];
        switch (mode) {
            case "date-asc":
                sorted.sort(
                    (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
                );
                break;
            case "date-desc":
                sorted.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                );
                break;
            case "priority-desc":
                sorted.sort(
                    (a, b) =>
                        PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority],
                );
                break;
            case "priority-asc":
                sorted.sort(
                    (a, b) =>
                        PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority],
                );
                break;
            default:
                break;
        }
        return sorted;
    };

    return { byStatus, sort };
})();

// ===================== Search Module =====================
const Search = (() => {
    const match = (tasks, query) => {
        if (!query) return tasks;
        const q = query.toLowerCase();
        return tasks.filter(
            (t) =>
                t.title.toLowerCase().includes(q) ||
                t.description.toLowerCase().includes(q),
        );
    };

    return { match };
})();

// ===================== Theme Switcher Module =====================
const ThemeSwitcher = (() => {
    const init = () => {
        const theme = Storage.loadTheme();
        document.documentElement.setAttribute("data-theme", theme);
    };

    const toggle = () => {
        const current = document.documentElement.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        Storage.saveTheme(next);
    };

    return { init, toggle };
})();

// ===================== UI Render Module =====================
const UIRender = (() => {
    // DOM refs
    const taskList = document.getElementById("task-list");
    const emptyState = document.getElementById("empty-state");
    const taskCounter = document.getElementById("task-counter");
    const form = document.getElementById("task-form");
    const titleInput = document.getElementById("task-title");
    const descInput = document.getElementById("task-desc");
    const prioritySelect = document.getElementById("task-priority");
    const searchInput = document.getElementById("search-input");
    const sortSelect = document.getElementById("sort-select");
    const filterBtns = document.querySelectorAll(".filter-btn");
    const clearCompletedBtn = document.getElementById("clear-completed");
    const themeToggle = document.getElementById("theme-toggle");

    let currentFilter = "all";
    let currentSort = "date-desc";
    let currentQuery = "";

    // ---------- Render ----------
    const render = () => {
        let tasks = TaskManager.getAll();
        tasks = Search.match(tasks, currentQuery);
        tasks = Filters.byStatus(tasks, currentFilter);
        tasks = Filters.sort(tasks, currentSort);

        taskList.innerHTML = "";

        if (tasks.length === 0) {
            emptyState.classList.remove("hidden");
        } else {
            emptyState.classList.add("hidden");
            tasks.forEach((task) => taskList.appendChild(createCard(task)));
        }

        updateCounter();
    };

    const updateCounter = () => {
        const all = TaskManager.getAll();
        const active = all.filter((t) => !t.completed).length;
        const completed = all.length - active;
        taskCounter.textContent = `${all.length} task${all.length !== 1 ? "s" : ""} — ${active} active, ${completed} done`;
    };

    // ---------- Create Card ----------
    const createCard = (task) => {
        const li = document.createElement("li");
        li.className = `task-card${task.completed ? " completed" : ""}`;
        li.dataset.id = task.id;

        li.innerHTML = `
      <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""} aria-label="Mark task complete">
      <div class="task-body">
        <span class="task-title">${Utils.sanitize(task.title)}</span>
        ${task.description ? `<span class="task-description">${Utils.sanitize(task.description)}</span>` : ""}
        <div class="task-meta">
          <span class="priority-badge ${task.priority}">${task.priority}</span>
          <span>${Utils.formatDate(task.createdAt)}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="edit-btn" aria-label="Edit task">✏️</button>
        <button class="delete-btn" aria-label="Delete task">🗑️</button>
      </div>
    `;

        // Checkbox
        li.querySelector(".task-checkbox").addEventListener("change", () => {
            TaskManager.toggleComplete(task.id);
            render();
        });

        // Delete
        li.querySelector(".delete-btn").addEventListener("click", () => {
            li.style.opacity = "0";
            li.style.transform = "translateX(30px)";
            setTimeout(() => {
                TaskManager.remove(task.id);
                render();
            }, 200);
        });

        // Edit
        li.querySelector(".edit-btn").addEventListener("click", () => {
            enterEditMode(li, task);
        });

        return li;
    };

    // ---------- Edit Mode ----------
    const enterEditMode = (li, task) => {
        li.classList.add("editing");
        const body = li.querySelector(".task-body");

        body.innerHTML = `
      <input type="text" class="edit-title-input" value="${Utils.sanitize(task.title)}" maxlength="120">
      <input type="text" class="edit-desc-input" value="${Utils.sanitize(task.description)}" maxlength="300" placeholder="Description (optional)">
      <select class="edit-priority-select">
        <option value="low" ${task.priority === "low" ? "selected" : ""}>Low</option>
        <option value="medium" ${task.priority === "medium" ? "selected" : ""}>Medium</option>
        <option value="high" ${task.priority === "high" ? "selected" : ""}>High</option>
      </select>
      <div class="edit-actions">
        <button class="btn btn-primary save-edit-btn">Save</button>
        <button class="btn btn-ghost cancel-edit-btn">Cancel</button>
      </div>
    `;

        const titleIn = body.querySelector(".edit-title-input");
        const descIn = body.querySelector(".edit-desc-input");
        const prioIn = body.querySelector(".edit-priority-select");

        titleIn.focus();

        body.querySelector(".save-edit-btn").addEventListener("click", () => {
            const newTitle = titleIn.value.trim();
            if (!newTitle) return;
            TaskManager.update(task.id, {
                title: newTitle,
                description: descIn.value,
                priority: prioIn.value,
            });
            render();
        });

        body.querySelector(".cancel-edit-btn").addEventListener("click", () => {
            render();
        });
    };

    // ---------- Event Listeners ----------
    const bindEvents = () => {
        // Add task
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const title = titleInput.value.trim();
            if (!title) return;
            TaskManager.add(title, descInput.value, prioritySelect.value);
            titleInput.value = "";
            descInput.value = "";
            prioritySelect.value = "medium";
            titleInput.focus();
            render();
        });

        // Filters
        filterBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                filterBtns.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                currentFilter = btn.dataset.filter;
                render();
            });
        });

        // Sort
        sortSelect.addEventListener("change", () => {
            currentSort = sortSelect.value;
            render();
        });

        // Search (debounced)
        let searchTimer;
        searchInput.addEventListener("input", () => {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(() => {
                currentQuery = searchInput.value.trim();
                render();
            }, 200);
        });

        // Clear completed
        clearCompletedBtn.addEventListener("click", () => {
            TaskManager.clearCompleted();
            render();
        });

        // Theme
        themeToggle.addEventListener("click", () => {
            ThemeSwitcher.toggle();
        });
    };

    // ---------- Init ----------
    const init = () => {
        ThemeSwitcher.init();
        bindEvents();
        render();
    };

    return { init };
})();

// ===================== Boot =====================
document.addEventListener("DOMContentLoaded", UIRender.init);
