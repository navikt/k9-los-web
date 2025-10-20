import React, { FormEvent, FunctionComponent, useState } from 'react';
import { Button, TextField } from '@navikt/ds-react';
import { useLagreDriftsmelding } from 'api/queries/driftsmeldingQueries';

/**
 * LeggTilDriftsmeldingForm
 */

export const LeggTilDriftsmeldingForm: FunctionComponent = () => {
	const [melding, setMelding] = useState('');

	const { mutate: lagreDriftsmelding, isPending } = useLagreDriftsmelding();

	const addDriftsmelding = (nyMelding: string, resetFormValues: () => void) => {
		if (!nyMelding) {
			return;
		}
		lagreDriftsmelding(
			{ driftsmelding: nyMelding },
			{
				onSuccess: () => {
					resetFormValues();
				},
			},
		);
	};

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		addDriftsmelding(melding, () => setMelding(''));
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="flex gap-6 relative">
				<TextField
					name="melding"
					className="min-w-64"
					label="Legg til driftsmelding"
					size="medium"
					value={melding}
					onChange={(e) => setMelding(e.target.value)}
				/>
				<div>
					<Button
						className="absolute bottom-0 h-[42px]"
						loading={isPending}
						disabled={isPending}
						type="submit"
					>
						Legg til
					</Button>
				</div>
			</div>
		</form>
	);
};

export default LeggTilDriftsmeldingForm;
