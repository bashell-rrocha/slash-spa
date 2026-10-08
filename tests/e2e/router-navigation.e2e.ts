import { test, expect } from '@playwright/test';

test('navegar pelos links troca a página e a URL sem erro no console', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));

  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Criar Tarefa' }).first()).toBeVisible();

  await page.getByRole('link', { name: 'Criar Tarefa' }).first().click();

  await expect(page.getByRole('heading', { level: 1, name: 'Nova Tarefa' })).toBeVisible();
  expect(await page.evaluate(() => location.pathname)).toBe('/tasks/new');
  expect(pageErrors).toEqual([]);
});
