import React from 'react';
import { BodyShort, Button, Modal } from '@navikt/ds-react';
import { K9LosApiKeys } from 'api/k9LosApi';
import {
	useEndreReservasjoner,
	useInnloggetSaksbehandler,
	useOpphevReservasjoner,
	useReserverOppgaveMutation,
	useSisteOppgaverMutation,
} from 'api/queries/saksbehandlerQueries';
import { useRestApiRunner } from 'api/rest-api-hooks';
import { modalInnhold } from 'saksbehandler/sokeboks-ny/modal-innhold';
import { SøkeboksOppgaveDto } from 'saksbehandler/sokeboks-ny/søkeboks-oppgave-dto';

const åpneOppgave = (oppgave: SøkeboksOppgaveDto) => {
	window.location.href = oppgave.oppgavebehandlingsUrl;
};

export function OppgaveModal(props: { oppgave: SøkeboksOppgaveDto; open: boolean; closeModal: () => void }) {
	const { data: innloggetSaksbehandler } = useInnloggetSaksbehandler();
	const { startRequest: leggTilBehandletOppgave } = useRestApiRunner(K9LosApiKeys.LEGG_TIL_BEHANDLET_OPPGAVE);
	const { mutateAsync: leggTilSisteOppgaver } = useSisteOppgaverMutation();
	const leggTilBehandletOgÅpneOppgave = () =>
		Promise.all([
			leggTilBehandletOppgave(props.oppgave.oppgaveNøkkel),
			leggTilSisteOppgaver(props.oppgave.oppgaveNøkkel),
		]).finally(() => åpneOppgave(props.oppgave));
	const { isPending: isLoadingEndreReservasjoner, mutate: endreReservasjoner } = useEndreReservasjoner(() =>
		leggTilBehandletOgÅpneOppgave(),
	);
	const { mutate: reserverOppgave, isPending: isLoadingReserverOppgave } = useReserverOppgaveMutation(() =>
		leggTilBehandletOgÅpneOppgave(),
	);
	const { mutate: opphevReservasjoner, isPending: isLoadingOpphevReservasjon } = useOpphevReservasjoner(
		props.closeModal,
	);

	const { visÅpneOgReserverKnapp, visÅpneOgEndreReservasjonKnapp, visLeggTilbakeIKøKnapp, heading, modaltekst } =
		modalInnhold(props.oppgave, innloggetSaksbehandler);

	return (
		<Modal open={props.open} onClose={props.closeModal} closeOnBackdropClick header={{ heading }}>
			<Modal.Body>
				<BodyShort>{modaltekst}</BodyShort>
				<BodyShort>Hva ønsker du å gjøre med oppgaven?</BodyShort>
			</Modal.Body>
			<Modal.Footer>
				<Button type="button" onClick={leggTilBehandletOgÅpneOppgave}>
					Åpne oppgave
				</Button>
				{visÅpneOgReserverKnapp && (
					<Button
						type="button"
						variant="secondary"
						loading={isLoadingReserverOppgave}
						onClick={() => reserverOppgave(props.oppgave.oppgaveNøkkel)}
					>
						Reserver og åpne oppgave
					</Button>
				)}
				{visÅpneOgEndreReservasjonKnapp && (
					<Button
						type="button"
						variant="secondary"
						loading={isLoadingEndreReservasjoner}
						onClick={() =>
							endreReservasjoner([
								{ oppgaveNøkkel: props.oppgave.oppgaveNøkkel, brukerIdent: innloggetSaksbehandler.brukerIdent },
							])
						}
					>
						Reserver og åpne oppgave
					</Button>
				)}
				{visLeggTilbakeIKøKnapp && (
					<Button
						type="button"
						variant="secondary"
						loading={isLoadingOpphevReservasjon}
						onClick={() => opphevReservasjoner([{ oppgaveNøkkel: props.oppgave.oppgaveNøkkel }])}
					>
						Legg tilbake i kø
					</Button>
				)}
				<Button type="button" variant="tertiary" onClick={props.closeModal}>
					Avbryt
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
