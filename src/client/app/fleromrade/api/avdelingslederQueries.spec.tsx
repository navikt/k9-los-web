import { renderHook, waitFor } from '@testing-library/react';
import {
	endreOppgavekoSomAvdelingsleder,
	hentAlleOppgavekoerForAvdelingsleder,
	hentLagredeSok,
	hentStandardOppgaveQuery,
	opprettLagretSok,
	opprettUttrekk,
	validerOppgaveQuery,
} from 'api/generated/los';
import type { OppgaveQuery } from 'filter/filterTsTypes';
import { lagHookWrapper } from 'fleromrade/testUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	useAlleKoer,
	useHentLagredeSøk,
	useLastNedUttrekkCsvLenke,
	useOppdaterKøMutation,
	useOpprettLagretSøk,
	useOpprettUttrekk,
} from './avdelingslederQueries';
import { useValiderOppgaveQuery } from './oppgaveQueries';

vi.mock('api/generated/los', async (importOriginal) => {
	const original = await importOriginal<typeof import('api/generated/los')>();
	return {
		...original,
		endreOppgavekoSomAvdelingsleder: vi.fn(),
		hentAlleOppgavekoerForAvdelingsleder: vi.fn(),
		hentLagredeSok: vi.fn(),
		hentStandardOppgaveQuery: vi.fn(),
		opprettLagretSok: vi.fn(),
		opprettUttrekk: vi.fn(),
		validerOppgaveQuery: vi.fn(),
	};
});

// Formen backend faktisk sender, med `type` og strengverdier.
const query: OppgaveQuery = {
	filtere: [{ type: 'feltverdi', område: null, kode: 'oppgavestatus', operator: 'IN', verdi: ['AAPEN'] }],
	select: [],
	order: [{ type: 'enkel', område: 'K9', kode: 'mottattDato', økende: true }],
};

beforeEach(() => {
	vi.mocked(hentStandardOppgaveQuery).mockResolvedValue(query as never);
});

describe('avdelingslederQueries', () => {
	it('henter køer for området og gjør id-ene om til strenger', async () => {
		vi.mocked(hentAlleOppgavekoerForAvdelingsleder).mockResolvedValue([
			{ id: 1, tittel: 'Alfa', sistEndret: '2026-09-17T14:05:39', antallSaksbehandlere: 2 },
		] as never);

		const { result } = renderHook(() => useAlleKoer(), lagHookWrapper());

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(hentAlleOppgavekoerForAvdelingsleder).toHaveBeenCalledWith('akt', undefined, expect.anything());
		expect(result.current.data).toEqual([
			{ id: '1', tittel: 'Alfa', sistEndret: '2026-09-17T14:05:39', antallSaksbehandlere: 2 },
		]);
	});

	it('lagrer kø med numerisk id og området fra konteksten', async () => {
		vi.mocked(endreOppgavekoSomAvdelingsleder).mockResolvedValue({ id: 7 } as never);
		const lagret = vi.fn();
		const { result } = renderHook(() => useOppdaterKøMutation(lagret), lagHookWrapper());

		result.current.mutate({
			id: '7',
			versjon: 3,
			tittel: 'Alfa',
			beskrivelse: '',
			oppgaveQuery: query,
			frittValgAvOppgave: false,
			saksbehandlerIds: [1],
			saksbehandlere: [],
			endretTidspunkt: undefined,
			skjermet: false,
		});

		await waitFor(() => expect(lagret).toHaveBeenCalled());
		expect(endreOppgavekoSomAvdelingsleder).toHaveBeenCalledWith(
			'akt',
			expect.objectContaining({ id: 7, område: 'AKTIVITETSPENGER', oppgaveQuery: query }),
		);
	});

	it('beholder query-formen fra backend for lagrede søk', async () => {
		vi.mocked(hentLagredeSok).mockResolvedValue([{ id: 1, tittel: 'Søk', query }] as never);

		const { result } = renderHook(() => useHentLagredeSøk(), lagHookWrapper());

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data[0].query).toEqual(query);
	});

	it('oppretter lagret søk med standardkriteriene, siden ny API ikke har eget opprett-endepunkt', async () => {
		vi.mocked(opprettLagretSok).mockResolvedValue(5 as never);
		const opprettet = vi.fn();
		const { result } = renderHook(() => useOpprettLagretSøk(opprettet), lagHookWrapper());

		result.current.mutate({ tittel: 'Nytt søk' });

		await waitFor(() => expect(opprettet).toHaveBeenCalled());
		expect(hentStandardOppgaveQuery).toHaveBeenCalledWith('akt');
		expect(opprettLagretSok).toHaveBeenCalledWith('akt', { tittel: 'Nytt søk', query });
	});

	it('sender tittel når uttrekk opprettes', async () => {
		vi.mocked(opprettUttrekk).mockResolvedValue(3 as never);
		const { result } = renderHook(() => useOpprettUttrekk(), lagHookWrapper());

		result.current.mutate({ lagretSokId: 5, tittel: 'Nytt søk', limit: 10, offset: 0 });

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(opprettUttrekk).toHaveBeenCalledWith('akt', { lagretSokId: 5, tittel: 'Nytt søk', limit: 10, offset: 0 });
	});

	it('lenker CSV-nedlasting via proxyen', () => {
		const { result } = renderHook(() => useLastNedUttrekkCsvLenke(), lagHookWrapper());

		expect(result.current(3)).toBe('/api/k9-los-api/fleromrade/akt/avdelingsleder/uttrekk/3/csv');
	});

	it('validerer kriterier mot området', async () => {
		vi.mocked(validerOppgaveQuery).mockResolvedValue(true as never);
		const { result } = renderHook(() => useValiderOppgaveQuery(), lagHookWrapper());

		result.current.mutate(query);

		await waitFor(() => expect(result.current.data).toBe(true));
		expect(validerOppgaveQuery).toHaveBeenCalledWith('akt', query);
	});
});
