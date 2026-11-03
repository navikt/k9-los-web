import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
	getHentOppgaverISaksbehandlerkoQueryKey,
	hentOppgaverISaksbehandlerko,
	useEndreReservasjoner,
	useForlengReservasjon,
	useHentAktivReservasjon,
	useHentAntallOppgaverUtenReserverteISaksbehandlerko,
	useHentReserverteOppgaver,
	useHentSaksbehandlereForReservasjon,
	useHentSaksbehandlereISaksbehandlerko,
	useHentSaksbehandlersOppgavekoer,
	useLagreSisteOppgave,
	useOpphevReservasjoner,
	useReserverNesteOppgaveFraSaksbehandlerko,
	useReserverOppgave,
	useReserverOppgaveForSaksbehandler,
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
	vi.mocked(getHentOppgaverISaksbehandlerkoQueryKey).mockImplementation((område, id) => [
		`/api/fleromrade/${område}/saksbehandler/oppgaveko/${id}/oppgaver-i-koen`,
	]);
	vi.mocked(hentOppgaverISaksbehandlerko).mockResolvedValue([lagOppgaveSammendrag()]);
	vi.mocked(useHentSaksbehandlereForReservasjon).mockReturnValue(
		queryResultat([{ brukerIdent: 'Z167457', navn: 'Saksbehandler Lars' }]),
	);
	vi.mocked(useHentReserverteOppgaver).mockReturnValue(queryResultat([]));
	vi.mocked(useHentAktivReservasjon).mockReturnValue(queryResultat(null));
	vi.mocked(useReserverNesteOppgaveFraSaksbehandlerko).mockReturnValue(mutationResultat());
	vi.mocked(useLagreSisteOppgave).mockReturnValue(mutationSomLykkes());
	vi.mocked(useForlengReservasjon).mockReturnValue(mutationResultat());
	vi.mocked(useReserverOppgave).mockReturnValue(mutationResultat());
	vi.mocked(useReserverOppgaveForSaksbehandler).mockReturnValue(mutationResultat());
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

		expect(hentOppgaverISaksbehandlerko).not.toHaveBeenCalled();

		await user.click(screen.getByRole('button', { name: 'Neste oppgaver' }));

		expect(hentOppgaverISaksbehandlerko).toHaveBeenCalledWith(
			'akt',
			1,
			{ limit: 10, offset: 0 },
			undefined,
			expect.anything(),
		);
		expect(screen.queryByRole('button', { name: 'Velg oppgave ABC12' })).not.toBeInTheDocument();
	});

	it('viser neste oppgaver med samme kolonner og rekkefølge som reserverte oppgaver', async () => {
		const user = userEvent.setup();
		renderMedOmråde(<KøPanel />);
		await user.click(screen.getByRole('button', { name: 'Neste oppgaver' }));

		const tabell = await screen.findByRole('table');
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

	it('viser lista automatisk og skjuler plukkeknappen når køen har fritt valg', async () => {
		medKøer([lagKø({ frittValgAvOppgave: true })]);
		renderMedOmråde(<KøPanel />);

		await screen.findByRole('table');
		expect(screen.getByRole('row', { name: /ABC12/ })).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'Gi meg neste oppgave i køen' })).not.toBeInTheDocument();
		expect(screen.getByRole('heading', { name: 'Neste oppgaver' })).toBeInTheDocument();
	});

	it('åpner handlingsmenyen fra Reserver/åpne-knappen, ikke raden', async () => {
		const user = userEvent.setup();
		medKøer([lagKø({ frittValgAvOppgave: true })]);
		renderMedOmråde(<KøPanel />);

		await user.click(await screen.findByRole('row', { name: /ABC12/ }));
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
		await user.click(screen.getByRole('button', { name: 'Reserver/åpne oppgave ABC12' }));
		expect(screen.getByRole('menuitem', { name: 'Åpne oppgave' })).toBeInTheDocument();
		expect(screen.getByRole('menuitem', { name: 'Reserver og åpne oppgave' })).toBeInTheDocument();
		expect(screen.getByRole('menuitem', { name: 'Reserver for annen saksbehandler' })).toBeInTheDocument();
		expect(useHentSaksbehandlereForReservasjon).not.toHaveBeenCalled();
	});

	it('viser journalpost-id i menyen når oppgaven ikke har saksnummer', async () => {
		const user = userEvent.setup();
		vi.mocked(hentOppgaverISaksbehandlerko).mockResolvedValue([
			lagOppgaveSammendrag({ saksnummer: null, journalpostId: '000111222' }),
		]);
		medKøer([lagKø({ frittValgAvOppgave: true })]);
		renderMedOmråde(<KøPanel />);

		await user.click(await screen.findByRole('button', { name: 'Reserver/åpne oppgave 000111222' }));
		expect(screen.getByRole('group', { name: 'Journalpost-id 000111222' })).toBeInTheDocument();
	});

	it('åpner oppgaven uten å reservere', async () => {
		const user = userEvent.setup();
		const assign = stubNavigering();
		const reserver = mutationResultat();
		vi.mocked(useReserverOppgave).mockReturnValue(reserver);
		medKøer([lagKø({ frittValgAvOppgave: true })]);
		renderMedOmråde(<KøPanel />);

		await user.click(await screen.findByRole('button', { name: 'Reserver/åpne oppgave ABC12' }));
		await user.click(screen.getByRole('menuitem', { name: 'Åpne oppgave' }));

		expect(mutate(reserver)).not.toHaveBeenCalled();
		expect(assign).toHaveBeenCalledWith(lagOppgaveSammendrag().oppgavebehandlingsUrl);
	});

	it('reserverer valgt oppgave på innlogget bruker og åpner den', async () => {
		const user = userEvent.setup();
		const assign = stubNavigering();
		const reserver = mutationSomLykkes({ erReservertAvInnloggetBruker: true });
		vi.mocked(useReserverOppgave).mockReturnValue(reserver);
		medKøer([lagKø({ frittValgAvOppgave: true })]);

		renderMedOmråde(<KøPanel />);
		await user.click(await screen.findByRole('button', { name: 'Reserver/åpne oppgave ABC12' }));
		await user.click(screen.getByRole('menuitem', { name: 'Reserver og åpne oppgave' }));

		expect(mutate(reserver)).toHaveBeenCalledWith(
			{
				omrade: 'akt',
				data: { oppgaveEksternId: 'oppgave-1', oppgaveTypeEksternId: 'k9sak' },
			},
			expect.anything(),
		);
		expect(assign).toHaveBeenCalledWith(lagOppgaveSammendrag().oppgavebehandlingsUrl);
	});

	it('viser kun åpne-knappen uten reserveringstilgang', async () => {
		const user = userEvent.setup();
		vi.mocked(useInnloggetBruker).mockReturnValue(
			queryResultat({
				...innloggetBruker,
				tilganger: { ...innloggetBruker.tilganger, reservering: false },
			}),
		);
		medKøer([lagKø({ frittValgAvOppgave: true })]);
		renderMedOmråde(<KøPanel />);

		await user.click(await screen.findByRole('button', { name: 'Reserver/åpne oppgave ABC12' }));
		expect(screen.getByRole('menuitem', { name: 'Åpne oppgave' })).toBeInTheDocument();
		expect(screen.queryByRole('menuitem', { name: 'Reserver og åpne oppgave' })).not.toBeInTheDocument();
		expect(screen.queryByRole('menuitem', { name: 'Reserver for annen saksbehandler' })).not.toBeInTheDocument();
	});

	it('åpner ikke oppgaven når den ble reservert av en annen', async () => {
		const user = userEvent.setup();
		const assign = stubNavigering();
		vi.mocked(useReserverOppgave).mockReturnValue(mutationSomLykkes({ erReservertAvInnloggetBruker: false }));
		medKøer([lagKø({ frittValgAvOppgave: true })]);
		renderMedOmråde(<KøPanel />);
		await user.click(await screen.findByRole('button', { name: 'Reserver/åpne oppgave ABC12' }));
		await user.click(screen.getByRole('menuitem', { name: 'Reserver og åpne oppgave' }));

		expect(screen.getByText('Oppgaven ble reservert av en annen saksbehandler.')).toBeInTheDocument();
		expect(assign).not.toHaveBeenCalled();
	});

	it('forteller om manglende lenke etter reservasjon', async () => {
		const user = userEvent.setup();
		const assign = stubNavigering();
		vi.mocked(hentOppgaverISaksbehandlerko).mockResolvedValue([lagOppgaveSammendrag({ oppgavebehandlingsUrl: null })]);
		vi.mocked(useReserverOppgave).mockReturnValue(mutationSomLykkes({ erReservertAvInnloggetBruker: true }));
		medKøer([lagKø({ frittValgAvOppgave: true })]);
		renderMedOmråde(<KøPanel />);
		await user.click(await screen.findByRole('button', { name: 'Reserver/åpne oppgave ABC12' }));
		await user.click(screen.getByRole('menuitem', { name: 'Reserver og åpne oppgave' }));

		expect(screen.getByText(/Oppgaven er reservert på deg, men mangler lenke/)).toBeInTheDocument();
		expect(assign).not.toHaveBeenCalled();
	});

	it('viser reservasjonsfeil uten å åpne oppgaven', async () => {
		const user = userEvent.setup();
		const assign = stubNavigering();
		vi.mocked(useReserverOppgave).mockReturnValue(
			mutationResultat({
				mutate: vi.fn((_data, options) => options.onError(new Error('Konflikt'))),
			}),
		);
		medKøer([lagKø({ frittValgAvOppgave: true })]);
		renderMedOmråde(<KøPanel />);
		await user.click(await screen.findByRole('button', { name: 'Reserver/åpne oppgave ABC12' }));
		await user.click(screen.getByRole('menuitem', { name: 'Reserver og åpne oppgave' }));

		expect(screen.getByText(/Reservering av oppgave feilet/)).toBeInTheDocument();
		expect(assign).not.toHaveBeenCalled();
	});

	it('reserverer for en annen fra undermenyen uten å åpne oppgaven', async () => {
		const user = userEvent.setup();
		const assign = stubNavigering();
		const reserver = mutationSomLykkes();
		vi.mocked(useReserverOppgaveForSaksbehandler).mockReturnValue(reserver);
		medKøer([lagKø({ frittValgAvOppgave: true })]);
		renderMedOmråde(<KøPanel />);
		await user.click(await screen.findByRole('button', { name: 'Reserver/åpne oppgave ABC12' }));
		await user.click(screen.getByRole('menuitem', { name: 'Reserver for annen saksbehandler' }));
		await user.click(await screen.findByRole('menuitem', { name: 'Saksbehandler Lars (Z167457)' }));

		expect(mutate(reserver)).toHaveBeenCalledWith(
			{
				omrade: 'akt',
				data: { navident: 'Z167457', oppgaveNøkkel: { oppgaveEksternId: 'oppgave-1', oppgaveTypeEksternId: 'k9sak' } },
			},
			expect.anything(),
		);
		expect(assign).not.toHaveBeenCalled();
	});

	it('lar ikke brukeren reservere når saksbehandlerlisten er tom', async () => {
		const user = userEvent.setup();
		const reserver = mutationResultat();
		vi.mocked(useReserverOppgaveForSaksbehandler).mockReturnValue(reserver);
		vi.mocked(useHentSaksbehandlereForReservasjon).mockReturnValue(queryResultat([]));
		medKøer([lagKø({ frittValgAvOppgave: true })]);
		renderMedOmråde(<KøPanel />);
		await user.click(await screen.findByRole('button', { name: 'Reserver/åpne oppgave ABC12' }));
		await user.click(screen.getByRole('menuitem', { name: 'Reserver for annen saksbehandler' }));

		expect(await screen.findByRole('menuitem', { name: 'Ingen saksbehandlere tilgjengelig' })).toHaveAttribute(
			'aria-disabled',
			'true',
		);
		expect(mutate(reserver)).not.toHaveBeenCalled();
	});

	it('viser feil hvis reservasjon for en annen feiler', async () => {
		const user = userEvent.setup();
		const reserver = mutationResultat({
			mutate: vi.fn((_data, options) => options.onError(new Error('Konflikt'))),
		});
		vi.mocked(useReserverOppgaveForSaksbehandler).mockReturnValue(reserver);
		medKøer([lagKø({ frittValgAvOppgave: true })]);
		renderMedOmråde(<KøPanel />);
		await user.click(await screen.findByRole('button', { name: 'Reserver/åpne oppgave ABC12' }));
		await user.click(screen.getByRole('menuitem', { name: 'Reserver for annen saksbehandler' }));
		await user.click(await screen.findByRole('menuitem', { name: 'Saksbehandler Lars (Z167457)' }));

		expect(screen.getByRole('alert')).toHaveTextContent('Kunne ikke reservere oppgaven for saksbehandleren.');
	});

	it('viser hentefeil i undermenyen uten å tilby saksbehandlere', async () => {
		const user = userEvent.setup();
		vi.mocked(useHentSaksbehandlereForReservasjon).mockReturnValue(
			queryResultat(undefined, { isError: true, isSuccess: false }),
		);
		medKøer([lagKø({ frittValgAvOppgave: true })]);
		renderMedOmråde(<KøPanel />);

		await user.click(await screen.findByRole('button', { name: 'Reserver/åpne oppgave ABC12' }));
		await user.click(screen.getByRole('menuitem', { name: 'Reserver for annen saksbehandler' }));

		expect(await screen.findByRole('alert')).toHaveTextContent('Kunne ikke hente saksbehandlere. Prøv igjen.');
		expect(screen.queryByRole('menuitem', { name: /Saksbehandler Lars/ })).not.toBeInTheDocument();
	});

	it('lar brukeren navigere til saksbehandlerne med tastaturet', async () => {
		const user = userEvent.setup();
		medKøer([lagKø({ frittValgAvOppgave: true })]);
		renderMedOmråde(<KøPanel />);

		const knapp = await screen.findByRole('button', { name: 'Reserver/åpne oppgave ABC12' });
		knapp.focus();
		await user.keyboard('{Enter}');
		await waitFor(() => expect(screen.getByRole('menu')).toHaveFocus());
		await user.keyboard('{End}{ArrowRight}');

		expect(await screen.findByRole('menuitem', { name: 'Saksbehandler Lars (Z167457)' })).toBeInTheDocument();
		await user.keyboard('{Escape}{Escape}');
		await waitFor(() => expect(knapp).toHaveFocus());
	});

	it('beholder lista og lar brukeren prøve igjen når neste side feiler', async () => {
		const user = userEvent.setup();
		vi.mocked(hentOppgaverISaksbehandlerko)
			.mockResolvedValueOnce([lagOppgaveSammendrag()])
			.mockRejectedValueOnce(new Error('Feil'));
		medKøer([lagKø({ frittValgAvOppgave: true })]);
		renderMedOmråde(<KøPanel />);
		await user.click(await screen.findByRole('button', { name: 'Vis flere oppgaver' }));
		expect(await screen.findByText(/Kunne ikke hente de neste oppgavene/)).toBeInTheDocument();
		expect(screen.getByRole('row', { name: /ABC12/ })).toBeInTheDocument();
		await user.click(screen.getByRole('button', { name: 'Prøv igjen' }));
		await waitFor(() => expect(hentOppgaverISaksbehandlerko).toHaveBeenCalledTimes(3));
	});

	it('henter ti om gangen og nullstiller lista ved købytte', async () => {
		const user = userEvent.setup();
		const oppgaver = Array.from({ length: 30 }, (_, i) =>
			lagOppgaveSammendrag({
				saksnummer: `SAK${i}`,
				oppgaveNøkkel: { ...lagOppgaveSammendrag().oppgaveNøkkel, oppgaveEksternId: `oppgave-${i}` },
			}),
		);
		vi.mocked(hentOppgaverISaksbehandlerko).mockImplementation(async (_område, _id, params) =>
			oppgaver.slice(params.offset, params.offset + params.limit),
		);
		vi.mocked(useHentAntallOppgaverUtenReserverteISaksbehandlerko).mockReturnValue(
			queryResultat({ antallUtenReserverte: 30 }),
		);
		medKøer([lagKø({ ...køA, frittValgAvOppgave: true }), lagKø({ ...køB, frittValgAvOppgave: true })]);
		renderMedOmråde(<KøPanel />);
		await screen.findByRole('table');
		expect(screen.getAllByRole('row')).toHaveLength(11);
		await user.click(screen.getByRole('button', { name: 'Vis flere oppgaver' }));
		await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(21));
		await user.click(screen.getByRole('button', { name: 'Vis flere oppgaver' }));
		await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(31));
		await user.click(screen.getByRole('button', { name: 'Vis flere oppgaver' }));
		await waitFor(() => expect(screen.queryByRole('button', { name: 'Vis flere oppgaver' })).not.toBeInTheDocument());
		expect(screen.getAllByRole('row')).toHaveLength(31);
		await user.selectOptions(screen.getByRole('combobox', { name: 'Velg oppgavekø' }), 'Beta');
		await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(11));
		expect(hentOppgaverISaksbehandlerko).toHaveBeenLastCalledWith(
			'akt',
			2,
			{ limit: 10, offset: 0 },
			undefined,
			expect.anything(),
		);
	});
});
