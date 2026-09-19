import { describe, expect, it } from 'vitest';
import { innloggetBruker, lagOppgaveSammendrag, lagReservasjon } from '../testdata';
import { oppgaveModalInnhold } from './oppgaveModalInnhold';

const åpen = lagOppgaveSammendrag();
const venter = lagOppgaveSammendrag({ oppgavestatus: { kode: 'VENTER', navn: 'Venter' } });
const reservertAvMeg = lagReservasjon();
const reservertAvAnnen = lagReservasjon({
	reservertAvIdent: 'Z999999',
	reservertAvNavn: 'Saksbehandler Lars',
	reservertTil: '2026-09-21T23:59:00',
});
const utenReservering = { ...innloggetBruker, tilganger: { ...innloggetBruker.tilganger, reservering: false } };

describe('oppgaveModalInnhold', () => {
	it('lar brukeren reservere en ledig oppgave', () => {
		expect(oppgaveModalInnhold(åpen, innloggetBruker, null)).toEqual({
			tittel: 'Oppgaven er ikke reservert',
			tekst: '',
			visReserver: true,
			visOvertaReservasjon: false,
			visLeggTilbake: false,
		});
	});

	it('skjuler reservering for brukere uten reservasjonstilgang', () => {
		const innhold = oppgaveModalInnhold(åpen, utenReservering, reservertAvAnnen);

		expect(innhold.visReserver).toBe(false);
		expect(innhold.visOvertaReservasjon).toBe(false);
	});

	it('lar brukeren legge tilbake en oppgave de selv har reservert', () => {
		expect(oppgaveModalInnhold(åpen, innloggetBruker, reservertAvMeg)).toMatchObject({
			tittel: 'Oppgaven er reservert av deg',
			visLeggTilbake: true,
			visReserver: false,
		});
	});

	it('lar brukeren overta en oppgave som er reservert av en annen', () => {
		expect(oppgaveModalInnhold(åpen, innloggetBruker, reservertAvAnnen)).toMatchObject({
			tittel: 'Oppgaven er reservert av en annen saksbehandler',
			tekst: 'Oppgaven er reservert av Saksbehandler Lars t.o.m. 21.09.2026 kl. 23:59.',
			visOvertaReservasjon: true,
		});
	});

	it('forklarer reservasjonen for oppgaver som venter', () => {
		expect(oppgaveModalInnhold(venter, innloggetBruker, null)).toMatchObject({
			tittel: 'Oppgaven er satt på vent',
			tekst: 'Oppgaven er ikke reservert.',
			visReserver: true,
		});
		expect(oppgaveModalInnhold(venter, innloggetBruker, reservertAvMeg)).toMatchObject({
			tekst: 'Oppgaven er reservert av deg.',
			visLeggTilbake: true,
		});
		expect(oppgaveModalInnhold(venter, innloggetBruker, reservertAvAnnen)).toMatchObject({
			tekst: 'Oppgaven er reservert av Saksbehandler Lars t.o.m. 21.09.2026 kl. 23:59.',
			visOvertaReservasjon: true,
		});
	});
});
