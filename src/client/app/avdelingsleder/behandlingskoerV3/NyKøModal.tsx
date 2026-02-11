import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Dialog, ErrorMessage, TextField } from '@navikt/ds-react';
import apiPaths from 'api/apiPaths';
import { useNyKøMutation } from 'api/queries/avdelingslederQueries';

interface FormValues {
	tittel: string;
}

interface OwnProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccessCallback?: (id: string) => void;
}

const NyKøModal = ({ open, onOpenChange, onSuccessCallback }: OwnProps) => {
	const callback = (id: string) => {
		onOpenChange(false);
		if (onSuccessCallback) onSuccessCallback(id);
	};
	const mutation = useNyKøMutation(callback);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: { tittel: '' },
	});

	const onSubmit = (data: FormValues) => {
		mutation.mutate({ url: apiPaths.opprettOppgaveko, body: data });
	};

	return (
		<Dialog open={open} onOpenChange={(nextOpen) => onOpenChange(nextOpen)}>
			<Dialog.Popup className="w-[44rem]">
				<Dialog.Header>
					<Dialog.Title>Ny oppgavekø</Dialog.Title>
				</Dialog.Header>
				<Dialog.Body>
					<form onSubmit={handleSubmit(onSubmit)}>
						<TextField
							className="my-6 max-w"
							label="Kønavn"
							autoFocus
							error={errors.tittel?.message}
							{...register('tittel', {
								required: 'Feltet er påkrevd',
								minLength: { value: 3, message: 'Må være minst 3 tegn' },
							})}
						/>
						{mutation.isError && <ErrorMessage>Noe gikk galt ved oppretting av kø.</ErrorMessage>}
						<Dialog.Footer>
							<Dialog.CloseTrigger>
								<Button variant="secondary" type="button">
									Avbryt
								</Button>
							</Dialog.CloseTrigger>
							<Button loading={mutation.isPending} type="submit">
								Opprett kø
							</Button>
						</Dialog.Footer>
					</form>
				</Dialog.Body>
			</Dialog.Popup>
		</Dialog>
	);
};

export default NyKøModal;
