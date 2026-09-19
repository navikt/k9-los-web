import { Button, Modal } from '@navikt/ds-react';
import { useOpphevReservasjoner } from 'fleromrade/api/saksbehandlerQueries';
import type { FunctionComponent } from 'react';

type OwnProps = Readonly<{
	open: boolean;
	reservasjonsnøkler: Array<string>;
	closeModal: () => void;
}>;

export const OpphevReservasjonerModal: FunctionComponent<OwnProps> = ({ open, closeModal, reservasjonsnøkler }) => {
	const { opphev } = useOpphevReservasjoner();

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
				<Button onClick={() => opphev(reservasjonsnøkler, { onSuccess: closeModal })}>OK</Button>
				<Button variant="secondary" type="button" onClick={closeModal}>
					Avbryt
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default OpphevReservasjonerModal;
