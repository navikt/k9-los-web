import { PlusIcon } from '@navikt/aksel-icons';
import { FilterContext } from 'filter/FilterContext';
import { type Feltreferanse, feltIdentitet, sammeFelt } from 'filter/feltIdentitet';
import { OppgavefilterKode } from 'filter/filterTsTypes';
import { addSortering } from 'filter/queryUtils';
import { useContext } from 'react';

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

	const valgteFelter: Feltreferanse[] = oppgaveQuery.order
		.filter((o) => o.type === 'enkel' && o.kode !== null)
		.map((o) => ({ område: o.område ?? null, kode: o.kode as string }));

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

	const tilgjengelige = QUICK_ADD_SORTERING.filter((item) => !valgteFelter.some((valgt) => sammeFelt(valgt, item)));

	if (tilgjengelige.length === 0) return null;

	return (
		<div className="flex flex-wrap gap-2">
			{tilgjengelige.map((item) => (
				<button
					key={feltIdentitet(item)}
					type="button"
					className={[
						'cursor-pointer inline-flex items-center gap-0.5 rounded-md border border-dashed',
						'border-ax-neutral-400 bg-transparent pl-1 pr-2 py-0.5 font-semibold text-ax-neutral-700',
						'hover:border-ax-neutral-700 hover:text-ax-neutral-900 hover:bg-ax-neutral-200',
					].join(' ')}
					style={{ fontSize: '0.9rem' }}
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
