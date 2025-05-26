import React from 'react';
import { Table } from '@navikt/ds-react';
import { OppgaveTabellRad } from 'saksbehandler/sokeboks/OppgaveTabellRad';
import { SøkeboksOppgaveDto } from 'saksbehandler/sokeboks/søkeboks-oppgave-dto';

export function OppgaveTabell(props: { oppgaver: SøkeboksOppgaveDto[] }) {
	const visHastesakKolonne = props.oppgaver.find((oppgave) => oppgave.hastesak) !== undefined;
	const idKolonneTittel = (() => {
		if (props.oppgaver.every((oppgave) => oppgave.saksnummer && !oppgave.journalpostId)) {
			return 'Saksnummer';
		}
		if (props.oppgaver.every((oppgave) => !oppgave.saksnummer && oppgave.journalpostId)) {
			return 'Journalpost-id';
		}
		return 'Saksnummer/journalpost-id';
	})();
	return (
		<Table>
			<Table.Header>
				<Table.Row>
					{visHastesakKolonne && <Table.HeaderCell />}
					<Table.HeaderCell>{idKolonneTittel}</Table.HeaderCell>
					<Table.HeaderCell>Navn</Table.HeaderCell>
					<Table.HeaderCell>Ytelsestype</Table.HeaderCell>
					<Table.HeaderCell>Status</Table.HeaderCell>
					<Table.HeaderCell />
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{props.oppgaver.map((oppgave) => (
					<OppgaveTabellRad visHastesakKolonne={visHastesakKolonne} oppgave={oppgave} />
				))}
			</Table.Body>
		</Table>
	);
}
