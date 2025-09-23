import NavAnsatt from 'app/navAnsattTsType';
import ReservasjonV3 from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';
import { SøkeboksOppgaveDto } from 'saksbehandler/sokeboks/søkeboks-oppgave-dto';
import { dateFormat, timeFormat } from 'utils/dateUtils';

export type ModalInnholdRetur = {
	visÅpneOgReserverKnapp: boolean;
	visÅpneOgEndreReservasjonKnapp: boolean;
	visLeggTilbakeIKøKnapp: boolean;
	modaltekst: string;
	heading: string;
};

export function modalInnhold(
	oppgave: SøkeboksOppgaveDto,
	innloggetSaksbehandler: NavAnsatt,
	reservasjon: ReservasjonV3 | null,
): ModalInnholdRetur {
	if (oppgave.status === 'Venter') {
		let modaltekst: string;
		if (innloggetSaksbehandler.brukerIdent === reservasjon?.reservertAvIdent) {
			modaltekst = 'Oppgaven er reservert av deg.';
		} else if (!reservasjon) {
			modaltekst = 'Oppgaven er ikke reservert.';
		} else {
			const reservertTomFormatert = `${dateFormat(reservasjon.reservertTil)} kl. ${timeFormat(reservasjon.reservertTil)}`;
			modaltekst = `Oppgaven er reservert av ${reservasjon.reservertAvNavn ?? reservasjon.reservertAvEpost} t.o.m. ${reservertTomFormatert}.`;
		}
		return {
			heading: 'Oppgaven er satt på vent',
			modaltekst,
			visÅpneOgReserverKnapp: false,
			visÅpneOgEndreReservasjonKnapp:
				innloggetSaksbehandler.kanReservere && reservasjon?.reservertAvIdent !== innloggetSaksbehandler.brukerIdent,
			visLeggTilbakeIKøKnapp: reservasjon?.reservertAvIdent === innloggetSaksbehandler.brukerIdent,
		};
	}
	if (innloggetSaksbehandler.brukerIdent === reservasjon?.reservertAvIdent) {
		return {
			heading: 'Oppgaven er reservert av deg',
			modaltekst: '',
			visÅpneOgReserverKnapp: false,
			visÅpneOgEndreReservasjonKnapp: false,
			visLeggTilbakeIKøKnapp: true,
		};
	}
	if (!reservasjon) {
		return {
			heading: 'Oppgaven er ikke reservert',
			modaltekst: '',
			visÅpneOgReserverKnapp: innloggetSaksbehandler.kanReservere,
			visÅpneOgEndreReservasjonKnapp: false,
			visLeggTilbakeIKøKnapp: false,
		};
	}

	const reservertTomFormatert = `${dateFormat(reservasjon.reservertTil)} kl. ${timeFormat(reservasjon.reservertTil)}`;
	return {
		heading: 'En annen saksbehandler arbeider nå med denne oppgaven',
		modaltekst: `Oppgaven er reservert av ${reservasjon.reservertAvNavn} t.o.m. ${reservertTomFormatert}.`,
		visÅpneOgReserverKnapp: false,
		visÅpneOgEndreReservasjonKnapp: innloggetSaksbehandler.kanReservere,
		visLeggTilbakeIKøKnapp: false,
	};
}
