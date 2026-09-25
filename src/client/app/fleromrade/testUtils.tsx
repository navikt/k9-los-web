import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
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
	kanBytteOmråde?: boolean;
}

/**
 * Rendrer med QueryClient, router og områdekontekst. Gjeldende sti kan leses fra
 * `screen.getByTestId('aktiv-sti')`.
 */
export const renderMedOmråde = (
	ui: ReactElement,
	{ sti = '/akt', område = 'AKTIVITETSPENGER', kanBytteOmråde = false }: Valg = {},
) => {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	});
	return render(
		<QueryClientProvider client={queryClient}>
			<MemoryRouter initialEntries={[sti]}>
				<OmrådeProvider område={område} kanBytteOmråde={kanBytteOmråde}>
					{ui}
				</OmrådeProvider>
				<AktivSti />
			</MemoryRouter>
		</QueryClientProvider>,
	);
};

/** Wrapper for `renderHook` med QueryClient og områdekontekst. */
export const lagHookWrapper = (område: Område = 'AKTIVITETSPENGER') => {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	});
	const Wrapper = ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>
			<OmrådeProvider område={område}>{children}</OmrådeProvider>
		</QueryClientProvider>
	);
	return { wrapper: Wrapper, queryClient };
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

interface MutateOptions {
	onSuccess?: (svar: unknown, variabler: unknown) => void;
	onSettled?: () => void;
}

/** En mutation-hook der `mutate` lykkes med `svar` og kaller `onSuccess` og `onSettled` fra kallstedet. */
export const mutationSomLykkes = (svar?: unknown): never =>
	mutationResultat({
		mutate: vi.fn((variabler: unknown, options?: MutateOptions) => {
			options?.onSuccess?.(svar, variabler);
			options?.onSettled?.();
		}),
	});

/** Erstatter `window.location.assign`, som jsdom ikke støtter, og returnerer mocken. */
export const stubNavigering = () => {
	const assign = vi.fn();
	vi.stubGlobal('location', { ...window.location, assign });
	return assign;
};

/**
 * Gir testen en tom localStorage i minnet. Node sin eksperimentelle localStorage skygger for jsdom sin,
 * og er ikke tilgjengelig uten `--localstorage-file`.
 */
export const stubLocalStorage = () => {
	const lager = new Map<string, string>();
	const localStorage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem' | 'clear'> = {
		getItem: (nøkkel) => lager.get(nøkkel) ?? null,
		setItem: (nøkkel, verdi) => lager.set(nøkkel, String(verdi)),
		removeItem: (nøkkel) => lager.delete(nøkkel),
		clear: () => lager.clear(),
	};
	vi.stubGlobal('localStorage', localStorage);
	return localStorage;
};

/** Et resultat fra en generert mutation-hook. `mutate` er en mock som kan inspiseres. */
export const mutationResultat = (overstyring: Record<string, unknown> = {}): never =>
	({
		mutate: vi.fn(),
		mutateAsync: vi.fn(),
		isPending: false,
		isError: false,
		...overstyring,
	}) as never;
