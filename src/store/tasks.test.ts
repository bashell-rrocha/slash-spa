import { describe, test, expect, beforeEach } from "bun:test";
import {
  taskStore,
  addTask,
  updateTask,
  deleteTask,
  getTaskById,
  getRecentTasks,
  getTaskSummary,
  clearAllTasks,
} from "./tasks";
import { TaskStatus } from "../types/task";
import type { Task } from "../types/task";

// Mock localStorage for tests
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Override localStorage in global scope
Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

describe("Task Store", () => {
  beforeEach(() => {
    // Clear tasks before each test
    clearAllTasks();
    // Clear localStorage mock
    localStorage.clear();
  });

  describe("addTask", () => {
    test("should add a new task", () => {
      // Arrange
      const taskData = {
        title: "Test Task",
        description: "Test Description",
        status: TaskStatus.Pending,
      };

      // Act
      const task = addTask(taskData);

      // Assert
      expect(task.id).toBeDefined();
      expect(task.title).toBe("Test Task");
      expect(task.description).toBe("Test Description");
      expect(task.status).toBe(TaskStatus.Pending);
      expect(task.createdAt).toBeInstanceOf(Date);
      expect(task.updatedAt).toBeInstanceOf(Date);
      expect(taskStore.get().tasks).toHaveLength(1);
    });

    test("should add multiple tasks", () => {
      // Arrange & Act
      addTask({ title: "Task 1", description: "Description 1", status: TaskStatus.Pending });
      addTask({ title: "Task 2", description: "Description 2", status: TaskStatus.InProgress });
      addTask({ title: "Task 3", description: "Description 3", status: TaskStatus.Completed });

      // Assert
      expect(taskStore.get().tasks).toHaveLength(3);
    });
  });

  describe("updateTask", () => {
    test("should update an existing task", async () => {
      // Arrange
      const task = addTask({
        title: "Original Title",
        description: "Original Description",
        status: TaskStatus.Pending,
      });

      // Wait a bit to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Act
      const updatedTask = updateTask(task.id, {
        title: "Updated Title",
        status: TaskStatus.InProgress,
      });

      // Assert
      expect(updatedTask).not.toBeNull();
      expect(updatedTask!.title).toBe("Updated Title");
      expect(updatedTask!.description).toBe("Original Description");
      expect(updatedTask!.status).toBe(TaskStatus.InProgress);
      expect(updatedTask!.updatedAt.getTime()).toBeGreaterThanOrEqual(task.createdAt.getTime());
    });

    test("should return null for non-existent task", () => {
      // Act
      const result = updateTask("non-existent-id", { title: "Updated" });

      // Assert
      expect(result).toBeNull();
    });

    test("should preserve other fields when updating", () => {
      // Arrange
      const task = addTask({
        title: "Original",
        description: "Description",
        status: TaskStatus.Pending,
      });

      // Act
      updateTask(task.id, { title: "Updated" });

      // Assert
      const updated = getTaskById(task.id);
      expect(updated!.description).toBe("Description");
      expect(updated!.status).toBe(TaskStatus.Pending);
    });
  });

  describe("deleteTask", () => {
    test("should delete an existing task", () => {
      // Arrange
      const task = addTask({
        title: "Test",
        description: "Description",
        status: TaskStatus.Pending,
      });

      // Act
      const result = deleteTask(task.id);

      // Assert
      expect(result).toBe(true);
      expect(taskStore.get().tasks).toHaveLength(0);
    });

    test("should return false for non-existent task", () => {
      // Act
      const result = deleteTask("non-existent-id");

      // Assert
      expect(result).toBe(false);
    });

    test("should only delete the specified task", () => {
      // Arrange
      const task1 = addTask({ title: "Task 1", description: "Desc 1", status: TaskStatus.Pending });
      const task2 = addTask({ title: "Task 2", description: "Desc 2", status: TaskStatus.Pending });
      const task3 = addTask({ title: "Task 3", description: "Desc 3", status: TaskStatus.Pending });

      // Act
      deleteTask(task2.id);

      // Assert
      const remaining = taskStore.get().tasks;
      expect(remaining).toHaveLength(2);
      expect(remaining.find((t: Task) => t.id === task1.id)).toBeDefined();
      expect(remaining.find((t: Task) => t.id === task3.id)).toBeDefined();
      expect(remaining.find((t: Task) => t.id === task2.id)).toBeUndefined();
    });
  });

  describe("getTaskById", () => {
    test("should return the correct task", () => {
      // Arrange
      const task = addTask({
        title: "Test Task",
        description: "Test Description",
        status: TaskStatus.Pending,
      });

      // Act
      const found = getTaskById(task.id);

      // Assert
      expect(found).not.toBeNull();
      expect(found!.id).toBe(task.id);
      expect(found!.title).toBe("Test Task");
    });

    test("should return null for non-existent task", () => {
      // Act
      const found = getTaskById("non-existent-id");

      // Assert
      expect(found).toBeNull();
    });
  });

  describe("getRecentTasks", () => {
    test("should return tasks sorted by updatedAt in descending order", () => {
      // Arrange
      const task1 = addTask({ title: "Task 1", description: "Desc 1", status: TaskStatus.Pending });
      addTask({ title: "Task 2", description: "Desc 2", status: TaskStatus.Pending });
      addTask({ title: "Task 3", description: "Desc 3", status: TaskStatus.Pending });

      // Update task1 to make it more recent
      updateTask(task1.id, { title: "Task 1 Updated" });

      // Act
      const recent = getRecentTasks();

      // Assert
      expect(recent[0].id).toBe(task1.id);
    });

    test("should limit results to specified count", () => {
      // Arrange
      for (let i = 0; i < 10; i++) {
        addTask({ title: `Task ${i}`, description: `Desc ${i}`, status: TaskStatus.Pending });
      }

      // Act
      const recent = getRecentTasks(3);

      // Assert
      expect(recent).toHaveLength(3);
    });

    test("should default to 5 tasks", () => {
      // Arrange
      for (let i = 0; i < 10; i++) {
        addTask({ title: `Task ${i}`, description: `Desc ${i}`, status: TaskStatus.Pending });
      }

      // Act
      const recent = getRecentTasks();

      // Assert
      expect(recent).toHaveLength(5);
    });
  });

  describe("getTaskSummary", () => {
    test("should return correct summary for empty store", () => {
      // Act
      const summary = getTaskSummary();

      // Assert
      expect(summary.total).toBe(0);
      expect(summary.pending).toBe(0);
      expect(summary.inProgress).toBe(0);
      expect(summary.completed).toBe(0);
    });

    test("should return correct summary with tasks", () => {
      // Arrange
      addTask({ title: "Task 1", description: "Desc 1", status: TaskStatus.Pending });
      addTask({ title: "Task 2", description: "Desc 2", status: TaskStatus.Pending });
      addTask({ title: "Task 3", description: "Desc 3", status: TaskStatus.InProgress });
      addTask({ title: "Task 4", description: "Desc 4", status: TaskStatus.Completed });

      // Act
      const summary = getTaskSummary();

      // Assert
      expect(summary.total).toBe(4);
      expect(summary.pending).toBe(2);
      expect(summary.inProgress).toBe(1);
      expect(summary.completed).toBe(1);
    });

    test("should update summary after task changes", () => {
      // Arrange
      const task = addTask({ title: "Task 1", description: "Desc 1", status: TaskStatus.Pending });

      // Act
      updateTask(task.id, { status: TaskStatus.Completed });
      const summary = getTaskSummary();

      // Assert
      expect(summary.pending).toBe(0);
      expect(summary.completed).toBe(1);
    });
  });

  describe("clearAllTasks", () => {
    test("should remove all tasks", () => {
      // Arrange
      addTask({ title: "Task 1", description: "Desc 1", status: TaskStatus.Pending });
      addTask({ title: "Task 2", description: "Desc 2", status: TaskStatus.Pending });

      // Act
      clearAllTasks();

      // Assert
      expect(taskStore.get().tasks).toHaveLength(0);
    });
  });

  describe("localStorage persistence", () => {
    test("should persist tasks to localStorage when added", () => {
      // Arrange & Act
      addTask({ title: "Test Task", description: "Test Description", status: TaskStatus.Pending });

      // Assert
      const stored = localStorage.getItem("task-manager-tasks");
      expect(stored).toBeDefined();
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].title).toBe("Test Task");
    });

    test("should persist tasks to localStorage when updated", () => {
      // Arrange
      const task = addTask({ title: "Original", description: "Desc", status: TaskStatus.Pending });

      // Act
      updateTask(task.id, { title: "Updated" });

      // Assert
      const stored = localStorage.getItem("task-manager-tasks");
      const parsed = JSON.parse(stored!);
      expect(parsed[0].title).toBe("Updated");
    });

    test("should persist tasks to localStorage when deleted", () => {
      // Arrange
      const task = addTask({ title: "Test", description: "Desc", status: TaskStatus.Pending });

      // Act
      deleteTask(task.id);

      // Assert
      const stored = localStorage.getItem("task-manager-tasks");
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(0);
    });
  });
});
