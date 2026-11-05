import type { OppgaveSammendragDto } from 'api/generated/los.schemas';
import { useReserverOppgave, useÅpneOppgave } from 'fleromrade/api/saksbehandlerQueries';

export const useOppgaveHandlinger = (oppgave: OppgaveSammendragDto, visFeil: (melding: string | undefined) => void) => {
	const { åpne, isPending: åpner } = useÅpneOppgave();
	const { reserver, isPending: reserverer } = useReserverOppgave();

	const åpneOppgave = () => {
		visFeil(undefined);
		if (!oppgave.oppgavebehandlingsUrl) {
			visFeil('Fant ikke lenke til oppgaven i fagsystemet.');
			return;
		}
		åpne(oppgave.oppgaveNøkkel, oppgave.oppgavebehandlingsUrl);
	};

	const reserverOgÅpne = () => {
		visFeil(undefined);
		reserver(oppgave.oppgaveNøkkel, {
			onSuccess: (status) => {
				if (!status.erReservertAvInnloggetBruker) {
					visFeil(`Oppgaven ble reservert av ${status.reservertAvNavn ?? 'en annen saksbehandler'}.`);
				} else if (!oppgave.oppgavebehandlingsUrl) {
					visFeil(
						'Oppgaven er reservert på deg, men mangler lenke til fagsystemet. Du finner den under reserverte oppgaver.',
					);
				} else {
					åpneOppgave();
				}
			},
			onError: () =>
				visFeil('Reservering av oppgave feilet. Dette kan skyldes at oppgaven ble reservert av noen andre.'),
		});
	};

	return { åpneOppgave, reserverOgÅpne, åpner, reserverer };
};
