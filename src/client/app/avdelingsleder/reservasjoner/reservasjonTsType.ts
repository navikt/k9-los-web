import KodeverkMedNavn from 'kodeverk/kodeverkMedNavnTsType';
import { OppgaveNøkkel } from 'types/OppgaveNøkkel';

type Reservasjon = Readonly<{
	oppgavenøkkel: OppgaveNøkkel;
	reservertAvIdent: string;
	reservertAvEpost: string;
	reservertAvNavn?: string;
	reservertTilTidspunkt: string;
	saksnummer: string;
	journalpostId: string;
	ytelse: string;
	behandlingType: KodeverkMedNavn;
	tilBeslutter: boolean;
	kommentar?: string;
}>;

export default Reservasjon;

// val reservertAvEpost: String,
// val saksnummer: String,
// val behandlingType: BehandlingType,
// val reservertTilTidspunkt: LocalDateTime,
// val oppgavenøkkel: OppgaveNøkkelDto,
