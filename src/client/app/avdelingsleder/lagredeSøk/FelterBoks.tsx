import React from 'react';
import { TableIcon } from '@navikt/aksel-icons';
import { LagretSøk } from 'api/queries/avdelingslederQueries';
import { QueryBoks } from 'avdelingsleder/lagredeSøk/QueryBoks';
import { SelectBeskrivelse } from 'filter/queryBeskrivelseUtils';

export function FelterBoks({
	selectBeskrivelse,
	lagretSøk,
}: {
	selectBeskrivelse: SelectBeskrivelse[];
	lagretSøk: LagretSøk;
}) {
	return (
		<QueryBoks ikon={<TableIcon />} lagretSøk={lagretSøk} modalTab="felter" className="w-1/4">
			{selectBeskrivelse && selectBeskrivelse.length > 0 && (
				<div className="flex flex-col gap-0.5 text-base mt-1">
					{selectBeskrivelse.map((select) => (
						<div className="leading-normal" key={select.feltnavn}>
							{select.feltnavn}
						</div>
					))}
				</div>
			)}
		</QueryBoks>
	);
}
