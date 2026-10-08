import { test, expect } from "@playwright/test";

test("form submit deve funcionar no navegador real", async ({ page }) => {
  // Navegar para a página
  await page.goto("http://localhost:3000/tasks/new");

  // Aguardar o form carregar
  await page.waitForSelector("form");

  // Preencher o formulário
  await page.fill("#title", "Teste no navegador");
  await page.fill("#description", "Descrição do teste no navegador real");

  // Capturar logs do console
  const consoleLogs: string[] = [];
  page.on("console", (msg) => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  });

  // Clicar no botão de submit
  await page.click('button[type="submit"]');

  // Aguardar navegação ou verificar se não houve reload
  await page.waitForTimeout(1000);

  // Verificar URL - deve ter mudado para /tasks (sem ?)
  const url = page.url();
  console.log("URL após submit:", url);

  // Exibir logs do console
  console.log("\n=== Console Logs ===");
  consoleLogs.forEach(log => console.log(log));

  // Verificar se não adicionou ? na URL (sinal de reload)
  expect(url).not.toContain("?");
  expect(url).toContain("/tasks");
});
