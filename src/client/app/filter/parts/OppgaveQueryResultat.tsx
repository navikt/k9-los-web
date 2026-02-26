import React from 'react';
import { Table } from '@navikt/ds-react';
import { IdentifiedOppgaveQuery } from 'filter/filterFrontendTypes';
import { Oppgavefelt, Oppgaverad } from 'filter/filterTsTypes';
import { visningsnavnForFelt } from '../utils';
import OppgaveFeltVisning from './OppgaveFeltVisning';

interface Props {
	felter: Oppgavefelt[];
	oppgaveQuery: IdentifiedOppgaveQuery;
	oppgaver: Oppgaverad[];
}

const OppgaveQueryResultat = ({ felter, oppgaveQuery, oppgaver }: Props) => (
	<Table>
		<Table.Header>
			<Table.Row>
				{oppgaveQuery.select?.map(
					(felt) =>
						felt.kode && (
							<Table.HeaderCell scope="col" key={felt._nodeId}>
								{visningsnavnForFelt(felter, felt.område, felt.kode)}
							</Table.HeaderCell>
						),
				)}
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{oppgaver.length === 0 && (
				<Table.Row>
					<Table.DataCell>Ingen oppgaver funnet</Table.DataCell>
				</Table.Row>
			)}
			{oppgaver.map((oppgave) => (
				<Table.Row key={oppgave.id}>
					{oppgave.felter.map((felt) => (
						<Table.DataCell key={felt.kode}>
							<OppgaveFeltVisning felt={felt} oppgaveFelter={felter} />
						</Table.DataCell>
					))}
				</Table.Row>
			))}
		</Table.Body>
	</Table>
);

export default OppgaveQueryResultat;
