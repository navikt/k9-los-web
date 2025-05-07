export const getHeaderCodes = (medReservasjoner?: boolean, erHastesaker?: boolean) => [
	erHastesaker ? 'EMPTY_1' : undefined,
	'OppgaverTabell.Soker',
	'OppgaverTabell.Id',
	'OppgaverTabell.Behandlingstype',
	'OppgaverTabell.BehandlingOpprettet',
	medReservasjoner ? 'OppgaverTabell.Reservasjon' : 'EMPTY_3',
	'EMPTY_2',
	'EMPTY_4',
];
