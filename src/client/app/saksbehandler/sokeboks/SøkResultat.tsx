import React from 'react';
import { OppgaveTabell } from 'saksbehandler/sokeboks/OppgaveTabell';
import { PersonInfo } from 'saksbehandler/sokeboks/PersonInfo';
import { Søkeresultat } from 'saksbehandler/sokeboks/søkeboks-oppgave-dto';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function assertNever(_: never) {}

export function SøkResultat({ søkeresultat }: { søkeresultat: Søkeresultat | undefined }) {
	switch (søkeresultat?.type) {
		case undefined:
			return null;
		case 'IKKE_TILGANG':
			return 'Du har ikke tilgang til å slå opp denne personen';
		case 'TOMT_RESULTAT':
			return 'Søket ga ingen treff';
		case 'MED_RESULTAT':
			return (
				<div>
					{søkeresultat.person && <PersonInfo person={søkeresultat.person} />}
					<OppgaveTabell oppgaver={søkeresultat.oppgaver} />
				</div>
			);
		default:
			assertNever(søkeresultat);
	}
}
