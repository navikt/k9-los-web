import React, { FunctionComponent } from 'react';
import { useHentDriftsmeldinger } from 'api/queries/driftsmeldingQueries';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import DriftsmeldingerTabell from './DriftsmeldingerTabell';
import LeggTilDriftsmeldingForm from './LeggTilDriftsmeldingForm';

const DriftsmeldingerPanel: FunctionComponent = () => {
	const { data: driftsmeldinger = [] } = useHentDriftsmeldinger();

	return (
		<>
			<DriftsmeldingerTabell driftsmeldinger={driftsmeldinger} />
			<VerticalSpacer sixteenPx />
			<LeggTilDriftsmeldingForm />
		</>
	);
};

export default DriftsmeldingerPanel;
