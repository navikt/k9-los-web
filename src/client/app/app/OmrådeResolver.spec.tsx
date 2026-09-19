import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useInnloggetBrukersOmråder } from 'api/queries/områdeQueries';
import { useOmråde } from 'fleromrade/OmrådeContext';
import { Link, MemoryRouter, useLocation } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import OmrådeResolver from './OmrådeResolver';

vi.mock('api/queries/områdeQueries', () => ({
	useInnloggetBrukersOmråder: vi.fn(),
}));

const queryResult = (overrides: Record<string, unknown>) =>
	({
		data: undefined,
		isPending: false,
		isError: false,
		refetch: vi.fn(),
		...overrides,
	}) as unknown as ReturnType<typeof useInnloggetBrukersOmråder>;

const Sti = () => {
	const { pathname, search } = useLocation();
	return <div data-testid="sti">{`${pathname}${search}`}</div>;
};

const K9App = () => (
	<>
		<div>K9-app</div>
		<Link to="/">Til K9-forsiden</Link>
		<Link to="/akt">Til aktivitetspenger</Link>
	</>
);

const AktivitetspengerApp = () => {
	const { område } = useOmråde();
	return (
		<>
			<div>{`App for ${område}`}</div>
			<Link to="/">Bytt område</Link>
		</>
	);
};

const renderResolver = (sti: string) =>
	render(
		<MemoryRouter initialEntries={[sti]}>
			<OmrådeResolver k9={<K9App />} aktivitetspenger={<AktivitetspengerApp />} />
			<Sti />
		</MemoryRouter>,
	);

const medOmråder = (områder: string[]) =>
	vi.mocked(useInnloggetBrukersOmråder).mockReturnValue(queryResult({ data: områder }));

describe('OmrådeResolver', () => {
	describe('kun K9', () => {
		it('rendrer K9 på dagens stier uten prefiks', () => {
			medOmråder(['K9']);

			renderResolver('/avdelingsleder');

			expect(screen.getByText('K9-app')).toBeInTheDocument();
			expect(screen.getByTestId('sti')).toHaveTextContent('/avdelingsleder');
		});

		it('fjerner /k9-prefikset fra lenker fra fagsystemet', () => {
			medOmråder(['K9']);

			renderResolver('/k9/avdelingsleder?fane=lagredeSok');

			expect(screen.getByText('K9-app')).toBeInTheDocument();
			expect(screen.getByTestId('sti')).toHaveTextContent('/avdelingsleder?fane=lagredeSok');
		});

		it('sender /k9 til forsiden', () => {
			medOmråder(['K9']);

			renderResolver('/k9');

			expect(screen.getByTestId('sti')).toHaveTextContent(/^\/$/);
		});

		it('viser tilgangsfeil under /akt', () => {
			medOmråder(['K9']);

			renderResolver('/akt');

			expect(screen.getByText('Du har ikke tilgang til aktivitetspenger')).toBeInTheDocument();
			expect(screen.queryByText('K9-app')).not.toBeInTheDocument();
		});
	});

	describe('kun aktivitetspenger', () => {
		it('rendrer aktivitetspenger med området i konteksten', () => {
			medOmråder(['AKTIVITETSPENGER']);

			renderResolver('/akt/avdelingsleder');

			expect(screen.getByText('App for AKTIVITETSPENGER')).toBeInTheDocument();
		});

		it('sender stier uten prefiks videre til /akt', () => {
			medOmråder(['AKTIVITETSPENGER']);

			renderResolver('/avdelingsleder?fane=reservasjoner');

			expect(screen.getByText('App for AKTIVITETSPENGER')).toBeInTheDocument();
			expect(screen.getByTestId('sti')).toHaveTextContent('/akt/avdelingsleder?fane=reservasjoner');
		});

		it('sender forsiden videre til /akt', () => {
			medOmråder(['AKTIVITETSPENGER']);

			renderResolver('/');

			expect(screen.getByTestId('sti')).toHaveTextContent(/^\/akt$/);
		});

		it('viser tilgangsfeil under /k9', () => {
			medOmråder(['AKTIVITETSPENGER']);

			renderResolver('/k9');

			expect(
				screen.getByText('Du har ikke tilgang til pleiepenger, omsorgspenger og opplæringspenger'),
			).toBeInTheDocument();
		});
	});

	describe('begge områder', () => {
		it('viser velgeren på forsiden og blir i K9 etter at K9 er valgt', async () => {
			const user = userEvent.setup();
			medOmråder(['K9', 'AKTIVITETSPENGER']);

			renderResolver('/');

			expect(screen.getByRole('heading', { name: 'Velg område' })).toBeInTheDocument();
			expect(screen.queryByText('K9-app')).not.toBeInTheDocument();

			await user.click(screen.getByRole('button', { name: 'Pleiepenger, omsorgspenger og opplæringspenger' }));
			await user.click(screen.getByRole('link', { name: 'Til K9-forsiden' }));

			expect(screen.getByText('K9-app')).toBeInTheDocument();
			expect(screen.getByTestId('sti')).toHaveTextContent(/^\/$/);
		});

		it('navigerer til /akt når aktivitetspenger velges', async () => {
			const user = userEvent.setup();
			medOmråder(['K9', 'AKTIVITETSPENGER']);

			renderResolver('/');
			await user.click(screen.getByRole('button', { name: 'Aktivitetspenger' }));

			expect(screen.getByText('App for AKTIVITETSPENGER')).toBeInTheDocument();
			expect(screen.getByTestId('sti')).toHaveTextContent(/^\/akt$/);
		});

		it('går rett til K9 ved dyplenke uten prefiks, og viser ikke velgeren på vei tilbake til forsiden', async () => {
			const user = userEvent.setup();
			medOmråder(['K9', 'AKTIVITETSPENGER']);

			renderResolver('/avdelingsleder');

			expect(screen.getByText('K9-app')).toBeInTheDocument();

			await user.click(screen.getByRole('link', { name: 'Til K9-forsiden' }));

			expect(screen.getByText('K9-app')).toBeInTheDocument();
		});

		it('velger K9 ved lenke med /k9 fra fagsystemet', () => {
			medOmråder(['K9', 'AKTIVITETSPENGER']);

			renderResolver('/k9');

			expect(screen.getByText('K9-app')).toBeInTheDocument();
			expect(screen.getByTestId('sti')).toHaveTextContent(/^\/$/);
		});

		it('viser velgeren igjen når brukeren bytter område fra aktivitetspenger', async () => {
			const user = userEvent.setup();
			medOmråder(['K9', 'AKTIVITETSPENGER']);

			renderResolver('/k9');
			expect(screen.getByText('K9-app')).toBeInTheDocument();

			await user.click(screen.getByRole('link', { name: 'Til aktivitetspenger' }));
			await user.click(screen.getByRole('link', { name: 'Bytt område' }));

			expect(screen.getByRole('heading', { name: 'Velg område' })).toBeInTheDocument();
		});
	});

	it('viser advarsel når brukeren ikke har noen områder', () => {
		medOmråder([]);

		renderResolver('/');

		expect(screen.getByText('Du har ikke tilgang til et område')).toBeInTheDocument();
	});

	it('viser en feilmelding og lar brukeren prøve på nytt', async () => {
		const user = userEvent.setup();
		const refetch = vi.fn();
		vi.mocked(useInnloggetBrukersOmråder).mockReturnValue(queryResult({ isError: true, refetch }));

		renderResolver('/');
		await user.click(screen.getByRole('button', { name: 'Prøv på nytt' }));

		expect(screen.getByText('Kunne ikke hente områdene dine')).toBeInTheDocument();
		expect(refetch).toHaveBeenCalledOnce();
	});
});
