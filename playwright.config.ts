import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:8031';

export default defineConfig({
	testDir: './e2e/tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	workers: 3,
	retries: 0,
	timeout: 30_000,
	expect: { timeout: 10_000 },
	reporter: [['list'], ['html', { open: 'never' }]],
	use: {
		baseURL,
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
	},
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
	// Lokalt bruker vi tjenestene utvikleren allerede kjører. CI starter bare frontend her.
	webServer: process.env.CI
		? {
				command: `pnpm dev --host 127.0.0.1 --port ${new URL(baseURL).port || '8031'}`,
				url: baseURL,
				reuseExistingServer: false,
				timeout: 60_000,
			}
		: undefined,
});
