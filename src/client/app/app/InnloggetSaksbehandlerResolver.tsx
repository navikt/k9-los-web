import { FunctionComponent, ReactElement } from 'react';
import { useKodeverk } from 'api/queries/kodeverkQueries';
import { useInnloggetSaksbehandler } from 'api/queries/saksbehandlerQueries';

interface OwnProps {
	children: ReactElement | ReactElement[];
}

const InnloggetSaksbehandlerResolver: FunctionComponent<OwnProps> = ({ children }) => {
	const { isLoading } = useInnloggetSaksbehandler();
	const { isLoading: isLoadingKodeverk } = useKodeverk();

	if (isLoading || isLoadingKodeverk) {
		return null;
	}

	return children;
};

export default InnloggetSaksbehandlerResolver;
