import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
	useEndreReservasjoner,
	useHentAktivReservasjon,
	useLagreSisteOppgave,
	useOpphevReservasjoner,
	useReserverOppgave,
	useSøkEtterOppgaver,
} from 'api/generated/los';
import type { SokeresultatSammendrag } from 'api/generated/los.schemas';
import { useInnloggetBruker } from 'fleromrade/api/innloggetBrukerQueries';
import {
	mutationResultat,
	mutationSomLykkes,
	queryResultat,
	renderMedOmråde,
	stubNavigering,
} from 'fleromrade/testUtils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { innloggetBruker, lagOppgaveSammendrag, lagReservasjon } from '../testdata';
import Søkeboks from './Søkeboks';

vi.mock('api/generated/los');
vi.mock('fleromrade/api/innloggetBrukerQueries', () => ({ useInnloggetBruker: vi.fn() }));

const medSøkeresultat = (resultat: SokeresultatSammendrag | undefined) => {
	const søk = mutationResultat({ data: resultat });
	vi.mocked(useSøkEtterOppgaver).mockReturnValue(søk);
	return (søk as { mutate: ReturnType<typeof vi.fn> }).mutate;
};

beforeEach(() => {
	vi.mocked(useInnloggetBruker).mockReturnValue(queryResultat(innloggetBruker));
	vi.mocked(useHentAktivReservasjon).mockReturnValue(queryResultat(null));
	vi.mocked(useLagreSisteOppgave).mockReturnValue(mutationSomLykkes());
	vi.mocked(useReserverOppgave).mockReturnValue(mutationResultat());
	vi.mocked(useEndreReservasjoner).mockReturnValue(mutationResultat());
	vi.mocked(useOpphevReservasjoner).mockReturnValue(mutationResultat());
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('Søkeboks', () => {
	it('søker i området med renset søkeord', async () => {
		const user = userEvent.setup();
		const søk = medSøkeresultat(undefined);

		renderMedOmråde(<Søkeboks />);
		await user.type(screen.getByRole('searchbox'), 'abc-12');
		await user.click(screen.getByRole('button', { name: 'Søk' }));

		expect(søk).toHaveBeenCalledWith({ omrade: 'akt', data: { søkeord: 'abc12' } });
	});

	it('søker på søkeordet i URL-en ved første visning', () => {
		const søk = medSøkeresultat(undefined);

		renderMedOmråde(<Søkeboks />, { sti: '/akt?sok=ABC12' });

		expect(søk).toHaveBeenCalledWith({ omrade: 'akt', data: { søkeord: 'ABC12' } });
	});

	it('viser personen og oppgavene i søkeresultatet', () => {
		medSøkeresultat({ type: 'MED_RESULTAT', oppgaver: [lagOppgaveSammendrag()] } as SokeresultatSammendrag);

		renderMedOmråde(<Søkeboks />);

		expect(screen.getByRole('heading', { name: 'Kari Nordmann' })).toBeInTheDocument();
		const rad = screen.getAllByRole('row')[1];
		expect(within(rad).getByText('ABC12 (2026)')).toBeInTheDocument();
		expect(within(rad).getByText('Aktivitetspenger')).toBeInTheDocument();
		expect(within(rad).getByText('Førstegangsbehandling')).toBeInTheDocument();
		expect(within(rad).getByText('Åpen')).toBeInTheDocument();
	});

	it('forteller når søket ikke ga treff eller brukeren mangler tilgang', () => {
		medSøkeresultat({ type: 'TOMT_RESULTAT' });
		const { unmount } = renderMedOmråde(<Søkeboks />);
		expect(screen.getByText('Søket ga ingen treff')).toBeInTheDocument();
		unmount();

		medSøkeresultat({ type: 'IKKE_TILGANG' });
		renderMedOmråde(<Søkeboks />);
		expect(screen.getByText('Du har ikke tilgang til å slå opp denne personen')).toBeInTheDocument();
	});

	it('reserverer, lagrer i siste oppgaver og åpner oppgaven i fagsystemet', async () => {
		const user = userEvent.setup();
		const assign = stubNavigering();
		const reserver = mutationSomLykkes({ erReservertAvInnloggetBruker: true });
		vi.mocked(useReserverOppgave).mockReturnValue(reserver);
		const lagre = mutationSomLykkes();
		vi.mocked(useLagreSisteOppgave).mockReturnValue(lagre);
		medSøkeresultat({ type: 'MED_RESULTAT', oppgaver: [lagOppgaveSammendrag()] } as SokeresultatSammendrag);

		renderMedOmråde(<Søkeboks />);
		await user.click(screen.getByRole('button', { name: 'Velg oppgave ABC12' }));
		await user.click(screen.getByRole('button', { name: 'Reserver og åpne oppgave' }));

		const oppgaveNøkkel = lagOppgaveSammendrag().oppgaveNøkkel;
		expect((reserver as { mutate: ReturnType<typeof vi.fn> }).mutate).toHaveBeenCalledWith(
			{ omrade: 'akt', data: { oppgaveNøkkel, overstyrSjekk: false } },
			expect.anything(),
		);
		expect((lagre as { mutate: ReturnType<typeof vi.fn> }).mutate).toHaveBeenCalledWith(
			{ omrade: 'akt', data: oppgaveNøkkel },
			expect.anything(),
		);
		expect(assign).toHaveBeenCalledWith('http://localhost:9000/fagsak/ABC12/');
	});

	it('åpner ikke oppgaven når noen andre rakk å reservere den', async () => {
		const user = userEvent.setup();
		const assign = stubNavigering();
		vi.mocked(useReserverOppgave).mockReturnValue(
			mutationSomLykkes({ erReservertAvInnloggetBruker: false, reservertAvNavn: 'Saksbehandler Lars' }),
		);
		medSøkeresultat({ type: 'MED_RESULTAT', oppgaver: [lagOppgaveSammendrag()] } as SokeresultatSammendrag);

		renderMedOmråde(<Søkeboks />);
		await user.click(screen.getByRole('button', { name: 'Velg oppgave ABC12' }));
		await user.click(screen.getByRole('button', { name: 'Reserver og åpne oppgave' }));

		expect(screen.getByText('Oppgaven ble reservert av Saksbehandler Lars.')).toBeInTheDocument();
		expect(assign).not.toHaveBeenCalled();
	});

	it('lar brukeren overta en reservasjon fra en annen saksbehandler', async () => {
		const user = userEvent.setup();
		stubNavigering();
		vi.mocked(useHentAktivReservasjon).mockReturnValue(
			queryResultat(lagReservasjon({ reservertAvIdent: 'Z999999', reservertAvNavn: 'Saksbehandler Lars' })),
		);
		const endre = mutationSomLykkes();
		vi.mocked(useEndreReservasjoner).mockReturnValue(endre);
		medSøkeresultat({ type: 'MED_RESULTAT', oppgaver: [lagOppgaveSammendrag()] } as SokeresultatSammendrag);

		renderMedOmråde(<Søkeboks />);
		await user.click(screen.getByRole('button', { name: 'Velg oppgave ABC12' }));
		await user.click(screen.getByRole('button', { name: 'Overta reservasjon og åpne oppgave' }));

		expect((endre as { mutate: ReturnType<typeof vi.fn> }).mutate).toHaveBeenCalledWith(
			{ omrade: 'akt', data: [{ reservasjonsnøkkel: 'reservasjon-1', brukerIdent: 'Z123456' }] },
			expect.anything(),
		);
	});

	it('henter aktiv reservasjon for oppgaven i området', async () => {
		const user = userEvent.setup();
		medSøkeresultat({ type: 'MED_RESULTAT', oppgaver: [lagOppgaveSammendrag()] } as SokeresultatSammendrag);

		renderMedOmråde(<Søkeboks />);
		await user.click(screen.getByRole('button', { name: 'Velg oppgave ABC12' }));

		expect(useHentAktivReservasjon).toHaveBeenCalledWith(
			'akt',
			{ oppgaveEksternId: 'oppgave-1', oppgaveTypeEksternId: 'k9sak' },
			expect.anything(),
		);
	});
});
