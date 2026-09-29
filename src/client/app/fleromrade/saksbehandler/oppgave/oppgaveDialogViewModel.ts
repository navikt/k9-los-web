import type { OppgaveSammendragDto } from 'api/generated/los.schemas';
import { useInnloggetBruker } from 'fleromrade/api/innloggetBrukerQueries';
import {
	useAktivReservasjon,
	useEndreReservasjoner,
	useOpphevReservasjoner,
	useReserverOppgave,
	useÅpneOppgave,
} from 'fleromrade/api/saksbehandlerQueries';
import { useState } from 'react';
import { oppgaveModalInnhold } from './oppgaveModalInnhold';

interface Knapp {
	vis: boolean;
	handling: () => void;
	loading: boolean;
	disabled: boolean;
}

type OppgaveDialogViewModel =
	| { harHentetData: false }
	| {
			harHentetData: true;
			tittel: string;
			tekst: string;
			feilmelding: string | undefined;
			knapper: Record<'åpneOppgave' | 'reserverOgÅpne' | 'overtaOgÅpne' | 'leggTilbakeIKø', Knapp>;
	  };

export const useOppgaveDialogViewModel = (oppgave: OppgaveSammendragDto, lukk: () => void): OppgaveDialogViewModel => {
	const [feilmelding, setFeilmelding] = useState<string>();

	const { åpne, isPending: åpner } = useÅpneOppgave();
	const { reserver, isPending: reserverer } = useReserverOppgave();
	const { endre, isPending: endrer } = useEndreReservasjoner();
	const { opphev, isPending: opphever } = useOpphevReservasjoner();
	const venter = åpner || reserverer || endrer || opphever;

	const { data: bruker, isSuccess: harHentetBruker } = useInnloggetBruker();
	const { data: reservasjon, isPending: henterReservasjon } = useAktivReservasjon(oppgave.oppgaveNøkkel, !venter);

	if (!harHentetBruker || henterReservasjon) {
		return { harHentetData: false };
	}

	const { tittel, tekst, visReserver, visOvertaReservasjon, visLeggTilbake } = oppgaveModalInnhold(
		oppgave,
		bruker,
		reservasjon,
	);

	const åpneOppgave = () => {
		if (!oppgave.oppgavebehandlingsUrl) {
			setFeilmelding('Fant ikke lenke til oppgaven i fagsystemet.');
			return;
		}
		åpne(oppgave.oppgaveNøkkel, oppgave.oppgavebehandlingsUrl);
	};

	return {
		harHentetData: true,
		tittel,
		tekst,
		feilmelding,
		knapper: {
			åpneOppgave: {
				vis: true,
				handling: åpneOppgave,
				loading: åpner,
				disabled: venter,
			},
			reserverOgÅpne: {
				vis: visReserver,
				handling: () =>
					reserver(oppgave.oppgaveNøkkel, {
						onSuccess: (status) => {
							if (status.erReservertAvInnloggetBruker) {
								åpneOppgave();
							} else {
								setFeilmelding(`Oppgaven ble reservert av ${status.reservertAvNavn ?? 'en annen saksbehandler'}.`);
							}
						},
						onError: () =>
							setFeilmelding(
								'Reservering av oppgave feilet. Dette kan skyldes at oppgaven ble reservert av noen andre.',
							),
					}),
				loading: reserverer,
				disabled: venter,
			},
			overtaOgÅpne: {
				vis: visOvertaReservasjon,
				handling: () =>
					endre([{ reservasjonsnøkkel: oppgave.reservasjonsnøkkel, brukerIdent: bruker.brukerIdent }], {
						onSuccess: åpneOppgave,
						onError: () =>
							setFeilmelding('Endring av reservasjon feilet. Dette kan skyldes at oppgaven ikke lenger er reservert.'),
					}),
				loading: endrer,
				disabled: venter,
			},
			leggTilbakeIKø: {
				vis: visLeggTilbake,
				handling: () =>
					opphev([oppgave.reservasjonsnøkkel], {
						onSuccess: lukk,
						onError: () =>
							setFeilmelding('Legg tilbake i kø feilet. Dette kan skyldes at oppgaven ikke lenger er reservert.'),
					}),
				loading: opphever,
				disabled: venter,
			},
		},
	};
};
