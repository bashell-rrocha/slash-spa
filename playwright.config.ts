import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  // Os arquivos E2E usam o sufixo .e2e.ts
  testMatch: '**/*.e2e.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    // O dev reconstrói o bundle a cada subida (nomes sem hash, como o index.html espera)
    // e já inicia o servidor; `start` serve um dist antigo e com nomes hasheados
    command: 'bun run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: false,
  },
});
