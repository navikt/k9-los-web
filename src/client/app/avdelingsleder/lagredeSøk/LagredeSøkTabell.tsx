import React from 'react';
import { Table } from '@navikt/ds-react';
import { LagretSøk } from 'api/queries/avdelingslederQueries';
import { momentDateFormat } from 'utils/dateUtils';

export function LagredeSøkTabell(props: { lagredeSøk: LagretSøk[] }) {
	return (
		<Table>
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell scope="col">Tittel</Table.HeaderCell>
					<Table.HeaderCell scope="col">Antall oppgaver</Table.HeaderCell>
					<Table.HeaderCell scope="col">Sist endret</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{props.lagredeSøk.map(({ tittel, sistEndret }) => (
					<Table.Row>
						<Table.DataCell>{tittel}</Table.DataCell>
						<Table.DataCell>{0}</Table.DataCell>
						<Table.DataCell>{momentDateFormat(sistEndret)}</Table.DataCell>
					</Table.Row>
				))}
			</Table.Body>
		</Table>
	);
}
