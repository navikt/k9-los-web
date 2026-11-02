import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useInnloggetBrukersOmråder } from 'fleromrade/api/områdeQueries';
import { useOmråde } from 'fleromrade/OmrådeContext';
import { Link, MemoryRouter, useLocation, useNavigationType } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import OmrådeResolver from './OmrådeResolver';

vi.mock('fleromrade/api/områdeQueries', () => ({ useInnloggetBrukersOmråder: vi.fn() }));

const queryResult = (overrides: Record<string, unknown>) =>
	({ data: undefined, isPending: false, isError: false, refetch: vi.fn(), ...overrides }) as unknown as ReturnType<
		typeof useInnloggetBrukersOmråder
	>;

const Sti = () => {
	const { pathname, search, hash } = useLocation();
	const navigering = useNavigationType();
	return <div data-testid="sti" data-navigering={navigering}>{`${pathname}${search}${hash}`}</div>;
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
	afterEach(() => {
		document.title = '';
	});

	it.each([
		['/avp', 'Aktivitetspenger'],
		['/avp/', 'Aktivitetspenger'],
		['/avp/avdelingsleder?fane=reservasjoner', 'Aktivitetspenger'],
		['/avp/admin', 'Aktivitetspenger'],
		['/avp/finnes-ikke', 'Aktivitetspenger'],
		['/avpannet', 'K9 LOS'],
		['/k9', 'K9 LOS'],
		['/k9-ny', 'K9 LOS'],
		['/velg-omrade', 'K9 LOS'],
	])('viser tittelen for %s som %s', (sti, tittel) => {
		medOmråder(['K9', 'AKTIVITETSPENGER']);
		renderResolver(sti);

		expect(document.title).toBe(tittel);
	});

	it('oppdaterer tittelen ved områdebytte', async () => {
		const user = userEvent.setup();
		medOmråder(['K9', 'AKTIVITETSPENGER']);
		render(
			<MemoryRouter initialEntries={['/velg-omrade']}>
				<OmrådeResolver k9={() => <div>Legacy K9</div>} fleromrade={<FlerområdeApp />} />
				<Link to="/avp/admin">AVP admin</Link>
				<Link to="/velg-omrade">Bytt område</Link>
			</MemoryRouter>,
		);

		expect(document.title).toBe('K9 LOS');
		await user.click(screen.getByRole('button', { name: 'Aktivitetspenger' }));
		expect(document.title).toBe('Aktivitetspenger');
		await user.click(screen.getByRole('link', { name: 'AVP admin' }));
		expect(document.title).toBe('Aktivitetspenger');
		await user.click(screen.getByRole('link', { name: 'Bytt område' }));
		expect(document.title).toBe('K9 LOS');
	});

	it('setter tittelen mens tilgangene lastes', () => {
		vi.mocked(useInnloggetBrukersOmråder).mockReturnValue(queryResult({ isPending: true }));
		renderResolver('/avp');

		expect(document.title).toBe('Aktivitetspenger');
	});

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

	it('sender bruker med bare aktivitetspenger direkte til /avp', () => {
		medOmråder(['AKTIVITETSPENGER']);
		renderResolver('/');

		expect(screen.getByText('App for AKTIVITETSPENGER på /avp')).toBeInTheDocument();
		expect(screen.getByTestId('sti')).toHaveTextContent(/^\/avp$/);
	});

	it.each([
		['/akt', '/avp'],
		['/akt/', '/avp/'],
		['/akt?sok=ABC12#resultat', '/avp?sok=ABC12#resultat'],
		['/akt/avdelingsleder?fane=reservasjoner#oversikt', '/avp/avdelingsleder?fane=reservasjoner#oversikt'],
		['/akt/admin', '/avp/admin'],
	])('redirecter gammel lenke %s til %s og erstatter historikkinnslaget', (gammelSti, nySti) => {
		medOmråder(['K9', 'AKTIVITETSPENGER']);
		renderResolver(gammelSti);

		expect(screen.getByTestId('sti').textContent).toBe(nySti);
		expect(screen.getByTestId('sti')).toHaveAttribute('data-navigering', 'REPLACE');
		expect(screen.getByText('App for AKTIVITETSPENGER på /avp')).toBeInTheDocument();
		expect(screen.queryByRole('heading', { name: 'Velg område' })).not.toBeInTheDocument();
	});

	it('rendrer aktivitetspenger direkte på /avp uten redirect', () => {
		medOmråder(['K9', 'AKTIVITETSPENGER']);
		renderResolver('/avp');

		expect(screen.getByText('App for AKTIVITETSPENGER på /avp')).toBeInTheDocument();
		expect(screen.getByTestId('sti')).toHaveAttribute('data-navigering', 'POP');
	});

	it.each(['/akt', '/avp'])('krever tilgang til aktivitetspenger på %s', (sti) => {
		medOmråder(['K9']);
		renderResolver(sti);

		expect(screen.getByText('Du har ikke tilgang til systemet')).toBeInTheDocument();
		expect(screen.queryByText('App for AKTIVITETSPENGER på /avp')).not.toBeInTheDocument();
	});

	it('redirecter ikke andre stier som begynner med akt', () => {
		medOmråder(['K9', 'AKTIVITETSPENGER']);
		renderResolver('/aktivitet');

		expect(screen.getByTestId('sti').textContent).toBe('/aktivitet');
		expect(screen.getByRole('heading', { name: 'Velg område' })).toBeInTheDocument();
	});

	it('beholder dyplenken ved automatisk redirect', () => {
		medOmråder(['AKTIVITETSPENGER']);
		renderResolver('/avdelingsleder?fane=reservasjoner');

		expect(screen.getByTestId('sti')).toHaveTextContent('/avp/avdelingsleder?fane=reservasjoner');
	});

	it('beholder søkeparameter fra rota ved automatisk redirect', () => {
		medOmråder(['AKTIVITETSPENGER']);
		renderResolver('/?sok=brabra');

		expect(screen.getByTestId('sti')).toHaveTextContent(/^\/avp\?sok=brabra$/);
	});

	it('beholder søkeparameter når bruker velger område', async () => {
		const user = userEvent.setup();
		medOmråder(['K9', 'AKTIVITETSPENGER']);
		renderResolver('/?sok=brabra');

		await user.click(screen.getByRole('button', { name: 'Aktivitetspenger' }));
		expect(screen.getByTestId('sti')).toHaveTextContent(/^\/avp\?sok=brabra$/);
	});

	it('beholder søkeparameter når bruker velger område via /velg-omrade', async () => {
		const user = userEvent.setup();
		medOmråder(['K9', 'AKTIVITETSPENGER']);
		renderResolver('/velg-omrade?sok=brabra');

		await user.click(screen.getByRole('button', { name: /legacy/ }));
		expect(screen.getByTestId('sti')).toHaveTextContent(/^\/k9\?sok=brabra$/);
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

		expect(screen.getByText('Kunne ikke hente tilgangene dine')).toBeInTheDocument();
		expect(refetch).toHaveBeenCalledOnce();
	});
});
