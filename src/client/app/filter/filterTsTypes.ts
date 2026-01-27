export type Oppgavefilter = {
	type: string;
};

export type FeltverdiOppgavefilter = Oppgavefilter & {
	id: string;
	område: string;
	kode: OppgavefilterKode;
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
	kode: OppgavefilterKode;
	økende: boolean;
};

export type SelectFelt = {
	type: string;
};

export type EnkelSelectFelt = SelectFelt & {
	id: string;
	område: string;
	kode: OppgavefilterKode;
};

export type Oppgavefeltverdi = {
	område: string;
	kode: OppgavefilterKode;
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
	sekundærvalg: boolean;
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
	kode: OppgavefilterKode;
	visningsnavn: string;
	beskrivelse?: string;
	kokriterie: boolean;
	tolkes_som: TolkesSom;
	verdiforklaringerErUttømmende: boolean;
	verdiforklaringer: Verdiforklaring[] | null;
};

/*
	TODO: finne en annen løsning på dette.
	Backend anser denne listen som dynamisk og vi mottar alle disse kodene via API
	og må derfor ha en liste som er lik backend sin liste.

	Denne ligger lagret i frontend fordi:
	- vi noen a kodene til å sette påkrevde felter på toppnivå i kriterier for oppgavekøer.
	- vi bruker noen av kodene til å vite når vi skal vise aksjonspunktvelgeren når man lager query.
*/
export enum OppgavefilterKode {
	AkkumulertVentetidAnnet = 'akkumulertVentetidAnnet',
	AkkumulertVentetidAnnetIkkeSaksbehandlingstid = 'akkumulertVentetidAnnetIkkeSaksbehandlingstid',
	AkkumulertVentetidArbeidsgiver = 'akkumulertVentetidArbeidsgiver',
	AkkumulertVentetidSaksbehandler = 'akkumulertVentetidSaksbehandler',
	AkkumulertVentetidSøker = 'akkumulertVentetidSøker',
	AkkumulertVentetidTekniskFeil = 'akkumulertVentetidTekniskFeil',
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
	PåklagdBehandlingUuid = 'påklagdBehandlingUuid',
	RegistrertDato = 'registrertDato',
	Resultattype = 'resultattype',
	Saksnummer = 'saksnummer',
	TidSidenMottattDato = 'tidSidenMottattDato',
	Totrinnskontroll = 'totrinnskontroll',
	Vedtaksdato = 'vedtaksdato',
	Ytelsestype = 'ytelsestype',
}
