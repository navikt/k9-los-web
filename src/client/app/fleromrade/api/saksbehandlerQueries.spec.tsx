import { act, renderHook, waitFor } from '@testing-library/react';
import { getHentAntallOppgaverUtenReserverteISaksbehandlerkoQueryKey } from 'api/generated/los';
import { losClient } from 'api/orvalMutator';
import { lagOppgaveSammendrag } from 'fleromrade/saksbehandler/testdata';
import { lagHookWrapper } from 'fleromrade/testUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useOppgaverIKø, useReserverOppgave, useReserverOppgaveForSaksbehandler } from './saksbehandlerQueries';

// Den genererte koden kaller fetch-funksjonene internt i modulen, så vi mocker klienten under dem.
vi.mock('api/orvalMutator', async (importOriginal) => ({
	...(await importOriginal<typeof import('api/orvalMutator')>()),
	losClient: vi.fn(),
}));

const antallUrl = '/api/fleromrade/akt/saksbehandler/oppgaveko/1/antall-uten-reserverte';
const oppgaverUrl = '/api/fleromrade/akt/saksbehandler/oppgaveko/1/oppgaver-i-koen';

let antallIKø = 5;

const kallTil = (url: string) => vi.mocked(losClient).mock.calls.filter(([config]) => config.url === url).length;

beforeEach(() => {
	vi.clearAllMocks();
	antallIKø = 5;
	vi.mocked(losClient).mockImplementation(async ({ url }) => {
		if (url === antallUrl) {
			return { antallUtenReserverte: antallIKø } as never;
		}
		if (url === oppgaverUrl) {
			return [lagOppgaveSammendrag()] as never;
		}
		return {} as never;
	});
});

const renderOppgaverIKø = () => {
	const { wrapper, queryClient } = lagHookWrapper();
	const hook = renderHook(() => ({ oppgaver: useOppgaverIKø(1), reservasjon: useReserverOppgave() }), { wrapper });
	const hentAntallPåNytt = () =>
		act(() =>
			queryClient.refetchQueries({ queryKey: getHentAntallOppgaverUtenReserverteISaksbehandlerkoQueryKey('akt', 1) }),
		);
	return { ...hook, hentAntallPåNytt };
};

describe('useOppgaverIKø', () => {
	it('henter neste oppgaver på nytt når antallet i køen endrer seg', async () => {
		const { result, hentAntallPåNytt } = renderOppgaverIKø();
		await waitFor(() => expect(result.current.oppgaver.isSuccess).toBe(true));
		expect(kallTil(oppgaverUrl)).toBe(1);

		antallIKø = 6;
		await hentAntallPåNytt();

		await waitFor(() => expect(kallTil(oppgaverUrl)).toBe(2));
	});

	it('lar neste oppgaver være når antallet er uendret', async () => {
		const { result, hentAntallPåNytt } = renderOppgaverIKø();
		await waitFor(() => expect(result.current.oppgaver.isSuccess).toBe(true));

		await hentAntallPåNytt();

		expect(kallTil(antallUrl)).toBe(2);
		expect(kallTil(oppgaverUrl)).toBe(1);
	});

	it('henter neste oppgaver og antallet på nytt etter egen reservasjon', async () => {
		const { result } = renderOppgaverIKø();
		await waitFor(() => expect(result.current.oppgaver.isSuccess).toBe(true));

		act(() => result.current.reservasjon.reserver(lagOppgaveSammendrag().oppgaveNøkkel));

		await waitFor(() => expect(kallTil(oppgaverUrl)).toBe(2));
		expect(kallTil(antallUrl)).toBe(2);
	});

	it('fortsetter etter korte sider uavhengig av køantallet og stopper ved en tom side', async () => {
		antallIKø = 1;
		const oppgave = lagOppgaveSammendrag();
		vi.mocked(losClient).mockImplementation(async ({ url, params }) => {
			if (url === antallUrl) return { antallUtenReserverte: antallIKø } as never;
			if (url === oppgaverUrl) return (params.offset === 20 ? [] : [oppgave]) as never;
			return {} as never;
		});
		const { result } = renderHook(() => useOppgaverIKø(1), lagHookWrapper());
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.hasNextPage).toBe(true);
		await act(() => result.current.fetchNextPage());
		expect(result.current.hasNextPage).toBe(true);
		await act(() => result.current.fetchNextPage());

		expect(
			vi
				.mocked(losClient)
				.mock.calls.filter(([config]) => config.url === oppgaverUrl)
				.map(([config]) => config.params),
		).toEqual([
			{ limit: 10, offset: 0 },
			{ limit: 10, offset: 10 },
			{ limit: 10, offset: 20 },
		]);
		expect(result.current.data).toEqual([oppgave]);
		await waitFor(() => expect(result.current.hasNextPage).toBe(false));
	});

	it('stopper ved en tom første side selv om køantallet sier at det finnes oppgaver', async () => {
		antallIKø = 100;
		vi.mocked(losClient).mockImplementation(async ({ url }) => {
			if (url === antallUrl) return { antallUtenReserverte: antallIKø } as never;
			return [] as never;
		});
		const { result } = renderHook(() => useOppgaverIKø(1), lagHookWrapper());
		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(result.current.data).toEqual([]);
		expect(result.current.hasNextPage).toBe(false);
		await act(() => result.current.fetchNextPage());
		expect(kallTil(oppgaverUrl)).toBe(1);
	});

	it('henter alle innlastede sider på nytt fra starten etter reservasjon', async () => {
		antallIKø = 25;
		const { result } = renderOppgaverIKø();
		await waitFor(() => expect(result.current.oppgaver.isSuccess).toBe(true));
		await act(() => result.current.oppgaver.fetchNextPage());
		await act(() => result.current.oppgaver.fetchNextPage());
		vi.mocked(losClient).mockClear();

		act(() => result.current.reservasjon.reserver(lagOppgaveSammendrag().oppgaveNøkkel));
		await waitFor(() => expect(kallTil(oppgaverUrl)).toBe(3));
		expect(
			vi
				.mocked(losClient)
				.mock.calls.filter(([config]) => config.url === oppgaverUrl)
				.map(([config]) => config.params.offset),
		).toEqual([0, 10, 20]);
	});

	it('nullstiller innlastede sider når brukeren bytter tilbake til en kø', async () => {
		antallIKø = 25;
		const { result, rerender } = renderHook(({ køId }) => useOppgaverIKø(køId), {
			...lagHookWrapper(),
			initialProps: { køId: 1 },
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		await act(() => result.current.fetchNextPage());
		rerender({ køId: 2 });
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		rerender({ køId: 1 });
		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(
			vi
				.mocked(losClient)
				.mock.calls.filter(([config]) => config.url === oppgaverUrl)
				.map(([config]) => config.params.offset),
		).toEqual([0, 10, 0]);
	});
});

describe('useReserverOppgaveForSaksbehandler', () => {
	it('sender oppgavenøkkel og navident og oppdaterer køinnhold etter reservasjon', async () => {
		const { result } = renderHook(
			() => ({
				oppgaver: useOppgaverIKø(1),
				reservasjon: useReserverOppgaveForSaksbehandler(),
			}),
			lagHookWrapper(),
		);
		await waitFor(() => expect(result.current.oppgaver.isSuccess).toBe(true));
		act(() => result.current.reservasjon.reserver(lagOppgaveSammendrag().oppgaveNøkkel, 'Z167457'));
		await waitFor(() => expect(result.current.reservasjon.isSuccess).toBe(true));

		expect(losClient).toHaveBeenCalledWith(
			expect.objectContaining({
				url: '/api/fleromrade/akt/saksbehandler/reservasjoner/reserver-for-saksbehandler',
				method: 'POST',
				data: { navident: 'Z167457', oppgaveNøkkel: { oppgaveEksternId: 'oppgave-1', oppgaveTypeEksternId: 'k9sak' } },
			}),
			undefined,
		);
		expect(kallTil(oppgaverUrl)).toBe(2);
		expect(kallTil(antallUrl)).toBe(2);
	});

	it('beholder køinnhold ved reservasjonsfeil', async () => {
		const { result } = renderHook(
			() => ({
				oppgaver: useOppgaverIKø(1),
				reservasjon: useReserverOppgaveForSaksbehandler(),
			}),
			lagHookWrapper(),
		);
		await waitFor(() => expect(result.current.oppgaver.isSuccess).toBe(true));
		vi.mocked(losClient).mockRejectedValueOnce(new Error('Ingen tilgang'));
		act(() => result.current.reservasjon.reserver(lagOppgaveSammendrag().oppgaveNøkkel, 'Z167457'));
		await waitFor(() => expect(result.current.reservasjon.isError).toBe(true));

		expect(kallTil(oppgaverUrl)).toBe(1);
		expect(kallTil(antallUrl)).toBe(1);
	});
});
