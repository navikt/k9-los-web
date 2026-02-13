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
	LagretSøk,
	Uttrekk,
	useEndreLagretSøk,
	useKopierLagretSøk,
	useSlettLagretSøk,
} from 'api/queries/avdelingslederQueries';
import { EndreKriterierLagretSøkModal } from 'avdelingsleder/lagredeSøk/EndreKriterierLagretSøkModal';
import { SlettLagretSøkModal } from 'avdelingsleder/lagredeSøk/SlettLagretSøkModal';
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
	lagretSøk,
	modalTab,
	className,
	children,
}: {
	ikon: React.ReactNode;
	lagretSøk: LagretSøk;
	modalTab?: 'kriterier' | 'felter' | 'sortering';
	className?: string;
	children: React.ReactNode;
}) {
	const tittel = modalTab.charAt(0).toUpperCase() + modalTab.slice(1);
	return (
		<div className={`rounded-md p-2 border-solid border-[2px] border-gray-200 ${className || ''}`}>
			<div className="flex justify-between items-center gap-2">
				<div className="text-sm text-gray-700 flex items-center gap-1 font-medium">
					{ikon} {tittel}
				</div>
				<ModalButton
					renderButton={({ openModal }) => (
						<Button variant="tertiary" size="xsmall" onClick={openModal}>
							Endre {modalTab}
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
			{children || <p className="text-gray-500 italic mt-1">Ingen {modalTab} valgt</p>}
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
		<QueryBoks ikon={<FilterIcon />} lagretSøk={lagretSøk} modalTab="kriterier" className="w-1/2">
			{queryBeskrivelse && queryBeskrivelse.length > 0 && (
				<div className="flex flex-col gap-0.5 text-base mt-1">
					{queryBeskrivelse.map((filter) => (
						<div className="leading-normal" key={filter.feltnavn}>
							<span className="font-bold text-gray-700">{filter.feltnavn}</span>:{' '}
							{filter.operatorPrefiks ?? filter.verdier.join(', ')}
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
		<QueryBoks ikon={<TableIcon />} lagretSøk={lagretSøk} modalTab="felter" className="w-1/4">
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
		<QueryBoks ikon={<SortDownIcon />} lagretSøk={lagretSøk} modalTab="sortering" className="w-1/4">
			{orderBeskrivelse && orderBeskrivelse.length > 0 && (
				<div className="flex flex-col gap-0.5 text-base mt-1">
					{orderBeskrivelse.map((order) => (
						<div className="leading-normal" key={order.feltnavn}>
							{order.feltnavn} ({order.økende ? 'økende' : 'synkende'})
						</div>
					))}
				</div>
			)}
		</QueryBoks>
	);
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
		<div className="rounded-md p-3 mb-2 bg-gray-50 border-solid border-1 border-gray-100 flex flex-col gap-2">
			{/* Rad 1: Ikon, tittel, kopier/slett-knapper */}
			<div className="w-full flex items-center justify-between gap-2">
				<div className="flex items-center gap-2 min-w-0 flex-1">
					<MagnifyingGlassIcon aria-hidden fontSize="1.5rem" className="text-gray-600 flex-shrink-0" />
					{endrerTittel ? (
						<EndreTittel lagretSøk={lagretSøk} ikkeIEndreModusLenger={() => setEndrerTittel(false)} />
					) : (
						<div className="flex items-center gap-1">
							{harEgendefinertTittel ? (
								<span className="font-medium">{lagretSøk.tittel}</span>
							) : (
								<span className="italic text-gray-500">Ingen tittel</span>
							)}
							<Button
								title={harEgendefinertTittel ? 'Endre tittel' : 'Sett tittel'}
								size="xsmall"
								variant="tertiary"
								icon={<PencilIcon />}
								onClick={() => setEndrerTittel(true)}
							/>
						</div>
					)}
				</div>
				<div className="flex gap-2 flex-shrink-0">
					<Button
						variant="tertiary"
						size="small"
						onClick={() => {
							const tittelEllerQueryBeskrivelse = lagretSøk.tittel || `lagret søk med id ${lagretSøk.id}`;
							kopierLagretSøk({ id: lagretSøk.id, tittel: `Kopi av: ${tittelEllerQueryBeskrivelse}` });
						}}
						icon={<FilesIcon />}
					>
						Kopier
					</Button>
					{harUttrekk ? (
						<ModalButton
							renderButton={({ openModal }) => (
								<Button variant="tertiary" size="small" onClick={openModal} icon={<TrashIcon />}>
									Slett
								</Button>
							)}
							renderModal={({ open, closeModal }) => (
								<SlettLagretSøkModal
									lagretSøk={lagretSøk}
									antallUttrekk={uttrekk.length}
									open={open}
									closeModal={closeModal}
								/>
							)}
						/>
					) : (
						<Button variant="tertiary" size="small" onClick={() => slettLagretSøk(lagretSøk.id)} icon={<TrashIcon />}>
							Slett
						</Button>
					)}
				</div>
			</div>

			{/* Rad 2: KriterieBoks, FelterBoks, SorteringBoks */}
			<div className="w-full flex gap-2">
				<KriterierBoks queryBeskrivelse={utledFilterBeskrivelse(lagretSøk.query, felter)} lagretSøk={lagretSøk} />
				<FelterBoks selectBeskrivelse={utledSelectBeskrivelse(lagretSøk.query, felter)} lagretSøk={lagretSøk} />
				<SorteringBoks orderBeskrivelse={utledOrderBeskrivelse(lagretSøk.query, felter)} lagretSøk={lagretSøk} />
			</div>

			{/* Rad 3: Antall oppgaver */}
			<div className="w-full text-md text-gray-700">
				{antallLoading ? (
					<Skeleton variant="text" width={100} className="inline-block" />
				) : (
					<>
						<span className="font-medium">Antall oppgaver: </span>
						{antall !== undefined ? `${antall}` : '-'}
					</>
				)}
			</div>

			{/* Rad 4: Uttrekk-visning */}
			<div className="w-full">
				<ModalButton
					renderButton={({ openModal }) => (
						<Button icon={<PlayIcon />} variant="secondary" size="small" onClick={openModal}>
							Gjør uttrekk
						</Button>
					)}
					renderModal={({ open, closeModal }) => (
						<OpprettUttrekkModal
							lagretSøk={lagretSøk}
							open={open}
							closeModal={() => {
								setExpanded(true);
								closeModal();
							}}
						/>
					)}
				/>
				{harUttrekk && (
					<div className="mt-4">
						<Button
							className="pl-0"
							variant="tertiary"
							size="small"
							onClick={() => setExpanded(!expanded)}
							icon={expanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
						>
							{expanded ? 'Skjul uttrekk' : `Vis uttrekk (${uttrekk.length})`}
						</Button>
						{expanded && (
							<div className="mt-2">
								{uttrekk.map((u) => (
									<UttrekkKort key={u.id} uttrekk={u} />
								))}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
