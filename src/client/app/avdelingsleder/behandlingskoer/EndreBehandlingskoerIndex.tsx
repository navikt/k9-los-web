import React, { FunctionComponent, useCallback, useState } from 'react';
import EndreOppgavekoerPanel from './components/EndreOppgavekoerPanel';

/**
 * @deprecated
 * EndreBehandlingskoerIndex
 */
const EndreBehandlingskoerIndex: FunctionComponent = () => {
	const [valgtOppgavekoId, setValgtOppgavekoId] = useState<string>();
	const resetValgtOppgavekoId = useCallback(() => setValgtOppgavekoId(undefined), []);
	return (
		<EndreOppgavekoerPanel
			setValgtOppgavekoId={setValgtOppgavekoId}
			valgtOppgavekoId={valgtOppgavekoId}
			resetValgtOppgavekoId={resetValgtOppgavekoId}
		/>
	);
};

export default EndreBehandlingskoerIndex;
