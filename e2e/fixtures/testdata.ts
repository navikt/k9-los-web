import { test as base, expect } from '@playwright/test';

interface Testoppgave {
	id: string;
	saksnummer: string;
	oppgaveEksternId: string;
	oppgaveTypeEksternId: string;
}

export const reservasjonsApi = '/api/k9-los-api/fleromrade/k9/saksbehandler/reservasjoner';
const testdataApi = '/api/k9-los-api/testdata';

export const test = base.extend<{ oppgave: Testoppgave; reservertOppgave: Testoppgave }>({
	oppgave: async ({ request }, use) => {
		const ready = await request.get(`${testdataApi}/ready`);
		expect(
			ready.status(),
			'Start K9LosDev fra k9-los-api med testdatastøtte og frontend med pnpm dev. Ingen verdikjedetjenester skal startes av testen.',
		).toBe(200);

		const response = await request.post(`${testdataApi}/oppgaver`, { data: {} });
		expect(response.status(), await response.text()).toBe(201);
		const oppgave: Testoppgave = await response.json();
		try {
			await use(oppgave);
		} finally {
			const cleanup = await request.delete(`${testdataApi}/oppgaver/${oppgave.id}`);
			expect(cleanup.status(), 'Kunne ikke rydde testens egen oppgave').toBe(204);
		}
	},
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
