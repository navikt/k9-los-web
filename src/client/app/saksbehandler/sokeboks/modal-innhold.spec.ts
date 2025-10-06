import NavAnsatt from 'app/navAnsattTsType';
import ReservasjonV3 from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';
import { modalInnhold as modalInnholdOriginal } from 'saksbehandler/sokeboks/modal-innhold';
import { SøkeboksOppgaveDto } from 'saksbehandler/sokeboks/søkeboks-oppgave-dto';

const modalInnhold = (
	oppgave: Partial<SøkeboksOppgaveDto>,
	innloggetSaksbehandler: Partial<NavAnsatt>,
	reservasjon: Partial<ReservasjonV3> | null,
) => {
	const defaultSaksbehandler: NavAnsatt = {
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

	const defaultOppgave: SøkeboksOppgaveDto = {
		navn: 'Ola Oppgave',
		status: 'Åpen',
		oppgavebehandlingsUrl: '',
		ytelsestype: '',
		oppgaveNøkkel: { oppgaveEksternId: '', oppgaveTypeEksternId: '', områdeEksternId: 'K9' },
		journalpostId: null,
		opprettetTidspunkt: '',
		reservasjonsnøkkel: '',
		saksnummer: '',
		hastesak: false,
		fagsakÅr: null,
	};

	const defaultReservasjon: ReservasjonV3 = {
		reserverteV3Oppgaver: [],
		reservertAvEpost: 'saksbehandler@test.no',
		reservertAvIdent: 'Z123456',
		reservertAvNavn: 'Sara Saksbehandler',
		reservertFra: '2024-09-01T00:00:00.000',
		reservertTil: '2024-10-01T00:00:00.000',
		kommentar: '',
	};

	return modalInnholdOriginal(
		{ ...defaultOppgave, ...oppgave },
		{ ...defaultSaksbehandler, ...innloggetSaksbehandler },
		reservasjon != null ? { ...defaultReservasjon, ...reservasjon } : null,
	);
};

describe('Skal lage riktig modalinnhold', () => {
	test('på vent, ikke reservert', () => {
		const resultat = modalInnhold({ status: 'Venter' }, { kanReservere: true }, null);
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
				status: 'Venter',
			},
			{ kanReservere: true },
			{
				reservertAvIdent: 'M999999',
				reservertAvNavn: 'Super Saksbehandler',
				reservertTil: '2029-12-31T23:59:59.000',
			},
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
		const resultat = modalInnhold({}, { kanReservere: true }, null);
		expect(resultat).toStrictEqual({
			heading: 'Oppgaven er ikke reservert',
			modaltekst: '',
			visÅpneOgReserverKnapp: true,
			visÅpneOgEndreReservasjonKnapp: false,
			visLeggTilbakeIKøKnapp: false,
		});
	});

	test('ikke reservert, kan ikke reservere selv', () => {
		const resultat = modalInnhold({}, { kanReservere: false }, null);
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
			{},
			{ kanReservere: false },
			{
				reservertTil: '2024-10-01T00:00:00.00000',
				reservertAvIdent: 'X654321',
				reservertAvNavn: 'Annen Saksbehandler',
			},
		);
		expect(resultat).toStrictEqual({
			heading: 'Oppgaven er reservert av en annen saksbehandler',
			modaltekst: 'Oppgaven er reservert av Annen Saksbehandler t.o.m. 01.10.2024 kl. 00:00.',
			visÅpneOgReserverKnapp: false,
			visÅpneOgEndreReservasjonKnapp: false,
			visLeggTilbakeIKøKnapp: false,
		});
	});

	test('reservert av andre, kan reservere selv', () => {
		const resultat = modalInnhold(
			{},
			{ kanReservere: true },
			{
				reservertTil: '2024-10-01T00:00:00.00000',
				reservertAvIdent: 'X654321',
				reservertAvNavn: 'Annen Saksbehandler',
			},
		);
		expect(resultat).toStrictEqual({
			heading: 'Oppgaven er reservert av en annen saksbehandler',
			modaltekst: 'Oppgaven er reservert av Annen Saksbehandler t.o.m. 01.10.2024 kl. 00:00.',
			visÅpneOgReserverKnapp: false,
			visÅpneOgEndreReservasjonKnapp: true,
			visLeggTilbakeIKøKnapp: false,
		});
	});

	test('reservert på seg selv', () => {
		const resultat = modalInnhold(
			{},
			{ kanReservere: true },
			{
				reservertTil: '2024-10-01T00:00:00.00000',
				reservertAvIdent: 'Z123456',
				reservertAvNavn: 'Sara Saksbehandler',
			},
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
