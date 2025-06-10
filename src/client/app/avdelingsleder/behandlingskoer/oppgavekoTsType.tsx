import { Saksbehandler } from 'avdelingsleder/bemanning/saksbehandlerTsType';
import KoSorteringType from 'kodeverk/KoSorteringTsType';

// TODO (TOR) default export feilar for yarn:coverage
 
export type Oppgaveko = Readonly<{
	id: string;
	navn?: string;
	behandlingTyper?: string[];
	fagsakYtelseTyper?: string[];
	sistEndret: string;
	sortering?: {
		sorteringType: KoSorteringType;
		fomDato?: string;
		tomDato?: string;
	};
	skjermet: boolean;
	andreKriterier?: AnnetKriterie[];
	kriterier: Kriterie[];
	saksbehandlere: Saksbehandler[];
	antallBehandlinger: number;
	antallUreserverteOppgaver: number;
}>;

type AnnetKriterie = Readonly<{
	andreKriterierType: string;
	inkluder: boolean;
}>;

export type Kriterie = Readonly<{
	id: string;
	kriterierType: {
		kode: string;
		navn: string;
		felttype: string;
		felttypeKodeverk?: string;
		kodeverk: string;
	};
	inkluder: boolean;
	fom?: string;
	tom?: string;

	checked: boolean;
	koder: boolean;
}>;
