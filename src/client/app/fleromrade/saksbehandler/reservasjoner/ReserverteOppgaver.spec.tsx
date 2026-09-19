import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
	useEndreReservasjoner,
	useForlengReservasjon,
	useHentReserverteOppgaver,
	useHentSaksbehandlereForReservasjon,
	useLagreSisteOppgave,
	useOpphevReservasjoner,
} from 'api/generated/los';
import {
	mutationResultat,
	mutationSomLykkes,
	queryResultat,
	renderMedOmråde,
	stubNavigering,
} from 'fleromrade/testUtils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { lagReservasjon, lagReservertOppgave } from '../testdata';
import ReserverteOppgaver from './ReserverteOppgaver';

vi.mock('api/generated/los');

const mutate = (mutasjon: never) => (mutasjon as { mutate: ReturnType<typeof vi.fn> }).mutate;

const reservasjon = lagReservasjon({
	kommentar: 'Tatt over fordi Lars er syk',
	endretAvNavn: 'Saksbehandler Edgar',
	reserverteV3Oppgaver: [
		lagReservertOppgave(),
		lagReservertOppgave({
			oppgaveNøkkel: { oppgaveEksternId: 'lukket', oppgaveTypeEksternId: 'k9sak', områdeEksternId: 'AKTIVITETSPENGER' },
			saksnummer: 'LUKKET',
			oppgavestatus: 'LUKKET',
		}),
	],
});

beforeEach(() => {
	vi.mocked(useHentReserverteOppgaver).mockReturnValue(
		// Backend returnerer også reservasjoner uten oppgaver i området.
		queryResultat([reservasjon, lagReservasjon({ reservasjonsnøkkel: 'annet-område' })]),
	);
	vi.mocked(useHentSaksbehandlereForReservasjon).mockReturnValue(
		queryResultat([
			{ brukerIdent: 'Z123456', navn: 'Saksbehandler Sara' },
			{ brukerIdent: 'Z167457', navn: 'Saksbehandler Lars' },
		]),
	);
	vi.mocked(useLagreSisteOppgave).mockReturnValue(mutationSomLykkes());
	vi.mocked(useForlengReservasjon).mockReturnValue(mutationResultat());
	vi.mocked(useOpphevReservasjoner).mockReturnValue(mutationResultat());
	vi.mocked(useEndreReservasjoner).mockReturnValue(mutationResultat());
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('ReserverteOppgaver', () => {
	it('viser åpne oppgaver som er reservert på brukeren', () => {
		renderMedOmråde(<ReserverteOppgaver />);

		expect(screen.getByText('1 reserverte')).toBeInTheDocument();
		const rader = screen.getAllByRole('row').slice(1);
		expect(rader).toHaveLength(1);
		expect(within(rader[0]).getByText('ABC12')).toBeInTheDocument();
		expect(within(rader[0]).getByText('Førstegangsbehandling')).toBeInTheDocument();
		expect(within(rader[0]).getByText('21.09.2099 kl. 23:59')).toBeInTheDocument();
	});

	it('forteller når brukeren ikke har reserverte oppgaver', () => {
		vi.mocked(useHentReserverteOppgaver).mockReturnValue(queryResultat([]));

		renderMedOmråde(<ReserverteOppgaver />);

		expect(screen.getByText('Du har ingen reserverte oppgaver')).toBeInTheDocument();
	});

	it('åpner oppgaven i fagsystemet og lagrer den i siste oppgaver', async () => {
		const user = userEvent.setup();
		const assign = stubNavigering();

		renderMedOmråde(<ReserverteOppgaver />);
		await user.click(screen.getByRole('link', { name: 'Kari Nordmann 01234567890' }));

		expect(assign).toHaveBeenCalledWith('http://localhost:9000/fagsak/ABC12/');
	});

	it('viser kommentaren på reservasjonen', async () => {
		const user = userEvent.setup();

		renderMedOmråde(<ReserverteOppgaver />);
		await user.click(screen.getByRole('button', { name: 'Vis kommentar' }));

		expect(screen.getByText('Tatt over fordi Lars er syk')).toBeInTheDocument();
		expect(screen.getByText('Endret av Saksbehandler Edgar 17.09.2026 kl. 13:31')).toBeInTheDocument();
	});

	it('forlenger reservasjonen', async () => {
		const user = userEvent.setup();
		const forleng = mutationResultat();
		vi.mocked(useForlengReservasjon).mockReturnValue(forleng);

		renderMedOmråde(<ReserverteOppgaver />);
		await user.click(screen.getByRole('button', { name: 'Handlinger for ABC12' }));
		await user.click(screen.getByRole('menuitem', { name: 'Forleng reservasjonen med 24 timer' }));

		expect(mutate(forleng)).toHaveBeenCalledWith({ omrade: 'akt', data: { reservasjonsnøkkel: 'reservasjon-1' } });
	});

	it('legger oppgaven tilbake i felles kø etter bekreftelse', async () => {
		const user = userEvent.setup();
		const opphev = mutationSomLykkes();
		vi.mocked(useOpphevReservasjoner).mockReturnValue(opphev);

		renderMedOmråde(<ReserverteOppgaver />);
		await user.click(screen.getByRole('button', { name: 'Handlinger for ABC12' }));
		await user.click(screen.getByRole('menuitem', { name: 'Legg tilbake i felles kø' }));
		await user.click(screen.getByRole('button', { name: 'Opphev reservasjon' }));

		expect(mutate(opphev)).toHaveBeenCalledWith(
			{ omrade: 'akt', data: [{ reservasjonsnøkkel: 'reservasjon-1' }] },
			expect.anything(),
		);
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('flytter reservasjonen til en annen saksbehandler med begrunnelse', async () => {
		const user = userEvent.setup();
		const endre = mutationSomLykkes();
		vi.mocked(useEndreReservasjoner).mockReturnValue(endre);

		renderMedOmråde(<ReserverteOppgaver />);
		await user.click(screen.getByRole('button', { name: 'Handlinger for ABC12' }));
		await user.click(screen.getByRole('menuitem', { name: 'Endre eller flytt reservasjonen' }));

		const dialog = screen.getByRole('dialog', { name: 'Endre reservasjon' });
		await user.click(within(dialog).getByRole('combobox', { name: 'Saksbehandler' }));
		await user.click(within(dialog).getByRole('option', { name: 'Saksbehandler Lars' }));
		await user.clear(within(dialog).getByRole('textbox', { name: 'Begrunnelse' }));
		await user.type(within(dialog).getByRole('textbox', { name: 'Begrunnelse' }), 'Ferie');
		await user.click(within(dialog).getByRole('button', { name: 'Lagre' }));

		expect(mutate(endre)).toHaveBeenCalledWith(
			{
				omrade: 'akt',
				data: [
					{
						reservasjonsnøkkel: 'reservasjon-1',
						brukerIdent: 'Z167457',
						begrunnelse: 'Ferie',
						reserverTil: '2099-09-21',
					},
				],
			},
			expect.anything(),
		);
	});

	it('krever begrunnelse for å flytte reservasjonen', async () => {
		const user = userEvent.setup();
		const endre = mutationResultat();
		vi.mocked(useEndreReservasjoner).mockReturnValue(endre);

		renderMedOmråde(<ReserverteOppgaver />);
		await user.click(screen.getByRole('button', { name: 'Handlinger for ABC12' }));
		await user.click(screen.getByRole('menuitem', { name: 'Endre eller flytt reservasjonen' }));
		await user.clear(screen.getByRole('textbox', { name: 'Begrunnelse' }));
		await user.click(screen.getByRole('button', { name: 'Lagre' }));

		expect(screen.getByText('Begrunnelsen må være mellom 3 og 1500 tegn')).toBeInTheDocument();
		expect(mutate(endre)).not.toHaveBeenCalled();
	});
});
