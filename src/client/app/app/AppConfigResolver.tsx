import React, { FunctionComponent, ReactElement, useEffect } from 'react';
import useRestApiErrorDispatcher from 'api/error/useRestApiErrorDispatcher';
import { k9LosApi } from 'api/k9LosApi';
import { useKodeverk } from 'api/queries/kodeverkQueries';
import { useInnloggetSaksbehandler } from 'api/queries/saksbehandlerQueries';
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

	const { isLoading: isLoadingKodeverk } = useKodeverk({
		enabled: harHentetInnloggetSaksbehandler,
	});

	if (isLoadingSaksbehandler || isLoadingKodeverk) {
		return <LoadingPanel />;
	}

	return children;
};

export default AppConfigResolver;
