import NavAnsatt from 'app/navAnsattTsType';
import { SøkeboksOppgaveDto } from 'saksbehandler/sokeboks/søkeboks-oppgave-dto';
import { dateFormat, timeFormat } from 'utils/dateUtils';

export type ModalInnholdRetur = {
	visÅpneOgReserverKnapp: boolean;
	visÅpneOgEndreReservasjonKnapp: boolean;
	visLeggTilbakeIKøKnapp: boolean;
	modaltekst: string;
	heading: string;
};

export function modalInnhold(oppgave: SøkeboksOppgaveDto, innloggetSaksbehandler: NavAnsatt): ModalInnholdRetur {
	if (oppgave.oppgavestatus.kode === 'VENTER') {
		let modaltekst: string;
		if (innloggetSaksbehandler.brukerIdent === oppgave.reservertAvSaksbehandlerIdent) {
			modaltekst = 'Oppgaven er reservert av deg.';
		} else if (!oppgave.reservertAvSaksbehandlerIdent) {
			modaltekst = 'Oppgaven er ikke reservert.';
		} else {
			const reservertTomFormatert = `${dateFormat(oppgave.reservertTom)} kl. ${timeFormat(oppgave.reservertTom)}`;
			modaltekst = `Oppgaven er reservert av ${oppgave.reservertAvSaksbehandlerNavn} t.o.m. ${reservertTomFormatert}.`;
		}
		return {
			heading: 'Oppgaven er satt på vent',
			modaltekst,
			visÅpneOgReserverKnapp: false,
			visÅpneOgEndreReservasjonKnapp:
				innloggetSaksbehandler.kanReservere &&
				oppgave.reservertAvSaksbehandlerIdent !== innloggetSaksbehandler.brukerIdent,
			visLeggTilbakeIKøKnapp: oppgave.reservertAvSaksbehandlerIdent === innloggetSaksbehandler.brukerIdent,
		};
	}
	if (innloggetSaksbehandler.brukerIdent === oppgave.reservertAvSaksbehandlerIdent) {
		return {
			heading: 'Oppgaven er reservert av deg',
			modaltekst: '',
			visÅpneOgReserverKnapp: false,
			visÅpneOgEndreReservasjonKnapp: false,
			visLeggTilbakeIKøKnapp: true,
		};
	}
	if (!oppgave.reservertAvSaksbehandlerIdent) {
		return {
			heading: 'Oppgaven er ikke reservert',
			modaltekst: '',
			visÅpneOgReserverKnapp: innloggetSaksbehandler.kanReservere,
			visÅpneOgEndreReservasjonKnapp: false,
			visLeggTilbakeIKøKnapp: false,
		};
	}

	const reservertTomFormatert = `${dateFormat(oppgave.reservertTom)} kl. ${timeFormat(oppgave.reservertTom)}`;
	return {
		heading: 'En annen saksbehandler arbeider nå med denne oppgaven',
		modaltekst: `Oppgaven er reservert av ${oppgave.reservertAvSaksbehandlerNavn} t.o.m. ${reservertTomFormatert}.`,
		visÅpneOgReserverKnapp: false,
		visÅpneOgEndreReservasjonKnapp: innloggetSaksbehandler.kanReservere,
		visLeggTilbakeIKøKnapp: false,
	};
}
