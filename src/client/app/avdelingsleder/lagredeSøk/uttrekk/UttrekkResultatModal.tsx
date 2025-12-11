import React, { useContext, useState } from 'react';
import { Alert, BodyShort, Loader, Modal, Pagination, Table } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { Uttrekk, UttrekkResultatCelle, useHentUttrekkResultat } from 'api/queries/avdelingslederQueries';

const PAGE_SIZE = 20;

function formatCelleVerdi(verdi: unknown): string {
	if (verdi === null || verdi === undefined) {
		return '';
	}
	if (typeof verdi === 'boolean') {
		return verdi ? 'Ja' : 'Nei';
	}
	return String(verdi);
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
	// Bygg kolonner fra første rad
	const kolonner: string[] = [];
	if (data && data.rader.length > 0) {
		data.rader[0].forEach((celle: UttrekkResultatCelle) => {
			const felt = felter.find((f) => f.område === celle.område && f.kode === celle.kode);
			kolonner.push(felt ? felt.visningsnavn : celle.kode);
		});
	}

	return (
		<Modal
			closeOnBackdropClick
			header={{ heading: `Resultat av uttrekk (${data?.totaltAntall ?? '...'} rader)` }}
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
						<div className="overflow-x-auto">
							<Table size="small">
								<Table.Header>
									<Table.Row>
										{kolonner.map((kolonne) => (
											<Table.HeaderCell key={kolonne}>{kolonne}</Table.HeaderCell>
										))}
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{data.rader.map((rad, radIdx) => (
										// Skrur av regel fordi arrayene er statiske
										/* eslint-disable react/no-array-index-key */
										<Table.Row key={radIdx}>
											{rad.map((celle, celleIdx) => (
												<Table.DataCell key={celleIdx}>{formatCelleVerdi(celle.verdi)}</Table.DataCell>
											))}
										</Table.Row>
										/* eslint-enable react/no-array-index-key */
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
