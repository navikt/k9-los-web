import React, { FunctionComponent } from 'react';
import Panel from 'nav-frontend-paneler';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { useInnloggetSaksbehandler } from 'api/queries/saksbehandlerQueries';
import useGlobalStateRestApiData from 'api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import { Søkeboks } from 'saksbehandler/sokeboks/Søkeboks';
import BehandlingskoerIndex from '../behandlingskoer/BehandlingskoerIndex';
import SaksstotteIndex from '../saksstotte/SaksstotteIndex';
import * as styles from './saksbehandlerDashboard.css';

export const SaksbehandlerDashboard: FunctionComponent = () => {
	const k9sakUrl = useGlobalStateRestApiData<{ verdi?: string }>(RestApiGlobalStatePathsKeys.K9SAK_URL);
	const k9punsjUrl = useGlobalStateRestApiData<{ verdi?: string }>(RestApiGlobalStatePathsKeys.PUNSJ_URL);
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
									<BehandlingskoerIndex k9sakUrl={k9sakUrl.verdi} k9punsjUrl={k9punsjUrl.verdi} />
								</Panel>
							</div>
						)}
					</div>
					<div className={styles.rightColumn}>
						<Panel>
							<SaksstotteIndex />
						</Panel>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SaksbehandlerDashboard;
