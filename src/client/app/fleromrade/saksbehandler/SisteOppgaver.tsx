import { BodyShort, Heading, Link, Skeleton, VStack } from '@navikt/ds-react';
import { useSisteOppgaver } from 'fleromrade/api/saksbehandlerQueries';

const SisteOppgaver = () => {
	const { data: oppgaver, isPending, isError } = useSisteOppgaver();

	return (
		<VStack gap="space-8">
			<Heading level="2" size="xsmall">
				Dine siste oppgaver
			</Heading>
			{isPending && (
				<VStack gap="space-8">
					{['a', 'b', 'c'].map((nøkkel) => (
						<Skeleton key={nøkkel} width={250} />
					))}
				</VStack>
			)}
			{isError && <BodyShort>Kunne ikke hente dine siste oppgaver</BodyShort>}
			{oppgaver?.length === 0 && <BodyShort>Ingen oppgaver</BodyShort>}
			{oppgaver?.length > 0 && (
				<VStack as="ul" gap="space-8" className="list-none pl-0">
					{oppgaver.map((oppgave) => (
						<li key={oppgave.oppgaveEksternId}>
							{oppgave.url ? <Link href={oppgave.url}>{oppgave.tittel}</Link> : oppgave.tittel}
						</li>
					))}
				</VStack>
			)}
		</VStack>
	);
};

export default SisteOppgaver;
