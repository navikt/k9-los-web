import React, { FunctionComponent } from 'react';
import { OppgaveNøkkel } from 'types/OppgaveNøkkel';
import { useOpphevReservasjoner } from 'api/queries/saksbehandlerQueries';
import { Button, Modal } from '@navikt/ds-react';

type OwnProps = Readonly<{
	open: boolean;
	oppgaveNøkler: Array<OppgaveNøkkel>;
	closeModal: () => void;
}>;

export const OpphevReservasjonerModal: FunctionComponent<OwnProps> = ({ open, closeModal, oppgaveNøkler }) => {
	const { mutate: opphevReservasjoner } = useOpphevReservasjoner();

	const antall = oppgaveNøkler.length;

	return (
		<Modal
			open={open}
			header={{
				heading: 'Oppheve reservasjon?',
			}}
			onClose={closeModal}
		>
			<Modal.Body>
				{antall > 1
					? `Er du sikker på at du vil oppheve ${antall} reservasjoner?`
					: 'Er du sikker på at du vil oppheve reservasjonen?'
				}
			</Modal.Body>
			<Modal.Footer>
				<Button
					onClick={() =>
						opphevReservasjoner(
							oppgaveNøkler.map((o) => ({
								oppgaveNøkkel: o,
							})),
							{ onSuccess: closeModal },
						)
					}
				>
					OK
				</Button>
				<Button variant="secondary" type="button" onClick={closeModal}>
					Avbryt
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default OpphevReservasjonerModal;
