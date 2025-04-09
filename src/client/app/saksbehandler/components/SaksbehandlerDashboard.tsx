import React, { FunctionComponent, useRef, useState } from 'react';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import Panel from 'nav-frontend-paneler';
import { MenuElipsisHorizontalIcon, MenuHamburgerIcon, SparklesIcon } from '@navikt/aksel-icons';
import { Button, Checkbox, HStack, HelpText, Popover, Switch, VStack } from '@navikt/ds-react';
import { sokeboksNyeKoer } from 'app/envVariablesUtils';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { useInnloggetSaksbehandler } from 'api/queries/saksbehandlerQueries';
import useGlobalStateRestApiData from 'api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import { Søkeboks } from 'saksbehandler/sokeboks/Søkeboks';
import FeatureSwitch from '../../FeatureSwitch';
import BehandlingskoerIndex from '../behandlingskoer/BehandlingskoerIndex';
import FagsakSearchIndex from '../fagsakSearch/FagsakSearchIndex';
import SaksstotteIndex from '../saksstotte/SaksstotteIndex';
import * as styles from './saksbehandlerDashboard.css';

/**
 * SaksbehandlerDashboard
 */
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
								helpText="Dette er funksjonalitet under utvikling. Søket går her mot ny kø- og oppgavemodell."
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
