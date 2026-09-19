import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { InnloggetBrukerDtoNy, Tilganger } from 'api/generated/los.schemas';
import { useInnloggetBruker } from 'fleromrade/api/innloggetBrukerQueries';
import { useInnloggetBrukersOmråder } from 'fleromrade/api/områdeQueries';
import type { ReactNode } from 'react';
import { MemoryRouter, Routes, useLocation } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import OmrådeApp from './OmrådeApp';
import { OmrådeProvider } from './OmrådeContext';

// Uten init av @nais/apm rendrer ApmRoutes ingenting. Rutesporingen er dekket av apmRouting.spec.tsx.
vi.mock('@nais/apm/react', () => ({
	ApmRoutes: Routes,
	ApmErrorBoundary: ({ children }: { children: ReactNode }) => children,
}));

vi.mock('fleromrade/api/innloggetBrukerQueries', () => ({
	useInnloggetBruker: vi.fn(),
}));

vi.mock('fleromrade/api/områdeQueries', () => ({
	useInnloggetBrukersOmråder: vi.fn(),
}));

const ingenTilganger: Tilganger = {
	basis: false,
	drift: false,
	kode6: false,
	oppgavestyring: false,
	reservering: false,
};

const medBruker = (tilganger: Partial<Tilganger>, områder: string[] = ['AKTIVITETSPENGER']) => {
	const bruker: InnloggetBrukerDtoNy = {
		brukerIdent: 'Z123456',
		epost: 'ola.nordmann@nav.no',
		finnesISaksbehandlerTabell: true,
		navn: 'Ola Nordmann',
		tilganger: { ...ingenTilganger, ...tilganger },
	};
	vi.mocked(useInnloggetBruker).mockReturnValue({
		data: bruker,
		isPending: false,
		isError: false,
	} as unknown as ReturnType<typeof useInnloggetBruker>);
	vi.mocked(useInnloggetBrukersOmråder).mockReturnValue({ data: områder } as unknown as ReturnType<
		typeof useInnloggetBrukersOmråder
	>);
};

const Sti = () => <div data-testid="sti">{useLocation().pathname}</div>;

const renderApp = (sti: string) =>
	render(
		<MemoryRouter initialEntries={[sti]}>
			<OmrådeProvider område="AKTIVITETSPENGER">
				<OmrådeApp />
			</OmrådeProvider>
			<Sti />
		</MemoryRouter>,
	);

describe('OmrådeApp', () => {
	it('viser områdets navn og brukeren i headeren', () => {
		medBruker({ basis: true });

		renderApp('/akt');

		expect(screen.getByRole('link', { name: 'Aktivitetspenger' })).toHaveAttribute('href', '/akt');
		expect(screen.getByText('Ola Nordmann')).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: 'Saksbehandler' })).toBeInTheDocument();
	});

	it('krever basistilgang på forsiden', () => {
		medBruker({});

		renderApp('/akt');

		expect(screen.getByText('Du har ikke tilgang til å bruke dette programmet')).toBeInTheDocument();
	});

	it('navigerer til avdelingslederpanelet under områdets sti', async () => {
		const user = userEvent.setup();
		medBruker({ basis: true, oppgavestyring: true });

		renderApp('/akt');
		await user.click(screen.getByRole('button', { name: 'Avdelingslederpanel' }));

		expect(screen.getByTestId('sti')).toHaveTextContent('/akt/avdelingsleder');
		expect(screen.getByRole('heading', { name: 'Avdelingslederpanel' })).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'Avdelingslederpanel' })).not.toBeInTheDocument();
	});

	it('skjuler knapper brukeren ikke har tilgang til, og krever tilgang på sidene', () => {
		medBruker({ basis: true });

		renderApp('/akt/avdelingsleder');

		expect(screen.queryByRole('button', { name: 'Avdelingslederpanel' })).not.toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'Driftsmeldinger' })).not.toBeInTheDocument();
		expect(screen.getByText('Du har ikke tilgang til å bruke dette programmet')).toBeInTheDocument();
	});

	it('viser driftsmeldinger for brukere med drifttilgang', async () => {
		const user = userEvent.setup();
		medBruker({ basis: true, drift: true });

		renderApp('/akt');
		await user.click(screen.getByRole('button', { name: 'Driftsmeldinger' }));

		expect(screen.getByTestId('sti')).toHaveTextContent('/akt/admin');
	});

	it('lar brukere med flere områder bytte område', async () => {
		const user = userEvent.setup();
		medBruker({ basis: true }, ['K9', 'AKTIVITETSPENGER']);

		renderApp('/akt');
		await user.click(screen.getByRole('button', { name: 'Bytt område' }));

		expect(screen.getByTestId('sti')).toHaveTextContent(/^\/$/);
	});

	it('viser ikke bytt område for brukere med ett område', () => {
		medBruker({ basis: true });

		renderApp('/akt');

		expect(screen.queryByRole('button', { name: 'Bytt område' })).not.toBeInTheDocument();
	});

	it('viser en side for ukjente stier med lenke til områdets forside', () => {
		medBruker({ basis: true });

		renderApp('/akt/finnes-ikke');

		expect(screen.getByText(/Denne siden finnes ikke/)).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Gå til forsiden' })).toHaveAttribute('href', '/akt');
	});
});
