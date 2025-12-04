import React, { useState } from 'react';
import { DownloadIcon, PlayIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, Heading, Modal, Skeleton, Table } from '@navikt/ds-react';
import { WarningIcon } from '@navikt/ft-plattform-komponenter';
import apiPaths from 'api/apiPaths';
import { Uttrekk, UttrekkStatus, useHentUttrekkForLagretSøk } from 'api/queries/avdelingslederQueries';
import { OpprettUttrekkModal } from 'avdelingsleder/lagredeSøk/OpprettUttrekkModal';
import ModalButton from 'sharedComponents/ModalButton';
import { dateTimeFormat } from 'utils/dateUtils';
import { axiosInstance } from 'utils/reactQueryConfig';

interface UttrekkForLagretSøkProps {
	lagretSøkId: number;
	lagretSøkTittel: string;
}

function getStatusText(status: UttrekkStatus): string {
	switch (status) {
		case UttrekkStatus.OPPRETTET:
			return 'Opprettet';
		case UttrekkStatus.KJØRER:
			return 'Kjører';
		case UttrekkStatus.FULLFØRT:
			return 'Fullført';
		case UttrekkStatus.FEILET:
			return 'Feilet';
		default:
			return status;
	}
}

function getStatusVariant(status: UttrekkStatus): 'success' | 'warning' | 'error' | 'info' {
	switch (status) {
		case UttrekkStatus.FULLFØRT:
			return 'success';
		case UttrekkStatus.FEILET:
			return 'error';
		case UttrekkStatus.KJØRER:
			return 'warning';
		case UttrekkStatus.OPPRETTET:
			return 'info';
		default:
			return 'info';
	}
}

function UttrekkRad({ uttrekk, lagretSøkTittel }: { uttrekk: Uttrekk; lagretSøkTittel: string }) {
	const [lasterNed, setLasterNed] = useState(false);

	const lastNedCsv = async () => {
		setLasterNed(true);
		try {
			const response = await axiosInstance.get(apiPaths.lastNedUttrekkCsv(uttrekk.id.toString()), {
				responseType: 'blob',
			});

			// Lag en blob og trigger nedlasting
			const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			const filnavn = `${lagretSøkTittel.replace(/[^a-z0-9]/gi, '_')}_${uttrekk.typeKjøring}_${uttrekk.id}.csv`;
			link.setAttribute('download', filnavn);
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Feil ved nedlasting av CSV:', error);
		} finally {
			setLasterNed(false);
		}
	};

	const kanLasteNed =
		uttrekk.status === UttrekkStatus.FULLFØRT &&
		uttrekk.typeKjøring === 'OPPGAVER' &&
		uttrekk.antall !== null &&
		uttrekk.antall > 0;

	return (
		<Table.Row>
			<Table.DataCell>
				{/* <span className={`px-2 py-1 rounded text-sm bg-${getStatusVariant(uttrekk.status)}-100`}> */}
				{/* 	{getStatusText(uttrekk.status)} */}
				{/* </span> */}
				{getStatusText(uttrekk.status)}
			</Table.DataCell>
			<Table.DataCell>{uttrekk.antall !== null ? uttrekk.antall : '-'}</Table.DataCell>
			<Table.DataCell>{dateTimeFormat(uttrekk.opprettetTidspunkt)}</Table.DataCell>
			<Table.DataCell>{uttrekk.fullførtTidspunkt ? dateTimeFormat(uttrekk.fullførtTidspunkt) : '-'}</Table.DataCell>
			<Table.DataCell>
				{kanLasteNed && (
					<Button size="small" variant="tertiary" icon={<DownloadIcon />} onClick={lastNedCsv} loading={lasterNed}>
						Last ned CSV
					</Button>
				)}
				{uttrekk.status === UttrekkStatus.FEILET && uttrekk.feilmelding && (
					<ModalButton
						renderButton={() => (
							<Button icon={<WarningIcon />} size="small">
								Vis feilmelding
							</Button>
						)}
						renderModal={({ open, closeModal }) => (
							<Modal header={{ heading: 'Feil ved kjøring av uttrekk' }} open={open} onClose={closeModal}>
								Feilmelding: <pre>{uttrekk.feilmelding}</pre>
							</Modal>
						)}
					/>
				)}
			</Table.DataCell>
		</Table.Row>
	);
}

export function UttrekkForLagretSøk({ lagretSøkId, lagretSøkTittel }: UttrekkForLagretSøkProps) {
	const { data: uttrekk, isLoading, isError } = useHentUttrekkForLagretSøk(lagretSøkId);

	if (isError) {
		return (
			<Alert variant="error" className="my-4">
				Kunne ikke hente uttrekk. Prøv å oppfrisk siden.
			</Alert>
		);
	}

	return (
		<div className="p-4 bg-gray-50">
			<div className="flex justify-between items-center mb-4">
				<Heading size="small">Uttrekk</Heading>
				<ModalButton
					renderButton={({ openModal }) => (
						<Button icon={<PlayIcon />} variant="primary" size="small" onClick={openModal}>
							Gjør et nytt uttrekk
						</Button>
					)}
					renderModal={({ open, closeModal }) => (
						<OpprettUttrekkModal
							lagretSøkId={lagretSøkId}
							lagretSøkTittel={lagretSøkTittel}
							open={open}
							closeModal={closeModal}
						/>
					)}
				/>
			</div>

			{isLoading ? (
				<Skeleton variant="rectangle" height={100} />
			) : uttrekk && uttrekk.length > 0 ? (
				<Table size="small">
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeader scope="col">Status</Table.ColumnHeader>
							<Table.ColumnHeader scope="col">Antall</Table.ColumnHeader>
							<Table.ColumnHeader scope="col">Opprettet</Table.ColumnHeader>
							<Table.ColumnHeader scope="col">Fullført</Table.ColumnHeader>
							<Table.ColumnHeader scope="col">Handlinger</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{uttrekk.map((u) => (
							<UttrekkRad key={u.id} uttrekk={u} lagretSøkTittel={lagretSøkTittel} />
						))}
					</Table.Body>
				</Table>
			) : (
				<BodyShort>Ingen uttrekk opprettet ennå.</BodyShort>
			)}
		</div>
	);
}
