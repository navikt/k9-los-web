import { useInnloggetSaksbehandler } from 'api/queries/saksbehandlerQueries';
import type { FunctionComponent, ReactElement } from 'react';

interface OwnProps {
	children: ReactElement | ReactElement[];
}

const InnloggetSaksbehandlerResolver: FunctionComponent<OwnProps> = ({ children }) => {
	const { isSuccess } = useInnloggetSaksbehandler();

	if (!isSuccess) {
		return null;
	}

	return children;
};

export default InnloggetSaksbehandlerResolver;
