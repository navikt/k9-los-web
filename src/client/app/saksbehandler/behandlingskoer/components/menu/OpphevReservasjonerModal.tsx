import React, { FunctionComponent } from 'react';
import { Button, Modal } from '@navikt/ds-react';
import { useOpphevReservasjoner } from 'api/queries/saksbehandlerQueries';

type OwnProps = Readonly<{
	open: boolean;
	reservasjonsnøkler: Array<string>;
	closeModal: () => void;
}>;

export const OpphevReservasjonerModal: FunctionComponent<OwnProps> = ({ open, closeModal, reservasjonsnøkler }) => {
	const { mutate: opphevReservasjoner } = useOpphevReservasjoner();

	const antall = reservasjonsnøkler.length;

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
					: 'Er du sikker på at du vil oppheve reservasjonen?'}
			</Modal.Body>
			<Modal.Footer>
				<Button
					onClick={() =>
						opphevReservasjoner(
							reservasjonsnøkler.map((reservasjonsnøkkel) => ({
								reservasjonsnøkkel,
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
