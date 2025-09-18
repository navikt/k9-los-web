import { OppgaveNøkkel } from 'types/OppgaveNøkkel';
import OppgaveV3 from 'types/OppgaveV3';

interface BaseReservasjonV3 {
	reservertAvIdent: string;
	reservertAvEpost: string;
	reservertAvNavn?: string;
	reservertFra: string;
	reservertTil: string;
	endretAvNavn?: string;
}

interface ReservasjonV3 extends BaseReservasjonV3 {
	reserverteV3Oppgaver: OppgaveV3[];
	kommentar: string;
}

export interface ReservasjonV3FraKøDto extends BaseReservasjonV3 {
	oppgaveNøkkelDto: OppgaveNøkkel;
	reservasjonsnøkkel: string;
	oppgavebehandlingsUrl: string;
}

export default ReservasjonV3;
