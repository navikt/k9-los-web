import React, { useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, Loader, Skeleton, SortState, Table } from '@navikt/ds-react';
import apiPaths from 'api/apiPaths';
import { useAlleKoer } from 'api/queries/avdelingslederQueries';
import { OppgavekøV3Enkel } from 'types/OppgavekøV3Type';
import { axiosInstance } from 'utils/reactQueryConfig';
import BehandlingsKoForm from './BehandlingsKoForm';
import KopierKø from './KopierKø';
import NyKøModal from './NyKøModal';
import SlettKø from './SlettKø';

function scrollToId(id: string) {
	let intervalId: NodeJS.Timeout | undefined;

	const scroll = () => {
		const element = document.getElementById(id);
		if (element) {
			clearInterval(intervalId);
			setTimeout(() => element.scrollIntoView({ behavior: 'smooth', block: 'end' }), 500);
		}
	};

	intervalId = setInterval(scroll, 100);
}

const berikMedAntallOppgaverIndividuelt = (køArray: OppgavekøV3Enkel[]) => {
	const queries = useQueries({
		queries: køArray.map((kø) => ({
			queryKey: ['antallOppgaver', kø.id],

			queryFn: async () => {
				try {
					const { data } = await axiosInstance.get(apiPaths.antallOppgaverIKoV3(kø.id));
					return {
						...kø,
						...data,
					};
				} catch {
					return {
						...kø,
					};
				}
			},

			enabled: !!køArray.length,
		})),
	});

	const isSuccess = queries.every((query) => query.isSuccess);
	const results = queries.map((query, index) => ({
		...(køArray[index] || {}),
		...query.data,
		isLoading: query.isLoading,
		isError: query.isError,
	}));

	return { results, isSuccess };
};

const Row = ({
	kø,
	ekspandert,
	isLoadingAntallOppgaver,
	toggleExpand,
}: {
	kø: OppgavekøV3Enkel & { antallUtenReserverte?: number; antallMedReserverte?: number };
	ekspandert: boolean;
	isLoadingAntallOppgaver: boolean;
	toggleExpand: () => void;
}) => (
	<Table.ExpandableRow
		key={kø.id}
		onOpenChange={toggleExpand}
		open={ekspandert}
		togglePlacement="left"
		content={<BehandlingsKoForm id={kø.id} ekspandert={ekspandert} lukk={toggleExpand} />}
	>
		<Table.DataCell scope="row">{kø.tittel}</Table.DataCell>
		<Table.DataCell>{kø.antallSaksbehandlere || '0'}</Table.DataCell>
		<Table.DataCell>
			{isLoadingAntallOppgaver ? (
				<Skeleton variant="text" />
			) : (
				`${kø?.antallUtenReserverte ?? '-'} (${kø?.antallMedReserverte ?? '-'})`
			)}
		</Table.DataCell>
		<Table.DataCell>{kø.sistEndret ? dayjs(kø.sistEndret).format('DD.MM.YYYY HH:mm') : '-'}</Table.DataCell>
		<Table.DataCell>
			<KopierKø kø={kø} />
			<SlettKø kø={kø} />
		</Table.DataCell>
	</Table.ExpandableRow>
);
const BehandlingskoerIndex = () => {
	const { data: initielleKøer, isLoading, error } = useAlleKoer();
	const { results: køerMedAntallOppgaver, isSuccess: isSuccessAll } = berikMedAntallOppgaverIndividuelt(
		initielleKøer || [],
	);
	const [visNyKøModal, setVisNyKøModal] = useState(false);
	const [sort, setSort] = useState<SortState | undefined>({
		orderBy: 'tittel',
		direction: 'ascending',
	});
	const [ekspanderteKøer, setEkspanderteKøer] = useState([]);
	const [køSomNettoppBleLaget, setKøSomNettoppBleLaget] = useState('');

	const toggleExpand = (køId: string) => {
		setEkspanderteKøer((prevState) =>
			prevState.includes(køId) ? prevState.filter((v) => v !== køId) : [...prevState, køId],
		);
	};
	React.useEffect(() => {
		if (køSomNettoppBleLaget) {
			setEkspanderteKøer([køSomNettoppBleLaget]);
			scrollToId(køSomNettoppBleLaget);
			setKøSomNettoppBleLaget('');
		}
	}, [køSomNettoppBleLaget]);

	const handleSort = (sortKey) => {
		const newDirection =
			sort && sortKey === sort.orderBy && sort.direction === 'ascending' ? 'descending' : 'ascending';
		setSort((prevState) =>
			prevState && sortKey === prevState.orderBy && prevState.direction === 'descending'
				? undefined
				: { orderBy: sortKey, direction: newDirection },
		);
	};

	const sortData = () => {
		const køer = køerMedAntallOppgaver || initielleKøer;
		if (!køer || !sort) return køer;

		return køer.slice().sort((a, b) => {
			const comparator = (itemA, itemB, orderBy) => {
				let aVal = itemA[orderBy];
				let bVal = itemB[orderBy];
				if (orderBy === 'sistEndret') {
					aVal = aVal ? new Date(aVal).getTime() : 0;
					bVal = bVal ? new Date(bVal).getTime() : 0;
				}
				if (orderBy === 'tittel') {
					aVal = aVal?.toLowerCase();
					bVal = bVal?.toLowerCase();
				}
				if (bVal < aVal || bVal === undefined) return -1;
				if (bVal > aVal) return 1;
				return 0;
			};

			return sort.direction === 'ascending' ? comparator(b, a, sort.orderBy) : comparator(a, b, sort.orderBy);
		});
	};

	if (isLoading) return <Loader />;
	if (error) return <>Noe gikk galt ved lasting av køer.</>;

	const sortedData = sortData();

	return (
		<>
			<Button className="mb-7" variant="primary" onClick={() => setVisNyKøModal(true)} icon={<PlusCircleIcon />}>
				Legg til ny oppgavekø
			</Button>
			<Table sort={sort} onSortChange={handleSort} size="small">
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeader scope="col" />
						<Table.ColumnHeader sortKey="tittel" sortable scope="col">
							Kønavn
						</Table.ColumnHeader>
						<Table.ColumnHeader sortKey="antallSaksbehandlere" sortable scope="col">
							Saksbehandlere
						</Table.ColumnHeader>
						<Table.ColumnHeader sortKey="antallUtenReserverte" sortable={isSuccessAll} scope="col">
							Antall oppgaver (med reserverte)
						</Table.ColumnHeader>
						<Table.ColumnHeader sortKey="sistEndret" sortable scope="col">
							Sist endret
						</Table.ColumnHeader>
						<Table.HeaderCell />
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{sortedData?.map((kø) => (
						<Row
							key={kø.id}
							kø={kø}
							isLoadingAntallOppgaver={kø.isLoading}
							ekspandert={ekspanderteKøer.includes(kø.id)}
							toggleExpand={() => toggleExpand(kø.id)}
						/>
					))}
				</Table.Body>
			</Table>
			<NyKøModal
				open={visNyKøModal}
				onOpenChange={setVisNyKøModal}
				onSuccessCallback={(id) => {
					setKøSomNettoppBleLaget(id);
				}}
			/>
		</>
	);
};

export default BehandlingskoerIndex;
