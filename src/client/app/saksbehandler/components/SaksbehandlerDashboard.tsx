import { FunctionComponent } from 'react';
import { Box } from '@navikt/ds-react';
import { useInnloggetSaksbehandler } from 'api/queries/saksbehandlerQueries';
import { Søkeboks } from 'saksbehandler/sokeboks/Søkeboks';
import BehandlingskoerIndex from '../behandlingskoer/BehandlingskoerIndex';
import SaksstotteIndex from '../saksstotte/SaksstotteIndex';
import * as styles from './saksbehandlerDashboard.css';

export const SaksbehandlerDashboard: FunctionComponent = () => {
	const { data: saksbehandler } = useInnloggetSaksbehandler();

	return (
		<div>
			<div className={styles.oppgaveContainer}>
				<div className={styles.gridContainer}>
					<div className={styles.leftColumn}>
						<Box background="raised" borderRadius="4" padding="space-16" className={styles.sakslistePanel}>
							<Søkeboks />
						</Box>
						{saksbehandler.finnesISaksbehandlerTabell && (
							<div>
								<Box background="raised" borderRadius="4" padding="space-16" className={styles.sakslistePanel}>
									<BehandlingskoerIndex />
								</Box>
							</div>
						)}
					</div>
					<div className={styles.rightColumn}>
						<Box background="raised" borderRadius="4" padding="space-16">
							<SaksstotteIndex />
						</Box>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SaksbehandlerDashboard;
