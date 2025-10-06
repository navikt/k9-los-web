type OppgaveNøkkelDto = {
	områdeEksternId: string;
	oppgaveEksternId: string;
	oppgaveTypeEksternId: string;
};

export type SøkeboksPersonDto = {
	navn: string;
	fnr: string;
	kjønn: string;
	dødsdato?: string;
};

export type SøkeboksOppgaveDto = {
	navn: string;
	ytelsestype: string;
	saksnummer: string | undefined;
	oppgaveNøkkel: OppgaveNøkkelDto;
	hastesak: boolean;
	journalpostId: string | undefined;
	opprettetTidspunkt: string | undefined;
	status: string;
	oppgavebehandlingsUrl: string | undefined;
	reservasjonsnøkkel: string;
	fagsakÅr: number | undefined;
};

export type Søkeresultat =
	| { type: 'IKKE_TILGANG' }
	| { type: 'TOMT_RESULTAT' }
	| { type: 'MED_RESULTAT'; person: SøkeboksPersonDto; oppgaver: SøkeboksOppgaveDto[] };
