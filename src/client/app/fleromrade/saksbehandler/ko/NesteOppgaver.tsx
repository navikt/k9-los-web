import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Heading, HStack, InlineMessage, Loader, VStack } from '@navikt/ds-react';
import type { OppgaveKo } from 'api/generated/los.schemas';
import { useAntallIKø, useOppgaverIKø } from 'fleromrade/api/saksbehandlerQueries';
import OppgaveTabell from '../oppgave/OppgaveTabell';

const NesteOppgaver = ({ kø }: { kø: OppgaveKo }) => {
	const { refetch: hentAntall, isFetching: henterAntall } = useAntallIKø(kø.id);
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

	return (
		<VStack gap="space-16">
			{kø.frittValgAvOppgave && (
				<HStack gap="space-8" align="center">
					<Heading level="3" size="small">
						Neste oppgaver
					</Heading>
					{!isPending && (
						<Button
							type="button"
							variant="tertiary"
							size="xsmall"
							title="Oppfrisk neste oppgaver og antall i kø"
							icon={<ArrowsCirclepathIcon aria-hidden />}
							loading={isFetching || henterAntall}
							disabled={isFetching || henterAntall}
							onClick={() => {
								void hentAntall();
								void refetch();
							}}
						/>
					)}
				</HStack>
			)}
			{isPending && <Loader title="Henter oppgaver i køen" />}
			{oppgaver && <OppgaveTabell oppgaver={oppgaver} visHandlinger={kø.frittValgAvOppgave} />}
			{!isError && oppgaver?.length === 0 && (
				<BodyShort size="small">Det er ingen flere oppgaver i køen som kan plukkes</BodyShort>
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
		</VStack>
	);
};

export default NesteOppgaver;
