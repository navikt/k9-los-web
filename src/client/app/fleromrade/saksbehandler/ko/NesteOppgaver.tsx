import { BodyShort, Button, HStack, InlineMessage, Loader, VStack } from '@navikt/ds-react';
import type { OppgaveKo, OppgaveSammendragDto } from 'api/generated/los.schemas';
import { useInnloggetBruker } from 'fleromrade/api/innloggetBrukerQueries';
import { useOppgaverIKø, useReserverOppgave, useÅpneOppgave } from 'fleromrade/api/saksbehandlerQueries';
import { useState } from 'react';
import OppgaveTabell from '../oppgave/OppgaveTabell';
import ReserverForAnnenModal from './ReserverForAnnenModal';

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
	const { reserver, isPending: reserverer } = useReserverOppgave();
	const { data: bruker } = useInnloggetBruker();
	const { åpne, isPending: åpner } = useÅpneOppgave();
	const [valgtOppgave, setValgtOppgave] = useState<OppgaveSammendragDto>();
	const [oppgaveSomReserveres, setOppgaveSomReserveres] = useState<OppgaveSammendragDto>();
	const [melding, setMelding] = useState<{ status: 'error' | 'warning'; tekst: string }>();
	const venter = reserverer || åpner;

	const reserverOgÅpne = (oppgave: OppgaveSammendragDto) => {
		setMelding(undefined);
		setOppgaveSomReserveres(oppgave);
		reserver(oppgave.oppgaveNøkkel, {
			onSuccess: (status) => {
				if (!status.erReservertAvInnloggetBruker) {
					setMelding({
						status: 'error',
						tekst: 'Oppgaven ble reservert av en annen saksbehandler. Velg en annen oppgave.',
					});
				} else if (!oppgave.oppgavebehandlingsUrl) {
					setMelding({
						status: 'warning',
						tekst:
							'Oppgaven er reservert på deg, men mangler lenke til fagsystemet. Du finner den under reserverte oppgaver.',
					});
				} else {
					åpne(oppgave.oppgaveNøkkel, oppgave.oppgavebehandlingsUrl);
				}
			},
			onError: () =>
				setMelding({
					status: 'error',
					tekst:
						'Kunne ikke reservere oppgaven. Den kan ha blitt reservert av en annen, eller du mangler tilgang. Prøv igjen.',
				}),
		});
	};

	if (isPending) return <Loader title="Henter oppgaver i køen" />;

	return (
		<VStack gap="space-16">
			{melding && (
				<InlineMessage status={melding.status} role="status">
					{melding.tekst}
				</InlineMessage>
			)}
			{oppgaver && oppgaver.length > 0 ? (
				<OppgaveTabell
					oppgaver={oppgaver}
					handlinger={
						kø.frittValgAvOppgave && bruker?.tilganger.reservering
							? (oppgave) => {
									return (
										<HStack gap="space-8">
											<Button
												variant="secondary"
												size="small"
												aria-label="Reserver og åpne oppgave"
												loading={venter && oppgaveSomReserveres === oppgave}
												disabled={venter}
												onClick={() => reserverOgÅpne(oppgave)}
											>
												Reserver og åpne
											</Button>
											<Button
												variant="secondary"
												size="small"
												aria-label="Reserver oppgave for en annen saksbehandler"
												disabled={venter}
												onClick={() => setValgtOppgave(oppgave)}
											>
												Reserver for en annen
											</Button>
										</HStack>
									);
								}
							: undefined
					}
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
			{valgtOppgave && <ReserverForAnnenModal oppgave={valgtOppgave} lukk={() => setValgtOppgave(undefined)} />}
		</VStack>
	);
};

export default NesteOppgaver;
