import React from 'react';
import { useInnloggetSaksbehandler } from 'api/queries/saksbehandlerQueries';
import IkkeTilgang from 'avdelingsleder/components/IkkeTilgang';
import SaksbehandlerDashboard from './components/SaksbehandlerDashboard';

/**
 * SaksbehandlerIndex
 */
const SaksbehandlerIndex = () => {
	const { data: saksbehandler } = useInnloggetSaksbehandler();
	if (!saksbehandler.kanSaksbehandle) {
		return <IkkeTilgang />;
	}
	return <SaksbehandlerDashboard />;
};

export default SaksbehandlerIndex;
