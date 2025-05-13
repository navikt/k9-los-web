import React from 'react';
import { Heading, Skeleton } from '@navikt/ds-react';
import { useHentSisteOppgaver } from 'api/queries/saksbehandlerQueries';
import Repeat from 'sharedComponents/Repeat';

export default function SisteOppgaver() {
	const { data, isSuccess, isLoading, isError } = useHentSisteOppgaver();

	return (
		<div>
			<Heading size="xsmall">Dine siste oppgaver</Heading>
			{isSuccess && data.length === 0 && 'Ingen oppgaver'}
			{isError && 'Feil ved henting av oppgaver'}
			<ul className="mt-2 list-none pl-0">
				{isLoading && (
					<Repeat times={10}>
						<li>
							<Skeleton width={250} />
						</li>
					</Repeat>
				)}
				{isSuccess &&
					data.length > 0 &&
					data.map((oppgave) => (
						<li key={oppgave.oppgaveEksternId}>
							{oppgave.url ? <a href={oppgave.url}>{oppgave.tittel}</a> : oppgave.tittel}
						</li>
					))}
			</ul>
		</div>
	);
}
