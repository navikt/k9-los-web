import React from 'react';
import { Alert, BodyShort, Heading, Skeleton } from '@navikt/ds-react';
import { useHentAlleUttrekk } from 'api/queries/avdelingslederQueries';
import { UttrekkKort } from 'avdelingsleder/lagredeSøk/UttrekkKort';

export function UttrekkTabell() {
	const { data: uttrekk, isLoading, isError } = useHentAlleUttrekk();

	if (isError) {
		return (
			<Alert variant="error" className="my-4">
				Kunne ikke hente uttrekk. Prøv å oppfrisk siden.
			</Alert>
		);
	}

	return (
		<div className="mt-12">
			<Heading size="xsmall" className="mb-4">
				Dine uttrekk av lagrede søk
			</Heading>

			{isLoading ? (
				<Skeleton variant="rectangle" height={100} />
			) : uttrekk && uttrekk.length > 0 ? (
				<div>
					{uttrekk.map((u) => (
						<UttrekkKort key={u.id} uttrekk={u} />
					))}
				</div>
			) : (
				<BodyShort>
					<i>Ingen uttrekk opprettet ennå</i>
				</BodyShort>
			)}
		</div>
	);
}
