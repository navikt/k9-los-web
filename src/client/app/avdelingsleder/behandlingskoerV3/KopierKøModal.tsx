import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Checkbox, ErrorMessage, Heading, Modal, TextField } from '@navikt/ds-react';
import { useKopierKøMutation } from 'api/queries/avdelingslederQueries';
import { OppgavekøV3Enkel } from 'types/OppgavekøV3Type';

interface Props {
	lukk: () => void;
	eksisterendeKø: OppgavekøV3Enkel;
}

const fieldnames = {
	TITTEL: 'tittel',
	TA_MED_QUERY: 'taMedQuery',
	TA_MED_SAKSBEHANDLERE: 'taMedSaksbehandlere',
};

const KopierKøModal: React.FC<Props> = ({ lukk, eksisterendeKø }) => {
	const { mutate, isError, reset } = useKopierKøMutation(lukk);
	const onClose = () => {
		lukk();
		reset();
	};

	useEffect(() => () => reset(), []);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			[fieldnames.TITTEL]: '',
			[fieldnames.TA_MED_QUERY]: false,
			[fieldnames.TA_MED_SAKSBEHANDLERE]: false,
		},
	});

	const onSubmit = (data: Record<string, any>) => {
		const { tittel, taMedQuery, taMedSaksbehandlere } = data;
		const payload = {
			kopierFraOppgaveId: eksisterendeKø.id,
			tittel,
			taMedQuery,
			taMedSaksbehandlere,
		};

		mutate(payload);
	};
	return (
		<Modal className="w-2/6" onClose={onClose} open portal aria-label="Kopier oppgavekø">
			<Modal.Body>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Heading spacing level="1" size="medium">
						Kopier oppgavekø
					</Heading>

					<TextField
						className="mt-6 mb-8 max-w"
						label="Kønavn"
						size="small"
						error={errors[fieldnames.TITTEL]?.message as string}
						{...register(fieldnames.TITTEL, {
							required: 'Feltet er påkrevd',
							minLength: { value: 3, message: 'Må være minst 3 tegn' },
						})}
					/>
					<Checkbox {...register(fieldnames.TA_MED_QUERY)}>{`Kopier køkriterier fra ${eksisterendeKø.tittel}`}</Checkbox>
					<Checkbox
						{...register(fieldnames.TA_MED_SAKSBEHANDLERE)}
						className="mt-2"
					>{`Kopier saksbehandlere fra ${eksisterendeKø.tittel}`}</Checkbox>
					{isError && (
						<div className="my-4">
							<ErrorMessage>Noe gikk galt ved kopiering av kø</ErrorMessage>
						</div>
					)}
					<div className="flex gap-2 mt-4">
						<Button type="submit">Kopier oppgavekø</Button>
						<Button variant="secondary" type="button" onClick={onClose}>
							Avbryt
						</Button>
					</div>
				</form>
			</Modal.Body>
		</Modal>
	);
};

export default KopierKøModal;
