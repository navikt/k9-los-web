import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type {
	FerdigstiltePerEnhetResponse,
	InngangOgFerdigstilteKortDto,
	InngangOgFerdigstilteResponse,
	StatusFordelingResponse,
} from 'api/generated/los.schemas';
import { losClient } from 'api/orvalMutator';
import { AxiosError, type AxiosResponse } from 'axios';
import { nøkkeltallQueryOptions } from 'fleromrade/api/nøkkeltallQueryOptions';
import { OmrådeProvider } from 'fleromrade/OmrådeContext';
import type { Område } from 'fleromrade/områder';
import { renderMedOmråde } from 'fleromrade/testUtils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import FerdigstiltePerEnhet from './FerdigstiltePerEnhet';
import InngangOgFerdigstilte from './InngangOgFerdigstilte';
import Nøkkeltall from './Nøkkeltall';
import { StatusFordeling } from './StatusFordeling';

vi.mock('api/orvalMutator', () => ({ losClient: vi.fn() }));
vi.mock('sharedComponents/echart/ReactEcharts', () => ({ default: () => <div>Enhetsgraf</div> }));
vi.mock('filter/KøKriterieViewer', () => ({ default: () => <div>Søkekriterier</div> }));

const httpFeil = (status: number) =>
	new AxiosError('Feil fra backend', undefined, undefined, undefined, { status } as AxiosResponse);
const kort = (verdi: number): InngangOgFerdigstilteKortDto => ({
	hovedtall: { verdi, visningsnavn: 'Oppgaver' },
	linjer: [],
});
const inngangOgFerdigstilte: InngangOgFerdigstilteResponse = {
	oppdatertTidspunkt: '2026-10-21T12:00:00',
	hovedgrupper: [
		{ kode: 'ALLE', navn: 'Alle' },
		{ kode: 'PPN', navn: 'Pleiepenger i livets sluttfase' },
	],
	undergrupper: [{ kode: 'TOTALT', navn: 'Totalt' }],
	tall: [
		{
			hovedgruppe: 'ALLE',
			undergruppe: 'TOTALT',
			månedSerier: {},
			serier: {
				idag: { first: kort(11), second: kort(12) },
				sisteUke: { first: kort(21), second: kort(22) },
				siste2Uker: { first: kort(35), second: kort(36) },
				siste4Uker: { first: kort(41), second: kort(42) },
			},
		},
		{
			hovedgruppe: 'PPN',
			undergruppe: 'TOTALT',
			månedSerier: {},
			serier: { idag: { first: kort(31), second: kort(32) } },
		},
	],
};
const ferdigstilte: FerdigstiltePerEnhetResponse = {
	oppdatertTidspunkt: '2026-10-21T12:00:00',
	grupper: [
		{ kode: 'ALLE', navn: 'Alle' },
		{ kode: 'PPN', navn: 'Pleiepenger i livets sluttfase' },
	],
	kolonner: ['Enhet'],
	serier: [{ navn: 'Ferdigstilte', data: [10] }],
};
const statusfordeling: StatusFordelingResponse = {
	oppdatertTidspunkt: '2026-10-21T12:00:00',
	tall: [
		{
			tittel: { kode: 'ALLE', navn: 'Alle behandlinger' },
			topplinje: { verdi: 10, visningsnavn: 'Behandlinger', kildespørring: { filtere: [], order: [], select: [] } },
			linjer: [],
			bunnlinje: { verdi: 2, visningsnavn: 'På vent', kildespørring: { filtere: [], order: [], select: [] } },
		},
	],
};

describe('Nøkkeltall for flerområde', () => {
	beforeEach(() => {
		vi.mocked(losClient).mockReset();
	});
	afterEach(() => vi.useRealTimers());

	it.each([
		{ område: 'K9', segment: 'k9' },
		{ område: 'AKTIVITETSPENGER', segment: 'akt' },
	] as const)(
		'kaller alle nye endepunkt for $segment og skjuler komponentene ved 501 uten retry eller polling',
		async ({ område, segment }) => {
			vi.useFakeTimers();
			vi.mocked(losClient).mockRejectedValue(httpFeil(501));
			renderMedOmråde(
				<>
					<StatusFordeling />
					<Nøkkeltall />
				</>,
				{ område },
			);
			await act(async () => vi.advanceTimersByTimeAsync(0));
			expect(losClient).toHaveBeenCalledTimes(3);
			for (const endepunkt of ['statusfordeling', 'inngang-og-ferdigstilte', 'ferdigstilte-per-enhet']) {
				expect(losClient).toHaveBeenCalledWith(
					expect.objectContaining({ url: `/api/wip/${segment}/avdelingsleder/nokkeltall/${endepunkt}` }),
					undefined,
				);
			}
			await act(async () => vi.advanceTimersByTimeAsync(120_000));
			expect(losClient).toHaveBeenCalledTimes(3);
			expect(screen.queryByRole('heading')).not.toBeInTheDocument();
			expect(screen.queryByText(/Kunne ikke hente/)).not.toBeInTheDocument();
			expect(screen.queryByText('Ingen data for øyeblikket')).not.toBeInTheDocument();
		},
	);

	it.each(['K9', 'AKTIVITETSPENGER'] as const)('viser og filtrerer inngang og ferdigstilte for %s', async (område) => {
		const user = userEvent.setup();
		vi.mocked(losClient).mockResolvedValue(inngangOgFerdigstilte);
		renderMedOmråde(<InngangOgFerdigstilte />, { område });
		expect(await screen.findByText('41')).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: 'Inngang og ferdigstilte' })).toBeInTheDocument();
		expect(screen.getByRole('radio', { name: 'Siste 4 uker' })).toBeChecked();
		expect(screen.getAllByRole('radio').map((valg) => valg.textContent)).toEqual([
			'I dag',
			'Siste uke',
			'Siste 2 uker',
			'Siste 4 uker',
		]);
		await user.click(screen.getByRole('radio', { name: 'Siste uke' }));
		expect(screen.getByText('21')).toBeInTheDocument();
		await user.selectOptions(screen.getByRole('combobox', { name: 'Valgt ytelse' }), 'PPN');
		expect(screen.getByText('31')).toBeInTheDocument();
		expect(screen.getByRole('radio', { name: 'I dag' })).toBeChecked();
		expect(losClient).toHaveBeenCalledTimes(1);
	});

	it('sender valgt gruppe og antall uker til backend', async () => {
		const user = userEvent.setup();
		vi.mocked(losClient).mockResolvedValue(ferdigstilte);
		renderMedOmråde(<FerdigstiltePerEnhet />, { område: 'K9' });
		expect(await screen.findByText('Enhetsgraf')).toBeInTheDocument();
		await user.selectOptions(screen.getByRole('combobox', { name: 'Valgt ytelse' }), 'PPN');
		await user.click(screen.getByRole('radio', { name: 'Siste 4 uker' }));
		await waitFor(() =>
			expect(losClient).toHaveBeenLastCalledWith(
				expect.objectContaining({ params: { gruppe: 'PPN', uker: 4 } }),
				undefined,
			),
		);
	});

	it('viser statuskort og søkekriteriene for en statuslinje', async () => {
		const user = userEvent.setup();
		vi.mocked(losClient).mockResolvedValue(statusfordeling);
		renderMedOmråde(<StatusFordeling />);
		expect(await screen.findByText('Alle behandlinger')).toBeInTheDocument();
		await user.click(screen.getByRole('button', { name: '10 Behandlinger' }));
		expect(screen.getByText('Søkekriterier')).toBeInTheDocument();
	});

	it.each([
		{ åpne: 16, totalt: 16 },
		{ åpne: 0, totalt: 0 },
		{ åpne: 10, totalt: 16 },
	])('viser totalt bare når antallet avviker fra åpne (%j)', async ({ åpne, totalt }) => {
		const kort = statusfordeling.tall[0];
		vi.mocked(losClient).mockResolvedValue({
			...statusfordeling,
			tall: [
				{
					...kort,
					topplinje: { ...kort.topplinje, verdi: åpne, visningsnavn: 'åpne' },
					bunnlinje: { ...kort.bunnlinje, verdi: totalt, visningsnavn: 'totalt' },
				},
			],
		} satisfies StatusFordelingResponse);
		renderMedOmråde(<StatusFordeling />);
		expect(await screen.findByRole('button', { name: `${åpne} åpne` })).toBeInTheDocument();
		if (åpne === totalt) {
			expect(screen.queryByRole('button', { name: `${totalt} totalt` })).not.toBeInTheDocument();
		} else {
			expect(screen.getByRole('button', { name: `${totalt} totalt` })).toBeInTheDocument();
		}
	});

	it('skjuler bare komponenten som returnerer 501', async () => {
		vi.mocked(losClient).mockImplementation((config) =>
			config.url?.endsWith('inngang-og-ferdigstilte') ? Promise.reject(httpFeil(501)) : Promise.resolve(ferdigstilte),
		);
		renderMedOmråde(<Nøkkeltall />);
		expect(await screen.findByText('Enhetsgraf')).toBeInTheDocument();
		expect(screen.queryByRole('heading', { name: 'Inngang og ferdigstilte' })).not.toBeInTheDocument();
	});

	it.each([
		{ Komponent: InngangOgFerdigstilte, melding: 'Kunne ikke hente inngang og ferdigstilte' },
		{ Komponent: FerdigstiltePerEnhet, melding: 'Kunne ikke hente ferdigstilte per enhet' },
		{ Komponent: StatusFordeling, melding: 'Kunne ikke hente statusfordelingen' },
	])('viser andre feil: $melding', async ({ Komponent, melding }) => {
		vi.mocked(losClient).mockRejectedValue(httpFeil(500));
		const client = new QueryClient({ defaultOptions: { queries: { retryDelay: 0 } } });
		render(
			<QueryClientProvider client={client}>
				<OmrådeProvider område="K9">
					<Komponent />
				</OmrådeProvider>
			</QueryClientProvider>,
		);
		expect(await screen.findByText(melding)).toBeInTheDocument();
	});

	it('viser ikke gamle K9-tall ved bytte til et område som returnerer 501', async () => {
		vi.mocked(losClient).mockImplementation((config) =>
			config.url?.includes('/k9/') ? Promise.resolve(inngangOgFerdigstilte) : Promise.reject(httpFeil(501)),
		);
		const client = new QueryClient();
		const vis = (område: Område) => (
			<QueryClientProvider client={client}>
				<OmrådeProvider område={område}>
					<InngangOgFerdigstilte />
				</OmrådeProvider>
			</QueryClientProvider>
		);
		const { rerender } = render(vis('K9'));
		expect(await screen.findByText('41')).toBeInTheDocument();
		rerender(vis('AKTIVITETSPENGER'));
		expect(screen.queryByText('41')).not.toBeInTheDocument();
		await waitFor(() => expect(losClient).toHaveBeenCalledTimes(2));
		expect(screen.queryByRole('heading')).not.toBeInTheDocument();
	});

	it('beholder retry og polling for andre feil', () => {
		expect(nøkkeltallQueryOptions.retry(0, httpFeil(501))).toBe(false);
		expect(nøkkeltallQueryOptions.retry(0, httpFeil(500))).toBe(true);
		expect(nøkkeltallQueryOptions.retry(3, httpFeil(500))).toBe(false);
		expect(nøkkeltallQueryOptions.refetchInterval({ state: { error: httpFeil(501) } })).toBe(false);
		expect(nøkkeltallQueryOptions.refetchInterval({ state: { error: httpFeil(500) } })).toBe(60_000);
	});
});
