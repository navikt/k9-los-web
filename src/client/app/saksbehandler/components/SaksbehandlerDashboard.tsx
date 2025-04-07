import React, { FunctionComponent, useRef, useState } from 'react';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import Panel from 'nav-frontend-paneler';
import { MenuElipsisHorizontalIcon, MenuHamburgerIcon } from '@navikt/aksel-icons';
import { Button, Checkbox, HStack, HelpText, Popover, Switch, VStack } from '@navikt/ds-react';
import { sokeboksNyeKoer } from 'app/envVariablesUtils';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { useInnloggetSaksbehandler } from 'api/queries/saksbehandlerQueries';
import useGlobalStateRestApiData from 'api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import { Søkeboks } from 'saksbehandler/sokeboks/Søkeboks';
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

	const buttonRef = useRef<HTMLButtonElement>(null);
	const [toggleMeny, setToggleMeny] = useState(false);
	const [nyttSøk, setNyttSøk] = useState(false);

	return (
		<div>
			<div className={styles.oppgaveContainer}>
				<div className={styles.gridContainer}>
					<div className={styles.leftColumn}>
						<Panel className={styles.sakslistePanel}>
							<HStack gap="0" align="start" wrap justify="space-between">
								<div style={{ flexGrow: 1 }}>
									{nyttSøk ? (
										<Søkeboks />
									) : (
										<FagsakSearchIndex k9punsjUrl={k9punsjUrl.verdi} k9sakUrl={k9sakUrl.verdi} />
									)}
								</div>
								<Button ref={buttonRef} onClick={() => setToggleMeny(!toggleMeny)} variant="tertiary">
									<MenuElipsisHorizontalIcon title="Teste ut funksjonalitet som er under utvikling" fontSize="1.5rem" />
								</Button>
								<Popover anchorEl={buttonRef.current} open={toggleMeny} onClose={() => setToggleMeny(false)}>
									<Popover.Content>
										<HStack gap="2" align="center">
											<Switch size="small" checked={nyttSøk} onChange={(event) => setNyttSøk(event.target.checked)}>
												Teste ut ny søkeboks
											</Switch>
										</HStack>
									</Popover.Content>
								</Popover>
							</HStack>
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
