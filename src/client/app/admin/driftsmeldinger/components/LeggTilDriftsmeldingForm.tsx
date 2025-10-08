import React, { FormEvent, FunctionComponent, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, TextField } from '@navikt/ds-react';
import { K9LosApiKeys } from 'api/k9LosApi';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { Driftsmelding } from '../driftsmeldingTsType';

/**
 * LeggTilDriftsmeldingForm
 */
interface OwnProps {
	hentAlleDriftsmeldinger: () => void;
}

export const LeggTilDriftsmeldingForm: FunctionComponent<OwnProps> = ({ hentAlleDriftsmeldinger }) => {
	const [leggerTilNyDriftsmelding, setLeggerTilNyDriftsmelding] = useState(false);
	const [melding, setMelding] = useState('');

	const { startRequest: leggTilDriftsmelding } = useRestApiRunner<Driftsmelding>(K9LosApiKeys.LAGRE_DRIFTSMELDING);

	const addDriftsmelding = (nyMelding: string, resetFormValues: () => void) => {
		if (!nyMelding) {
			return;
		}
		setLeggerTilNyDriftsmelding(true);
		leggTilDriftsmelding({ driftsmelding: nyMelding })
			.then(() => hentAlleDriftsmeldinger())
			.then(() => setLeggerTilNyDriftsmelding(false));
		resetFormValues();
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
					label={<FormattedMessage id="LeggTilDriftsmeldingForm.LeggTil" />}
					size="medium"
					value={melding}
					onChange={(e) => setMelding(e.target.value)}
				/>
				<div>
					<Button
						className="absolute bottom-0 h-[42px]"
						loading={leggerTilNyDriftsmelding}
						disabled={leggerTilNyDriftsmelding}
						type="submit"
					>
						<FormattedMessage id="LeggTilDriftsmeldingForm.Legg_Til" />
					</Button>
				</div>
			</div>
		</form>
	);
};

export default LeggTilDriftsmeldingForm;
