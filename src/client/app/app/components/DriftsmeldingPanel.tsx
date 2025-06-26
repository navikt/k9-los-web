import { FunctionComponent } from 'react';
import moment from 'moment';
import { Column, Row } from 'nav-frontend-grid';
import { Heading } from '@navikt/ds-react';
import { WarningIcon } from '@navikt/ft-plattform-komponenter';
import { DD_MM_HHMM } from 'utils/formats';
import { Driftsmelding } from '../../admin/driftsmeldinger/driftsmeldingTsType';
import * as styles from './driftsmeldingPanel.module.css';

interface OwnProps {
	driftsmeldinger: Driftsmelding[];
}

/**
 * DriftsmeldingPanel
 *
 * Presentasjonskomponent. Definerer hvordan driftsmeldinger vises.
 */
const DriftsmeldingPanel: FunctionComponent<OwnProps> = ({ driftsmeldinger }) => {
	if (
		driftsmeldinger === undefined ||
		driftsmeldinger.length === 0 ||
		driftsmeldinger.filter((message) => message.aktiv).length === 0
	) {
		return null;
	}

	const aktiveDriftsmeldinger = driftsmeldinger.filter((message) => message.aktiv);

	return (
		<div className={styles.container}>
			{aktiveDriftsmeldinger.map((message) => (
				<Row key={message.id}>
					<Column xs="11" className={styles.column}>
						<WarningIcon />
						<Heading size="small">
							{`${message.melding}. (Registrert ${moment(message.aktivert).format(DD_MM_HHMM)})`}
						</Heading>
					</Column>
				</Row>
			))}
		</div>
	);
};

export default DriftsmeldingPanel;
