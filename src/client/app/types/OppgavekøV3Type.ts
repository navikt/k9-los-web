import { OppgaveQuery } from 'filter/filterTsTypes';

export interface OppgaveKoIdOgTittel {
	id: string;
	tittel: string;
}
export interface OppgavekøV3Enkel {
	id: string;
	tittel: string;
	sistEndret: string | null;
	antallSaksbehandlere: number;
}
export interface OppgavekøV3 {
	id: string;
	versjon: number;
	tittel: string;
	beskrivelse: string;
	oppgaveQuery: OppgaveQuery;
	frittValgAvOppgave: boolean;
	saksbehandlerIds: number[];
	saksbehandlere: string[];
	endretTidspunkt: string | undefined;
	skjermet: boolean;
}
export interface OppgavekøerV3 {
	koer: OppgavekøV3Enkel[];
}

export interface OppgavekøV3MedNavn extends OppgavekøV3 {
	navn: string;
}
