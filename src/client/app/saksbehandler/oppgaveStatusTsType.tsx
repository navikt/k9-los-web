// TODO (TOR) default export feilar for yarn:coverage
// eslint-disable-next-line import/prefer-default-export
export type OppgaveStatus = Readonly<{
	erReservert: boolean;
	reservertTilTidspunkt?: string;
	erReservertAvInnloggetBruker?: boolean;
	reservertAv?: string;
	reservertAvNavn?: string;
	kanOverstyres?: boolean;
}>;
