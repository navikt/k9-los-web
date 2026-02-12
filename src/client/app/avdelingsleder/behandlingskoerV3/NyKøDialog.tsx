import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, Dialog, ErrorMessage, TextField } from '@navikt/ds-react';
import apiPaths from 'api/apiPaths';
import { useNyKøMutation } from 'api/queries/avdelingslederQueries';

interface FormValues {
	tittel: string;
}

interface OwnProps {
	onSuccessCallback?: (id: string) => void;
}

const NyKøDialog = ({ onSuccessCallback }: OwnProps) => {
	const [open, setOpen] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: { tittel: '' },
	});

	const mutation = useNyKøMutation((id) => {
		setOpen(false);
		reset();
		onSuccessCallback(id);
	});

	const onSubmit = (data: FormValues) => {
		mutation.mutate({ url: apiPaths.opprettOppgaveko, body: data });
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Dialog.Trigger>
				<Button className="mb-7" variant="primary" icon={<PlusCircleIcon />}>
					Legg til ny oppgavekø
				</Button>
			</Dialog.Trigger>
			<Dialog.Popup className="w-[44rem]">
				<Dialog.Header>
					<Dialog.Title>Ny oppgavekø</Dialog.Title>
				</Dialog.Header>
				<Dialog.Body>
					<form id="form" onSubmit={handleSubmit(onSubmit)}>
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
					</form>
				</Dialog.Body>
				<Dialog.Footer>
					<Dialog.CloseTrigger>
						<Button variant="secondary" type="button">
							Avbryt
						</Button>
					</Dialog.CloseTrigger>
					<Button loading={mutation.isPending} type="submit" form="form">
						Opprett kø
					</Button>
				</Dialog.Footer>
			</Dialog.Popup>
		</Dialog>
	);
};

export default NyKøDialog;
