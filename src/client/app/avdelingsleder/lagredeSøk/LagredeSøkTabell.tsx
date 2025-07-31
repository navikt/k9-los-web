import React, { useState } from 'react';
import { UseQueryResult, useQueries } from '@tanstack/react-query';
import { PencilIcon } from '@navikt/aksel-icons';
import { Button, Skeleton, SortState, Table } from '@navikt/ds-react';
import apiPaths from 'api/apiPaths';
import { LagretSøk } from 'api/queries/avdelingslederQueries';
import { EndreKriterierLagretSøkModal } from 'avdelingsleder/lagredeSøk/EndreKriterierLagretSøkModal';
import { EndreLagretSøkRadInnhold } from 'avdelingsleder/lagredeSøk/EndreLagretSøkRadInnhold';
import ModalButton from 'sharedComponents/ModalButton';
import { momentDateFormat } from 'utils/dateUtils';
import { axiosInstance } from 'utils/reactQueryConfig';

function Rad({ lagretSøk, antallQueryResult }: { lagretSøk: LagretSøk; antallQueryResult: UseQueryResult<number> }) {
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
				{antallQueryResult.isLoading ? <Skeleton variant="text" width={50} /> : (antallQueryResult.data ?? '-')}
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

	const antallQueries = useQueries({
		queries: props.lagredeSøk.map((søk) => ({
			queryKey: [apiPaths.hentAntallLagretSøk(søk.id.toString())],
			queryFn: () =>
				axiosInstance.get(apiPaths.hentAntallLagretSøk(søk.id.toString())).then((response) => response.data),
		})),
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
		if (sort?.orderBy === 'antall') {
			const antallA = antallQueries[props.lagredeSøk.indexOf(a)].data ?? 0;
			const antallB = antallQueries[props.lagredeSøk.indexOf(b)].data ?? 0;
			return sort.direction === 'ascending' ? antallA - antallB : antallB - antallA;
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
					<Table.ColumnHeader sortable={antallQueries.every((query) => query.isSuccess)} sortKey="antall" scope="col">
						Antall oppgaver
					</Table.ColumnHeader>
					<Table.ColumnHeader sortable sortKey="sistEndret" scope="col">
						Sist endret
					</Table.ColumnHeader>
					<Table.ColumnHeader scope="col" />
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{sorterteLagredeSøk.map((lagretSøk) => (
					<Rad
						lagretSøk={lagretSøk}
						key={lagretSøk.id}
						antallQueryResult={antallQueries[props.lagredeSøk.indexOf(lagretSøk)]}
					/>
				))}
			</Table.Body>
		</Table>
	);
}
