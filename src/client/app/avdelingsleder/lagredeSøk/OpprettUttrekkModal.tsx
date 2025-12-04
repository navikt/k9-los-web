import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Heading, Modal, Radio, RadioGroup } from '@navikt/ds-react';
import { TypeKjøring, useOpprettUttrekk } from 'api/queries/avdelingslederQueries';

interface OpprettUttrekkModalProps {
	lagretSøkId: number;
	lagretSøkTittel: string;
	open: boolean;
	closeModal: () => void;
}

interface OpprettUttrekkFormData {
	typeKjoring: TypeKjøring;
}

export function OpprettUttrekkModal({ lagretSøkId, lagretSøkTittel, open, closeModal }: OpprettUttrekkModalProps) {
	const { mutate, isPending, isError } = useOpprettUttrekk(() => {
		closeModal();
	});

	const { control, handleSubmit, reset } = useForm<OpprettUttrekkFormData>({
		defaultValues: {
			typeKjoring: TypeKjøring.OPPGAVER,
		},
	});

	const onSubmit = (data: OpprettUttrekkFormData) => {
		mutate({
			lagretSokId: lagretSøkId,
			kjoreplan: null,
			typeKjoring: data.typeKjoring,
		});
	};

	const handleClose = () => {
		reset();
		closeModal();
	};

	return (
		<Modal open={open} onClose={handleClose} width="medium" aria-label="Opprett uttrekk">
			<Modal.Header>
				<Heading level="1" size="medium">
					Opprett uttrekk for &#34;{lagretSøkTittel}&#34;
				</Heading>
			</Modal.Header>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Modal.Body>
					<Controller
						name="typeKjoring"
						control={control}
						rules={{ required: true }}
						render={({ field }) => (
							<RadioGroup legend="Velg type uttrekk" {...field}>
								<Radio value={TypeKjøring.OPPGAVER}>Oppgaver - full liste over oppgaver som matcher søket</Radio>
								<Radio value={TypeKjøring.ANTALL}>Antall - kun antall oppgaver som matcher søket</Radio>
							</RadioGroup>
						)}
					/>
					{isError && (
						<div className="mt-4 text-red-600">Noe gikk galt ved opprettelse av uttrekk. Prøv igjen senere.</div>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button type="submit" disabled={isPending}>
						Opprett uttrekk
					</Button>
					<Button type="button" variant="secondary" onClick={handleClose} disabled={isPending}>
						Avbryt
					</Button>
				</Modal.Footer>
			</form>
		</Modal>
	);
}
