import { FunctionComponent, ReactElement } from 'react';
import { useInnloggetSaksbehandler } from 'api/queries/saksbehandlerQueries';

interface OwnProps {
	children: ReactElement;
}

const InnloggetSaksbehandlerResolver: FunctionComponent<OwnProps> = ({ children }) => {
	const { isLoading } = useInnloggetSaksbehandler();

	if (isLoading) {
		return null;
	}

	return children;
};

export default InnloggetSaksbehandlerResolver;
