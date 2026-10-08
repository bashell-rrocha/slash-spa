import { describe, it, expect, mock } from "bun:test";
import { html, render } from "@_bashell/slash/core";

describe("Debug Form Submit - Isolado", () => {
  it("deve registrar event listener onSubmit corretamente", () => {
    // Arrange
    const container = document.createElement("div");
    document.body.appendChild(container);

    const submitHandler = mock((e: Event) => {
      console.log("[TEST] submitHandler chamado!");
      e.preventDefault();
    });

    console.log("[TEST] submitHandler type:", typeof submitHandler);
    console.log("[TEST] submitHandler.mock exists:", !!submitHandler.mock);

    // Act - Renderizar formulário
    render(
      html`
        <form onSubmit=${submitHandler}>
          <input type="text" name="test" value="test" />
          <button type="submit">Submit</button>
        </form>
      `,
      container
    );

    const form = container.querySelector("form")!;
    console.log("[TEST] form element:", form.tagName);

    // Verificar se o listener foi registrado
    const submitButton = container.querySelector("button")!;

    // Act - Disparar submit
    console.log("[TEST] Disparando submit event...");
    const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
    const result = form.dispatchEvent(submitEvent);
    console.log("[TEST] dispatchEvent result:", result);
    console.log("[TEST] event.defaultPrevented:", submitEvent.defaultPrevented);

    // Assert
    console.log("[TEST] submitHandler.mock.calls.length:", submitHandler.mock.calls.length);
    expect(submitHandler).toHaveBeenCalledTimes(1);
    expect(submitEvent.defaultPrevented).toBe(true);

    // Cleanup
    document.body.removeChild(container);
  });

  it("deve funcionar com click no botão submit", () => {
    // Arrange
    const container = document.createElement("div");
    document.body.appendChild(container);

    const submitHandler = mock((e: Event) => {
      console.log("[TEST] submitHandler via click chamado!");
      e.preventDefault();
    });

    render(
      html`
        <form onSubmit=${submitHandler}>
          <input type="text" name="test" value="test" />
          <button type="submit">Submit</button>
        </form>
      `,
      container
    );

    const submitButton = container.querySelector("button")!;

    // Act - Simular click no botão
    console.log("[TEST] Clicando no botão submit...");
    submitButton.click();

    // Assert
    console.log("[TEST] submitHandler.mock.calls.length:", submitHandler.mock.calls.length);
    expect(submitHandler).toHaveBeenCalledTimes(1);

    // Cleanup
    document.body.removeChild(container);
  });
});
