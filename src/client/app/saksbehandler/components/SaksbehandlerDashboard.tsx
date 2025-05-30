import React, { FunctionComponent } from 'react';
import Panel from 'nav-frontend-paneler';
import { useInnloggetSaksbehandler } from 'api/queries/saksbehandlerQueries';
import SaksstottePaneler from 'saksbehandler/saksstotte/components/SaksstottePaneler';
import { Søkeboks } from 'saksbehandler/sokeboks/Søkeboks';
import BehandlingskoerIndex from '../behandlingskoer/BehandlingskoerIndex';
import * as styles from './saksbehandlerDashboard.css';

export const SaksbehandlerDashboard: FunctionComponent = () => {
	const { data: saksbehandler } = useInnloggetSaksbehandler();

	return (
		<div>
			<div className={styles.oppgaveContainer}>
				<div className={styles.gridContainer}>
					<div className={styles.leftColumn}>
						<Panel className={styles.sakslistePanel}>
							<Søkeboks />
						</Panel>
						{saksbehandler.finnesISaksbehandlerTabell && (
							<div>
								<Panel className={styles.sakslistePanel}>
									<BehandlingskoerIndex />
								</Panel>
							</div>
						)}
					</div>
					<div className={styles.rightColumn}>
						<Panel>
							<SaksstottePaneler />
						</Panel>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SaksbehandlerDashboard;
