import React, { useState } from 'react';
import { Button, Modal, Skeleton, SortState, Table } from '@navikt/ds-react';
import { LagretSøk, useHentAntallLagretSøk } from 'api/queries/avdelingslederQueries';
import { EndreLagretSøkModal } from 'avdelingsleder/lagredeSøk/EndreLagretSøkModal';
import ModalButton from 'sharedComponents/ModalButton';
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
	const [sort, setSort] = useState<SortState | undefined>({
		orderBy: 'tittel',
		direction: 'ascending',
	});

	const handleSort = (sortKey: string) => {
		const newDirection =
			sort && sortKey === sort.orderBy && sort.direction === 'ascending' ? 'descending' : 'ascending';
		setSort((prevState) =>
			prevState && sortKey === prevState.orderBy && prevState.direction === 'descending'
				? undefined
				: { orderBy: sortKey, direction: newDirection },
		);
	};

	return (
		<Table sort={sort} onSortChange={handleSort}>
			<Table.Header>
				<Table.Row>
					<Table.ColumnHeader sortable sortKey="tittel" scope="col">
						Tittel
					</Table.ColumnHeader>
					<Table.ColumnHeader scope="col">Antall oppgaver</Table.ColumnHeader>
					<Table.ColumnHeader sortable sortKey="sistEndret" scope="col">
						Sist endret
					</Table.ColumnHeader>
					<Table.HeaderCell scope="col" />
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{props.lagredeSøk.map((lagretSøk) => (
					<Table.Row key={lagretSøk.id}>
						<Table.DataCell>{lagretSøk.tittel}</Table.DataCell>
						<Table.DataCell>
							<AntallLagretSøk id={lagretSøk.id} />
						</Table.DataCell>
						<Table.DataCell>{momentDateFormat(lagretSøk.sistEndret)}</Table.DataCell>
						<Table.DataCell>
							<ModalButton
								renderButton={({ openModal }) => <Button onClick={openModal}>Endre</Button>}
								renderModal={({ open, closeModal }) => (
									<EndreLagretSøkModal lagretSøk={lagretSøk} open={open} closeModal={closeModal} />
								)}
							/>
						</Table.DataCell>
					</Table.Row>
				))}
			</Table.Body>
		</Table>
	);
}
