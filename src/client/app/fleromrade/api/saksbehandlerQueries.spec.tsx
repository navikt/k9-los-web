import { act, renderHook, waitFor } from '@testing-library/react';
import { getHentAntallOppgaverUtenReserverteISaksbehandlerkoQueryKey } from 'api/generated/los';
import { losClient } from 'api/orvalMutator';
import { lagOppgaveSammendrag } from 'fleromrade/saksbehandler/testdata';
import { lagHookWrapper } from 'fleromrade/testUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useOppgaverIKø, useReserverOppgave } from './saksbehandlerQueries';

// Den genererte koden kaller fetch-funksjonene internt i modulen, så vi mocker klienten under dem.
vi.mock('api/orvalMutator', async (importOriginal) => ({
	...(await importOriginal<typeof import('api/orvalMutator')>()),
	losClient: vi.fn(),
}));

const antallUrl = '/api/wip/akt/saksbehandler/oppgaveko/1/antall-uten-reserverte';
const oppgaverUrl = '/api/wip/akt/saksbehandler/oppgaveko/1/oppgaver-i-koen';

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
			return [] as never;
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
});
