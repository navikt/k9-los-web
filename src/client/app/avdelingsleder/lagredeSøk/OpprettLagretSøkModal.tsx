import React from 'react';
import { Alert, Button, Heading, Modal } from '@navikt/ds-react';
import { useOpprettLagretSøk } from 'api/queries/avdelingslederQueries';
import { RenderModalProps } from 'sharedComponents/ModalButton';

export function OpprettLagretSøkModal({ open, closeModal }: RenderModalProps) {
	const { isError: backendError, isPending, mutate: opprettLagretSøk } = useOpprettLagretSøk();

	const onSubmit = () => {
		opprettLagretSøk(
			{
				tittel: '',
			},
			{
				onSuccess: () => {
					closeModal();
				},
			},
		);
	};

	return (
		<Modal open={open} onClose={closeModal} aria-label="Opprett lagret søk" className="w-[44rem]">
			<Modal.Body>
				<Heading size="medium" className="mb-4">
					Nytt lagret søk
				</Heading>
				<p>Opprett et nytt lagret søk basert på filterkriteriene.</p>
				{backendError && (
					<Alert variant="error" className="mt-4">
						Kunne ikke opprette søk.
					</Alert>
				)}
			</Modal.Body>
			<Modal.Footer>
				<Button type="button" onClick={onSubmit} loading={isPending}>
					Opprett søk
				</Button>
				<Button variant="secondary" type="button" onClick={closeModal}>
					Avbryt
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
