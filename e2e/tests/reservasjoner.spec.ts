import type { Page } from '@playwright/test';
import dayjs from 'dayjs';
import { expect, hentAktivReservasjon, reservasjonsApi, test } from '../fixtures/testdata.js';

function oppgaverad(page: Page, saksnummer: string) {
	return page.getByRole('row').filter({ has: page.getByText(saksnummer, { exact: true }) });
}

async function åpneHandlinger(page: Page, saksnummer: string) {
	await oppgaverad(page, saksnummer)
		.getByRole('button')
		.filter({ has: page.getByRole('img', { name: 'Handlinger på oppgave', exact: true }) })
		.click();
}

async function åpneAvdelingsledersReservasjoner(page: Page) {
	await page.goto('/k9/avdelingsleder');
	await page.getByRole('link', { name: 'Reservasjoner', exact: true }).click();
}

test('kan legge en reservert oppgave tilbake i felles kø', async ({ page, request, reservertOppgave }) => {
	await page.goto('/k9');
	const rad = oppgaverad(page, reservertOppgave.saksnummer);
	await expect(rad).toBeVisible();
	await åpneHandlinger(page, reservertOppgave.saksnummer);
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

test('kan forlenge reservasjon og beholde den etter ny innlasting', async ({ page, request, reservertOppgave }) => {
	const før = await hentAktivReservasjon(request, reservertOppgave);
	await page.goto('/k9');
	await åpneHandlinger(page, reservertOppgave.saksnummer);
	await page.getByRole('menuitem', { name: /Forleng din reservasjon/ }).click();

	await expect
		.poll(async () => (await hentAktivReservasjon(request, reservertOppgave)).reservertTil)
		.not.toBe(før.reservertTil);
	const etter = await hentAktivReservasjon(request, reservertOppgave);
	expect(dayjs(etter.reservertTil).isAfter(dayjs(før.reservertTil))).toBe(true);
	expect(etter.reservertAvIdent).toBe(før.reservertAvIdent);
	await page.reload();
	await expect(oppgaverad(page, reservertOppgave.saksnummer)).toContainText(
		dayjs(etter.reservertTil).format('DD.MM.YYYY'),
	);
});

test('kan flytte reservasjon til en annen saksbehandler', async ({ page, request, reservertOppgave }) => {
	const før = await hentAktivReservasjon(request, reservertOppgave);
	const nyDato = dayjs(før.reservertTil).add(14, 'day');
	const begrunnelse = 'Flytter testoppgaven til en annen saksbehandler';
	await page.goto('/k9');
	await åpneHandlinger(page, reservertOppgave.saksnummer);
	await page.getByRole('menuitem', { name: 'Endre og/eller flytte reservasjon' }).click();
	const dialog = page.getByRole('dialog', { name: 'Endre reservasjon', exact: true });
	await dialog.getByRole('combobox', { name: 'Velg saksbehandler', exact: true }).fill('Lars');
	await page.getByRole('option', { name: 'Saksbehandler Lars', exact: true }).click();
	await dialog.getByLabel('Velg dato som reservasjonen avsluttes', { exact: true }).fill(nyDato.format('DD.MM.YYYY'));
	await dialog.getByLabel('Begrunn endring av reservasjon', { exact: true }).fill(begrunnelse);
	await dialog.getByRole('button', { name: 'Lagre', exact: true }).click();
	await expect(dialog).not.toBeVisible();

	const etter = await hentAktivReservasjon(request, reservertOppgave);
	expect(etter.reservertAvIdent).toBe('Z167457');
	expect(etter.reservertTil.slice(0, 10)).toBe(nyDato.format('YYYY-MM-DD'));
	expect(etter.kommentar).toBe(begrunnelse);
	await page.reload();
	await expect(oppgaverad(page, reservertOppgave.saksnummer)).toHaveCount(0);
	await åpneAvdelingsledersReservasjoner(page);
	await expect(oppgaverad(page, reservertOppgave.saksnummer)).toContainText('Saksbehandler Lars');
});

test('avdelingsleder kan oppheve reservasjonen', async ({ page, request, reservertOppgave }) => {
	await åpneAvdelingsledersReservasjoner(page);
	const rad = oppgaverad(page, reservertOppgave.saksnummer);
	await rad.getByRole('button', { name: 'Legg tilbake i kø', exact: true }).click();
	await page.getByRole('dialog').getByRole('button', { name: 'OK', exact: true }).click();
	await expect(rad).toHaveCount(0);
	const response = await request.get(`${reservasjonsApi}/aktiv-reservasjon`, {
		params: {
			oppgaveEksternId: reservertOppgave.oppgaveEksternId,
			oppgaveTypeEksternId: reservertOppgave.oppgaveTypeEksternId,
		},
	});
	expect(response.status()).toBe(204);
});

test('avdelingsleder kan endre dato og begrunnelse', async ({ page, request, reservertOppgave }) => {
	const før = await hentAktivReservasjon(request, reservertOppgave);
	const nyDato = dayjs(før.reservertTil).add(14, 'day');
	const begrunnelse = 'Avdelingsleder har avtalt ny reservasjonsfrist';
	await åpneAvdelingsledersReservasjoner(page);
	const rad = oppgaverad(page, reservertOppgave.saksnummer);
	await rad.getByRole('button', { name: 'Endre/flytt', exact: true }).click();
	const dialog = page.getByRole('dialog', { name: 'Endre reservasjon', exact: true });
	await dialog.getByLabel('Velg dato som reservasjonen avsluttes', { exact: true }).fill(nyDato.format('DD.MM.YYYY'));
	await dialog.getByLabel('Begrunn endring av reservasjon', { exact: true }).fill(begrunnelse);
	await dialog.getByRole('button', { name: 'Lagre', exact: true }).click();
	await expect(dialog).not.toBeVisible();

	const etter = await hentAktivReservasjon(request, reservertOppgave);
	expect(etter.reservertTil.slice(0, 10)).toBe(nyDato.format('YYYY-MM-DD'));
	expect(etter.reservertAvIdent).toBe(før.reservertAvIdent);
	expect(etter.kommentar).toBe(begrunnelse);
	await page.reload();
	await expect(rad).toContainText(nyDato.format('DD.MM.YYYY'));
});
