export const getHeaderCodes = (medReservasjoner?: boolean, erHastesaker?: boolean) => [
	erHastesaker ? 'EMPTY_1' : undefined,
	'Søker',
	'Id',
	'Behandlingstype',
	'Oppgave opprettet',
	medReservasjoner ? 'Reservasjon' : 'EMPTY_3',
	'EMPTY_2',
	'EMPTY_4',
];
