/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import { ArrowUndoIcon, PencilIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Checkbox, ErrorMessage, Heading, Loader, Search, SortState, Table } from '@navikt/ds-react';
import { useAvdelingslederReservasjoner } from 'api/queries/avdelingslederQueries';
import ReservasjonerBolkButtons from 'avdelingsleder/reservasjoner/components/ReservasjonerBolkButtons';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import FlyttReservasjonerModal from 'saksbehandler/behandlingskoer/components/menu/FlyttReservasjonerModal';
import OpphevReservasjonerModal from 'saksbehandler/behandlingskoer/components/menu/OpphevReservasjonerModal';
import ModalButton from 'sharedComponents/ModalButton';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { OppgaveNøkkel } from 'types/OppgaveNøkkel';
import { getDateAndTime } from 'utils/dateUtils';
import { getKodeverknavnFraKode } from 'utils/kodeverkUtils';
import Reservasjon from '../reservasjonTsType';
import * as styles from './AvdelingslederReservasjonerTabell.css';

type ReservasjonTableData = {
	reservasjon: Reservasjon;
	id: string;
	navn: string;
	ytelse: string;
	type: string;
	reservertTil: string;
};

// Snevrer inn typesettingen av vanlig SortState, slik at kun felter som finnes i tabellen kan sorteres på
type ReservasjonTableDataSortState = SortState & { orderBy: keyof ReservasjonTableData };
const comparator = (a: ReservasjonTableData, b: ReservasjonTableData, orderBy: keyof ReservasjonTableData) => {
	switch (orderBy) {
		case 'reservasjon':
			// Brukes ikke til sortering
			return 0;
		case 'reservertTil':
			// Kan ikke bruke DD.MM.YYYY til å sortere på, må bruke YYYY-MM-DD
			return a.reservasjon.reservertTilTidspunkt.localeCompare(b.reservasjon.reservertTilTidspunkt);
		default:
			return a[orderBy].localeCompare(b[orderBy]);
	}
};

const sorter = (reservasjonerListe: ReservasjonTableData[], newSort: ReservasjonTableDataSortState) =>
	reservasjonerListe?.sort((a, b) => {
		if (newSort) {
			return newSort.direction === 'ascending' ? comparator(b, a, newSort.orderBy) : comparator(a, b, newSort.orderBy);
		}
		return 1;
	});

const AvdelingslederReservasjonerTabell = () => {
	const [reservasjonerSomSkalVises, setReservasjonerSomSkalVises] = useState<ReservasjonTableData[]>([]);
	const [finnesSokResultat, setFinnesSokResultat] = useState(true);
	const [valgteReservasjoner, setValgteReservasjoner] = useState<
		{ oppgaveNøkkel: OppgaveNøkkel; begrunnelse: string }[]
	>([]);
	const [sort, setSort] = useState<ReservasjonTableDataSortState>({ orderBy: 'navn', direction: 'ascending' });

	const handleSort = (sortKey: keyof ReservasjonTableData) => {
		const newSort: ReservasjonTableDataSortState =
			sort && sortKey === sort.orderBy && sort.direction === 'descending'
				? undefined
				: {
						orderBy: sortKey,
						direction: sort && sortKey === sort.orderBy && sort.direction === 'ascending' ? 'descending' : 'ascending',
					};
		setSort(newSort);
		setReservasjonerSomSkalVises(sorter(reservasjonerSomSkalVises, newSort));
	};

	const {
		data: reservasjoner,
		isLoading: isLoadingReservasjoner,
		isSuccess: isSuccessReservasjoner,
		isError: isErrorReservasjoner,
	} = useAvdelingslederReservasjoner();

	useEffect(() => {
		if (reservasjoner) {
			setReservasjonerSomSkalVises(sorter(reservasjoner.map(mapTilTableData), sort));
			setValgteReservasjoner([]);
		}
	}, [reservasjoner]);

	const mapTilTableData = (reservasjon: Reservasjon): ReservasjonTableData => ({
		reservasjon,
		navn: reservasjon.reservertAvNavn || reservasjon.reservertAvEpost,
		id: reservasjon.saksnummer || reservasjon.journalpostId,
		ytelse: reservasjon.ytelse,
		type:
			getKodeverknavnFraKode(reservasjon.behandlingType?.kode, kodeverkTyper.BEHANDLING_TYPE, {}) +
			(reservasjon.tilBeslutter ? ' - [B] ' : ''),
		reservertTil: getDateAndTime(reservasjon.reservertTilTidspunkt).date,
	});

	const sokEtterReservasjon = (value: string) => {
		const sokVerdi = value.toLowerCase();
		const reservasjonerMedMatch = reservasjoner.filter(
			(res) =>
				res.reservertAvNavn.toLowerCase().includes(sokVerdi) ||
				res.saksnummer?.toLowerCase()?.includes(sokVerdi) ||
				res.journalpostId?.toLowerCase()?.includes(sokVerdi),
		);
		if (reservasjonerMedMatch.length > 0) {
			setFinnesSokResultat(true);
			setReservasjonerSomSkalVises(reservasjonerMedMatch.map(mapTilTableData));
		} else {
			setFinnesSokResultat(false);
		}
	};
	const debounceFn = useCallback(_.debounce(sokEtterReservasjon, 300), [reservasjoner]);

	if (isErrorReservasjoner) {
		return <ErrorMessage>Noe gikk galt ved henting av reservasjoner</ErrorMessage>;
	}

	return (
		<>
			<div className={styles.titelContainer}>
				<div className="flex flex-col justify-between">
					<Heading size="small">
						Alle reservasjoner
						{reservasjoner?.length > 0 && isSuccessReservasjoner && ` (${reservasjoner.length} stk)`}
					</Heading>
					{/* Hvis mer enn 50 antas litt scrolling, så det kan være kjekt å ha knappene på toppen i tillegg til i bunn */}
					{valgteReservasjoner.length > 50 && <ReservasjonerBolkButtons valgteReservasjoner={valgteReservasjoner} />}
				</div>
				<div>
					<Search
						variant="simple"
						onChange={debounceFn}
						label="Søk på reservasjon"
						hideLabel={false}
						description="Du kan søke på navn, saksnummer eller journalpost-ID"
					/>
				</div>
			</div>
			<VerticalSpacer sixteenPx />
			{isLoadingReservasjoner && <Loader size="2xlarge" className={styles.spinner} />}
			{reservasjoner?.length > 0 && isSuccessReservasjoner && !finnesSokResultat && (
				<>
					<VerticalSpacer eightPx />
					<BodyShort size="small">Ingen reservasjoner som matcher søk.</BodyShort>
					<VerticalSpacer eightPx />
				</>
			)}
			{reservasjoner?.length === 0 && isSuccessReservasjoner && (
				<>
					<VerticalSpacer eightPx />
					<BodyShort size="small">Ingen reservasjoner funnet</BodyShort>
					<VerticalSpacer eightPx />
				</>
			)}
			{reservasjonerSomSkalVises?.length > 0 && finnesSokResultat && (
				<Table sort={sort} onSortChange={handleSort}>
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeader scope="col">
								<Checkbox
									checked={valgteReservasjoner.length === reservasjonerSomSkalVises.length}
									indeterminate={
										valgteReservasjoner.length > 0 && valgteReservasjoner.length !== reservasjonerSomSkalVises.length
									}
									onChange={() => {
										if (valgteReservasjoner.length > 0) {
											setValgteReservasjoner([]);
										} else {
											setValgteReservasjoner(
												reservasjonerSomSkalVises.map((r) => ({
													oppgaveNøkkel: r.reservasjon.oppgavenøkkel,
													begrunnelse: r.reservasjon.kommentar,
												})),
											);
										}
									}}
									hideLabel
								>
									Velg alle rader
								</Checkbox>
							</Table.ColumnHeader>
							<Table.ColumnHeader scope="col" sortable sortKey="navn">
								Navn
							</Table.ColumnHeader>
							<Table.ColumnHeader scope="col" sortable sortKey="id">
								Id
							</Table.ColumnHeader>
							<Table.ColumnHeader scope="col" sortable sortKey="ytelse">
								Ytelse
							</Table.ColumnHeader>
							<Table.ColumnHeader scope="col" sortable sortKey="type">
								Type
							</Table.ColumnHeader>
							<Table.ColumnHeader scope="col" sortable sortKey="reservertTil">
								Reservert til
							</Table.ColumnHeader>
							<Table.ColumnHeader scope="col" />
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{reservasjonerSomSkalVises.map(({ reservasjon, id, navn, ytelse, type, reservertTil }) => (
							<Table.Row key={JSON.stringify(reservasjon.oppgavenøkkel)}>
								<Table.DataCell>
									<Checkbox
										hideLabel
										checked={
											valgteReservasjoner.filter(({ oppgaveNøkkel }) => oppgaveNøkkel === reservasjon.oppgavenøkkel)
												.length > 0
										}
										onClick={(event) => {
											if (event.currentTarget.checked) {
												const endret = [...valgteReservasjoner];
												endret.push({ oppgaveNøkkel: reservasjon.oppgavenøkkel, begrunnelse: reservasjon.kommentar });
												setValgteReservasjoner(endret);
											} else {
												setValgteReservasjoner(
													valgteReservasjoner.filter(
														({ oppgaveNøkkel }) => oppgaveNøkkel !== reservasjon.oppgavenøkkel,
													),
												);
											}
										}}
									>
										Velg reservasjon {id}
									</Checkbox>
								</Table.DataCell>
								<Table.DataCell>{navn}</Table.DataCell>
								<Table.DataCell>{id}</Table.DataCell>
								<Table.DataCell>{ytelse}</Table.DataCell>
								<Table.DataCell>{type}</Table.DataCell>
								<Table.DataCell>{reservertTil}</Table.DataCell>
								<Table.DataCell>
									<ModalButton
										renderButton={({ openModal }) => (
											<Button
												size="small"
												variant="tertiary"
												icon={<ArrowUndoIcon />}
												onClick={openModal}
												disabled={valgteReservasjoner.length > 0}
											>
												Legg tilbake i kø
											</Button>
										)}
										renderModal={({ closeModal, open }) => (
											<OpphevReservasjonerModal
												open={open}
												closeModal={closeModal}
												oppgaveNøkler={[reservasjon.oppgavenøkkel]}
											/>
										)}
									/>
									<ModalButton
										renderButton={({ openModal }) => (
											<Button
												size="small"
												variant="tertiary"
												icon={<PencilIcon />}
												onClick={openModal}
												disabled={valgteReservasjoner.length > 0}
											>
												Endre/flytt
											</Button>
										)}
										renderModal={({ closeModal, open }) => (
											<FlyttReservasjonerModal
												open={open}
												closeModal={closeModal}
												reservasjoner={[
													{
														oppgaveNøkkel: reservasjon.oppgavenøkkel,
														begrunnelse: reservasjon.kommentar,
														reserverTil: reservasjon.reservertTilTidspunkt,
														reservertAvIdent: reservasjon.reservertAvIdent,
													},
												]}
											/>
										)}
									/>
								</Table.DataCell>
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			)}
			{valgteReservasjoner.length > 0 && (
				<>
					<VerticalSpacer sixteenPx />
					<ReservasjonerBolkButtons valgteReservasjoner={valgteReservasjoner} />
				</>
			)}
		</>
	);
};

export default AvdelingslederReservasjonerTabell;
