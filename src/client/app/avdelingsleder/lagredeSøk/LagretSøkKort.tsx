import React, { useContext, useEffect, useState } from 'react';
import {
	ChevronDownIcon,
	ChevronRightIcon,
	FilterIcon,
	PencilIcon,
	PlayIcon,
	SortDownIcon,
	TableIcon,
	TrashIcon,
} from '@navikt/aksel-icons';
import { Button, Skeleton, TextField } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { LagretSøk, Uttrekk, useEndreLagretSøk, useSlettLagretSøk } from 'api/queries/avdelingslederQueries';
import { EndreKriterierLagretSøkModal } from 'avdelingsleder/lagredeSøk/EndreKriterierLagretSøkModal';
import { KopierLagretSøkDialog } from 'avdelingsleder/lagredeSøk/KopierLagretSøkDialog';
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
		<div className={`rounded-md p-2 border-solid border-[2px] border-ax-neutral-300 ${className || ''}`}>
			<div className="flex justify-between items-center gap-2">
				<div className="text-sm text-ax-neutral-800 flex items-center gap-1 font-medium">
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
			{children || <p className="text-ax-neutral-600 italic mt-1">Ingen {modalTab} valgt</p>}
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
							<span className="font-ax-bold text-ax-neutral-800">{filter.feltnavn}</span>:{' '}
							{filter.sammenføyning.prefiks ?? ''}
							{filter.verdier.join(filter.sammenføyning.separator)}
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
	initiallyExpanded,
	onNyOpprettet,
}: {
	lagretSøk: LagretSøk;
	antall: number | undefined;
	antallLoading: boolean;
	uttrekk: Uttrekk[];
	initiallyExpanded?: boolean;
	onNyOpprettet?: (id: number) => void;
}) {
	const { felter } = useContext(AppContext);
	const [endrerTittel, setEndrerTittel] = useState(false);
	const [uttrekkEkspandert, setUttrekkEkspandert] = useState(false);
	const [lagretSøkKollapset, setLagretSøkKollapset] = useState(!initiallyExpanded);
	const { mutate: slettLagretSøk } = useSlettLagretSøk();

	useEffect(() => {
		if (initiallyExpanded) {
			setLagretSøkKollapset(false);
		}
	}, [initiallyExpanded]);

	const harEgendefinertTittel = lagretSøk.tittel.length > 0;
	const harUttrekk = uttrekk.length > 0;
	const filterBeskrivelse = utledFilterBeskrivelse(lagretSøk.query, felter);

	return (
		<div
			className={`rounded-md mb-2 border-solid flex flex-col border-1 ${
				lagretSøkKollapset
					? 'bg-ax-bg-neutral-soft border-ax-border-neutral-subtle p-[var(--ax-space-8)] gap-[var(--ax-space-2)] cursor-pointer'
					: 'bg-ax-bg-accent-soft border-ax-border-accent-subtle p-[var(--ax-space-12)] gap-[var(--ax-space-8)]'
			}`}
			{...(lagretSøkKollapset
				? {
						onClick: () => setLagretSøkKollapset(false),
						onKeyDown: (e: React.KeyboardEvent) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								setLagretSøkKollapset(false);
							}
						},
						role: 'button',
						tabIndex: 0,
					}
				: {})}
		>
			{/* Rad 1: Ikon, tittel, kopier/slett-knapper */}
			<div className="w-full flex items-center justify-between gap-2">
				<div className="flex items-center gap-2 min-w-0 flex-1">
					<Button
						title={lagretSøkKollapset ? 'Utvid søk' : 'Kollaps søk'}
						size="xsmall"
						variant="tertiary-neutral"
						icon={lagretSøkKollapset ? <ChevronRightIcon fontSize="1.5rem" /> : <ChevronDownIcon fontSize="1.5rem" />}
						onClick={(e) => {
							e.stopPropagation();
							setLagretSøkKollapset(!lagretSøkKollapset);
						}}
					/>
					{!lagretSøkKollapset && endrerTittel ? (
						<EndreTittel lagretSøk={lagretSøk} ikkeIEndreModusLenger={() => setEndrerTittel(false)} />
					) : (
						<div className="flex items-center gap-1">
							{harEgendefinertTittel ? (
								<span className={`${lagretSøkKollapset ? 'text-ax-neutral-800 text-ax-medium' : ''}`}>
									{lagretSøk.tittel}
								</span>
							) : (
								<span className={`italic text-ax-neutral-600 ${lagretSøkKollapset ? 'text-ax-medium' : ''}`}>
									Ingen tittel
								</span>
							)}
							{!lagretSøkKollapset && (
								<Button
									title={harEgendefinertTittel ? 'Endre tittel' : 'Sett tittel'}
									size="xsmall"
									variant="tertiary"
									icon={<PencilIcon />}
									onClick={() => setEndrerTittel(true)}
								/>
							)}
						</div>
					)}
				</div>
				{!lagretSøkKollapset && (
					<div className="flex gap-2 flex-shrink-0">
						<KopierLagretSøkDialog lagretSøk={lagretSøk} onNyOpprettet={(id) => onNyOpprettet?.(id)} />
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
				)}
			</div>

			{lagretSøkKollapset ? (
				<div className="w-full text-ax-small text-ax-neutral-700 flex flex-col">
					{filterBeskrivelse && filterBeskrivelse.length > 0 && (
						<div>
							<span className="font-medium">Kriterier: </span>
							{filterBeskrivelse.map((f) => f.feltnavn).join(', ')}
						</div>
					)}
					<div>
						{antallLoading ? (
							<Skeleton variant="text" width={100} className="inline-block" />
						) : (
							<>
								<span className="font-medium">Antall oppgaver: </span>
								{antall !== undefined ? `${antall}` : '-'}
							</>
						)}
					</div>
				</div>
			) : (
				<>
					{/* Rad 2: KriterieBoks, FelterBoks, SorteringBoks */}
					<div className="w-full flex gap-2">
						<KriterierBoks queryBeskrivelse={filterBeskrivelse} lagretSøk={lagretSøk} />
						<FelterBoks selectBeskrivelse={utledSelectBeskrivelse(lagretSøk.query, felter)} lagretSøk={lagretSøk} />
						<SorteringBoks orderBeskrivelse={utledOrderBeskrivelse(lagretSøk.query, felter)} lagretSøk={lagretSøk} />
					</div>

					{/* Rad 3: Antall oppgaver */}
					<div className="w-full text-md text-ax-neutral-800">
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
										setUttrekkEkspandert(true);
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
									onClick={() => setUttrekkEkspandert(!uttrekkEkspandert)}
									icon={uttrekkEkspandert ? <ChevronDownIcon /> : <ChevronRightIcon />}
								>
									{uttrekkEkspandert ? 'Skjul uttrekk' : `Vis uttrekk (${uttrekk.length})`}
								</Button>
								{uttrekkEkspandert && (
									<div className="mt-2">
										{uttrekk.map((u) => (
											<UttrekkKort key={u.id} uttrekk={u} lagretSøk={lagretSøk} />
										))}
									</div>
								)}
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
}
