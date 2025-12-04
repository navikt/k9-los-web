import React, { useEffect, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { FilesIcon, PencilIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Skeleton, SortState, Table, TextField } from '@navikt/ds-react';
import apiPaths from 'api/apiPaths';
import { LagretSøk, useEndreLagretSøk, useKopierLagretSøk, useSlettLagretSøk } from 'api/queries/avdelingslederQueries';
import { EndreKriterierLagretSøkModal } from 'avdelingsleder/lagredeSøk/EndreKriterierLagretSøkModal';
import { UttrekkForLagretSøk } from 'avdelingsleder/lagredeSøk/UttrekkForLagretSøk';
import ModalButton from 'sharedComponents/ModalButton';
import { dateFormat } from 'utils/dateUtils';
import { axiosInstance } from 'utils/reactQueryConfig';

function EndreTittel({
	lagretSøk,
	ikkeIEndreModusLenger,
}: {
	lagretSøk: LagretSøk;
	ikkeIEndreModusLenger: () => void;
}) {
	const { mutate, isPending, isError } = useEndreLagretSøk(ikkeIEndreModusLenger);
	const [tittel, setTittel] = useState(lagretSøk.tittel);
	const [feilmelding, setFeilmelding] = useState('');

	useEffect(() => {
		if (tittel.length === 0) {
			setFeilmelding('Tittel må være utfylt');
		} else {
			setFeilmelding('');
		}
	}, [tittel]);

	useEffect(() => {
		if (isError) {
			setFeilmelding('Noe gikk galt ved lagring av søk. Prøv å oppfrisk siden.');
		}
	}, [isError]);

	return (
		<form
			className="flex gap-2 items-start"
			onSubmit={(event) => {
				event.preventDefault();
				if (tittel.length > 0) {
					mutate({ ...lagretSøk, tittel });
				}
			}}
		>
			<TextField
				label="Tittel"
				hideLabel
				value={tittel}
				onChange={(event) => setTittel(event.target.value)}
				error={feilmelding}
				htmlSize={40}
				maxLength={100}
				autoFocus
			/>
			<Button variant="secondary" disabled={isPending} type="submit">
				Lagre
			</Button>
			<Button variant="tertiary" disabled={isPending} type="button" onClick={ikkeIEndreModusLenger}>
				Avbryt
			</Button>
		</form>
	);
}

export function LagredeSøkTabell(props: { lagredeSøk: LagretSøk[] }) {
	const [endres, setEndres] = useState<number>();
	const [ekspandertRad, setEkspandertRad] = useState<number>();
	const [sort, setSort] = useState<SortState | undefined>({
		orderBy: 'tittel',
		direction: 'ascending',
	});
	const { mutate: kopierLagretSøk } = useKopierLagretSøk();
	const { mutate: slettLagretSøk } = useSlettLagretSøk();

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
		<Table sort={sort} onSortChange={handleSort} size="medium">
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
					<Table.ExpandableRow
						key={lagretSøk.id}
						open={ekspandertRad === lagretSøk.id}
						onOpenChange={() => setEkspandertRad(ekspandertRad === lagretSøk.id ? undefined : lagretSøk.id)}
						togglePlacement="left"
						content={<UttrekkForLagretSøk lagretSøk={lagretSøk} />}
					>
						<Table.DataCell>
							{endres === lagretSøk.id ? (
								<EndreTittel lagretSøk={lagretSøk} ikkeIEndreModusLenger={() => setEndres(undefined)} />
							) : (
								<div className="flex items-center gap-2">
									<span>{lagretSøk.tittel}</span>
									{endres === undefined && (
										<Button
											title="Endre tittel"
											size="small"
											variant="tertiary"
											icon={<PencilIcon />}
											onClick={() => setEndres(lagretSøk.id)}
										/>
									)}
								</div>
							)}
						</Table.DataCell>
						<Table.DataCell>
							{antallQueries[props.lagredeSøk.indexOf(lagretSøk)].isLoading ? (
								<Skeleton variant="text" width={50} />
							) : (
								(antallQueries[props.lagredeSøk.indexOf(lagretSøk)].data ?? '-')
							)}
						</Table.DataCell>
						<Table.DataCell>{dateFormat(lagretSøk.sistEndret)}</Table.DataCell>
						<Table.DataCell>
							<div className="flex gap-4">
								<ModalButton
									renderButton={({ openModal }) => (
										<Button icon={<PencilIcon />} variant="tertiary" size="small" onClick={openModal}>
											Endre&nbsp;kriterier
										</Button>
									)}
									renderModal={({ open, closeModal }) => (
										<EndreKriterierLagretSøkModal lagretSøk={lagretSøk} open={open} closeModal={closeModal} />
									)}
								/>
								<div>
									<Button
										variant="tertiary"
										size="small"
										onClick={() => {
											kopierLagretSøk({ id: lagretSøk.id, tittel: `Kopi av: ${lagretSøk.tittel}` });
										}}
										icon={<FilesIcon />}
									>
										Kopier
									</Button>
								</div>
								<div>
									<Button
										variant="tertiary"
										size="small"
										onClick={() => {
											slettLagretSøk(lagretSøk.id);
										}}
										icon={<TrashIcon />}
									>
										Slett
									</Button>
								</div>
							</div>
						</Table.DataCell>
					</Table.ExpandableRow>
				))}
			</Table.Body>
		</Table>
	);
}
