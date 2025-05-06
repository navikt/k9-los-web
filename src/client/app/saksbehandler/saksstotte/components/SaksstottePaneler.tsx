import React, { FunctionComponent } from 'react';
import SaksbehandlerNøkkeltall from 'saksbehandler/saksstotte/nokkeltall/SaksbehandlerNøkkeltall';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import SistBehandledeSaker from './SistBehandledeSaker';

/**
 * SaksstottePaneler
 */
const SaksstottePaneler: FunctionComponent = () => (
	<>
		<SistBehandledeSaker />
		<VerticalSpacer twentyPx />
		<SaksbehandlerNøkkeltall />
	</>
);

export default SaksstottePaneler;
