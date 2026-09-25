import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
	useEndreReservasjoner,
	useForlengReservasjon,
	useHentAktivReservasjon,
	useHentAntallOppgaverUtenReserverteISaksbehandlerko,
	useHentOppgaverISaksbehandlerko,
	useHentReserverteOppgaver,
	useHentSaksbehandlereISaksbehandlerko,
	useHentSaksbehandlersOppgavekoer,
	useLagreSisteOppgave,
	useOpphevReservasjoner,
	useReserverNesteOppgaveFraSaksbehandlerko,
	useReserverOppgave,
} from 'api/generated/los';
import type { OppgaveKo } from 'api/generated/los.schemas';
import { useInnloggetBruker } from 'fleromrade/api/innloggetBrukerQueries';
import {
	mutationResultat,
	mutationSomLykkes,
	queryResultat,
	renderMedOmråde,
	stubLocalStorage,
	stubNavigering,
} from 'fleromrade/testUtils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { innloggetBruker, lagKø, lagOppgaveSammendrag } from '../testdata';
import KøPanel from './KøPanel';

vi.mock('api/generated/los');
vi.mock('fleromrade/api/innloggetBrukerQueries', () => ({ useInnloggetBruker: vi.fn() }));

const køA = lagKø({ id: 1, tittel: 'Alfa', beskrivelse: 'Første kø' });
const køB = lagKø({ id: 2, tittel: 'Beta', beskrivelse: 'Andre kø' });

const medKøer = (køer: OppgaveKo[]) => vi.mocked(useHentSaksbehandlersOppgavekoer).mockReturnValue(queryResultat(køer));

const mutate = (mutasjon: never) => (mutasjon as { mutate: ReturnType<typeof vi.fn> }).mutate;

beforeEach(() => {
	vi.clearAllMocks();
	stubLocalStorage();
	medKøer([køB, køA]);
	vi.mocked(useInnloggetBruker).mockReturnValue(queryResultat(innloggetBruker));
	vi.mocked(useHentAntallOppgaverUtenReserverteISaksbehandlerko).mockReturnValue(
		queryResultat({ antallUtenReserverte: 17 }),
	);
	vi.mocked(useHentSaksbehandlereISaksbehandlerko).mockReturnValue(
		queryResultat([{ id: 2, epost: 'lars@nav.no', navn: 'Saksbehandler Lars' }]),
	);
	vi.mocked(useHentOppgaverISaksbehandlerko).mockReturnValue(queryResultat([lagOppgaveSammendrag()]));
	vi.mocked(useHentReserverteOppgaver).mockReturnValue(queryResultat([]));
	vi.mocked(useHentAktivReservasjon).mockReturnValue(queryResultat(null));
	vi.mocked(useReserverNesteOppgaveFraSaksbehandlerko).mockReturnValue(mutationResultat());
	vi.mocked(useLagreSisteOppgave).mockReturnValue(mutationSomLykkes());
	vi.mocked(useForlengReservasjon).mockReturnValue(mutationResultat());
	vi.mocked(useReserverOppgave).mockReturnValue(mutationResultat());
	vi.mocked(useEndreReservasjoner).mockReturnValue(mutationResultat());
	vi.mocked(useOpphevReservasjoner).mockReturnValue(mutationResultat());
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('KøPanel', () => {
	it('velger første kø alfabetisk og viser detaljer om den', () => {
		renderMedOmråde(<KøPanel />);

		expect(screen.getByRole('combobox', { name: 'Velg oppgavekø' })).toHaveValue('1');
		expect(screen.getByText('Antall i kø: 17')).toBeInTheDocument();
		expect(screen.getByText('Første kø')).toBeInTheDocument();
		expect(useHentAntallOppgaverUtenReserverteISaksbehandlerko).toHaveBeenCalledWith('akt', 1, expect.anything());
	});

	it('husker valgt kø per område', async () => {
		const user = userEvent.setup();
		const { unmount } = renderMedOmråde(<KøPanel />);

		await user.selectOptions(screen.getByRole('combobox', { name: 'Velg oppgavekø' }), 'Beta');
		unmount();

		renderMedOmråde(<KøPanel />);
		expect(screen.getByRole('combobox', { name: 'Velg oppgavekø' })).toHaveValue('2');
		expect(window.localStorage.getItem('valgtOppgaveko-akt')).toBe('2');
	});

	it('viser neste oppgaver i området med køvelgeren, og reserverte oppgaver under', async () => {
		const user = userEvent.setup();
		renderMedOmråde(<KøPanel />);

		const nesteOppgaver = screen.getByRole('button', { name: 'Neste oppgaver' });
		expect(nesteOppgaver).toHaveAttribute('aria-expanded', 'false');
		expect(screen.getByRole('combobox', { name: 'Velg oppgavekø' }).compareDocumentPosition(nesteOppgaver)).toBe(
			Node.DOCUMENT_POSITION_FOLLOWING,
		);
		expect(nesteOppgaver.compareDocumentPosition(screen.getByRole('button', { name: 'Reserverte oppgaver' }))).toBe(
			Node.DOCUMENT_POSITION_FOLLOWING,
		);

		await user.click(nesteOppgaver);
		expect(nesteOppgaver).toHaveAttribute('aria-expanded', 'true');
	});

	it('forteller når brukeren ikke har noen køer', () => {
		medKøer([]);

		renderMedOmråde(<KøPanel />);

		expect(screen.getByText('Fant ingen oppgavekøer for deg.')).toBeInTheDocument();
	});

	it('plukker neste oppgave og åpner den i fagsystemet', async () => {
		const user = userEvent.setup();
		const assign = stubNavigering();
		const plukk = mutationSomLykkes([
			{
				oppgaveNøkkelDto: lagOppgaveSammendrag().oppgaveNøkkel,
				oppgavebehandlingsUrl: 'http://localhost:9000/fagsak/ABC12/',
			},
		]);
		vi.mocked(useReserverNesteOppgaveFraSaksbehandlerko).mockReturnValue(plukk);

		renderMedOmråde(<KøPanel />);
		await user.click(screen.getByRole('button', { name: 'Gi meg neste oppgave i køen' }));

		expect(mutate(plukk)).toHaveBeenCalledWith({ omrade: 'akt', id: 1 }, expect.anything());
		expect(assign).toHaveBeenCalledWith('http://localhost:9000/fagsak/ABC12/');
	});

	it('forteller når det ikke er flere ureserverte oppgaver i køen', async () => {
		const user = userEvent.setup();
		vi.mocked(useReserverNesteOppgaveFraSaksbehandlerko).mockReturnValue(mutationSomLykkes([]));

		renderMedOmråde(<KøPanel />);
		await user.click(screen.getByRole('button', { name: 'Gi meg neste oppgave i køen' }));

		expect(screen.getByRole('dialog', { name: 'Ingen flere ureserverte oppgaver i køen' })).toBeInTheDocument();
	});

	it('henter neste oppgaver først når brukeren åpner listen', async () => {
		const user = userEvent.setup();
		renderMedOmråde(<KøPanel />);

		expect(useHentOppgaverISaksbehandlerko).not.toHaveBeenCalled();

		await user.click(screen.getByRole('button', { name: 'Neste oppgaver' }));

		expect(useHentOppgaverISaksbehandlerko).toHaveBeenCalledWith('akt', 1, expect.anything());
		expect(screen.queryByRole('button', { name: 'Velg oppgave ABC12' })).not.toBeInTheDocument();
	});

	it('viser neste oppgaver med samme kolonner og rekkefølge som reserverte oppgaver', async () => {
		const user = userEvent.setup();
		renderMedOmråde(<KøPanel />);
		await user.click(screen.getByRole('button', { name: 'Neste oppgaver' }));

		const tabell = screen.getByRole('table');
		expect(
			within(tabell)
				.getAllByRole('columnheader')
				.map((kolonne) => kolonne.textContent),
		).toEqual(['Søker', 'Sak', 'Behandlingstype', 'Oppgave opprettet']);
		const [søker, sak, behandlingstype, opprettet] = within(within(tabell).getAllByRole('row')[1]).getAllByRole('cell');
		expect(søker).toHaveTextContent('Kari Nordmann');
		expect(within(søker).getByRole('button', { name: 'Kopier fødselsnummer' })).toBeInTheDocument();
		expect(sak).toHaveTextContent('ABC12 (2026)');
		expect(within(sak).getByRole('button', { name: 'Kopier saksnummer' })).toBeInTheDocument();
		expect(behandlingstype).toHaveTextContent('FørstegangsbehandlingAktivitetspenger');
		expect(opprettet).toHaveTextContent('07.09.2026');
	});

	it('lar brukeren velge oppgave fra listen når køen har fritt valg', async () => {
		const user = userEvent.setup();
		medKøer([lagKø({ frittValgAvOppgave: true })]);

		renderMedOmråde(<KøPanel />);
		await user.click(screen.getByRole('button', { name: 'Neste oppgaver' }));
		await user.click(screen.getByRole('button', { name: 'Velg oppgave ABC12' }));

		expect(screen.getByRole('dialog', { name: 'Oppgaven er ikke reservert' })).toBeInTheDocument();
	});
});
