type NyeOgFerdigstilteOppgaver = Readonly<{
	behandlingType: string;
	fagsakYtelseType: string;
	antallNye: number;
	antallFerdigstilte: number;
	antallFerdigstilteMine: number;
	dato: string;
}>;

export default NyeOgFerdigstilteOppgaver;

export enum fagytelsetyperForOppgaveFiltrering {
	OMSORGSPENGER = 'Omsorgspenger',
	OMSORGSDAGER = 'Omsorgsdager',
	PLEIEPENGER_SYKT_BARN = 'Pleiepenger',
	PUNSJ = 'Punsj',
	PPN = 'Livets Sluttfase',
	ALLE_YTELSETYPER_VALGT = 'Alle ytelser',
}
