import React from 'react';
import { Heading } from '@navikt/ds-react';
import { useHentSisteOppgaver } from 'api/queries/saksbehandlerQueries';

export default function SisteOppgaver() {
	const { data, isSuccess } = useHentSisteOppgaver();
	if (!isSuccess || data === undefined || data.length === 0) return null;

	return (
		<div>
			<Heading size="xsmall">Dine siste oppgaver</Heading>
			<ul className="mt-2 list-none pl-0">
				{data.map((oppgave) => (
					<li key={oppgave.oppgaveEksternId}>
						<a href={oppgave.url}>{oppgave.tittel}</a>
					</li>
				))}
			</ul>
		</div>
	);
}
