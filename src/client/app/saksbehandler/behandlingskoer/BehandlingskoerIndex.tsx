import React, { FunctionComponent, useMemo, useState } from 'react';
import { injectIntl } from 'react-intl';
import { Loader } from '@navikt/ds-react';
import { useAlleSaksbehandlerKoerV3 } from 'api/queries/saksbehandlerQueries';
import BehandlingskoerContext from 'saksbehandler/BehandlingskoerContext';
import { OppgavekøV3, OppgavekøV3MedNavn } from 'types/OppgavekøV3Type';
import OppgavekoPanel from './components/OppgavekoPanel';

const BehandlingskoerIndex: FunctionComponent = () => {
	const [valgtOppgavekoId, setValgtOppgavekoId] = useState('');
	const { data: oppgavekoerV3, isLoading } = useAlleSaksbehandlerKoerV3();

	const mapKøV3 = (kø: OppgavekøV3): OppgavekøV3MedNavn => ({ ...kø, navn: kø.tittel, id: `${kø.id}__V3` });
	const oppgavekoer = [...(oppgavekoerV3 || []).map(mapKøV3)];

	const behandlingskoerContextValue = useMemo(
		() => ({
			oppgavekoer,
			setValgtOppgavekoId,
			valgtOppgavekoId,
		}),
		[oppgavekoer, valgtOppgavekoId, setValgtOppgavekoId],
	);

	if (isLoading) {
		return <Loader />;
	}

	return (
		<BehandlingskoerContext.Provider value={behandlingskoerContextValue}>
			<OppgavekoPanel />
		</BehandlingskoerContext.Provider>
	);
};

export default injectIntl(BehandlingskoerIndex);
