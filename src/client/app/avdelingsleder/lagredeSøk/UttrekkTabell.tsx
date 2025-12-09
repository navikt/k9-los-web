import React, { useEffect, useState } from 'react';
import {
	CheckmarkCircleIcon,
	ClockDashedIcon,
	DownloadIcon,
	ExclamationmarkTriangleIcon,
	EyeIcon,
	InformationSquareIcon,
	TasklistIcon,
	TrashIcon,
} from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, Heading, Loader, Modal, Pagination, Skeleton, Table } from '@navikt/ds-react';
import apiPaths from 'api/apiPaths';
import {
	Uttrekk,
	UttrekkResultatCelle,
	UttrekkStatus,
	useHentAlleUttrekk,
	useHentUttrekkResultat,
	useSlettUttrekk,
} from 'api/queries/avdelingslederQueries';
import KøKriterieViewer from 'filter/KøKriterieViewer';
import { useInterval } from 'hooks/UseInterval';
import ModalButton from 'sharedComponents/ModalButton';
import { calculateDuration, dateTimeSecondsFormat } from 'utils/dateUtils';
import { axiosInstance } from 'utils/reactQueryConfig';

function getStatusText(uttrekk: Uttrekk): React.ReactNode {
	switch (uttrekk.status) {
		case UttrekkStatus.OPPRETTET:
			return 'Venter på å kjøre';
		case UttrekkStatus.KJØRER:
			return 'Kjører nå';
		case UttrekkStatus.FULLFØRT:
			return <span>{uttrekk.antall} oppgaver</span>;
		case UttrekkStatus.FEILET:
			return 'Feilet';
		default:
			return uttrekk.status;
	}
}

function getStatusColor(status: UttrekkStatus): string {
	switch (status) {
		case UttrekkStatus.OPPRETTET:
			return 'bg-orange-100 text-orange-800';
		case UttrekkStatus.KJØRER:
			return 'bg-blue-100 text-blue-800';
		case UttrekkStatus.FULLFØRT:
			return 'bg-gray-50 text-gray-700 border-solid border-1 border-gray-100';
		case UttrekkStatus.FEILET:
			return 'bg-red-100 text-red-800';
		default:
			return 'bg-gray-50 text-gray-700';
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

const PAGE_SIZE = 20;

function formatCelleVerdi(verdi: unknown): string {
	if (verdi === null || verdi === undefined) {
		return '';
	}
	if (typeof verdi === 'boolean') {
		return verdi ? 'Ja' : 'Nei';
	}
	return String(verdi);
}

function UttrekkResultatModal({ uttrekk, open, closeModal }: { uttrekk: Uttrekk; open: boolean; closeModal: () => void }) {
	const [page, setPage] = useState(1);
	const offset = (page - 1) * PAGE_SIZE;

	const { data, isLoading, isError } = useHentUttrekkResultat(uttrekk.id, offset, PAGE_SIZE, open);

	const totalPages = data ? Math.ceil(data.totaltAntall / PAGE_SIZE) : 1;

	// Bygg kolonner fra første rad
	const kolonner: { kode: string; område: string | null }[] = [];
	if (data && data.rader.length > 0) {
		data.rader[0].forEach((celle: UttrekkResultatCelle) => {
			kolonner.push({ kode: celle.kode, område: celle.område });
		});
	}

	return (
		<Modal
			closeOnBackdropClick
			header={{ heading: `Resultat av uttrekk (${data?.totaltAntall ?? '...'} rader)` }}
			width="90vw"
			open={open}
			onClose={closeModal}
		>
			<Modal.Body>
				{isLoading && (
					<div className="flex justify-center p-8">
						<Loader size="xlarge" />
					</div>
				)}
				{isError && (
					<Alert variant="error">Kunne ikke hente resultat. Prøv igjen.</Alert>
				)}
				{data && data.rader.length > 0 && (
					<>
						<div className="overflow-x-auto">
							<Table size="small">
								<Table.Header>
									<Table.Row>
										{kolonner.map((kolonne, idx) => (
											<Table.HeaderCell key={idx}>
												{kolonne.område ? `${kolonne.område}: ${kolonne.kode}` : kolonne.kode}
											</Table.HeaderCell>
										))}
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{data.rader.map((rad, radIdx) => (
										<Table.Row key={radIdx}>
											{rad.map((celle, celleIdx) => (
												<Table.DataCell key={celleIdx}>
													{formatCelleVerdi(celle.verdi)}
												</Table.DataCell>
											))}
										</Table.Row>
									))}
								</Table.Body>
							</Table>
						</div>
						{totalPages > 1 && (
							<div className="flex justify-center mt-4">
								<Pagination
									page={page}
									onPageChange={setPage}
									count={totalPages}
									size="small"
								/>
							</div>
						)}
					</>
				)}
				{data && data.rader.length === 0 && (
					<BodyShort>Ingen rader i uttrekket.</BodyShort>
				)}
			</Modal.Body>
		</Modal>
	);
}

function UttrekkKort({ uttrekk }: { uttrekk: Uttrekk }) {
	const [lasterNed, setLasterNed] = useState(false);

	const [kjøretid, setKjøretid] = useState('');
	const oppdaterKjøretid = () => setKjøretid(calculateDuration(uttrekk.startetTidspunkt, uttrekk.fullførtTidspunkt));

	const { mutate: slettUttrekk } = useSlettUttrekk();

	// Oppdater kjøretid ved statusendring og hvert sekund hvis uttrekket kjører
	useEffect(oppdaterKjøretid, [uttrekk.status]);
	useInterval(oppdaterKjøretid, uttrekk.status === UttrekkStatus.KJØRER ? 1000 : null);

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
			const filnavn = `uttrekk_${uttrekk.typeKjøring}_${uttrekk.id}.csv`;
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

	return (
		<div className={`rounded-md p-2 pl-3 mb-2 ${getStatusColor(uttrekk.status)}`}>
			<div className="flex items-center justify-between gap-3">
				<div className="flex items-center gap-3 flex-1">
					<div className="flex-shrink-0">{getStatusIcon(uttrekk.status)}</div>
					<div className="flex-1">
						<div>{getStatusText(uttrekk)}</div>
						<div className="text-sm flex gap-2 mt-0.5">
							<span>
								<strong>Startet:</strong> {dateTimeSecondsFormat(uttrekk.opprettetTidspunkt)}
							</span>
							{(uttrekk.status === UttrekkStatus.KJØRER ||
								uttrekk.status === UttrekkStatus.FEILET ||
								uttrekk.status === UttrekkStatus.FULLFØRT) && (
								<span>
									<strong>Kjøretid:</strong> {kjøretid}
								</span>
							)}
						</div>
					</div>
				</div>
				<div className="flex gap-2 flex-shrink-0">
					<ModalButton
						renderButton={({ openModal }) => (
							<Button icon={<TasklistIcon />} size="small" variant="tertiary" onClick={openModal}>
								Vis kriterier
							</Button>
						)}
						renderModal={({ open, closeModal }) => (
							<Modal
								closeOnBackdropClick
								header={{ heading: 'Kriterier brukt i uttrekket' }}
								width={700}
								open={open}
								onClose={closeModal}
							>
								<BodyShort className="p-4">
									Uttrekket ble gjort med kriteriene under. Du kan ikke endre kriteriene her.
								</BodyShort>
								<KøKriterieViewer query={uttrekk.query} tittel="Kriterier" />
							</Modal>
						)}
					/>
					{kanLasteNed && (
						<>
							<ModalButton
								renderButton={({ openModal }) => (
									<Button icon={<EyeIcon />} size="small" variant="tertiary" onClick={openModal}>
										Vis resultat
									</Button>
								)}
								renderModal={({ open, closeModal }) => (
									<UttrekkResultatModal uttrekk={uttrekk} open={open} closeModal={closeModal} />
								)}
							/>
							<Button size="small" variant="tertiary" icon={<DownloadIcon />} onClick={lastNedCsv} loading={lasterNed}>
								Last ned CSV
							</Button>
						</>
					)}
					{uttrekk.status === UttrekkStatus.FEILET && uttrekk.feilmelding && (
						<ModalButton
							renderButton={({ openModal }) => (
								<Button icon={<InformationSquareIcon />} size="small" variant="tertiary" onClick={openModal}>
									Vis feilmelding
								</Button>
							)}
							renderModal={({ open, closeModal }) => (
								<Modal
									closeOnBackdropClick
									header={{ heading: 'Feil ved kjøring av uttrekk' }}
									width={700}
									open={open}
									onClose={closeModal}
								>
									<div className="p-4">
										<BodyShort>
											<strong>Feilmelding:</strong>
										</BodyShort>
										<pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">{uttrekk.feilmelding}</pre>
									</div>
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

export function UttrekkTabell() {
	const { data: uttrekk, isLoading, isError } = useHentAlleUttrekk();

	if (isError) {
		return (
			<Alert variant="error" className="my-4">
				Kunne ikke hente uttrekk. Prøv å oppfrisk siden.
			</Alert>
		);
	}

	return (
		<div className="mt-12">
			<Heading size="xsmall" className="mb-4">
				Dine uttrekk av lagrede søk
			</Heading>

			{isLoading ? (
				<Skeleton variant="rectangle" height={100} />
			) : uttrekk && uttrekk.length > 0 ? (
				<div>
					{uttrekk.map((u) => (
						<UttrekkKort key={u.id} uttrekk={u} />
					))}
				</div>
			) : (
				<BodyShort>
					<i>Ingen uttrekk opprettet ennå</i>
				</BodyShort>
			)}
		</div>
	);
}
