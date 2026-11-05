import { act, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getHentAntallOppgaverUtenReserverteISaksbehandlerkoQueryKey } from 'api/generated/los';
import { losClient } from 'api/orvalMutator';
import OppgaveTabell from 'fleromrade/saksbehandler/oppgave/OppgaveTabell';
import { innloggetBruker, lagOppgaveSammendrag } from 'fleromrade/saksbehandler/testdata';
import { lagHookWrapper, renderMedOmråde, stubNavigering } from 'fleromrade/testUtils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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
			return Array.from({ length: 10 }, () => lagOppgaveSammendrag()) as never;
		}
		return {} as never;
	});
});

afterEach(() => vi.unstubAllGlobals());

describe('reserver og åpne fra køen', () => {
	it.each([false, true])(
		'åpner fagsystemet etter at raden forsvinner, også ved lagringsfeil=%s',
		async (lagringsfeil) => {
			const user = userEvent.setup();
			const assign = stubNavigering();
			let reservert = false;
			let fullførLagring: () => void = () => {};
			const lagring = new Promise<void>((resolve) => {
				fullførLagring = resolve;
			});
			vi.mocked(losClient).mockImplementation(async ({ url, method }) => {
				if (url === antallUrl) return { antallUtenReserverte: reservert ? 0 : 1 } as never;
				if (url === oppgaverUrl) return (reservert ? [] : [lagOppgaveSammendrag()]) as never;
				if (url?.endsWith('/innlogget-bruker')) return innloggetBruker as never;
				if (url?.endsWith('/aktiv-reservasjon')) return null as never;
				if (url?.endsWith('/reservasjoner/reserver')) {
					reservert = true;
					return { erReservertAvInnloggetBruker: true } as never;
				}
				if (url?.endsWith('/siste-oppgaver') && method === 'POST') {
					await lagring;
					if (lagringsfeil) throw new Error('Kunne ikke lagre siste oppgave');
				}
				return {} as never;
			});
			const Oppgaver = () => {
				const { data } = useOppgaverIKø(1);
				return <OppgaveTabell oppgaver={data ?? []} visHandlinger />;
			};
			renderMedOmråde(<Oppgaver />);
			const knapp = await screen.findByRole('button', { name: 'Reserver oppgave ABC12' });
			await waitFor(() => expect(knapp).toBeEnabled());
			await user.click(knapp);
			await waitFor(() => expect(screen.queryByRole('row', { name: /ABC12/ })).not.toBeInTheDocument());
			expect(kallTil('/api/fleromrade/akt/saksbehandler/siste-oppgaver')).toBe(1);
			await act(async () => fullførLagring());
			await waitFor(() => expect(assign).toHaveBeenCalledWith(lagOppgaveSammendrag().oppgavebehandlingsUrl));
		},
	);
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

	it('henter neste side etter ti treff og stopper etter en kort side uavhengig av køantallet', async () => {
		antallIKø = 1;
		const oppgave = lagOppgaveSammendrag();
		vi.mocked(losClient).mockImplementation(async ({ url, params }) => {
			if (url === antallUrl) return { antallUtenReserverte: antallIKø } as never;
			if (url === oppgaverUrl)
				return (params.offset === 0 ? Array.from({ length: 10 }, () => oppgave) : [oppgave]) as never;
			return {} as never;
		});
		const { result } = renderHook(() => useOppgaverIKø(1), lagHookWrapper());
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.hasNextPage).toBe(true);
		await act(() => result.current.fetchNextPage());
		await waitFor(() => expect(result.current.hasNextPage).toBe(false));

		expect(
			vi
				.mocked(losClient)
				.mock.calls.filter(([config]) => config.url === oppgaverUrl)
				.map(([config]) => config.params),
		).toEqual([
			{ limit: 10, offset: 0 },
			{ limit: 10, offset: 10 },
		]);
		expect(result.current.data).toEqual([oppgave]);
		await waitFor(() => expect(result.current.hasNextPage).toBe(false));
	});

	it.each([1, 9])('stopper etter en første side med %i treff selv om køantallet er høyere', async (antall) => {
		antallIKø = 100;
		vi.mocked(losClient).mockImplementation(async ({ url }) => {
			if (url === antallUrl) return { antallUtenReserverte: antallIKø } as never;
			return Array.from({ length: antall }, () => lagOppgaveSammendrag()) as never;
		});
		const { result } = renderHook(() => useOppgaverIKø(1), lagHookWrapper());
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.hasNextPage).toBe(false);
		await act(() => result.current.fetchNextPage());
		expect(kallTil(oppgaverUrl)).toBe(1);
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

describe('useReserverOppgave', () => {
	it('fullfører onSuccess selv om komponenten avmonteres før reservasjonen er ferdig', async () => {
		let fullfør: () => void = () => {};
		const respons = new Promise<void>((resolve) => {
			fullfør = resolve;
		});
		vi.mocked(losClient).mockImplementation(async () => {
			await respons;
			return { erReservertAvInnloggetBruker: true } as never;
		});
		const onSuccess = vi.fn();
		const { result, unmount } = renderHook(() => useReserverOppgave(), lagHookWrapper());
		act(() => result.current.reserver(lagOppgaveSammendrag().oppgaveNøkkel, { onSuccess }));
		unmount();
		await act(async () => fullfør());
		await waitFor(() => expect(onSuccess).toHaveBeenCalledWith({ erReservertAvInnloggetBruker: true }));
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
