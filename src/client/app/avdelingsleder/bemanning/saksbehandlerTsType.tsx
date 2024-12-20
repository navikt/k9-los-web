// TODO (TOR) default export feilar for yarn:coverage
// eslint-disable-next-line import/prefer-default-export
export type Saksbehandler = Readonly<{
	id: number;
	brukerIdent?: string;
	navn?: string;
	epost: string;
	enhet?: string;
	oppgavekoer: string[];
}>;

export type SaksbehandlerEnkel = {
	brukerIdent: string;
	navn: string;
};
