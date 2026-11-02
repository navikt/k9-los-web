import { BodyShort, Button, InlineMessage, Loader, VStack } from '@navikt/ds-react';
import type { OppgaveKo, OppgaveSammendragDto } from 'api/generated/los.schemas';
import { useOppgaverIKø } from 'fleromrade/api/saksbehandlerQueries';
import { useState } from 'react';
import OppgaveTabell from '../oppgave/OppgaveTabell';
import NesteOppgaveDialog from './NesteOppgaveDialog';

const NesteOppgaver = ({ kø }: { kø: OppgaveKo }) => {
	const {
		data: oppgaver,
		isPending,
		isError,
		isFetchNextPageError,
		isFetching,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		refetch,
	} = useOppgaverIKø(kø.id);
	const [valgtOppgave, setValgtOppgave] = useState<OppgaveSammendragDto>();

	if (isPending) return <Loader title="Henter oppgaver i køen" />;

	return (
		<VStack gap="space-16">
			{oppgaver && oppgaver.length > 0 ? (
				<OppgaveTabell
					oppgaver={oppgaver}
					velg={kø.frittValgAvOppgave ? { med: 'rad', onVelgOppgave: setValgtOppgave } : undefined}
				/>
			) : (
				!isError && <BodyShort size="small">Det er ingen flere oppgaver i køen som kan plukkes</BodyShort>
			)}
			{isError && (
				<InlineMessage status="error" role="alert">
					Kunne ikke hente de neste oppgavene i køen. Prøv igjen.
				</InlineMessage>
			)}
			{(hasNextPage || isError) && (
				<div>
					<Button
						variant="tertiary"
						size="small"
						loading={isFetchingNextPage}
						disabled={isFetching}
						onClick={() => (isError && !isFetchNextPageError ? refetch() : fetchNextPage())}
					>
						{isError ? 'Prøv igjen' : 'Vis flere oppgaver'}
					</Button>
				</div>
			)}
			{valgtOppgave && <NesteOppgaveDialog oppgave={valgtOppgave} lukk={() => setValgtOppgave(undefined)} />}
		</VStack>
	);
};

export default NesteOppgaver;
