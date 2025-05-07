import React, { FunctionComponent } from 'react';
import SisteOppgaver from 'saksbehandler/saksstotte/components/SisteOppgaver';
import SaksbehandlerNøkkeltall from 'saksbehandler/saksstotte/nokkeltall/SaksbehandlerNøkkeltall';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';

/**
 * SaksstottePaneler
 */
const SaksstottePaneler: FunctionComponent = () => (
	<>
		<SisteOppgaver />
		<VerticalSpacer twentyPx />
		<SaksbehandlerNøkkeltall />
	</>
);

export default SaksstottePaneler;
