import React from 'react';
import { FilterBeskrivelse } from 'filter/queryBeskrivelseUtils';

export function FilterBeskrivelseListe({ queryBeskrivelse }: { queryBeskrivelse: FilterBeskrivelse[] }) {
	if (!queryBeskrivelse || queryBeskrivelse.length === 0) {
		return null;
	}

	return (
		<div className="flex flex-col gap-0.5 text-base mt-1 text-ax-text-neutral-subtle">
			{queryBeskrivelse.map((filter) => (
				<div className="leading-normal" key={filter.feltnavn}>
					<span className="font-ax-bold">{filter.feltnavn}</span>:{' '}
					<span className="font-ax-regular">
						{filter.sammenføyning.prefiks ?? ''}
						{filter.verdier.join(filter.sammenføyning.separator)}
					</span>
				</div>
			))}
		</div>
	);
}

export default FilterBeskrivelseListe;
