import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import type { FunctionComponent } from 'react';
import SisteOppgaver from 'saksbehandler/saksstotte/components/SisteOppgaver';
import SaksbehandlerNøkkeltall from 'saksbehandler/saksstotte/nokkeltall/SaksbehandlerNøkkeltall';

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
