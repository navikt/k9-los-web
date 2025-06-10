import React, { FunctionComponent, ReactElement, useEffect } from 'react';
import useRestApiErrorDispatcher from 'api/error/useRestApiErrorDispatcher';
import { RestApiGlobalStatePathsKeys, k9LosApi } from 'api/k9LosApi';
import { useInnloggetSaksbehandler } from 'api/queries/saksbehandlerQueries';
import { useGlobalStateRestApi } from 'api/rest-api-hooks';
import RestApiState from 'api/rest-api-hooks/src/RestApiState';
import LoadingPanel from 'sharedComponents/LoadingPanel';

interface OwnProps {
	children: ReactElement;
}

const AppConfigResolver: FunctionComponent<OwnProps> = ({ children }) => {
	const { addErrorMessage } = useRestApiErrorDispatcher();
	useEffect(() => {
		k9LosApi().setAddErrorMessageHandler(addErrorMessage);
	}, []);

	const {
		data: innloggetSaksbehandler,
		isSuccess: harHentetInnloggetSaksbehandler,
		isLoading: isLoadingSaksbehandler,
	} = useInnloggetSaksbehandler();

	const { state: stateK9sakUrl } = useGlobalStateRestApi(RestApiGlobalStatePathsKeys.K9SAK_URL, undefined, {
		suspendRequest: !harHentetInnloggetSaksbehandler,
		updateTriggers: [innloggetSaksbehandler],
	});
	const { state: stateKodeverk } = useGlobalStateRestApi(RestApiGlobalStatePathsKeys.KODEVERK, undefined, {
		suspendRequest: !harHentetInnloggetSaksbehandler,
		updateTriggers: [innloggetSaksbehandler],
	});
	const { state: stateK9punsjUrl } = useGlobalStateRestApi(RestApiGlobalStatePathsKeys.PUNSJ_URL, undefined, {
		suspendRequest: !harHentetInnloggetSaksbehandler,
		updateTriggers: [innloggetSaksbehandler],
	});

	if (
		isLoadingSaksbehandler ||
		[stateK9sakUrl, stateKodeverk, stateK9punsjUrl].some((v) => v === RestApiState.LOADING)
	) {
		return <LoadingPanel />;
	}

	return children;
};

export default AppConfigResolver;
