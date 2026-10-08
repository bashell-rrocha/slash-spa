import { html, render } from "@_bashell/slash/core";

function MinimalForm() {
  function handleSubmit(e: Event) {
    console.log("[MinimalForm] Submit event received!");
    e.preventDefault();
    console.log("[MinimalForm] preventDefault called");
    alert("Form submitted successfully!");
  }

  return html`
    <form onSubmit=${handleSubmit}>
      <h2>Minimal Test Form</h2>
      <input type="text" name="test" placeholder="Type something" />
      <button type="submit">Submit Test</button>
    </form>
  `;
}

render(html`<${MinimalForm} />`, document.getElementById("app")!);
