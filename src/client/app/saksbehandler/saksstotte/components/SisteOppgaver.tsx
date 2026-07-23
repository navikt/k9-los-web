import { Heading, Link, Skeleton } from '@navikt/ds-react';
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
						<li className="mb-2">
							<Skeleton width={250} />
						</li>
					</Repeat>
				)}
				{isSuccess &&
					data.length > 0 &&
					data.map((oppgave) => (
						<li className="mb-2" key={oppgave.oppgaveEksternId}>
							{oppgave.url ? <Link href={oppgave.url}>{oppgave.tittel}</Link> : oppgave.tittel}
						</li>
					))}
			</ul>
		</div>
	);
}
