import React, { useEffect, useState } from 'react';
import {
	CheckmarkCircleIcon,
	ClockDashedIcon,
	DownloadIcon,
	ExclamationmarkTriangleIcon,
	PlayIcon,
	TrashIcon,
} from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, Heading, Loader, Modal, Skeleton } from '@navikt/ds-react';
import apiPaths from 'api/apiPaths';
import {
	LagretSøk,
	Uttrekk,
	UttrekkStatus,
	useHentUttrekkForLagretSøk,
	useSlettUttrekk,
} from 'api/queries/avdelingslederQueries';
import { OpprettUttrekkModal } from 'avdelingsleder/lagredeSøk/OpprettUttrekkModal';
import ModalButton from 'sharedComponents/ModalButton';
import { dateTimeFormat } from 'utils/dateUtils';
import { axiosInstance } from 'utils/reactQueryConfig';

interface UttrekkForLagretSøkProps {
	lagretSøk: LagretSøk;
}

function getStatusText(status: UttrekkStatus): string {
	switch (status) {
		case UttrekkStatus.OPPRETTET:
			return 'Venter i kø';
		case UttrekkStatus.KJØRER:
			return 'Kjører nå';
		case UttrekkStatus.FULLFØRT:
			return 'Fullført';
		case UttrekkStatus.FEILET:
			return 'Feilet';
		default:
			return status;
	}
}

function getStatusColor(status: UttrekkStatus): string {
	switch (status) {
		case UttrekkStatus.OPPRETTET:
			return 'bg-orange-100 text-orange-800 border-orange-300';
		case UttrekkStatus.KJØRER:
			return 'bg-blue-100 text-blue-800 border-blue-300';
		case UttrekkStatus.FULLFØRT:
			return 'bg-green-100 text-green-800 border-green-300';
		case UttrekkStatus.FEILET:
			return 'bg-red-100 text-red-800 border-red-300';
		default:
			return 'bg-gray-100 text-gray-800 border-gray-300';
	}
}

function getStatusIcon(status: UttrekkStatus) {
	switch (status) {
		case UttrekkStatus.OPPRETTET:
			return <ClockDashedIcon aria-hidden fontSize="1.5rem" />;
		case UttrekkStatus.KJØRER:
			return <Loader size="medium" />;
		case UttrekkStatus.FULLFØRT:
			return <CheckmarkCircleIcon aria-hidden fontSize="1.5rem" />;
		case UttrekkStatus.FEILET:
			return <ExclamationmarkTriangleIcon aria-hidden fontSize="1.5rem" />;
		default:
			return null;
	}
}

function formatDuration(milliseconds: number): string {
	const seconds = Math.floor(milliseconds / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);

	if (hours > 0) {
		return `${hours} t ${minutes % 60} min`;
	}
	if (minutes > 0) {
		return `${minutes} min ${seconds % 60} sek`;
	}
	return `${seconds} sek`;
}

function calculateDuration(startTime: string | null, endTime: string | null, currentTime?: number): string | null {
	if (!startTime) return null;

	const start = new Date(startTime).getTime();
	const end = endTime ? new Date(endTime).getTime() : currentTime || Date.now();

	return formatDuration(end - start);
}

function UttrekkKort({ uttrekk, lagretSøk }: { uttrekk: Uttrekk; lagretSøk: LagretSøk }) {
	const [lasterNed, setLasterNed] = useState(false);
	const [currentTime, setCurrentTime] = useState(Date.now());
	const { mutate: slettUttrekk } = useSlettUttrekk();

	// Oppdater currentTime hvert sekund for aktive uttrekk
	useEffect(() => {
		if (uttrekk.status === UttrekkStatus.KJØRER) {
			const interval = setInterval(() => {
				setCurrentTime(Date.now());
			}, 1000);
			return () => clearInterval(interval);
		}
		return undefined;
	}, [uttrekk.status]);

	const lastNedCsv = async () => {
		setLasterNed(true);
		try {
			const response = await axiosInstance.get(apiPaths.lastNedUttrekkCsv(uttrekk.id.toString()), {
				responseType: 'blob',
			});

			const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			const filnavn = `${lagretSøk.tittel.replace(/[^a-z0-9]/gi, '_')}_${uttrekk.typeKjøring}_${uttrekk.id}.csv`;
			link.setAttribute('download', filnavn);
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.URL.revokeObjectURL(url);
		} catch (error) {
			// eslint-disable-next-line no-console
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

	const kanSlette = uttrekk.status !== UttrekkStatus.KJØRER;

	const kjøretid = calculateDuration(
		uttrekk.startetTidspunkt || uttrekk.opprettetTidspunkt,
		uttrekk.fullførtTidspunkt,
		currentTime,
	);

	return (
		<div className={`rounded-lg border-2 p-4 mb-3 ${getStatusColor(uttrekk.status)}`}>
			<div className="flex items-start justify-between gap-4">
				<div className="flex items-center gap-3 flex-1">
					<div className="flex-shrink-0">{getStatusIcon(uttrekk.status)}</div>
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-1">
							<span className="font-semibold text-lg">{getStatusText(uttrekk.status)}</span>
							{uttrekk.antall !== null && (
								<span className="text-sm">
									· <strong>{uttrekk.antall}</strong> oppgaver
								</span>
							)}
						</div>
						<div className="text-sm">
							{kjøretid && (
								<>
									<strong>Kjøretid:</strong> {kjøretid}
								</>
							)}
							{!kjøretid && uttrekk.status === UttrekkStatus.OPPRETTET && (
								<>
									<strong>Opprettet:</strong> {dateTimeFormat(uttrekk.opprettetTidspunkt)}
								</>
							)}
						</div>
					</div>
				</div>
				<div className="flex gap-2 flex-shrink-0">
					{kanLasteNed && (
						<Button size="small" variant="secondary" icon={<DownloadIcon />} onClick={lastNedCsv} loading={lasterNed}>
							Last ned CSV
						</Button>
					)}
					{uttrekk.status === UttrekkStatus.FEILET && uttrekk.feilmelding && (
						<ModalButton
							renderButton={() => (
								<Button icon={<ExclamationmarkTriangleIcon />} size="small" variant="secondary">
									Vis feilmelding
								</Button>
							)}
							renderModal={({ open, closeModal }) => (
								<Modal header={{ heading: 'Feil ved kjøring av uttrekk' }} open={open} onClose={closeModal}>
									<BodyShort>
										<strong>Feilmelding:</strong>
									</BodyShort>
									<pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">{uttrekk.feilmelding}</pre>
								</Modal>
							)}
						/>
					)}
					{kanSlette && (
						<Button
							size="small"
							variant="tertiary"
							icon={<TrashIcon />}
							onClick={() => slettUttrekk(uttrekk)}
							title="Slett uttrekk"
						>
							Slett
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}

export function UttrekkForLagretSøk({ lagretSøk }: UttrekkForLagretSøkProps) {
	const { data: uttrekk, isLoading, isError } = useHentUttrekkForLagretSøk(lagretSøk.id);

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
						<OpprettUttrekkModal lagretSøk={lagretSøk} open={open} closeModal={closeModal} />
					)}
				/>
			</div>

			{isLoading ? (
				<Skeleton variant="rectangle" height={100} />
			) : uttrekk && uttrekk.length > 0 ? (
				<div>
					{uttrekk.map((u) => (
						<UttrekkKort key={u.id} uttrekk={u} lagretSøk={lagretSøk} />
					))}
				</div>
			) : (
				<BodyShort>Ingen uttrekk opprettet ennå.</BodyShort>
			)}
		</div>
	);
}
