import { Loader, Skeleton, type SortState, Table } from '@navikt/ds-react';
import { useQueries } from '@tanstack/react-query';
import apiPaths from 'api/apiPaths';
import { useAlleKoer } from 'api/queries/avdelingslederQueries';
import NyKøDialog from 'avdelingsleder/behandlingskoerV3/NyKøDialog';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import type { OppgavekøV3Enkel } from 'types/OppgavekøV3Type';
import { axiosInstance } from 'utils/reactQueryConfig';
import BehandlingsKoForm from './BehandlingsKoForm';
import KopierKø from './KopierKø';
import SlettKø from './SlettKø';

type KøRad = OppgavekøV3Enkel & {
	antallUtenReserverte?: number;
	antallMedReserverte?: number;
	isLoading?: boolean;
	isError?: boolean;
};

type SortKey = 'tittel' | 'antallSaksbehandlere' | 'antallUtenReserverte' | 'sistEndret';
type KøSortState = Omit<SortState, 'orderBy'> & { orderBy: SortKey };

const erSortKey = (sortKey: string): sortKey is SortKey =>
	['tittel', 'antallSaksbehandlere', 'antallUtenReserverte', 'sistEndret'].includes(sortKey);

const sorteringsverdi: Record<SortKey, (rad: KøRad) => string | number> = {
	tittel: (rad) => rad.tittel.toLowerCase(),
	antallSaksbehandlere: (rad) => rad.antallSaksbehandlere,
	antallUtenReserverte: (rad) => rad.antallUtenReserverte ?? 0,
	sistEndret: (rad) => (rad.sistEndret ? new Date(rad.sistEndret).getTime() : 0),
};

const sammenlign = (a: KøRad, b: KøRad, orderBy: SortKey) => {
	const aVerdi = sorteringsverdi[orderBy](a);
	const bVerdi = sorteringsverdi[orderBy](b);
	if (aVerdi < bVerdi) return -1;
	if (aVerdi > bVerdi) return 1;
	return 0;
};

function scrollToId(id: string) {
	const maxAttempts = 50;
	let attempts = 0;
	const intervalId = setInterval(() => {
		attempts += 1;
		const element = document.getElementById(id);
		if (element || attempts >= maxAttempts) {
			clearInterval(intervalId);
			if (element) {
				setTimeout(() => element.scrollIntoView({ behavior: 'smooth', block: 'end' }), 500);
			}
		}
	}, 100);
}

const useBerikMedAntallOppgaverIndividuelt = (køArray: OppgavekøV3Enkel[]) => {
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
		...query.data,
		...(køArray[index] || {}),
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
	const { results: køerMedAntallOppgaver, isSuccess: isSuccessAll } = useBerikMedAntallOppgaverIndividuelt(
		initielleKøer || [],
	);
	const [sort, setSort] = useState<KøSortState | undefined>({
		orderBy: 'tittel',
		direction: 'ascending',
	});
	const [ekspanderteKøer, setEkspanderteKøer] = useState<string[]>([]);
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

	const handleSort = (sortKey: string) => {
		if (!erSortKey(sortKey)) return;

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

		return (køer as KøRad[])
			.slice()
			.sort((a, b) =>
				sort.direction === 'ascending' ? sammenlign(a, b, sort.orderBy) : sammenlign(b, a, sort.orderBy),
			);
	};

	if (isLoading) return <Loader />;
	if (error) return <>Noe gikk galt ved lasting av køer.</>;

	const sortedData = sortData();

	return (
		<>
			<NyKøDialog
				onSuccessCallback={(id) => {
					setKøSomNettoppBleLaget(id);
				}}
			/>
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
		</>
	);
};

export default BehandlingskoerIndex;
