import React, { useContext, useEffect, useState } from 'react';
import {
	ChevronDownIcon,
	ChevronRightIcon,
	FilesIcon,
	FilterIcon,
	MagnifyingGlassIcon,
	PencilIcon,
	PlayIcon,
	SortDownIcon,
	TableIcon,
	TrashIcon,
} from '@navikt/aksel-icons';
import { Button, Skeleton, TextField } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
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
import {
	FilterBeskrivelse as FilterBeskrivelseType,
	OrderBeskrivelse,
	SelectBeskrivelse,
	utledFilterBeskrivelse,
	utledOrderBeskrivelse,
	utledSelectBeskrivelse,
} from 'filter/queryBeskrivelseUtils';
import ModalButton from 'sharedComponents/ModalButton';

function QueryBoks({
	ikon,
	tittel,
	tomTekst,
	endreKnappTekst,
	lagretSøk,
	modalTab,
	className,
	children,
}: {
	ikon: React.ReactNode;
	tittel: string;
	tomTekst: string;
	endreKnappTekst: string;
	lagretSøk: LagretSøk;
	modalTab?: 'kriterier' | 'felter' | 'sortering';
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<div className={`bg-gray-100 rounded-md p-2 border-solid border-1 border-gray-200 ${className || ''}`}>
			<div className="flex justify-between items-center gap-2">
				<span className="text-sm font-medium text-gray-600">
					{ikon} {tittel}
				</span>
				<ModalButton
					renderButton={({ openModal }) => (
						<Button variant="tertiary" size="xsmall" onClick={openModal}>
							{endreKnappTekst}
						</Button>
					)}
					renderModal={({ open, closeModal }) => (
						<EndreKriterierLagretSøkModal
							modalTab={modalTab}
							tittel={`${tittel} for lagret søk`}
							lagretSøk={lagretSøk}
							open={open}
							closeModal={closeModal}
						/>
					)}
				/>
			</div>
			{children || <p className="text-gray-500 italic mt-1">{tomTekst}</p>}
		</div>
	);
}

function KriterierBoks({
	queryBeskrivelse,
	lagretSøk,
}: {
	queryBeskrivelse: FilterBeskrivelseType[];
	lagretSøk: LagretSøk;
}) {
	return (
		<QueryBoks
			ikon={<FilterIcon />}
			tittel="Kriterier"
			tomTekst="Ingen kriterier"
			endreKnappTekst="Endre"
			lagretSøk={lagretSøk}
			modalTab="kriterier"
			className="w-1/2"
		>
			{queryBeskrivelse && queryBeskrivelse.length > 0 && (
				<div className="flex flex-col gap-0.5 text-base mt-1">
					{queryBeskrivelse.map((filter) => (
						<div className="leading-normal" key={filter.feltnavn}>
							<span className="font-bold text-gray-700">{filter.feltnavn}</span>: {filter.nektelse && 'Ikke '}
							{filter.verdier.join(', ')}
						</div>
					))}
				</div>
			)}
		</QueryBoks>
	);
}

function FelterBoks({
	selectBeskrivelse,
	lagretSøk,
}: {
	selectBeskrivelse: SelectBeskrivelse[];
	lagretSøk: LagretSøk;
}) {
	return (
		<QueryBoks
			ikon={<TableIcon />}
			tittel="Felter"
			tomTekst="Ingen felter valgt"
			endreKnappTekst="Endre"
			lagretSøk={lagretSøk}
			modalTab="felter"
			className="w-1/4"
		>
			{selectBeskrivelse && selectBeskrivelse.length > 0 && (
				<div className="flex flex-col gap-0.5 text-base mt-1">
					{selectBeskrivelse.map((select) => (
						<div className="leading-normal" key={select.feltnavn}>
							{select.feltnavn}
						</div>
					))}
				</div>
			)}
		</QueryBoks>
	);
}

function SorteringBoks({
	orderBeskrivelse,
	lagretSøk,
}: {
	orderBeskrivelse: OrderBeskrivelse[];
	lagretSøk: LagretSøk;
}) {
	return (
		<QueryBoks
			ikon={<SortDownIcon />}
			tittel="Sortering"
			tomTekst="Ingen sortering"
			endreKnappTekst="Endre"
			lagretSøk={lagretSøk}
			modalTab="sortering"
			className="w-1/4"
		>
			{orderBeskrivelse && orderBeskrivelse.length > 0 && (
				<div className="flex flex-col gap-0.5 text-base mt-1">
					{orderBeskrivelse.map((order) => (
						<div className="leading-normal" key={order.feltnavn}>
							{order.feltnavn} ({order.økende ? 'stigende' : 'synkende'})
						</div>
					))}
				</div>
			)}
		</QueryBoks>
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
	const { felter } = useContext(AppContext);
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
						<div className="flex gap-2">
							<KriterierBoks queryBeskrivelse={utledFilterBeskrivelse(lagretSøk.query, felter)} lagretSøk={lagretSøk} />
							<FelterBoks selectBeskrivelse={utledSelectBeskrivelse(lagretSøk.query, felter)} lagretSøk={lagretSøk} />
							<SorteringBoks orderBeskrivelse={utledOrderBeskrivelse(lagretSøk.query, felter)} lagretSøk={lagretSøk} />
						</div>
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
