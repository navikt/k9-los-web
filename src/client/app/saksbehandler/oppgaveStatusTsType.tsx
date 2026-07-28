// TODO (TOR) default export feilar for yarn:coverage

export type OppgaveStatus = Readonly<{
	erReservert: boolean;
	reservertTilTidspunkt?: string;
	erReservertAvInnloggetBruker?: boolean;
	reservertAv?: string;
	reservertAvNavn?: string;
	kanOverstyres?: boolean;
}>;
