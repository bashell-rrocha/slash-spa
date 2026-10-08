import { test, expect } from '@playwright/test';

test.describe('Form Submit Real Test', () => {
  test('should NOT reload page when submitting task form', async ({ page }) => {
    // Arrange
    let pageReloaded = false;

    page.on('load', () => {
      console.log('[PAGE] Page loaded');
      if (page.url().includes('/tasks/new')) {
        pageReloaded = true;
      }
    });

    page.on('console', msg => {
      console.log(`[BROWSER] ${msg.text()}`);
    });

    // Navegarnovamente para a página de nova tarefa
    await page.goto('http://localhost:3000/tasks/new');
    await page.waitForLoadState('networkidle');

    // Reset flag
    pageReloaded = false;

    // Act - Preencher e submeter formulário
    const titleInput = page.getByLabel('Título');
    const descriptionInput = page.getByLabel('Descrição');
    const submitButton = page.getByRole('button', { name: 'Criar Tarefa' });

    await titleInput.fill('Tarefa de teste real');
    await descriptionInput.fill('Esta é uma descrição de teste para verificar o comportamento');

    console.log('[TEST] Clicando no botão Criar Tarefa...');

    // Capturar URL antes do click
    const urlBeforeClick = page.url();
    console.log('[TEST] URL antes do click:', urlBeforeClick);

    // Verificar se o form tem listener antes do click
    const hasListener = await page.evaluate(() => {
      const form = document.querySelector('form');
      if (!form) return null;

      // Tentar obter info sobre os listeners (não funciona em todos os browsers)
      return {
        tagName: form.tagName,
        id: (form as any).__formId,
        hasOnSubmitAttribute: form.hasAttribute('onsubmit'),
        onSubmitProperty: typeof (form as any).onsubmit
      };
    });
    console.log('[TEST] Form listener info:', hasListener);

    // Click e aguardar um pouco
    await submitButton.click();

    // Aguardar 2 segundos para ver se a página recarrega
    await page.waitForTimeout(2000);

    const urlAfterClick = page.url();
    console.log('[TEST] URL depois do click:', urlAfterClick);
    console.log('[TEST] Page reloaded:', pageReloaded);

    // Assert
    expect(pageReloaded).toBe(false);
    expect(urlAfterClick).toBe('http://localhost:3000/tasks');
  });
});
