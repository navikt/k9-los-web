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
import { BodyShort, Button, Loader, Modal } from '@navikt/ds-react';
import apiPaths from 'api/apiPaths';
import { Uttrekk, UttrekkStatus, useSlettUttrekk } from 'api/queries/avdelingslederQueries';
import { UttrekkResultatModal } from 'avdelingsleder/lagredeSøk/uttrekk/UttrekkResultatModal';
import KøKriterieViewer from 'filter/KøKriterieViewer';
import { useInterval } from 'hooks/UseInterval';
import ModalButton from 'sharedComponents/ModalButton';
import { assertNever } from 'utils/assert-never';
import { calculateDuration, dateTimeSecondsFormat } from 'utils/dateUtils';

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
			return assertNever(uttrekk.status);
	}
}

function getStatusColor(status: UttrekkStatus): string {
	switch (status) {
		case UttrekkStatus.OPPRETTET:
			return 'bg-orange-100 text-orange-800';
		case UttrekkStatus.KJØRER:
			return 'bg-blue-100 text-blue-800';
		case UttrekkStatus.FEILET:
			return 'bg-red-100 text-red-800';
		case UttrekkStatus.FULLFØRT:
			return 'bg-gray-50 text-gray-700 border-solid border-1 border-gray-100';
		default:
			return assertNever(status);
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
			return assertNever(status);
	}
}

export function UttrekkKort({ uttrekk }: { uttrekk: Uttrekk }) {
	const [kjøretid, setKjøretid] = useState('');
	const oppdaterKjøretid = () => setKjøretid(calculateDuration(uttrekk.startetTidspunkt, uttrekk.fullførtTidspunkt));

	const { mutate: slettUttrekk } = useSlettUttrekk();

	// Oppdater kjøretid ved statusendring og hvert sekund hvis uttrekket kjører
	useEffect(oppdaterKjøretid, [uttrekk.status]);
	useInterval(oppdaterKjøretid, uttrekk.status === UttrekkStatus.KJØRER ? 1000 : null);

	const kanLasteNed =
		uttrekk.status === UttrekkStatus.FULLFØRT &&
		uttrekk.typeKjøring === 'OPPGAVER' &&
		uttrekk.antall !== null &&
		uttrekk.antall > 0;
	const kanSlette = uttrekk.status !== UttrekkStatus.KJØRER;
	const kanViseFeilmelding = uttrekk.status === UttrekkStatus.FEILET && uttrekk.feilmelding;

	return (
		<div className={`rounded-md p-2 pl-3 mb-2 ${getStatusColor(uttrekk.status)}`}>
			<div className="flex items-center justify-between gap-3">
				<div className="flex items-center gap-3 flex-1">
					<div className="flex-shrink-0">{getStatusIcon(uttrekk.status)}</div>
					<div className="flex-1">
						<div>{getStatusText(uttrekk)}</div>
						<div className="text-sm flex gap-2 mt-0.5">
							<span className="truncate max-w-80">
								<strong>Lagret søk:</strong> {uttrekk.tittel}
							</span>
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
							<Button
								as="a"
								size="small"
								variant="tertiary"
								href={apiPaths.lastNedUttrekkCsv(uttrekk.id.toString())}
								icon={<DownloadIcon />}
							>
								Last ned CSV
							</Button>
						</>
					)}
					{kanViseFeilmelding && (
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
