import React from 'react';
import { Alert, BodyShort, Button, Modal } from '@navikt/ds-react';
import { useOppgaveModalViewModel } from 'saksbehandler/sokeboks/oppgave-modal-viewmodel';
import { SøkeboksOppgaveDto } from 'saksbehandler/sokeboks/søkeboks-oppgave-dto';

export function OppgaveModal(props: { oppgave: SøkeboksOppgaveDto; open: boolean; closeModal: () => void }) {
	const { harHentetData, heading, modaltekst, feilmelding, knapper } = useOppgaveModalViewModel(
		props.oppgave,
		props.closeModal,
	);

	if (!harHentetData) {
		return null;
	}

	return (
		<Modal open={props.open} onClose={() => props.closeModal()} closeOnBackdropClick header={{ heading }}>
			<Modal.Body>
				<BodyShort>{modaltekst}</BodyShort>
				<BodyShort>Hva ønsker du å gjøre med oppgaven?</BodyShort>
			</Modal.Body>
			<Modal.Footer>
				<Button
					type="button"
					loading={knapper.åpneOppgave.loading}
					disabled={knapper.åpneOppgave.disabled}
					onClick={knapper.åpneOppgave.handling}
				>
					Åpne oppgave
				</Button>
				{knapper.reserverOppgave.vis && (
					<Button
						type="button"
						variant="secondary"
						loading={knapper.reserverOppgave.loading}
						disabled={knapper.reserverOppgave.disabled}
						onClick={knapper.reserverOppgave.handling}
					>
						Reserver og åpne oppgave
					</Button>
				)}
				{knapper.åpneOgEndreReservasjon.vis && (
					<Button
						type="button"
						variant="secondary"
						loading={knapper.åpneOgEndreReservasjon.loading}
						disabled={knapper.åpneOgEndreReservasjon.disabled}
						onClick={knapper.åpneOgEndreReservasjon.handling}
					>
						Overta reservasjon og åpne oppgave
					</Button>
				)}
				{knapper.leggTilbakeIKø.vis && (
					<Button
						type="button"
						variant="secondary"
						loading={knapper.leggTilbakeIKø.loading}
						disabled={knapper.leggTilbakeIKø.disabled}
						onClick={knapper.leggTilbakeIKø.handling}
					>
						Legg tilbake i kø
					</Button>
				)}
				<Button type="button" variant="tertiary" onClick={props.closeModal}>
					Avbryt
				</Button>
				{feilmelding && <Alert variant="error">{feilmelding}</Alert>}
			</Modal.Footer>
		</Modal>
	);
}
