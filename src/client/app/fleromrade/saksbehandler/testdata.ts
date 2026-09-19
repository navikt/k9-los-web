import type {
	GenerellOppgaveV3Dto,
	InnloggetBrukerDtoNy,
	OppgaveKo,
	OppgaveSammendragDto,
	ReservasjonV3Dto,
} from 'api/generated/los.schemas';

// Formen er hentet fra faktiske svar fra backend.

export const innloggetBruker: InnloggetBrukerDtoNy = {
	brukerIdent: 'Z123456',
	epost: 'saksbehandler.sara@nav.no',
	finnesISaksbehandlerTabell: true,
	id: 1,
	navn: 'Saksbehandler Sara',
	tilganger: { basis: true, drift: false, kode6: false, oppgavestyring: false, reservering: true },
};

export const lagOppgaveSammendrag = (overstyring: Partial<OppgaveSammendragDto> = {}): OppgaveSammendragDto => ({
	oppgaveNøkkel: { oppgaveEksternId: 'oppgave-1', oppgaveTypeEksternId: 'k9sak', områdeEksternId: 'AKTIVITETSPENGER' },
	reservasjonsnøkkel: 'reservasjon-1',
	person: { navn: 'Kari Nordmann', fnr: '01234567890', kjønn: 'KVINNE', dødsdato: null },
	ytelse: { kode: 'AKT', navn: 'Aktivitetspenger' },
	behandlingstype: { kode: 'BT-002', navn: 'Førstegangsbehandling' },
	saksnummer: 'ABC12',
	journalpostId: null,
	fagsakÅr: 2026,
	opprettetTidspunkt: '2026-09-07T13:31:03',
	oppgavestatus: { kode: 'AAPEN', navn: 'Åpen' },
	behandlingsstatus: { kode: 'UTRED', navn: 'Utredes' },
	oppgavebehandlingsUrl: 'http://localhost:9000/fagsak/ABC12/',
	hastesak: false,
	...overstyring,
});

export const lagReservasjon = (overstyring: Partial<ReservasjonV3Dto> = {}): ReservasjonV3Dto => ({
	reserverteV3Oppgaver: [],
	reservasjonsnøkkel: 'reservasjon-1',
	reservertAvNavn: 'Saksbehandler Sara',
	reservertAvIdent: 'Z123456',
	reservertAvEpost: 'saksbehandler.sara@nav.no',
	reservertAvId: 1,
	kommentar: '',
	reservertFra: '2026-09-17T13:31:12',
	// Langt fram i tid, siden datovelgeren kun godtar datoer fra og med i dag.
	reservertTil: '2099-09-21T23:59:00',
	endretAvNavn: null,
	...overstyring,
});

export const lagReservertOppgave = (overstyring: Partial<GenerellOppgaveV3Dto> = {}): GenerellOppgaveV3Dto => ({
	søkersNavn: 'Kari Nordmann',
	søkersPersonnr: '01234567890',
	søkersKjønn: 'KVINNE',
	søkersDødsdato: null,
	// Backend sender kodeverkobjekter her, selv om spec-en sier enum-streng.
	ytelsestype: { kode: 'AKT', navn: 'Aktivitetspenger' } as never,
	behandlingstype: { kode: 'BT-002', navn: 'Førstegangsbehandling' } as never,
	saksnummer: 'ABC12',
	oppgaveNøkkel: { oppgaveEksternId: 'oppgave-1', oppgaveTypeEksternId: 'k9sak', områdeEksternId: 'AKTIVITETSPENGER' },
	journalpostId: null,
	opprettetTidspunkt: '2026-09-17T13:31:01',
	oppgavestatus: 'AAPEN',
	oppgavebehandlingsUrl: 'http://localhost:9000/fagsak/ABC12/',
	reservasjonsnøkkel: 'reservasjon-1',
	hastesak: false,
	...overstyring,
});

export const lagKø = (overstyring: Partial<OppgaveKo> = {}): OppgaveKo => ({
	id: 1,
	versjon: 1,
	tittel: 'Førstegangsbehandlinger',
	beskrivelse: 'Nye saker',
	oppgaveQuery: { filtere: [], select: [], order: [] },
	frittValgAvOppgave: false,
	saksbehandlerIds: [],
	saksbehandlere: [],
	endretTidspunkt: null,
	skjermet: false,
	område: 'AKTIVITETSPENGER',
	...overstyring,
});
