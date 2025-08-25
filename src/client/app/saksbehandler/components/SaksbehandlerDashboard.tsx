import { FunctionComponent } from 'react';
import Panel from 'nav-frontend-paneler';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { useInnloggetSaksbehandler } from 'api/queries/saksbehandlerQueries';
import useGlobalStateRestApiData from 'api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import { Søkeboks } from 'saksbehandler/sokeboks/Søkeboks';
import FeatureSwitch from '../../FeatureSwitch';
import BehandlingskoerIndex from '../behandlingskoer/BehandlingskoerIndex';
import FagsakSearchIndex from '../fagsakSearch/FagsakSearchIndex';
import SaksstotteIndex from '../saksstotte/SaksstotteIndex';
import * as styles from './saksbehandlerDashboard.module.css';

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
							<FeatureSwitch
								flex
								enabled={<Søkeboks />}
								disabled={<FagsakSearchIndex k9punsjUrl={k9punsjUrl.verdi} k9sakUrl={k9sakUrl.verdi} />}
								switchLabel="Vis ny søkeboks"
								helpText={
									<>
										<p>Dette er funksjonalitet under utvikling.</p>
										<p>
											Ny søkeboks går mot ny kø- og oppgavemodell. Det er ønskelig å teste at søkeresultatet vises
											riktig, og at søket er raskt nok.
										</p>
									</>
								}
							/>
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
