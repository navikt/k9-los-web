import React from 'react';
import { DownloadIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, Heading, Skeleton, Table } from '@navikt/ds-react';
import { Uttrekk, UttrekkStatus, useHentUttrekkForLagretSøk } from 'api/queries/avdelingslederQueries';
import { OpprettUttrekkModal } from 'avdelingsleder/lagredeSøk/OpprettUttrekkModal';
import ModalButton from 'sharedComponents/ModalButton';
import { dateFormat } from 'utils/dateUtils';

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

function UttrekkRad({ uttrekk }: { uttrekk: Uttrekk }) {
	return (
		<Table.Row>
			<Table.DataCell>{uttrekk.typeKjøring}</Table.DataCell>
			<Table.DataCell>
				<span className={`px-2 py-1 rounded text-sm bg-${getStatusVariant(uttrekk.status)}-100`}>
					{getStatusText(uttrekk.status)}
				</span>
			</Table.DataCell>
			<Table.DataCell>{dateFormat(uttrekk.opprettetTidspunkt)}</Table.DataCell>
			<Table.DataCell>{uttrekk.fullførtTidspunkt ? dateFormat(uttrekk.fullførtTidspunkt) : '-'}</Table.DataCell>
			<Table.DataCell>
				{uttrekk.status === UttrekkStatus.FULLFØRT && (
					<Button size="small" variant="tertiary" icon={<DownloadIcon />} disabled>
						Last ned (ikke implementert)
					</Button>
				)}
				{uttrekk.status === UttrekkStatus.FEILET && uttrekk.feilmelding && (
					<BodyShort size="small" className="text-red-600">
						{uttrekk.feilmelding}
					</BodyShort>
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
						<Button icon={<DownloadIcon />} variant="primary" size="small" onClick={openModal}>
							Opprett nytt uttrekk
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
							<Table.ColumnHeader scope="col">Type</Table.ColumnHeader>
							<Table.ColumnHeader scope="col">Status</Table.ColumnHeader>
							<Table.ColumnHeader scope="col">Opprettet</Table.ColumnHeader>
							<Table.ColumnHeader scope="col">Fullført</Table.ColumnHeader>
							<Table.ColumnHeader scope="col">Handlinger</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{uttrekk.map((u) => (
							<UttrekkRad key={u.id} uttrekk={u} />
						))}
					</Table.Body>
				</Table>
			) : (
				<BodyShort>Ingen uttrekk opprettet ennå.</BodyShort>
			)}
		</div>
	);
}
