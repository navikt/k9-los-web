import type KodeverkMedNavn from 'kodeverk/kodeverkMedNavnTsType';
import type { OppgaveNøkkel } from './OppgaveNøkkel';

type OppgaveV3 = {
	søkersNavn: string;
	søkersPersonnr: string;
	behandlingstype: KodeverkMedNavn;
	opprettetTidspunkt?: string;
	saksnummer: string;
	oppgaveNøkkel: OppgaveNøkkel;
	journalpostId: string;
	oppgavestatus: OppgavestatusV3;
	oppgavebehandlingsUrl: string;
};

export enum OppgavestatusV3 {
	AAPEN = 'AAPEN',
	VENTER = 'VENTER',
	LUKKET = 'LUKKET',
}

export default OppgaveV3;
