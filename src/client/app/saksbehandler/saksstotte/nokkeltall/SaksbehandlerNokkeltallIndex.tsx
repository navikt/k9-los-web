import React, { FunctionComponent } from 'react';
import { K9LosApiKeys } from 'api/k9LosApi';
import { useRestApi } from 'api/rest-api-hooks';
import NyeOgFerdigstilteOppgaver from 'saksbehandler/saksstotte/nokkeltall/components/nyeOgFerdigstilteOppgaverTsType';
import SaksbehandlerNokkeltallPanel from './components/SaksbehandlerNokkeltallPanel';

/**
 * SaksbehandlerNokkeltallIndex
 */
const SaksbehandlerNokkeltallIndex: FunctionComponent = () => {
	const { data: nyeOgFerdigstilteOppgaver = [] } = useRestApi<NyeOgFerdigstilteOppgaver[]>(
		K9LosApiKeys.HENT_NYE_OG_FERDIGSTILTE_OPPGAVER,
		{},
		true,
	);
	return <SaksbehandlerNokkeltallPanel nyeOgFerdigstilteOppgaver={nyeOgFerdigstilteOppgaver} />;
};

export default SaksbehandlerNokkeltallIndex;
