// Test flyttet fra verdikjede
// eslint-disable-next-line import/no-unused-modules
import { expect, test } from '@playwright/test';

test('Skal få opp 404-side når man går til en path som ikke finnes', async ({ page }) => {
	await page.goto('http://localhost:8031/url-som-ikke-finnes');
	await expect(page.getByText('Denne siden finnes ikke.')).toBeVisible();

	await page.getByRole('link', { name: 'Gå til forsiden' }).click();
	await expect(page.getByLabel('Søk på saksnummer, personnummer eller journalpost-id')).toBeVisible();
});
