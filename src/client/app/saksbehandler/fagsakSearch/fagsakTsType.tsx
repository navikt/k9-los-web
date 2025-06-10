import KodeverkMedNavn from 'kodeverk/kodeverkMedNavnTsType';
import Person from './personTsType';

type Fagsak = Readonly<{
	saksnummer: string;
	sakstype: KodeverkMedNavn;
	person: Person;
	behandlingStatus?: KodeverkMedNavn;
	opprettet: string;
	fagsystem: KodeverkMedNavn;
	aktiv: boolean;
}>;

export default Fagsak;
