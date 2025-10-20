import React, { FunctionComponent } from 'react';
import { useInnloggetSaksbehandler } from 'api/queries/saksbehandlerQueries';
import IkkeTilgang from 'avdelingsleder/components/IkkeTilgang';
import DriftsmeldingerPanel from './driftsmeldinger/DriftsmeldingerPanel';

/**
 * AdminIndex
 */
export const AdminIndex: FunctionComponent = () => {
	const { data: saksbehandler } = useInnloggetSaksbehandler();

	if (!saksbehandler.kanDrifte) {
		return <IkkeTilgang />;
	}

	return (
		<div className="p-4 max-w-[1000px] mx-auto bg-white">
			<DriftsmeldingerPanel />
		</div>
	);
};

export default AdminIndex;
