import { test, expect } from '@playwright/test';

test.describe('Task Manager E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should display empty dashboard initially', async ({ page }) => {
    // Arrange & Act
    await page.goto('/');

    // Assert
    await expect(page.locator('h1')).toContainText('Dashboard');
    await expect(page.getByText('Nenhuma tarefa cadastrada')).toBeVisible();
  });

  test('should create a new task', async ({ page }) => {
    // Arrange
    page.on('console', msg => console.log('[BROWSER]', msg.text()));
    await page.goto('/');

    // Act
    await page.getByRole('link', { name: 'Criar Tarefa' }).click();
    await expect(page).toHaveURL('/tasks/new');

    await page.getByLabel('Título').fill('Minha primeira tarefa');
    await page.getByLabel('Descrição').fill('Esta é uma descrição detalhada da tarefa');
    await page.getByLabel('Status').selectOption('pending');

    console.log('[TEST] Clicando no botão Criar Tarefa');
    await page.getByRole('button', { name: 'Criar Tarefa' }).click();
    console.log('[TEST] Botão clicado, aguardando navegação...');

    await page.waitForTimeout(1000);
    console.log('[TEST] URL atual:', page.url());

    // Assert
    await expect(page).toHaveURL('/tasks');
    await expect(page.getByText('Minha primeira tarefa')).toBeVisible();
    await expect(page.getByText('Esta é uma descrição detalhada')).toBeVisible();
  });

  test('should show validation errors on empty form', async ({ page }) => {
    // Arrange
    await page.goto('/tasks/new');

    // Act
    await page.getByRole('button', { name: 'Criar Tarefa' }).click();

    // Assert
    await expect(page.getByText('Título é obrigatório')).toBeVisible();
    await expect(page.getByText('Descrição é obrigatória')).toBeVisible();
  });

  test('should edit an existing task', async ({ page }) => {
    // Arrange - Create a task first
    await page.goto('/tasks/new');
    await page.getByLabel('Título').fill('Tarefa original');
    await page.getByLabel('Descrição').fill('Descrição original da tarefa');
    await page.getByRole('button', { name: 'Criar Tarefa' }).click();
    await expect(page).toHaveURL('/tasks');

    // Act - Edit the task
    await page.getByRole('button', { name: 'Editar' }).click();
    await page.getByLabel('Título').fill('Tarefa editada');
    await page.getByLabel('Status').selectOption('in_progress');
    await page.getByRole('button', { name: 'Salvar Alterações' }).click();

    // Assert
    await expect(page).toHaveURL('/tasks');
    await expect(page.getByText('Tarefa editada')).toBeVisible();
    await expect(page.getByText('Em Progresso')).toBeVisible();
  });

  test('should delete a task', async ({ page }) => {
    // Arrange - Create a task first
    await page.goto('/tasks/new');
    await page.getByLabel('Título').fill('Tarefa para deletar');
    await page.getByLabel('Descrição').fill('Esta tarefa será deletada');
    await page.getByRole('button', { name: 'Criar Tarefa' }).click();
    await expect(page).toHaveURL('/tasks');

    // Act - Delete the task
    page.on('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Excluir' }).click();

    // Assert
    await expect(page.getByText('Tarefa para deletar')).not.toBeVisible();
  });

  test('should filter tasks by status', async ({ page }) => {
    // Arrange - Create multiple tasks with different statuses
    const tasks = [
      { title: 'Tarefa Pendente', description: 'Descrição pendente', status: 'pending' },
      { title: 'Tarefa em Progresso', description: 'Descrição em progresso', status: 'in_progress' },
      { title: 'Tarefa Concluída', description: 'Descrição concluída', status: 'completed' },
    ];

    for (const task of tasks) {
      await page.goto('/tasks/new');
      await page.getByLabel('Título').fill(task.title);
      await page.getByLabel('Descrição').fill(task.description);
      await page.getByLabel('Status').selectOption(task.status);
      await page.getByRole('button', { name: 'Criar Tarefa' }).click();
    }

    await page.goto('/tasks');

    // Act & Assert - Filter by "Em Progresso"
    await page.getByLabel('Filtrar por status').selectOption('in_progress');
    await expect(page.getByText('Tarefa em Progresso')).toBeVisible();
    await expect(page.getByText('Tarefa Pendente')).not.toBeVisible();
    await expect(page.getByText('Tarefa Concluída')).not.toBeVisible();

    // Act & Assert - Filter by "Todas"
    await page.getByLabel('Filtrar por status').selectOption('all');
    await expect(page.getByText('Tarefa em Progresso')).toBeVisible();
    await expect(page.getByText('Tarefa Pendente')).toBeVisible();
    await expect(page.getByText('Tarefa Concluída')).toBeVisible();
  });

  test('should show task summary on dashboard', async ({ page }) => {
    // Arrange - Create tasks with different statuses
    const tasks = [
      { title: 'Tarefa 1', description: 'Descrição 1', status: 'pending' },
      { title: 'Tarefa 2', description: 'Descrição 2', status: 'pending' },
      { title: 'Tarefa 3', description: 'Descrição 3', status: 'in_progress' },
      { title: 'Tarefa 4', description: 'Descrição 4', status: 'completed' },
    ];

    for (const task of tasks) {
      await page.goto('/tasks/new');
      await page.getByLabel('Título').fill(task.title);
      await page.getByLabel('Descrição').fill(task.description);
      await page.getByLabel('Status').selectOption(task.status);
      await page.getByRole('button', { name: 'Criar Tarefa' }).click();
    }

    // Act
    await page.goto('/');

    // Assert
    const summaryCards = page.locator('.count');
    await expect(summaryCards.nth(0)).toContainText('4'); // Total
    await expect(summaryCards.nth(1)).toContainText('2'); // Pendentes
    await expect(summaryCards.nth(2)).toContainText('1'); // Em Progresso
    await expect(summaryCards.nth(3)).toContainText('1'); // Concluídas
  });

  test('should persist tasks in localStorage', async ({ page }) => {
    // Arrange - Create a task
    await page.goto('/tasks/new');
    await page.getByLabel('Título').fill('Tarefa persistente');
    await page.getByLabel('Descrição').fill('Esta tarefa deve persistir');
    await page.getByRole('button', { name: 'Criar Tarefa' }).click();

    // Act - Reload the page
    await page.reload();

    // Assert
    await expect(page.getByText('Tarefa persistente')).toBeVisible();
  });

  test('should navigate to 404 page for invalid routes', async ({ page }) => {
    // Act
    await page.goto('/rota-inexistente');

    // Assert
    await expect(page.getByText('404')).toBeVisible();
    await expect(page.getByText('Página não encontrada')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ir para Dashboard' })).toBeVisible();
  });

  test('should cancel task creation', async ({ page }) => {
    // Arrange
    await page.goto('/tasks/new');
    await page.getByLabel('Título').fill('Tarefa cancelada');
    await page.getByLabel('Descrição').fill('Esta tarefa será cancelada');

    // Act
    await page.getByRole('button', { name: 'Cancelar' }).click();

    // Assert
    await expect(page).toHaveURL('/tasks');
    await expect(page.getByText('Tarefa cancelada')).not.toBeVisible();
  });

  test('should navigate between pages using links', async ({ page }) => {
    // Arrange
    await page.goto('/');

    // Act & Assert - Dashboard to Tasks
    await page.getByRole('link', { name: 'Ver Todas as Tarefas' }).first().click();
    await expect(page).toHaveURL('/tasks');

    // Act & Assert - Tasks to Dashboard
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await expect(page).toHaveURL('/');

    // Act & Assert - Dashboard to New Task
    await page.getByRole('link', { name: 'Criar Nova Tarefa' }).first().click();
    await expect(page).toHaveURL('/tasks/new');
  });

  test('should show recent tasks on dashboard', async ({ page }) => {
    // Arrange - Create 7 tasks
    for (let i = 1; i <= 7; i++) {
      await page.goto('/tasks/new');
      await page.getByLabel('Título').fill(`Tarefa ${i}`);
      await page.getByLabel('Descrição').fill(`Descrição da tarefa ${i}`);
      await page.getByRole('button', { name: 'Criar Tarefa' }).click();
      await page.waitForTimeout(100); // Small delay to ensure different timestamps
    }

    // Act
    await page.goto('/');

    // Assert - Should only show 5 most recent tasks
    await expect(page.getByText('Tarefa 7')).toBeVisible();
    await expect(page.getByText('Tarefa 6')).toBeVisible();
    await expect(page.getByText('Tarefa 5')).toBeVisible();
    await expect(page.getByText('Tarefa 4')).toBeVisible();
    await expect(page.getByText('Tarefa 3')).toBeVisible();
  });
});
