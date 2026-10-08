import { describe, it, expect, mock } from "bun:test";
import { html, render } from "@_bashell/slash/core";
import { TaskForm } from "./TaskForm";
import { TaskStatus } from "../types/task";

describe("TaskForm - Debug onSubmit", () => {
  it("deve prevenir submit padrão do formulário", async () => {
    // Arrange
    const container = document.createElement("div");
    document.body.appendChild(container);

    const onSubmit = mock(() => {});
    const onCancel = mock(() => {});

    render(
      html`<${TaskForm} mode="create" onSubmit=${onSubmit} onCancel=${onCancel} />`,
      container
    );

    const form = container.querySelector("form");
    expect(form).toBeDefined();

    const titleInput = container.querySelector("#title") as HTMLInputElement;
    const descriptionInput = container.querySelector("#description") as HTMLTextAreaElement;

    // Act - Preencher formulário
    titleInput.value = "Teste de tarefa";
    titleInput.dispatchEvent(new Event("input", { bubbles: true }));

    descriptionInput.value = "Descrição de teste com mais de 10 caracteres";
    descriptionInput.dispatchEvent(new Event("input", { bubbles: true }));

    // Criar evento de submit
    const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
    const preventDefaultSpy = mock(submitEvent.preventDefault.bind(submitEvent));
    submitEvent.preventDefault = preventDefaultSpy;

    form!.dispatchEvent(submitEvent);

    // Assert
    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalled();

    // Cleanup
    document.body.removeChild(container);
  });
});
