import React, { useState } from 'react';
import { PencilIcon } from '@navikt/aksel-icons';
import { Button, Skeleton, SortState, Table } from '@navikt/ds-react';
import { LagretSøk, useHentAntallLagretSøk } from 'api/queries/avdelingslederQueries';
import { EndreKriterierLagretSøkModal } from 'avdelingsleder/lagredeSøk/EndreKriterierLagretSøkModal';
import { EndreLagretSøkRadInnhold } from 'avdelingsleder/lagredeSøk/EndreLagretSøkRadInnhold';
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

function Rad({ lagretSøk }: { lagretSøk: LagretSøk }) {
	const [ekspandert, setEkspandert] = useState(false);

	return (
		<Table.ExpandableRow
			key={lagretSøk.id}
			onOpenChange={(open) => setEkspandert(open)}
			open={ekspandert}
			content={<EndreLagretSøkRadInnhold lagretSøk={lagretSøk} close={() => setEkspandert(false)} />}
		>
			<Table.DataCell>{lagretSøk.tittel}</Table.DataCell>
			<Table.DataCell>
				<AntallLagretSøk id={lagretSøk.id} />
			</Table.DataCell>
			<Table.DataCell>{momentDateFormat(lagretSøk.sistEndret)}</Table.DataCell>
			<Table.DataCell>
				<ModalButton
					renderButton={({ openModal }) => (
						<Button icon={<PencilIcon />} variant="tertiary" size="medium" onClick={openModal}>
							Endre kriterier
						</Button>
					)}
					renderModal={({ open, closeModal }) => (
						<EndreKriterierLagretSøkModal lagretSøk={lagretSøk} open={open} closeModal={closeModal} />
					)}
				/>
			</Table.DataCell>
		</Table.ExpandableRow>
	);
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

	const sorterteLagredeSøk = [...props.lagredeSøk].sort((a, b) => {
		if (sort?.orderBy === 'tittel') {
			return sort.direction === 'ascending' ? a.tittel.localeCompare(b.tittel) : b.tittel.localeCompare(a.tittel);
		}
		if (sort?.orderBy === 'sistEndret') {
			return sort.direction === 'ascending'
				? new Date(a.sistEndret).getTime() - new Date(b.sistEndret).getTime()
				: new Date(b.sistEndret).getTime() - new Date(a.sistEndret).getTime();
		}
		return 0;
	});

	return (
		<Table sort={sort} onSortChange={handleSort} size="small">
			<Table.Header>
				<Table.Row>
					<Table.ColumnHeader scope="col" />
					<Table.ColumnHeader sortable sortKey="tittel" scope="col">
						Tittel
					</Table.ColumnHeader>
					<Table.ColumnHeader scope="col">Antall oppgaver</Table.ColumnHeader>
					<Table.ColumnHeader sortable sortKey="sistEndret" scope="col">
						Sist endret
					</Table.ColumnHeader>
					<Table.ColumnHeader scope="col" />
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{sorterteLagredeSøk.map((lagretSøk) => (
					<Rad lagretSøk={lagretSøk} key={lagretSøk.id} />
				))}
			</Table.Body>
		</Table>
	);
}
