import React, { FunctionComponent, useEffect, useMemo } from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import { K9LosApiKeys } from 'api/k9LosApi';
import RestApiState from 'api/rest-api-hooks/src/RestApiState';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { Oppgaveko } from '../oppgavekoTsType';
import GjeldendeOppgavekoerTabell from './GjeldendeOppgavekoerTabell';

interface OwnProps {
	setValgtOppgavekoId: (id: string) => void;
	valgtOppgavekoId?: string;
	resetValgtOppgavekoId: () => void;
}

/**
 * @deprecated
 * EndreOppgavekoerPanel
 */
const EndreOppgavekoerPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
	setValgtOppgavekoId,
	valgtOppgavekoId,
	resetValgtOppgavekoId,
}) => {
	const {
		data: oppgavekoer = [],
		startRequest: hentAlleOppgavekoer,
		state,
	} = useRestApiRunner<Oppgaveko[]>(K9LosApiKeys.OPPGAVEKOER);
	const requestFinished = state === RestApiState.SUCCESS;

	const sortedOppgavekoer = useMemo(
		() =>
			[...oppgavekoer].sort((a, b) => {
				const nyKøConstant = 'Ny kø';
				if (a.navn === nyKøConstant) {
					return -1;
				}
				if (b.navn === nyKøConstant) {
					return 1;
				}
				return a.navn.localeCompare(b.navn);
			}),
		[oppgavekoer],
	);

	useEffect(() => {
		hentAlleOppgavekoer();
	}, [hentAlleOppgavekoer]);

	return (
		<GjeldendeOppgavekoerTabell
			oppgavekoer={sortedOppgavekoer}
			resetValgtOppgavekoId={resetValgtOppgavekoId}
			requestFinished={requestFinished}
			setValgtOppgavekoId={setValgtOppgavekoId}
			valgtOppgavekoId={valgtOppgavekoId}
			hentAlleOppgavekoer={hentAlleOppgavekoer}
		/>
	);
};

export default injectIntl(EndreOppgavekoerPanel);
