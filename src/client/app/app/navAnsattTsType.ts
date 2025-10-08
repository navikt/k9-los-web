type NavAnsatt = Readonly<{
	navn: string;
	brukernavn: string;
	brukerIdent: string;
	kanSaksbehandle: boolean;
	kanOppgavestyre: boolean;
	kanReservere: boolean;
	kanDrifte: boolean;
	finnesISaksbehandlerTabell: boolean;
}>;

export default NavAnsatt;
