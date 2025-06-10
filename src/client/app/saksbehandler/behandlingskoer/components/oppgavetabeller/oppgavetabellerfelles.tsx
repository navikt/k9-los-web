import { punsjKodeverkNavn } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import Oppgave from 'saksbehandler/oppgaveTsType';
import { getKodeverkFraKode } from 'utils/kodeverkUtils';

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

export const hentIDFraSak = (oppgave: Oppgave, alleKodeverk): string => {
	if (
		typeof oppgave.behandlingstype !== 'undefined' &&
		getKodeverkFraKode(oppgave.behandlingstype, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk) === punsjKodeverkNavn &&
		oppgave.journalpostId
	) {
		return oppgave.journalpostId;
	}

	if (oppgave.saksnummer) {
		return oppgave.saksnummer;
	}
	return '';
};
