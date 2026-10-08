import { test, expect } from '@playwright/test';

test('debug link navigation', async ({ page }) => {
  // Habilitar logs do console
  page.on('console', msg => console.log('[BROWSER]', msg.text()));
  page.on('pageerror', err => console.log('[ERROR]', err.message));

  // Ir para a home
  await page.goto('/');
  await page.waitForTimeout(2000);

  // Screenshot inicial
  await page.screenshot({ path: '/tmp/01-home.png' });
  console.log('Screenshot salvo: /tmp/01-home.png');

  // Verificar se o h1 apareceu
  const h1 = await page.locator('h1').textContent();
  console.log('H1 content:', h1);

  // Verificar se há algum link "Criar Tarefa"
  const createLink = page.getByRole('link', { name: 'Criar Tarefa' });
  const count = await createLink.count();
  console.log('Links "Criar Tarefa" encontrados:', count);

  if (count > 0) {
    // Clicar no link
    console.log('Clicando no link...');
    await createLink.first().click();
    await page.waitForTimeout(2000);

    // Screenshot após o click
    await page.screenshot({ path: '/tmp/02-after-click.png' });
    console.log('Screenshot após click salvo: /tmp/02-after-click.png');

    // Verificar URL
    console.log('URL atual:', page.url());
  }
});
