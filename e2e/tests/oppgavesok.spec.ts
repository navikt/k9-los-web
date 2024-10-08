import { test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/filter');
});

test('kan legge til aksjonspunkt', async ({ page }) => {
	await page.getByRole('button', { name: 'Legg til nytt kriterie' }).click();
	await page.getByLabel('Velg kriterie:').click();
	await page.getByRole('option', { name: 'Løsbare og fremtidige aksjonspunkt' }).click();
	await page.getByRole('button', { name: 'Legg til', exact: true }).click();
	await page.getByLabel('Løsbare og fremtidige').click();
	await page.getByLabel('Beregning').check();
	await page.getByRole('button', { name: 'Lukk' }).click();
	await page.getByRole('button', { name: 'Fjern alle' }).click();
});

test('kan legge til verdier som er predefinerte', async ({ page }) => {
	await page.getByRole('button', { name: 'Legg til nytt kriterie' }).click();
	await page.getByLabel('Velg kriterie:').pressSequentially('Fag');
	await page.getByRole('option', { name: 'Fagsystem' }).click();
	await page.getByRole('button', { name: 'Legg til', exact: true }).click();
	await page.getByLabel('Fagsystem').click();
	await page.getByRole('option', { name: 'K9-punsj' }).click();
	await page.getByLabel('K9-punsj slett').isVisible();
});
test('filtrering på verdier som er predefinerte', async ({ page }) => {
	await page.getByRole('button', { name: 'Legg til nytt kriterie' }).click();
	await page.getByLabel('Velg kriterie:').click();
	await page.getByRole('option', { name: 'Fagsystem' }).click();
	await page.getByRole('button', { name: 'Legg til', exact: true }).click();
	await page.getByLabel('Fagsystem').click();
	await page.keyboard.type('tilbake');
	await page.getByRole('option', { name: 'K9-punsj' }).isHidden();
	await page.getByRole('option', { name: /k9-tilbake/i }).click();
	await page.getByLabel('K9-Tilbake slett').isVisible();
});
test('kan legge til verdier fra fritekst', async ({ page }) => {
	await page.getByRole('button', { name: 'Legg til nytt kriterie' }).click();
	await page.getByLabel('Velg kriterie:').click();
	await page.getByRole('option', { name: 'Saksnummer' }).click();
	await page.getByRole('button', { name: 'Legg til', exact: true }).click();
	await page.getByLabel('Skriv fritekst').click();
	await page.getByLabel('Skriv fritekst').fill('D4AILY');
});

test('kan legge til verdier med boolean', async ({ page }) => {
	await page.getByRole('button', { name: 'Legg til nytt kriterie' }).click();
	await page.getByLabel('Velg kriterie:').click();
	await page.getByLabel('Velg kriterie:').fill('tekni');
	await page.getByRole('option', { name: 'Avventer teknisk feil' }).click();
	await page.getByRole('button', { name: 'Legg til', exact: true }).click();
	await page.getByLabel('Ja').check();
});

test('can add date values', async ({ page }) => {
	await page.getByRole('button', { name: 'Legg til nytt kriterie' }).click();
	await page.getByLabel('Velg kriterie:').click();
	await page.getByRole('option', { name: 'Mottatt dato' }).first().click();
	await page.getByRole('button', { name: 'Legg til', exact: true }).click();
	await page.getByLabel('Velg dato', { exact: true }).click();
	await page.getByLabel('Velg dato', { exact: true }).fill('01.01.2023');
});

test('kan legge til verdier med tall', async ({ page }) => {
	await page.getByRole('button', { name: 'Legg til nytt kriterie' }).click();
	await page.getByLabel('Velg kriterie:').click();
	await page.getByLabel('Velg kriterie:').fill('akkumulert vente');
	await page.getByText('Hittil akkumulert ventetid på tekniske feil for denne oppgaven').click();
	await page.getByRole('button', { name: 'Legg til', exact: true }).click();
	await page.getByPlaceholder('Antall dager').click();
	await page.getByPlaceholder('Antall dager').fill('10');
});

test('kan legge til grupper hvor minimum en av filterene må være oppfylt', async ({ page }) => {
	await page.getByRole('button', { name: 'Legg til nytt kriterie' }).click();
	await page.getByLabel('Velg kriterie:').click();
	await page.getByText('Gruppe').click();
	await page.getByRole('button', { name: 'Legg til', exact: true }).click();
	await page.getByRole('radio', { name: 'Eller' }).click();
	await page.getByRole('button', { name: 'Legg til nytt kriterie' }).first().click();
	await page.getByLabel('Velg kriterie:').click();
	await page.getByRole('option', { name: 'Hastesak' }).click();
	await page.getByRole('button', { name: 'Legg til', exact: true }).click();
	await page.getByLabel('Ja').check();
	await page.getByRole('button', { name: 'Legg til nytt kriterie' }).first().click();
	await page.getByLabel('Velg kriterie:').click();
	await page.getByRole('option', { name: 'Mottatt dato' }).first().click();
	await page.getByRole('button', { name: 'Legg til', exact: true }).click();
	await page.getByRole('button', { name: 'Åpne datovelger' }).click();
	await page.getByLabel('Velg dato').click();
	await page.getByLabel('Velg dato').fill('13.07.2019');
});

// skippet pga ustabil selector
test.skip('kan legge til filter, hvilke felter som skal vises og sortering', async ({ page }) => {
	await page.getByRole('button', { name: 'Legg til nytt kriterie' }).click();
	await page.getByLabel('Velg kriterie:').selectOption('K9__akkumulertVentetidAnnetForTidligereVersjoner');
	await page.getByPlaceholder('Antall dager').click();
	await page.getByPlaceholder('Antall dager').fill('1');
	await page.getByRole('button', { name: 'Velg felter som skal vises' }).click();
	await page.getByRole('button', { name: 'Legg til felt' }).click();
	await page
		.getByRole('combobox', { name: 'Velg felt' })
		.selectOption('K9__akkumulertVentetidAnnetForTidligereVersjoner');
	await page.getByRole('button', { name: 'Velg sortering' }).click();
	await page
		.locator('div')
		.filter({ hasText: /^Velg sorteringLegg til felt$/ })
		.getByRole('button', { name: 'Legg til felt' })
		.click();
	await page.locator('#textField-rq').selectOption('K9__akkumulertVentetidAnnetForTidligereVersjoner');
});
