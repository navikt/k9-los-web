import NavAnsatt from 'app/navAnsattTsType';
import { SøkeboksOppgaveDto } from 'saksbehandler/sokeboks/SøkeboksOppgaveDto';
import { modalInnhold } from 'saksbehandler/sokeboks/modal-innhold';

const innloggetSaksbehandler: NavAnsatt = {
	navn: 'Sara Saksbehandler',
	brukerIdent: 'Z123456',
	kanReservere: true,
	brukernavn: 'Z123456@nav.no',
	funksjonellTid: '',
	kanSaksbehandle: true,
	kanBehandleKode6: false,
	kanDrifte: true,
	kanOppgavestyre: true,
	finnesISaksbehandlerTabell: true,
};

const oppgave: SøkeboksOppgaveDto = {
	navn: 'Ola Oppgave',
	fnr: '01234567890',
	reservertTom: null,
	oppgavestatus: {
		kode: 'AAPEN',
		navn: 'Åpen',
	},
	kjønn: 'MANN',
	oppgavebehandlingsUrl: '',
	dødsdato: null,
	behandlingstype: { kode: '', navn: '', kodeverk: '' },
	ytelsestype: { kode: '', navn: '', kodeverk: '' },
	oppgaveNøkkel: { oppgaveEksternId: '', oppgaveTypeEksternId: '', områdeEksternId: 'K9' },
	journalpostId: null,
	opprettetTidspunkt: '',
	reservertAvSaksbehandlerIdent: null,
	reservertAvSaksbehandlerNavn: null,
	reservasjonsnøkkel: '',
	saksnummer: '',
	hastesak: false,
};

describe('Skal lage riktig modalinnhold', () => {
	test('på vent, ikke reservert', () => {
		const resultat = modalInnhold(
			{ ...oppgave, oppgavestatus: { kode: 'VENTER', navn: 'Venter' } },
			{ ...innloggetSaksbehandler, kanReservere: true },
		);
		expect(resultat).toStrictEqual({
			heading: 'Oppgaven er satt på vent',
			modaltekst: 'Oppgaven er ikke reservert.',
			visÅpneOgReserverKnapp: false,
			visÅpneOgEndreReservasjonKnapp: true,
			visLeggTilbakeIKøKnapp: false,
		});
	});

	test('på vent, reservert av en annen', () => {
		const resultat = modalInnhold(
			{
				...oppgave,
				reservertAvSaksbehandlerIdent: 'M999999',
				reservertAvSaksbehandlerNavn: 'Super Saksbehandler',
				reservertTom: '2029-12-31T23:59:59.000',
				oppgavestatus: {
					kode: 'VENTER',
					navn: 'Venter',
				},
			},
			{ ...innloggetSaksbehandler, kanReservere: true },
		);
		expect(resultat).toStrictEqual({
			heading: 'Oppgaven er satt på vent',
			modaltekst: 'Oppgaven er reservert av Super Saksbehandler t.o.m. 31.12.2029 kl. 23:59.',
			visÅpneOgReserverKnapp: false,
			visÅpneOgEndreReservasjonKnapp: true,
			visLeggTilbakeIKøKnapp: false,
		});
	});

	test('ikke reservert, kan reservere selv', () => {
		const resultat = modalInnhold(
			{ ...oppgave, reservertTom: null, reservertAvSaksbehandlerIdent: null, reservertAvSaksbehandlerNavn: null },
			{ ...innloggetSaksbehandler, kanReservere: true },
		);
		expect(resultat).toStrictEqual({
			heading: 'Oppgaven er ikke reservert',
			modaltekst: '',
			visÅpneOgReserverKnapp: true,
			visÅpneOgEndreReservasjonKnapp: false,
			visLeggTilbakeIKøKnapp: false,
		});
	});

	test('ikke reservert, kan ikke reservere selv', () => {
		const resultat = modalInnhold(
			{ ...oppgave, reservertTom: null, reservertAvSaksbehandlerIdent: null, reservertAvSaksbehandlerNavn: null },
			{ ...innloggetSaksbehandler, kanReservere: false },
		);
		expect(resultat).toStrictEqual({
			heading: 'Oppgaven er ikke reservert',
			modaltekst: '',
			visÅpneOgReserverKnapp: false,
			visÅpneOgEndreReservasjonKnapp: false,
			visLeggTilbakeIKøKnapp: false,
		});
	});

	test('reservert av andre, kan ikke reservere selv', () => {
		const resultat = modalInnhold(
			{
				...oppgave,
				reservertTom: '2024-10-01T00:00:00.00000',
				reservertAvSaksbehandlerIdent: 'X654321',
				reservertAvSaksbehandlerNavn: 'Annen Saksbehandler',
			},
			{ ...innloggetSaksbehandler, kanReservere: false },
		);
		expect(resultat).toStrictEqual({
			heading: 'En annen saksbehandler arbeider nå med denne oppgaven',
			modaltekst: 'Oppgaven er reservert av Annen Saksbehandler t.o.m. 01.10.2024 kl. 00:00.',
			visÅpneOgReserverKnapp: false,
			visÅpneOgEndreReservasjonKnapp: false,
			visLeggTilbakeIKøKnapp: false,
		});
	});

	test('reservert av andre, kan reservere selv', () => {
		const resultat = modalInnhold(
			{
				...oppgave,
				reservertTom: '2024-10-01T00:00:00.00000',
				reservertAvSaksbehandlerIdent: 'X654321',
				reservertAvSaksbehandlerNavn: 'Annen Saksbehandler',
			},
			{ ...innloggetSaksbehandler, kanReservere: true },
		);
		expect(resultat).toStrictEqual({
			heading: 'En annen saksbehandler arbeider nå med denne oppgaven',
			modaltekst: 'Oppgaven er reservert av Annen Saksbehandler t.o.m. 01.10.2024 kl. 00:00.',
			visÅpneOgReserverKnapp: false,
			visÅpneOgEndreReservasjonKnapp: true,
			visLeggTilbakeIKøKnapp: false,
		});
	});

	test('reservert på seg selv', () => {
		const resultat = modalInnhold(
			{
				...oppgave,
				reservertTom: '2024-10-01T00:00:00.00000',
				reservertAvSaksbehandlerIdent: 'Z123456',
				reservertAvSaksbehandlerNavn: 'Sara Saksbehandler',
			},
			{ ...innloggetSaksbehandler, kanReservere: true },
		);
		expect(resultat).toStrictEqual({
			heading: 'Oppgaven er reservert av deg',
			modaltekst: '',
			visÅpneOgReserverKnapp: false,
			visÅpneOgEndreReservasjonKnapp: false,
			visLeggTilbakeIKøKnapp: true,
		});
	});
});
