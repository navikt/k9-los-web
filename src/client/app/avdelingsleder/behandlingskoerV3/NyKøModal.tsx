import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Dialog, ErrorMessage } from '@navikt/ds-react';
import { Form, InputField } from '@navikt/ft-form-hooks';
import { minLength, required } from '@navikt/ft-form-validators';
import apiPaths from 'api/apiPaths';
import { useNyKøMutation } from 'api/queries/avdelingslederQueries';

enum fieldnames {
	TITTEL = 'tittel',
}

interface OwnProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccessCallback?: (id: string) => void;
}

const NyKøModal = ({ open, onOpenChange, onSuccessCallback }: OwnProps) => {
	const callback = (id) => {
		onOpenChange(false);
		if (onSuccessCallback) onSuccessCallback(id);
	};
	const mutation = useNyKøMutation(callback);

	const formMethods = useForm({
		defaultValues: {
			[fieldnames.TITTEL]: '',
		},
	});

	return (
		<Dialog open={open} onOpenChange={(nextOpen) => onOpenChange(nextOpen)}>
			<Dialog.Popup className="w-[44rem]">
				<Dialog.Header>
					<Dialog.Title>Ny oppgavekø</Dialog.Title>
				</Dialog.Header>
				<Dialog.Body>
					<Form
						formMethods={formMethods}
						onSubmit={(data) => mutation.mutate({ url: apiPaths.opprettOppgaveko, body: data })}
					>
						<InputField
							className="my-6 max-w"
							label="Kønavn"
							name={fieldnames.TITTEL}
							size="small"
							validate={[required, minLength(3)]}
						/>
						{mutation.isError && <ErrorMessage>Noe gikk galt ved oppretting av kø.</ErrorMessage>}
						<Dialog.Footer>
							<Dialog.CloseTrigger>
								<Button variant="secondary" type="button">
									Avbryt
								</Button>
							</Dialog.CloseTrigger>
							<Button loading={mutation.isPending}>Opprett kø</Button>
						</Dialog.Footer>
					</Form>
				</Dialog.Body>
			</Dialog.Popup>
		</Dialog>
	);
};

export default NyKøModal;
