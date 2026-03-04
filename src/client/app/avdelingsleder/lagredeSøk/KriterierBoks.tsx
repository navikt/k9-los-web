import React from 'react';
import { FilterIcon } from '@navikt/aksel-icons';
import { LagretSøk } from 'api/queries/avdelingslederQueries';
import { QueryBoks } from 'avdelingsleder/lagredeSøk/QueryBoks';
import { FilterBeskrivelse as FilterBeskrivelseType } from 'filter/queryBeskrivelseUtils';

export function KriterierBoks({
	queryBeskrivelse,
	lagretSøk,
}: {
	queryBeskrivelse: FilterBeskrivelseType[];
	lagretSøk: LagretSøk;
}) {
	return (
		<QueryBoks ikon={<FilterIcon />} lagretSøk={lagretSøk} modalTab="kriterier" className="w-1/2">
			{queryBeskrivelse && queryBeskrivelse.length > 0 && (
				<div className="flex flex-col gap-0.5 text-base mt-1">
					{queryBeskrivelse.map((filter) => (
						<div className="leading-normal" key={filter.feltnavn}>
							<span className="font-ax-bold text-ax-neutral-800">{filter.feltnavn}</span>:{' '}
							{filter.sammenføyning.prefiks ?? ''}
							{filter.verdier.join(filter.sammenføyning.separator)}
						</div>
					))}
				</div>
			)}
		</QueryBoks>
	);
}
