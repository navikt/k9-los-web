export type Oppgavefilter = {
	type: string;
};

export type FeltverdiOppgavefilter = Oppgavefilter & {
	id: string;
	område: string;
	kode: OppgavefilterKode;
	operator: string;
	verdi: (string | null)[];
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
	sekundærvalg?: boolean;
};

export enum TolkesSom {
	String = 'String',
	Duration = 'Duration',
	Boolean = 'boolean',
	Timestamp = 'Timestamp',
}
export type Oppgavefelt = {
	område: string | null;
	// eslint-disable-next-line no-use-before-define
	kode: OppgavefilterKode;
	visningsnavn: string;
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
export type OppgavefilterKode =
	| 'Antall'
	| 'akkumulertVentetidAnnet'
	| 'akkumulertVentetidAnnetIkkeSaksbehandlingstid'
	| 'akkumulertVentetidArbeidsgiver'
	| 'akkumulertVentetidSaksbehandler'
	| 'akkumulertVentetidSøker'
	| 'akkumulertVentetidTekniskFeil'
	| 'aksjonspunkt'
	| 'aktivtAksjonspunkt'
	| 'aktivVentefrist'
	| 'aktivVenteårsak'
	| 'aktorId'
	| 'ansvarligBeslutter'
	| 'ansvarligSaksbehandler'
	| 'avventerAnnet'
	| 'avventerAnnetIkkeSaksbehandlingstid'
	| 'avventerArbeidsgiver'
	| 'avventerSaksbehandler'
	| 'avventerSøker'
	| 'avventerTekniskFeil'
	| 'behandlendeEnhet'
	| 'behandlingsstatus'
	| 'behandlingssteg'
	| 'behandlingTypekode'
	| 'behandlingUuid'
	| 'beskyttelse'
	| 'egenAnsatt'
	| 'personbeskyttelse'
	| 'fagsystem'
	| 'fraEndringsdialog'
	| 'hastesak'
	| 'helautomatiskBehandlet'
	| 'kildeområde'
	| 'liggerHosBeslutter'
	| 'løsbartAksjonspunkt'
	| 'mottattDato'
	| 'nyeKrav'
	| 'oppgaveområde'
	| 'oppgavesaksbehandlingstid'
	| 'oppgavestatus'
	| 'oppgavetype'
	| 'pleietrengendeAktorId'
	| 'påklagdBehandlingUuid'
	| 'relatertPartAktorId'
	| 'registrertDato'
	| 'resultattype'
	| 'saksnummer'
	| 'tidSidenMottattDato'
	| 'totrinnskontroll'
	| 'vedtaksdato'
	| 'ytelsestype';
