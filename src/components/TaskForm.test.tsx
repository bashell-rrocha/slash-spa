import { describe, test, expect, beforeEach, mock } from "bun:test";
import { html, render } from "@_bashell/slash/core";
import { TaskForm } from "./TaskForm";
import { TaskStatus } from "../types/task";

describe("TaskForm", () => {
  let container: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    container = document.getElementById("app")!;
  });

  describe("Rendering", () => {
    test("should render form in create mode", () => {
      // Arrange
      const onSubmit = mock(() => {});
      const onCancel = mock(() => {});

      // Act
      render(html`<${TaskForm} mode="create" onSubmit=${onSubmit} onCancel=${onCancel} />`, container);

      // Assert
      expect(container.querySelector("form")).toBeDefined();
      expect(container.querySelector('input[id="title"]')).toBeDefined();
      expect(container.querySelector('textarea[id="description"]')).toBeDefined();
      expect(container.querySelector('select[id="status"]')).toBeDefined();
      expect(container.querySelector('button[type="submit"]')?.textContent).toContain("Criar Tarefa");
    });

    test("should render form in edit mode", () => {
      // Arrange
      const onSubmit = mock(() => {});
      const onCancel = mock(() => {});

      // Act
      render(html`<${TaskForm} mode="edit" onSubmit=${onSubmit} onCancel=${onCancel} />`, container);

      // Assert
      expect(container.querySelector('button[type="submit"]')?.textContent).toContain("Salvar Alterações");
    });

    test("should render with initial data", () => {
      // Arrange
      const onSubmit = mock(() => {});
      const onCancel = mock(() => {});
      const initialData = {
        title: "Test Title",
        description: "Test Description",
        status: TaskStatus.InProgress,
      };

      // Act
      render(
        html`<${TaskForm} mode="edit" initialData=${initialData} onSubmit=${onSubmit} onCancel=${onCancel} />`,
        container
      );

      // Assert
      const titleInput = container.querySelector('input[id="title"]') as HTMLInputElement;
      const descTextarea = container.querySelector('textarea[id="description"]') as HTMLTextAreaElement;
      const statusSelect = container.querySelector('select[id="status"]') as HTMLSelectElement;

      expect(titleInput.value).toBe("Test Title");
      expect(descTextarea.value).toBe("Test Description");
      expect(statusSelect.value).toBe(TaskStatus.InProgress);
    });

    test("should render all status options", () => {
      // Arrange
      const onSubmit = mock(() => {});
      const onCancel = mock(() => {});

      // Act
      render(html`<${TaskForm} mode="create" onSubmit=${onSubmit} onCancel=${onCancel} />`, container);

      // Assert
      const options = container.querySelectorAll('select[id="status"] option');
      expect(options).toHaveLength(3);
      expect(options[0].textContent).toBe("Pendente");
      expect(options[1].textContent).toBe("Em Progresso");
      expect(options[2].textContent).toBe("Concluída");
    });
  });

  describe("Validation", () => {
    test("should show error when title is empty", async () => {
      // Arrange
      const onSubmit = mock(() => {});
      const onCancel = mock(() => {});
      render(html`<${TaskForm} mode="create" onSubmit=${onSubmit} onCancel=${onCancel} />`, container);

      // Act
      const form = container.querySelector("form") as HTMLFormElement;
      const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);

      // Wait for validation
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Assert
      const errorSpan = container.querySelector(".error");
      expect(errorSpan).toBeDefined();
      expect(errorSpan?.textContent).toContain("Título é obrigatório");
      expect(onSubmit).not.toHaveBeenCalled();
    });

    test("should show error when title is too short", async () => {
      // Arrange
      const onSubmit = mock(() => {});
      const onCancel = mock(() => {});
      render(html`<${TaskForm} mode="create" onSubmit=${onSubmit} onCancel=${onCancel} />`, container);

      // Act
      const titleInput = container.querySelector('input[id="title"]') as HTMLInputElement;
      titleInput.value = "AB";
      titleInput.dispatchEvent(new Event("input", { bubbles: true }));

      const form = container.querySelector("form") as HTMLFormElement;
      const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);

      // Wait for validation
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Assert
      const errorSpan = Array.from(container.querySelectorAll(".error")).find((el) =>
        el.textContent?.includes("no mínimo 3 caracteres")
      );
      expect(errorSpan).toBeDefined();
    });

    test("should show error when description is empty", async () => {
      // Arrange
      const onSubmit = mock(() => {});
      const onCancel = mock(() => {});
      render(html`<${TaskForm} mode="create" onSubmit=${onSubmit} onCancel=${onCancel} />`, container);

      // Act
      const titleInput = container.querySelector('input[id="title"]') as HTMLInputElement;
      titleInput.value = "Valid Title";
      titleInput.dispatchEvent(new Event("input", { bubbles: true }));

      const form = container.querySelector("form") as HTMLFormElement;
      const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);

      // Wait for validation
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Assert
      const errorSpan = Array.from(container.querySelectorAll(".error")).find((el) =>
        el.textContent?.includes("Descrição é obrigatória")
      );
      expect(errorSpan).toBeDefined();
    });

    test("should show error when description is too short", async () => {
      // Arrange
      const onSubmit = mock(() => {});
      const onCancel = mock(() => {});
      render(html`<${TaskForm} mode="create" onSubmit=${onSubmit} onCancel=${onCancel} />`, container);

      // Act
      const titleInput = container.querySelector('input[id="title"]') as HTMLInputElement;
      titleInput.value = "Valid Title";
      titleInput.dispatchEvent(new Event("input", { bubbles: true }));

      const descTextarea = container.querySelector('textarea[id="description"]') as HTMLTextAreaElement;
      descTextarea.value = "Short";
      descTextarea.dispatchEvent(new Event("input", { bubbles: true }));

      const form = container.querySelector("form") as HTMLFormElement;
      const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);

      // Wait for validation
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Assert
      const errorSpan = Array.from(container.querySelectorAll(".error")).find((el) =>
        el.textContent?.includes("no mínimo 10 caracteres")
      );
      expect(errorSpan).toBeDefined();
    });
  });

  describe("Form Submission", () => {
    test("should call onSubmit with valid data", async () => {
      // Arrange
      const onSubmit = mock(() => {});
      const onCancel = mock(() => {});
      render(html`<${TaskForm} mode="create" onSubmit=${onSubmit} onCancel=${onCancel} />`, container);

      // Act
      const titleInput = container.querySelector('input[id="title"]') as HTMLInputElement;
      titleInput.value = "Valid Title";
      titleInput.dispatchEvent(new Event("input", { bubbles: true }));

      const descTextarea = container.querySelector('textarea[id="description"]') as HTMLTextAreaElement;
      descTextarea.value = "Valid description with more than 10 characters";
      descTextarea.dispatchEvent(new Event("input", { bubbles: true }));

      const statusSelect = container.querySelector('select[id="status"]') as HTMLSelectElement;
      statusSelect.value = TaskStatus.InProgress;
      statusSelect.dispatchEvent(new Event("change", { bubbles: true }));

      const form = container.querySelector("form") as HTMLFormElement;
      const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);

      // Wait for submission
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Assert
      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith({
        title: "Valid Title",
        description: "Valid description with more than 10 characters",
        status: TaskStatus.InProgress,
      });
    });

    test("should trim whitespace from inputs", async () => {
      // Arrange
      const onSubmit = mock(() => {});
      const onCancel = mock(() => {});
      render(html`<${TaskForm} mode="create" onSubmit=${onSubmit} onCancel=${onCancel} />`, container);

      // Act
      const titleInput = container.querySelector('input[id="title"]') as HTMLInputElement;
      titleInput.value = "  Title with spaces  ";
      titleInput.dispatchEvent(new Event("input", { bubbles: true }));

      const descTextarea = container.querySelector('textarea[id="description"]') as HTMLTextAreaElement;
      descTextarea.value = "  Description with spaces  ";
      descTextarea.dispatchEvent(new Event("input", { bubbles: true }));

      const form = container.querySelector("form") as HTMLFormElement;
      const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);

      // Wait for submission
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Assert
      expect(onSubmit).toHaveBeenCalledWith({
        title: "Title with spaces",
        description: "Description with spaces",
        status: TaskStatus.Pending,
      });
    });
  });

  describe("Cancel Button", () => {
    test("should call onCancel when cancel button is clicked", () => {
      // Arrange
      const onSubmit = mock(() => {});
      const onCancel = mock(() => {});
      render(html`<${TaskForm} mode="create" onSubmit=${onSubmit} onCancel=${onCancel} />`, container);

      // Act
      const cancelButton = Array.from(container.querySelectorAll("button")).find(
        (btn) => btn.textContent === "Cancelar"
      ) as HTMLButtonElement;
      cancelButton.click();

      // Assert
      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe("Input Changes", () => {
    test("should clear error when user types in title field", async () => {
      // Arrange
      const onSubmit = mock(() => {});
      const onCancel = mock(() => {});
      render(html`<${TaskForm} mode="create" onSubmit=${onSubmit} onCancel=${onCancel} />`, container);

      // Trigger validation error first
      const form = container.querySelector("form") as HTMLFormElement;
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Act
      const titleInput = container.querySelector('input[id="title"]') as HTMLInputElement;
      titleInput.value = "New Title";
      titleInput.dispatchEvent(new Event("input", { bubbles: true }));

      // Wait for state update
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Assert
      const errorSpans = container.querySelectorAll(".error");
      const titleError = Array.from(errorSpans).find((el) => el.textContent?.includes("Título"));
      expect(titleError).toBeUndefined();
    });
  });
});
