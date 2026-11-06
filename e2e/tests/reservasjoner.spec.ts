import { expect, reservasjonsApi, test } from '../fixtures/testdata.js';

test('kan legge en reservert oppgave tilbake i felles kø', async ({ page, request, reservertOppgave }) => {
	await page.goto('/k9');
	const rad = page.getByRole('row').filter({ has: page.getByText(reservertOppgave.saksnummer, { exact: true }) });
	await expect(rad).toBeVisible();
	await rad
		.getByRole('button')
		.filter({ has: page.getByRole('img', { name: 'Handlinger på oppgave', exact: true }) })
		.click();
	await page.getByRole('menuitem', { name: /Legg oppgave tilbake i felles kø/ }).click();
	await page.getByRole('dialog').getByRole('button', { name: 'OK', exact: true }).click();
	await expect(rad).toHaveCount(0);

	// Ny innlasting og API-oppslag bekrefter at backend har lagret endringen.
	const reserverteEtterInnlasting = page.waitForResponse(
		(response) =>
			new URL(response.url()).pathname === '/api/k9-los-api/saksbehandler/oppgaver/reserverte' &&
			response.request().method() === 'GET',
	);
	await page.reload();
	expect((await reserverteEtterInnlasting).status()).toBe(200);
	const response = await request.get(`${reservasjonsApi}/aktiv-reservasjon`, {
		params: {
			oppgaveEksternId: reservertOppgave.oppgaveEksternId,
			oppgaveTypeEksternId: reservertOppgave.oppgaveTypeEksternId,
		},
	});
	expect(response.status()).toBe(204);
	await expect(rad).toHaveCount(0);
});
