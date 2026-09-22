import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useInnloggetBrukersOmråder } from 'fleromrade/api/områdeQueries';
import { useOmråde } from 'fleromrade/OmrådeContext';
import { MemoryRouter, useLocation } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import OmrådeResolver from './OmrådeResolver';

vi.mock('fleromrade/api/områdeQueries', () => ({ useInnloggetBrukersOmråder: vi.fn() }));

const queryResult = (overrides: Record<string, unknown>) =>
	({ data: undefined, isPending: false, isError: false, refetch: vi.fn(), ...overrides }) as unknown as ReturnType<
		typeof useInnloggetBrukersOmråder
	>;

const Sti = () => {
	const { pathname, search } = useLocation();
	return <div data-testid="sti">{`${pathname}${search}`}</div>;
};

const FlerområdeApp = () => {
	const { område, basissti } = useOmråde();
	return <div>{`App for ${område} på ${basissti}`}</div>;
};

const renderResolver = (sti: string) =>
	render(
		<MemoryRouter initialEntries={[sti]}>
			<OmrådeResolver
				k9={(kanBytteOmråde) => <div>{`Legacy K9${kanBytteOmråde ? ' med områdebytte' : ''}`}</div>}
				fleromrade={<FlerområdeApp />}
			/>
			<Sti />
		</MemoryRouter>,
	);

const medOmråder = (områder: string[]) =>
	vi.mocked(useInnloggetBrukersOmråder).mockReturnValue(queryResult({ data: områder }));

describe('OmrådeResolver', () => {
	it('viser K9-velgeren når K9 har både legacy og ny app', () => {
		medOmråder(['K9']);
		renderResolver('/');

		expect(screen.getByRole('button', { name: /legacy/ })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /ny/ })).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'Aktivitetspenger' })).not.toBeInTheDocument();
	});

	it('viser tre valg for bruker med begge områder', () => {
		medOmråder(['K9', 'AKTIVITETSPENGER']);
		renderResolver('/');

		expect(screen.getAllByRole('button')).toHaveLength(3);
	});

	it('sender bruker med bare aktivitetspenger direkte til /akt', () => {
		medOmråder(['AKTIVITETSPENGER']);
		renderResolver('/');

		expect(screen.getByText('App for AKTIVITETSPENGER på /akt')).toBeInTheDocument();
		expect(screen.getByTestId('sti')).toHaveTextContent(/^\/akt$/);
	});

	it('beholder dyplenken ved automatisk redirect', () => {
		medOmråder(['AKTIVITETSPENGER']);
		renderResolver('/avdelingsleder?fane=reservasjoner');

		expect(screen.getByTestId('sti')).toHaveTextContent('/akt/avdelingsleder?fane=reservasjoner');
	});

	it('rendrer legacy K9 på /k9 med områdebytte', () => {
		medOmråder(['K9']);
		renderResolver('/k9');

		expect(screen.getByText('Legacy K9 med områdebytte')).toBeInTheDocument();
	});

	it('rendrer ny K9 på /k9-ny', () => {
		medOmråder(['K9']);
		renderResolver('/k9-ny/avdelingsleder');

		expect(screen.getByText('App for K9 på /k9-ny')).toBeInTheDocument();
	});

	it('navigerer til valgt app', async () => {
		const user = userEvent.setup();
		medOmråder(['K9', 'AKTIVITETSPENGER']);
		renderResolver('/velg-omrade');

		await user.click(screen.getByRole('button', { name: /legacy/ }));
		expect(screen.getByTestId('sti')).toHaveTextContent(/^\/k9$/);
		expect(screen.getByText('Legacy K9 med områdebytte')).toBeInTheDocument();
	});

	it('viser samme tilgangsmelding for tom områdeliste og utilgjengelig sti', () => {
		medOmråder([]);
		const { unmount } = renderResolver('/');
		expect(screen.getByText('Du har ikke tilgang til systemet')).toBeInTheDocument();
		unmount();

		medOmråder(['AKTIVITETSPENGER']);
		renderResolver('/k9');
		expect(screen.getByText('Du har ikke tilgang til systemet')).toBeInTheDocument();
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
