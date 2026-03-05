import React, { useContext, useEffect, useState } from 'react';
import { CalculatorIcon, ChevronDownIcon, ChevronRightIcon, PencilIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Skeleton } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { LagretSøk, TypeKjøring, Uttrekk, useOpprettUttrekk, useSlettLagretSøk } from 'api/queries/avdelingslederQueries';
import { EndreTittel } from 'avdelingsleder/lagredeSøk/EndreTittel';
import { KopierLagretSøkDialog } from 'avdelingsleder/lagredeSøk/KopierLagretSøkDialog';
import { KriterierBoks } from 'avdelingsleder/lagredeSøk/KriterierBoks';
import { SlettLagretSøkDialog } from 'avdelingsleder/lagredeSøk/SlettLagretSøkDialog';
import { OpprettUttrekkDialog } from 'avdelingsleder/lagredeSøk/uttrekk/OpprettUttrekkDialog';
import { UttrekkKort } from 'avdelingsleder/lagredeSøk/uttrekk/UttrekkKort';
import { utledFilterBeskrivelse } from 'filter/queryBeskrivelseUtils';

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
	useEffect(() => {
		if (initiallyExpanded) {
			setLagretSøkKollapset(false);
		}
	}, [initiallyExpanded]);

	const { mutate: slettLagretSøk } = useSlettLagretSøk();
	const {
		mutate: opprettAntallUttrekk,
		isPending: opprettAntallIsPending,
	} = useOpprettUttrekk(() => {
		setUttrekkEkspandert(true);
	});
	const harEgendefinertTittel = lagretSøk.tittel.length > 0;
	const harUttrekk = uttrekk.length > 0;
	const filterBeskrivelse = utledFilterBeskrivelse(lagretSøk.query, felter);

	const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
		// Siden denne eventhandleren legges på hele div-en må det gjøres sjekker på at man klikker direkte på div-en
		if (!e.currentTarget.contains(e.target as Node)) return;
		if ((e.target as HTMLElement).closest('button, a')) return;
		setLagretSøkKollapset(false);
	};

	const handleCardKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		// Siden denne eventhandleren legges på hele div-en må det gjøres sjekker på at man trykker direkte på div-en
		if (e.target !== e.currentTarget) return;
		if (!e.currentTarget.contains(e.target as Node)) return;
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			setLagretSøkKollapset(false);
		}
	};

	return (
		<div
			className={`rounded-md mb-2 border-solid flex flex-col border-1 ${
				lagretSøkKollapset
					? 'cursor-pointer hover:drop-shadow-sm bg-ax-bg-neutral-soft border-ax-border-neutral-subtle p-[var(--ax-space-8)] gap-[var(--ax-space-2)]'
					: 'bg-ax-bg-accent-soft border-ax-border-accent-subtle p-[var(--ax-space-12)] gap-[var(--ax-space-8)]'
			}`}
			{...(lagretSøkKollapset
				? {
						onClick: handleCardClick,
						onKeyDown: handleCardKeyDown,
						role: 'button' as const,
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
				<div className="flex gap-2 flex-shrink-0">
					{!lagretSøkKollapset && (
						<KopierLagretSøkDialog lagretSøk={lagretSøk} onNyOpprettet={(id) => onNyOpprettet?.(id)} />
					)}
					{harUttrekk ? (
						<SlettLagretSøkDialog lagretSøk={lagretSøk} antallUttrekk={uttrekk.length} />
					) : (
						<Button variant="tertiary" size="small" onClick={() => slettLagretSøk(lagretSøk.id)} icon={<TrashIcon />}>
							Slett
						</Button>
					)}
				</div>
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
					{/* Rad 2: KriterieBoks */}
					<div className="w-full">
						<KriterierBoks queryBeskrivelse={filterBeskrivelse} lagretSøk={lagretSøk} />
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
						<div className="flex gap-2">
							<OpprettUttrekkDialog
								lagretSøk={lagretSøk}
								antall={antall}
								onOpprettet={() => setUttrekkEkspandert(true)}
							/>
							<Button
								icon={<CalculatorIcon />}
								variant="secondary"
								size="small"
								onClick={() =>
									opprettAntallUttrekk({
										lagretSokId: lagretSøk.id,
										typeKjoring: TypeKjøring.ANTALL,
									})
								}
								loading={opprettAntallIsPending}
								disabled={opprettAntallIsPending}
							>
								Antallssjekk
							</Button>
						</div>
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
