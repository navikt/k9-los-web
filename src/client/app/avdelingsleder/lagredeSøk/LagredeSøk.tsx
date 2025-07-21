import React from 'react';
import { useHentLagredeSøk } from 'api/queries/avdelingslederQueries';

export function LagredeSøk() {
	const { data, isSuccess } = useHentLagredeSøk();
	return (
		<div>
			Lagrede søk
			{isSuccess && data.length > 0 && (
				<ul>
					{data.map(({ id, tittel }) => (
						<li key={id}>{tittel}</li>
					))}
				</ul>
			)}
		</div>
	);
}
