import { Kodeverk } from 'kodeverk/kodeverkTsType';

// TODO (TOR) default export feilar for yarn:coverage
// eslint-disable-next-line import/prefer-default-export
export type Oppgaveko = Readonly<{
  id: string;
  navn: string;
  behandlingTyper: string[];
  fagsakYtelseTyper: string[];
  andreKriterier: string[];
  sortering?: {
    sorteringType: Kodeverk;
    fomDato?: string;
    tomDato?: string;
  };
  skjermet: boolean;
}>;
