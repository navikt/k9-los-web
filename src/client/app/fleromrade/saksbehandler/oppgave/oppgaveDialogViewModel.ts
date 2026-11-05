import type { OppgaveSammendragDto } from 'api/generated/los.schemas';
import { useInnloggetBruker } from 'fleromrade/api/innloggetBrukerQueries';
import {
	useAktivReservasjon,
	useEndreReservasjoner,
	useOpphevReservasjoner,
} from 'fleromrade/api/saksbehandlerQueries';
import { oppgaveModalInnhold } from './oppgaveModalInnhold';
import { useOppgaveHandlinger } from './useOppgaveHandlinger';

interface Knapp {
	vis: boolean;
	handling: () => void;
	loading: boolean;
	disabled: boolean;
}

type OppgaveDialogViewModel =
	| { harHentetData: false; feilmelding?: string }
	| {
			harHentetData: true;
			tittel: string;
			tekst: string;
			knapper: Record<'åpneOppgave' | 'reserverOgÅpne' | 'overtaOgÅpne' | 'leggTilbakeIKø', Knapp>;
	  };

export const useOppgaveDialogViewModel = (
	oppgave: OppgaveSammendragDto,
	lukk: () => void,
	visFeil: (melding: string | undefined) => void,
): OppgaveDialogViewModel => {
	const { åpneOppgave, reserverOgÅpne, åpner, reserverer } = useOppgaveHandlinger(oppgave, visFeil);
	const { endre, isPending: endrer } = useEndreReservasjoner();
	const { opphev, isPending: opphever } = useOpphevReservasjoner();
	const venter = åpner || reserverer || endrer || opphever;

	const { data: bruker, isSuccess: harHentetBruker, isError: brukerfeil } = useInnloggetBruker();
	const {
		data: reservasjon,
		isPending: henterReservasjon,
		isError: reservasjonsfeil,
	} = useAktivReservasjon(oppgave.oppgaveNøkkel, !venter);

	if (brukerfeil || reservasjonsfeil) {
		return {
			harHentetData: false,
			feilmelding: 'Kunne ikke hente oppgavens reservasjon eller tilganger. Lukk dialogen og prøv igjen.',
		};
	}

	if (!harHentetBruker || henterReservasjon) {
		return { harHentetData: false };
	}

	const { tittel, tekst, visReserver, visOvertaReservasjon, visLeggTilbake } = oppgaveModalInnhold(
		oppgave,
		bruker,
		reservasjon,
	);

	return {
		harHentetData: true,
		tittel,
		tekst,
		knapper: {
			åpneOppgave: {
				vis: true,
				handling: åpneOppgave,
				loading: åpner,
				disabled: venter,
			},
			reserverOgÅpne: {
				vis: visReserver,
				handling: reserverOgÅpne,
				loading: reserverer,
				disabled: venter,
			},
			overtaOgÅpne: {
				vis: visOvertaReservasjon,
				handling: () =>
					endre([{ reservasjonsnøkkel: oppgave.reservasjonsnøkkel, brukerIdent: bruker.brukerIdent }], {
						onSuccess: åpneOppgave,
						onError: () =>
							visFeil('Endring av reservasjon feilet. Dette kan skyldes at oppgaven ikke lenger er reservert.'),
					}),
				loading: endrer,
				disabled: venter,
			},
			leggTilbakeIKø: {
				vis: visLeggTilbake,
				handling: () =>
					opphev([oppgave.reservasjonsnøkkel], {
						onSuccess: lukk,
						onError: () => visFeil('Legg tilbake i kø feilet. Dette kan skyldes at oppgaven ikke lenger er reservert.'),
					}),
				loading: opphever,
				disabled: venter,
			},
		},
	};
};
