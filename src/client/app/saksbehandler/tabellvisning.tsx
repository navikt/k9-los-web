import type React from 'react';

export function idKolonneTittel(oppgaver: { saksnummer?: string; journalpostId?: string }[]): React.ReactNode {
	if (oppgaver.every((oppgave) => oppgave.saksnummer && !oppgave.journalpostId)) {
		return 'Sak';
	}
	if (oppgaver.every((oppgave) => !oppgave.saksnummer && oppgave.journalpostId)) {
		return 'Journalpost';
	}
	return (
		<>
			Sak/
			<wbr />
			journalpost
		</>
	);
}
