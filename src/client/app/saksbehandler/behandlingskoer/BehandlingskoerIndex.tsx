import { Loader } from '@navikt/ds-react';
import { useAlleSaksbehandlerKoerV3 } from 'api/queries/saksbehandlerQueries';
import { type FunctionComponent, useState } from 'react';
import BehandlingskoerContext from 'saksbehandler/BehandlingskoerContext';
import type { OppgavekøV3, OppgavekøV3MedNavn } from 'types/OppgavekøV3Type';
import OppgavekoPanel from './components/OppgavekoPanel';

const BehandlingskoerIndex: FunctionComponent = () => {
	const [valgtOppgavekoId, setValgtOppgavekoId] = useState('');
	const { data: oppgavekoerV3, isLoading } = useAlleSaksbehandlerKoerV3();

	const mapKøV3 = (kø: OppgavekøV3): OppgavekøV3MedNavn => ({ ...kø, navn: kø.tittel, id: `${kø.id}__V3` });
	const oppgavekoer = (oppgavekoerV3 ?? []).map(mapKøV3);

	if (isLoading) {
		return <Loader />;
	}

	return (
		<BehandlingskoerContext.Provider
			value={{
				oppgavekoer,
				setValgtOppgavekoId,
				valgtOppgavekoId,
			}}
		>
			<OppgavekoPanel />
		</BehandlingskoerContext.Provider>
	);
};

export default BehandlingskoerIndex;
