import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import {
	CalculatorIcon,
	ClockDashedIcon,
	DownloadIcon,
	ExclamationmarkTriangleIcon,
	InformationSquareIcon,
	TableIcon,
	TasklistIcon,
	TrashIcon,
} from '@navikt/aksel-icons';
import { BodyShort, Button, Loader, Modal } from '@navikt/ds-react';
import apiPaths from 'api/apiPaths';
import { LagretSøk, Uttrekk, UttrekkStatus, useSlettUttrekk } from 'api/queries/avdelingslederQueries';
import { UttrekkResultatDialog } from 'avdelingsleder/lagredeSøk/uttrekk/UttrekkResultatDialog';
import KøKriterieViewer from 'filter/KøKriterieViewer';
import { OppgaveQuery } from 'filter/filterTsTypes';
import { useInterval } from 'hooks/UseInterval';
import ModalButton from 'sharedComponents/ModalButton';
import { assertNever } from 'utils/assert-never';
import { calculateDuration, dateTimeSecondsFormat } from 'utils/dateUtils';

function utledUttrekkType(query: OppgaveQuery): 'antall' | 'gruppert' | 'oppgaver' {
	const harAggregert = query.select.some((s) => s.type === 'aggregert');
	const harEnkel = query.select.some((s) => s.type === 'enkel');
	if (harAggregert && harEnkel) return 'gruppert';
	if (harAggregert) return 'antall';
	return 'oppgaver';
}

function getStatusText(uttrekk: Uttrekk): React.ReactNode {
	const type = utledUttrekkType(uttrekk.query);
	const typeLabel = type === 'antall' ? 'Antall' : type === 'gruppert' ? 'Gruppert' : 'Oppgaver';
	switch (uttrekk.status) {
		case UttrekkStatus.OPPRETTET:
			return <>{typeLabel} &ndash; Venter på å kjøre</>;
		case UttrekkStatus.KJØRER:
			return <>{typeLabel} &ndash; Kjører nå</>;
		case UttrekkStatus.FULLFØRT:
			return (
				<>
					{typeLabel} &ndash; <span className="font-medium">{type === 'antall' ? 'Resultat:' : 'Antall rader:'} </span>
					{uttrekk.antall}
				</>
			);
		case UttrekkStatus.FEILET:
			return <>{typeLabel} &ndash; Feilet</>;
		default:
			return assertNever(uttrekk.status);
	}
}

function getStatusColor(status: UttrekkStatus): string {
	switch (status) {
		case UttrekkStatus.OPPRETTET:
			return 'bg-ax-warning-200 text-ax-warning-900';
		case UttrekkStatus.KJØRER:
			return 'bg-ax-accent-200 text-ax-accent-900';
		case UttrekkStatus.FEILET:
			return 'bg-ax-danger-200 text-ax-danger-900';
		case UttrekkStatus.FULLFØRT:
			return 'bg-ax-neutral-300 text-ax-neutral-800';
		default:
			return assertNever(status);
	}
}

function getStatusIcon(uttrekk: Uttrekk) {
	switch (uttrekk.status) {
		case UttrekkStatus.OPPRETTET:
			return <ClockDashedIcon aria-hidden fontSize="1.5rem" />;
		case UttrekkStatus.KJØRER:
			return <Loader size="medium" />;
		case UttrekkStatus.FULLFØRT: {
			const type = utledUttrekkType(uttrekk.query);
			return type === 'antall' ? (
				<CalculatorIcon aria-hidden fontSize="1.5rem" />
			) : (
				<TableIcon aria-hidden fontSize="1.5rem" />
			);
		}
		case UttrekkStatus.FEILET:
			return <ExclamationmarkTriangleIcon aria-hidden fontSize="1.5rem" />;
		default:
			return assertNever(uttrekk.status);
	}
}

export function UttrekkKort({ uttrekk, lagretSøk }: { uttrekk: Uttrekk; lagretSøk?: LagretSøk }) {
	const [kjøretid, setKjøretid] = useState('');
	const oppdaterKjøretid = () => setKjøretid(calculateDuration(uttrekk.startetTidspunkt, uttrekk.fullførtTidspunkt));

	const { mutate: slettUttrekk } = useSlettUttrekk();

	// Oppdater kjøretid ved statusendring og hvert sekund hvis uttrekket kjører
	useEffect(oppdaterKjøretid, [uttrekk.status]);
	useInterval(oppdaterKjøretid, uttrekk.status === UttrekkStatus.KJØRER ? 1000 : null);

	const kriterierErForskjellige = !_.isEqual(uttrekk.query.filtere, lagretSøk?.query.filtere);

	const kanLasteNed = uttrekk.status === UttrekkStatus.FULLFØRT && uttrekk.antall !== null && uttrekk.antall > 0;
	const kanSlette = uttrekk.status !== UttrekkStatus.KJØRER;
	const kanViseFeilmelding = uttrekk.status === UttrekkStatus.FEILET && uttrekk.feilmelding;

	return (
		<div className={`rounded-md py-2 px-3 mb-2 ${getStatusColor(uttrekk.status)}`}>
			<div className="flex items-center justify-between gap-3">
				<div className="flex items-center gap-3 flex-1">
					<div className="flex-shrink-0 flex items-center">{getStatusIcon(uttrekk)}</div>
					<div className="flex items-center gap-3">
						<div>{getStatusText(uttrekk)}</div>
						<div className="text-sm text-ax-neutral-700">
							{dateTimeSecondsFormat(uttrekk.opprettetTidspunkt)}
							{uttrekk.status === UttrekkStatus.KJØRER || uttrekk.status === UttrekkStatus.FEILET ? (
								<span> (kjøretid {kjøretid})</span>
							) : null}
						</div>
					</div>
				</div>
				<div className="flex items-center gap-1 flex-shrink-0">
					{kriterierErForskjellige && (
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
					)}
					{kanLasteNed && (
						<>
							<UttrekkResultatDialog uttrekk={uttrekk} />
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
										<pre className="mt-2 p-2 bg-ax-neutral-200 rounded overflow-auto">{uttrekk.feilmelding}</pre>
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
