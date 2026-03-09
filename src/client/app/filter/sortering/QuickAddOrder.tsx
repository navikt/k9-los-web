import React, { useContext } from 'react';
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

	const valgteKoder = new Set(oppgaveQuery.order.filter((o) => o.kode).map((o) => o.kode));

	const handleAdd = (item: QuickAddOrderItem) => {
		updateQuery([
			addSortering({
				type: 'enkel',
				kode: item.kode,
				område: item.område,
				økende: item.økende,
			}),
		]);
	};

	const tilgjengelige = QUICK_ADD_SORTERING.filter((item) => !valgteKoder.has(item.kode));

	if (tilgjengelige.length === 0) return null;

	return (
		<div className="mt-2">
			<div className="flex flex-wrap gap-2">
				{tilgjengelige.map((item) => (
					<button
						key={item.kode}
						type="button"
						className="cursor-pointer inline-flex items-center gap-0.5 rounded-md border border-dashed border-ax-neutral-400 bg-transparent pl-1 pr-2 py-0.5 font-semibold text-ax-neutral-700 hover:border-ax-neutral-700 hover:text-ax-neutral-900 hover:bg-ax-neutral-200"
						style={{ fontSize: '0.9rem' }}
						onClick={() => handleAdd(item)}
					>
						<PlusIcon aria-hidden className="shrink-0" height="0.875rem" width="0.875rem" />
						{item.visningsnavn}
					</button>
				))}
			</div>
		</div>
	);
};

export default QuickAddOrder;
