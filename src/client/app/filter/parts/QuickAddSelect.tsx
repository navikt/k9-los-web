import React, { useContext } from 'react';
import { PlusIcon } from '@navikt/aksel-icons';
import AppContext from 'app/AppContext';
import { FilterContext } from 'filter/FilterContext';
import { OppgavefilterKode } from 'filter/filterTsTypes';
import { addEnkelSelectFelt, updateSelectFelt } from 'filter/queryUtils';

const QUICK_ADD_KOLONNER: OppgavefilterKode[] = [
	OppgavefilterKode.Saksnummer,
	OppgavefilterKode.Ytelsestype,
	OppgavefilterKode.AktivVenteårsak,
	OppgavefilterKode.MottattDato,
	OppgavefilterKode.Oppgavestatus,
	OppgavefilterKode.TidSidenMottattDato,
];

const QuickAddSelect = () => {
	const { felter } = useContext(AppContext);
	const { oppgaveQuery, updateQuery } = useContext(FilterContext);

	const valgteKoder = new Set(oppgaveQuery.select.filter((s) => s.kode).map((s) => s.kode));

	const handleAdd = (kode: OppgavefilterKode) => {
		const oppgavefelt = felter.find((f) => f.kode === kode);
		if (!oppgavefelt) return;

		updateQuery([
			addEnkelSelectFelt(),
			(query) => {
				const nyRad = query.select[query.select.length - 1];
				return updateSelectFelt(nyRad._nodeId, {
					kode: oppgavefelt.kode,
					område: oppgavefelt.område,
				})(query);
			},
		]);
	};

	const tilgjengelige = QUICK_ADD_KOLONNER.filter((kode) => !valgteKoder.has(kode))
		.map((kode) => {
			const oppgavefelt = felter.find((f) => f.kode === kode);
			if (!oppgavefelt) return null;
			return { kode, visningsnavn: oppgavefelt.visningsnavn };
		})
		.filter(Boolean);

	if (tilgjengelige.length === 0) return null;

	return (
		<div className="mt-2">
			<div className="flex flex-wrap gap-2">
				{tilgjengelige.map(({ kode, visningsnavn }) => (
					<button
						key={kode}
						type="button"
						className="cursor-pointer inline-flex items-center gap-0.5 rounded-md border border-dashed border-ax-neutral-400 bg-transparent pl-1 pr-2 py-0.5 font-semibold text-ax-neutral-700 hover:border-ax-neutral-700 hover:text-ax-neutral-900 hover:bg-ax-neutral-200"
						style={{ fontSize: '0.9rem' }}
						onClick={() => handleAdd(kode)}
					>
						<PlusIcon aria-hidden className="shrink-0" height="0.875rem" width="0.875rem" />
						{visningsnavn}
					</button>
				))}
			</div>
		</div>
	);
};

export default QuickAddSelect;
