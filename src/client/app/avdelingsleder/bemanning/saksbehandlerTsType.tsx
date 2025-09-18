// TODO (TOR) default export feilar for yarn:coverage

export type Saksbehandler = Readonly<{
	id: number;
	brukerIdent?: string;
	navn?: string;
	epost: string;
	enhet?: string;
}>;

export type SaksbehandlerEnkel = {
	brukerIdent: string;
	navn: string;
};
