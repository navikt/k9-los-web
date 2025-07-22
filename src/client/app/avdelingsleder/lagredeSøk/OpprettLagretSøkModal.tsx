import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Heading, Modal } from '@navikt/ds-react';
import { useOpprettLagretSøk } from 'api/queries/avdelingslederQueries';
import { RenderModalProps } from 'sharedComponents/ModalButton';

export function OpprettLagretSøkModal({ open, closeModal }: RenderModalProps) {
	const { mutate: opprettLagretSøk } = useOpprettLagretSøk();
	return (
		<Modal open={open} onClose={closeModal} aria-label="Opprett lagret søk" closeOnBackdropClick>
			<form></form>
			<Modal.Body>
				<Heading size="medium">Nytt lagret søk</Heading>
			</Modal.Body>
			<Modal.Footer>
				<Button></Button>
			</Modal.Footer>
		</Modal>
	);
}
