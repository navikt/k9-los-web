import { GlobalAlert } from '@navikt/ds-react';
import { useDriftsmeldinger } from 'fleromrade/api/driftsmeldingQueries';
import { dateTimeFormat } from 'utils/dateUtils';

const DriftsmeldingBanner = () => {
	const { data: driftsmeldinger = [] } = useDriftsmeldinger();

	return driftsmeldinger
		.filter((driftsmelding) => driftsmelding.aktiv)
		.map((driftsmelding) => (
			<GlobalAlert key={driftsmelding.id} status="warning">
				<GlobalAlert.Header>
					<GlobalAlert.Title as="h2">{driftsmelding.melding}</GlobalAlert.Title>
				</GlobalAlert.Header>
				{driftsmelding.aktivert && (
					<GlobalAlert.Content>{`Registrert ${dateTimeFormat(driftsmelding.aktivert)}`}</GlobalAlert.Content>
				)}
			</GlobalAlert>
		));
};

export default DriftsmeldingBanner;
