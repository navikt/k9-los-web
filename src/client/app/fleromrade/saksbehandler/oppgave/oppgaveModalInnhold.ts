import type { InnloggetBrukerDtoNy, OppgaveSammendragDto, ReservasjonsinfoDto } from 'api/generated/los.schemas';
import { dateTimeFormat } from 'utils/dateUtils';

export interface OppgaveModalInnhold {
	tittel: string;
	tekst: string;
	visReserver: boolean;
	visOvertaReservasjon: boolean;
	visLeggTilbake: boolean;
}

const reservertAv = (reservasjon: ReservasjonsinfoDto) =>
	`Oppgaven er reservert av ${reservasjon.reservertAvNavn ?? reservasjon.reservertAvEpost} t.o.m. ${dateTimeFormat(reservasjon.reservertTil)}.`;

export const oppgaveModalInnhold = (
	oppgave: OppgaveSammendragDto,
	bruker: InnloggetBrukerDtoNy,
	reservasjon: ReservasjonsinfoDto | null,
): OppgaveModalInnhold => {
	const kanReservere = bruker.tilganger.reservering;
	const reservertAvMeg = !!reservasjon && reservasjon.reservertAvIdent === bruker.brukerIdent;
	const reservertAvAnnen = !!reservasjon && !reservertAvMeg;

	if (oppgave.oppgavestatus.kode === 'VENTER') {
		let tekst = 'Oppgaven er ikke reservert.';
		if (reservertAvMeg) {
			tekst = 'Oppgaven er reservert av deg.';
		} else if (reservertAvAnnen) {
			tekst = reservertAv(reservasjon);
		}
		return {
			tittel: 'Oppgaven er satt på vent',
			tekst,
			visReserver: kanReservere && !reservasjon,
			visOvertaReservasjon: kanReservere && reservertAvAnnen,
			visLeggTilbake: reservertAvMeg,
		};
	}

	if (reservertAvMeg) {
		return {
			tittel: 'Oppgaven er reservert av deg',
			tekst: '',
			visReserver: false,
			visOvertaReservasjon: false,
			visLeggTilbake: true,
		};
	}

	if (!reservasjon) {
		return {
			tittel: 'Oppgaven er ikke reservert',
			tekst: '',
			visReserver: kanReservere,
			visOvertaReservasjon: false,
			visLeggTilbake: false,
		};
	}

	return {
		tittel: 'Oppgaven er reservert av en annen saksbehandler',
		tekst: reservertAv(reservasjon),
		visReserver: false,
		visOvertaReservasjon: kanReservere,
		visLeggTilbake: false,
	};
};
