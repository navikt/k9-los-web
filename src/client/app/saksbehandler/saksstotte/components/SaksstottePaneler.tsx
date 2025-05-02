import React, { FunctionComponent } from 'react';
import SaksbehandlerNokkeltallIndex from 'saksbehandler/saksstotte/nokkeltall/SaksbehandlerNokkeltallIndex';
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
		{/* <SaksbehandlerNokkeltallIndex /> */}
		<SaksbehandlerNøkkeltall />
	</>
);

export default SaksstottePaneler;
