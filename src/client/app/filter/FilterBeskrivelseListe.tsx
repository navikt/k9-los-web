import React from 'react';
import { FilterBeskrivelse } from 'filter/queryBeskrivelseUtils';

export function FilterBeskrivelseListe({ queryBeskrivelse }: { queryBeskrivelse: FilterBeskrivelse[] }) {
	if (!queryBeskrivelse || queryBeskrivelse.length === 0) {
		return null;
	}

	return (
		<div className="flex flex-col gap-0.5 text-base mt-1">
			{queryBeskrivelse.map((filter) => (
				<div className="leading-normal" key={filter.feltnavn}>
					<span className="font-ax-bold text-ax-neutral-800">{filter.feltnavn}</span>:{' '}
					{filter.sammenføyning.prefiks ?? ''}
					{filter.verdier.join(filter.sammenføyning.separator)}
				</div>
			))}
		</div>
	);
}

export default FilterBeskrivelseListe;
