import React, { FunctionComponent, ReactElement } from 'react';
import { useKodeverk } from 'api/queries/kodeverkQueries';
import { useInnloggetSaksbehandler } from 'api/queries/saksbehandlerQueries';
import LoadingPanel from 'sharedComponents/LoadingPanel';

interface OwnProps {
	children: ReactElement;
}

const AppConfigResolver: FunctionComponent<OwnProps> = ({ children }) => {
	const { isSuccess: harHentetInnloggetSaksbehandler, isLoading: isLoadingSaksbehandler } = useInnloggetSaksbehandler();

	const { isLoading: isLoadingKodeverk } = useKodeverk({
		enabled: harHentetInnloggetSaksbehandler,
	});

	if (isLoadingSaksbehandler || isLoadingKodeverk) {
		return <LoadingPanel />;
	}

	return children;
};

export default AppConfigResolver;
