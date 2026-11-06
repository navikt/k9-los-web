import { randomUUID } from 'node:crypto';
import type { OppgaveKo } from '../../src/client/app/api/generated/los.schemas.js';
import { expect, køApi, test } from '../fixtures/testdata.js';

test('kan opprette kø, lagre kriterier og slette køen', async ({ page, request, køer }) => {
	const tittel = `E2E kø ${randomUUID()}`;
	const beskrivelse = 'Kø opprettet og redigert av nettlesertesten';
	await page.goto('/k9/avdelingsleder?fane=behandlingskoerV3');
	await page.getByRole('button', { name: 'Legg til ny oppgavekø' }).click();
	await page.getByLabel('Kønavn', { exact: true }).fill(tittel);
	const opprettet = page.waitForResponse(
		(response) =>
			new URL(response.url()).pathname === '/api/k9-los-api/ny-oppgavestyring/ko/opprett' &&
			response.request().method() === 'POST',
	);
	await page.getByRole('button', { name: 'Opprett kø', exact: true }).click();
	const response = await opprettet;
	expect(response.status()).toBe(200);
	const kø: OppgaveKo = await response.json();
	køer.registrer(kø);

	await page.getByLabel('Beskrivelse', { exact: true }).fill(beskrivelse);
	await page.getByRole('button', { name: 'Lagre oppgavekø', exact: true }).click();
	await expect(page.getByRole('button', { name: 'Lagre oppgavekø', exact: true })).toBeDisabled();
	await page.getByRole('button', { name: 'Legge til, se og endre kriterier' }).click();
	await page.getByLabel('Ytelsestype', { exact: true }).click();
	await page.getByRole('option', { name: 'Pleiepenger sykt barn', exact: true }).click();
	await page.getByRole('group', { name: 'Til beslutter', exact: true }).getByLabel('Nei', { exact: true }).check();
	await page.getByRole('button', { name: 'Lagre', exact: true }).click();
	await page.getByRole('button', { name: 'Lukk', exact: true }).click();

	await page.reload();
	const rad = page.getByRole('row').filter({ has: page.getByRole('cell', { name: tittel, exact: true }) });
	await rad.getByRole('button', { name: 'Vis mer', exact: true }).click();
	await expect(page.getByLabel('Beskrivelse', { exact: true })).toHaveValue(beskrivelse);
	await page.getByRole('button', { name: 'Legge til, se og endre kriterier' }).click();
	await expect(page.getByRole('button', { name: 'Pleiepenger sykt barn slett', exact: true })).toBeVisible();
	await expect(
		page.getByRole('group', { name: 'Til beslutter', exact: true }).getByLabel('Nei', { exact: true }),
	).toBeChecked();
	await page.getByRole('button', { name: 'Avbryt', exact: true }).click();
	await page.getByRole('button', { name: 'Lukk', exact: true }).click();
	await rad.getByRole('button', { name: 'Slett', exact: true }).click();
	await page
		.getByRole('dialog', { name: 'Slett oppgavekø', exact: true })
		.getByRole('button', { name: 'Slett', exact: true })
		.click();
	await expect(rad).toHaveCount(0);
	const listeResponse = await request.get(`${køApi}/alle-koer`);
	expect(listeResponse.status()).toBe(200);
	const gjenværende: { id: number }[] = await listeResponse.json();
	expect(gjenværende.some((element) => element.id === kø.id)).toBe(false);
});
