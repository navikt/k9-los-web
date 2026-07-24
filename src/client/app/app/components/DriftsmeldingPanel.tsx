import { FunctionComponent } from 'react';
import dayjs from 'dayjs';
import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { Heading } from '@navikt/ds-react';
import { useHentDriftsmeldinger } from 'api/queries/driftsmeldingQueries';
import * as styles from './driftsmeldingPanel.module.css';

const DriftsmeldingPanel: FunctionComponent = () => {
	const { data, isSuccess } = useHentDriftsmeldinger();
	if (!isSuccess) {
		return null;
	}
	const aktiveDriftsmeldinger = data.filter((message) => message.aktiv);
	if (aktiveDriftsmeldinger.length === 0) {
		return null;
	}

	return (
		<div className={styles.container}>
			{aktiveDriftsmeldinger.map((message) => (
				<div className={styles.row} key={message.id}>
					<div className={styles.column}>
						<ExclamationmarkTriangleIcon />
						<Heading size="small">
							{`${message.melding}. (Registrert ${dayjs(message.aktivert).format('DD.MM HH:mm')})`}
						</Heading>
					</div>
				</div>
			))}
		</div>
	);
};

export default DriftsmeldingPanel;
