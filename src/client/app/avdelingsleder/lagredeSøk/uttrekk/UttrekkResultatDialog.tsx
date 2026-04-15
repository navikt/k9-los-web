import React, { useContext, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { ChevronDownIcon, EyeIcon } from '@navikt/aksel-icons';
import { ActionMenu, Alert, BodyShort, Button, Dialog, Loader, Pagination, Table } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { Uttrekk, UttrekkResultatCelle, useHentUttrekkResultat } from 'api/queries/avdelingslederQueries';
import { Oppgavefelt, TolkesSom } from 'filter/filterTsTypes';
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

export function formatCelleVerdi(
	verdi: string | number | boolean | string[] | null | undefined,
	feltdef: Oppgavefelt | undefined,
	formater: boolean,
): string {
	if (verdi === null || verdi === undefined || verdi === '') {
		return '-';
	}

	if (Array.isArray(verdi)) {
		if (verdi.length === 0) {
			return '-';
		}
		return verdi.map((v) => formatCelleVerdi(v, feltdef, formater)).join(', ');
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

function finnFeltdef(felter: Oppgavefelt[], celle: UttrekkResultatCelle): Oppgavefelt | undefined {
	if (celle.område) {
		return felter.find((f) => f.område === celle.område && f.kode === celle.kode);
	}
	return felter.find((f) => f.kode === celle.kode);
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
		if (!data?.kolonner) return new Set<string>();
		return new Set(data.kolonner.filter((k) => harFormatering(felter.find((f) => f.kode === k))));
	}, [data?.kolonner, felter]);

	const [formaterKolonner, setFormaterKolonner] = useState<Set<string>>(new Set());
	const [synligeKolonner, setSynligeKolonner] = useState<Set<string>>(new Set());

	useEffect(() => {
		if (data?.kolonner) {
			setFormaterKolonner((prev) => {
				if (prev.size === 0) {
					return new Set(data.kolonner.filter((k) => formaterbare.has(k)));
				}
				return prev;
			});
			setSynligeKolonner((prev) => {
				if (prev.size === 0) {
					return new Set(data.kolonner);
				}
				return prev;
			});
		}
	}, [data?.kolonner, formaterbare]);

	const toggleFormatering = (kolonne: string) => {
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

	const toggleSynlighet = (kolonne: string) => {
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

	const visKolonner = data?.kolonner.filter((k) => synligeKolonner.has(k)) ?? [];

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
										{data.kolonner.map((kolonne) => {
											const kanFormateres = formaterbare.has(kolonne);
											return (
												<ActionMenu.CheckboxItem
													key={kolonne}
													checked={kanFormateres && formaterKolonner.has(kolonne)}
													onCheckedChange={() => toggleFormatering(kolonne)}
													disabled={!kanFormateres}
												>
													{felter.find((f) => f.kode === kolonne)?.visningsnavn ?? kolonne}
												</ActionMenu.CheckboxItem>
											);
										})}
									</ActionMenu.Group>
									<ActionMenu.Divider />
									<ActionMenu.Group label="Vis kolonner">
										{data.kolonner.map((kolonne) => (
											<ActionMenu.CheckboxItem
												key={kolonne}
												checked={synligeKolonner.has(kolonne)}
												onCheckedChange={() => toggleSynlighet(kolonne)}
											>
												{felter.find((f) => f.kode === kolonne)?.visningsnavn ?? kolonne}
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
											{visKolonner.map((kolonne) => (
												<Table.HeaderCell key={kolonne}>
													{felter.find((f) => f.kode === kolonne)?.visningsnavn ?? kolonne}
												</Table.HeaderCell>
											))}
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{data.rader.map((rad) => (
											<Table.Row key={rad.id.eksternId}>
												{rad.felter
													.filter((celle) => synligeKolonner.has(celle.kode))
													.map((celle, celleIdx) => {
														const feltdef = finnFeltdef(felter, celle);
														return (
															// eslint-disable-next-line react/no-array-index-key
															<Table.DataCell key={celleIdx}>
																{formatCelleVerdi(celle.verdi, feltdef, formaterKolonner.has(celle.kode))}
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
