// TODO (TOR) default export feilar for yarn:coverage
import KodeverkMedNavn from 'kodeverk/kodeverkMedNavnTsType';

 
export type OppgavekøV1 = Readonly<{
	id: string;
	navn: string;
	behandlingTyper: string[];
	fagsakYtelseTyper: string[];
	andreKriterier: string[];
	sortering?: {
		sorteringType: KodeverkMedNavn;
		fomDato?: string;
		tomDato?: string;
	};
	skjermet: boolean;
}>;
