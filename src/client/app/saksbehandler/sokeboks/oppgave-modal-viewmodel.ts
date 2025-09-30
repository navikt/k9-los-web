import { useState } from 'react';
import {
	useEndreReservasjoner,
	useHentAktivReservasjonForOppgave,
	useInnloggetSaksbehandler,
	useOpphevReservasjoner,
	useReserverOppgaveMutation,
	useSisteOppgaverMutation,
} from 'api/queries/saksbehandlerQueries';
import { modalInnhold } from 'saksbehandler/sokeboks/modal-innhold';
import { SøkeboksOppgaveDto } from 'saksbehandler/sokeboks/søkeboks-oppgave-dto';

const endreWindowLocationTilFagsystem = (oppgave: SøkeboksOppgaveDto) => {
	window.location.assign(oppgave.oppgavebehandlingsUrl);
};

const harIkkeHentetData = {
	harHentetData: false,
	heading: undefined,
	modaltekst: undefined,
	feilmelding: undefined,
	knapper: undefined,
};

type UseOppgaveModalRetur =
	| typeof harIkkeHentetData
	| {
			harHentetData: true;
			heading: string;
			modaltekst: string;
			feilmelding: string | undefined;
			knapper: Record<string, { vis: boolean; handling: () => void; loading: boolean; disabled: boolean }>;
	  };

export const useOppgaveModalViewModel = (oppgave: SøkeboksOppgaveDto, closeModal: () => void): UseOppgaveModalRetur => {
	const [feilmelding, setFeilmelding] = useState<string>();

	const { mutate: leggTilSisteOppgaverMutate, isPending: isPendingLeggTilSisteOppgaver } = useSisteOppgaverMutation();
	const { mutate: endreReservasjonerMutate, isPending: isPendingEndreReservasjoner } = useEndreReservasjoner();
	const { mutate: reserverOppgaveMutate, isPending: isPendingReserverOppgave } = useReserverOppgaveMutation();
	const { mutate: opphevReservasjonerMutate, isPending: isPendingOpphevReservasjon } = useOpphevReservasjoner();

	const isPending =
		isPendingLeggTilSisteOppgaver ||
		isPendingEndreReservasjoner ||
		isPendingReserverOppgave ||
		isPendingOpphevReservasjon;

	const { data: innloggetSaksbehandler, isSuccess: harHentetInnloggetSaksbehandler } = useInnloggetSaksbehandler();
	const { data: aktivReservasjon, isSuccess: harHentetAktivReservasjon } = useHentAktivReservasjonForOppgave(
		!isPending,
		oppgave.oppgaveNøkkel,
	);

	if (!harHentetInnloggetSaksbehandler || !harHentetAktivReservasjon) {
		return harIkkeHentetData;
	}

	const { visÅpneOgReserverKnapp, visÅpneOgEndreReservasjonKnapp, visLeggTilbakeIKøKnapp, heading, modaltekst } =
		modalInnhold(oppgave, innloggetSaksbehandler, aktivReservasjon);

	const leggTilSisteOppgaverOgÅpneFagsystem = () => {
		// Åpner oppgave i fagsystem uavhengig av om siste-oppgaver-kallet feiler eller ikke, siden dette ikke er kritisk kall, derfor onSettled
		leggTilSisteOppgaverMutate(oppgave.oppgaveNøkkel, {
			onSettled: () => {
				endreWindowLocationTilFagsystem(oppgave);
			},
		});
	};

	return {
		harHentetData: harHentetInnloggetSaksbehandler && harHentetAktivReservasjon,
		heading,
		modaltekst,
		feilmelding,
		knapper: {
			åpneOppgave: {
				vis: visÅpneOgReserverKnapp,
				handling: leggTilSisteOppgaverOgÅpneFagsystem,
				loading: false,
				disabled: isPending,
			},
			åpneOgEndreReservasjon: {
				vis: visÅpneOgEndreReservasjonKnapp,
				handling: () => {
					endreReservasjonerMutate(
						[{ oppgaveNøkkel: oppgave.oppgaveNøkkel, brukerIdent: innloggetSaksbehandler.brukerIdent }],
						{
							onSuccess: leggTilSisteOppgaverOgÅpneFagsystem,
							onError: () => {
								setFeilmelding(
									'Endring av reservasjon feilet. Dette kan skyldes at oppgaven ikke lenger er reservert.',
								);
							},
						},
					);
				},
				loading: isPendingEndreReservasjoner,
				disabled: isPending,
			},
			reserverOppgave: {
				vis: visÅpneOgReserverKnapp,
				handling: () => {
					reserverOppgaveMutate(oppgave.oppgaveNøkkel, {
						onSuccess: () => {
							leggTilSisteOppgaverOgÅpneFagsystem();
						},
						onError: () => {
							setFeilmelding(
								'Reservering av oppgave feilet. Dette kan skyldes at oppgaven ble reservert av noen andre.',
							);
						},
					});
				},
				loading: isPendingReserverOppgave,
				disabled: isPending,
			},
			leggTilbakeIKø: {
				vis: visLeggTilbakeIKøKnapp,
				handling: () => {
					opphevReservasjonerMutate([{ oppgaveNøkkel: oppgave.oppgaveNøkkel }], {
						onSuccess: () => {
							closeModal();
						},
						onError: () => {
							setFeilmelding('Legg tilbake i kø feilet. Dette kan skyldes at oppgaven ikke lenger er reservert.');
						},
					});
				},
				loading: isPendingOpphevReservasjon,
				disabled: isPending,
			},
		},
	};
};
