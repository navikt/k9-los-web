import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button, HStack, InlineMessage } from '@navikt/ds-react';
import type { OppgaveSammendragDto } from 'api/generated/los.schemas';
import { useInnloggetBruker } from 'fleromrade/api/innloggetBrukerQueries';
import {
	useReserverOppgaveForSaksbehandler,
	useSaksbehandlereForReservasjon,
} from 'fleromrade/api/saksbehandlerQueries';
import { Fragment, useState } from 'react';
import { saksbehandlerEnhet } from './saksbehandlerEnhet';
import { useOppgaveHandlinger } from './useOppgaveHandlinger';

const Saksbehandlermeny = ({ reserver, disabled }: { reserver: (navident: string) => void; disabled: boolean }) => {
	const { data: saksbehandlere, isPending, isError } = useSaksbehandlereForReservasjon();
	const grupper = [...new Set(saksbehandlere?.map(({ enhet }) => saksbehandlerEnhet(enhet)))].sort();

	return (
		<>
			{isPending && <ActionMenu.Item disabled>Henter saksbehandlere…</ActionMenu.Item>}
			{isError && (
				<InlineMessage status="error" role="alert">
					Kunne ikke hente saksbehandlere. Prøv igjen.
				</InlineMessage>
			)}
			{saksbehandlere?.length === 0 && <ActionMenu.Item disabled>Ingen saksbehandlere tilgjengelig</ActionMenu.Item>}
			{grupper.map((enhet, indeks) => (
				<Fragment key={enhet}>
					{indeks > 0 && <ActionMenu.Divider />}
					<ActionMenu.Group label={enhet}>
						{saksbehandlere
							?.filter((saksbehandler) => saksbehandlerEnhet(saksbehandler.enhet) === enhet)
							?.toSorted((a, b) => a.navn.localeCompare(b.navn, 'nb'))
							.map(({ brukerIdent, navn }) => (
								<ActionMenu.Item
									key={brukerIdent}
									disabled={disabled}
									onSelect={(event) => {
										event.preventDefault();
										reserver(brukerIdent);
									}}
								>
									{navn} ({brukerIdent})
								</ActionMenu.Item>
							))}
					</ActionMenu.Group>
				</Fragment>
			))}
		</>
	);
};

const Menyinnhold = ({
	oppgave,
	kanReservere,
	venter,
	åpneOppgave,
	reserverForAnnen,
}: {
	oppgave: OppgaveSammendragDto;
	kanReservere: boolean;
	venter: boolean;
	åpneOppgave: () => void;
	reserverForAnnen: (navident: string) => void;
}) => {
	const [visSaksbehandlere, setVisSaksbehandlere] = useState(false);

	return (
		<ActionMenu.Group
			label={`${oppgave.saksnummer ? 'Sak' : 'Journalpost-id'} ${oppgave.saksnummer || oppgave.journalpostId}`}
		>
			<ActionMenu.Item
				disabled={venter}
				onSelect={(event) => {
					event.preventDefault();
					åpneOppgave();
				}}
			>
				Åpne oppgave
			</ActionMenu.Item>
			{kanReservere && (
				<ActionMenu.Sub open={visSaksbehandlere} onOpenChange={setVisSaksbehandlere}>
					<ActionMenu.SubTrigger disabled={venter}>Reserver for saksbehandler</ActionMenu.SubTrigger>
					<ActionMenu.SubContent>
						{visSaksbehandlere && <Saksbehandlermeny reserver={reserverForAnnen} disabled={venter} />}
					</ActionMenu.SubContent>
				</ActionMenu.Sub>
			)}
		</ActionMenu.Group>
	);
};

const OppgaveMeny = ({
	oppgave,
	visFeil,
}: {
	oppgave: OppgaveSammendragDto;
	visFeil: (melding: string | undefined) => void;
}) => {
	const [åpen, setÅpen] = useState(false);
	const { data: bruker } = useInnloggetBruker();
	const kanReservere = bruker?.tilganger.reservering === true;
	const visHandlingsfeil = (melding: string | undefined) => {
		visFeil(melding);
		if (melding) {
			setÅpen(false);
		}
	};
	const { åpneOppgave, reserverOgÅpne, åpner, reserverer } = useOppgaveHandlinger(oppgave, visHandlingsfeil);
	const { reserver: reserverForSaksbehandler, isPending: reservererForAnnen } = useReserverOppgaveForSaksbehandler();
	const venter = åpner || reserverer || reservererForAnnen;
	const reserverForAnnen = (navident: string) => {
		visFeil(undefined);
		reserverForSaksbehandler(oppgave.oppgaveNøkkel, navident, {
			onSuccess: () => setÅpen(false),
			onError: () => visHandlingsfeil('Kunne ikke reservere oppgaven for saksbehandleren. Prøv igjen.'),
		});
	};
	return (
		<HStack gap="space-12" align="center" justify="end" wrap={false}>
			{kanReservere && (
				<Button
					type="button"
					variant="secondary"
					size="small"
					aria-label={`Reserver oppgave ${oppgave.saksnummer || oppgave.journalpostId}`}
					loading={reserverer}
					disabled={venter}
					onClick={reserverOgÅpne}
				>
					Reserver
				</Button>
			)}
			<ActionMenu open={åpen} onOpenChange={setÅpen}>
				<ActionMenu.Trigger>
					<Button
						variant="secondary"
						size="small"
						aria-label={`Handlinger på oppgave ${oppgave.saksnummer || oppgave.journalpostId}`}
						icon={<MenuElipsisVerticalIcon aria-hidden />}
					/>
				</ActionMenu.Trigger>
				<ActionMenu.Content align="end">
					{åpen && (
						<Menyinnhold
							oppgave={oppgave}
							kanReservere={kanReservere}
							venter={venter}
							åpneOppgave={åpneOppgave}
							reserverForAnnen={reserverForAnnen}
						/>
					)}
				</ActionMenu.Content>
			</ActionMenu>
		</HStack>
	);
};

export default OppgaveMeny;
