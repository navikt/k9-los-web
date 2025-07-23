import React from 'react';
import { useForm } from 'react-hook-form';
import { Alert, Button, Heading, Modal, TextField } from '@navikt/ds-react';
import { useOpprettLagretSøk } from 'api/queries/avdelingslederQueries';
import { OppgaveQuery } from 'filter/filterTsTypes';
import { RenderModalProps } from 'sharedComponents/ModalButton';

interface FormData {
	tittel: string;
	query: OppgaveQuery;
}

export function OpprettLagretSøkModal({ open, closeModal }: RenderModalProps) {
	const { isError: backendError, mutate: opprettLagretSøk } = useOpprettLagretSøk();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormData>();

	const onSubmit = (data: FormData) => {
		opprettLagretSøk(
			{
				tittel: data.tittel,
			},
			{
				onSuccess: () => {
					reset();
					closeModal();
				},
			},
		);
	};

	const handleClose = () => {
		reset();
		closeModal();
	};

	return (
		<Modal open={open} onClose={handleClose} aria-label="Opprett lagret søk" className="w-[44rem]">
			<form onSubmit={handleSubmit(onSubmit)}>
				<Modal.Body>
					<Heading size="medium" className="mb-4">
						Nytt lagret søk
					</Heading>
					<TextField
						label="Tittel"
						{...register('tittel', { required: 'Tittel er påkrevd' })}
						error={errors.tittel?.message}
					/>
					{backendError && (
						<Alert variant="error" className="mt-4">
							Kunne ikke opprette søk.
						</Alert>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button type="submit" loading={isSubmitting}>
						Opprett søk
					</Button>
					<Button variant="secondary" type="button" onClick={handleClose}>
						Avbryt
					</Button>
				</Modal.Footer>
			</form>
		</Modal>
	);
}
