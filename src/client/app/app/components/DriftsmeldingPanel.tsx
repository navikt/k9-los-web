import React, { FunctionComponent } from 'react';
import dayjs from 'dayjs';
import { Column, Row } from 'nav-frontend-grid';
import { Heading } from '@navikt/ds-react';
import { WarningIcon } from '@navikt/ft-plattform-komponenter';
import { useHentDriftsmeldinger } from 'api/queries/driftsmeldingQueries';
import * as styles from './driftsmeldingPanel.css';

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
				<Row key={message.id}>
					<Column xs="11" className={styles.column}>
						<WarningIcon />
						<Heading size="small">
							{`${message.melding}. (Registrert ${dayjs(message.aktivert).format('DD.MM HH:mm')})`}
						</Heading>
					</Column>
				</Row>
			))}
		</div>
	);
};

export default DriftsmeldingPanel;
