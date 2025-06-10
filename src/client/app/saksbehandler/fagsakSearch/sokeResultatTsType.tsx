import Person from 'saksbehandler/fagsakSearch/personTsType';
import Oppgave from 'saksbehandler/oppgaveTsType';

export type SokeResultat = Readonly<{
	ikkeTilgang: boolean;
	oppgaver: Oppgave[];
	person: Person;
}>;
