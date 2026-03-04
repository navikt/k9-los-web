import React from 'react';
import { SortDownIcon } from '@navikt/aksel-icons';
import { LagretSøk } from 'api/queries/avdelingslederQueries';
import { QueryBoks } from 'avdelingsleder/lagredeSøk/QueryBoks';
import { OrderBeskrivelse } from 'filter/queryBeskrivelseUtils';

export function SorteringBoks({
	orderBeskrivelse,
	lagretSøk,
}: {
	orderBeskrivelse: OrderBeskrivelse[];
	lagretSøk: LagretSøk;
}) {
	return (
		<QueryBoks ikon={<SortDownIcon />} lagretSøk={lagretSøk} modalTab="sortering" className="w-1/4">
			{orderBeskrivelse && orderBeskrivelse.length > 0 && (
				<div className="flex flex-col gap-0.5 text-base mt-1">
					{orderBeskrivelse.map((order) => (
						<div className="leading-normal" key={order.feltnavn}>
							{order.feltnavn} ({order.økende ? 'økende' : 'synkende'})
						</div>
					))}
				</div>
			)}
		</QueryBoks>
	);
}
