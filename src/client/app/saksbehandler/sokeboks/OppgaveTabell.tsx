import { Table } from '@navikt/ds-react';
import { type ReactNode, useState } from 'react';
import { OppgaveTabellRad } from 'saksbehandler/sokeboks/OppgaveTabellRad';
import type { SøkeboksOppgaveDto } from 'saksbehandler/sokeboks/søkeboks-oppgave-dto';
import { idKolonneTittel } from 'saksbehandler/tabellvisning';

export function OppgaveTabell(props: { oppgaver: SøkeboksOppgaveDto[] }) {
	const [modal, setModal] = useState<ReactNode>();
	const visHastesakKolonne = props.oppgaver.find((oppgave) => oppgave.hastesak) !== undefined;

	return (
		<>
			{modal}
			<Table>
				<Table.Header>
					<Table.Row>
						{visHastesakKolonne && <Table.HeaderCell />}
						<Table.HeaderCell>{idKolonneTittel(props.oppgaver)}</Table.HeaderCell>
						<Table.HeaderCell>Navn</Table.HeaderCell>
						<Table.HeaderCell>Ytelsestype</Table.HeaderCell>
						<Table.HeaderCell>Status</Table.HeaderCell>
						<Table.HeaderCell />
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{props.oppgaver.map((oppgave) => (
						<OppgaveTabellRad
							key={oppgave.oppgaveNøkkel.oppgaveEksternId}
							visHastesakKolonne={visHastesakKolonne}
							oppgave={oppgave}
							setModal={setModal}
						/>
					))}
				</Table.Body>
			</Table>
		</>
	);
}
