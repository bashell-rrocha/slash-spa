import { describe, expect, test } from "bun:test";
import { applyPage, mountSite } from "./src/app";

// Hospedeiro de exemplo do slash-ui no slash-spa: o roteador monta cada página do site de exemplo e, a cada
// navegação, troca o tema, o modo, o idioma e o título do documento.

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
const html = document.documentElement;

describe("mountSite (slash-spa)", () => {
  test("cada rota monta a tela dela e troca tema, modo e título junto com a navegação", async () => {
    // Arrange
    const root = document.createElement("div");
    document.body.append(root);
    const site = mountSite(root, { hash: false, initialPath: "/app/hoje/" });
    await site.router.ready;
    await tick();
    const first = [html.getAttribute("data-theme"), html.getAttribute("data-mode"), document.title];
    const hasList = root.querySelector('[data-section="task-list"]') !== null;

    // Act
    await site.router.push("/landing/frontend-sem-atalhos/");
    await tick();

    // Assert
    expect(first).toEqual(["brisa", "light", "Hoje · Sereno"]);
    expect(hasList).toBe(true);
    expect([html.getAttribute("data-theme"), html.getAttribute("data-mode"), html.lang]).toEqual([
      "ambar-dev",
      "dark",
      "pt-BR",
    ]);
    expect(document.title).toContain("Frontend Sem Atalhos");
    expect(root.querySelector('[data-section="hero"]')).not.toBeNull();
    expect(root.querySelector('[data-section="task-list"]')).toBeNull();
    root.remove();
  });

  test("modo hash: links do conteúdo viram #/caminho e a rota vem do hash", async () => {
    // Arrange
    const root = document.createElement("div");
    document.body.append(root);

    // Act
    const site = mountSite(root, { hash: true, initialPath: "/app/novo/" });
    await site.router.ready;
    await tick();

    // Assert
    expect(root.querySelector('a[href="#/app/hoje/"]')).not.toBeNull();
    expect(root.querySelector('a[href^="/app/"]')).toBeNull();
    expect(root.querySelector('[data-section="form"]')).not.toBeNull();
    root.remove();
  });

  test("rota desconhecida cai no 404", async () => {
    // Arrange
    const root = document.createElement("div");
    document.body.append(root);

    // Act
    const site = mountSite(root, { hash: false, initialPath: "/nada/" });
    await site.router.ready;
    await tick();

    // Assert
    expect(root.textContent).toContain("Página não encontrada");
    expect(document.title).toBe("Página não encontrada");
    root.remove();
  });
});

describe("applyPage", () => {
  test("troca o lang do <html> junto com o tema (página em outro idioma)", () => {
    // Arrange
    const page = { lang: "en", theme: "brisa", mode: "dark", title: "Today" } as Parameters<typeof applyPage>[0];

    // Act
    applyPage(page);

    // Assert
    expect([html.lang, html.getAttribute("data-mode"), document.title]).toEqual(["en", "dark", "Today"]);
  });
});
