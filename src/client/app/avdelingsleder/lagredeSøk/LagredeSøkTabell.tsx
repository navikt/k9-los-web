import React, { useEffect, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { FilesIcon, MagnifyingGlassIcon, PencilIcon, PlayIcon, TrashIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, Skeleton, TextField } from '@navikt/ds-react';
import apiPaths from 'api/apiPaths';
import { LagretSøk, useEndreLagretSøk, useKopierLagretSøk, useSlettLagretSøk } from 'api/queries/avdelingslederQueries';
import { EndreKriterierLagretSøkModal } from 'avdelingsleder/lagredeSøk/EndreKriterierLagretSøkModal';
import { OpprettUttrekkModal } from 'avdelingsleder/lagredeSøk/uttrekk/OpprettUttrekkModal';
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
		if (isError) {
			setFeilmelding('Noe gikk galt ved lagring av søk. Prøv å oppfrisk siden.');
		}
	}, [isError]);

	return (
		<form
			className="flex gap-2 items-start"
			onSubmit={(event) => {
				event.preventDefault();
				mutate({ ...lagretSøk, tittel });
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

function LagretSøkKort({
	lagretSøk,
	queryBeskrivelse,
	queryBeskrivelseLoading,
	antall,
	antallLoading,
}: {
	lagretSøk: LagretSøk;
	queryBeskrivelse: string;
	queryBeskrivelseLoading: boolean;
	antall: number | undefined;
	antallLoading: boolean;
}) {
	const [endrerTittel, setEndrerTittel] = useState(false);
	const { mutate: kopierLagretSøk } = useKopierLagretSøk();
	const { mutate: slettLagretSøk } = useSlettLagretSøk();
	const { mutate: endreLagretSøk } = useEndreLagretSøk();

	const harEgendefinertTittel = lagretSøk.tittel.length > 0;

	return (
		<div className="rounded-md p-3 mb-2 bg-gray-50 border border-gray-200">
			<div className="flex items-start justify-between gap-3">
				<div className="flex items-start gap-3 flex-1 min-w-0">
					<div className="flex-shrink-0 mt-0.5">
						<MagnifyingGlassIcon aria-hidden fontSize="1.5rem" className="text-gray-600" />
					</div>
					<div className="flex-1 min-w-0">
						{endrerTittel ? (
							<EndreTittel lagretSøk={lagretSøk} ikkeIEndreModusLenger={() => setEndrerTittel(false)} />
						) : (
							<>
								{harEgendefinertTittel && (
									<div className="flex items-center gap-1 mb-1">
										<span className="font-semibold truncate">{lagretSøk.tittel}</span>
										<Button
											title="Endre tittel"
											size="xsmall"
											variant="tertiary"
											icon={<PencilIcon />}
											onClick={() => setEndrerTittel(true)}
										/>
										<Button
											title="Fjern egendefinert tittel"
											size="xsmall"
											variant="tertiary"
											icon={<XMarkIcon />}
											onClick={() => endreLagretSøk({ ...lagretSøk, tittel: '' })}
										/>
									</div>
								)}
								<div className="flex items-center gap-1">
									{queryBeskrivelseLoading ? (
										<Skeleton variant="text" width={300} />
									) : (
										<span className={harEgendefinertTittel ? 'text-sm text-gray-600' : ''}>
											{queryBeskrivelse || 'Ingen kriterier satt'}
										</span>
									)}
									{!harEgendefinertTittel && (
										<Button
											title="Legg til egendefinert tittel"
											size="xsmall"
											variant="tertiary"
											icon={<PencilIcon />}
											onClick={() => setEndrerTittel(true)}
										/>
									)}
								</div>
							</>
						)}
						<div className="text-sm text-gray-600 mt-1 flex gap-4">
							<span>
								<strong>Antall:</strong>{' '}
								{antallLoading ? <Skeleton variant="text" width={30} className="inline-block" /> : (antall ?? '-')}
							</span>
							<span>
								<strong>Sist endret:</strong> {dateFormat(lagretSøk.sistEndret)}
							</span>
						</div>
					</div>
				</div>
				<div className="flex gap-2 flex-shrink-0">
					<ModalButton
						renderButton={({ openModal }) => (
							<Button icon={<PencilIcon />} variant="tertiary" size="small" onClick={openModal}>
								Endre
							</Button>
						)}
						renderModal={({ open, closeModal }) => (
							<EndreKriterierLagretSøkModal lagretSøk={lagretSøk} open={open} closeModal={closeModal} />
						)}
					/>
					<ModalButton
						renderButton={({ openModal }) => (
							<Button icon={<PlayIcon />} variant="tertiary" size="small" onClick={openModal}>
								Gjør uttrekk
							</Button>
						)}
						renderModal={({ open, closeModal }) => (
							<OpprettUttrekkModal lagretSøk={lagretSøk} open={open} closeModal={closeModal} />
						)}
					/>
					<Button
						variant="tertiary"
						size="small"
						onClick={() => {
							const visTittel = lagretSøk.tittel || queryBeskrivelse;
							kopierLagretSøk({ id: lagretSøk.id, tittel: `Kopi av: ${visTittel}` });
						}}
						icon={<FilesIcon />}
					>
						Kopier
					</Button>
					<Button
						variant="tertiary"
						size="small"
						onClick={() => slettLagretSøk(lagretSøk.id)}
						icon={<TrashIcon />}
					>
						Slett
					</Button>
				</div>
			</div>
		</div>
	);
}

export function LagredeSøkTabell(props: { lagredeSøk: LagretSøk[] }) {
	const antallQueries = useQueries({
		queries: props.lagredeSøk.map((søk) => ({
			queryKey: [apiPaths.hentAntallLagretSøk(søk.id.toString())],
			queryFn: () =>
				axiosInstance.get(apiPaths.hentAntallLagretSøk(søk.id.toString())).then((response) => response.data),
		})),
	});

	const queryBeskrivelseQueries = useQueries({
		queries: props.lagredeSøk.map((søk) => ({
			queryKey: [apiPaths.hentQueryBeskrivelse(søk.id.toString())],
			queryFn: () =>
				axiosInstance.get<string>(apiPaths.hentQueryBeskrivelse(søk.id.toString())).then((response) => response.data),
		})),
	});

	return (
		<div>
			{props.lagredeSøk.map((lagretSøk, index) => (
				<LagretSøkKort
					key={lagretSøk.id}
					lagretSøk={lagretSøk}
					queryBeskrivelse={queryBeskrivelseQueries[index]?.data ?? ''}
					queryBeskrivelseLoading={queryBeskrivelseQueries[index]?.isLoading ?? false}
					antall={antallQueries[index]?.data}
					antallLoading={antallQueries[index]?.isLoading ?? false}
				/>
			))}
		</div>
	);
}
