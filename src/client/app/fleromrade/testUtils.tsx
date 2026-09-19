import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter, useLocation } from 'react-router';
import { vi } from 'vitest';
import { OmrådeProvider } from './OmrådeContext';
import type { Område } from './områder';

/**
 * Hjelpere for tester av flerområdekode. Mønsteret er å mocke de genererte hookene med
 * `vi.mock('api/generated/los', …)` og gi dem svar med `queryResultat` og `mutationResultat`.
 */

const AktivSti = () => {
	const { pathname, search } = useLocation();
	return <div data-testid="aktiv-sti">{`${pathname}${search}`}</div>;
};

interface Valg {
	/** Startstien i routeren. Standard er `/akt`. */
	sti?: string;
	område?: Område;
}

/**
 * Rendrer med QueryClient, router og områdekontekst. Gjeldende sti kan leses fra
 * `screen.getByTestId('aktiv-sti')`.
 */
export const renderMedOmråde = (ui: ReactElement, { sti = '/akt', område = 'AKTIVITETSPENGER' }: Valg = {}) => {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	});
	return render(
		<QueryClientProvider client={queryClient}>
			<MemoryRouter initialEntries={[sti]}>
				<OmrådeProvider område={område}>{ui}</OmrådeProvider>
				<AktivSti />
			</MemoryRouter>
		</QueryClientProvider>,
	);
};

// Returtypen er `never` slik at resultatet kan gis til `mockReturnValue` for en hvilken som helst hook.

/** Et vellykket (eller overstyrt) resultat fra en generert query-hook. */
export const queryResultat = <T,>(data: T, overstyring: Record<string, unknown> = {}): never =>
	({
		data,
		isPending: false,
		isSuccess: true,
		isError: false,
		refetch: vi.fn(),
		...overstyring,
	}) as never;

/** Et resultat fra en generert mutation-hook. `mutate` er en mock som kan inspiseres. */
export const mutationResultat = (overstyring: Record<string, unknown> = {}): never =>
	({
		mutate: vi.fn(),
		mutateAsync: vi.fn(),
		isPending: false,
		isError: false,
		...overstyring,
	}) as never;
