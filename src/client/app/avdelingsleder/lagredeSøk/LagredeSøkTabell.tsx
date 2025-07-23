import React from 'react';
import { Skeleton, Table } from '@navikt/ds-react';
import { LagretSøk, useHentAntallLagretSøk } from 'api/queries/avdelingslederQueries';
import { momentDateFormat } from 'utils/dateUtils';

function AntallLagretSøk({ id }: { id: number }) {
	const { data, isFetching, isSuccess } = useHentAntallLagretSøk(id);
	if (isFetching) {
		return <Skeleton variant="text" width={50} />;
	}
	if (!isSuccess) {
		return '-';
	}
	return data;
}

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
				{props.lagredeSøk.map(({ id, tittel, sistEndret }) => (
					<Table.Row key={id}>
						<Table.DataCell>{tittel}</Table.DataCell>
						<Table.DataCell>
							<AntallLagretSøk id={id} />
						</Table.DataCell>
						<Table.DataCell>{momentDateFormat(sistEndret)}</Table.DataCell>
					</Table.Row>
				))}
			</Table.Body>
		</Table>
	);
}
