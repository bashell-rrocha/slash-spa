import { describe, test, expect, beforeEach } from "bun:test";
import {
  taskStore,
  addTask,
  clearAllTasks,
  totalTasks,
  pendingTasks,
  inProgressTasks,
  completedTasks,
} from "../store/tasks";
import { TaskStatus } from "../types/task";

describe("Dashboard - Reactive States", () => {
  beforeEach(() => {
    clearAllTasks();
  });

  test("totalTasks should be reactive", () => {
    // Arrange
    expect(totalTasks.get()).toBe(0);

    // Act
    addTask({ title: "Task 1", description: "Description 1", status: TaskStatus.Pending });

    // Assert
    expect(totalTasks.get()).toBe(1);
  });

  test("pendingTasks should be reactive", () => {
    // Arrange
    expect(pendingTasks.get()).toBe(0);

    // Act
    addTask({ title: "Task 1", description: "Description 1", status: TaskStatus.Pending });
    addTask({ title: "Task 2", description: "Description 2", status: TaskStatus.InProgress });

    // Assert
    expect(pendingTasks.get()).toBe(1);
  });

  test("inProgressTasks should be reactive", () => {
    // Arrange
    expect(inProgressTasks.get()).toBe(0);

    // Act
    addTask({ title: "Task 1", description: "Description 1", status: TaskStatus.InProgress });
    addTask({ title: "Task 2", description: "Description 2", status: TaskStatus.InProgress });
    addTask({ title: "Task 3", description: "Description 3", status: TaskStatus.Completed });

    // Assert
    expect(inProgressTasks.get()).toBe(2);
  });

  test("completedTasks should be reactive", () => {
    // Arrange
    expect(completedTasks.get()).toBe(0);

    // Act
    addTask({ title: "Task 1", description: "Description 1", status: TaskStatus.Completed });

    // Assert
    expect(completedTasks.get()).toBe(1);
  });

  test("all reactive states should update together", () => {
    // Arrange
    expect(totalTasks.get()).toBe(0);
    expect(pendingTasks.get()).toBe(0);
    expect(inProgressTasks.get()).toBe(0);
    expect(completedTasks.get()).toBe(0);

    // Act
    addTask({ title: "Task 1", description: "Description 1", status: TaskStatus.Pending });
    addTask({ title: "Task 2", description: "Description 2", status: TaskStatus.Pending });
    addTask({ title: "Task 3", description: "Description 3", status: TaskStatus.InProgress });
    addTask({ title: "Task 4", description: "Description 4", status: TaskStatus.Completed });

    // Assert
    expect(totalTasks.get()).toBe(4);
    expect(pendingTasks.get()).toBe(2);
    expect(inProgressTasks.get()).toBe(1);
    expect(completedTasks.get()).toBe(1);
  });

  test("reactive states should update when tasks are deleted", () => {
    // Arrange
    const task1 = addTask({ title: "Task 1", description: "Description 1", status: TaskStatus.Pending });
    const task2 = addTask({ title: "Task 2", description: "Description 2", status: TaskStatus.InProgress });

    expect(totalTasks.get()).toBe(2);
    expect(pendingTasks.get()).toBe(1);

    // Act - delete via store
    const state = taskStore.get();
    taskStore.set({
      ...state,
      tasks: state.tasks.filter((t) => t.id !== task1.id),
    });

    // Assert
    expect(totalTasks.get()).toBe(1);
    expect(pendingTasks.get()).toBe(0);
    expect(inProgressTasks.get()).toBe(1);
  });

  test("reactive states should update when clearing all tasks", () => {
    // Arrange
    addTask({ title: "Task 1", description: "Description 1", status: TaskStatus.Pending });
    addTask({ title: "Task 2", description: "Description 2", status: TaskStatus.InProgress });
    addTask({ title: "Task 3", description: "Description 3", status: TaskStatus.Completed });

    expect(totalTasks.get()).toBe(3);

    // Act
    clearAllTasks();

    // Assert
    expect(totalTasks.get()).toBe(0);
    expect(pendingTasks.get()).toBe(0);
    expect(inProgressTasks.get()).toBe(0);
    expect(completedTasks.get()).toBe(0);
  });
});
