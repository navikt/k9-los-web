import React, { useContext, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import 'dayjs/locale/nb';
import { WrenchIcon } from '@navikt/aksel-icons';
import { ActionMenu, Alert, BodyShort, Button, Loader, Modal, Pagination, Table } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { Uttrekk, UttrekkResultatCelle, useHentUttrekkResultat } from 'api/queries/avdelingslederQueries';
import { Oppgavefelt, TolkesSom } from 'filter/filterTsTypes';

dayjs.extend(durationPlugin);
dayjs.locale('nb');

const PAGE_SIZE = 20;

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

function finnFeltdef(felter: Oppgavefelt[], celle: UttrekkResultatCelle): Oppgavefelt | undefined {
	if (celle.område) {
		return felter.find((f) => f.område === celle.område && f.kode === celle.kode);
	}
	return felter.find((f) => f.kode === celle.kode);
}

export function UttrekkResultatModal({
	uttrekk,
	open,
	closeModal,
}: {
	uttrekk: Uttrekk;
	open: boolean;
	closeModal: () => void;
}) {
	const [page, setPage] = useState(1);
	const offset = (page - 1) * PAGE_SIZE;

	const { data, isLoading, isError } = useHentUttrekkResultat(uttrekk.id, offset, PAGE_SIZE, open);

	const totalPages = data ? Math.ceil(data.totaltAntall / PAGE_SIZE) : 1;

	const { felter } = useContext(AppContext);

	const formaterbare = useMemo(() => {
		if (!data?.kolonner) return new Set<string>();
		return new Set(data.kolonner.filter((k) => harFormatering(felter.find((f) => f.kode === k))));
	}, [data?.kolonner, felter]);

	const [formaterKolonner, setFormaterKolonner] = useState<Set<string>>(new Set());

	useEffect(() => {
		if (data?.kolonner) {
			setFormaterKolonner((prev) => {
				if (prev.size === 0) {
					return new Set(data.kolonner.filter((k) => formaterbare.has(k)));
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

	return (
		<Modal
			closeOnBackdropClick
			header={{ heading: `Resultat av uttrekk ${data?.totaltAntall ? `(${data?.totaltAntall} rader)` : ''}` }}
			width="90vw"
			open={open}
			onClose={closeModal}
		>
			<Modal.Body>
				{isLoading && (
					<div className="flex justify-center p-8">
						<Loader size="xlarge" />
					</div>
				)}
				{isError && <Alert variant="error">Kunne ikke hente resultat. Prøv igjen.</Alert>}
				{data && data.rader.length > 0 && (
					<>
						<div className="mb-2">
							<ActionMenu>
								<ActionMenu.Trigger>
									<Button variant="tertiary" size="small" icon={<WrenchIcon aria-hidden />}>
										Formatering
									</Button>
								</ActionMenu.Trigger>
								<ActionMenu.Content>
									<ActionMenu.Group label="Formatér kolonner">
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
								</ActionMenu.Content>
							</ActionMenu>
						</div>
						<div className="overflow-x-auto">
							<Table size="small">
								<Table.Header>
									<Table.Row>
										{data.kolonner.map((kolonne) => (
											<Table.HeaderCell key={kolonne}>
												{felter.find((f) => f.kode === kolonne)?.visningsnavn ?? kolonne}
											</Table.HeaderCell>
										))}
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{data.rader.map((rad) => (
										<Table.Row key={rad.id.eksternId}>
											{rad.felter.map((celle, celleIdx) => {
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
						{totalPages > 1 && (
							<div className="flex justify-center mt-4">
								<Pagination page={page} onPageChange={setPage} count={totalPages} size="small" />
							</div>
						)}
					</>
				)}
				{data && data.rader.length === 0 && <BodyShort>Ingen rader i uttrekket.</BodyShort>}
			</Modal.Body>
		</Modal>
	);
}
