import React, { useContext, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { ChevronDownIcon, EyeIcon } from '@navikt/aksel-icons';
import { ActionMenu, Alert, BodyShort, Button, Dialog, Loader, Pagination, Table } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import {
	Uttrekk,
	useHentUttrekkResultat,
} from 'api/queries/avdelingslederQueries';
import { AggregertFunksjon, AGGREGERT_FUNKSJON_VISNINGSNAVN, Oppgavefelt, SelectFelt, TolkesSom } from 'filter/filterTsTypes';
import { felter } from 'filter/parts/testdata';
import 'utils/dateUtils';

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 25, 30, 35, 40];

function calculateDefaultPageSize(): number {
	// Gjetninger på overhead og høyde, må tilpasses hvis det skjer noen endringer
	const overhead = 200;
	const rowHeight = 33;
	const available = window.innerHeight - overhead;
	const rows = Math.floor(available / rowHeight);
	let best = PAGE_SIZE_OPTIONS[0];
	for (const opt of PAGE_SIZE_OPTIONS) {
		if (opt <= rows) best = opt;
	}
	return best;
}

export function harFormatering(feltdef: Oppgavefelt | undefined): boolean {
	if (!feltdef) return false;
	if (feltdef.verdiforklaringer && feltdef.verdiforklaringer.length > 0) return true;
	return [TolkesSom.Boolean, TolkesSom.Timestamp, TolkesSom.Duration].includes(feltdef.tolkes_som);
}

export function formatCelleVerdi(verdi: unknown, feltdef: Oppgavefelt | undefined, formater: boolean): string {
	if (verdi === null || verdi === undefined || verdi === '') {
		return '-';
	}

	if (!formater || !feltdef) {
		return String(verdi);
	}

	if (feltdef.verdiforklaringer && feltdef.verdiforklaringer.length > 0) {
		const forklaring = feltdef.verdiforklaringer.find((v) => v.verdi === String(verdi));
		if (forklaring) {
			return forklaring.visningsnavn;
		}
	}

	if (feltdef.tolkes_som === TolkesSom.Boolean) {
		const boolVerdi = typeof verdi === 'boolean' ? verdi : String(verdi) === 'true';
		return boolVerdi ? 'Ja' : 'Nei';
	}

	if (feltdef.tolkes_som === TolkesSom.Timestamp) {
		const dato = dayjs(String(verdi));
		if (dato.isValid()) {
			return dato.format('D. MMM YYYY, [kl.] HH:mm');
		}
	}

	if (feltdef.tolkes_som === TolkesSom.Duration) {
		const strVerdi = String(verdi);
		const tall = Number(strVerdi);
		if (!Number.isNaN(tall)) {
			return `${Math.floor(tall)}`;
		}
		const dur = dayjs.duration(strVerdi);
		const dager = dur.asDays();
		if (!Number.isNaN(dager)) {
			return `${Math.floor(dager)}`;
		}
		return strVerdi;
	}

	return String(verdi);
}

function finnFeltdefForAggregert(
	kode: string | undefined,
	funksjon: AggregertFunksjon,
): Pick<Oppgavefelt, 'område' | 'kode' | 'visningsnavn'> | undefined {
	const funksjonsNavn = AGGREGERT_FUNKSJON_VISNINGSNAVN[funksjon];
	const feltDef = kode ? felter.find((f) => f.kode === kode) : undefined;
	if (!feltDef) return { visningsnavn: funksjonsNavn, kode: '', område: '' };
	return {
		...feltDef,
		visningsnavn: `${funksjonsNavn}: ${feltDef.visningsnavn}`,
	};
}

function finnFeltdef(felter: Oppgavefelt[], kolonne: SelectFelt): Oppgavefelt | undefined {
	if (kolonne.type === 'aggregert') {
		return {
			...finnFeltdefForAggregert(kolonne.kode ?? undefined, kolonne.funksjon),
			tolkes_som: TolkesSom.String,
			verdiforklaringer: null,
			verdiforklaringerErUttømmende: false,
			kokriterie: false,
		};
	}
	return felter.find((f) => f.kode === kolonne.kode);
}

function kolonneVisningsnavn(kolonne: SelectFelt, felter: Oppgavefelt[]): string {
	const feltdef = finnFeltdef(felter, kolonne);
	if (feltdef) return feltdef.visningsnavn;
	return kolonne.type === 'enkel' ? kolonne.kode : AGGREGERT_FUNKSJON_VISNINGSNAVN[kolonne.funksjon];
}

export function UttrekkResultatDialog({ uttrekk }: { uttrekk: Uttrekk }) {
	const [open, setOpen] = useState(false);
	const [pageSize, setPageSize] = useState(() => calculateDefaultPageSize());
	const [page, setPage] = useState(1);
	const offset = (page - 1) * pageSize;

	const { data, isLoading, isError } = useHentUttrekkResultat(uttrekk.id, offset, pageSize, open);

	const totalPages = data ? Math.ceil(data.totaltAntall / pageSize) : 1;

	const { felter } = useContext(AppContext);

	const formaterbare = useMemo(() => {
		if (!data?.kolonner) return new Set<number>();
		const result = new Set<number>();
		data.kolonner.forEach((kolonne, idx) => {
			if (harFormatering(finnFeltdef(felter, kolonne))) {
				result.add(idx);
			}
		});
		return result;
	}, [data?.kolonner, felter]);

	const [formaterKolonner, setFormaterKolonner] = useState<Set<number>>(new Set());
	const [synligeKolonner, setSynligeKolonner] = useState<Set<number>>(new Set());

	useEffect(() => {
		if (data?.kolonner) {
			setFormaterKolonner((prev) => {
				if (prev.size === 0) {
					return new Set(formaterbare);
				}
				return prev;
			});
			setSynligeKolonner((prev) => {
				if (prev.size === 0) {
					return new Set(data.kolonner.map((_, i) => i));
				}
				return prev;
			});
		}
	}, [data?.kolonner, formaterbare]);

	const toggleFormatering = (kolonne: number) => {
		setFormaterKolonner((prev) => {
			const next = new Set(prev);
			if (next.has(kolonne)) {
				next.delete(kolonne);
			} else {
				next.add(kolonne);
			}
			return next;
		});
	};

	const toggleSynlighet = (kolonne: number) => {
		setSynligeKolonner((prev) => {
			const next = new Set(prev);
			if (next.has(kolonne)) {
				next.delete(kolonne);
			} else {
				next.add(kolonne);
			}
			return next;
		});
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (newOpen) {
			setPageSize(calculateDefaultPageSize());
			setPage(1);
		}
		setOpen(newOpen);
	};

	const handlePageSizeChange = (newSize: number) => {
		setPageSize(newSize);
		setPage(1);
	};

	const visKolonneIndekser = data ? data.kolonner.map((_, i) => i).filter((i) => synligeKolonner.has(i)) : [];

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<Dialog.Trigger>
				<Button icon={<EyeIcon />} size="small" variant="tertiary">
					Vis resultat
				</Button>
			</Dialog.Trigger>
			<Dialog.Popup position="fullscreen">
				<Dialog.Header>
					<div className="flex items-center gap-4">
						<Dialog.Title>Resultat av uttrekk {data?.totaltAntall ? `(${data.totaltAntall} rader)` : ''}</Dialog.Title>
						{data && data.rader.length > 0 && (
							<ActionMenu>
								<ActionMenu.Trigger>
									<Button variant="secondary" size="small" icon={<ChevronDownIcon aria-hidden />}>
										Visningsinnstillinger
									</Button>
								</ActionMenu.Trigger>
								<ActionMenu.Content>
									<ActionMenu.RadioGroup
										label="Rader per side"
										onValueChange={(value) => handlePageSizeChange(Number(value))}
										value={String(pageSize)}
									>
										{PAGE_SIZE_OPTIONS.map((size) => (
											<ActionMenu.RadioItem key={size} value={String(size)}>
												{size}
											</ActionMenu.RadioItem>
										))}
									</ActionMenu.RadioGroup>
									<ActionMenu.Divider />
									<ActionMenu.Group label="Formater kolonner">
										{data.kolonner.map((kolonne, idx) => {
											const kanFormateres = formaterbare.has(idx);
											return (
												<ActionMenu.CheckboxItem
													key={idx}
													checked={kanFormateres && formaterKolonner.has(idx)}
													onCheckedChange={() => toggleFormatering(idx)}
													disabled={!kanFormateres}
												>
													{kolonneVisningsnavn(kolonne, felter)}
												</ActionMenu.CheckboxItem>
											);
										})}
									</ActionMenu.Group>
									<ActionMenu.Divider />
									<ActionMenu.Group label="Vis kolonner">
										{data.kolonner.map((kolonne, idx) => (
											<ActionMenu.CheckboxItem
												key={idx}
												checked={synligeKolonner.has(idx)}
												onCheckedChange={() => toggleSynlighet(idx)}
											>
												{kolonneVisningsnavn(kolonne, felter)}
											</ActionMenu.CheckboxItem>
										))}
									</ActionMenu.Group>
								</ActionMenu.Content>
							</ActionMenu>
						)}
					</div>
				</Dialog.Header>
				<Dialog.Body>
					{isLoading && (
						<div className="flex justify-center p-8">
							<Loader size="xlarge" />
						</div>
					)}
					{isError && <Alert variant="error">Kunne ikke hente resultat. Prøv igjen.</Alert>}
					{data && data.rader.length > 0 && (
						<>
							<div className="overflow-x-auto">
								<Table size="small">
									<Table.Header>
										<Table.Row>
											{visKolonneIndekser.map((idx) => (
												<Table.HeaderCell key={idx}>
													{kolonneVisningsnavn(data.kolonner[idx], felter)}
												</Table.HeaderCell>
											))}
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{data.rader.map((rad) => (
											<Table.Row key={rad.id}>
												{visKolonneIndekser.map((idx) => {
													const feltdef = finnFeltdef(felter, data.kolonner[idx]);
													return (
														<Table.DataCell key={idx}>
															{formatCelleVerdi(rad.kolonner[idx], feltdef, formaterKolonner.has(idx))}
														</Table.DataCell>
													);
												})}
											</Table.Row>
										))}
									</Table.Body>
								</Table>
							</div>
						</>
					)}
					{data && data.rader.length === 0 && <BodyShort>Ingen rader i uttrekket.</BodyShort>}
				</Dialog.Body>
				<Dialog.Footer>
					<div className="grid grid-cols-[1fr_auto_1fr] items-center w-full">
						<div />
						<div>
							{totalPages > 1 && <Pagination page={page} onPageChange={setPage} count={totalPages} size="small" />}
						</div>
						<div className="justify-self-end">
							<Dialog.CloseTrigger>
								<Button>Lukk</Button>
							</Dialog.CloseTrigger>
						</div>
					</div>
				</Dialog.Footer>
			</Dialog.Popup>
		</Dialog>
	);
}
