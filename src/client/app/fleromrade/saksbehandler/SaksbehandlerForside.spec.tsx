import { screen } from '@testing-library/react';
import { useHentSisteOppgaver } from 'api/generated/los';
import { useInnloggetBruker } from 'fleromrade/api/innloggetBrukerQueries';
import { queryResultat, renderMedOmråde } from 'fleromrade/testUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SaksbehandlerForside from './SaksbehandlerForside';
import { innloggetBruker } from './testdata';

vi.mock('api/generated/los');
vi.mock('fleromrade/api/innloggetBrukerQueries', () => ({ useInnloggetBruker: vi.fn() }));
vi.mock('./sok/Søkeboks', () => ({ default: () => <div>Søkeboks</div> }));
vi.mock('./ko/KøPanel', () => ({ default: () => <div>Køpanel</div> }));

beforeEach(() => {
	vi.mocked(useInnloggetBruker).mockReturnValue(queryResultat(innloggetBruker));
	vi.mocked(useHentSisteOppgaver).mockReturnValue(queryResultat([]));
});

describe('SaksbehandlerForside', () => {
	it('viser søk, køer og siste oppgaver', () => {
		vi.mocked(useHentSisteOppgaver).mockReturnValue(
			queryResultat([
				{
					oppgaveEksternId: 'a',
					tittel: 'Kari Nordmann (Førstegangsbehandling)',
					url: 'http://localhost:9000/fagsak/ABC12/',
				},
				{ oppgaveEksternId: 'b', tittel: 'Ola Nordmann (Punsj)', url: null },
			]),
		);

		renderMedOmråde(<SaksbehandlerForside />);

		expect(screen.getByText('Søkeboks')).toBeInTheDocument();
		expect(screen.getByText('Køpanel')).toBeInTheDocument();
		expect(useHentSisteOppgaver).toHaveBeenCalledWith('akt');
		expect(screen.getByRole('link', { name: 'Kari Nordmann (Førstegangsbehandling)' })).toHaveAttribute(
			'href',
			'http://localhost:9000/fagsak/ABC12/',
		);
		expect(screen.getByText('Ola Nordmann (Punsj)')).toBeInTheDocument();
	});

	it('skjuler køene for brukere som ikke er lagt inn som saksbehandler', () => {
		vi.mocked(useInnloggetBruker).mockReturnValue(
			queryResultat({ ...innloggetBruker, finnesISaksbehandlerTabell: false }),
		);

		renderMedOmråde(<SaksbehandlerForside />);

		expect(screen.getByText('Søkeboks')).toBeInTheDocument();
		expect(screen.queryByText('Køpanel')).not.toBeInTheDocument();
	});

	it('forteller når brukeren ikke har siste oppgaver', () => {
		renderMedOmråde(<SaksbehandlerForside />);

		expect(screen.getByText('Ingen oppgaver')).toBeInTheDocument();
	});
});
