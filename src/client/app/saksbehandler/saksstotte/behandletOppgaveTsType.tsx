import OppgaveSystem from 'types/OppgaveSystem';

type BehandletOppgave = Readonly<{
	saksnummer: string;
	behandlingId: number;
	personnummer: string;
	navn: string;
	eksternId: string;
	journalpostId: string;
	system: OppgaveSystem;
}>;

export default BehandletOppgave;
