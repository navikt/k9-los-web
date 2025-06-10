import { createContext } from 'react';
import { OppgavekøV3MedNavn } from 'types/OppgavekøV3Type';
import { OppgavekøV1 } from './behandlingskoer/oppgavekoTsType';

export type Behandlingskoer = {
	oppgavekoer: OppgavekøV1[] | OppgavekøV3MedNavn[];
	setValgtOppgavekoId: (oppgavekoId: string) => void;
	valgtOppgavekoId: string;
};
export const BehandlingskoerContext = createContext(null);

export default BehandlingskoerContext;
