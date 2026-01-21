import React, { useEffect, useState } from 'react';
import {
	ChevronDownIcon,
	ChevronRightIcon,
	FilesIcon,
	MagnifyingGlassIcon,
	PencilIcon,
	PlayIcon,
	TrashIcon,
} from '@navikt/aksel-icons';
import { Button, Skeleton, TextField } from '@navikt/ds-react';
import {
	FilterBeskrivelse,
	LagretSøk,
	Uttrekk,
	useEndreLagretSøk,
	useKopierLagretSøk,
	useSlettLagretSøk,
} from 'api/queries/avdelingslederQueries';
import { EndreKriterierLagretSøkModal } from 'avdelingsleder/lagredeSøk/EndreKriterierLagretSøkModal';
import { OpprettUttrekkModal } from 'avdelingsleder/lagredeSøk/uttrekk/OpprettUttrekkModal';
import { UttrekkKort } from 'avdelingsleder/lagredeSøk/uttrekk/UttrekkKort';
import ModalButton from 'sharedComponents/ModalButton';

function QueryBeskrivelseVisning({ queryBeskrivelse }: { queryBeskrivelse: FilterBeskrivelse[] }) {
	if (!queryBeskrivelse || queryBeskrivelse.length === 0) {
		return <span className="text-gray-500 italic">Ingen kriterier</span>;
	}

	return (
		<div className="flex flex-wrap gap-x-4 gap-y-0.5 text-base">
			{queryBeskrivelse.map((filter) => (
				<div className="bg-gray-200 leading-none rounded-sm p-1.5" key={filter.feltnavn}>
					<span className="font-medium text-gray-700">{filter.feltnavn}</span>: {filter.nektelse && 'Ikke '}{' '}
					{filter.verdier.join(', ')}
				</div>
			))}
		</div>
	);
}

function queryBeskrivelseToString(queryBeskrivelse: FilterBeskrivelse[]): string {
	if (!queryBeskrivelse || queryBeskrivelse.length === 0) {
		return '';
	}
	return queryBeskrivelse.map((f) => `${f.feltnavn}: ${f.verdier.join(', ')}`).join(' | ');
}

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
			onReset={(event) => {
				event.preventDefault();
				mutate({ ...lagretSøk, tittel: '' });
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
				size="small"
				autoFocus
			/>
			<Button variant="secondary" disabled={isPending} type="submit" size="small">
				Lagre
			</Button>
			{lagretSøk.tittel.length > 0 && (
				<Button variant="secondary" disabled={isPending} type="reset" size="small">
					Fjern tittel
				</Button>
			)}
			<Button variant="tertiary" disabled={isPending} type="button" onClick={ikkeIEndreModusLenger} size="small">
				Avbryt
			</Button>
		</form>
	);
}

export function LagretSøkKort({
	lagretSøk,
	antall,
	antallLoading,
	uttrekk,
}: {
	lagretSøk: LagretSøk;
	antall: number | undefined;
	antallLoading: boolean;
	uttrekk: Uttrekk[];
}) {
	const [endrerTittel, setEndrerTittel] = useState(false);
	const [expanded, setExpanded] = useState(false);
	const { mutate: kopierLagretSøk } = useKopierLagretSøk();
	const { mutate: slettLagretSøk } = useSlettLagretSøk();

	const harEgendefinertTittel = lagretSøk.tittel.length > 0;
	const harUttrekk = uttrekk.length > 0;

	return (
		<div className="rounded-md p-3 mb-2 bg-gray-50 border-solid border-1 border-gray-100">
			<div className="flex items-start justify-between gap-3">
				<div className="flex items-start gap-3 flex-1 min-w-0">
					<div className="flex-shrink-0 flex items-center pt-1">
						<MagnifyingGlassIcon aria-hidden fontSize="1.5rem" className="text-gray-600" />
					</div>
					<div>
						{endrerTittel && (
							<div className="mb-2">
								<EndreTittel lagretSøk={lagretSøk} ikkeIEndreModusLenger={() => setEndrerTittel(false)} />
							</div>
						)}
						{!endrerTittel && harEgendefinertTittel && (
							<div className="flex items-center gap-1 mb-2">
								<span className="font-medium">{lagretSøk.tittel}</span>
								<Button
									title="Endre tittel"
									size="xsmall"
									variant="tertiary"
									icon={<PencilIcon />}
									onClick={() => setEndrerTittel(true)}
								/>
							</div>
						)}
						<ModalButton
							renderButton={({ openModal }) => (
							<button
								type="button"
								className="text-left hover:bg-gray-100 rounded p-1 -m-1 cursor-pointer bg-transparent border-none w-full"
								onClick={openModal}
							>
								<QueryBeskrivelseVisning queryBeskrivelse={lagretSøk.queryBeskrivelse} />
							</button>
						)}
						renderModal={({ open, closeModal }) => (
							<EndreKriterierLagretSøkModal
								tittel="Endre lagret søk"
								lagretSøk={lagretSøk}
								open={open}
								closeModal={closeModal}
							/>
						)}
					/>
					<div className="text-md text-gray-700 mt-1.5">
						{antallLoading ? (
							<Skeleton variant="text" width={100} className="inline-block" />
						) : (
							<>
								<span className="font-medium">Antall oppgaver: </span>
								{antall ? `${antall}` : '-'}
							</>
						)}
					</div>
					</div>
				</div>
				<div className="max-w-[400px] flex gap-2 flex-shrink-0 flex-wrap justify-end">
					{!harEgendefinertTittel && !endrerTittel && (
						<Button variant="tertiary" size="small" icon={<PencilIcon />} onClick={() => setEndrerTittel(true)}>
							Sett tittel
						</Button>
					)}
					<ModalButton
						renderButton={({ openModal }) => (
							<Button icon={<PencilIcon />} variant="tertiary" size="small" onClick={openModal}>
								Endre kriterier
							</Button>
						)}
						renderModal={({ open, closeModal }) => (
							<EndreKriterierLagretSøkModal
								tittel="Endre lagret søk"
								lagretSøk={lagretSøk}
								open={open}
								closeModal={closeModal}
							/>
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
							const tittelEllerQueryBeskrivelse =
								lagretSøk.tittel || queryBeskrivelseToString(lagretSøk.queryBeskrivelse);
							kopierLagretSøk({ id: lagretSøk.id, tittel: `Kopi av: ${tittelEllerQueryBeskrivelse}` });
						}}
						icon={<FilesIcon />}
					>
						Kopier
					</Button>
					<Button variant="tertiary" size="small" onClick={() => slettLagretSøk(lagretSøk.id)} icon={<TrashIcon />}>
						Slett
					</Button>
				</div>
			</div>
			{harUttrekk && (
				<div className="mt-3">
					<Button
						variant="tertiary"
						size="small"
						onClick={() => setExpanded(!expanded)}
						icon={expanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
					>
						{expanded ? 'Skjul uttrekk' : `Vis uttrekk (${uttrekk.length})`}
					</Button>
					{expanded && (
						<div className="ml-4 mt-2 border-l-2 border-gray-200 pl-4">
							{uttrekk.map((u) => (
								<UttrekkKort key={u.id} uttrekk={u} />
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
