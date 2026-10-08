import { createState } from "@_bashell/slash/core";
import { Task, TaskFormData, TaskStatus, TaskSummary } from "../types/task";

const STORAGE_KEY = "task-manager-tasks";

function loadFromStorage(): Task[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return parsed.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
    }));
  } catch {
    return [];
  }
}

function saveToStorage(tasks: Task[]) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Ignore storage errors
  }
}

export const taskStore = createState({
  tasks: loadFromStorage(),
});

// Watch changes and persist to localStorage
taskStore.watch((state: { tasks: Task[] }) => {
  saveToStorage(state.tasks);
});

export function addTask(data: TaskFormData): Task {
  const newTask: Task = {
    id: crypto.randomUUID(),
    title: data.title,
    description: data.description,
    status: data.status,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const prev = taskStore.get();
  taskStore.set({
    ...prev,
    tasks: [...prev.tasks, newTask],
  });

  return newTask;
}

export function updateTask(id: string, data: Partial<TaskFormData>): Task | null {
  const state = taskStore.get();
  const tasks = state.tasks;
  const index = tasks.findIndex((t: Task) => t.id === id);

  if (index === -1) return null;

  const updatedTask: Task = {
    ...tasks[index],
    ...data,
    updatedAt: new Date(),
  };

  const newTasks = [...tasks];
  newTasks[index] = updatedTask;

  taskStore.set({
    ...state,
    tasks: newTasks,
  });

  return updatedTask;
}

export function deleteTask(id: string): boolean {
  const state = taskStore.get();
  const tasks = state.tasks;
  const filtered = tasks.filter((t: Task) => t.id !== id);

  if (filtered.length === tasks.length) return false;

  taskStore.set({
    ...state,
    tasks: filtered,
  });

  return true;
}

export function getTaskById(id: string): Task | null {
  const tasks = taskStore.get().tasks;
  return tasks.find((t: Task) => t.id === id) || null;
}

export function getRecentTasks(limit: number = 5): Task[] {
  const tasks = taskStore.get().tasks;
  return [...tasks]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, limit);
}

export function getTaskSummary(): TaskSummary {
  const tasks = taskStore.get().tasks;

  return {
    total: tasks.length,
    pending: tasks.filter((t: Task) => t.status === TaskStatus.Pending).length,
    inProgress: tasks.filter((t: Task) => t.status === TaskStatus.InProgress).length,
    completed: tasks.filter((t: Task) => t.status === TaskStatus.Completed).length,
  };
}

export function getTotalTasks(): number {
  return taskStore.get().tasks.length;
}

export function getPendingTasks(): number {
  return taskStore.get().tasks.filter((t: Task) => t.status === TaskStatus.Pending).length;
}

export function getInProgressTasks(): number {
  return taskStore.get().tasks.filter((t: Task) => t.status === TaskStatus.InProgress).length;
}

export function getCompletedTasks(): number {
  return taskStore.get().tasks.filter((t: Task) => t.status === TaskStatus.Completed).length;
}

// Helper to create computed reactive from store
function createComputed<T>(compute: () => T) {
  const state = createState({ value: compute() });

  // Watch taskStore and update computed value
  taskStore.watch(() => {
    state.set({ value: compute() });
  });

  // Return reactive-compatible object
  return {
    get: () => state.get().value,
    subscribe: (fn: (v: T) => void) => state.watch((s: { value: T }) => fn(s.value)),
  };
}

// Computed reactive states for Dashboard
export const totalTasks = createComputed(() => taskStore.get().tasks.length);
export const pendingTasks = createComputed(() =>
  taskStore.get().tasks.filter((t: Task) => t.status === TaskStatus.Pending).length
);
export const inProgressTasks = createComputed(() =>
  taskStore.get().tasks.filter((t: Task) => t.status === TaskStatus.InProgress).length
);
export const completedTasks = createComputed(() =>
  taskStore.get().tasks.filter((t: Task) => t.status === TaskStatus.Completed).length
);

export function clearAllTasks() {
  const prev = taskStore.get();
  taskStore.set({
    ...prev,
    tasks: [],
  });
}
