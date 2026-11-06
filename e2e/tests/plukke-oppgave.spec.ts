import type { OppgaveSammendragDto } from '../../src/client/app/api/generated/los.schemas.js';
import { expect, hentAktivReservasjon, reservasjonsApi, test } from '../fixtures/testdata.js';

test('kan plukke sin egen testoppgave fra en avgrenset kø', async ({ page, request, oppgave, annenOppgave, køer }) => {
	const kø = await køer.opprettForOppgave(oppgave);
	const response = await request.get(`/api/k9-los-api/fleromrade/k9/saksbehandler/oppgaveko/${kø.id}/oppgaver-i-koen`);
	expect(response.status(), await response.text()).toBe(200);
	const oppgaver: OppgaveSammendragDto[] = await response.json();
	expect(oppgaver).toHaveLength(1);
	expect(oppgaver[0].oppgaveNøkkel.oppgaveEksternId).toBe(oppgave.oppgaveEksternId);
	const mål = oppgaver[0].oppgavebehandlingsUrl;
	if (!mål) throw new Error('Testoppgaven mangler navigasjonsmål');
	expect(new URL(mål).pathname).toContain(`/fagsak/${oppgave.saksnummer}/`);

	// Siste oppgaver er utenfor testens formål og kan ellers skyve ut utviklerens historikk for Sara.
	await page.route('**/api/k9-los-api/ny-oppgavestyring/siste-oppgaver', (route) =>
		route.request().method() === 'POST' ? route.fulfill({ status: 200, json: null }) : route.continue(),
	);
	// Reserveringen bruker ekte backend. Navigasjonsmålet verifiseres uten å starte k9-sak-web.
	await page.route(mål, (route) =>
		route.fulfill({ contentType: 'text/html; charset=utf-8', body: '<h1>Fagsak åpnet</h1>' }),
	);
	await page.goto('/k9');
	await page.getByLabel('Velg oppgavekø', { exact: true }).selectOption({ label: kø.tittel });
	await page.getByRole('button', { name: 'Gi meg neste oppgave i køen', exact: true }).click();
	await expect(page).toHaveURL(mål);
	await expect(page.getByRole('heading', { name: 'Fagsak åpnet', exact: true })).toBeVisible();
	const reservasjon = await hentAktivReservasjon(request, oppgave);
	expect(reservasjon.reservertAvIdent).toBe('Z123456');
	const annenReservasjon = await request.get(`${reservasjonsApi}/aktiv-reservasjon`, {
		params: {
			oppgaveEksternId: annenOppgave.oppgaveEksternId,
			oppgaveTypeEksternId: annenOppgave.oppgaveTypeEksternId,
		},
	});
	expect(annenReservasjon.status()).toBe(204);
	await page.goto('/k9');
	await expect(
		page.getByRole('row').filter({ has: page.getByText(oppgave.saksnummer, { exact: true }) }),
	).toBeVisible();
});
