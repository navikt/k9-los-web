import type { OppgaveSammendragDto } from 'api/generated/los.schemas';
import { useInnloggetBruker } from 'fleromrade/api/innloggetBrukerQueries';
import {
	useAktivReservasjon,
	useEndreReservasjoner,
	useOpphevReservasjoner,
	useReserverOppgave,
	useReserverOppgaveForSaksbehandler,
	useÅpneOppgave,
} from 'fleromrade/api/saksbehandlerQueries';
import { oppgaveModalInnhold } from './oppgaveModalInnhold';

interface Knapp {
	vis: boolean;
	handling: () => void;
	loading: boolean;
	disabled: boolean;
}

export type OppgaveMenyViewModel =
	| { harHentetData: false; feilmelding?: string }
	| {
			harHentetData: true;
			tittel: string;
			tekst: string;
			reserverForAnnen: (navident: string) => void;
			knapper: Record<'åpneOppgave' | 'reserverOgÅpne' | 'overtaOgÅpne' | 'leggTilbakeIKø', Knapp>;
	  };

export const useOppgaveMenyViewModel = (
	oppgave: OppgaveSammendragDto | undefined,
	lukk: () => void,
	visFeil: (melding: string | undefined) => void,
	lukkVedFeil = true,
): OppgaveMenyViewModel => {
	const setFeilmelding = (melding: string) => {
		visFeil(melding);
		if (lukkVedFeil) {
			lukk();
		}
	};

	const { åpne, isPending: åpner } = useÅpneOppgave();
	const { reserver, isPending: reserverer } = useReserverOppgave();
	const { reserver: reserverForAnnen, isPending: reservererForAnnen } = useReserverOppgaveForSaksbehandler();
	const { endre, isPending: endrer } = useEndreReservasjoner();
	const { opphev, isPending: opphever } = useOpphevReservasjoner();
	const venter = åpner || reserverer || reservererForAnnen || endrer || opphever;

	const { data: bruker, isSuccess: harHentetBruker, isError: brukerfeil } = useInnloggetBruker();
	const {
		data: reservasjon,
		isPending: henterReservasjon,
		isError: reservasjonsfeil,
	} = useAktivReservasjon(oppgave?.oppgaveNøkkel, !venter);

	if (brukerfeil || reservasjonsfeil) {
		return {
			harHentetData: false,
			feilmelding: 'Kunne ikke hente oppgavens reservasjon eller tilganger. Lukk menyen og prøv igjen.',
		};
	}

	if (!oppgave || !harHentetBruker || henterReservasjon) {
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
		reserverForAnnen: (navident) => {
			visFeil(undefined);
			reserverForAnnen(oppgave.oppgaveNøkkel, navident, {
				onSuccess: lukk,
				onError: () => setFeilmelding('Kunne ikke reservere oppgaven for saksbehandleren. Prøv igjen.'),
			});
		},
		knapper: {
			åpneOppgave: {
				vis: true,
				handling: åpneOppgave,
				loading: åpner,
				disabled: venter,
			},
			reserverOgÅpne: {
				vis: visReserver,
				handling: () => {
					visFeil(undefined);
					reserver(oppgave.oppgaveNøkkel, {
						onSuccess: (status) => {
							if (status.erReservertAvInnloggetBruker) {
								if (oppgave.oppgavebehandlingsUrl) {
									åpneOppgave();
								} else {
									setFeilmelding(
										'Oppgaven er reservert på deg, men mangler lenke til fagsystemet. Du finner den under reserverte oppgaver.',
									);
								}
							} else {
								setFeilmelding(`Oppgaven ble reservert av ${status.reservertAvNavn ?? 'en annen saksbehandler'}.`);
							}
						},
						onError: () =>
							setFeilmelding(
								'Reservering av oppgave feilet. Dette kan skyldes at oppgaven ble reservert av noen andre.',
							),
					});
				},
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
