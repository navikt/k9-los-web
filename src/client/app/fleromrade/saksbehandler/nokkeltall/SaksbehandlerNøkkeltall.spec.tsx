import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { NyeOgFerdigstilteResponse } from 'api/generated/los.schemas';
import { losClient } from 'api/orvalMutator';
import { AxiosError, type AxiosResponse } from 'axios';
import { OmrådeProvider } from 'fleromrade/OmrådeContext';
import type { Område } from 'fleromrade/områder';
import { renderMedOmråde } from 'fleromrade/testUtils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SaksbehandlerNøkkeltall from './SaksbehandlerNøkkeltall';

vi.mock('api/orvalMutator', () => ({ losClient: vi.fn() }));
vi.mock('sharedComponents/echart/ReactEcharts', () => ({ default: () => <div>Nøkkeltallgraf</div> }));

const data: NyeOgFerdigstilteResponse = {
	oppdatertTidspunkt: '2026-10-22T10:00:00',
	grupper: [
		{ kode: 'ALLE', navn: 'Alle' },
		{ kode: 'DEL_1', navn: 'Del 1' },
	],
	kolonner: ['21.10', '22.10'],
	serier: [
		{ navn: 'Nye', data: [10, 12] },
		{ navn: 'Ferdigstilte', data: [8, 9] },
	],
};
const httpFeil = (status: number) =>
	new AxiosError('Feil fra backend', undefined, undefined, undefined, { status } as AxiosResponse);

describe('SaksbehandlerNøkkeltall', () => {
	beforeEach(() => {
		vi.mocked(losClient).mockReset();
	});
	afterEach(() => {
		vi.useRealTimers();
	});

	it.each([
		{ område: 'K9', segment: 'k9' },
		{ område: 'AKTIVITETSPENGER', segment: 'akt' },
	] as const)('bruker det nye endepunktet og viser grafen for $segment', async ({ område, segment }) => {
		vi.mocked(losClient).mockResolvedValue(data);
		renderMedOmråde(<SaksbehandlerNøkkeltall />, { område });
		expect(
			await screen.findByRole('heading', { name: 'Nye og ferdigstilte oppgaver siste 7 dager' }),
		).toBeInTheDocument();
		expect(screen.getByText('Nøkkeltallgraf')).toBeInTheDocument();
		expect(losClient).toHaveBeenCalledWith(
			expect.objectContaining({
				url: `/api/fleromrade/${segment}/saksbehandler/nokkeltall`,
				params: { gruppe: 'ALLE' },
			}),
			undefined,
		);
	});

	it('sender valgt gruppe fra responsen til backend og viser oppdateringstidspunktet', async () => {
		const user = userEvent.setup();
		vi.mocked(losClient).mockResolvedValue(data);
		renderMedOmråde(<SaksbehandlerNøkkeltall />);
		await user.selectOptions(await screen.findByRole('combobox', { name: 'Valgt ytelse' }), 'DEL_1');
		await waitFor(() =>
			expect(losClient).toHaveBeenLastCalledWith(expect.objectContaining({ params: { gruppe: 'DEL_1' } }), undefined),
		);
		await user.click(screen.getByRole('button', { name: 'Om nøkkeltallene' }));
		expect(screen.getByText(/22.10.2026 kl. 10:00:00/)).toBeInTheDocument();
	});

	it('håndterer manglende oppdateringstidspunkt uten en ugyldig dato', async () => {
		vi.mocked(losClient).mockResolvedValue({ ...data, oppdatertTidspunkt: null } satisfies NyeOgFerdigstilteResponse);
		renderMedOmråde(<SaksbehandlerNøkkeltall />);
		expect(await screen.findByText('Nøkkeltallgraf')).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'Om nøkkeltallene' })).not.toBeInTheDocument();
	});

	it('skjuler komponenten ved 501 uten retry eller polling', async () => {
		vi.useFakeTimers();
		vi.mocked(losClient).mockRejectedValue(httpFeil(501));
		renderMedOmråde(<SaksbehandlerNøkkeltall />);
		await act(async () => vi.advanceTimersByTimeAsync(120_000));
		expect(losClient).toHaveBeenCalledTimes(1);
		expect(screen.queryByRole('heading')).not.toBeInTheDocument();
		expect(screen.queryByText(/Kunne ikke hente/)).not.toBeInTheDocument();
	});

	it('viser andre backendfeil', async () => {
		vi.mocked(losClient).mockRejectedValue(httpFeil(500));
		const client = new QueryClient({ defaultOptions: { queries: { retryDelay: 0 } } });
		render(
			<QueryClientProvider client={client}>
				<OmrådeProvider område="K9">
					<SaksbehandlerNøkkeltall />
				</OmrådeProvider>
			</QueryClientProvider>,
		);
		expect(await screen.findByText('Kunne ikke hente nye og ferdigstilte oppgaver')).toBeInTheDocument();
	});

	it('nullstiller gruppevalget og henter nye data ved områdebytte', async () => {
		const user = userEvent.setup();
		vi.mocked(losClient).mockResolvedValue(data);
		const client = new QueryClient();
		const vis = (område: Område) => (
			<QueryClientProvider client={client}>
				<OmrådeProvider område={område}>
					<SaksbehandlerNøkkeltall />
				</OmrådeProvider>
			</QueryClientProvider>
		);
		const { rerender } = render(vis('K9'));
		await user.selectOptions(await screen.findByRole('combobox', { name: 'Valgt ytelse' }), 'DEL_1');
		rerender(vis('AKTIVITETSPENGER'));
		await waitFor(() =>
			expect(losClient).toHaveBeenLastCalledWith(
				expect.objectContaining({ url: '/api/fleromrade/akt/saksbehandler/nokkeltall', params: { gruppe: 'ALLE' } }),
				undefined,
			),
		);
		expect(await screen.findByRole('combobox', { name: 'Valgt ytelse' })).toHaveValue('ALLE');
	});
});
