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
import type { GenerellOppgaveV3Dto } from 'api/generated/los.schemas';
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

const oppgave = (id: string, overstyring: Partial<GenerellOppgaveV3Dto> = {}) =>
	lagReservertOppgave({
		saksnummer: id,
		oppgaveNøkkel: { oppgaveEksternId: id, oppgaveTypeEksternId: 'k9sak', områdeEksternId: 'AKTIVITETSPENGER' },
		...overstyring,
	});

// Reservasjonen med to oppgaver utløper sist, og skal derfor stå sist.
const toOppgaver = lagReservasjon({
	reservasjonsnøkkel: 'to-oppgaver',
	reservertTil: '2099-09-22T23:59:00',
	kommentar: 'Tatt over fordi Lars er syk',
	endretAvNavn: 'Saksbehandler Edgar',
	reserverteV3Oppgaver: [
		oppgave('NYEST', { opprettetTidspunkt: '2026-09-18T09:00:00' }),
		oppgave('ELDST', { opprettetTidspunkt: '2026-09-10T09:00:00' }),
		oppgave('LUKKET', { oppgavestatus: 'LUKKET' }),
	],
});
const énOppgave = lagReservasjon({
	reservasjonsnøkkel: 'én-oppgave',
	reservertTil: '2099-09-21T23:59:00',
	reserverteV3Oppgaver: [oppgave('FØRST'), oppgave('VENTER', { oppgavestatus: 'VENTER' })],
});

const radtekster = () =>
	screen
		.getAllByRole('row')
		.slice(1)
		// Kopiknappen har en skjult tekst som ikke er en del av verdien.
		.map((rad) => within(rad).getAllByRole('cell')[1].textContent.replace('Kopier saksnummer', ''));

beforeEach(() => {
	vi.mocked(useHentReserverteOppgaver).mockReturnValue(
		// Backend returnerer også reservasjoner uten oppgaver i området.
		queryResultat([toOppgaver, énOppgave, lagReservasjon({ reservasjonsnøkkel: 'annet-område' })], {
			dataUpdatedAt: 1,
		}),
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
	it('grupperer åpne oppgaver per reservasjon, med den som utløper først øverst', () => {
		renderMedOmråde(<ReserverteOppgaver />);

		expect(radtekster()).toEqual(['FØRST', 'ELDST', 'NYEST']);
		// Én tbody per reservasjon, i tillegg til headeren.
		expect(screen.getAllByRole('rowgroup')).toHaveLength(3);
	});

	it('viser søker, behandlingstype med ytelse og reservasjonsdato', () => {
		renderMedOmråde(<ReserverteOppgaver />);

		const rad = screen.getAllByRole('row')[1];
		expect(within(rad).getByText('Kari Nordmann')).toBeInTheDocument();
		expect(within(rad).getByText('Førstegangsbehandling')).toBeInTheDocument();
		expect(within(rad).getByText('Aktivitetspenger')).toBeInTheDocument();
		expect(within(rad).getByText('21.09.2099')).toBeInTheDocument();
		expect(within(rad).getByRole('button', { name: 'Kopier fødselsnummer' })).toBeInTheDocument();
		expect(within(rad).getByRole('button', { name: 'Kopier saksnummer' })).toBeInTheDocument();
	});

	it('filtrerer på status med chips, og viser oppgaver på vent når det velges', async () => {
		const user = userEvent.setup();
		renderMedOmråde(<ReserverteOppgaver />);

		expect(screen.getByRole('button', { name: '3 åpne' })).toBeInTheDocument();
		await user.click(screen.getByRole('button', { name: '1 på vent' }));

		expect(radtekster()).toEqual(['FØRST', 'VENTERPå vent', 'ELDST', 'NYEST']);

		await user.click(screen.getByRole('button', { name: '3 åpne' }));

		expect(radtekster()).toEqual(['VENTERPå vent']);
	});

	it('kan skjule og vise reservasjonene', async () => {
		const user = userEvent.setup();
		renderMedOmråde(<ReserverteOppgaver />);

		await user.click(screen.getByRole('button', { name: 'Reserverte oppgaver' }));
		expect(screen.queryByRole('table')).not.toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: 'Reserverte oppgaver' }));
		expect(screen.getByRole('table')).toBeInTheDocument();
	});

	it('forteller når brukeren ikke har reserverte oppgaver', () => {
		vi.mocked(useHentReserverteOppgaver).mockReturnValue(queryResultat([]));

		renderMedOmråde(<ReserverteOppgaver />);

		expect(screen.getByText('Det er ingen reserverte oppgaver')).toBeInTheDocument();
	});

	it('åpner oppgaven i fagsystemet og lagrer den i siste oppgaver', async () => {
		const user = userEvent.setup();
		const assign = stubNavigering();

		renderMedOmråde(<ReserverteOppgaver />);
		await user.click(within(screen.getAllByRole('row')[1]).getByRole('button', { name: 'Åpne' }));

		expect(assign).toHaveBeenCalledWith('http://localhost:9000/fagsak/ABC12/');
	});

	it('viser kommentaren på reservasjonen', async () => {
		const user = userEvent.setup();

		renderMedOmråde(<ReserverteOppgaver />);
		const knapp = screen.getAllByRole('button', { name: 'Vis kommentar for reservasjonen' })[0];
		await user.click(knapp);

		const popover = document.getElementById(knapp.getAttribute('aria-controls'));
		expect(within(popover).getByText('Tatt over fordi Lars er syk')).toBeInTheDocument();
		expect(within(popover).getByText('Reservasjon endret av Saksbehandler Edgar')).toBeInTheDocument();
	});

	it('forlenger hele reservasjonen fra en av oppgavene', async () => {
		const user = userEvent.setup();
		const forleng = mutationResultat();
		vi.mocked(useForlengReservasjon).mockReturnValue(forleng);

		renderMedOmråde(<ReserverteOppgaver />);
		await user.click(screen.getAllByRole('button', { name: 'Handlinger på reservasjonen med 2 oppgaver' })[0]);
		await user.click(screen.getByRole('menuitem', { name: /Forleng din reservasjon av oppgavene/ }));

		expect(mutate(forleng)).toHaveBeenCalledWith({ omrade: 'akt', data: { reservasjonsnøkkel: 'to-oppgaver' } });
	});

	it('legger alle oppgavene i reservasjonen tilbake i felles kø etter bekreftelse', async () => {
		const user = userEvent.setup();
		const opphev = mutationSomLykkes();
		vi.mocked(useOpphevReservasjoner).mockReturnValue(opphev);

		renderMedOmråde(<ReserverteOppgaver />);
		await user.click(screen.getAllByRole('button', { name: 'Handlinger på reservasjonen med 2 oppgaver' })[0]);
		await user.click(screen.getByRole('menuitem', { name: /Legg oppgavene tilbake i felles kø/ }));

		expect(screen.getByText('Er du sikker på at du vil oppheve reservasjonen av 2 oppgaver?')).toBeInTheDocument();
		await user.click(screen.getByRole('button', { name: 'Opphev reservasjon' }));

		expect(mutate(opphev)).toHaveBeenCalledWith(
			{ omrade: 'akt', data: [{ reservasjonsnøkkel: 'to-oppgaver' }] },
			expect.anything(),
		);
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('flytter reservasjonen til en annen saksbehandler med begrunnelse', async () => {
		const user = userEvent.setup();
		const endre = mutationSomLykkes();
		vi.mocked(useEndreReservasjoner).mockReturnValue(endre);

		renderMedOmråde(<ReserverteOppgaver />);
		await user.click(screen.getByRole('button', { name: 'Handlinger på reservasjonen' }));
		await user.click(screen.getByRole('menuitem', { name: 'Endre og/eller flytte reservasjon' }));

		const dialog = screen.getByRole('dialog', { name: 'Endre reservasjon' });
		await user.click(within(dialog).getByRole('combobox', { name: 'Saksbehandler' }));
		await user.click(within(dialog).getByRole('option', { name: 'Saksbehandler Lars' }));
		await user.type(within(dialog).getByRole('textbox', { name: 'Begrunnelse' }), 'Ferie');
		await user.click(within(dialog).getByRole('button', { name: 'Lagre' }));

		expect(mutate(endre)).toHaveBeenCalledWith(
			{
				omrade: 'akt',
				data: [
					{ reservasjonsnøkkel: 'én-oppgave', brukerIdent: 'Z167457', begrunnelse: 'Ferie', reserverTil: '2099-09-21' },
				],
			},
			expect.anything(),
		);
	});

	it('forteller at flyttingen gjelder alle oppgavene i reservasjonen', async () => {
		const user = userEvent.setup();

		renderMedOmråde(<ReserverteOppgaver />);
		await user.click(screen.getAllByRole('button', { name: 'Handlinger på reservasjonen med 2 oppgaver' })[0]);
		await user.click(screen.getByRole('menuitem', { name: 'Endre og/eller flytte reservasjon' }));

		expect(screen.getByText('Reservasjonen gjelder 2 oppgaver.')).toBeInTheDocument();
	});

	it('krever begrunnelse for å flytte reservasjonen', async () => {
		const user = userEvent.setup();
		const endre = mutationResultat();
		vi.mocked(useEndreReservasjoner).mockReturnValue(endre);

		renderMedOmråde(<ReserverteOppgaver />);
		await user.click(screen.getByRole('button', { name: 'Handlinger på reservasjonen' }));
		await user.click(screen.getByRole('menuitem', { name: 'Endre og/eller flytte reservasjon' }));
		await user.click(screen.getByRole('button', { name: 'Lagre' }));

		expect(screen.getByText('Begrunnelsen må være mellom 3 og 1500 tegn')).toBeInTheDocument();
		expect(mutate(endre)).not.toHaveBeenCalled();
	});
});
