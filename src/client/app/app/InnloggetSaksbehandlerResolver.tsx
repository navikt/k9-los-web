import { FunctionComponent, ReactElement } from 'react';
import { useInnloggetSaksbehandler } from 'api/queries/saksbehandlerQueries';

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
