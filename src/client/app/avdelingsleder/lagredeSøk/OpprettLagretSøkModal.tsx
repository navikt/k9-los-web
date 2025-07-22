import React from 'react';
import { Modal } from '@navikt/ds-react';
import { RenderModalProps } from 'sharedComponents/ModalButton';

export function OpprettLagretSøkModal({ open, closeModal }: RenderModalProps) {
	return (
		<Modal open={open} onClose={closeModal} aria-label="Opprett lagret søk" closeOnBackdropClick>
			<span>Opprett nytt lagret søk</span>
		</Modal>
	);
}
