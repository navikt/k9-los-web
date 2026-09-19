import type { OppgaveNokkelDto } from 'api/generated/los.schemas';

type Reservasjon = Readonly<{
	oppgavenøkkel: OppgaveNokkelDto;
	reservasjonsnøkkel: string;
	reservertAvIdent: string;
	reservertAvEpost: string;
	reservertAvNavn?: string;
	reservertTilTidspunkt: string;
	saksnummer: string;
	journalpostId: string;
	ytelse: string;
	// Backend sender et kodeverkobjekt, selv om spec-en sier enum-streng.
	behandlingType: { kode: string; navn: string };
	tilBeslutter: boolean;
	kommentar?: string;
}>;

export default Reservasjon;
