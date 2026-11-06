import { randomUUID } from 'node:crypto';
import { type APIRequestContext, test as base, expect } from '@playwright/test';
import type {
	OppgaveKo,
	ReservasjonsinfoDto,
	SaksbehandlerForKolisteDto,
} from '../../src/client/app/api/generated/los.schemas.js';

export interface Testoppgave {
	id: string;
	saksnummer: string;
	oppgaveEksternId: string;
	oppgaveTypeEksternId: string;
}

export const reservasjonsApi = '/api/k9-los-api/fleromrade/k9/saksbehandler/reservasjoner';
export const køApi = '/api/k9-los-api/fleromrade/k9/avdelingsleder/oppgaveko';
const testdataApi = '/api/k9-los-api/testdata';

interface Køoppsett {
	registrer: (kø: OppgaveKo) => void;
	opprettForOppgave: (oppgave: Testoppgave) => Promise<OppgaveKo>;
}

export async function hentAktivReservasjon(
	request: APIRequestContext,
	oppgave: Testoppgave,
): Promise<ReservasjonsinfoDto> {
	const response = await request.get(`${reservasjonsApi}/aktiv-reservasjon`, {
		params: {
			oppgaveEksternId: oppgave.oppgaveEksternId,
			oppgaveTypeEksternId: oppgave.oppgaveTypeEksternId,
		},
	});
	expect(response.status(), await response.text()).toBe(200);
	return response.json();
}

async function medTestoppgave(
	{ request }: { request: APIRequestContext },
	use: (oppgave: Testoppgave) => Promise<void>,
) {
	const response = await request.post(`${testdataApi}/oppgaver`, { data: {} });
	expect(response.status(), await response.text()).toBe(201);
	const oppgave: Testoppgave = await response.json();
	try {
		await use(oppgave);
	} finally {
		const cleanup = await request.delete(`${testdataApi}/oppgaver/${oppgave.id}`);
		expect(cleanup.status(), 'Kunne ikke rydde testens egen oppgave').toBe(204);
	}
}

export const test = base.extend<{
	backendKlar: undefined;
	oppgave: Testoppgave;
	annenOppgave: Testoppgave;
	reservertOppgave: Testoppgave;
	køer: Køoppsett;
}>({
	backendKlar: [
		async ({ request }, use) => {
			// Kontroller dev-oppsettet før også tester uten oppgaver får endre køer.
			const ready = await request.get(`${testdataApi}/ready`);
			expect(
				ready.status(),
				'Start K9LosDev fra k9-los-api med testdatastøtte og frontend med pnpm dev. Ingen verdikjedetjenester skal startes av testen.',
			).toBe(200);
			expect(await ready.text(), 'Forventet testdata-API-et, ikke en innloggingsside eller frontend-fallback').toBe('');
			await use(undefined);
		},
		{ auto: true },
	],
	køer: async ({ request }, use) => {
		const egneKøer = new Set<string>();
		try {
			await use({
				registrer: (kø) => egneKøer.add(String(kø.id)),
				opprettForOppgave: async (oppgave) => {
					const response = await request.post(`${køApi}/opprett`, { data: { tittel: `E2E plukk ${randomUUID()}` } });
					expect(response.status(), await response.text()).toBe(200);
					const kø: OppgaveKo = await response.json();
					egneKøer.add(String(kø.id));
					const saksbehandlereResponse = await request.get(`${køApi}/alle-saksbehandlere`);
					expect(saksbehandlereResponse.status()).toBe(200);
					const saksbehandlere: SaksbehandlerForKolisteDto[] = await saksbehandlereResponse.json();
					const sara = saksbehandlere.find((saksbehandler) => saksbehandler.epost === 'saksbehandler.sara@nav.no');
					if (!sara) throw new Error('Fant ikke den lokale saksbehandleren Sara');
					const endret = await request.post(`${køApi}/endre`, {
						data: {
							...kø,
							beskrivelse: 'Treffer bare oppgaven som denne testen har opprettet',
							saksbehandlerIds: [sara.id],
							oppgaveQuery: {
								...kø.oppgaveQuery,
								filtere: [
									{
										type: 'feltverdi',
										område: 'K9',
										kode: 'behandlingUuid',
										operator: 'EQUALS',
										verdi: [oppgave.oppgaveEksternId],
									},
								],
							},
						},
					});
					expect(endret.status(), await endret.text()).toBe(200);
					return endret.json();
				},
			});
		} finally {
			const listeResponse = await request.get(`${køApi}/alle-koer`);
			expect(listeResponse.status(), 'Kunne ikke kontrollere hvilke testkøer som fortsatt finnes').toBe(200);
			const eksisterende: { id: number }[] = await listeResponse.json();
			for (const id of egneKøer) {
				if (!eksisterende.some((kø) => String(kø.id) === id)) continue;
				const response = await request.delete(`${køApi}/${id}`);
				expect.soft(response.status(), `Kunne ikke rydde testens egen kø ${id}`).toBe(200);
			}
		}
	},
	oppgave: medTestoppgave,
	annenOppgave: medTestoppgave,
	reservertOppgave: async ({ request, oppgave }, use) => {
		const response = await request.post(`${reservasjonsApi}/reserver`, {
			data: {
				oppgaveEksternId: oppgave.oppgaveEksternId,
				oppgaveTypeEksternId: oppgave.oppgaveTypeEksternId,
			},
		});
		expect(response.status(), await response.text()).toBe(200);
		await use(oppgave);
	},
});

export { expect } from '@playwright/test';
