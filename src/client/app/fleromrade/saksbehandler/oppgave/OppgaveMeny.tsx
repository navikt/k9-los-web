import { ActionMenu, Button, InlineMessage } from '@navikt/ds-react';
import type { OppgaveSammendragDto } from 'api/generated/los.schemas';
import { useSaksbehandlereForReservasjon } from 'fleromrade/api/saksbehandlerQueries';
import { useState } from 'react';
import type { OppgaveMenyViewModel } from './oppgaveMenyViewModel';

const Saksbehandlermeny = ({ reserver, disabled }: { reserver: (navident: string) => void; disabled: boolean }) => {
	const { data: saksbehandlere, isPending, isError } = useSaksbehandlereForReservasjon();

	return (
		<ActionMenu.Group label="Saksbehandlere">
			{isPending && <ActionMenu.Item disabled>Henter saksbehandlere…</ActionMenu.Item>}
			{isError && (
				<InlineMessage status="error" role="alert">
					Kunne ikke hente saksbehandlere. Prøv igjen.
				</InlineMessage>
			)}
			{saksbehandlere?.length === 0 && <ActionMenu.Item disabled>Ingen saksbehandlere tilgjengelig</ActionMenu.Item>}
			{saksbehandlere
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
	);
};

const Menyinnhold = ({ oppgave, viewModel }: { oppgave: OppgaveSammendragDto; viewModel: OppgaveMenyViewModel }) => {
	const [visSaksbehandlere, setVisSaksbehandlere] = useState(false);

	if (viewModel.harHentetData === false) {
		return viewModel.feilmelding ? (
			<InlineMessage status="error" role="alert">
				{viewModel.feilmelding}
			</InlineMessage>
		) : (
			<ActionMenu.Item disabled>Henter oppgave…</ActionMenu.Item>
		);
	}

	const { knapper, reserverForAnnen } = viewModel;
	const handlinger = [
		{ knapp: knapper.åpneOppgave, tekst: 'Åpne oppgave' },
		{ knapp: knapper.reserverOgÅpne, tekst: 'Reserver og åpne oppgave' },
		{ knapp: knapper.overtaOgÅpne, tekst: 'Overta reservasjon og åpne oppgave' },
		{ knapp: knapper.leggTilbakeIKø, tekst: 'Legg tilbake i kø' },
	];

	return (
		<ActionMenu.Group
			label={`${oppgave.saksnummer ? 'Sak' : 'Journalpost-id'} ${oppgave.saksnummer || oppgave.journalpostId}`}
		>
			{handlinger
				.filter(({ knapp }) => knapp.vis)
				.map(({ knapp, tekst }) => (
					<ActionMenu.Item
						key={tekst}
						disabled={knapp.disabled}
						onSelect={(event) => {
							event.preventDefault();
							knapp.handling();
						}}
					>
						{tekst}
					</ActionMenu.Item>
				))}
			{knapper.reserverOgÅpne.vis && (
				<ActionMenu.Sub open={visSaksbehandlere} onOpenChange={setVisSaksbehandlere}>
					<ActionMenu.SubTrigger disabled={knapper.reserverOgÅpne.disabled}>
						Reserver for annen saksbehandler
					</ActionMenu.SubTrigger>
					<ActionMenu.SubContent>
						{visSaksbehandlere && (
							<Saksbehandlermeny reserver={reserverForAnnen} disabled={knapper.reserverOgÅpne.disabled} />
						)}
					</ActionMenu.SubContent>
				</ActionMenu.Sub>
			)}
		</ActionMenu.Group>
	);
};

const OppgaveMeny = ({
	oppgave,
	viewModel,
	åpen,
	onOpenChange,
}: {
	oppgave: OppgaveSammendragDto;
	viewModel: OppgaveMenyViewModel;
	åpen: boolean;
	onOpenChange: (åpen: boolean) => void;
}) => {
	return (
		<ActionMenu open={åpen} onOpenChange={onOpenChange}>
			<ActionMenu.Trigger>
				<Button
					variant="secondary"
					size="small"
					aria-label={`Reserver/åpne oppgave ${oppgave.saksnummer || oppgave.journalpostId}`}
					iconPosition="right"
				>
					Reserver
				</Button>
			</ActionMenu.Trigger>
			<ActionMenu.Content align="end">
				{åpen && <Menyinnhold oppgave={oppgave} viewModel={viewModel} />}
			</ActionMenu.Content>
		</ActionMenu>
	);
};

export default OppgaveMeny;
