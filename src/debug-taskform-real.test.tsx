import { describe, it, expect, mock } from "bun:test";
import { html, render } from "@_bashell/slash/core";
import { TaskForm } from "./components/TaskForm";
import { TaskStatus } from "./types/task";

describe("Debug TaskForm - Cenário Real", () => {
  it("deve prevenir reload da página ao submeter TaskForm", () => {
    // Arrange
    const container = document.createElement("div");
    document.body.appendChild(container);

    let submitCalled = false;
    const onSubmit = mock((data) => {
      console.log("[TEST] onSubmit callback chamado com:", data);
      submitCalled = true;
    });

    const onCancel = mock(() => {
      console.log("[TEST] onCancel callback chamado");
    });

    // Act - Renderizar TaskForm
    render(
      html`<${TaskForm} mode="create" onSubmit=${onSubmit} onCancel=${onCancel} />`,
      container
    );

    const form = container.querySelector("form")!;
    const titleInput = container.querySelector("#title") as HTMLInputElement;
    const descriptionInput = container.querySelector("#description") as HTMLTextAreaElement;
    const submitButton = container.querySelector("button[type='submit']") as HTMLButtonElement;

    console.log("[TEST] form found:", !!form);
    console.log("[TEST] inputs found:", !!titleInput, !!descriptionInput);

    // Preencher campos
    titleInput.value = "Teste de tarefa";
    titleInput.dispatchEvent(new Event("input", { bubbles: true }));

    descriptionInput.value = "Descrição válida com mais de 10 caracteres";
    descriptionInput.dispatchEvent(new Event("input", { bubbles: true }));

    // Simular submit via click no botão (comportamento mais real)
    console.log("[TEST] Clicando no botão submit...");
    const submitEvent = new Event("submit", { bubbles: true, cancelable: true });

    let defaultWasPrevented = false;
    const originalPreventDefault = submitEvent.preventDefault.bind(submitEvent);
    submitEvent.preventDefault = function() {
      console.log("[TEST] preventDefault foi chamado!");
      defaultWasPrevented = true;
      originalPreventDefault();
    };

    form.dispatchEvent(submitEvent);

    // Assert
    console.log("[TEST] submitCalled:", submitCalled);
    console.log("[TEST] defaultWasPrevented:", defaultWasPrevented);
    console.log("[TEST] submitEvent.defaultPrevented:", submitEvent.defaultPrevented);

    expect(onSubmit).toHaveBeenCalled();
    expect(defaultWasPrevented).toBe(true);

    // Cleanup
    document.body.removeChild(container);
  });

  it("deve prevenir submit com click real no botão", () => {
    // Arrange
    const container = document.createElement("div");
    document.body.appendChild(container);

    const onSubmit = mock((data) => {
      console.log("[TEST] onSubmit com click real:", data);
    });

    const onCancel = mock(() => {});

    render(
      html`<${TaskForm} mode="create" onSubmit=${onSubmit} onCancel=${onCancel} />`,
      container
    );

    const titleInput = container.querySelector("#title") as HTMLInputElement;
    const descriptionInput = container.querySelector("#description") as HTMLTextAreaElement;
    const submitButton = container.querySelector("button[type='submit']") as HTMLButtonElement;

    // Preencher campos
    titleInput.value = "Nova tarefa";
    titleInput.dispatchEvent(new Event("input", { bubbles: true }));

    descriptionInput.value = "Descrição completa da nova tarefa";
    descriptionInput.dispatchEvent(new Event("input", { bubbles: true }));

    // Simular click no botão (isso deve disparar submit no form)
    console.log("[TEST] Executando click() no botão...");
    submitButton.click();

    // Assert
    console.log("[TEST] onSubmit.mock.calls.length:", onSubmit.mock.calls.length);
    expect(onSubmit).toHaveBeenCalledTimes(1);

    // Cleanup
    document.body.removeChild(container);
  });
});
