import { createContext } from 'react';
import { OppgavekøV3MedNavn } from 'types/OppgavekøV3Type';

export type Behandlingskoer = {
	oppgavekoer: OppgavekøV3MedNavn[];
	setValgtOppgavekoId: (oppgavekoId: string) => void;
	valgtOppgavekoId: string;
};
export const BehandlingskoerContext = createContext<Behandlingskoer>(null);

export default BehandlingskoerContext;
