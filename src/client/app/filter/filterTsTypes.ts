export type Oppgavefilter = {
	type: string;
};

export type FeltverdiOppgavefilter = Oppgavefilter & {
	id: string;
	område: string;
	kode: string;
	operator: string;
	verdi: string[];
};

export type CombineOppgavefilter = Oppgavefilter &
	FilterContainer & {
		combineOperator: string;
	};

export type FilterType = FeltverdiOppgavefilter | CombineOppgavefilter;

export type FilterContainer = {
	id: string;
	filtere: FilterType[];
};

export type OppgaveQuery = FilterContainer & {
	select: EnkelSelectFelt[];
	order: EnkelOrderFelt[];
	limit: number;
};

export type OrderFelt = {
	type: string;
};

export type EnkelOrderFelt = OrderFelt & {
	id: string;
	område: string;
	kode: string;
	økende: boolean;
};

export type SelectFelt = {
	type: string;
};

export type EnkelSelectFelt = SelectFelt & {
	id: string;
	område: string;
	kode: string;
};

export type Oppgavefeltverdi = {
	område: string;
	kode: string;
	verdi: string | string[];
};

export type Oppgaverad = {
	id?: string;
	felter: Oppgavefeltverdi[];
};

export type Verdiforklaring = {
	verdi: string;
	visningsnavn: string;
	gruppering: string | undefined;
	sekundærvalg?: boolean;
	synlighet?: 'SKJULT' | 'OVER_STREKEN' | 'UNDER_STREKEN';
};

export enum TolkesSom {
	String = 'String',
	Duration = 'Duration',
	Boolean = 'boolean',
	Timestamp = 'Timestamp',
	Integer = 'Integer',
}

export type Oppgavefelt = {
	område: string;
	kode: string;
	visningsnavn: string;
	beskrivelse?: string;
	kokriterie: boolean;
	tolkes_som: TolkesSom;
	verdiforklaringerErUttømmende: boolean;
	verdiforklaringer: Verdiforklaring[] | null;
};

// Kjente kode-verdier fra backend, brukes til sammenligning der frontend trenger spesifikk logikk.
// kode-feltet i typene er string fordi backend anser listen som dynamisk.
export enum OppgavefilterKode {
	AkkumulertVentetidAnnet = 'akkumulertVentetidAnnet',
	AkkumulertVentetidAnnetForTidligereVersjoner = 'akkumulertVentetidAnnetForTidligereVersjoner',
	AkkumulertVentetidAnnetIkkeSaksbehandlingstid = 'akkumulertVentetidAnnetIkkeSaksbehandlingstid',
	AkkumulertVentetidAnnetIkkeSaksbehandlingstidForTidligereVersjoner = 'akkumulertVentetidAnnetIkkeSaksbehandlingstidForTidligereVersjoner',
	AkkumulertVentetidArbeidsgiver = 'akkumulertVentetidArbeidsgiver',
	AkkumulertVentetidArbeidsgiverForTidligereVersjoner = 'akkumulertVentetidArbeidsgiverForTidligereVersjoner',
	AkkumulertVentetidSaksbehandler = 'akkumulertVentetidSaksbehandler',
	AkkumulertVentetidSøker = 'akkumulertVentetidSøker',
	AkkumulertVentetidSøkerForTidligereVersjoner = 'akkumulertVentetidSøkerForTidligereVersjoner',
	AkkumulertVentetidTekniskFeil = 'akkumulertVentetidTekniskFeil',
	AkkumulertVentetidTekniskFeilForTidligereVersjoner = 'akkumulertVentetidTekniskFeilForTidligereVersjoner',
	AkkumulertVentetidSaksbehandlerForTidligereVersjoner = 'akkumulertVentetidSaksbehandlerForTidligereVersjoner',
	AktorId = 'aktorId',
	Aksjonspunkt = 'aksjonspunkt',
	AktivtAksjonspunkt = 'aktivtAksjonspunkt',
	AktivVentefrist = 'aktivVentefrist',
	AktivVenteårsak = 'aktivVenteårsak',
	AnsvarligBeslutter = 'ansvarligBeslutter',
	AnsvarligSaksbehandler = 'ansvarligSaksbehandler',
	AvventerAnnet = 'avventerAnnet',
	AvventerAnnetIkkeSaksbehandlingstid = 'avventerAnnetIkkeSaksbehandlingstid',
	AvventerArbeidsgiver = 'avventerArbeidsgiver',
	AvventerSaksbehandler = 'avventerSaksbehandler',
	AvventerSøker = 'avventerSøker',
	AvventerTekniskFeil = 'avventerTekniskFeil',
	BehandlendeEnhet = 'behandlendeEnhet',
	Behandlingsstatus = 'behandlingsstatus',
	Behandlingssteg = 'behandlingssteg',
	Behandlingsårsak = 'behandlingsårsak',
	BehandlingTypekode = 'behandlingTypekode',
	BehandlingUuid = 'behandlingUuid',
	Personbeskyttelse = 'personbeskyttelse',
	Fagsystem = 'fagsystem',
	FraEndringsdialog = 'fraEndringsdialog',
	Hastesak = 'hastesak',
	HelautomatiskBehandlet = 'helautomatiskBehandlet',
	LiggerHosBeslutter = 'liggerHosBeslutter',
	LøsbartAksjonspunkt = 'løsbartAksjonspunkt',
	MottattDato = 'mottattDato',
	NyeKrav = 'nyeKrav',
	Oppgavesaksbehandlingstid = 'oppgavesaksbehandlingstid',
	Oppgavestatus = 'oppgavestatus',
	Oppgavetype = 'oppgavetype',
	PleietrengendeAktorId = 'pleietrengendeAktorId',
	PåklagdBehandlingUuid = 'påklagdBehandlingUuid',
	RegistrertDato = 'registrertDato',
	RelatertPartAktorid = 'relatertPartAktorid',
	Resultattype = 'resultattype',
	Saksnummer = 'saksnummer',
	TidSidenMottattDato = 'tidSidenMottattDato',
	Totrinnskontroll = 'totrinnskontroll',
	Vedtaksdato = 'vedtaksdato',
	Ytelsestype = 'ytelsestype',
}
