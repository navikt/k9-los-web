import React, { useContext, useEffect, useState } from 'react';
import { PlusIcon } from '@navikt/aksel-icons';
import { FilterContext } from 'filter/FilterContext';
import { OppgavefilterKode } from 'filter/filterTsTypes';
import { addSortering } from 'filter/queryUtils';

interface QuickAddOrderItem {
	kode: OppgavefilterKode;
	område: string;
	visningsnavn: string;
	økende: boolean;
}

const QUICK_ADD_SORTERING: QuickAddOrderItem[] = [
	{
		kode: OppgavefilterKode.MottattDato,
		område: 'K9',
		visningsnavn: 'Mottatt dato',
		økende: true,
	},
];

const QuickAddOrder = () => {
	const { oppgaveQuery, updateQuery } = useContext(FilterContext);

	const [bruktKoder, setBruktKoder] = useState<Set<string>>(
		() => new Set(oppgaveQuery.order.filter((o) => o.kode).map((o) => o.kode)),
	);

	useEffect(() => {
		const koder = oppgaveQuery.order.filter((o) => o.kode).map((o) => o.kode);
		setBruktKoder((prev) => {
			const next = new Set(prev);
			let endret = false;
			for (const k of koder) {
				if (!next.has(k)) {
					next.add(k);
					endret = true;
				}
			}
			return endret ? next : prev;
		});
	}, [oppgaveQuery.order]);

	const handleAdd = (item: QuickAddOrderItem) => {
		setBruktKoder((prev) => new Set(prev).add(item.kode));
		updateQuery([
			addSortering({
				type: 'enkel',
				kode: item.kode,
				område: item.område,
				økende: item.økende,
			}),
		]);
	};

	const tilgjengelige = QUICK_ADD_SORTERING.filter((item) => !bruktKoder.has(item.kode));

	if (tilgjengelige.length === 0) return null;

	return (
		<div className="flex flex-wrap gap-2">
			{tilgjengelige.map((item) => (
				<button
					key={item.kode}
					type="button"
					className="inline-flex items-center gap-0.5 rounded-md border border-dashed border-ax-neutral-400 bg-transparent pl-1 pr-2 py-0.5 text-xsmall font-semibold text-ax-neutral-700 hover:border-ax-neutral-700 hover:text-ax-neutral-900 hover:bg-ax-neutral-200"
					onClick={() => handleAdd(item)}
				>
					<PlusIcon aria-hidden className="shrink-0" height="0.875rem" width="0.875rem" />
					{item.visningsnavn}
				</button>
			))}
		</div>
	);
};

export default QuickAddOrder;
