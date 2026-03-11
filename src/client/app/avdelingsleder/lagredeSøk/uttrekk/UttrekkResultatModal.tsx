import React, { useContext, useEffect, useState } from 'react';
import { WrenchIcon } from '@navikt/aksel-icons';
import { ActionMenu, Alert, BodyShort, Button, Loader, Modal, Pagination, Table } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { Uttrekk, UttrekkResultatCelle, useHentUttrekkResultat } from 'api/queries/avdelingslederQueries';
import { Oppgavefelt, TolkesSom } from 'filter/filterTsTypes';

const PAGE_SIZE = 20;

const timestampFormatter = new Intl.DateTimeFormat('nb-NO', {
	day: 'numeric',
	month: 'short',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
});

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
		const dato = new Date(String(verdi));
		if (!Number.isNaN(dato.getTime())) {
			return timestampFormatter.format(dato);
		}
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

	const [formaterKolonner, setFormaterKolonner] = useState<Set<string>>(new Set());

	useEffect(() => {
		if (data?.kolonner) {
			setFormaterKolonner((prev) => {
				if (prev.size === 0) {
					return new Set(data.kolonner);
				}
				return prev;
			});
		}
	}, [data?.kolonner]);

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
										{data.kolonner.map((kolonne) => (
											<ActionMenu.CheckboxItem
												key={kolonne}
												checked={formaterKolonner.has(kolonne)}
												onCheckedChange={() => toggleFormatering(kolonne)}
											>
												{felter.find((f) => f.kode === kolonne)?.visningsnavn ?? kolonne}
											</ActionMenu.CheckboxItem>
										))}
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
